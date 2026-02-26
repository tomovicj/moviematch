import { prisma } from '../lib/db';
import { FriendshipStatus } from '@prisma/client';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../lib/errors';

export const friendshipService = {
  async sendRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) {
      throw new BadRequestError('You cannot send a friend request to yourself');
    }

    // Check if either user has blocked the other
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: requesterId, blockedId: addresseeId },
          { blockerId: addresseeId, blockedId: requesterId },
        ],
      },
    });
    if (block) {
      throw new ForbiddenError('Unable to send friend request');
    }

    // Check for any existing friendship record in either direction
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId },
        ],
      },
    });

    if (existing) {
      if (existing.status === FriendshipStatus.ACCEPTED) {
        throw new ConflictError('You are already friends with this user');
      }
      if (existing.status === FriendshipStatus.PENDING) {
        throw new ConflictError(
          'A friend request already exists between you and this user',
        );
      }
      if (existing.status === FriendshipStatus.REJECTED) {
        // Allow re-sending after a rejection — update the existing record
        return prisma.friendship.update({
          where: { id: existing.id },
          data: {
            requesterId,
            addresseeId,
            status: FriendshipStatus.PENDING,
          },
          include: {
            requester: { select: { id: true, name: true, image: true } },
            addressee: { select: { id: true, name: true, image: true } },
          },
        });
      }
    }

    return prisma.friendship.create({
      data: { requesterId, addresseeId },
      include: {
        requester: { select: { id: true, name: true, image: true } },
        addressee: { select: { id: true, name: true, image: true } },
      },
    });
  },

  async acceptRequest(friendshipId: string, userId: string) {
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundError('Friend request not found');
    }
    if (friendship.addresseeId !== userId) {
      throw new ForbiddenError(
        'Only the recipient can accept a friend request',
      );
    }
    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new BadRequestError('This friend request is no longer pending');
    }

    return prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.ACCEPTED },
      include: {
        requester: { select: { id: true, name: true, image: true } },
        addressee: { select: { id: true, name: true, image: true } },
      },
    });
  },

  async rejectRequest(friendshipId: string, userId: string) {
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundError('Friend request not found');
    }
    if (friendship.addresseeId !== userId) {
      throw new ForbiddenError(
        'Only the recipient can reject a friend request',
      );
    }
    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new BadRequestError('This friend request is no longer pending');
    }

    return prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.REJECTED },
      include: {
        requester: { select: { id: true, name: true, image: true } },
        addressee: { select: { id: true, name: true, image: true } },
      },
    });
  },

  async removeFriend(userId: string, friendId: string) {
    const friendship = await prisma.friendship.findFirst({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [
          { requesterId: userId, addresseeId: friendId },
          { requesterId: friendId, addresseeId: userId },
        ],
      },
    });

    if (!friendship) {
      throw new NotFoundError('Friendship not found');
    }

    await prisma.friendship.delete({ where: { id: friendship.id } });
  },

  async getFriends(userId: string) {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: { select: { id: true, name: true, image: true } },
        addressee: { select: { id: true, name: true, image: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Return the "other" user in each friendship
    return friendships.map((f) => ({
      friendshipId: f.id,
      since: f.updatedAt,
      friend: f.requesterId === userId ? f.addressee : f.requester,
    }));
  },

  async getPendingRequests(userId: string) {
    return prisma.friendship.findMany({
      where: { addresseeId: userId, status: FriendshipStatus.PENDING },
      include: { requester: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getSentRequests(userId: string) {
    return prisma.friendship.findMany({
      where: { requesterId: userId, status: FriendshipStatus.PENDING },
      include: { addressee: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getFriendshipStatus(userId: string, otherUserId: string) {
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: otherUserId },
          { requesterId: otherUserId, addresseeId: userId },
        ],
      },
    });

    if (!friendship) return { status: 'NONE' as const };

    return {
      status: friendship.status,
      friendshipId: friendship.id,
      isRequester: friendship.requesterId === userId,
    };
  },
};
