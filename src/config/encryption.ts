import { z } from 'zod';

const envSchema = z.object({
  VITE_ENCRYPTION_KEY: z.string().min(32),
  VITE_ENCRYPTION_IV: z.string().length(16),
});

// Validate environment variables
const env = envSchema.parse(import.meta.env);

export const ENCRYPTION_CONFIG = {
  key: env.VITE_ENCRYPTION_KEY,
  iv: env.VITE_ENCRYPTION_IV,
} as const;

// Prevent modification of config
Object.freeze(ENCRYPTION_CONFIG);