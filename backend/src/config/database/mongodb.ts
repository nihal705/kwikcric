import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(process.env.MONGO_DB || 'cricket_logs');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.log('⚠️ MongoDB not connected (running in mock mode)');
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error('MongoDB not connected');
  }
  return db;
};

export const getCollection = (name: string): Collection => {
  return getDb().collection(name);
};

export const closeMongoDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};