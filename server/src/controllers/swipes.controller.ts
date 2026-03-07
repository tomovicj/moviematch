import { Request, Response } from 'express';
import { swipesService } from '../services/swipes.service';
import { SwipeType } from '@prisma/client';

export const swipesController = {
  getSwipes: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const swipes = await swipesService.getUserSwipes(userId);
    res.json(swipes);
  },

  getLikedSwipes: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const swipes = await swipesService.getUserLikedSwipes(userId);
    res.json(swipes);
  },

  getDislikedSwipes: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const swipes = await swipesService.getUserDislikedSwipes(userId);
    res.json(swipes);
  },

  getWatchedSwipes: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const swipes = await swipesService.getUserWatchedSwipes(userId);
    res.json(swipes);
  },

  createOrUpdateSwipe: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { movieId, type }: { movieId: string; type: SwipeType } = req.body;
    const swipe = await swipesService.createOrUpdateSwipe(
      userId,
      movieId,
      type,
    );
    res.status(201).json(swipe);
  },

  deleteSwipe: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { swipeId } = req.params;
    await swipesService.deleteSwipe(userId, swipeId as string);
    res.status(204).send();
  },
};
