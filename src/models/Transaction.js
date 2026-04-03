import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    title: String,
    amount: Number,
    type: String,
    category: String,
    status: String,
    dueDate: String,
    isRecurring: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
