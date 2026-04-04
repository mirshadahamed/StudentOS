import { connectToDatabase } from "@/lib/mongoose";
import { resolveUserId } from "@/lib/auth.server";
import { jsonError } from "@/lib/response";
import Task from "@/models/Task";

export async function POST(request) {
  await connectToDatabase();
  const body = await request.json();
  const userId = await resolveUserId(request, body);

  if (!body.message || !String(body.message).trim()) {
    return jsonError("Message is required");
  }

  const tasks = await Task.find({ userId }).sort({ aiScore: -1 }).limit(20);
  let reply;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const context = tasks
        .map(
          (task) =>
            `${task.title} (${task.course || "No course"}) - ${task.category}, ${task.priority}, ${
              task.progress || 0
            }% done`,
        )
        .join("\n");
      const prompt = `Task context:\n${context}\n\nUser question: ${body.message}`;
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      });
      reply = response?.content?.[0]?.text?.trim();
    } catch {
      reply = undefined;
    }
  }

  if (!reply) {
    const top = tasks[0];

    if (!tasks.length) {
      reply = "No tasks are available yet. Add tasks so I can give you better suggestions.";
    } else if (/deadline|due|urgent|today/i.test(body.message)) {
      const urgent = tasks.filter(
        (task) =>
          task.priority === "High" ||
          (task.deadline && new Date(task.deadline) - Date.now() <= 7 * 86400000),
      );
      reply = urgent.length
        ? `You have ${urgent.length} urgent task(s): ${urgent.map((task) => task.title).join(", ")}.`
        : `No tasks are critical right now. Keep progressing on "${top.title}".`;
    } else {
      const daysLeft = top.deadline
        ? Math.ceil((new Date(top.deadline) - Date.now()) / 86400000)
        : "TBD";
      reply = `I suggest focusing on "${top.title}" (${top.category}, ${top.priority} priority) with ${daysLeft} days left.`;
    }
  }

  return Response.json({ reply });
}
