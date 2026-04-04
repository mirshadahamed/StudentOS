import { connectToDatabase } from "@/lib/mongoose";
import { resolveUserId } from "@/lib/auth.server";
import Task from "@/models/Task";

export async function GET(request) {
  await connectToDatabase();
  const userId = await resolveUserId(request);
  const tasks = await Task.find({ userId });
  const now = new Date();
  const total = tasks.length;
  const completed = tasks.filter((task) => task.isCompleted).length;
  const pending = total - completed;

  const critical = tasks.filter((task) => {
    if (task.isCompleted || !task.deadline) return false;
    const days = Math.ceil((new Date(task.deadline) - now) / 86400000);
    return days <= 7;
  }).length;

  const overdue = tasks.filter((task) => {
    if (task.isCompleted || !task.deadline) return false;
    return new Date(task.deadline) < now;
  }).length;

  const weekTasks = tasks.filter((task) => {
    if (!task.deadline) return false;
    const days = Math.ceil((new Date(task.deadline) - now) / 86400000);
    return days >= 0 && days <= 7;
  }).length;

  const prodScore = total
    ? Math.round(tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / total)
    : 0;
  const avgAiScore = total
    ? Math.round(tasks.reduce((sum, task) => sum + (task.aiScore || 0), 0) / total)
    : 0;

  return Response.json({
    total,
    completed,
    pending,
    critical,
    overdue,
    weekTasks,
    prodScore,
    avgAiScore,
  });
}
