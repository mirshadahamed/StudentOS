import connectMongoDB from "../../libs/mongodb";
import Mood from "../../models/Mood";

export async function POST(req) {
  const { userId } = await req.json();

  await connectMongoDB();

  const fourDaysAgo = new Date(
    Date.now() - 4 * 24 * 60 * 60 * 1000
  );

  const sadCount = await Mood.countDocuments({
    userId,
    mood: "sad",
    createdAt: { $gte: fourDaysAgo },
  });

  if (sadCount >= 4) {
    return Response.json({ danger: true });
  }

  return Response.json({ danger: false });
}