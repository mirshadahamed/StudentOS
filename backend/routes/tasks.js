// backend/routes/tasks.js
// CRITICAL: /analytics MUST be defined BEFORE /:id — Express matches top-to-bottom

const express = require('express');
const router  = express.Router();
const { Task } = require('../models');

// ─── Helper: attach daysLeft + urgencyLabel to every response ─────────────────
function enrich(task) {
  const t       = task.toObject ? task.toObject() : { ...task };
  const ms      = t.deadline ? new Date(t.deadline) - Date.now() : null;
  const daysLeft = ms !== null ? Math.ceil(ms / 86400000) : null;

  let urgencyLabel = 'No Deadline';
  if (daysLeft !== null) {
    if (daysLeft < 0)        urgencyLabel = 'Overdue';
    else if (daysLeft <= 3)  urgencyLabel = 'Critical';
    else if (daysLeft <= 7)  urgencyLabel = 'Urgent';
    else if (daysLeft <= 14) urgencyLabel = 'Soon';
    else if (daysLeft <= 21) urgencyLabel = 'Upcoming';
    else                     urgencyLabel = 'Scheduled';
  }
  return { ...t, daysLeft, urgencyLabel };
}

// ─── GET /api/tasks/analytics  ← MUST be before /:id ─────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    const tasks = await Task.find().lean();
    if (!tasks.length) {
      return res.json({ total:0, weekTasks:0, completed:0, pending:0, critical:0, overdue:0, prodScore:0, avgAiScore:0 });
    }
    const now    = Date.now();
    const total  = tasks.length;
    const comp   = tasks.filter(t => t.isCompleted).length;
    const pend   = tasks.filter(t => !t.isCompleted);

    const critical = pend.filter(t => {
      if (!t.deadline) return false;
      const d = Math.ceil((new Date(t.deadline) - now) / 86400000);
      return d >= 0 && d <= 7;
    }).length;

    const overdue = pend.filter(t => t.deadline && new Date(t.deadline) < now).length;

    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay()); weekStart.setHours(0,0,0,0);
    const weekTasks = tasks.filter(t => new Date(t.createdAt) >= weekStart).length;

    const prodScore  = Math.round(tasks.reduce((s, t) => s + (t.progress || 0), 0) / total);
    const avgAiScore = Math.round(tasks.reduce((s, t) => s + (t.aiScore  || 0), 0) / total);

    res.json({ total, weekTasks, completed: comp, pending: pend.length, critical, overdue, prodScore, avgAiScore });
  } catch (err) {
    console.error('[analytics]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.completed !== undefined) filter.isCompleted = req.query.completed === 'true';
    if (req.query.priority)  filter.priority = req.query.priority;
    if (req.query.category)  filter.category = req.query.category;

    const tasks = await Task.find(filter).sort({ aiScore: -1, deadline: 1, createdAt: -1 });
    console.log(`[tasks] GET → ${tasks.length} tasks`);
    res.json(tasks.map(enrich));
  } catch (err) {
    console.error('[tasks] GET error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
// Accepts subtasks[] array from the frontend (user-defined, no AI generation)
router.post('/', async (req, res) => {
  try {
    console.log('[tasks] POST:', JSON.stringify(req.body));
    const { title, course, category, priority, deadline, progress, userEmail, userId, subtasks } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    // Validate subtasks — must be an array of objects with a title string
    let cleanSubtasks = [];
    if (Array.isArray(subtasks)) {
      cleanSubtasks = subtasks
        .filter(s => s && typeof s.title === 'string' && s.title.trim())
        .map((s, i) => ({ title: s.title.trim(), done: Boolean(s.done) || false }));
    }

    const task = new Task({
      title:     String(title).trim(),
      course:    String(course    || '').trim(),
      category:  ['Assignment','Exam','Project','Lab Report','Presentation'].includes(category) ? category : 'Assignment',
      priority:  ['High','Medium','Low'].includes(priority) ? priority : 'Medium',
      deadline:  deadline ? new Date(deadline) : null,
      // If subtasks provided, progress will be derived from them in pre-save.
      // If not, use the supplied progress value.
      progress:  cleanSubtasks.length === 0 ? Math.max(0, Math.min(100, Number(progress) || 0)) : 0,
      userEmail: String(userEmail || '').trim(),
      userId:    String(userId    || 'guest').trim(),
      subtasks:  cleanSubtasks,
    });

    const saved = await task.save(); // pre-save computes aiScore + status
    console.log(`[tasks] ✅ Created: "${saved.title}" | score=${saved.aiScore} | subtasks=${saved.subtasks.length}`);
    res.status(201).json(enrich(saved));
  } catch (err) {
    console.error('[tasks] POST error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /api/tasks/:id ─────────────────────────────────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const allowed = ['title','course','category','priority','deadline','progress','isCompleted','userEmail'];
    allowed.forEach(key => {
      if (req.body[key] === undefined) return;
      if (key === 'deadline')  task[key] = req.body[key] ? new Date(req.body[key]) : null;
      else if (key === 'progress') task[key] = Math.max(0, Math.min(100, Number(req.body[key])));
      else task[key] = req.body[key];
    });

    if (req.body.isCompleted === true  || req.body.isCompleted === 'true')
      { task.isCompleted = true;  task.progress = 100; }
    if (req.body.isCompleted === false || req.body.isCompleted === 'false')
      { task.isCompleted = false; if (task.progress === 100) task.progress = 0; }

    // Full subtasks array replacement (when user edits them)
    if (Array.isArray(req.body.subtasks)) {
      task.subtasks = req.body.subtasks
        .filter(s => s && typeof s.title === 'string' && s.title.trim())
        .map(s => ({ title: s.title.trim(), done: Boolean(s.done), _id: s._id || undefined }));
    }

    const saved = await task.save();
    console.log(`[tasks] ✅ Updated: "${saved.title}" | progress=${saved.progress}% | score=${saved.aiScore}`);
    res.json(enrich(saved));
  } catch (err) {
    console.error('[tasks] PATCH error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /api/tasks/:id/subtasks/:subId — toggle one subtask ───────────────
router.patch('/:id/subtasks/:subId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const sub = task.subtasks.id(req.params.subId);
    if (!sub) return res.status(404).json({ error: 'Subtask not found' });

    if (req.body.done !== undefined) sub.done = Boolean(req.body.done);

    const saved = await task.save(); // pre-save recalculates progress + aiScore
    console.log(`[subtask] ✅ "${sub.title}" done=${sub.done} | task progress=${saved.progress}%`);
    res.json(enrich(saved));
  } catch (err) {
    console.error('[subtask] PATCH error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    console.log(`[tasks] ✅ Deleted: ${req.params.id}`);
    res.json({ success: true });
  } catch (err) {
    console.error('[tasks] DELETE error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;