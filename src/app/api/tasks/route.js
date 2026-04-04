import { connectToDatabase } from "@/lib/mongoose";
import { jsonError, serializeDocument } from "@/lib/response";
import { resolveUserId } from "@/lib/auth.server";
import Task from "@/models/Task";

const parseBool = (value) => value === "true" || value === "1" || value === true;

export async function GET(request) {
  await connectToDatabase();
  const userId = await resolveUserId(request);
  const { searchParams } = request.nextUrl;
  const filter = { userId };

  if (searchParams.get("completed") != null) {
    filter.isCompleted = parseBool(searchParams.get("completed"));
  }
  if (searchParams.get("priority")) {
    filter.priority = searchParams.get("priority");
  }
  if (searchParams.get("category")) {
    filter.category = searchParams.get("category");
  }
  if (searchParams.get("course")) {
    filter.course = searchParams.get("course");
  }

  const tasks = await Task.find(filter).sort({ deadline: 1, aiScore: -1, updatedAt: -1 });
  return Response.json(serializeDocument(tasks));
}

export async function POST(request) {
  await connectToDatabase();
  const body = await request.json();
  const userId = await resolveUserId(request, body);

  if (!body.title || !String(body.title).trim()) {
    return jsonError("Task title is required");
  }

  const task = await Task.create({
    title: String(body.title).trim(),
    course: body.course || "",
    category: body.category || "Assignment",
    priority: ["High", "Medium", "Low"].includes(body.priority) ? body.priority : "Medium",
    deadline: body.deadline ? new Date(body.deadline) : null,
    progress: Number(body.progress) || 0,
    userEmail: body.userEmail || "",
    userId,
  });

  return Response.json(serializeDocument(task), { status: 201 });
}
