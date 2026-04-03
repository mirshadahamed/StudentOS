import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import Transaction from "../../../../models/Transaction";
import {
  buildScopedFilter,
  getUserIdFromBody,
  getUserIdFromSearchParams,
  serializeDocument,
} from "../../lib";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const userId = getUserIdFromBody(body) || getUserIdFromSearchParams(req);

    await connectMongoDB();

    const transaction = await Transaction.findOneAndUpdate(
      buildScopedFilter(userId, { _id: id }),
      {
        title: body.title,
        amount: body.amount !== undefined ? Number(body.amount) : undefined,
        type: body.type,
        category: body.category,
        status: body.status,
        dueDate: body.dueDate,
        isRecurring:
          body.isRecurring !== undefined ? Boolean(body.isRecurring) : undefined,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeDocument(transaction));
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
    const { id } = await params;
    const userId = getUserIdFromSearchParams(req);

    await connectMongoDB();

    const transaction = await Transaction.findOneAndDelete(
      buildScopedFilter(userId, { _id: id })
    ).lean();

    if (!transaction) {
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
