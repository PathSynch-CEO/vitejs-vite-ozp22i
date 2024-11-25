import React, { useEffect, useState } from 'react';
import { PieChart, TrendingUp, MessageSquare, AlertTriangle } from 'lucide-react';
import { useSambanova } from '../hooks/useSambanova';
import { gmbService } from '../services/gmb';

interface SentimentMetrics {
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topKeywords: Array<{
    word: string;
    count: number;
    sentiment: number;
  }>;
  recentTrend: 'improving' | 'declining' | 'stable';
  totalProcessed: number;
}

export default function ReviewSentimentChart() {
  const [metrics, setMetrics] = useState<SentimentMetrics>({
    sentimentBreakdown: { positive: 0, negative: 0, neutral: 0 },
    topKeywords: [],
    recentTrend: 'stable',
    totalProcessed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { processReview } = useSambanova();

  useEffect(() => {
    const analyzeReviews = async () => {
      try {
        const reviews = await gmbService.fetchReviews();
        const results = await Promise.all(
          reviews.map(review => processReview(review.text))
        );

        const breakdown = { positive: 0, negative: 0, neutral: 0 };
        const keywordMap = new Map<string, { count: number; sentiment: number }>();
        let totalSentiment = 0;

        results.forEach(result => {
          if (!result) return;

          // Update sentiment breakdown
          const sentiment = result.sentiment.sentiment;
          breakdown[sentiment]++;

          // Track overall sentiment trend
          totalSentiment += result.sentiment.score;

          // Aggregate keywords
          result.analysis.keywords.forEach(keyword => {
            const existing = keywordMap.get(keyword) || { count: 0, sentiment: 0 };
            keywordMap.set(keyword, {
              count: existing.count + 1,
              sentiment: existing.sentiment + result.sentiment.score,
            });
          });
        });

        // Calculate top keywords
        const topKeywords = Array.from(keywordMap.entries())
          .map(([word, { count, sentiment }]) => ({
            word,
            count,
            sentiment: sentiment / count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Determine trend
        const avgSentiment = totalSentiment / results.length;
        const trend = avgSentiment > 0.2 ? 'improving' : 
                     avgSentiment < -0.2 ? 'declining' : 'stable';

        setMetrics({
          sentimentBreakdown: breakdown,
          topKeywords,
          recentTrend: trend,
          totalProcessed: results.length,
        });
      } catch (error) {
        console.error('Error analyzing reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    analyzeReviews();
    // Refresh analysis every 4 hours
    const interval = setInterval(analyzeReviews, 4 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [processReview]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Analyzing reviews...</div>
      </div>
    );
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#336633]" />
          <span className="font-medium">AI-Powered Sentiment Analysis</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MessageSquare className="w-4 h-4" />
          {metrics.totalProcessed} reviews analyzed
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Sentiment Distribution</h4>
          <div className="space-y-3">
            {Object.entries(metrics.sentimentBreakdown).map(([type, count]) => (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{type}</span>
                  <span>{((count / metrics.totalProcessed) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      type === 'positive' ? 'bg-green-500' :
                      type === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                    }`}
                    style={{
                      width: `${(count / metrics.totalProcessed) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Top Keywords</h4>
          <div className="space-y-2">
            {metrics.topKeywords.map(({ word, count, sentiment }) => (
              <div key={word} className="flex items-center justify-between">
                <span className="text-sm">{word}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{count}×</span>
                  <div className={`px-2 py-0.5 rounded-full text-xs ${
                    sentiment > 0 ? 'bg-green-100 text-green-800' :
                    sentiment < 0 ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {sentiment > 0 ? 'Positive' : sentiment < 0 ? 'Negative' : 'Neutral'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#336633]" />
          <span className="text-sm font-medium">Sentiment Trend</span>
        </div>
        <div className={`flex items-center gap-1 ${getTrendColor(metrics.recentTrend)}`}>
          {metrics.recentTrend === 'improving' && <TrendingUp className="w-4 h-4" />}
          {metrics.recentTrend === 'declining' && <TrendingUp className="w-4 h-4 rotate-180" />}
          <span className="text-sm font-medium capitalize">{metrics.recentTrend}</span>
        </div>
      </div>
    </div>
  );
}