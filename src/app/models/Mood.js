import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  userId: String,
  mood: String,
  text: String,
  score: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Mood || mongoose.model("Mood", moodSchema);