import { NextResponse } from 'next/server';
import { connectMongoose, isMongoConfigured } from '@/lib/server/mongoose';
import { resolveUserId } from '@/lib/server/defaultUser';
import { Task } from '@/lib/server/models/task';
import { createTask, listTasks } from '@/lib/server/taskStore';
import { enrichTask } from '@/lib/server/taskUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const filter = {};

    const completed = searchParams.get('completed');
    const completedBool = completed !== null ? completed === 'true' : undefined;
    if (completedBool !== undefined) filter.isCompleted = completedBool;

    const priority = searchParams.get('priority');
    if (priority) filter.priority = priority;

    const category = searchParams.get('category');
    if (category) filter.category = category;

    const requestedUserId = (searchParams.get('userId') || '').trim();
    const userId = await resolveUserId(requestedUserId);
    if (userId) filter.userId = userId;

    if (!isMongoConfigured()) {
      const tasks = await listTasks({ completed: completedBool, priority, category, userId });
      return NextResponse.json(tasks.map(enrichTask));
    }

    await connectMongoose();
    const tasks = await Task.find(filter).sort({ aiScore: -1, deadline: 1, createdAt: -1 }).lean();
    return NextResponse.json(tasks.map(enrichTask));
  } catch (err) {
    console.error('[tasks] GET error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const { title, course, category, priority, deadline, progress, userEmail, userId, subtasks } = body ?? {};
    const effectiveUserId = await resolveUserId(userId);

    if (!title || !String(title).trim()) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      const created = await createTask({
        title,
        course,
        category,
        priority,
        deadline,
        progress,
        userEmail,
        userId: effectiveUserId,
        subtasks,
      });
      if (!created) return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
      return NextResponse.json(enrichTask(created), { status: 201 });
    }

    await connectMongoose();

    let cleanSubtasks = [];
    if (Array.isArray(subtasks)) {
      cleanSubtasks = subtasks
        .filter((s) => s && typeof s.title === 'string' && s.title.trim())
        .map((s) => ({ title: s.title.trim(), done: Boolean(s.done) || false }));
    }

    const task = new Task({
      title: String(title).trim(),
      course: String(course || '').trim(),
      category: ['Assignment', 'Exam', 'Project', 'Lab Report', 'Presentation'].includes(category) ? category : 'Assignment',
      priority: ['High', 'Medium', 'Low'].includes(priority) ? priority : 'Medium',
      deadline: deadline ? new Date(deadline) : null,
      progress: cleanSubtasks.length === 0 ? Math.max(0, Math.min(100, Number(progress) || 0)) : 0,
      userEmail: String(userEmail || '').trim(),
      userId: String(effectiveUserId || 'guest').trim(),
      subtasks: cleanSubtasks,
    });

    const saved = await task.save();
    return NextResponse.json(enrichTask(saved), { status: 201 });
  } catch (err) {
    console.error('[tasks] POST error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
