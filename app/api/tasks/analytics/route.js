import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/server/db';
import { resolveUserId } from '@/lib/server/request-user';
import { Task } from '@/lib/server/task-model';
import { emptyAnalytics } from '@/lib/server/task-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    const tasks = await Task.find({ userId: resolveUserId(request) }).lean();

    if (tasks.length === 0) {
      return NextResponse.json(emptyAnalytics());
    }

    const now = Date.now();
    const total = tasks.length;
    const completed = tasks.filter((task) => task.isCompleted).length;
    const pendingTasks = tasks.filter((task) => !task.isCompleted);

    const critical = pendingTasks.filter((task) => {
      if (!task.deadline) return false;
      const daysLeft = Math.ceil((new Date(task.deadline) - now) / 86400000);
      return daysLeft >= 0 && daysLeft <= 7;
    }).length;

    const overdue = pendingTasks.filter((task) => task.deadline && new Date(task.deadline) < now).length;
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekTasks = tasks.filter((task) => new Date(task.createdAt) >= weekStart).length;
    const prodScore = Math.round(tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / total);
    const avgAiScore = Math.round(tasks.reduce((sum, task) => sum + (task.aiScore || 0), 0) / total);

    return NextResponse.json({
      total,
      weekTasks,
      completed,
      pending: pendingTasks.length,
      critical,
      overdue,
      prodScore,
      avgAiScore,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
