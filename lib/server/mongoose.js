import mongoose from 'mongoose';

const globalForMongoose = globalThis;

if (!globalForMongoose.__studentosMongoose) {
  globalForMongoose.__studentosMongoose = { conn: null, promise: null };
}

const cached = globalForMongoose.__studentosMongoose;

export function getMongoUri() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) return null;
  const trimmed = String(uri).trim();
  return trimmed ? trimmed : null;
}

export function isMongoConfigured() {
  return Boolean(getMongoUri());
}

export async function connectMongoose() {
  const mongoUri = getMongoUri();
  if (!mongoUri) {
    throw new Error('MongoDB URI is not set. Add `MONGO_URI` (or `MONGODB_URI`) to `.env.local`.');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri)
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
