import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { moviesController } from '../controllers/movies.controller';

const router = Router();

router.use(requireAuth);

// GET /api/movies/feed - Show current user's feed
router.get('/feed', moviesController.getFeed);

// GET /api/movies/:movieId - Show a specific movie
router.get('/:movieId', moviesController.getMovieById);

export default router;
