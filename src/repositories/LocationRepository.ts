import { z } from 'zod';
import { mongoDBService } from '../services/mongodb';
import { MONGODB_CONFIG } from '../config/mongodb';

const LocationSchema = z.object({
  id: z.string(),
  locationId: z.string(),
  name: z.string(),
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  phone: z.string().optional(),
  hours: z.string().optional(),
  website: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Location = z.infer<typeof LocationSchema>;

export class LocationRepository {
  private collection = MONGODB_CONFIG.collections.locations;

  async findAll(): Promise<Location[]> {
    const locations = await mongoDBService.find<Location>(this.collection);
    return locations.map(location => ({
      ...location,
      createdAt: new Date(location.createdAt),
      updatedAt: new Date(location.updatedAt),
    }));
  }

  async findById(id: string): Promise<Location | null> {
    const location = await mongoDBService.findOne<Location>(this.collection, { id });
    if (!location) return null;

    return {
      ...location,
      createdAt: new Date(location.createdAt),
      updatedAt: new Date(location.updatedAt),
    };
  }

  async create(location: Omit<Location, 'createdAt' | 'updatedAt'>): Promise<Location> {
    const now = new Date();
    const newLocation: Location = {
      ...location,
      createdAt: now,
      updatedAt: now,
    };

    await mongoDBService.insertOne(this.collection, newLocation);
    return newLocation;
  }

  async update(id: string, data: Partial<Location>): Promise<boolean> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    return mongoDBService.updateOne(this.collection, { id }, updateData);
  }

  async delete(id: string): Promise<boolean> {
    return mongoDBService.deleteOne(this.collection, { id });
  }
}