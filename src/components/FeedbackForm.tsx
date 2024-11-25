import React, { useState } from 'react';
import { Mic, Send, Loader2 } from 'lucide-react';
import { useSambanova } from '../hooks/useSambanova';

interface FeedbackFormProps {
  cardId: string;
  merchantId: string;
  locationId?: string;
  onSubmit: (feedback: string) => Promise<void>;
}

export default function FeedbackForm({ cardId, merchantId, locationId, onSubmit }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { processReview } = useSambanova();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(feedback);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your experience..."
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#336633] min-h-[120px]"
          disabled={isSubmitting}
        />
        <button
          type="button"
          onClick={toggleRecording}
          className={`absolute bottom-4 right-14 p-2 rounded-full ${
            isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
          } hover:bg-opacity-90`}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      <button
        type="submit"
        disabled={!feedback.trim() || isSubmitting}
        className="w-full bg-[#336633] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#336633]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Feedback
          </>
        )}
      </button>
    </form>
  );
}