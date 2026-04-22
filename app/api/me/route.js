import { NextResponse } from 'next/server';
import { isMongoConfigured } from '@/lib/server/mongoose';
import { getDefaultUserDoc, resolveDefaultUserId } from '@/lib/server/defaultUser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

export async function GET() {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json({ userId: 'guest', user: null });
    }

    const user = await getDefaultUserDoc();
    const userId = String((user && (user.userId || user.uid || user._id)) ?? (await resolveDefaultUserId())).trim() || 'guest';

    return NextResponse.json({ userId, user: sanitizeUser(user) });
  } catch (err) {
    console.error('[me] error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}

