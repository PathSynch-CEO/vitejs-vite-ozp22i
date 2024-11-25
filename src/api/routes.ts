import express from 'express';
import rateLimit from 'express-rate-limit';
import { processFeedback, type FeedbackPayload } from './feedback';

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Middleware for authentication
const authenticateRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Feedback endpoint
router.post(
  '/feedback',
  limiter,
  authenticateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await processFeedback(req.body as FeedbackPayload);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);