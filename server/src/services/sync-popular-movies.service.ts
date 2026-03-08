/* eslint-disable no-console */
import { prisma } from '../lib/db';
import {
  fetchPopularMovies,
  fetchGenreList,
  TmdbMovie,
  TmdbGenre,
} from '../lib/tmdb';

const PAGES_TO_FETCH = 5;

/**
 * Syncs genres from TMDB into the database.
 * Returns a Map of tmdbId -> internal genre id for linking movies to genres.
 */
async function syncGenres(
  tmdbGenres: TmdbGenre[],
): Promise<Map<number, string>> {
  const genreMap = new Map<number, string>();

  for (const genre of tmdbGenres) {
    const upserted = await prisma.genre.upsert({
      where: { tmdbId: genre.id },
      update: { name: genre.name },
      create: {
        tmdbId: genre.id,
        name: genre.name,
      },
    });
    genreMap.set(genre.id, upserted.id);
  }

  return genreMap;
}

/**
 * Upserts a single TMDB movie into the database.
 */
async function upsertMovie(
  movie: TmdbMovie,
  genreMap: Map<number, string>,
): Promise<void> {
  // Skip movies without a release date - can't parse a valid DateTime
  if (!movie.release_date) {
    return;
  }

  const genreIds = movie.genre_ids
    .map((tmdbGenreId) => genreMap.get(tmdbGenreId))
    .filter((id): id is string => id !== undefined);

  const movieData = {
    title: movie.title,
    overview: movie.overview,
    releaseDate: new Date(movie.release_date),
    adult: movie.adult,
    posterPath: movie.poster_path ?? '',
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    isPopular: true,
    lastSeenPopularAt: new Date(),
  };

  await prisma.movie.upsert({
    where: { tmdbId: movie.id },
    update: {
      ...movieData,
      genres: {
        set: genreIds.map((id) => ({ id })),
      },
    },
    create: {
      tmdbId: movie.id,
      ...movieData,
      genres: {
        connect: genreIds.map((id) => ({ id })),
      },
    },
  });
}

/**
 * Main sync function.
 * 1. Fetches the genre list from TMDB and upserts all genres.
 * 2. Fetches N pages of popular movies and upserts each movie.
 * 3. Marks movies no longer in the popular list as not popular.
 */
export async function syncPopularMovies(): Promise<void> {
  const startTime = Date.now();
  console.log('[sync] Starting popular movies sync...');

  try {
    // Step 1: Sync genres
    const tmdbGenres = await fetchGenreList();
    const genreMap = await syncGenres(tmdbGenres);
    console.log(`[sync] Synced ${tmdbGenres.length} genres`);

    // Step 2: Fetch and upsert popular movies
    const allMovies: TmdbMovie[] = [];

    for (let page = 1; page <= PAGES_TO_FETCH; page++) {
      const response = await fetchPopularMovies(page);
      allMovies.push(...response.results);
    }

    console.log(
      `[sync] Fetched ${allMovies.length} movies from ${PAGES_TO_FETCH} pages`,
    );

    for (const movie of allMovies) {
      await upsertMovie(movie, genreMap);
    }

    // Step 3: Mark stale movies as no longer popular.
    // Any movie that was previously popular but wasn't in this batch
    // should have isPopular set to false.
    const syncedTmdbIds = allMovies.map((m) => m.id);

    await prisma.movie.updateMany({
      where: {
        isPopular: true,
        tmdbId: { notIn: syncedTmdbIds },
      },
      data: {
        isPopular: false,
      },
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(
      `[sync] Popular movies sync completed in ${elapsed}s (${allMovies.length} movies)`,
    );
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(
      `[sync] Popular movies sync failed after ${elapsed}s:`,
      error,
    );
  }
}
