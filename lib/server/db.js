import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is missing. Add it to the root .env.local file.');
}

const globalCache = globalThis;

if (!globalCache.mongooseCache) {
  globalCache.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (globalCache.mongooseCache.conn) {
    return globalCache.mongooseCache.conn;
  }

  if (!globalCache.mongooseCache.promise) {
    globalCache.mongooseCache.promise = mongoose
      .connect(MONGO_URI, { bufferCommands: false })
      .then((mongooseInstance) => mongooseInstance);
  }

  globalCache.mongooseCache.conn = await globalCache.mongooseCache.promise;
  return globalCache.mongooseCache.conn;
}
