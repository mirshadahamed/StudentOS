export function getFinanceUserId() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("student_user_id") || "";
}

export function withFinanceUserId(path) {
  const userId = getFinanceUserId();

  if (!userId) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}userId=${encodeURIComponent(userId)}`;
}

export function withFinanceUserBody(payload = {}) {
  const userId = getFinanceUserId();

  if (!userId) {
    return payload;
  }

  return {
    ...payload,
    userId,
  };
}
