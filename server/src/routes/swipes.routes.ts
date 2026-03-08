import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { swipesController } from '../controllers/swipes.controller';
import z from 'zod';
import { validate } from '../lib/validate';
import { SwipeType } from '@prisma/client';

const router = Router();

const swipeIdParamSchema = z.object({
  swipeId: z.string().min(1),
});

const swipeParamSchema = z.object({
  movieId: z.string().min(1),
  type: z.enum(SwipeType),
});

router.use(requireAuth);

// GET /api/swipes - Get all swipes for the current user
router.get('/', swipesController.getSwipes);

// GET /api/swipes/liked - Get all liked swipes for the current user
router.get('/liked', swipesController.getLikedSwipes);

// GET /api/swipes/disliked - Get all disliked swipes for the current user
router.get('/disliked', swipesController.getDislikedSwipes);

// GET /api/swipes/watched - Get all watched swipes for the current user
router.get('/watched', swipesController.getWatchedSwipes);

// POST /api/swipes - Create or update a swipe
router.post(
  '/',
  validate(swipeParamSchema),
  swipesController.createOrUpdateSwipe,
);

// DELETE /api/swipes/:swipeId - Delete a swipe
router.delete(
  '/:swipeId',
  validate(swipeIdParamSchema, 'params'),
  swipesController.deleteSwipe,
);

export default router;
