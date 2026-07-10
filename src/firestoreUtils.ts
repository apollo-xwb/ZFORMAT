/** Firestore rejects `undefined` field values — strip them before writes. */
export function omitUndefined<T extends Record<string, unknown>>(obj: T): T {
  const next = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      next[key] = value;
    }
  }
  return next as T;
}
