import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { AppError } from '../lib/errors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        status: err.statusCode,
      },
    });
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.['target'])
        ? (err.meta?.['target'] as string[]).join(', ')
        : 'resource';
      res.status(409).json({
        error: {
          message: `Unique constraint failed: ${target}`,
          status: 409,
        },
      });
      return;
    }

    if (err.code === 'P2003') {
      res.status(400).json({
        error: {
          message: 'Invalid relation reference',
          status: 400,
        },
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        error: {
          message: 'Resource not found',
          status: 404,
        },
      });
      return;
    }
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      status: 500,
    },
  });
}
