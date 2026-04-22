const API_ROOT = '/api';

function getStoredUserId() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_USER_ID || '';
  }

  return (
    window.localStorage.getItem('studentos.userId') ||
    process.env.NEXT_PUBLIC_USER_ID ||
    ''
  ).trim();
}

async function apiFetch(path, options = {}) {
  try {
    const userId = getStoredUserId();
    const response = await fetch(`${API_ROOT}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`[API] ${path}:`, error.message);
    return null;
  }
}

export function setCurrentUserId(userId) {
  if (typeof window === 'undefined') {
    return;
  }

  if (userId) {
    window.localStorage.setItem('studentos.userId', userId);
  } else {
    window.localStorage.removeItem('studentos.userId');
  }
}

export function getCurrentUserId() {
  return getStoredUserId();
}

export const tasksAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return (await apiFetch(`/tasks${query ? `?${query}` : ''}`)) ?? [];
  },
  getAnalytics: async () =>
    (await apiFetch('/tasks/analytics')) ?? {
      total: 0,
      weekTasks: 0,
      completed: 0,
      pending: 0,
      critical: 0,
      overdue: 0,
      prodScore: 0,
      avgAiScore: 0,
    },
  create: (data) => apiFetch('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/tasks/${id}`, { method: 'DELETE' }),
  toggleSubtask: (taskId, subtaskId, done) =>
    apiFetch(`/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ done }),
    }),
};

export const focusAPI = {
  logSession: (data) => apiFetch('/focus', { method: 'POST', body: JSON.stringify(data) }),
  getStats: async () =>
    (await apiFetch('/focus/stats')) ?? {
      focusMinToday: 0,
      focusHoursToday: '0h 0m',
      completedPomodoros: 0,
      streak: 0,
      totalSessionsToday: 0,
    },
  getHistory: async () => (await apiFetch('/focus/history')) ?? [],
};

export const aiAPI = {
  chat: async (message, history = []) =>
    (await apiFetch('/ai/chat', { method: 'POST', body: JSON.stringify({ message, history }) })) ?? {
      reply: 'AI service temporarily unavailable.',
    },
  getSuggestions: async () => (await apiFetch('/ai/suggestions')) ?? [],
  getWeeklyPlan: async () => (await apiFetch('/ai/weekly-plan')) ?? [],
};

export const healthCheck = () => apiFetch('/health');

export const userAPI = {
  getProfile: async () => (await apiFetch('/user')) ?? null,
};
