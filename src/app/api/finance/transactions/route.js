import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import Transaction from "../../../models/Transaction";

function serialize(transaction) {
  const plain =
    typeof transaction.toObject === "function"
      ? transaction.toObject()
      : transaction;
  const { _id, __v, ...rest } = plain;
  return { ...rest, id: _id.toString() };
}

function getUserId(req) {
  const { searchParams } = new URL(req.url);
  return searchParams.get("userId") || "";
}

export async function GET(req) {
  try {
    await connectMongoDB();
    const userId = getUserId(req);
    const query = userId ? { userId } : {};
    const transactions = await Transaction.find(query).sort({ date: -1 }).lean();
    return NextResponse.json(transactions.map(serialize));
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
    await connectMongoDB();

    const transaction = await Transaction.create({
      userId: body.userId || "",
      title: body.title,
      amount: Number(body.amount),
      type: body.type,
      category: body.category || "Misc",
      status: body.status || "",
      dueDate: body.dueDate || "",
      isRecurring: Boolean(body.isRecurring),
    });

    return NextResponse.json(serialize(transaction), { status: 201 });
  } catch (error) {
    console.error("POST FINANCE TRANSACTIONS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 400 }
    );
  }
}
