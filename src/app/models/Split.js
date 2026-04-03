import mongoose from "mongoose";

const SplitMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const SplitSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "",
      index: true,
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
      type: [SplitMemberSchema],
      default: [],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Split ||
  mongoose.model("Split", SplitSchema);
