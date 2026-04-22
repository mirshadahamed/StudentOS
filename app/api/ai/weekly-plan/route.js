import { NextResponse } from 'next/server';

import { generateWeeklyPlan } from '@/lib/server/ai-service';
import { connectToDatabase } from '@/lib/server/db';
import { resolveUserId } from '@/lib/server/request-user';
import { Task } from '@/lib/server/task-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    const tasks = await Task.find({ userId: resolveUserId(request) }).sort({ aiScore: -1 }).limit(20).lean();
    let plan = await generateWeeklyPlan({ tasks, focusHoursPerDay: 4 });

    if (!plan || !Array.isArray(plan)) {
      const today = new Date();
      plan = Array.from({ length: 7 }, (_, index) => {
        const day = new Date(today);
        day.setDate(day.getDate() + index);
        const task = tasks[index] || tasks[0];

        return {
          day: day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
          focus: task ? `Work on: ${task.title} (${task.progress || 0}% complete)` : 'Rest and review progress',
          hours: task ? 1.5 : 0.5,
          note: task ? `Aim to make 10% progress on "${task.title}"` : 'No tasks available',
        };
      });
    }

    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
