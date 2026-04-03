import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "GEMINI_API_KEY is missing" },
        { status: 500 }
      );
    }

    const parsedAmount = Number(amount);

    if (!parsedAmount || Number.isNaN(parsedAmount)) {
      return Response.json(
        { error: "A valid amount is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Act as an expert financial advisor in Sri Lanka. A university student has a surplus of LKR ${parsedAmount}. Provide exactly 3 diverse investment options available ONLY in Sri Lanka. Return valid JSON only.`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    const cleanedJson = textResponse.replace(/```json|```/g, "").trim();

    return Response.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error("POST FINANCE ADVISOR ERROR:", error);

    return Response.json(
      { error: "AI advisor request failed" },
      { status: 500 }
    );
  }
}
