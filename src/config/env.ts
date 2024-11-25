import { z } from 'zod';

const envSchema = z.object({
  VITE_GOOGLE_API_KEY: z.string().optional().default(''),
  VITE_GMB_LOCATION_ID: z.string().optional().default(''),
  VITE_BITLY_ACCESS_TOKEN: z.string().optional().default(''),
  VITE_ENCRYPTION_KEY: z.string().optional().default('default32charencryptionkeyplaceholder'),
  VITE_ENCRYPTION_IV: z.string().optional().default('default16chariv12'),
});

// Validate environment variables
const validateEnv = () => {
  try {
    const env = envSchema.parse(import.meta.env);
    
    // Log warning if required keys are missing
    if (!env.VITE_GOOGLE_API_KEY) {
      console.warn('Google API key not configured. Some features may be limited.');
    }
    if (!env.VITE_GMB_LOCATION_ID) {
      console.warn('Google My Business Location ID not configured. Some features may be limited.');
    }
    if (!env.VITE_BITLY_ACCESS_TOKEN) {
      console.warn('Bitly access token not configured. Using full URLs instead of shortened ones.');
    }

    return env;
  } catch (error) {
    console.error('Environment validation error:', error);
    return envSchema.parse({});
  }
};

export const ENV = validateEnv();