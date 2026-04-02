import { NextResponse } from "next/server";
import connectMongoDB from "../../libs/mongodb";
import Mood from "../../models/Mood";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // ✅ Explicitly select fields (including intensity + factors)
    const moods = await Mood.find({ userId })
      .select("userId mood text score intensity factors createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(moods);

  } catch (error) {
    console.error("GET MOODS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch moods" },
      { status: 500 }
    );
  }
}