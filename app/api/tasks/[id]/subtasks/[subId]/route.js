import { NextResponse } from 'next/server';
import { connectMongoose, isMongoConfigured } from '@/lib/server/mongoose';
import { Task } from '@/lib/server/models/task';
import { toggleSubtask } from '@/lib/server/taskStore';
import { enrichTask } from '@/lib/server/taskUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, ctx) {
  try {
    const body = await request.json().catch(() => null);
    const params = await ctx.params;

    if (!isMongoConfigured()) {
      const updated = await toggleSubtask(params.id, params.subId, body?.done);
      if (!updated) return NextResponse.json({ error: 'Task or subtask not found' }, { status: 404 });
      return NextResponse.json(enrichTask(updated));
    }

    await connectMongoose();
    const task = await Task.findById(params.id);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const sub = task.subtasks.id(params.subId);
    if (!sub) return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });

    if (body?.done !== undefined) sub.done = Boolean(body.done);

    const saved = await task.save();
    return NextResponse.json(enrichTask(saved));
  } catch (err) {
    console.error('[subtask] PATCH error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
