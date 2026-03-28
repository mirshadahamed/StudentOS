import connectMongoDB from "../../libs/mongodb";
import Mood from "../../models/Mood";

export async function POST(req) {

  const { userId } = await req.json();

  await connectMongoDB();

  // 4 minutes instead of 4 days (testing)
  const fourMinutesAgo = new Date(
    Date.now() - 4 * 60 * 1000
  );

  const sadCount = await Mood.countDocuments({
    userId,
    mood: "sad",
    createdAt: { $gte: fourMinutesAgo },
  });

  if (sadCount >= 4) {
    return Response.json({
      danger: true,
      message: "⚠️ The user might need support due to consistent low mood entries."
    });
  }

  return Response.json({ danger: false });

}