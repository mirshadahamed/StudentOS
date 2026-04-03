import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import Transaction from "../../../models/Transaction";
import {
  buildScopedFilter,
  getUserIdFromSearchParams,
  serializeDocument,
} from "../lib";

export async function GET(req) {
  try {
    await connectMongoDB();

    const userId = getUserIdFromSearchParams(req);
    const transactions = await Transaction.find(buildScopedFilter(userId))
      .sort({ date: -1 })
      .lean();

    const serializedTransactions = transactions.map(serializeDocument);

    const totalIncome = serializedTransactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const totalExpense = serializedTransactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const netBalance = totalIncome - totalExpense;

    const categoryTotals = serializedTransactions
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => {
        const key = item.category || "Other";
        acc[key] = (acc[key] || 0) + (item.amount || 0);
        return acc;
      }, {});

    const categoryData = Object.entries(categoryTotals).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return NextResponse.json({
      transactions: serializedTransactions,
      totalIncome,
      totalExpense,
      netBalance,
      barChartData: [
        { name: "Income", amount: totalIncome, fill: "#10b981" },
        { name: "Expenses", amount: totalExpense, fill: "#ef4444" },
      ],
      categoryData,
    });
  } catch (error) {
    console.error("GET FINANCE REPORTS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch finance reports" },
      { status: 500 }
    );
  }
}
