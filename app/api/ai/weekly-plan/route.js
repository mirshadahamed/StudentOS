import { NextResponse } from 'next/server';
import { connectMongoose, isMongoConfigured } from '@/lib/server/mongoose';
import { resolveUserId } from '@/lib/server/defaultUser';
import { Task } from '@/lib/server/models/task';
import { generateWeeklyPlan } from '@/lib/server/services/aiService';
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
      tasks = await topTasks({ limit: 20, userId });
    } else {
      await connectMongoose();
      const filter = {};
      if (userId) filter.userId = userId;
      tasks = await Task.find(filter).sort({ aiScore: -1 }).limit(20).lean();
    }
    let plan = null;

    if (process.env.ANTHROPIC_API_KEY && tasks.length > 0) {
      plan = await generateWeeklyPlan({ tasks, focusHoursPerDay: 4 });
    }

    if (!plan || !Array.isArray(plan)) {
      const today = new Date();
      plan = Array.from({ length: 7 }, (_, idx) => {
        const day = new Date(today);
        day.setDate(day.getDate() + idx);
        const task = tasks[idx] || tasks[0];
        return {
          day: day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
          focus: task ? `Work on: ${task.title} (${task.progress || 0}% complete)` : 'Rest and review progress',
          hours: task ? 1.5 : 0.5,
          note: task ? `Aim to make 10% progress on "${task.title}"` : 'No tasks available',
        };
      });
    }

    return NextResponse.json(plan);
  } catch (err) {
    console.error('[ai/weekly-plan] error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
