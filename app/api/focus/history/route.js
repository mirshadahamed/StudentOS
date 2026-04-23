import { NextResponse } from 'next/server';
import { connectMongoose, isMongoConfigured } from '@/lib/server/mongoose';
import { resolveUserId } from '@/lib/server/defaultUser';
import { FocusSession } from '@/lib/server/models/focusSession';
import { getSessions } from '@/lib/server/focusStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const requestedUserId = (searchParams.get('userId') || '').trim();
    const userId = await resolveUserId(requestedUserId);
    const userEmail = searchParams.get('userEmail') || '';

    if (!isMongoConfigured()) {
      let sessions = await getSessions();
      if (userId) sessions = sessions.filter((s) => String(s.userId || 'guest').trim() === userId);
      if (userEmail) sessions = sessions.filter((s) => String(s.userEmail || '').trim() === userEmail);
      return NextResponse.json(sessions.slice(-30).reverse());
    }

    await connectMongoose();
    const filter = {};
    if (userId) filter.userId = userId;
    if (userEmail) filter.userEmail = userEmail;
    const sessions = await FocusSession.find(filter).sort({ completedAt: -1 }).limit(30).lean();
    return NextResponse.json(sessions);
  } catch (err) {
    console.error('[focus/history] error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
