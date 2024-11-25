import { z } from 'zod';
import { sambanovaService } from '../services/sambanova';

// Validation schemas
const FeedbackSchema = z.object({
  cardId: z.string().min(1),
  merchantId: z.string().min(1),
  locationId: z.string().optional(),
  feedback: z.object({
    text: z.string().min(1),
    source: z.enum(['text', 'voice']),
    timestamp: z.string().datetime(),
  }),
  metadata: z.object({
    userAgent: z.string(),
    platform: z.string(),
    language: z.string().default('en'),
  }).optional(),
});

export type FeedbackPayload = z.infer<typeof FeedbackSchema>;

export async function processFeedback(payload: FeedbackPayload) {
  try {
    // Validate input
    const validatedData = FeedbackSchema.parse(payload);

    // Process with SambaNova
    const analysis = await sambanovaService.processReviewFeedback(validatedData.feedback.text);

    // Prepare response data
    const processedFeedback = {
      id: crypto.randomUUID(),
      ...validatedData,
      analysis: {
        sentiment: analysis.sentiment,
        entities: analysis.analysis.entities,
        keywords: analysis.analysis.keywords,
        summary: analysis.analysis.summary,
      },
      processed_at: new Date().toISOString(),
    };

    return {
      success: true,
      data: processedFeedback,
    };
  } catch (error) {
    console.error('Error processing feedback:', error);
    throw error;
  }
}