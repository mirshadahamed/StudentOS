import { randomUUID } from 'crypto';
import { readJson, writeJson } from '@/lib/server/storage';

const TASKS_FILE = 'tasks.json';

const CATEGORIES = ['Assignment', 'Exam', 'Project', 'Lab Report', 'Presentation'];
const PRIORITIES = ['High', 'Medium', 'Low'];

async function readTasks() {
  const tasks = await readJson(TASKS_FILE, []);
  return Array.isArray(tasks) ? tasks : [];
}

async function writeTasks(tasks) {
  await writeJson(TASKS_FILE, tasks);
}

function clampPct(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function normalizeDeadline(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeSubtasks(subtasks) {
  if (!Array.isArray(subtasks)) return [];
  return subtasks
    .filter((s) => s && typeof s.title === 'string' && s.title.trim())
    .map((s) => ({
      _id: s._id || randomUUID(),
      title: s.title.trim(),
      done: Boolean(s.done),
    }));
}

function deriveTask(task) {
  task.updatedAt = new Date();

  if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
    const doneCount = task.subtasks.filter((s) => s.done).length;
    task.progress = Math.round((doneCount / task.subtasks.length) * 100);
  } else {
    task.progress = clampPct(task.progress);
  }

  if (task.progress >= 100) {
    task.progress = 100;
    task.isCompleted = true;
    task.status = 'Completed';
  } else if (task.progress > 0) {
    task.isCompleted = false;
    task.status = 'In Progress';
  } else {
    task.isCompleted = false;
    task.status = 'Pending';
  }

  const ms = task.deadline ? new Date(task.deadline) - Date.now() : null;
  const days = ms !== null ? Math.ceil(ms / 86400000) : null;
  const bonus = { High: 30, Medium: 15, Low: 0 }[task.priority] || 0;

  if (days === null) task.aiScore = Math.min(100, bonus);
  else if (days < 0) task.aiScore = 100;
  else if (days === 0) task.aiScore = Math.min(100, 70 + bonus);
  else {
    const dayPts = Math.max(0, Math.round(70 * Math.max(0, 1 - days / 21)));
    task.aiScore = Math.min(100, dayPts + bonus);
  }
}

function sortLikeBackend(a, b) {
  const scoreDiff = (b.aiScore ?? 0) - (a.aiScore ?? 0);
  if (scoreDiff !== 0) return scoreDiff;

  const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
  const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
  if (aDeadline !== bDeadline) return aDeadline - bDeadline;

  const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  return bCreated - aCreated;
}

export async function listTasks({ completed, priority, category, userId } = {}) {
  const items = await readTasks();
  const out = items.filter((t) => {
    if (completed !== undefined && t.isCompleted !== completed) return false;
    if (priority && t.priority !== priority) return false;
    if (category && t.category !== category) return false;
    if (userId && String(t.userId || '').trim() !== String(userId).trim()) return false;
    return true;
  });

  return out.sort(sortLikeBackend);
}

export async function topTasks(limitOrOptions = 20, maybeOptions = {}) {
  let limit = 20;
  let userId;

  if (typeof limitOrOptions === 'object' && limitOrOptions !== null) {
    limit = Number(limitOrOptions.limit) || 20;
    userId = limitOrOptions.userId;
  } else {
    limit = Number(limitOrOptions) || 20;
    userId = maybeOptions?.userId;
  }

  let items = await readTasks();
  if (userId) items = items.filter((t) => String(t.userId || '').trim() === String(userId).trim());
  return items.sort(sortLikeBackend).slice(0, limit);
}

export async function createTask(data = {}) {
  const title = String(data.title || '').trim();
  if (!title) return null;

  const now = new Date();
  const task = {
    _id: randomUUID(),
    title,
    course: String(data.course || '').trim(),
    category: CATEGORIES.includes(data.category) ? data.category : 'Assignment',
    priority: PRIORITIES.includes(data.priority) ? data.priority : 'Medium',
    deadline: normalizeDeadline(data.deadline),
    progress: data.progress ?? 0,
    status: 'Pending',
    isCompleted: Boolean(data.isCompleted) || false,
    aiScore: 0,
    userEmail: String(data.userEmail || '').trim(),
    userId: String(data.userId || 'guest').trim(),
    subtasks: normalizeSubtasks(data.subtasks),
    createdAt: now,
    updatedAt: now,
  };

  deriveTask(task);

  const items = await readTasks();
  items.push(task);
  await writeTasks(items);
  return task;
}

export async function updateTask(id, patch = {}) {
  const items = await readTasks();
  const idx = items.findIndex((t) => t._id === id);
  if (idx === -1) return null;

  const task = items[idx];
  const allowed = ['title', 'course', 'category', 'priority', 'deadline', 'progress', 'isCompleted', 'userEmail'];

  for (const key of allowed) {
    if (patch[key] === undefined) continue;
    if (key === 'title') task.title = String(patch.title || '').trim() || task.title;
    else if (key === 'course') task.course = String(patch.course || '').trim();
    else if (key === 'category') task.category = CATEGORIES.includes(patch.category) ? patch.category : task.category;
    else if (key === 'priority') task.priority = PRIORITIES.includes(patch.priority) ? patch.priority : task.priority;
    else if (key === 'deadline') task.deadline = normalizeDeadline(patch.deadline);
    else if (key === 'progress') task.progress = clampPct(patch.progress);
    else if (key === 'isCompleted') task.isCompleted = Boolean(patch.isCompleted);
    else if (key === 'userEmail') task.userEmail = String(patch.userEmail || '').trim();
  }

  if (patch.isCompleted === true || patch.isCompleted === 'true') {
    task.isCompleted = true;
    task.progress = 100;
  }
  if (patch.isCompleted === false || patch.isCompleted === 'false') {
    task.isCompleted = false;
    if (task.progress === 100) task.progress = 0;
  }

  if (Array.isArray(patch.subtasks)) {
    task.subtasks = normalizeSubtasks(patch.subtasks);
  }

  deriveTask(task);
  items[idx] = task;
  await writeTasks(items);
  return task;
}

export async function deleteTask(id) {
  const items = await readTasks();
  const idx = items.findIndex((t) => t._id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  await writeTasks(items);
  return true;
}

export async function toggleSubtask(taskId, subtaskId, done) {
  const items = await readTasks();
  const task = items.find((t) => t._id === taskId);
  if (!task) return null;

  const sub = task.subtasks?.find((s) => s._id === subtaskId);
  if (!sub) return null;

  sub.done = Boolean(done);
  deriveTask(task);
  await writeTasks(items);
  return task;
}

export async function getAnalytics({ userId } = {}) {
  let tasks = await readTasks();
  if (userId) tasks = tasks.filter((t) => String(t.userId || '').trim() === String(userId).trim());
  if (!tasks.length) {
    return { total: 0, weekTasks: 0, completed: 0, pending: 0, critical: 0, overdue: 0, prodScore: 0, avgAiScore: 0 };
  }

  const now = Date.now();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const pendingTasks = tasks.filter((t) => !t.isCompleted);

  const critical = pendingTasks.filter((t) => {
    if (!t.deadline) return false;
    const d = Math.ceil((new Date(t.deadline) - now) / 86400000);
    return d >= 0 && d <= 7;
  }).length;

  const overdue = pendingTasks.filter((t) => t.deadline && new Date(t.deadline) < now).length;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekTasks = tasks.filter((t) => new Date(t.createdAt) >= weekStart).length;

  const prodScore = Math.round(tasks.reduce((s, t) => s + (t.progress || 0), 0) / total);
  const avgAiScore = Math.round(tasks.reduce((s, t) => s + (t.aiScore || 0), 0) / total);

  return { total, weekTasks, completed, pending: pendingTasks.length, critical, overdue, prodScore, avgAiScore };
}
