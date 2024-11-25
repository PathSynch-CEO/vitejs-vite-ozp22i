import axios, { AxiosInstance } from 'axios';
import { BITLY_CONFIG } from '../config/bitly';

class BitlyError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'BitlyError';
  }
}

export class BitlyService {
  private client: AxiosInstance;

  constructor() {
    if (!BITLY_CONFIG.accessToken) {
      console.warn('Bitly access token not configured. URL shortening will be disabled.');
    }

    this.client = axios.create({
      baseURL: BITLY_CONFIG.apiUrl,
      headers: {
        'Authorization': `Bearer ${BITLY_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  async shortenUrl(longUrl: string): Promise<string> {
    // If no access token is configured, return the original URL
    if (!BITLY_CONFIG.accessToken) {
      return longUrl;
    }

    try {
      const formattedUrl = longUrl.startsWith('http') ? longUrl : `https://${longUrl}`;
      
      const response = await this.client.post('/shorten', {
        long_url: formattedUrl,
        domain: 'bit.ly'
      });
      
      if (!response.data?.link) {
        console.warn('No shortened URL in Bitly response, using original URL');
        return longUrl;
      }

      return response.data.link;
    } catch (error) {
      console.warn('Failed to shorten URL with Bitly, using original URL:', error);
      return longUrl;
    }
  }

  async expandUrl(shortUrl: string): Promise<string> {
    if (!BITLY_CONFIG.accessToken || !shortUrl.includes('bit.ly')) {
      return shortUrl;
    }

    try {
      const bitlink = shortUrl.replace('https://bit.ly/', '');
      
      const response = await this.client.post('/expand', {
        bitlink_id: `bit.ly/${bitlink}`
      });

      if (!response.data?.long_url) {
        console.warn('No expanded URL in Bitly response, using original URL');
        return shortUrl;
      }

      return response.data.long_url;
    } catch (error) {
      console.warn('Failed to expand URL with Bitly, using original URL:', error);
      return shortUrl;
    }
  }
}

export const bitlyService = new BitlyService();
export default bitlyService;