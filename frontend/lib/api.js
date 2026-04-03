// frontend/lib/api.js
// Place at: frontend/lib/api.js

const RAW_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/+$|\s+/g, '');
const BASE = RAW_BASE.endsWith('/api') ? RAW_BASE.slice(0, -4) : RAW_BASE;
const API_ROOT = `${BASE}/api`;

async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${API_ROOT}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (err.message?.includes('fetch failed') || err.message?.includes('ECONNREFUSED') || err.message?.includes('Failed to fetch')) {
      console.warn(`[API] Backend unreachable: ${BASE}${path}`);
    } else {
      console.error(`[API] ${path}:`, err.message);
    }
    return null;
  }
}

export const tasksAPI = {
  getAll:      async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return (await apiFetch(`/tasks${qs ? '?' + qs : ''}`)) ?? [];
  },
  getAnalytics: async () => (await apiFetch('/tasks/analytics')) ?? {
    total:0, weekTasks:0, completed:0, pending:0, critical:0, overdue:0, prodScore:0, avgAiScore:0
  },
  create:  (data)     => apiFetch('/tasks',      { method:'POST',   body: JSON.stringify(data) }),
  update:  (id, data) => apiFetch(`/tasks/${id}`,{ method:'PATCH',  body: JSON.stringify(data) }),
  delete:  (id)       => apiFetch(`/tasks/${id}`,{ method:'DELETE' }),
};

export const focusAPI = {
  logSession: (data)  => apiFetch('/focus',         { method:'POST', body: JSON.stringify(data) }),
  getStats:   async () => (await apiFetch('/focus/stats')) ?? {
    focusMinToday:0, focusHoursToday:'0h 0m', completedPomodoros:0, streak:0, weeklyBreakdown:[], totalSessionsToday:0
  },
  getHistory: async () => (await apiFetch('/focus/history')) ?? [],
};

export const aiAPI = {
  chat:        async (message, history=[]) => {
    const d = await apiFetch('/ai/chat', { method:'POST', body: JSON.stringify({ message, history }) });
    return d ?? { reply: 'AI service unreachable. Ensure backend is running on port 5000.' };
  },
  getSuggestions: async () => (await apiFetch('/ai/suggestions')) ?? [],
  getWeeklyPlan:  async () => (await apiFetch('/ai/weekly-plan')) ?? [],
};

export const healthCheck = () => apiFetch('/health');