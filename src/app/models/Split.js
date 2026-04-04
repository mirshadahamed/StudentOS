import mongoose from "mongoose";

const SplitSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "",
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    payer: {
      type: String,
      default: "Me",
      trim: true,
    },
    members: {
      type: Array,
      default: [],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Split || mongoose.model("Split", SplitSchema);
