import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

export async function POST(req) {
  const { text } = await req.json();

  const result = await hf.textClassification({
    model: "j-hartmann/emotion-english-distilroberta-base",
    inputs: text,
  });

  return Response.json(result);
}