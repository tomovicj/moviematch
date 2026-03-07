import { Request, Response, NextFunction } from 'express';
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

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      status: 500,
    },
  });
}
