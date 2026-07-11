/** Firestore rejects `undefined` field values — strip them recursively before writes. */
export function sanitizeForFirestore(value: unknown): unknown {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (Array.isArray(value)) {
    return value
      .map((entry) => sanitizeForFirestore(entry))
      .filter((entry) => entry !== undefined);
  }
  if (typeof value !== "object") return value;
  if (value instanceof Date) return value;

  const next: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (entry === undefined) continue;
    const sanitized = sanitizeForFirestore(entry);
    if (sanitized !== undefined) {
      next[key] = sanitized;
    }
  }
  return next;
}

/** @deprecated Use sanitizeForFirestore for nested payloads. */
export function omitUndefined<T extends Record<string, unknown>>(obj: T): T {
  return sanitizeForFirestore(obj) as T;
}
