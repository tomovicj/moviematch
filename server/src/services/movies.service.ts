import { prisma } from '../lib/db';
import { NotFoundError } from '../lib/errors';

export const moviesService = {
  async getMovieById(movieId: string) {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    return movie;
  },

  async getMoviesByGenre(genreId: string) {
    const movies = await prisma.genre.findUnique({
      where: { id: genreId },
      select: {
        movies: true,
      },
    });

    if (!movies) {
      throw new NotFoundError('Genre not found');
    }

    return movies;
  },

  async getUserFeed(userId: string, limit: number = 20) {
    const feed = await prisma.movie.findMany({
      where: {
        isPopular: true,
        swipes: {
          none: {
            userId: userId,
          },
        },
      },
      take: limit,
      orderBy: {
        voteAverage: 'desc',
      },
      select: {
        id: true,
        title: true,
        releaseDate: true,
        overview: true,
        posterPath: true,
        genres: {
          select: {
            name: true,
          },
        },
        voteAverage: true,
        voteCount: true,
        adult: true,
      },
    });

    return feed;
  },
};
