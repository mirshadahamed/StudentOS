import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/server/db';
import { resolveUserId } from '@/lib/server/request-user';
import { Task } from '@/lib/server/task-model';
import { enrichTask } from '@/lib/server/task-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const { id, subId } = await params;
    const body = await request.json();
    const task = await Task.findOne({ _id: id, userId: resolveUserId(request, body) });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const subtask = task.subtasks.id(subId);
    if (!subtask) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    }

    if (body.done !== undefined) {
      subtask.done = Boolean(body.done);
    }

    const savedTask = await task.save();
    return NextResponse.json(enrichTask(savedTask));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
