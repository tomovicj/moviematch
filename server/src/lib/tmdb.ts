import { env } from './env';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  adult: boolean;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface TmdbPopularResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbGenreListResponse {
  genres: TmdbGenre[];
}

async function tmdbFetch<T>(path: string): Promise<T> {
  const url = `${TMDB_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.TMDB_API_KEY}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(
      `TMDB API error: ${res.status} ${res.statusText} for ${path}`,
    );
  }

  return res.json() as Promise<T>;
}

export async function fetchPopularMovies(
  page: number = 1,
): Promise<TmdbPopularResponse> {
  return tmdbFetch<TmdbPopularResponse>(`/movie/popular?page=${page}`);
}

export async function fetchGenreList(): Promise<TmdbGenre[]> {
  const data = await tmdbFetch<TmdbGenreListResponse>('/genre/movie/list');
  return data.genres;
}
