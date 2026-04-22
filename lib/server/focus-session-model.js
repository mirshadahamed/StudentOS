import mongoose from 'mongoose';

const FocusSessionSchema = new mongoose.Schema(
  {
    taskId: { type: String, default: null },
    taskTitle: { type: String, default: '' },
    type: { type: String, enum: ['focus', 'shortBreak', 'longBreak'], default: 'focus' },
    durationMins: { type: Number, required: true, min: 1 },
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, default: '' },
    completedAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
);

export const FocusSession =
  mongoose.models.FocusSession || mongoose.model('FocusSession', FocusSessionSchema);
