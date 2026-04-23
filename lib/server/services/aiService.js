import Anthropic from '@anthropic-ai/sdk';

let cachedClient = null;

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (cachedClient) return cachedClient;
  cachedClient = new Anthropic({ apiKey });
  return cachedClient;
}

export async function getAIPriorityScore({ title, course, category, deadline }) {
  const client = getClient();
  if (!client) return 'Medium';

  const daysLeft = deadline ? Math.ceil((new Date(deadline) - Date.now()) / 86400000) : null;

  const prompt = `A university student is adding a task to their planner.

Task: "${title}"
Course: ${course || 'Unknown'}
Category: ${category || 'Assignment'}
Days until deadline: ${daysLeft ?? 'No deadline set'}

Based on these factors, assign a priority level.
Rules:
- High: Exams, presentations, or projects due within 7 days
- Medium: Assignments due 8–21 days away, or ongoing projects
- Low: Tasks with no deadline, or low-stakes work

Reply with ONLY one word: High, Medium, or Low.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 10,
    messages: [{ role: 'user', content: prompt }],
  });

  const result = response?.content?.[0]?.text?.trim();
  if (['High', 'Medium', 'Low'].includes(result)) return result;
  return 'Medium';
}

export async function generateWeeklyPlan({ tasks, focusHoursPerDay = 4 }) {
  const client = getClient();
  if (!client) return null;

  const now = Date.now();
  const taskContext = tasks
    .map((t) => {
      const days = t.deadline ? Math.ceil((new Date(t.deadline) - now) / 86400000) : null;
      return `- ${t.title} (${t.course}, ${t.category}, due in ${days ?? 'TBD'} days, ${t.progress}% done, ${t.priority} priority)`;
    })
    .join('\n');

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const prompt = `Today is ${today}. A university student has ${focusHoursPerDay} focus hours available per day.

Their active tasks:
${taskContext}

Create a 7-day study plan starting today.
Rules:
- Prioritise tasks by urgency (deadline proximity) and priority level
- Distribute work realistically — no more than ${focusHoursPerDay}h of deep work per day
- Schedule lighter tasks on days adjacent to heavy ones
- Include brief notes on what specifically to work on each day

Reply with a JSON array ONLY (no markdown):
[{ "day": "Monday 28 Mar", "tasks": [{ "title": "task name", "action": "specific thing to do today", "estimatedHours": 1.5 }] }]`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  try {
    const raw = response?.content?.[0]?.text?.replace(/```json|```/g, '').trim();
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function detectOverload(tasks) {
  const now = Date.now();
  const weekBuckets = {};

  tasks.forEach((t) => {
    if (!t.deadline) return;
    const days = Math.ceil((new Date(t.deadline) - now) / 86400000);
    const weekNum = Math.floor(days / 7);
    if (!weekBuckets[weekNum]) weekBuckets[weekNum] = [];
    weekBuckets[weekNum].push(t);
  });

  const overloaded = [];
  for (const [week, weekTasks] of Object.entries(weekBuckets)) {
    if (weekTasks.length >= 3) {
      overloaded.push({
        weeksFromNow: Number(week),
        count: weekTasks.length,
        tasks: weekTasks.map((t) => t.title),
        warning: `Week ${Number(week) + 1} has ${weekTasks.length} deadlines. Consider starting early.`,
      });
    }
  }

  return overloaded;
}

