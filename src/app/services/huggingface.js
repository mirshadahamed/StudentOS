import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

/**
 * Analyze sentiment or emotion from text using Hugging Face
 * @param {string} text
 * @returns {Promise<Object>}
 */
export async function analyzeMood(text) {
  try {
    const result = await hf.textClassification({
      model: "j-hartmann/emotion-english-distilroberta-base",
      inputs: text,
    });

    // result example:
    // [{ label: "sadness", score: 0.92 }]

    const emotion = result[0];

    let mood = "neutral";

    if (emotion.label.includes("sad")) mood = "sad";
    else if (emotion.label.includes("joy")) mood = "happy";
    else if (emotion.label.includes("anger")) mood = "angry";
    else if (emotion.label.includes("fear")) mood = "anxious";

    return {
      mood,
      label: emotion.label,
      score: emotion.score,
    };

  } catch (error) {
    console.error("HuggingFace Error:", error);

    return {
      mood: "neutral",
      label: "unknown",
      score: 0,
    };
  }
}