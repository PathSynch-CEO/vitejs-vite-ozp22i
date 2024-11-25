import { z } from 'zod';
import { mongoDBService } from '../services/mongodb';
import { MONGODB_CONFIG } from '../config/mongodb';

const NFCCardSchema = z.object({
  id: z.string(),
  uid: z.string(),
  merchantId: z.string(),
  locationId: z.string().optional(),
  campaignId: z.string().optional(),
  gmbUrl: z.string().optional(),
  shortenedUrl: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  lastUsed: z.string().optional(),
  interactions: z.number().default(0),
  cardId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type NFCCard = z.infer<typeof NFCCardSchema>;

export class NFCCardRepository {
  private collection = MONGODB_CONFIG.collections.nfcCards;

  async findAll(): Promise<NFCCard[]> {
    const cards = await mongoDBService.find<NFCCard>(this.collection);
    return cards.map(card => ({
      ...card,
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
    }));
  }

  async findById(id: string): Promise<NFCCard | null> {
    const card = await mongoDBService.findOne<NFCCard>(this.collection, { id });
    if (!card) return null;

    return {
      ...card,
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
    };
  }

  async create(card: Omit<NFCCard, 'createdAt' | 'updatedAt'>): Promise<NFCCard> {
    const now = new Date();
    const newCard: NFCCard = {
      ...card,
      createdAt: now,
      updatedAt: now,
    };

    await mongoDBService.insertOne(this.collection, newCard);
    return newCard;
  }

  async update(id: string, data: Partial<NFCCard>): Promise<boolean> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    return mongoDBService.updateOne(this.collection, { id }, updateData);
  }

  async delete(id: string): Promise<boolean> {
    return mongoDBService.deleteOne(this.collection, { id });
  }

  async incrementInteractions(id: string): Promise<boolean> {
    const card = await this.findById(id);
    if (!card) return false;

    return this.update(id, {
      interactions: card.interactions + 1,
      lastUsed: new Date().toISOString(),
    });
  }
}