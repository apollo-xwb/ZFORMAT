export interface RemoteSplitSession {
  id: string;
  hostName: string;
  members: string[];
  tableId: string;
  createdAt: number;
}

const JOINED_KEY = "lutho_remote_split_joined";

function sessionKey(sessionId: string) {
  return `lutho_remote_split_${sessionId}`;
}

export function saveSplitSession(session: RemoteSplitSession) {
  localStorage.setItem(sessionKey(session.id), JSON.stringify(session));
  localStorage.setItem(JOINED_KEY, session.id);
}

export function loadSplitSession(sessionId: string): RemoteSplitSession | null {
  try {
    const raw = localStorage.getItem(sessionKey(sessionId));
    if (!raw) return null;
    return JSON.parse(raw) as RemoteSplitSession;
  } catch {
    return null;
  }
}

export function getJoinedSplitSessionId(): string | null {
  return localStorage.getItem(JOINED_KEY);
}

export function loadJoinedSplitSession(): RemoteSplitSession | null {
  const id = getJoinedSplitSessionId();
  if (!id) return null;
  return loadSplitSession(id);
}

export function createSplitSession(hostName: string, tableId: string): RemoteSplitSession {
  const session: RemoteSplitSession = {
    id: `split-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    hostName,
    members: [hostName],
    tableId,
    createdAt: Date.now()
  };
  saveSplitSession(session);
  return session;
}

export function joinSplitSession(sessionId: string, memberName: string): RemoteSplitSession | null {
  const session = loadSplitSession(sessionId);
  if (!session) return null;
  if (!session.members.includes(memberName)) {
    session.members = [...session.members, memberName];
    saveSplitSession(session);
  } else {
    localStorage.setItem(JOINED_KEY, sessionId);
  }
  return session;
}

export function getSplitBillStorageKey(sessionId: string) {
  return `lutho_split_master_bill_${sessionId}`;
}

export function getSplitJoinUrl(sessionId: string, tableId: string): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?table=${tableId}&split=${encodeURIComponent(sessionId)}`;
}

export function parseSplitIdFromValue(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get("split");
    if (fromQuery) return fromQuery;
  } catch {
    // not a full URL
  }
  if (trimmed.startsWith("split-")) return trimmed;
  const match = trimmed.match(/split=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function parseSplitFromLocation(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("split");
  } catch {
    return null;
  }
}
