import { Request, Response, NextFunction } from 'express';
import { blockService } from '../services/block.service';

export const blockController = {
  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const block = await blockService.blockUser(
        req.user.id,
        req.params['userId'] as string,
      );
      res.status(201).json(block);
    } catch (err) {
      next(err);
    }
  },

  async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      await blockService.unblockUser(
        req.user.id,
        req.params['userId'] as string,
      );
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async getBlockedUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const blocks = await blockService.getBlockedUsers(req.user.id);
      res.json(blocks);
    } catch (err) {
      next(err);
    }
  },
};
