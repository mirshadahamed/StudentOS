import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/server/db';
import { getUserContext, resolveUserId } from '@/lib/server/request-user';
import { Task } from '@/lib/server/task-model';
import { enrichTask } from '@/lib/server/task-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function cleanSubtasks(subtasks) {
  if (!Array.isArray(subtasks)) {
    return [];
  }

  return subtasks
    .filter((subtask) => subtask && typeof subtask.title === 'string' && subtask.title.trim())
    .map((subtask) => ({
      title: subtask.title.trim(),
      done: Boolean(subtask.done),
    }));
}

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const filter = { userId: resolveUserId(request) };

    if (searchParams.get('completed') !== null) {
      filter.isCompleted = searchParams.get('completed') === 'true';
    }
    if (searchParams.get('priority')) {
      filter.priority = searchParams.get('priority');
    }
    if (searchParams.get('category')) {
      filter.category = searchParams.get('category');
    }

    const tasks = await Task.find(filter).sort({ aiScore: -1, deadline: 1, createdAt: -1 });
    return NextResponse.json(tasks.map(enrichTask));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, course, category, priority, deadline, progress, subtasks } = body;
    const { userId, userEmail } = await getUserContext(request, body);

    if (!title || !String(title).trim()) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    const cleanSteps = cleanSubtasks(subtasks);
    const task = new Task({
      title: String(title).trim(),
      course: String(course || '').trim(),
      category: ['Assignment', 'Exam', 'Project', 'Lab Report', 'Presentation'].includes(category)
        ? category
        : 'Assignment',
      priority: ['High', 'Medium', 'Low'].includes(priority) ? priority : 'Medium',
      deadline: deadline ? new Date(deadline) : null,
      progress: cleanSteps.length === 0 ? Math.max(0, Math.min(100, Number(progress) || 0)) : 0,
      userEmail: String(userEmail || '').trim(),
      userId: String(userId || 'guest').trim(),
      subtasks: cleanSteps,
    });

    const savedTask = await task.save();
    return NextResponse.json(enrichTask(savedTask), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
