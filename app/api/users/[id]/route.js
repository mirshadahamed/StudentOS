import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectMongoose, isMongoConfigured } from '@/lib/server/mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function norm(value) {
  return String(value ?? '').trim();
}

function sanitizeUser(user) {
  if (!user || typeof user !== 'object') return user;
  const out = { ...user };
  const blocked = ['password', 'pass', 'hash', 'salt', 'token', 'secret', 'apikey', 'api_key', 'refresh'];
  for (const key of Object.keys(out)) {
    const lower = key.toLowerCase();
    if (blocked.some((b) => lower.includes(b))) delete out[key];
  }
  return out;
}

export async function GET(_request, ctx) {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json(
        { error: 'MongoDB is not configured. Set `MONGO_URI` (or `MONGODB_URI`) in `.env.local`.' },
        { status: 400 }
      );
    }

    const params = await ctx.params;
    const id = norm(params?.id);
    if (!id) return NextResponse.json({ error: 'User id is required' }, { status: 400 });

    await connectMongoose();

    const users = mongoose.connection.db.collection('users');

    let user = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await users.findOne({ _id: new mongoose.Types.ObjectId(id) });
    }
    if (!user) user = await users.findOne({ _id: id });
    if (!user) user = await users.findOne({ userId: id });
    if (!user) user = await users.findOne({ uid: id });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(sanitizeUser(user));
  } catch (err) {
    console.error('[users/:id] GET error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
