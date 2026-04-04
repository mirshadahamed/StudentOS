import { connectToDatabase } from "@/lib/mongoose";
import { resolveUserId } from "@/lib/auth.server";
import { serializeDocument } from "@/lib/response";
import FocusSession from "@/models/FocusSession";

export async function GET(request) {
  await connectToDatabase();
  const userId = await resolveUserId(request);
  const sessions = await FocusSession.find({ userId }).sort({ completedAt: -1 }).limit(30);
  return Response.json(serializeDocument(sessions));
}
