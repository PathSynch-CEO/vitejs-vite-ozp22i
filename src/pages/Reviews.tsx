import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import ReviewAnalysis from '../components/ReviewAnalysis';

const reviews = [
  {
    id: 1,
    author: 'Michael Brown',
    rating: 5,
    date: '2024-03-01',
    content: 'Excellent service! The staff was very helpful and professional.',
    helpful: 12,
    replies: 2,
    sentiment: 'positive',
    sentimentScore: 0.8
  },
  {
    id: 2,
    author: 'Sarah Johnson',
    rating: 4,
    date: '2024-02-28',
    content: 'Great experience overall. Would recommend to others.',
    helpful: 8,
    replies: 1,
    sentiment: 'positive',
    sentimentScore: 0.6
  },
  {
    id: 3,
    author: 'James Wilson',
    rating: 2,
    date: '2024-02-27',
    content: 'Service was slow and staff seemed uninterested.',
    helpful: 3,
    replies: 1,
    sentiment: 'negative',
    sentimentScore: -0.4
  }
];

export default function Reviews() {
  const [selectedReview, setSelectedReview] = useState<number | null>(null);

  const getSentimentIcon = (sentiment: string, score: number) => {
    if (score > 0.5) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (score < -0.2) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.5) return 'bg-green-100 text-green-800';
    if (score < -0.2) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600 mt-1">Monitor and respond to customer feedback</p>
        </div>
        <div className="flex gap-4">
          <select className="border rounded-lg px-4 py-2">
            <option>All Reviews</option>
            <option>Recent</option>
            <option>Positive</option>
            <option>Negative</option>
          </select>
          <button className="bg-[#FFE816] text-[#336633] px-4 py-2 rounded-lg font-medium hover:bg-[#FFE816]/90">
            Export Reviews
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{review.author}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(review.sentimentScore)}`}>
                    {getSentimentIcon(review.sentiment, review.sentimentScore)}
                    {Math.abs(review.sentimentScore * 100)}% {review.sentiment}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              <button className="text-[#336633] hover:text-[#336633]/80">Reply</button>
            </div>
            <p className="text-gray-700 mb-4">{review.content}</p>
            
            {selectedReview === review.id && (
              <div className="mt-4 border-t pt-4">
                <ReviewAnalysis review={review.content} />
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <button className="flex items-center gap-1 hover:text-gray-700">
                <ThumbsUp className="w-4 h-4" />
                {review.helpful} Helpful
              </button>
              <button className="flex items-center gap-1 hover:text-gray-700">
                <MessageSquare className="w-4 h-4" />
                {review.replies} Replies
              </button>
              <button 
                onClick={() => setSelectedReview(selectedReview === review.id ? null : review.id)}
                className="text-[#336633] hover:text-[#336633]/80"
              >
                {selectedReview === review.id ? 'Hide Analysis' : 'Show Analysis'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}