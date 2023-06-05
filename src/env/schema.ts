import { z } from "zod";

export const serverScheme = z.object({
  REGION: z.string().default('us-east-1'),
  USER_POOL_ID: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_NAME: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string(),
  CLIENT_ADDR: z.string(),
  CLIENT_ID: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_ACCESS_KEY_SECRET: z.string()
});

export const clientScheme = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
});
