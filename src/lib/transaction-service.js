import Transaction from "@/models/Transaction";

export async function createTransaction(body, userId) {
  if (!["income", "expense", "savings"].includes(body.type)) {
    return { error: "Invalid transaction type", status: 400 };
  }
  if (!body.category || !String(body.category).trim()) {
    return { error: "Category is required", status: 400 };
  }
  if (!Number(body.amount) || Number(body.amount) <= 0) {
    return { error: "Amount must be a positive number", status: 400 };
  }

  const transaction = await Transaction.create({
    userId,
    type: body.type,
    amount: Number(body.amount),
    category: String(body.category).trim(),
    date: body.date ? new Date(body.date) : new Date(),
    note: body.note || "",
  });

  return { transaction };
}
