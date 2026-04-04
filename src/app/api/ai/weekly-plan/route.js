import { connectToDatabase } from "@/lib/mongoose";
import { resolveUserId } from "@/lib/auth.server";
import { generateWeeklyPlan } from "@/lib/ai";
import Task from "@/models/Task";

export async function GET(request) {
  await connectToDatabase();
  const userId = await resolveUserId(request);
  const tasks = await Task.find({ userId, isCompleted: false }).sort({ aiScore: -1 }).limit(20);
  let plan = await generateWeeklyPlan(tasks, 4);

  if (!plan || !Array.isArray(plan)) {
    const today = new Date();
    plan = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(day.getDate() + index);
      const task = tasks[index] || tasks[0];

      return {
        day: day.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        focus: task
          ? `Work on: ${task.title} (${task.progress || 0}% complete)`
          : "Rest and review progress",
        hours: task ? 1.5 : 0.5,
        note: task ? `Aim to make 10% progress on "${task.title}"` : "No tasks available",
      };
    });
  }

  return Response.json(plan);
}
