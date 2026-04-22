import mongoose from 'mongoose';

const FocusSessionSchema = new mongoose.Schema(
  {
    taskId: { type: String, default: null },
    taskTitle: { type: String, default: '', trim: true },
    type: { type: String, enum: ['focus', 'shortBreak', 'longBreak'], default: 'focus' },
    durationMins: { type: Number, required: true, min: 1 },
    userEmail: { type: String, default: '', trim: true },
    userId: { type: String, default: 'guest', trim: true },
    completedAt: { type: Date, default: Date.now },
  },
  { versionKey: false, collection: 'focus_sessions' }
);

export const FocusSession = mongoose.models.FocusSession || mongoose.model('FocusSession', FocusSessionSchema);
