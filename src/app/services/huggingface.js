import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

/**
 * Analyze emotion from text using Hugging Face
 * @param {string} text
 * @returns {Promise<Object>}
 */

export async function analyzeMood(text) {

  try {

    const result = await hf.textClassification({
      model: "j-hartmann/emotion-english-distilroberta-base",
      inputs: text,
    });

    /**
     Example response:
     [
       { label: "sadness", score: 0.91 },
       { label: "joy", score: 0.02 }
     ]
    */

    const emotion = result[0]; // highest score

    let mood = "neutral";
    let risk = false;

    switch (emotion.label) {

      case "sadness":
        mood = "sad";
        if (emotion.score > 0.75) risk = true;
        break;

      case "joy":
        mood = "happy";
        break;

      case "anger":
        mood = "angry";
        break;

      case "fear":
        mood = "anxious";
        break;

      case "surprise":
        mood = "neutral";
        break;

      case "disgust":
        mood = "angry";
        break;

      default:
        mood = "neutral";

    }

    return {
      mood,
      emotion: emotion.label,
      confidence: emotion.score,
      risk,
    };

  } catch (error) {

    console.error("HuggingFace Error:", error);

    return {
      mood: "neutral",
      emotion: "unknown",
      confidence: 0,
      risk: false,
    };

  }

}