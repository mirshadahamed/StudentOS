// frontend/lib/api.js

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function apiFetch(path, options = {}) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    let body = null;
    try { body = await res.json(); } catch { /* non-JSON */ }
    if (!res.ok) {
      console.error(`[API] ${options.method || 'GET'} ${path} → ${res.status}: ${body?.error || res.statusText}`);
      return null;
    }
    return body;
  } catch (err) {
    console.warn(`[API] Unreachable: ${url} — ${err.message}`);
    return null;
  }
}

export const tasksAPI = {

  getAll: async (params = {}) => {
    const qs   = new URLSearchParams(params).toString();
    const data = await apiFetch(`/api/tasks${qs ? '?' + qs : ''}`);
    return data ?? [];
  },

  getAnalytics: async () => {
    const data = await apiFetch('/api/tasks/analytics');
    return data ?? { total:0, weekTasks:0, completed:0, pending:0, critical:0, overdue:0, prodScore:0, avgAiScore:0 };
  },

  // subtasks: array of { title: string } — user typed them in the form
  create: async (data) => {
    const title = String(data?.title || '').trim();
    if (!title) return null;
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
        subtasks:  Array.isArray(data.subtasks) ? data.subtasks : [],
      }),
    });
  },

  update: (id, data) => {
    if (!id) return Promise.resolve(null);
    return apiFetch(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  delete: (id) => {
    if (!id) return Promise.resolve(null);
    return apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
  },

  // Toggle a single subtask done/undone — backend recalculates progress automatically
  toggleSubtask: (taskId, subtaskId, done) => {
    if (!taskId || !subtaskId) return Promise.resolve(null);
    return apiFetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'PATCH',
      body:   JSON.stringify({ done }),
    });
  },
};

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
  getHistory: async () => (await apiFetch('/api/focus/history')) ?? [],
};

export const aiAPI = {
  chat: async (message, history = []) => {
    const data = await apiFetch('/api/ai/chat', { method:'POST', body: JSON.stringify({ message, history }) });
    return data ?? { reply: 'AI service temporarily unavailable.' };
  },
  getSuggestions: async () => (await apiFetch('/api/ai/suggestions')) ?? [],
  getWeeklyPlan:  async () => (await apiFetch('/api/ai/weekly-plan'))  ?? [],
};

export const healthCheck = () => apiFetch('/api/health');