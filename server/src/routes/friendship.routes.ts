import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../lib/validate';
import { friendshipController } from '../controllers/friendship.controller';

const router = Router();

const sendRequestSchema = z.object({
  addresseeId: z.string().min(1, 'addresseeId is required'),
});

const idParamSchema = z.object({
  id: z.string().min(1),
});

const friendIdParamSchema = z.object({
  friendId: z.string().min(1),
});

const userIdParamSchema = z.object({
  userId: z.string().min(1),
});

router.use(requireAuth);

// GET /api/friendships - list accepted friends
router.get('/', friendshipController.getFriends);

// GET /api/friendships/requests/pending - list pending received requests
router.get('/requests/pending', friendshipController.getPendingRequests);

// GET /api/friendships/requests/sent - list sent requests
router.get('/requests/sent', friendshipController.getSentRequests);

// GET /api/friendships/status/:userId - check friendship status with a user
router.get(
  '/status/:userId',
  validate(userIdParamSchema, 'params'),
  friendshipController.getFriendshipStatus,
);

// POST /api/friendships/request - send a friend request
router.post(
  '/request',
  validate(sendRequestSchema),
  friendshipController.sendRequest,
);

// POST /api/friendships/:id/accept - accept a pending request
router.post(
  '/:id/accept',
  validate(idParamSchema, 'params'),
  friendshipController.acceptRequest,
);

// POST /api/friendships/:id/reject - reject a pending request
router.post(
  '/:id/reject',
  validate(idParamSchema, 'params'),
  friendshipController.rejectRequest,
);

// DELETE /api/friendships/:friendId - remove a friend
router.delete(
  '/:friendId',
  validate(friendIdParamSchema, 'params'),
  friendshipController.removeFriend,
);

export default router;
