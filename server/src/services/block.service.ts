import { prisma } from '../lib/db';
import { BadRequestError, ConflictError, NotFoundError } from '../lib/errors';
import { FriendshipStatus } from '@prisma/client';

export const blockService = {
  async blockUser(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) {
      throw new BadRequestError('You cannot block yourself');
    }

    const existing = await prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    });
    if (existing) {
      throw new ConflictError('User is already blocked');
    }

    // Remove any existing friendship between the two users
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { requesterId: blockerId, addresseeId: blockedId },
          { requesterId: blockedId, addresseeId: blockerId },
        ],
        status: { in: [FriendshipStatus.ACCEPTED, FriendshipStatus.PENDING] },
      },
    });

    return prisma.block.create({
      data: { blockerId, blockedId },
      include: { blocked: { select: { id: true, name: true, image: true } } },
    });
  },

  async unblockUser(blockerId: string, blockedId: string) {
    const block = await prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    });

    if (!block) {
      throw new NotFoundError('Block not found');
    }

    await prisma.block.delete({ where: { id: block.id } });
  },

  async getBlockedUsers(blockerId: string) {
    return prisma.block.findMany({
      where: { blockerId },
      include: { blocked: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async isBlocked(userId1: string, userId2: string) {
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userId1, blockedId: userId2 },
          { blockerId: userId2, blockedId: userId1 },
        ],
      },
    });
    return !!block;
  },
};
