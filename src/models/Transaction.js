import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["income", "expense", "savings"],
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now, index: true },
    note: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
