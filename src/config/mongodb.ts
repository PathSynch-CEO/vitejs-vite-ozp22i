import { z } from 'zod';

const envSchema = z.object({
  VITE_MONGODB_URI: z.string().min(1).default('mongodb+srv://pathconnect11_24:Kzhytw2wJ4VEgo2P@pathconnect1.vwhgk.mongodb.net/pathconnectdn?retryWrites=true&w=majority'),
  VITE_MONGODB_DB_NAME: z.string().min(1).default('pathconnectdn'),
});

// Validate environment variables
const env = envSchema.parse(import.meta.env);

export const MONGODB_CONFIG = {
  uri: env.VITE_MONGODB_URI,
  dbName: env.VITE_MONGODB_DB_NAME,
  collections: {
    locations: 'locations',
    nfcCards: 'nfc_cards',
    reviews: 'reviews',
    customers: 'customers',
  },
} as const;

// Prevent modification of config
Object.freeze(MONGODB_CONFIG);