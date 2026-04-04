<<<<<<< HEAD
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
=======
import { connectToDatabase } from "@/lib/mongoose";
import { resolveUserId } from "@/lib/auth.server";
import { jsonError, serializeDocument } from "@/lib/response";
import Transaction from "@/models/Transaction";

export async function PATCH(request, { params }) {
  await connectToDatabase();
  const body = await request.json();
  const userId = await resolveUserId(request, body);
  const { id } = await params;
  const transaction = await Transaction.findOne({ _id: id, userId });

  if (!transaction) {
    return jsonError("Transaction not found", 404);
  }

  Object.assign(transaction, {
    type: body.type || transaction.type,
    amount: body.amount != null ? Number(body.amount) : transaction.amount,
    category: body.category || transaction.category,
    date: body.date ? new Date(body.date) : transaction.date,
    note: body.note ?? transaction.note,
  });

  await transaction.save();
  return Response.json(serializeDocument(transaction));
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  const userId = await resolveUserId(request);
  const { id } = await params;
  const deleted = await Transaction.findOneAndDelete({ _id: id, userId });

  if (!deleted) {
    return jsonError("Transaction not found", 404);
  }

  return Response.json({ success: true });
>>>>>>> productivity-task
}
