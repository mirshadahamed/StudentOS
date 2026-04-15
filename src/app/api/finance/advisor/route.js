import { GoogleGenerativeAI } from "@google/generative-ai";
import connectMongoDB from "../../../libs/mongodb";
import Saving from "../../../models/Saving";
import Split from "../../../models/Split";
import Transaction from "../../../models/Transaction";

export const runtime = "nodejs";
const ADVISOR_MODEL = "gemini-2.5-flash";
const MAX_GENERATION_ATTEMPTS = 3;

function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function summarizeCategories(transactions) {
  const totals = {};

  for (const item of transactions) {
    const category = item.category || "Misc";
    totals[category] = (totals[category] || 0) + safeNumber(item.amount);
  }

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, amount]) => ({
      name,
      amount,
    }));
}

function buildSnapshot({ incomes, expenses, savings, splits, requestedAmount }) {
  const totalIncome = incomes.reduce((sum, item) => sum + safeNumber(item.amount), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + safeNumber(item.amount), 0);
  const totalSavings = savings.reduce((sum, item) => sum + safeNumber(item.current), 0);
  const totalSavingsTarget = savings.reduce((sum, item) => sum + safeNumber(item.target), 0);
  const totalSplitBills = splits.reduce((sum, item) => sum + safeNumber(item.total_amount), 0);
  const monthlySurplus = Math.max(totalIncome - totalExpenses, 0);
  const recommendedDeployableAmount = requestedAmount > 0 ? requestedAmount : monthlySurplus;
  const savingsProgress =
    totalSavingsTarget > 0 ? Math.round((totalSavings / totalSavingsTarget) * 100) : null;

  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    totalSavingsTarget,
    totalSplitBills,
    monthlySurplus,
    requestedAmount,
    recommendedDeployableAmount,
    savingsProgress,
    recurringIncomeCount: incomes.filter((item) => Boolean(item.isRecurring)).length,
    recurringExpenseCount: expenses.filter((item) => Boolean(item.isRecurring)).length,
    topExpenseCategories: summarizeCategories(expenses),
    incomeSources: incomes.slice(0, 5).map((item) => ({
      title: item.title,
      amount: safeNumber(item.amount),
      category: item.category || "Misc",
    })),
    savingsGoals: savings.slice(0, 5).map((item) => ({
      name: item.name,
      current: safeNumber(item.current),
      target: safeNumber(item.target),
      deadline: item.deadline || "",
    })),
  };
}

function buildPrompt(snapshot, hasUserHistory) {
  const deployableAmount = snapshot.recommendedDeployableAmount;
  const contextMode = hasUserHistory
    ? "Use the user's own finance dashboard data to tailor the advice."
    : "No dashboard history is available, so rely mainly on the entered amount.";

  return `
You are an expert financial advisor focused on Sri Lankan options for a university student.
${contextMode}

Important rules:
- Use only financial products or approaches available in Sri Lanka.
- Be practical for a student or early-career user.
- Consider income stability, spending pressure, savings progress, and available surplus.
- If the user's surplus is small or cash flow is tight, prioritize liquidity and emergency-buffer advice.
- Provide exactly 3 diverse strategies.
- Keep explanations concise but specific.
- Return valid JSON only, with no markdown fences.

Return JSON in exactly this shape:
{
  "advisor_note": "1-3 sentence summary tailored to the user's finances",
  "investment_options": [
    {
      "id": "low-risk",
      "category": "Low Risk",
      "estimatedReturn": "range or short label",
      "title": "strategy title",
      "explanation": "why it fits this user"
    }
  ]
}

The array must contain exactly 3 items spanning conservative, balanced, and growth-oriented choices where appropriate.

User finance snapshot:
${JSON.stringify(
    {
      currency: "LKR",
      deployableAmount,
      ...snapshot,
    },
    null,
    2
  )}
`.trim();
}

function parseGeminiJson(text) {
  const cleaned = text.replace(/```json|```/gi, "").trim();
  return JSON.parse(cleaned);
}

function getProviderStatus(error) {
  return (
    error?.status ||
    error?.response?.status ||
    error?.cause?.status ||
    null
  );
}

function getProviderMessage(error) {
  return (
    error?.message ||
    error?.statusText ||
    ""
  );
}

function isQuotaExceededError(error) {
  const status = getProviderStatus(error);
  const message = getProviderMessage(error).toLowerCase();

  return (
    status === 429 &&
    (message.includes("quota exceeded") ||
      message.includes("exceeded your current quota") ||
      message.includes("free_tier_requests") ||
      message.includes("billing details"))
  );
}

function isRetryableProviderError(error) {
  const status = getProviderStatus(error);
  if (isQuotaExceededError(error)) return false;
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateAdvisorContent(model, prompt) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    try {
      const result = await model.generateContent(prompt);
      return parseGeminiJson(result.response.text());
    } catch (error) {
      lastError = error;

      if (!isRetryableProviderError(error) || attempt === MAX_GENERATION_ATTEMPTS) {
        break;
      }

      await sleep(600 * attempt);
    }
  }

  throw lastError;
}

export async function POST(req) {
  try {
    const { amount, userId = "" } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    await connectMongoDB();

    const query = userId ? { userId } : {};
    const [transactions, savings, splits] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).lean(),
      Saving.find(query).sort({ date: -1 }).lean(),
      Split.find(query).sort({ date: -1 }).lean(),
    ]);

    const incomes = transactions.filter(
      (item) => String(item.type || "").toLowerCase() === "income"
    );
    const expenses = transactions.filter(
      (item) => String(item.type || "").toLowerCase() !== "income"
    );

    const requestedAmount = safeNumber(amount);
    const snapshot = buildSnapshot({
      incomes,
      expenses,
      savings,
      splits,
      requestedAmount,
    });

    if (snapshot.recommendedDeployableAmount <= 0) {
      return Response.json(
        {
          error:
            "Add an amount or record income in the dashboard so the advisor can estimate usable surplus.",
        },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: ADVISOR_MODEL });
    const prompt = buildPrompt(snapshot, Boolean(userId) && transactions.length > 0);
    const parsed = await generateAdvisorContent(model, prompt);

    return Response.json({
      ...parsed,
      finance_snapshot: snapshot,
    });
  } catch (error) {
    console.error("POST FINANCE ADVISOR ERROR:", error);

    if (isQuotaExceededError(error)) {
      return Response.json(
        {
          error:
            "The AI advisor has reached its current Gemini quota limit. Please try again later or switch to a higher API quota plan.",
        },
        { status: 429 }
      );
    }

    if (isRetryableProviderError(error)) {
      return Response.json(
        {
          error:
            "The AI advisor is temporarily busy right now. Please try again in a moment.",
        },
        { status: 503 }
      );
    }

    return Response.json(
      { error: "AI advisor request failed" },
      { status: 500 }
    );
  }
}
