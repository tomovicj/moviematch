import { Request, Response, NextFunction } from 'express';
import { friendshipService } from '../services/friendship.service';

export const friendshipController = {
  async sendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const friendship = await friendshipService.sendRequest(
        req.user.id,
        req.body.addresseeId as string,
      );
      res.status(201).json(friendship);
    } catch (err) {
      next(err);
    }
  },

  async acceptRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const friendship = await friendshipService.acceptRequest(
        req.params['id'] as string,
        req.user.id,
      );
      res.json(friendship);
    } catch (err) {
      next(err);
    }
  },

  async rejectRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const friendship = await friendshipService.rejectRequest(
        req.params['id'] as string,
        req.user.id,
      );
      res.json(friendship);
    } catch (err) {
      next(err);
    }
  },

  async cancelRequest(req: Request, res: Response, next: NextFunction) {
    try {
      await friendshipService.cancelRequest(
        req.params['id'] as string,
        req.user.id,
      );
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async removeFriend(req: Request, res: Response, next: NextFunction) {
    try {
      await friendshipService.removeFriend(
        req.user.id,
        req.params['friendId'] as string,
      );
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async getFriends(req: Request, res: Response, next: NextFunction) {
    try {
      const friends = await friendshipService.getFriends(req.user.id);
      res.json(friends);
    } catch (err) {
      next(err);
    }
  },

  async getPendingRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await friendshipService.getPendingRequests(req.user.id);
      res.json(requests);
    } catch (err) {
      next(err);
    }
  },

  async getSentRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await friendshipService.getSentRequests(req.user.id);
      res.json(requests);
    } catch (err) {
      next(err);
    }
  },

  async getFriendshipStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await friendshipService.getFriendshipStatus(
        req.user.id,
        req.params['userId'] as string,
      );
      res.json(status);
    } catch (err) {
      next(err);
    }
  },
};
