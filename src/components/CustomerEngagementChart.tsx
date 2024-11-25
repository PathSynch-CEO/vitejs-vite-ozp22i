import React, { useEffect, useState } from 'react';
import { gmbService } from '../services/gmb';
import { BarChart, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EngagementMetrics {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export default function CustomerEngagementChart() {
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    positive: 0,
    neutral: 0,
    negative: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchAndCalculateMetrics = async () => {
      try {
        const reviews = await gmbService.fetchReviews();
        const total = reviews.length;

        const metrics = reviews.reduce(
          (acc, review) => {
            // Convert 5-star rating to sentiment score (-1 to 1)
            const sentimentScore = (review.starRating - 3) / 2;
            
            if (sentimentScore > 0.3) acc.positive++;
            else if (sentimentScore < -0.3) acc.negative++;
            else acc.neutral++;
            return acc;
          },
          { positive: 0, neutral: 0, negative: 0, total }
        );

        setMetrics(metrics);
      } catch (error) {
        console.error('Error calculating metrics:', error);
      }
    };

    fetchAndCalculateMetrics();
    // Refresh metrics every hour
    const interval = setInterval(fetchAndCalculateMetrics, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getSentimentIcon = (type: 'positive' | 'neutral' | 'negative') => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart className="w-5 h-5 text-[#336633]" />
          <span className="font-medium">Review Sentiment Distribution</span>
        </div>
        <span className="text-sm text-gray-500">Total Reviews: {metrics.total}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4">
        {[
          { type: 'positive', label: 'Positive', color: 'bg-green-500' },
          { type: 'neutral', label: 'Neutral', color: 'bg-gray-500' },
          { type: 'negative', label: 'Negative', color: 'bg-red-500' },
        ].map(({ type, label, color }) => (
          <div key={type} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSentimentIcon(type as any)}
                <span className="text-sm font-medium">{label}</span>
              </div>
              <span className="text-sm text-gray-600">
                {metrics[type as keyof EngagementMetrics]}
                {' '}
                ({metrics.total ? ((metrics[type as keyof EngagementMetrics] / metrics.total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} transition-all duration-500`}
                style={{
                  width: `${metrics.total ? (metrics[type as keyof EngagementMetrics] / metrics.total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}