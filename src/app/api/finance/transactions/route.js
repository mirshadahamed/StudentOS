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
}
