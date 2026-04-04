import { connectToDatabase } from "@/lib/mongoose";
import { resolveUserId } from "@/lib/auth.server";
import { jsonError, serializeDocument } from "@/lib/response";
import FocusSession from "@/models/FocusSession";

export async function POST(request) {
  await connectToDatabase();
  const body = await request.json();
  const userId = await resolveUserId(request, body);

  if (!body.durationMins || Number(body.durationMins) <= 0) {
    return jsonError("durationMins must be a positive number");
  }

  const record = await FocusSession.create({
    taskId: body.taskId || null,
    taskTitle: String(body.taskTitle || "").trim(),
    type: ["focus", "shortBreak", "longBreak"].includes(body.type) ? body.type : "focus",
    durationMins: Number(body.durationMins),
    userEmail: String(body.userEmail || "").trim(),
    userId,
    completedAt: new Date(),
  });

  return Response.json(serializeDocument(record), { status: 201 });
}
