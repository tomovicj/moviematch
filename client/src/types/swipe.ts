/** Mirrors the server-side Prisma SwipeType enum. */
export type SwipeType = 'LIKE' | 'DISLIKE' | 'WATCHED';

/**
 * Minimal movie stub embedded in swipe list responses.
 */
export interface SwipeMovie {
  id: string;
  title: string;
  releaseDate: string;
  posterPath: string | null;
}

/**
 * A single item from GET /api/swipes (and /liked, /disliked, /watched).
 */
export interface SwipeWithMovie {
  id: string;
  userId: string;
  movieId: string;
  type: SwipeType;
  createdAt: string;
  updatedAt: string;
  movie: SwipeMovie;
}

/**
 * Full swipe record returned from POST /api/swipes and DELETE /api/swipes/:swipeId.
 * Does not include the embedded movie.
 */
export interface Swipe {
  id: string;
  userId: string;
  movieId: string;
  type: SwipeType;
  createdAt: string;
  updatedAt: string;
}
