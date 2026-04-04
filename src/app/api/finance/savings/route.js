<<<<<<< HEAD
import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import Saving from "../../../models/Saving";
import {
  buildScopedFilter,
  getUserIdFromBody,
  getUserIdFromSearchParams,
  serializeDocument,
} from "../lib";

export async function GET(req) {
  try {
    await connectMongoDB();

    const userId = getUserIdFromSearchParams(req);
    const savings = await Saving.find(buildScopedFilter(userId))
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(savings.map(serializeDocument));
  } catch (error) {
    console.error("GET FINANCE SAVINGS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch savings" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const userId = getUserIdFromBody(body);

    await connectMongoDB();

    const saving = await Saving.create({
      userId,
      name: body.name,
      target: Number(body.target),
      current: Number(body.current || 0),
      color: body.color || "#a855f7",
      deadline: body.deadline || "",
    });

    return NextResponse.json(serializeDocument(saving), { status: 201 });
  } catch (error) {
    console.error("POST FINANCE SAVINGS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create savings goal" },
      { status: 400 }
    );
  }
=======
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
>>>>>>> productivity-task
}
