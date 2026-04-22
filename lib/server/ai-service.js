import Anthropic from '@anthropic-ai/sdk';

import { hasAnthropicKey } from '@/lib/server/task-utils';

function getClient() {
  if (!hasAnthropicKey()) {
    return null;
  }

  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export async function generateWeeklyPlan({ tasks, focusHoursPerDay = 4 }) {
  const client = getClient();
  if (!client || tasks.length === 0) {
    return null;
  }

  const now = Date.now();
  const taskContext = tasks
    .map((task) => {
      const days = task.deadline ? Math.ceil((new Date(task.deadline) - now) / 86400000) : 'TBD';
      return `- ${task.title} (${task.course || 'No course'}, ${task.category}, due in ${days} days, ${task.progress || 0}% done, ${task.priority} priority)`;
    })
    .join('\n');

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const prompt = `Today is ${today}. A university student has ${focusHoursPerDay} focus hours available per day.

Their active tasks:
${taskContext}

Create a 7-day study plan starting today.
Rules:
- Prioritise tasks by urgency and priority level
- Keep each day realistic within ${focusHoursPerDay}h
- Include specific actions, not generic advice

Reply with a JSON array only.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  try {
    const raw = response.content?.[0]?.text?.replace(/```json|```/g, '').trim();
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
