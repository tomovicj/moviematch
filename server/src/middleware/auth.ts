import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';
import { UnauthorizedError } from '../lib/errors';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image?: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as HeadersInit,
    });

    if (!session?.user) {
      return next(new UnauthorizedError('You must be logged in'));
    }

    req.user = session.user;
    next();
  } catch {
    next(new UnauthorizedError('You must be logged in'));
  }
}
