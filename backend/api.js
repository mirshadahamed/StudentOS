// frontend/lib/api.js
// Place at: frontend/lib/api.js

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
// Returns parsed JSON on success.
// Returns null if the backend is unreachable (network error / ECONNREFUSED).
// Returns null on HTTP errors too — callers check for null and show their own message.
// Never throws — this makes every caller simple.
async function apiFetch(path, options = {}) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    let body = null;
    try { body = await res.json(); } catch { /* non-JSON body */ }

    if (!res.ok) {
      const msg = body?.error || `HTTP ${res.status}`;
      console.error(`[API] ${options.method || 'GET'} ${path} → ${res.status}: ${msg}`);
      return null; // caller will show a generic error
    }

    return body;
  } catch (err) {
    // Network failure — backend not running, wrong port, CORS preflight blocked, etc.
    console.warn(`[API] Unreachable: ${url} — ${err.message}`);
    console.warn('[API] Check: (1) backend running on port 5000, (2) frontend/.env.local has NEXT_PUBLIC_API_URL=http://localhost:5000');
    return null;
  }
}

// ─── TASKS ───────────────────────────────────────────────────────────────────
export const tasksAPI = {

  // Returns array of enriched tasks (includes daysLeft, aiScore, urgencyLabel)
  getAll: async (params = {}) => {
    const qs   = new URLSearchParams(params).toString();
    const data = await apiFetch(`/api/tasks${qs ? '?' + qs : ''}`);
    return data ?? [];
  },

  // Returns analytics object or defaults
  getAnalytics: async () => {
    const data = await apiFetch('/api/tasks/analytics');
    return data ?? { total:0, weekTasks:0, completed:0, pending:0, critical:0, overdue:0, prodScore:0, avgAiScore:0 };
  },

  // Returns the created task object (with _id, aiScore, daysLeft) or null
  create: async (data) => {
    const title = String(data?.title || '').trim();
    if (!title) {
      console.warn('[API] tasksAPI.create called with empty title');
      return null;
    }
    return apiFetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        course:    data.course    || '',
        category:  data.category  || 'Assignment',
        priority:  data.priority  || 'Medium',
        deadline:  data.deadline  || null,
        progress:  data.progress  ?? 0,
        userEmail: data.userEmail || '',
        userId:    data.userId    || 'guest',
      }),
    });
  },

  // Returns updated task or null
  update: (id, data) => {
    if (!id) return Promise.resolve(null);
    return apiFetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Returns { success: true } or null
  delete: (id) => {
    if (!id) return Promise.resolve(null);
    return apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
  },
};

// ─── FOCUS SESSIONS ──────────────────────────────────────────────────────────
export const focusAPI = {

  logSession: (data) => apiFetch('/api/focus', {
    method: 'POST',
    body: JSON.stringify({
      taskId:       data.taskId       || null,
      taskTitle:    data.taskTitle    || '',
      type:         data.type         || 'focus',
      durationMins: data.durationMins || 25,
      userEmail:    data.userEmail    || '',
    }),
  }),

  getStats: async () => {
    const data = await apiFetch('/api/focus/stats');
    return data ?? { focusMinToday:0, focusHoursToday:'0h 0m', completedPomodoros:0, streak:0, totalSessionsToday:0 };
  },

  getHistory: async () => {
    const data = await apiFetch('/api/focus/history');
    return data ?? [];
  },
};

// ─── AI ───────────────────────────────────────────────────────────────────────
export const aiAPI = {

  chat: async (message, history = []) => {
    const data = await apiFetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
    return data ?? { reply: 'AI service is temporarily unavailable. Tasks are still tracked normally.' };
  },

  getSuggestions: async () => {
    const data = await apiFetch('/api/ai/suggestions');
    return data ?? [];
  },

  getWeeklyPlan: async () => {
    const data = await apiFetch('/api/ai/weekly-plan');
    return data ?? [];
  },
};

// ─── HEALTH ───────────────────────────────────────────────────────────────────
export const healthCheck = () => apiFetch('/api/health');