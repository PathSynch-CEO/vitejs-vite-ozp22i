import React from 'react';
import { useSambanova } from '../hooks/useSambanova';
import { Loader2 } from 'lucide-react';

interface ReviewAnalysisProps {
  review: string;
}

export default function ReviewAnalysis({ review }: ReviewAnalysisProps) {
  const { processReview, isLoading, error } = useSambanova();
  const [analysis, setAnalysis] = React.useState<any>(null);

  React.useEffect(() => {
    if (review) {
      processReview(review).then(result => {
        if (result) {
          setAnalysis(result);
        }
      });
    }
  }, [review]);

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Error analyzing review: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        Analyzing review...
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Sentiment Analysis</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  analysis.sentiment.score > 0
                    ? 'bg-green-500'
                    : analysis.sentiment.score < 0
                    ? 'bg-red-500'
                    : 'bg-gray-500'
                }`}
                style={{
                  width: `${Math.abs(analysis.sentiment.score * 100)}%`,
                }}
              />
            </div>
          </div>
          <span className="text-sm font-medium">
            {analysis.sentiment.sentiment}
          </span>
        </div>
      </div>

      {analysis.analysis.keywords.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Key Topics</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.analysis.keywords.map((keyword: string) => (
              <span
                key={keyword}
                className="px-2 py-1 bg-[#336633]/10 text-[#336633] rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}