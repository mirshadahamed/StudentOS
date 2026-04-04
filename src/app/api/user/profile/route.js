import { connectToDatabase } from "@/lib/mongoose";
import { serializeDocument } from "@/lib/response";
import User from "@/models/User";

export async function GET(request) {
  await connectToDatabase();

  const email =
    request.headers.get("x-user-email") ||
    request.nextUrl.searchParams.get("email") ||
    "";

  let user = null;

  if (email) {
    user = await User.findOne({ email }).lean();
  }

  if (!user) {
    user = await User.findOne().sort({ createdAt: 1 }).lean();
  }

  return Response.json(
    user
      ? serializeDocument(user)
      : { name: "Student", email: "", phone: "" },
  );
}
