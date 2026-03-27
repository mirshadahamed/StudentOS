import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return Response.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const result = await hf.textClassification({
      model: "j-hartmann/emotion-english-distilroberta-base",
      inputs: text,
    });

    // Get highest scoring emotion
    const topEmotion = result.sort((a, b) => b.score - a.score)[0];
    const emotion = topEmotion.label.toLowerCase();

    // Map emotion → label + mood
    let label = "neutral";
    let mood = "neutral";

    if (emotion.includes("joy") || emotion.includes("love")) {
      label = "positive";
      mood = "happy";
    } else if (emotion.includes("sad")) {
      label = "negative";
      mood = "sad";
    } else if (emotion.includes("anger")) {
      label = "negative";
      mood = "angry";
    } else if (emotion.includes("fear")) {
      label = "negative";
      mood = "anxious";
    }

    return Response.json({
      emotion,
      mood,     // 🔥 used in frontend auto-selection
      label,
      score: topEmotion.score,
    });

  } catch (error) {
    console.error("HF ERROR:", error);

    return Response.json(
      { error: "Mood analysis failed" },
      { status: 500 }
    );
  }
}