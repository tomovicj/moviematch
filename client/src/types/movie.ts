/** A genre tag embedded in movie objects. */
export interface Genre {
  name: string;
}

/**
 * Movie shape returned from GET /api/movies/feed.
 * Excludes internal DB fields (tmdbId, isPopular, lastSeenPopularAt).
 */
export interface FeedMovie {
  id: string;
  title: string;
  overview: string;
  releaseDate: string;
  posterPath: string | null;
  voteAverage: number;
  voteCount: number;
  adult: boolean;
  genres: Genre[];
}

/**
 * Full movie record returned from GET /api/movies/:movieId.
 * Matches the Prisma Movie model as serialised over JSON.
 */
export interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  overview: string;
  releaseDate: string;
  posterPath: string | null;
  voteAverage: number;
  voteCount: number;
  adult: boolean;
  isPopular: boolean;
  lastSeenPopularAt: string | null;
  createdAt: string;
  updatedAt: string;
}
