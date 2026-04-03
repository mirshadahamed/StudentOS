const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  course:      { type: String, default: '', trim: true },
  category:    { 
    type: String, 
    enum: ['Assignment','Exam','Project','Lab Report','Presentation'], 
    default: 'Assignment' 
  },
  priority:    { type: String, enum: ['High','Medium','Low'], default: 'Medium' },
  deadline:    { type: Date, default: null },
  progress:    { type: Number, default: 0, min: 0, max: 100 },
  status:      { type: String, enum: ['Pending','In Progress','Completed'], default: 'Pending' },
  aiScore:     { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  userEmail:   { type: String, default: '' },
  userId:      { type: String, default: 'guest' },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
});

TaskSchema.pre('save', function() {
  this.updatedAt = new Date();
  
  // Status logic matches frontend progress bar
  if (this.progress >= 100) {
    this.isCompleted = true;
    this.status = 'Completed';
  } else if (this.progress > 0) {
    this.isCompleted = false;
    this.status = 'In Progress';
  } else {
    this.isCompleted = false;
    this.status = 'Pending';
  }

  // AI Score Logic for your Productivity Hub
  const now = new Date();
  const diff = this.deadline ? new Date(this.deadline) - now : null;
  const days = diff !== null ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : null;
  const bonus = { High: 30, Medium: 15, Low: 0 }[this.priority] || 0;
  
  if (days !== null && days < 0) this.aiScore = 100;
  else if (days === null) this.aiScore = bonus;
  else {
    const dayPts = Math.max(0, Math.round(70 * Math.max(0, 1 - days / 21)));
    this.aiScore = Math.min(100, dayPts + bonus);
  }
});

module.exports = {
  Task: mongoose.models.Task || mongoose.model('Task', TaskSchema)
};