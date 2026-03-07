import { prisma } from '../lib/db';
import { SwipeType } from '@prisma/client';

export const swipesService = {
  getUserSwipes(userId: string) {
    const swipes = prisma.swipe.findMany({
      where: { userId },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            releaseDate: true,
            posterPath: true,
          },
        },
      },
    });
    return swipes;
  },

  getUserLikedSwipes(userId: string) {
    const swipes = prisma.swipe.findMany({
      where: { userId, type: SwipeType.LIKE },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            releaseDate: true,
            posterPath: true,
          },
        },
      },
    });
    return swipes;
  },

  getUserDislikedSwipes(userId: string) {
    const swipes = prisma.swipe.findMany({
      where: { userId, type: SwipeType.DISLIKE },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            releaseDate: true,
            posterPath: true,
          },
        },
      },
    });
    return swipes;
  },

  getUserWatchedSwipes(userId: string) {
    const swipes = prisma.swipe.findMany({
      where: { userId, type: SwipeType.WATCHED },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            releaseDate: true,
            posterPath: true,
          },
        },
      },
    });
    return swipes;
  },

  async createOrUpdateSwipe(userId: string, movieId: string, type: SwipeType) {
    const swipe = await prisma.swipe.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
      update: {
        type,
      },
      create: {
        userId,
        movieId,
        type,
      },
    });

    return swipe;
  },

  async deleteSwipe(userId: string, swipeId: string) {
    const swipe = await prisma.swipe.delete({
      where: {
        id: swipeId,
        userId,
      },
    });
    return swipe;
  },
};
