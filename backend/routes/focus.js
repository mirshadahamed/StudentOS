// backend/routes/focus.js
// Place at: backend/routes/focus.js

const express = require('express');
const router  = express.Router();

// In-memory store — persists for the duration of the Node process.
// Survives page refreshes; resets on server restart.
// To persist across restarts, move sessions to MongoDB (easy upgrade).
let sessions = [];

// ─── POST /api/focus — log a completed pomodoro session ───────────────────────
router.post('/', (req, res) => {
  try {
    const {
      taskId       = null,
      taskTitle    = '',
      type         = 'focus',
      durationMins = 25,
      userEmail    = '',
    } = req.body || {};

    if (!durationMins || Number(durationMins) <= 0) {
      return res.status(400).json({ error: 'durationMins must be a positive number' });
    }

    const record = {
      id:          sessions.length + 1,
      taskId:      taskId || null,
      taskTitle:   String(taskTitle).trim(),
      type:        ['focus','shortBreak','longBreak'].includes(type) ? type : 'focus',
      durationMins: Number(durationMins),
      userEmail:   String(userEmail).trim(),
      completedAt: new Date(),
    };

    sessions.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/focus/stats — today's stats ─────────────────────────────────────
router.get('/stats', (req, res) => {
  try {
    const today    = new Date(); today.setHours(0,0,0,0);
    const todaySes = sessions.filter(s => new Date(s.completedAt) >= today);
    const focusSes = todaySes.filter(s => s.type === 'focus');
    const mins     = focusSes.reduce((sum, s) => sum + s.durationMins, 0);

    // Streak: count consecutive days that have at least one focus session
    const allDays = [...new Set(
      sessions.filter(s => s.type === 'focus').map(s => new Date(s.completedAt).toDateString())
    )].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    for (let i = 0; i < allDays.length; i++) {
      if (allDays[i] === new Date(Date.now() - i * 86400000).toDateString()) streak++;
      else break;
    }

    res.json({
      focusMinToday:      mins,
      focusHoursToday:    `${Math.floor(mins / 60)}h ${mins % 60}m`,
      completedPomodoros: focusSes.length,
      streak,
      totalSessionsToday: todaySes.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/focus/history — last 30 sessions ───────────────────────────────
router.get('/history', (req, res) => {
  res.json(sessions.slice(-30).reverse());
});

module.exports = router;