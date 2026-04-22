import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/server/db';
import { resolveUserId } from '@/lib/server/request-user';
import { Task } from '@/lib/server/task-model';
import { hasAnthropicKey } from '@/lib/server/task-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { message } = body;

    if (!message || !String(message).trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const tasks = await Task.find({ userId: resolveUserId(request, body) }).sort({ aiScore: -1 }).limit(20).lean();
    let reply = null;

    if (hasAnthropicKey()) {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const context = tasks
        .map((task) => `${task.title} (${task.course || 'No course'}) - ${task.category}, ${task.priority}, ${task.progress || 0}% done`)
        .join('\n');

      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: `Task context:\n${context}\n\nUser question: ${message}`,
            },
          ],
        });
        reply = response?.content?.[0]?.text?.trim() || null;
      } catch (error) {
        console.warn('Anthropic call failed:', error.message);
      }
    }

    if (!reply) {
      const topTask = tasks[0];
      if (!topTask) {
        reply = 'No tasks are available yet. Add tasks so I can give you better suggestions.';
      } else if (/deadline|due|urgent|today/i.test(message)) {
        const urgentTasks = tasks.filter(
          (task) =>
            task.priority === 'High' ||
            (task.deadline && new Date(task.deadline) - Date.now() <= 7 * 24 * 60 * 60 * 1000)
        );
        reply = urgentTasks.length
          ? `You have ${urgentTasks.length} urgent task(s): ${urgentTasks.map((task) => task.title).join(', ')}.`
          : `No tasks are critical right now. Keep progressing on "${topTask.title}".`;
      } else {
        const daysLeft = topTask.deadline ? Math.ceil((new Date(topTask.deadline) - Date.now()) / 86400000) : 'no';
        reply = `I suggest focusing on "${topTask.title}" (${topTask.category}, ${topTask.priority} priority) with ${daysLeft} days left.`;
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
