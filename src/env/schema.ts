import { z } from "zod";

export const serverScheme = z.object({
  REGION: z.string().default('us-east-1'),
  USER_POOL_ID: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_NAME: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string(),
});

export const clientScheme = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
});
