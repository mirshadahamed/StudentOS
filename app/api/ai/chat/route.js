import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { connectMongoose, isMongoConfigured } from '@/lib/server/mongoose';
import { resolveUserId } from '@/lib/server/defaultUser';
import { Task } from '@/lib/server/models/task';
import { topTasks } from '@/lib/server/taskStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const { message, history = [], userId: rawUserId } = body ?? {};
    const requestedUserId = String(rawUserId ?? '').trim();
    const userId = await resolveUserId(requestedUserId);
    if (!message || !String(message).trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let tasks;
    if (!isMongoConfigured()) {
      tasks = await topTasks({ limit: 20, userId });
    } else {
      await connectMongoose();
      const filter = {};
      if (userId) filter.userId = userId;
      tasks = await Task.find(filter).sort({ aiScore: -1 }).limit(20).lean();
    }
    let reply;

    if (process.env.ANTHROPIC_API_KEY) {
      const context = tasks
        .map((t) => `${t.title} (${t.course || 'No course'}) - ${t.category}, ${t.priority}, ${t.progress || 0}% done`)
        .join('\n');
      const prompt = `Task context:\n${context}\n\nUser question: ${message}`;

      try {
        const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const response = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [{ role: 'user', content: prompt }],
        });
        reply = response?.content?.[0]?.text?.trim();
      } catch (apiErr) {
        console.warn('[ai/chat] Anthropic call failed:', apiErr.message);
      }
    }

    if (!reply) {
      const top = tasks[0];
      if (!tasks.length) {
        reply = 'No tasks are available yet. Add tasks so I can give you better suggestions.';
      } else if (/deadline|due|urgent|today/i.test(message)) {
        const urgent = tasks.filter(
          (t) =>
            t.priority === 'High' || (t.deadline && new Date(t.deadline) - Date.now() <= 7 * 24 * 60 * 60 * 1000)
        );
        reply = urgent.length
          ? `You have ${urgent.length} urgent task(s): ${urgent.map((t) => t.title).join(', ')}.`
          : `No tasks are critical right now. Keep progressing on '${top.title}'.`;
      } else {
        const daysLeft = top.deadline ? Math.ceil((new Date(top.deadline) - Date.now()) / 86400000) : 'TBD';
        reply = `I suggest focusing on '${top.title}' (${top.category}, ${top.priority} priority) with ${daysLeft} days left.`;
      }
    }

    return NextResponse.json({ reply, history });
  } catch (err) {
    console.error('[ai/chat] error:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
