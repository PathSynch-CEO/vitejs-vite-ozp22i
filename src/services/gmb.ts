import axios from 'axios';
import { storageService } from '../utils/storage';
import { ENV } from '../config/env';

interface GMBMetrics {
  date: string;
  totalReviews: number;
  averageRating: number;
}

class GoogleMyBusinessService {
  private readonly API_KEY = ENV.VITE_GOOGLE_API_KEY;

  private async fetchReviewsFromGMB(gmbUrl: string): Promise<any> {
    try {
      const response = await axios.get(gmbUrl, {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching GMB reviews:', error);
      throw error;
    }
  }

  async fetchMetrics(): Promise<GMBMetrics> {
    try {
      const businessSettings = storageService.getBusinessSettings();
      if (!businessSettings.gmbReviewLink) {
        throw new Error('Google My Business review link not configured');
      }

      if (!this.API_KEY) {
        return this.getMockData();
      }

      const data = await this.fetchReviewsFromGMB(businessSettings.gmbReviewLink);
      
      const metrics: GMBMetrics = {
        date: new Date().toISOString().split('T')[0],
        totalReviews: data.totalReviews || 0,
        averageRating: data.averageRating || 0,
      };

      this.storeMetrics(metrics);
      return metrics;
    } catch (error) {
      console.error('Failed to fetch GMB metrics:', error);
      return this.getLatestMetrics();
    }
  }

  private getMockData(): GMBMetrics {
    return {
      date: new Date().toISOString().split('T')[0],
      totalReviews: 0,
      averageRating: 0,
    };
  }

  private storeMetrics(metrics: GMBMetrics): void {
    try {
      const stored = storageService.getGMBMetrics();
      const newMetrics = [...stored, metrics].slice(-90); // Keep last 90 days
      storageService.saveGMBMetrics(newMetrics);
    } catch (error) {
      console.error('Failed to store metrics:', error);
    }
  }

  getLatestMetrics(): GMBMetrics {
    try {
      const stored = storageService.getGMBMetrics();
      return stored[stored.length - 1] || this.getMockData();
    } catch (error) {
      console.error('Failed to get latest metrics:', error);
      return this.getMockData();
    }
  }

  calculateChange(): { reviewChange: string; ratingChange: string } {
    try {
      const stored = storageService.getGMBMetrics();
      if (stored.length < 2) {
        return { reviewChange: '0%', ratingChange: '0' };
      }

      const latest = stored[stored.length - 1];
      const previous = stored[stored.length - 2];

      const reviewChange = previous.totalReviews === 0 ? 0 :
        ((latest.totalReviews - previous.totalReviews) / previous.totalReviews * 100);
      
      const ratingChange = latest.averageRating - previous.averageRating;

      return {
        reviewChange: `${reviewChange.toFixed(1)}%`,
        ratingChange: ratingChange.toFixed(1),
      };
    } catch (error) {
      console.error('Failed to calculate changes:', error);
      return { reviewChange: '0%', ratingChange: '0' };
    }
  }

  async fetchReviews() {
    try {
      const businessSettings = storageService.getBusinessSettings();
      if (!businessSettings.gmbReviewLink) {
        throw new Error('Google My Business review link not configured');
      }

      if (!this.API_KEY) {
        return [];
      }

      const data = await this.fetchReviewsFromGMB(businessSettings.gmbReviewLink);
      return data.reviews || [];
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      return [];
    }
  }
}

export const gmbService = new GoogleMyBusinessService();
export default gmbService;