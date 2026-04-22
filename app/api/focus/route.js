import { NextResponse } from 'next/server';
import { connectMongoose, isMongoConfigured } from '@/lib/server/mongoose';
import { resolveUserId } from '@/lib/server/defaultUser';
import { FocusSession } from '@/lib/server/models/focusSession';
import { addSession } from '@/lib/server/focusStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { taskId = null, taskTitle = '', type = 'focus', durationMins = 25, userEmail = '', userId = 'guest' } = body || {};
    const effectiveUserId = await resolveUserId(userId);

    if (!durationMins || Number(durationMins) <= 0) {
      return NextResponse.json({ error: 'durationMins must be a positive number' }, { status: 400 });
    }

    const record = {
      taskId: taskId ? String(taskId) : null,
      taskTitle: String(taskTitle).trim(),
      type: ['focus', 'shortBreak', 'longBreak'].includes(type) ? type : 'focus',
      durationMins: Number(durationMins),
      userEmail: String(userEmail).trim(),
      userId: String(effectiveUserId || 'guest').trim(),
      completedAt: new Date(),
    };

    if (!isMongoConfigured()) {
      const stored = await addSession(record);
      return NextResponse.json(stored, { status: 201 });
    }

    await connectMongoose();
    const saved = await FocusSession.create(record);
    return NextResponse.json(saved.toObject(), { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
