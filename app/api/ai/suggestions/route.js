import { NextResponse } from 'next/server';
import { connectMongoose, isMongoConfigured } from '@/lib/server/mongoose';
import { resolveUserId } from '@/lib/server/defaultUser';
import { Task } from '@/lib/server/models/task';
import { topTasks } from '@/lib/server/taskStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const requestedUserId = (searchParams.get('userId') || '').trim();
    const userId = await resolveUserId(requestedUserId);

    let tasks;
    if (!isMongoConfigured()) {
      tasks = await topTasks({ limit: 8, userId });
    } else {
      await connectMongoose();
      const filter = {};
      if (userId) filter.userId = userId;
      tasks = await Task.find(filter).sort({ aiScore: -1 }).limit(8).lean();
    }
    const suggestions = tasks.map((task) => ({
      type: 'plan',
      tag: task.priority === 'High' ? 'High Priority' : task.priority === 'Medium' ? 'Medium Priority' : 'Low Priority',
      text: `${task.title} (${task.course || 'No course'}) — due ${
        task.deadline ? new Date(task.deadline).toLocaleDateString() : 'TBD'
      }`,
      detail: `Progress: ${task.progress || 0}%, AI score: ${task.aiScore || 0}.`,
      score: task.aiScore || 0,
      taskId: task._id,
      deadline: task.deadline,
      category: task.category,
      priority: task.priority,
    }));

    return NextResponse.json(suggestions);
  } catch (err) {
    console.error('[ai/suggestions] error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
