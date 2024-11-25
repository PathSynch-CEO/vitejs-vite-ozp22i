import axios, { AxiosInstance } from 'axios';
import { SAMBANOVA_CONFIG } from '../config/sambanova';

export interface SentimentAnalysis {
  score: number;
  magnitude: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface TextAnalysis {
  entities: Array<{
    name: string;
    type: string;
    sentiment: number;
  }>;
  keywords: string[];
  summary: string;
}

class SambanovaService {
  private client: AxiosInstance;
  private retryCount = 3;
  private retryDelay = 1000;

  constructor() {
    this.client = axios.create({
      baseURL: SAMBANOVA_CONFIG.baseUrl,
      headers: {
        'Authorization': `Bearer ${SAMBANOVA_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        // Remove sensitive data from logging
        const sanitizedConfig = { ...config };
        if (sanitizedConfig.headers?.Authorization) {
          sanitizedConfig.headers.Authorization = '[REDACTED]';
        }
        console.debug('API Request:', sanitizedConfig);
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.debug('API Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
        });
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Implement retry logic for network errors or 5xx responses
        if (
          (error.response?.status >= 500 || error.code === 'ECONNABORTED') &&
          originalRequest._retry < this.retryCount
        ) {
          originalRequest._retry = (originalRequest._retry || 0) + 1;
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          return this.client(originalRequest);
        }

        // Handle specific error cases
        if (error.response?.status === 401) {
          console.error('Authentication failed with SambaNova API');
        } else if (error.response?.status === 429) {
          console.error('Rate limit exceeded');
        }

        return Promise.reject(error);
      }
    );
  }

  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await this.client.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    return this.makeRequest<SentimentAnalysis>(SAMBANOVA_CONFIG.endpoints.sentiment, { text });
  }

  async analyzeText(text: string): Promise<TextAnalysis> {
    return this.makeRequest<TextAnalysis>(SAMBANOVA_CONFIG.endpoints.analysis, { text });
  }

  async processReviewFeedback(review: string): Promise<{
    sentiment: SentimentAnalysis;
    analysis: TextAnalysis;
  }> {
    try {
      const [sentiment, analysis] = await Promise.all([
        this.analyzeSentiment(review),
        this.analyzeText(review),
      ]);

      return {
        sentiment,
        analysis,
      };
    } catch (error) {
      console.error('Error processing review feedback:', error);
      throw new Error('Failed to process review feedback');
    }
  }
}

// Export singleton instance
export const sambanovaService = new SambanovaService();

export default sambanovaService;