import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../lib/validate';
import { blockController } from '../controllers/block.controller';

const router = Router();

const userIdParamSchema = z.object({
  userId: z.string().min(1),
});

router.use(requireAuth);

// GET /api/blocks - list blocked users
router.get('/', blockController.getBlockedUsers);

// POST /api/blocks/:userId - block a user
router.post(
  '/:userId',
  validate(userIdParamSchema, 'params'),
  blockController.blockUser,
);

// DELETE /api/blocks/:userId - unblock a user
router.delete(
  '/:userId',
  validate(userIdParamSchema, 'params'),
  blockController.unblockUser,
);

export default router;
