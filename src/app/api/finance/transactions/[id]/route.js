import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import Transaction from "../../../../models/Transaction";

function serialize(transaction) {
  const plain =
    typeof transaction.toObject === "function"
      ? transaction.toObject()
      : transaction;
  const { _id, __v, ...rest } = plain;
  return { ...rest, id: _id.toString() };
}

function getUserId(req, body = null) {
  if (body?.userId) return body.userId;
  const { searchParams } = new URL(req.url);
  return searchParams.get("userId") || "";
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    await connectMongoDB();
    const userId = getUserId(req, body);
    const { id } = await params;

    const query = userId ? { _id: id, userId } : { _id: id };
    const transaction = await Transaction.findOneAndUpdate(
      query,
      {
        title: body.title,
        amount: Number(body.amount),
        type: body.type,
        category: body.category || "Misc",
        status: body.status || "",
        dueDate: body.dueDate || "",
        isRecurring: Boolean(body.isRecurring),
      },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serialize(transaction));
  } catch (error) {
    console.error("PUT FINANCE TRANSACTION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();
    const userId = getUserId(req);
    const { id } = await params;
    const query = userId ? { _id: id, userId } : { _id: id };
    const deleted = await Transaction.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE FINANCE TRANSACTION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 400 }
    );
  }
}
