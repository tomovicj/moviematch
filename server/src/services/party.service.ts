import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { prisma } from '../lib/db';
import { ConflictError, ForbiddenError, NotFoundError } from '../lib/errors';
import { PartyInvitationStatus } from '@prisma/client';

export const partyService = {
  async getPartyById(partyId: string) {
    const party = await prisma.party.findUnique({
      where: { id: partyId },
    });

    if (!party) {
      throw new NotFoundError('Party not found');
    }

    return party;
  },

  async getPartiesForUser(userId: string) {
    const parties = await prisma.party.findMany({
      where: {
        OR: [
          { hostId: userId },
          {
            invitations: {
              some: {
                inviteeId: userId,
                status: PartyInvitationStatus.ACCEPTED,
              },
            },
          },
        ],
      },
    });

    return parties;
  },

  async createParty(hostUserId: string, name: string) {
    const party = await prisma.party.create({
      data: {
        hostId: hostUserId,
        name,
      },
    });

    return party;
  },

  async deleteParty(partyId: string, hostUserId: string) {
    const party = await prisma.party.findUnique({
      where: { id: partyId },
    });

    if (!party) {
      throw new NotFoundError('Party not found');
    }

    if (party.hostId !== hostUserId) {
      throw new ForbiddenError('Only the host can delete the party');
    }

    await prisma.party.delete({
      where: { id: partyId },
    });

    return party;
  },

  async getPartyInvitations(partyId: string) {
    const invitations = await prisma.partyInvitation.findMany({
      where: { partyId },
      include: {
        invitee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return invitations;
  },

  async inviteUserToParty(partyId: string, hostUserId: string, userId: string) {
    const party = await prisma.party.findUnique({
      where: { id: partyId },
    });

    if (!party) {
      throw new NotFoundError('Party not found');
    }

    if (party.hostId !== hostUserId) {
      throw new ForbiddenError('Only the host can invite users to the party');
    }

    try {
      const invitation = await prisma.partyInvitation.create({
        data: {
          partyId,
          inviteeId: userId,
        },
      });

      return invitation;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError('User is already invited to this party');
      }
      throw error;
    }
  },

  async respondToPartyInvitation(
    invitationId: string,
    userId: string,
    accept: boolean,
  ) {
    const invitation = await prisma.partyInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    if (invitation.inviteeId !== userId) {
      throw new ForbiddenError(
        'Only the invitee can respond to the party invitation',
      );
    }

    const updatedInvitation = await prisma.partyInvitation.update({
      where: { id: invitationId },
      data: {
        status: accept
          ? PartyInvitationStatus.ACCEPTED
          : PartyInvitationStatus.REJECTED,
      },
    });

    return updatedInvitation;
  },

  getUserInvitations: async (userId: string) => {
    const invitations = await prisma.partyInvitation.findMany({
      where: { inviteeId: userId },
    });

    return invitations;
  },

  kickUserFromParty: async (
    partyId: string,
    hostUserId: string,
    userId: string,
  ) => {
    const party = await prisma.party.findUnique({
      where: { id: partyId },
    });

    if (!party) {
      throw new NotFoundError('Party not found');
    }

    if (party.hostId !== hostUserId) {
      throw new ForbiddenError('Only the host can kick users from the party');
    }

    await prisma.partyInvitation.deleteMany({
      where: {
        partyId,
        inviteeId: userId,
      },
    });
  },

  getPartyMembers: async (partyId: string) => {
    const party = await prisma.party.findUnique({
      where: { id: partyId },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!party) {
      throw new NotFoundError('Party not found');
    }

    const members = await prisma.partyInvitation.findMany({
      where: {
        partyId,
        status: PartyInvitationStatus.ACCEPTED,
      },
      include: {
        invitee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return [
      { ...party.host, isHost: true },
      ...members.map((inv) => ({ ...inv.invitee, isHost: false })),
    ];
  },

  leaveParty: async (partyId: string, userId: string) => {
    const party = await prisma.party.findUnique({
      where: { id: partyId },
    });

    if (!party) {
      throw new NotFoundError('Party not found');
    }

    if (party.hostId === userId) {
      throw new ForbiddenError('Host cannot leave the party');
    }

    await prisma.partyInvitation.deleteMany({
      where: {
        partyId,
        inviteeId: userId,
      },
    });
  },

  getMatches: async (partyId: string) => {
    const members = await partyService.getPartyMembers(partyId);
    const memberIds = members.map((m) => m.id);

    if (memberIds.length === 0) {
      return [];
    }

    const matchedMovieIds = await prisma.swipe.groupBy({
      by: ['movieId'],
      where: {
        userId: { in: memberIds },
        type: 'LIKE',
      },
      having: {
        userId: { _count: { equals: memberIds.length } },
      },
    });

    if (matchedMovieIds.length === 0) {
      return [];
    }

    const movies = await prisma.movie.findMany({
      where: {
        id: { in: matchedMovieIds.map((m) => m.movieId) },
      },
    });

    return movies;
  },
};
