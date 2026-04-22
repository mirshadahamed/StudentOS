// Single-app Next.js API client (same-origin `/api/*`)
const API_ROOT = '/api';
const USER_ID_KEY = 'studentos.userId';

export const userSession = {
  getUserId: () => {
    if (typeof window === 'undefined') return '';
    try {
      const raw = window.localStorage.getItem(USER_ID_KEY);
      const trimmed = String(raw ?? '').trim();
      return trimmed || '';
    } catch {
      return '';
    }
  },
  setUserId: (userId) => {
    if (typeof window === 'undefined') return;
    const trimmed = String(userId ?? '').trim();
    try {
      if (!trimmed) window.localStorage.removeItem(USER_ID_KEY);
      else window.localStorage.setItem(USER_ID_KEY, trimmed);
    } catch {
      // ignore
    }
  },
  clearUserId: () => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(USER_ID_KEY);
    } catch {
      // ignore
    }
  },
};

function withUserIdParams(params = {}) {
  if (params && Object.prototype.hasOwnProperty.call(params, 'userId') && params.userId !== undefined) return params;
  const userId = userSession.getUserId();
  if (!userId) return params;
  return { ...params, userId };
}

function withUserIdBody(data = {}) {
  if (data && Object.prototype.hasOwnProperty.call(data, 'userId') && data.userId !== undefined) return data;
  const userId = userSession.getUserId();
  if (!userId) return data;
  return { ...data, userId };
}

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
      console.warn(`[API] Request failed: ${path}`);
    } else {
      console.error(`[API] ${path}:`, err.message);
    }
    return null;
  }
}

export const tasksAPI = {
  getAll:      async (params = {}) => {
    const qp = withUserIdParams(params);
    const qs = new URLSearchParams(qp).toString();
    return (await apiFetch(`/tasks${qs ? '?' + qs : ''}`)) ?? [];
  },
  getAnalytics: async (params = {}) => {
    const qp = withUserIdParams(params);
    const qs = new URLSearchParams(qp).toString();
    return (
      (await apiFetch(`/tasks/analytics${qs ? '?' + qs : ''}`)) ?? {
        total: 0,
        weekTasks: 0,
        completed: 0,
        pending: 0,
        critical: 0,
        overdue: 0,
        prodScore: 0,
        avgAiScore: 0,
      }
    );
  },
  create:  (data)     => apiFetch('/tasks',      { method:'POST',   body: JSON.stringify(withUserIdBody(data)) }),
  update:  (id, data) => apiFetch(`/tasks/${id}`,{ method:'PATCH',  body: JSON.stringify(data) }),
  delete:  (id)       => apiFetch(`/tasks/${id}`,{ method:'DELETE' }),
  toggleSubtask: (taskId, subtaskId, done) =>
    apiFetch(`/tasks/${taskId}/subtasks/${subtaskId}`, { method: 'PATCH', body: JSON.stringify({ done }) }),
};

export const focusAPI = {
  logSession: (data)  => apiFetch('/focus',         { method:'POST', body: JSON.stringify(withUserIdBody(data)) }),
  getStats:   async (params = {}) => {
    const qp = withUserIdParams(params);
    const qs = new URLSearchParams(qp).toString();
    return (
      (await apiFetch(`/focus/stats${qs ? '?' + qs : ''}`)) ?? {
        focusMinToday: 0,
        focusHoursToday: '0h 0m',
        completedPomodoros: 0,
        streak: 0,
        weeklyBreakdown: [],
        totalSessionsToday: 0,
      }
    );
  },
  getHistory: async (params = {}) => {
    const qp = withUserIdParams(params);
    const qs = new URLSearchParams(qp).toString();
    return (await apiFetch(`/focus/history${qs ? '?' + qs : ''}`)) ?? [];
  },
};

export const aiAPI = {
  chat:        async (message, history = [], params = {}) => {
    const body = withUserIdBody({ message, history, ...params });
    const d = await apiFetch('/ai/chat', { method:'POST', body: JSON.stringify(body) });
    return d ?? { reply: 'AI service unavailable. Configure server env vars and try again.' };
  },
  getSuggestions: async (params = {}) => {
    const qp = withUserIdParams(params);
    const qs = new URLSearchParams(qp).toString();
    return (await apiFetch(`/ai/suggestions${qs ? '?' + qs : ''}`)) ?? [];
  },
  getWeeklyPlan:  async (params = {}) => {
    const qp = withUserIdParams(params);
    const qs = new URLSearchParams(qp).toString();
    return (await apiFetch(`/ai/weekly-plan${qs ? '?' + qs : ''}`)) ?? [];
  },
};

export const usersAPI = {
  getById: async (id) => {
    const safe = encodeURIComponent(String(id ?? '').trim());
    if (!safe) return null;
    return await apiFetch(`/users/${safe}`);
  },
};

export const meAPI = {
  get: async () => await apiFetch('/me'),
};

export const healthCheck = () => apiFetch('/health');
