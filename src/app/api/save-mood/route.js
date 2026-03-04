import connectMongoDB from "../../libs/mongodb";
import Mood from "../../models/Mood";

export async function POST(req) {
  const { userId, mood, text, score } = await req.json();

  await connectMongoDB();

  await Mood.create({
    userId,
    mood,
    text,
    score,
  });

  return Response.json({ message: "Mood saved" });
}