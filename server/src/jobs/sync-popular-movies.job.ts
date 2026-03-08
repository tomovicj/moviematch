/* eslint-disable no-console */
import cron from 'node-cron';
import { syncPopularMovies } from '../services/sync-popular-movies.service';

// Run daily at 3:00 AM UTC
const CRON_SCHEDULE = '0 3 * * *';

export function startPopularMoviesJob(): void {
  // Run immediately on startup to ensure the DB has data
  console.log('[cron] Running initial popular movies sync...');
  syncPopularMovies();

  // Schedule the recurring job
  cron.schedule(CRON_SCHEDULE, () => {
    console.log('[cron] Scheduled popular movies sync triggered');
    syncPopularMovies();
  });

  console.log(
    `[cron] Popular movies sync scheduled: ${CRON_SCHEDULE} (daily at 3:00 AM UTC)`,
  );
}
