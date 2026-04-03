import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import Transaction from "../../../models/Transaction";

// Fetch all transactions (Replaces app.get)
export async function GET() {
  try {
    await connectMongoDB();
    // Fetch and sort by newest first
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

// Create a new transaction (Replaces app.post)
export async function POST(request) {
  try {
    // Parse the incoming JSON body
    const body = await request.json();
    
    await connectMongoDB();
    const newTransaction = await Transaction.create(body);
    
    return NextResponse.json({ message: "Expense logged!", transaction: newTransaction }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}