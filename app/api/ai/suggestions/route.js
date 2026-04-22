import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/server/db';
import { resolveUserId } from '@/lib/server/request-user';
import { Task } from '@/lib/server/task-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    const tasks = await Task.find({ userId: resolveUserId(request) }).sort({ aiScore: -1 }).limit(8);
    const suggestions = tasks.map((task) => ({
      type: 'plan',
      tag: task.priority === 'High' ? 'High Priority' : task.priority === 'Medium' ? 'Medium Priority' : 'Low Priority',
      text: `${task.title} (${task.course || 'No course'}) - due ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'TBD'}`,
      detail: `Progress: ${task.progress || 0}%, AI score: ${task.aiScore || 0}.`,
      score: task.aiScore || 0,
      taskId: task._id,
      deadline: task.deadline,
      category: task.category,
      priority: task.priority,
    }));

    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
