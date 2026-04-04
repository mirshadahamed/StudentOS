import { connectToDatabase } from "@/lib/mongoose";
import { buildFinanceSummary, endOfMonth, startOfMonth } from "@/lib/finance";
import { resolveUserId } from "@/lib/auth.server";
import { jsonError, serializeDocument } from "@/lib/response";
import { createTransaction } from "@/lib/transaction-service";
import Transaction from "@/models/Transaction";

export async function GET(request) {
  await connectToDatabase();
  const userId = await resolveUserId(request);
  const from = startOfMonth();
  const to = endOfMonth();
  const monthTransactions = await Transaction.find({
    userId,
    date: { $gte: from, $lte: to },
  }).sort({ date: -1 });

  const savingsTransactions = monthTransactions.filter((item) => item.type === "savings");
  const summary = buildFinanceSummary(monthTransactions);

  return Response.json({
    summary,
    transactions: serializeDocument(savingsTransactions),
    recommendedSavingsRate: summary.income > 0 ? Math.round((summary.savings / summary.income) * 100) : 0,
  });
}

export async function POST(request) {
  await connectToDatabase();
  const body = await request.json();
  const userId = await resolveUserId(request, body);
  const { transaction, error, status } = await createTransaction({ ...body, type: "savings" }, userId);

  if (error) {
    return jsonError(error, status);
  }

  return Response.json(serializeDocument(transaction), { status: 201 });
}
