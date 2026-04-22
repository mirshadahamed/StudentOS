import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/server/db';
import { FocusSession } from '@/lib/server/focus-session-model';
import { resolveUserId } from '@/lib/server/request-user';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    const sessions = await FocusSession.find({ userId: resolveUserId(request) }).sort({ completedAt: -1 }).lean();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = sessions.filter((session) => new Date(session.completedAt) >= today);
    const focusSessions = todaySessions.filter((session) => session.type === 'focus');
    const focusMinutes = focusSessions.reduce((sum, session) => sum + session.durationMins, 0);

    const allFocusDays = [...new Set(sessions
      .filter((session) => session.type === 'focus')
      .map((session) => new Date(session.completedAt).toDateString()))].sort(
      (left, right) => new Date(right) - new Date(left)
    );

    let streak = 0;
    for (let index = 0; index < allFocusDays.length; index += 1) {
      if (allFocusDays[index] === new Date(Date.now() - index * 86400000).toDateString()) {
        streak += 1;
      } else {
        break;
      }
    }

    return NextResponse.json({
      focusMinToday: focusMinutes,
      focusHoursToday: `${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m`,
      completedPomodoros: focusSessions.length,
      streak,
      totalSessionsToday: todaySessions.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
