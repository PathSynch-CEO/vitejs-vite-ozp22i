import { z } from 'zod';

const envSchema = z.object({
  VITE_SAMBANOVA_API_KEY: z.string().optional().default('b8228774-8832-4371-a6cd-cbd6bc090c14'),
  VITE_SAMBANOVA_BASE_URL: z.string().url().optional().default('https://api.sambanova.ai'),
});

// Validate environment variables with fallbacks
const env = envSchema.parse(import.meta.env);

export const SAMBANOVA_CONFIG = {
  apiKey: env.VITE_SAMBANOVA_API_KEY,
  baseUrl: env.VITE_SAMBANOVA_BASE_URL,
  endpoints: {
    sentiment: '/v1/sentiment',
    analysis: '/v1/analyze',
    feedback: '/v1/feedback',
  },
} as const;

// Prevent modification of config
Object.freeze(SAMBANOVA_CONFIG);