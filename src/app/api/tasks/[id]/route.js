import { connectToDatabase } from "@/lib/mongoose";
import { jsonError, serializeDocument } from "@/lib/response";
import { resolveUserId } from "@/lib/auth.server";
import Task from "@/models/Task";

export async function PATCH(request, { params }) {
  await connectToDatabase();
  const body = await request.json();
  const userId = await resolveUserId(request, body);
  const { id } = await params;
  const task = await Task.findOne({ _id: id, userId });

  if (!task) {
    return jsonError("Task not found", 404);
  }

  Object.assign(task, body);
  await task.save();
  return Response.json(serializeDocument(task));
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  const userId = await resolveUserId(request);
  const { id } = await params;
  const deleted = await Task.findOneAndDelete({ _id: id, userId });

  if (!deleted) {
    return jsonError("Task not found", 404);
  }

  return Response.json({ success: true });
}
