import mongoose from "mongoose";

const FocusSessionSchema = new mongoose.Schema(
  {
    taskId: { type: String, default: null },
    taskTitle: { type: String, default: "", trim: true },
    type: {
      type: String,
      enum: ["focus", "shortBreak", "longBreak"],
      default: "focus",
    },
    durationMins: { type: Number, required: true, min: 1 },
    userEmail: { type: String, default: "", trim: true },
    userId: { type: String, required: true, index: true },
    completedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

export default mongoose.models.FocusSession ||
  mongoose.model("FocusSession", FocusSessionSchema);
