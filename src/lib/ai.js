export async function generateWeeklyPlan(tasks, focusHoursPerDay = 4) {
  if (!process.env.ANTHROPIC_API_KEY || tasks.length === 0) {
    return null;
  }

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const taskContext = tasks
    .map((task) => {
      const days = task.deadline
        ? Math.ceil((new Date(task.deadline) - Date.now()) / 86400000)
        : null;
      return `- ${task.title} (${task.course || "No course"}, ${task.category}, due in ${
        days ?? "TBD"
      } days, ${task.progress}% done, ${task.priority} priority)`;
    })
    .join("\n");

  const prompt = `Today is ${today}. A university student has ${focusHoursPerDay} focus hours available per day.

Their active tasks:
${taskContext}

Create a 7-day study plan starting today.
Reply with JSON only in this shape:
[{"day":"Mon 1 Apr","focus":"Main task to work on","hours":2,"note":"Short practical note"}]`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const raw = response.content?.[0]?.text?.replace(/```json|```/g, "").trim();
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
