import { Request, Response, NextFunction } from 'express';
import { usersService } from '../services/users.service';

export const usersController = {
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.getUserById(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.getUserById(req.params.userId as string);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res
          .status(400)
          .json({ error: "Query parameter 'q' is required" });
      }
      const users = await usersService.searchUsers(query, req.user.id);
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async searchUsersForFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = req.query.q as string;
      const users = await usersService.searchUsersForFriendRequest(
        query,
        req.user.id,
      );
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await usersService.deleteUser(req.user.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
