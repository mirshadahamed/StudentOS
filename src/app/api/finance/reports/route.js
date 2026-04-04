import { connectToDatabase } from "@/lib/mongoose";
import { buildFinanceSummary } from "@/lib/finance";
import { resolveUserId } from "@/lib/auth.server";
import Transaction from "@/models/Transaction";

export async function GET(request) {
  await connectToDatabase();
  const userId = await resolveUserId(request);
  const transactions = await Transaction.find({ userId }).sort({ date: -1 });
  const summary = buildFinanceSummary(transactions);
  const byCategory = {};
  const byMonth = {};

  transactions.forEach((item) => {
    const monthKey = new Date(item.date).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
    const categoryKey = `${item.type}:${item.category}`;

    byCategory[categoryKey] = (byCategory[categoryKey] || 0) + item.amount;
    if (!byMonth[monthKey]) {
      byMonth[monthKey] = { income: 0, expense: 0, savings: 0 };
    }
    byMonth[monthKey][item.type] += item.amount;
  });

  return Response.json({
    summary,
    byCategory: Object.entries(byCategory)
      .map(([key, total]) => {
        const [type, category] = key.split(":");
        return { type, category, total };
      })
      .sort((left, right) => right.total - left.total),
    byMonth: Object.entries(byMonth).map(([month, totals]) => ({
      month,
      ...totals,
    })),
  });
}
