import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { usersController } from '../controllers/users.controller';
import z from 'zod';
import { validate } from '../lib/validate';

const router = Router();

const userIdParamSchema = z.object({
  userId: z.string().min(1),
});

const searchQuerySchema = z.object({
  q: z.string().min(1),
});

router.use(requireAuth);

// GET /api/users/me - Show current user's profile
router.get('/me', usersController.getCurrentUser);

// GET /api/users/search?q= - Search users by name
router.get(
  '/search',
  validate(searchQuerySchema, 'query'),
  usersController.searchUsers,
);

// GET /api/users/search/friends?q= - Search users eligible for a friend request
// (excludes blocked users and users with an existing ACCEPTED or PENDING friendship)
router.get(
  '/search/friends',
  validate(searchQuerySchema, 'query'),
  usersController.searchUsersForFriendRequest,
);

// DELETE /api/users/me - Delete user account
router.delete('/me', usersController.deleteUser);

// GET /api/users/:userId - Show another user's profile
router.get(
  '/:userId',
  validate(userIdParamSchema, 'params'),
  usersController.getUserById,
);

export default router;
