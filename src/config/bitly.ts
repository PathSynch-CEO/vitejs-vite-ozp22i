import { z } from 'zod';
import { ENV } from './env';

const BITLY_CONFIG = {
  accessToken: ENV.VITE_BITLY_ACCESS_TOKEN,
  apiUrl: 'https://api-ssl.bitly.com/v4',
} as const;

Object.freeze(BITLY_CONFIG);

export { BITLY_CONFIG };