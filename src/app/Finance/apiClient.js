export function getFinanceUserId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("student_user_id") || "";
}

export function withUserQuery(path) {
  const userId = getFinanceUserId();
  if (!userId) return path;
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}userId=${encodeURIComponent(userId)}`;
}

export function withUserBody(payload) {
  const userId = getFinanceUserId();
  if (!userId) return payload;
  return { ...payload, userId };
}
