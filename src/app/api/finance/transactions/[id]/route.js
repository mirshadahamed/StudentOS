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
}
