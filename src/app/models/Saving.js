import mongoose from "mongoose";

const SavingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "",
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    target: {
      type: Number,
      required: true,
    },
    current: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "#a855f7",
      trim: true,
    },
    deadline: {
      type: String,
      default: "",
      trim: true,
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

export default mongoose.models.Saving ||
  mongoose.model("Saving", SavingSchema);
