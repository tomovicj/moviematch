import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { env } from './lib/env';
import { errorHandler } from './middleware/error-handler';
import { startPopularMoviesJob } from './jobs/sync-popular-movies.job';
import friendshipRoutes from './routes/friendship.routes';
import userRoutes from './routes/users.routes';
import blockRoutes from './routes/block.routes';
import moviesRoutes from './routes/movies.routes';
import swipesRoutes from './routes/swipes.routes';
import partyRoutes from './routes/party.routes';

const app = express();
const allowedOrigins = env.CORS_ORIGIN?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const PORT = env.PORT;

app.use(
  cors({
    origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  }),
);

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());

app.use('/api/friendships', friendshipRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/swipes', swipesRoutes);
app.use('/api/parties', partyRoutes);

const publicDir = path.join(__dirname, 'public');
const indexFilePath = path.join(publicDir, 'index.html');

if (existsSync(indexFilePath)) {
  app.use(express.static(publicDir));

  app.get('/{*path}', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({
        error: {
          message: 'Route not found',
          status: 404,
        },
      });
      return;
    }

    res.sendFile(indexFilePath, (error) => {
      if (error) {
        next(error);
      }
    });
  });
} else {
  app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${PORT}`);

  // Start scheduled jobs
  startPopularMoviesJob();
});
