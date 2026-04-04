<<<<<<< HEAD
import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import Transaction from "../../../models/Transaction";
import {
  buildScopedFilter,
  getUserIdFromBody,
  getUserIdFromSearchParams,
  serializeDocument,
} from "../lib";

export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const userId = getUserIdFromSearchParams(req);
    const type = searchParams.get("type");
    const filter = buildScopedFilter(userId, type ? { type } : {});

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(transactions.map(serializeDocument));
  } catch (error) {
    console.error("GET FINANCE TRANSACTIONS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const userId = getUserIdFromBody(body);

    await connectMongoDB();

    const transaction = await Transaction.create({
      userId,
      title: body.title,
      amount: Number(body.amount),
      type: body.type,
      category: body.category || "Misc",
      status: body.status || "",
      dueDate: body.dueDate || "",
      isRecurring: Boolean(body.isRecurring),
      date: body.date || undefined,
    });

    return NextResponse.json(serializeDocument(transaction), { status: 201 });
  } catch (error) {
    console.error("POST FINANCE TRANSACTIONS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 400 }
    );
  }
=======
import { connectToDatabase } from "@/lib/mongoose";
import { getDateRange } from "@/lib/finance";
import { resolveUserId } from "@/lib/auth.server";
import { jsonError, serializeDocument } from "@/lib/response";
import { createTransaction } from "@/lib/transaction-service";
import Transaction from "@/models/Transaction";

export async function GET(request) {
  await connectToDatabase();
  const userId = await resolveUserId(request);
  const { searchParams } = request.nextUrl;
  const filter = {
    userId,
    ...getDateRange(searchParams),
  };

  if (searchParams.get("type")) {
    filter.type = searchParams.get("type");
  }
  if (searchParams.get("category")) {
    filter.category = searchParams.get("category");
  }

  const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
  return Response.json(serializeDocument(transactions));
}

export async function POST(request) {
  await connectToDatabase();
  const body = await request.json();
  const userId = await resolveUserId(request, body);
  const { transaction, error, status } = await createTransaction(body, userId);

  if (error) {
    return jsonError(error, status);
  }

  return Response.json(serializeDocument(transaction), { status: 201 });
>>>>>>> productivity-task
}
