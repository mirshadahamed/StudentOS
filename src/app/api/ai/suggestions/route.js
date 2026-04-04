import { connectToDatabase } from "@/lib/mongoose";
import { resolveUserId } from "@/lib/auth.server";
import Task from "@/models/Task";

export async function GET(request) {
  await connectToDatabase();
  const userId = await resolveUserId(request);
  const tasks = await Task.find({ userId }).sort({ aiScore: -1 }).limit(8);

  const suggestions = tasks.map((task) => ({
    type: "plan",
    tag:
      task.priority === "High"
        ? "High Priority"
        : task.priority === "Medium"
          ? "Medium Priority"
          : "Low Priority",
    text: `${task.title} (${task.course || "No course"}) — due ${
      task.deadline ? new Date(task.deadline).toLocaleDateString() : "TBD"
    }`,
    detail: `Progress: ${task.progress || 0}%, AI score: ${task.aiScore || 0}.`,
    score: task.aiScore || 0,
    taskId: String(task._id),
    deadline: task.deadline,
    category: task.category,
    priority: task.priority,
  }));

  return Response.json(suggestions);
}
