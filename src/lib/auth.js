"use client";

const FALLBACK_USER_ID = "guest-user";

export function getClientUserId() {
  const fromStorage = window.localStorage.getItem("studentos-user-id");

  if (fromStorage) {
    document.cookie = `studentos-user-id=${fromStorage}; path=/; max-age=31536000; samesite=lax`;
    return fromStorage;
  }

  const generated = `guest-${crypto.randomUUID()}`;
  window.localStorage.setItem("studentos-user-id", generated);
  document.cookie = `studentos-user-id=${generated}; path=/; max-age=31536000; samesite=lax`;
  return generated;
}

export function getClientAuthHeaders() {
  if (typeof window === "undefined") {
    return { "x-user-id": FALLBACK_USER_ID };
  }

  return {
    "x-user-id": getClientUserId(),
  };
}
