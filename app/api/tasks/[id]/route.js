import { NextResponse } from 'next/server';
import { connectMongoose, isMongoConfigured } from '@/lib/server/mongoose';
import { Task } from '@/lib/server/models/task';
import { deleteTask, updateTask } from '@/lib/server/taskStore';
import { enrichTask } from '@/lib/server/taskUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, ctx) {
  try {
    const body = await request.json().catch(() => null);
    const params = await ctx.params;

    if (!isMongoConfigured()) {
      const updated = await updateTask(params.id, body ?? {});
      if (!updated) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      return NextResponse.json(enrichTask(updated));
    }

    await connectMongoose();
    const task = await Task.findById(params.id);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const allowed = ['title', 'course', 'category', 'priority', 'deadline', 'progress', 'isCompleted', 'userEmail'];
    for (const key of allowed) {
      if (body?.[key] === undefined) continue;
      if (key === 'deadline') task[key] = body[key] ? new Date(body[key]) : null;
      else if (key === 'progress') task[key] = Math.max(0, Math.min(100, Number(body[key])));
      else task[key] = body[key];
    }

    if (body?.isCompleted === true || body?.isCompleted === 'true') {
      task.isCompleted = true;
      task.progress = 100;
    }
    if (body?.isCompleted === false || body?.isCompleted === 'false') {
      task.isCompleted = false;
      if (task.progress === 100) task.progress = 0;
    }

    if (Array.isArray(body?.subtasks)) {
      task.subtasks = body.subtasks
        .filter((s) => s && typeof s.title === 'string' && s.title.trim())
        .map((s) => ({ title: s.title.trim(), done: Boolean(s.done), _id: s._id || undefined }));
    }

    const saved = await task.save();
    return NextResponse.json(enrichTask(saved));
  } catch (err) {
    console.error('[tasks/:id] PATCH error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(_request, ctx) {
  try {
    const params = await ctx.params;
    if (!isMongoConfigured()) {
      await deleteTask(params.id);
      return NextResponse.json({ success: true });
    }

    await connectMongoose();
    await Task.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[tasks/:id] DELETE error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
