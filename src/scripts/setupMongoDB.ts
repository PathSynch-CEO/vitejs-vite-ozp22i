import { MongoClient } from 'mongodb';

async function setupMongoDB() {
  const uri = process.env.VITE_MONGODB_URI;
  if (!uri) {
    throw new Error('MongoDB URI not found in environment variables');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const db = client.db(process.env.VITE_MONGODB_DB_NAME);

    // Create collections with validation
    await Promise.all([
      // Locations Collection
      db.createCollection('locations', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['id', 'locationId', 'name', 'streetAddress', 'city', 'state', 'zip', 'createdAt', 'updatedAt'],
            properties: {
              id: { bsonType: 'string' },
              locationId: { bsonType: 'string' },
              name: { bsonType: 'string' },
              streetAddress: { bsonType: 'string' },
              city: { bsonType: 'string' },
              state: { bsonType: 'string' },
              zip: { bsonType: 'string' },
              phone: { bsonType: 'string' },
              hours: { bsonType: 'string' },
              website: { bsonType: 'string' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      }),

      // NFC Cards Collection
      db.createCollection('nfc_cards', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['id', 'uid', 'merchantId', 'status', 'interactions', 'createdAt', 'updatedAt'],
            properties: {
              id: { bsonType: 'string' },
              uid: { bsonType: 'string' },
              merchantId: { bsonType: 'string' },
              locationId: { bsonType: 'string' },
              campaignId: { bsonType: 'string' },
              gmbUrl: { bsonType: 'string' },
              shortenedUrl: { bsonType: 'string' },
              status: { enum: ['active', 'inactive'] },
              lastUsed: { bsonType: 'string' },
              interactions: { bsonType: 'int' },
              cardId: { bsonType: 'string' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      }),

      // Reviews Collection
      db.createCollection('reviews', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['id', 'cardId', 'merchantId', 'text', 'sentiment', 'createdAt'],
            properties: {
              id: { bsonType: 'string' },
              cardId: { bsonType: 'string' },
              merchantId: { bsonType: 'string' },
              locationId: { bsonType: 'string' },
              text: { bsonType: 'string' },
              sentiment: {
                bsonType: 'object',
                required: ['score', 'magnitude', 'sentiment'],
                properties: {
                  score: { bsonType: 'double' },
                  magnitude: { bsonType: 'double' },
                  sentiment: { enum: ['positive', 'negative', 'neutral'] }
                }
              },
              analysis: {
                bsonType: 'object',
                properties: {
                  entities: { bsonType: 'array' },
                  keywords: { bsonType: 'array' },
                  summary: { bsonType: 'string' }
                }
              },
              createdAt: { bsonType: 'date' }
            }
          }
        }
      }),

      // Customers Collection
      db.createCollection('customers', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['id', 'merchantId', 'createdAt', 'updatedAt'],
            properties: {
              id: { bsonType: 'string' },
              merchantId: { bsonType: 'string' },
              email: { bsonType: 'string' },
              name: { bsonType: 'string' },
              phone: { bsonType: 'string' },
              status: { enum: ['active', 'inactive'] },
              points: { bsonType: 'int' },
              lastInteraction: { bsonType: 'date' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      })
    ]);

    // Create indexes
    await Promise.all([
      // Locations indexes
      db.collection('locations').createIndexes([
        { key: { id: 1 }, unique: true },
        { key: { locationId: 1 }, unique: true },
        { key: { merchantId: 1 } }
      ]),

      // NFC Cards indexes
      db.collection('nfc_cards').createIndexes([
        { key: { id: 1 }, unique: true },
        { key: { uid: 1 }, unique: true },
        { key: { merchantId: 1 } },
        { key: { locationId: 1 } },
        { key: { cardId: 1 } }
      ]),

      // Reviews indexes
      db.collection('reviews').createIndexes([
        { key: { id: 1 }, unique: true },
        { key: { cardId: 1 } },
        { key: { merchantId: 1 } },
        { key: { locationId: 1 } },
        { key: { createdAt: -1 } }
      ]),

      // Customers indexes
      db.collection('customers').createIndexes([
        { key: { id: 1 }, unique: true },
        { key: { merchantId: 1 } },
        { key: { email: 1 } },
        { key: { phone: 1 } }
      ])
    ]);

    console.log('MongoDB collections and indexes created successfully');
  } catch (error) {
    console.error('Error setting up MongoDB:', error);
    throw error;
  } finally {
    await client.close();
  }
}

setupMongoDB().catch(console.error);