const express = require('express');
const router = express.Router();
const { Task } = require('../models');
const aiService = require('../services/aiService');

function safeJsonParse(value) {
  try { return JSON.parse(value); } catch { return null; }
}

router.get('/suggestions', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ aiScore: -1 }).limit(8);
    const suggestions = tasks.map((task, index) => ({
      type: 'plan',
      tag: task.priority === 'High' ? 'High Priority' : task.priority === 'Medium' ? 'Medium Priority' : 'Low Priority',
      text: `${task.title} (${task.course || 'No course'}) — due ${task.deadline?new Date(task.deadline).toLocaleDateString():'TBD'}`,
      detail: `Progress: ${task.progress || 0}%, AI score: ${task.aiScore || 0}.`, 
      score: task.aiScore || 0,
      taskId: task._id,
      deadline: task.deadline,
      category: task.category,
      priority: task.priority,
    }));
    res.json(suggestions);
  } catch (err) {
    console.error('AI suggestions failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/weekly-plan', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ aiScore: -1 }).limit(20);
    let plan = null;

    if (process.env.ANTHROPIC_API_KEY && tasks.length > 0) {
      plan = await aiService.generateWeeklyPlan({ tasks, focusHoursPerDay: 4 });
    }

    if (!plan || !Array.isArray(plan)) {
      const today = new Date();
      plan = Array.from({ length: 7 }, (_, idx) => {
        const day = new Date(today);
        day.setDate(day.getDate() + idx);
        const task = tasks[idx] || tasks[0];
        return {
          day: day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
          focus: task ? `Work on: ${task.title} (${task.progress || 0}% complete)` : 'Rest and review progress',
          hours: task ? 1.5 : 0.5,
          note: task ? `Aim to make 10% progress on "${task.title}"` : 'No tasks available',
        };
      });
    }

    res.json(plan);
  } catch (err) {
    console.error('AI weekly plan failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body ?? {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const tasks = await Task.find().sort({ aiScore: -1 }).limit(20);
    let reply;

    if (process.env.ANTHROPIC_API_KEY) {
      // use your AI service if key is configured
      const context = tasks.map(t => `${t.title} (${t.course || 'No course'}) - ${t.category}, ${t.priority}, ${t.progress || 0}% done`).join('\n');
      const prompt = `Task context:\n${context}\n\nUser question: ${message}`;
      try {
        const anthropic = require('@anthropic-ai/sdk');
        const client = new anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const response = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [{ role: 'user', content: prompt }],
        });
        reply = response?.content?.[0]?.text?.trim();
      } catch (apiErr) {
        console.warn('Anthropic call failed:', apiErr.message);
      }
    }

    if (!reply) {
      const top = tasks[0];
      if (!tasks.length) {
        reply = 'No tasks are available yet. Add tasks so I can give you better suggestions.';
      } else if (/deadline|due|urgent|today/i.test(message)) {
        const urgent = tasks.filter(t => t.priority === 'High' || (t.deadline && new Date(t.deadline) - Date.now() <= 7 * 24 * 60 * 60 * 1000));
        reply = urgent.length
          ? `You have ${urgent.length} urgent task(s): ${urgent.map(t => t.title).join(', ')}.`
          : `No tasks are critical right now. Keep progressing on '${top.title}'.`;
      } else {
        reply = `I suggest focusing on '${top.title}' (${top.category}, ${top.priority} priority) with ${top.daysLeft ?? Math.ceil((new Date(top.deadline) - Date.now())/86400000)} days left.`;
      }
    }

    res.json({ reply });
  } catch (err) {
    console.error('AI chat failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
