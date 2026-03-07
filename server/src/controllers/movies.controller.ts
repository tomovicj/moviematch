import { Request, Response } from 'express';
import { moviesService } from '../services/movies.service';

export const moviesController = {
  async getMovieById(req: Request, res: Response) {
    const { movieId } = req.params;

    const movie = await moviesService.getMovieById(movieId as string);
    res.json(movie);
  },

  async getFeed(req: Request, res: Response) {
    const feed = await moviesService.getUserFeed(req.user.id);
    res.json(feed);
  },
};
