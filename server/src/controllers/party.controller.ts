import { Request, Response } from 'express';
import { partyService } from '../services/party.service';

export const partyController = {
  getPartiesForUser: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const parties = await partyService.getPartiesForUser(userId);
    res.json(parties);
  },

  getPartyById: async (req: Request, res: Response) => {
    const partyId = req.params.id;
    const party = await partyService.getPartyById(partyId as string);
    res.json(party);
  },

  createParty: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { name }: { name: string } = req.body;
    const party = await partyService.createParty(userId, name);
    res.status(201).json(party);
  },

  deleteParty: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const partyId = req.params.id as string;
    await partyService.deleteParty(partyId, userId);
    res.status(204).send();
  },

  inviteUser: async (req: Request, res: Response) => {
    const hostUserId = req.user.id;
    const partyId = req.params.id as string;
    const { userId }: { userId: string } = req.body;
    await partyService.inviteUserToParty(partyId, hostUserId, userId);
    res.status(200).json({ message: 'User invited successfully' });
  },

  kickUser: async (req: Request, res: Response) => {
    const hostUserId = req.user.id;
    const partyId = req.params.id as string;
    const { userId }: { userId: string } = req.body;
    await partyService.kickUserFromParty(partyId, hostUserId, userId);
    res.status(200).json({ message: 'User kicked successfully' });
  },

  acceptInvitation: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const invitationId = req.params.id as string;
    await partyService.respondToPartyInvitation(invitationId, userId, true);
    res.status(200).json({ message: 'Invitation accepted successfully' });
  },

  declineInvitation: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const invitationId = req.params.id as string;
    await partyService.respondToPartyInvitation(invitationId, userId, false);
    res.status(200).json({ message: 'Invitation declined successfully' });
  },

  getUserInvitations: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const invitations = await partyService.getUserInvitations(userId);
    res.json(invitations);
  },

  leaveParty: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const partyId = req.params.id as string;
    await partyService.leaveParty(partyId, userId);
    res.status(200).json({ message: 'Left the party successfully' });
  },

  getPartyMembers: async (req: Request, res: Response) => {
    const partyId = req.params.id as string;
    const members = await partyService.getPartyMembers(partyId);
    res.json(members);
  },
};
