export interface ProcessedFeedback {
  id: string;
  cardId: string;
  merchantId: string;
  locationId?: string;
  feedback: {
    text: string;
    source: 'text' | 'voice';
    timestamp: string;
  };
  analysis: {
    sentiment: {
      score: number;
      magnitude: number;
      sentiment: 'positive' | 'negative' | 'neutral';
    };
    entities: Array<{
      name: string;
      type: string;
      sentiment: number;
    }>;
    keywords: string[];
    summary: string;
  };
  metadata?: {
    userAgent: string;
    platform: string;
    language: string;
  };
  processed_at: string;
}