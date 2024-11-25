import { useState } from 'react';
import sambanovaService, { SentimentAnalysis, TextAnalysis } from '../services/sambanova';

export function useSambanova() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSentiment = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await sambanovaService.analyzeSentiment(text);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze sentiment');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeText = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await sambanovaService.analyzeText(text);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze text');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const processReview = async (review: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await sambanovaService.processReviewFeedback(review);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process review');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeSentiment,
    analyzeText,
    processReview,
    isLoading,
    error,
  };
}