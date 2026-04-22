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

    let sessions;
    if (!isMongoConfigured()) {
      sessions = await getSessions();
    } else {
      await connectMongoose();
      const filter = {};
      if (userId) filter.userId = userId;
      if (userEmail) filter.userEmail = userEmail;
      sessions = await FocusSession.find(filter).sort({ completedAt: 1 }).lean();
    }

    if (userId) sessions = sessions.filter((s) => String(s.userId || 'guest').trim() === userId);
    if (userEmail) sessions = sessions.filter((s) => String(s.userEmail || '').trim() === userEmail);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySes = sessions.filter((s) => new Date(s.completedAt) >= today);
    const focusSes = todaySes.filter((s) => s.type === 'focus');
    const mins = focusSes.reduce((sum, s) => sum + s.durationMins, 0);

    const allDays = [
      ...new Set(sessions.filter((s) => s.type === 'focus').map((s) => new Date(s.completedAt).toDateString())),
    ].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    for (let i = 0; i < allDays.length; i++) {
      if (allDays[i] === new Date(Date.now() - i * 86400000).toDateString()) streak++;
      else break;
    }

    return NextResponse.json({
      focusMinToday: mins,
      focusHoursToday: `${Math.floor(mins / 60)}h ${mins % 60}m`,
      completedPomodoros: focusSes.length,
      streak,
      totalSessionsToday: todaySes.length,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
