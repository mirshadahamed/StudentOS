import connectMongoDB from "../../libs/mongodb";
import Mood from "../../models/Mood";
import { analyzeMood } from "../../services/huggingface";

export async function POST(req) {

  try {

    const { userId, text = "", mood, score, intensity, factors = [] } = await req.json();

    await connectMongoDB();

    // Trust explicit mood selected in frontend (emoji click).
    // Only use HuggingFace as fallback when mood is not provided.
    let finalMood = mood;
    let finalScore = typeof score === "number" ? score : 0;

    if (!finalMood) {
      const analysis = await analyzeMood(text);
      finalMood = analysis.mood;
      finalScore = analysis.confidence;
    }

    const normalizedMood =
      typeof finalMood === "string" && finalMood.trim()
        ? finalMood.trim().toLowerCase()
        : "neutral";

    const moodEntry = await Mood.create({
      userId,
      text,
      mood: normalizedMood,
      score: finalScore,
      intensity: typeof intensity === "number" ? intensity : undefined,
      factors: Array.isArray(factors) ? factors : [],
      createdAt: new Date()
    });

    return Response.json({
      success: true,
      mood: moodEntry
    });

  } catch (error) {

    console.error("Save Mood Error:", error);

    return Response.json(
      { error: "Failed to save mood" },
      { status: 500 }
    );

  }

}
