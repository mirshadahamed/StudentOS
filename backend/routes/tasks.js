const express = require('express');
const router  = express.Router();
const { Task } = require('../models');

// Helper: parse boolean/number query states
const parseBool = (v) => (v === 'true' || v === '1' || v === true);

// GET: Task listing with optional filters
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.completed != null) filter.isCompleted = parseBool(req.query.completed);
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.course) filter.course = req.query.course;

    const tasks = await Task.find(filter).sort({ deadline: 1, aiScore: -1, updatedAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Task analytics for KPI panel
router.get('/analytics', async (req, res) => {
  try {
    const tasks = await Task.find();
    const now = new Date();
    const total = tasks.length;
    const completed = tasks.filter(t => t.isCompleted).length;
    const pending = total - completed;

    const critical = tasks.filter(t => {
      if (t.isCompleted || !t.deadline) return false;
      const days = Math.ceil((new Date(t.deadline) - now) / (1000 * 60 * 60 * 24));
      return days <= 7;
    }).length;

    const overdue = tasks.filter(t => {
      if (t.isCompleted || !t.deadline) return false;
      return new Date(t.deadline) < now;
    }).length;

    const weekTasks = tasks.filter(t => {
      if (!t.deadline) return false;
      const days = Math.ceil((new Date(t.deadline) - now) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 7;
    }).length;

    const prodScore = total > 0 ? Math.round(tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / total) : 0;
    const avgAiScore = total > 0 ? Math.round(tasks.reduce((sum, t) => sum + (t.aiScore || 0), 0) / total) : 0;

    res.json({ total, completed, pending, critical, overdue, weekTasks, prodScore, avgAiScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add new task
router.post('/', async (req, res) => {
  console.log('📥 New Task Data:', req.body);
  try {
    const { title, course, category, priority, deadline, progress = 0, userEmail, userId } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const taskData = {
      title: String(title).trim(),
      course: course || '',
      category: category || 'Assignment',
      priority: ['High', 'Medium', 'Low'].includes(priority) ? priority : 'Medium',
      deadline: deadline ? new Date(deadline) : null,
      progress: Number(progress) || 0,
      userEmail: userEmail || '',
      userId: userId || 'guest',
    };

    const task = new Task(taskData);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Failed to save:', err.message);
    console.error('❌ Full Error:', err);
    console.error('❌ Stack:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Update task and recompute status/AI score via pre-save hooks
router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    Object.assign(task, updates);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;