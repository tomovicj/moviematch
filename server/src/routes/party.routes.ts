import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../lib/validate';
import { partyController } from '../controllers/party.controller';

const router = Router();

const idParamSchema = z.object({
  id: z.string().min(1),
});

const createPartySchema = z.object({
  name: z.string().min(1, 'name is required'),
});

const userIdBodySchema = z.object({
  userId: z.string().min(1, 'userId is required'),
});

router.use(requireAuth);

// GET /api/parties/invitations - Get all invitations for the authenticated user
router.get('/invitations', partyController.getUserInvitations);

// POST /api/parties/invitations/:id/respond/accept - Accept a party invitation
router.post(
  '/invitations/:id/respond/accept',
  validate(idParamSchema, 'params'),
  partyController.acceptInvitation,
);

// POST /api/parties/invitations/:id/respond/decline - Decline a party invitation
router.post(
  '/invitations/:id/respond/decline',
  validate(idParamSchema, 'params'),
  partyController.declineInvitation,
);

// GET /api/parties - Get all parties for the authenticated user
router.get('/', partyController.getPartiesForUser);

// POST /api/parties - Create a new party
router.post('/', validate(createPartySchema), partyController.createParty);

// GET /api/parties/:id - Get party details by ID
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  partyController.getPartyById,
);

// DELETE /api/parties/:id - Delete a party (only host can delete)
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  partyController.deleteParty,
);

// GET /api/parties/:id/members - Get members of a party
router.get(
  '/:id/members',
  validate(idParamSchema, 'params'),
  partyController.getPartyMembers,
);

// POST /api/parties/:id/invite - Invite a user to the party (only host can invite)
router.post(
  '/:id/invite',
  validate(idParamSchema, 'params'),
  validate(userIdBodySchema),
  partyController.inviteUser,
);

// POST /api/parties/:id/kick - Kick a user from the party (only host can kick)
router.post(
  '/:id/kick',
  validate(idParamSchema, 'params'),
  validate(userIdBodySchema),
  partyController.kickUser,
);

// DELETE /api/parties/:id/leave - Leave a party
router.delete(
  '/:id/leave',
  validate(idParamSchema, 'params'),
  partyController.leaveParty,
);

export default router;
