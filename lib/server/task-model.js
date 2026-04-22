import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  { _id: true }
);

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  course: { type: String, default: '', trim: true },
  category: {
    type: String,
    enum: ['Assignment', 'Exam', 'Project', 'Lab Report', 'Presentation'],
    default: 'Assignment',
  },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  deadline: { type: Date, default: null },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  isCompleted: { type: Boolean, default: false },
  aiScore: { type: Number, default: 0 },
  userEmail: { type: String, default: '' },
  userId: { type: String, default: 'guest', index: true },
  subtasks: { type: [SubtaskSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TaskSchema.pre('save', function syncTaskFields(next) {
  this.updatedAt = new Date();

  if (this.subtasks.length > 0) {
    const doneCount = this.subtasks.filter((subtask) => subtask.done).length;
    this.progress = Math.round((doneCount / this.subtasks.length) * 100);
  }

  if (this.progress >= 100) {
    this.progress = 100;
    this.isCompleted = true;
    this.status = 'Completed';
  } else if (this.progress > 0) {
    this.isCompleted = false;
    this.status = 'In Progress';
  } else {
    this.isCompleted = false;
    this.status = 'Pending';
  }

  const msUntilDeadline = this.deadline ? new Date(this.deadline) - Date.now() : null;
  const daysLeft = msUntilDeadline !== null ? Math.ceil(msUntilDeadline / 86400000) : null;
  const bonus = { High: 30, Medium: 15, Low: 0 }[this.priority] || 0;

  if (daysLeft === null) {
    this.aiScore = Math.min(100, bonus);
  } else if (daysLeft < 0) {
    this.aiScore = 100;
  } else if (daysLeft === 0) {
    this.aiScore = Math.min(100, 70 + bonus);
  } else {
    const dayPoints = Math.max(0, Math.round(70 * Math.max(0, 1 - daysLeft / 21)));
    this.aiScore = Math.min(100, dayPoints + bonus);
  }

  next();
});

export const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
