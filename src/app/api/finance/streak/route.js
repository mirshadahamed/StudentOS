import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import Transaction from "../../../models/Transaction";

function getUserId(req) {
  const { searchParams } = new URL(req.url);
  return searchParams.get("userId") || "";
}

function startOfWeek(input) {
  const date = new Date(input);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay());
  return date.getTime();
}

export async function GET(req) {
  try {
    await connectMongoDB();
    const userId = getUserId(req);
    const query = userId ? { userId, type: "expense" } : { type: "expense" };
    const expenses = await Transaction.find(query).select("date").sort({ date: -1 }).lean();

    if (expenses.length === 0) {
      return NextResponse.json({ streak: 0 });
    }

    let currentStreak = 0;
    let expectedWeek = startOfWeek(new Date());
    const seenWeeks = new Set();

    for (const item of expenses) {
      const week = startOfWeek(item.date);
      if (week === expectedWeek && !seenWeeks.has(week)) {
        currentStreak += 1;
        seenWeeks.add(week);
        expectedWeek -= 7 * 24 * 60 * 60 * 1000;
      } else if (week < expectedWeek) {
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
