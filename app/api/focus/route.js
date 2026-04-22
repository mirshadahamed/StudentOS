import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/server/db';
import { FocusSession } from '@/lib/server/focus-session-model';
import { getUserContext } from '@/lib/server/request-user';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { taskId = null, taskTitle = '', type = 'focus', durationMins = 25 } = body || {};
    const { userId, userEmail } = await getUserContext(request, body);

    if (!durationMins || Number(durationMins) <= 0) {
      return NextResponse.json({ error: 'durationMins must be a positive number' }, { status: 400 });
    }

    const record = await FocusSession.create({
      taskId: taskId || null,
      taskTitle: String(taskTitle).trim(),
      type: ['focus', 'shortBreak', 'longBreak'].includes(type) ? type : 'focus',
      durationMins: Number(durationMins),
      userId,
      userEmail: String(userEmail).trim(),
      completedAt: new Date(),
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
