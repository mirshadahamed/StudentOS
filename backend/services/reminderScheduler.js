// services/reminderScheduler.js
// Runs every day at 8 AM — checks all tasks and fires email reminders

const cron      = require('node-cron');
const nodemailer = require('nodemailer');
const { Task, User } = require('../models');

// ─── EMAIL TRANSPORTER ────────────────────────────────────────────────────────
// Uses Gmail SMTP. For production, swap to SendGrid/Resend.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // e.g. studentos.notify@gmail.com
    pass: process.env.EMAIL_PASS,   // Gmail App Password (not account password)
  },
});

// ─── REMINDER INTERVALS (days before deadline) ────────────────────────────────
const INTERVALS = [
  { days: 21, field: 'sent21', label: '3 weeks'  },
  { days: 14, field: 'sent14', label: '2 weeks'  },
  { days: 7,  field: 'sent7',  label: '1 week'   },
  { days: 3,  field: 'sent3',  label: '3 days'   },
  { days: 1,  field: 'sent1',  label: 'tomorrow' },
];

// ─── EMAIL TEMPLATE ───────────────────────────────────────────────────────────
const buildEmailHTML = ({ name, tasks, daysLabel }) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .logo { font-size: 22px; font-weight: 900; letter-spacing: 4px; color: white; margin-bottom: 32px; }
    .logo span { color: #10b981; }
    .card { background: #141414; border: 1px solid #222; border-radius: 20px; padding: 28px; margin-bottom: 12px; }
    .task-title { font-size: 16px; font-weight: 700; color: white; margin-bottom: 6px; }
    .task-meta { font-size: 12px; color: #666; margin-bottom: 10px; }
    .progress-bar { height: 4px; background: #222; border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 2px; }
    .badge { display: inline-block; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 8px; margin-bottom: 10px; }
    .badge-critical { background: rgba(244,63,94,0.15); color: #f43f5e; }
    .badge-urgent   { background: rgba(251,146,60,0.15); color: #fb923c; }
    .badge-soon     { background: rgba(251,191,36,0.15); color: #fbbf24; }
    .badge-upcoming { background: rgba(56,189,248,0.15); color: #38bdf8; }
    .cta { display: inline-block; margin-top: 28px; background: #10b981; color: black; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; padding: 14px 28px; border-radius: 14px; text-decoration: none; }
    .footer { margin-top: 40px; font-size: 11px; color: #333; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="logo">STUDENT<span>OS</span></div>
    <p style="font-size:24px;font-weight:900;margin-bottom:8px;">Hey ${name},</p>
    <p style="color:#888;font-size:14px;margin-bottom:28px;">You have deadlines coming up in ${daysLabel}. Here's your reminder:</p>

    ${tasks.map(t => {
      const badgeClass = t.daysLeft <= 3 ? 'badge-critical' : t.daysLeft <= 7 ? 'badge-urgent' : t.daysLeft <= 14 ? 'badge-soon' : 'badge-upcoming';
      const barColor   = t.daysLeft <= 3 ? '#f43f5e' : t.daysLeft <= 7 ? '#fb923c' : t.daysLeft <= 14 ? '#fbbf24' : '#38bdf8';
      return `
      <div class="card">
        <div class="badge ${badgeClass}">${t.daysLeft} day${t.daysLeft !== 1 ? 's' : ''} left</div>
        <div class="task-title">${t.title}</div>
        <div class="task-meta">${t.course || ''} · ${t.category}</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${t.progress}%;background:${barColor}"></div>
        </div>
        <p style="font-size:11px;color:#555;margin-top:6px;">${t.progress}% complete</p>
      </div>`;
    }).join('')}

    <a href="${process.env.FRONTEND_URL}/productivity/deadlines" class="cta">View All Deadlines →</a>
    <div class="footer">StudentOS · Smart Planning Hub · You can manage notification preferences in your account settings.</div>
  </div>
</body>
</html>
`;

// ─── CORE REMINDER FUNCTION ───────────────────────────────────────────────────
async function sendReminders() {
  console.log(`[Reminder] Running at ${new Date().toISOString()}`);

  for (const interval of INTERVALS) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + interval.days);
    const dayStart = new Date(targetDate.setHours(0, 0, 0, 0));
    const dayEnd   = new Date(targetDate.setHours(23, 59, 59, 999));

    // Find all incomplete tasks due in this interval window that haven't been reminded yet
    const tasks = await Task.find({
      isCompleted: false,
      deadline: { $gte: dayStart, $lte: dayEnd },
      [`reminders.${interval.field}`]: false,
    }).populate('userId').lean();

    // Group by user
    const byUser = {};
    for (const task of tasks) {
      const uid = task.userId._id.toString();
      if (!byUser[uid]) byUser[uid] = { user: task.userId, tasks: [] };
      byUser[uid].tasks.push(task);
    }

    for (const [uid, { user, tasks: userTasks }] of Object.entries(byUser)) {
      if (!user.email) continue;

      const enriched = userTasks.map(t => ({
        ...t,
        daysLeft: Math.ceil((new Date(t.deadline) - Date.now()) / 86400000),
      }));

      const html = buildEmailHTML({
        name: user.name || 'Student',
        tasks: enriched,
        daysLabel: interval.label,
      });

      try {
        await transporter.sendMail({
          from:    `"StudentOS" <${process.env.EMAIL_USER}>`,
          to:      user.email,
          subject: `⏰ ${enriched.length} deadline${enriched.length > 1 ? 's' : ''} in ${interval.label} — StudentOS`,
          html,
        });

        // Mark reminder as sent for each task
        await Task.updateMany(
          { _id: { $in: userTasks.map(t => t._id) } },
          { $set: { [`reminders.${interval.field}`]: true } }
        );

        console.log(`[Reminder] Sent ${interval.label} email to ${user.email} for ${enriched.length} task(s)`);
      } catch (emailErr) {
        console.error(`[Reminder] Failed to email ${user.email}:`, emailErr.message);
      }
    }
  }
}

// ─── SCHEDULE: every day at 8:00 AM ──────────────────────────────────────────
cron.schedule('0 8 * * *', sendReminders, {
  timezone: 'Asia/Colombo', // Change to your university timezone
});

// Also expose manual trigger for testing
module.exports = { sendReminders };