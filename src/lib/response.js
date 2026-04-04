export function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export function serializeDocument(value) {
  if (!value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(serializeDocument);
  }

  if (typeof value.toObject === "function") {
    return serializeDocument(value.toObject());
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => {
        if (entry && typeof entry === "object" && "_bsontype" in entry) {
          return [key, String(entry)];
        }

        return [key, serializeDocument(entry)];
      }),
    );
  }

  return value;
}
