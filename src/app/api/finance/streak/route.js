import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import Transaction from "../../../models/Transaction";
import { buildScopedFilter, getUserIdFromSearchParams } from "../lib";

function startOfWeek(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy.getTime();
}

export async function GET(req) {
  try {
    await connectMongoDB();

    const userId = getUserIdFromSearchParams(req);
    const expenses = await Transaction.find(
      buildScopedFilter(userId, { type: "expense" })
    )
      .select("date")
      .sort({ date: -1 })
      .lean();

    if (expenses.length === 0) {
      return NextResponse.json({ streak: 0 });
    }

    let currentStreak = 0;
    let expectedWeekStart = startOfWeek(new Date());
    const countedWeeks = new Set();

    for (const expense of expenses) {
      const txWeekStart = startOfWeek(expense.date);

      if (txWeekStart === expectedWeekStart && !countedWeeks.has(txWeekStart)) {
        currentStreak += 1;
        countedWeeks.add(txWeekStart);
        expectedWeekStart -= 7 * 24 * 60 * 60 * 1000;
      } else if (txWeekStart < expectedWeekStart) {
        break;
      }
    }

    return NextResponse.json({ streak: currentStreak });
  } catch (error) {
    console.error("GET FINANCE STREAK ERROR:", error);

    return NextResponse.json(
      { error: "Failed to calculate streak" },
      { status: 500 }
    );
  }
}
