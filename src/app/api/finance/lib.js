export function getUserIdFromSearchParams(req) {
  const { searchParams } = new URL(req.url);
  return searchParams.get("userId") || "";
}

export function getUserIdFromBody(body) {
  if (!body || typeof body.userId !== "string") {
    return "";
  }

  return body.userId.trim();
}

export function buildScopedFilter(userId, extra = {}) {
  return userId ? { ...extra, userId } : extra;
}

export function serializeDocument(document) {
  const plain =
    typeof document.toObject === "function" ? document.toObject() : document;

  const { _id, __v, ...rest } = plain;

  return {
    ...rest,
    id: _id.toString(),
  };
}
