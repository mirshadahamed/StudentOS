import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/server/db';
import { getUserContext, resolveUserId } from '@/lib/server/request-user';
import { Task } from '@/lib/server/task-model';
import { enrichTask } from '@/lib/server/task-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { userId, userEmail } = await getUserContext(request, body);
    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const allowed = ['title', 'course', 'category', 'priority', 'deadline', 'progress', 'isCompleted', 'userEmail'];
    for (const key of allowed) {
      if (body[key] === undefined) continue;
      if (key === 'deadline') task[key] = body[key] ? new Date(body[key]) : null;
      else if (key === 'progress') task[key] = Math.max(0, Math.min(100, Number(body[key])));
      else task[key] = body[key];
    }

    if (body.isCompleted === true || body.isCompleted === 'true') {
      task.isCompleted = true;
      task.progress = 100;
    }
    if (body.isCompleted === false || body.isCompleted === 'false') {
      task.isCompleted = false;
      if (task.progress === 100) {
        task.progress = 0;
      }
    }

    if (Array.isArray(body.subtasks)) {
      task.subtasks = body.subtasks
        .filter((subtask) => subtask && typeof subtask.title === 'string' && subtask.title.trim())
        .map((subtask) => ({
          title: subtask.title.trim(),
          done: Boolean(subtask.done),
          _id: subtask._id || undefined,
        }));
    }

    task.userEmail = userEmail;

    const savedTask = await task.save();
    return NextResponse.json(enrichTask(savedTask));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Task.findOneAndDelete({ _id: id, userId: resolveUserId(request) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
