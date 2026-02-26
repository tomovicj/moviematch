import { prisma } from '../lib/db';
import { NotFoundError } from '../lib/errors';

export const usersService = {
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  async searchUsers(query: string, excludeUserId: string) {
    return prisma.user.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
        id: { not: excludeUserId },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      orderBy: { name: 'asc' },
      take: 20,
    });
  },

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await prisma.user.delete({ where: { id: userId } });
  },
};
