import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import { MONGODB_CONFIG } from '../config/mongodb';

class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnecting = false;
  private connectionRetries = 3;
  private retryDelay = 2000;

  constructor() {
    this.initialize().catch(console.error);
  }

  private async initialize() {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      const uri = MONGODB_CONFIG.uri;
      
      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      await this.client.connect();
      this.db = this.client.db(MONGODB_CONFIG.dbName);
      
      // Test the connection
      await this.db.command({ ping: 1 });
      console.log('Successfully connected to MongoDB Atlas');

      this.isConnecting = false;

    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      this.isConnecting = false;
      throw error;
    }
  }

  async getCollection(name: string) {
    if (!this.db) {
      await this.initialize();
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db.collection(name);
  }

  async findOne(collection: string, query: object) {
    const coll = await this.getCollection(collection);
    return coll.findOne(query);
  }

  async find(collection: string, query: object = {}) {
    const coll = await this.getCollection(collection);
    return coll.find(query).toArray();
  }

  async insertOne(collection: string, document: any) {
    const coll = await this.getCollection(collection);
    const result = await coll.insertOne(document);
    return result.insertedId;
  }

  async updateOne(collection: string, query: object, update: object) {
    const coll = await this.getCollection(collection);
    const result = await coll.updateOne(query, { $set: update });
    return result.modifiedCount > 0;
  }

  async deleteOne(collection: string, query: object) {
    const coll = await this.getCollection(collection);
    const result = await coll.deleteOne(query);
    return result.deletedCount > 0;
  }
}

// Export singleton instance
export const mongoDBService = new MongoDBService();
export default mongoDBService;