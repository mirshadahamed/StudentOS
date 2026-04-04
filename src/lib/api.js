"use client";

import { getClientAuthHeaders } from "@/lib/auth";

async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...getClientAuthHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const tasksAPI = {
  getAll: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/tasks${qs ? `?${qs}` : ""}`);
  },
  getAnalytics: () => apiFetch("/api/tasks/analytics"),
  create: (data) => apiFetch("/api/tasks", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/tasks/${id}`, { method: "DELETE" }),
};

export const focusAPI = {
  logSession: (data) => apiFetch("/api/focus", { method: "POST", body: JSON.stringify(data) }),
  getStats: () => apiFetch("/api/focus/stats"),
  getHistory: () => apiFetch("/api/focus/history"),
};

export const aiAPI = {
  chat: (message, history = []) =>
    apiFetch("/api/ai/chat", { method: "POST", body: JSON.stringify({ message, history }) }),
  getSuggestions: () => apiFetch("/api/ai/suggestions"),
  getWeeklyPlan: () => apiFetch("/api/ai/weekly-plan"),
};

export const financeAPI = {
  getTransactions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/finance/transactions${qs ? `?${qs}` : ""}`);
  },
  createTransaction: (data) =>
    apiFetch("/api/finance/transactions", { method: "POST", body: JSON.stringify(data) }),
  updateTransaction: (id, data) =>
    apiFetch(`/api/finance/transactions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTransaction: (id) => apiFetch(`/api/finance/transactions/${id}`, { method: "DELETE" }),
  getIncome: () => apiFetch("/api/finance/income"),
  getExpenses: () => apiFetch("/api/finance/expenses"),
  getSavings: () => apiFetch("/api/finance/savings"),
  getReports: () => apiFetch("/api/finance/reports"),
};

export const userAPI = {
  getProfile: (email) => {
    const qs = email ? `?email=${encodeURIComponent(email)}` : "";
    const headers = email ? { "x-user-email": email } : {};
    return apiFetch(`/api/user/profile${qs}`, { headers });
  },
};
