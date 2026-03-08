import 'dotenv/config';
import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    BETTER_AUTH_URL: z
      .url('BETTER_AUTH_URL must be a valid URL')
      .default('http://localhost:3000'),
    BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
    CORS_ORIGIN: z.string().optional(),
    TMDB_API_KEY: z.string().min(1, 'TMDB_API_KEY is required'),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.GOOGLE_CLIENT_ID && !value.GOOGLE_CLIENT_SECRET) {
      ctx.addIssue({
        code: 'custom',
        message:
          'GOOGLE_CLIENT_SECRET is required when GOOGLE_CLIENT_ID is set',
        path: ['GOOGLE_CLIENT_SECRET'],
      });
    }

    if (value.GOOGLE_CLIENT_SECRET && !value.GOOGLE_CLIENT_ID) {
      ctx.addIssue({
        code: 'custom',
        message:
          'GOOGLE_CLIENT_ID is required when GOOGLE_CLIENT_SECRET is set',
        path: ['GOOGLE_CLIENT_ID'],
      });
    }
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const message = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment variables: ${message}`);
}

export const env = parsedEnv.data;
