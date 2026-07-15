import { doc, getDoc, onSnapshot, setDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "./firebase";
import { sanitizeForFirestore } from "./firestoreUtils";
import type { MasterBillItem } from "./types";
import type { RemoteSplitSession } from "./remoteSplit";

export type SplitBillDoc = {
  sessionId: string;
  tableId: string;
  hostName: string;
  members: string[];
  items: MasterBillItem[];
  updatedAt: number;
};

export function splitSessionRef(sessionId: string) {
  return doc(db, "split_sessions", sessionId);
}

export function splitBillRef(sessionId: string) {
  return doc(db, "split_bills", sessionId);
}

export async function upsertSplitSession(session: RemoteSplitSession) {
  await setDoc(
    splitSessionRef(session.id),
    sanitizeForFirestore({
      ...session,
      updatedAt: Date.now(),
    }) as Record<string, unknown>,
    { merge: true }
  );
}

export async function fetchSplitSession(sessionId: string): Promise<RemoteSplitSession | null> {
  const snap = await getDoc(splitSessionRef(sessionId));
  if (!snap.exists()) return null;
  const data = snap.data() as RemoteSplitSession;
  return {
    id: data.id || sessionId,
    hostName: data.hostName,
    members: Array.isArray(data.members) ? data.members : [],
    tableId: data.tableId,
    createdAt: data.createdAt || Date.now(),
  };
}

export function listenSplitSession(
  sessionId: string,
  onData: (session: RemoteSplitSession | null) => void
): Unsubscribe {
  return onSnapshot(
    splitSessionRef(sessionId),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const data = snap.data() as RemoteSplitSession;
      onData({
        id: data.id || sessionId,
        hostName: data.hostName,
        members: Array.isArray(data.members) ? data.members : [],
        tableId: data.tableId,
        createdAt: data.createdAt || Date.now(),
      });
    },
    (error) => {
      console.error("[ROCO] Split session listen failed:", error);
    }
  );
}

export async function upsertSplitBillItems(input: {
  sessionId: string;
  tableId: string;
  hostName: string;
  members: string[];
  items: MasterBillItem[];
}) {
  const payload: SplitBillDoc = {
    sessionId: input.sessionId,
    tableId: input.tableId,
    hostName: input.hostName,
    members: input.members,
    items: input.items,
    updatedAt: Date.now(),
  };
  await setDoc(splitBillRef(input.sessionId), sanitizeForFirestore(payload) as Record<string, unknown>, {
    merge: true,
  });
}

export function listenSplitBill(
  sessionId: string,
  onData: (items: MasterBillItem[]) => void
): Unsubscribe {
  return onSnapshot(
    splitBillRef(sessionId),
    (snap) => {
      if (!snap.exists()) {
        onData([]);
        return;
      }
      const data = snap.data() as SplitBillDoc;
      onData(Array.isArray(data.items) ? data.items : []);
    },
    (error) => {
      console.error("[ROCO] Split bill listen failed:", error);
    }
  );
}

export function mergeCartIntoBillItems(
  existing: MasterBillItem[],
  cartItems: Array<{ quantity: number; menuItem: { name: string; price: number; emoji?: string } }>
): MasterBillItem[] {
  const updated = [...existing];
  cartItems.forEach((c) => {
    const index = updated.findIndex((m) => m.name === c.menuItem.name && m.paidCount < m.quantity);
    if (index !== -1) {
      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity + c.quantity,
      };
    } else {
      updated.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        name: c.menuItem.name,
        price: c.menuItem.price,
        emoji: c.menuItem.emoji || "🍽️",
        quantity: c.quantity,
        paidCount: 0,
      });
    }
  });
  return updated;
}
