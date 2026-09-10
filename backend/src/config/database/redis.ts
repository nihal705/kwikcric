import { createClient } from 'redis';

let client: any = null;

export const connectRedis = async () => {
  try {
    client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    await client.connect();
    
  } catch (error) {
    ');
  }
};

export const getRedisClient = () => client;

export const cacheGet = async (key: string) => {
  if (!client) return null;
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key: string, value: any, ttl?: number) => {
  if (!client) return false;
  try {
    await client.set(key, JSON.stringify(value));
    if (ttl) await client.expire(key, ttl);
    return true;
  } catch {
    return false;
  }
};

export const cacheDel = async (key: string) => {
  if (!client) return false;
  try {
    await client.del(key);
    return true;
  } catch {
    return false;
  }
};

export const cacheDelPattern = async (pattern: string): Promise<void> => {
  if (!client) return;
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('Error deleting cache pattern:', error);
  }
};

export const cacheIncrement = async (key: string, increment: number = 1): Promise<number | null> => {
  if (!client) return null;
  try {
    const result = await client.incrBy(key, increment);
    return result;
  } catch {
    return null;
  }
};

export const cacheSetNX = async (key: string, value: any, ttl?: number): Promise<boolean> => {
  if (!client) return false;
  try {
    const result = await client.setNX(key, JSON.stringify(value));
    if (result && ttl) await client.expire(key, ttl);
    return result;
  } catch {
    return false;
  }
};