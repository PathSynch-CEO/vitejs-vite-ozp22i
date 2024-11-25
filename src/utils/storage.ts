import { z } from 'zod';

// Validation schemas
const LocationSchema = z.object({
  id: z.string(),
  locationId: z.string(),
  name: z.string(),
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  phone: z.string().optional(),
  hours: z.string().optional(),
  website: z.string().optional(),
});

const ReviewSchema = z.object({
  id: z.string(),
  author: z.string(),
  rating: z.number().min(1).max(5),
  date: z.string(),
  content: z.string(),
  helpful: z.number(),
  replies: z.number(),
  sentiment: z.string(),
  sentimentScore: z.number(),
});

const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['Active', 'Inactive']),
  points: z.number(),
  joined: z.string(),
});

const NFCCardSchema = z.object({
  id: z.string(),
  cardId: z.string().optional(),
  locationId: z.string(),
  campaignId: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  lastUsed: z.string(),
  interactions: z.number(),
  shortenedUrl: z.string().optional(),
});

const GMBMetricsSchema = z.object({
  date: z.string(),
  totalReviews: z.number(),
  averageRating: z.number(),
});

const BusinessSettingsSchema = z.object({
  gmbReviewLink: z.string().url().optional(),
  lastUpdated: z.string(),
});

export type Location = z.infer<typeof LocationSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type NFCCard = z.infer<typeof NFCCardSchema>;
export type GMBMetrics = z.infer<typeof GMBMetricsSchema>;
export type BusinessSettings = z.infer<typeof BusinessSettingsSchema>;

const STORAGE_KEYS = {
  LOCATIONS: 'pathsynch_locations',
  REVIEWS: 'pathsynch_reviews',
  CUSTOMERS: 'pathsynch_customers',
  NFC_CARDS: 'pathsynch_nfc_cards',
  USER_PREFERENCES: 'pathsynch_preferences',
  AUTH_TOKEN: 'pathsynch_auth_token',
  GMB_METRICS: 'pathsynch_gmb_metrics',
  BUSINESS_SETTINGS: 'pathsynch_business_settings',
} as const;

class StorageService {
  private getItem<T>(key: string, schema: z.ZodType<T>): T[] {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return z.array(schema).parse(parsed);
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return [];
    }
  }

  private setItem<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }

  // Business Settings
  getBusinessSettings(): BusinessSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BUSINESS_SETTINGS);
      if (!stored) return { lastUpdated: new Date().toISOString() };
      
      return BusinessSettingsSchema.parse(JSON.parse(stored));
    } catch (error) {
      console.error('Error loading business settings:', error);
      return { lastUpdated: new Date().toISOString() };
    }
  }

  saveBusinessSettings(settings: BusinessSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESS_SETTINGS, JSON.stringify({
        ...settings,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error saving business settings:', error);
    }
  }

  // GMB Metrics
  getGMBMetrics(): GMBMetrics[] {
    return this.getItem(STORAGE_KEYS.GMB_METRICS, GMBMetricsSchema);
  }

  saveGMBMetrics(metrics: GMBMetrics[]): void {
    this.setItem(STORAGE_KEYS.GMB_METRICS, metrics);
  }

  // Locations
  getLocations(): Location[] {
    return this.getItem(STORAGE_KEYS.LOCATIONS, LocationSchema);
  }

  saveLocations(locations: Location[]): void {
    this.setItem(STORAGE_KEYS.LOCATIONS, locations);
  }

  // Reviews
  getReviews(): Review[] {
    return this.getItem(STORAGE_KEYS.REVIEWS, ReviewSchema);
  }

  saveReviews(reviews: Review[]): void {
    this.setItem(STORAGE_KEYS.REVIEWS, reviews);
  }

  // Customers
  getCustomers(): Customer[] {
    return this.getItem(STORAGE_KEYS.CUSTOMERS, CustomerSchema);
  }

  saveCustomers(customers: Customer[]): void {
    this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
  }

  // NFC Cards
  getNFCCards(): NFCCard[] {
    return this.getItem(STORAGE_KEYS.NFC_CARDS, NFCCardSchema);
  }

  saveNFCCards(cards: NFCCard[]): void {
    this.setItem(STORAGE_KEYS.NFC_CARDS, cards);
  }

  // User Preferences
  getUserPreferences(): Record<string, any> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return {};
    }
  }

  saveUserPreferences(preferences: Record<string, any>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  // Auth Token
  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  removeAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Export singleton instance
export const storageService = new StorageService();
export default storageService;