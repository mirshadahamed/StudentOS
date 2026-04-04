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
}
