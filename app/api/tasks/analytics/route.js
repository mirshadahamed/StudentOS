import { NextResponse } from 'next/server';
import { connectMongoose, isMongoConfigured } from '@/lib/server/mongoose';
import { resolveUserId } from '@/lib/server/defaultUser';
import { Task } from '@/lib/server/models/task';
import { getAnalytics } from '@/lib/server/taskStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const requestedUserId = (searchParams.get('userId') || '').trim();
    const userId = await resolveUserId(requestedUserId);

    if (!isMongoConfigured()) {
      return NextResponse.json(await getAnalytics({ userId }));
    }

    await connectMongoose();

    const filter = {};
    if (userId) filter.userId = userId;
    const tasks = await Task.find(filter).lean();
    if (!tasks.length) {
      return NextResponse.json({
        total: 0,
        weekTasks: 0,
        completed: 0,
        pending: 0,
        critical: 0,
        overdue: 0,
        prodScore: 0,
        avgAiScore: 0,
      });
    }

    const now = Date.now();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.isCompleted).length;
    const pendingTasks = tasks.filter((t) => !t.isCompleted);

    const critical = pendingTasks.filter((t) => {
      if (!t.deadline) return false;
      const d = Math.ceil((new Date(t.deadline) - now) / 86400000);
      return d >= 0 && d <= 7;
    }).length;

    const overdue = pendingTasks.filter((t) => t.deadline && new Date(t.deadline) < now).length;

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekTasks = tasks.filter((t) => new Date(t.createdAt) >= weekStart).length;

    const prodScore = Math.round(tasks.reduce((s, t) => s + (t.progress || 0), 0) / total);
    const avgAiScore = Math.round(tasks.reduce((s, t) => s + (t.aiScore || 0), 0) / total);

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
  } catch (err) {
    console.error('[analytics] error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
