import { doc, runTransaction, setDoc as firestoreSetDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { CartItem } from "./types";
import { sanitizeForFirestore } from "./firestoreUtils";

export type SerializableCartItem = {
  quantity: number;
  menuItem: {
    id: string;
    name: string;
    price: number;
    emoji: string;
    category: "EAT" | "DRINK";
    description?: string;
  };
};

export type GroupMemberDraft = {
  memberName: string;
  items: SerializableCartItem[];
  notes: string;
  locked: boolean;
  updatedAt: number;
};

export type GroupOrderDraft = {
  sessionId: string;
  roundId: string;
  roundStatus: "building" | "submitting" | "submitted";
  members: Record<string, GroupMemberDraft>;
  updatedAt: number;
};

export function serializeCartItems(items: CartItem[]): SerializableCartItem[] {
  return items.map((item) => ({
    quantity: item.quantity,
    menuItem: {
      id: item.menuItem.id,
      name: item.menuItem.name,
      price: item.menuItem.price,
      emoji: item.menuItem.emoji,
      category: item.menuItem.category,
      description: item.menuItem.description,
    },
  }));
}

export function deserializeCartItems(items: SerializableCartItem[]): CartItem[] {
  return items.map((item) => ({
    quantity: item.quantity,
    menuItem: {
      id: item.menuItem.id,
      name: item.menuItem.name,
      price: item.menuItem.price,
      emoji: item.menuItem.emoji,
      category: item.menuItem.category,
      description: item.menuItem.description || "",
    },
  }));
}

export function createEmptyGroupDraft(sessionId: string): GroupOrderDraft {
  return {
    sessionId,
    roundId: `round-${Date.now().toString(36)}`,
    roundStatus: "building",
    members: {},
    updatedAt: Date.now(),
  };
}

export function groupOrderDraftRef(sessionId: string) {
  return doc(db, "group_order_drafts", sessionId);
}

export async function ensureGroupOrderDraft(sessionId: string): Promise<void> {
  const ref = groupOrderDraftRef(sessionId);
  const empty = createEmptyGroupDraft(sessionId);
  await firestoreSetDoc(ref, sanitizeForFirestore(empty) as Record<string, unknown>, { merge: true });
}

export async function syncMemberGroupDraft(input: {
  sessionId: string;
  memberName: string;
  items: CartItem[];
  notes: string;
  locked?: boolean;
}) {
  const { sessionId, memberName, items, notes, locked } = input;
  const ref = groupOrderDraftRef(sessionId);
  const payload: GroupMemberDraft = {
    memberName,
    items: serializeCartItems(items),
    notes,
    locked: locked ?? false,
    updatedAt: Date.now(),
  };

  await firestoreSetDoc(
    ref,
    sanitizeForFirestore({
      sessionId,
      roundStatus: "building",
      members: {
        [memberName]: payload,
      },
      updatedAt: Date.now(),
    }) as Record<string, unknown>,
    { merge: true }
  );
}

export async function lockMemberGroupDraft(sessionId: string, memberName: string) {
  const ref = groupOrderDraftRef(sessionId);
  await firestoreSetDoc(
    ref,
    sanitizeForFirestore({
      members: {
        [memberName]: {
          locked: true,
          updatedAt: Date.now(),
        },
      },
      updatedAt: Date.now(),
    }) as Record<string, unknown>,
    { merge: true }
  );
}

export function allMembersLocked(draft: GroupOrderDraft, memberNames: string[]): boolean {
  if (memberNames.length === 0) return false;
  return memberNames.every((name) => draft.members[name]?.locked === true);
}

export function countLockedMembers(draft: GroupOrderDraft, memberNames: string[]): number {
  return memberNames.filter((name) => draft.members[name]?.locked === true).length;
}

export async function claimGroupRoundSubmission(sessionId: string, memberNames: string[]): Promise<GroupOrderDraft | null> {
  const ref = groupOrderDraftRef(sessionId);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return null;
    const draft = snap.data() as GroupOrderDraft;
    if (draft.roundStatus !== "building") return null;
    if (!allMembersLocked(draft, memberNames)) return null;
    tx.set(
      ref,
      sanitizeForFirestore({
        ...draft,
        roundStatus: "submitting",
        updatedAt: Date.now(),
      }) as Record<string, unknown>,
      { merge: true }
    );
    return draft;
  });
}

export async function resetGroupOrderRound(sessionId: string) {
  const ref = groupOrderDraftRef(sessionId);
  const next = createEmptyGroupDraft(sessionId);
  await firestoreSetDoc(ref, sanitizeForFirestore(next) as Record<string, unknown>);
}

export function memberDraftTotal(items: SerializableCartItem[]): number {
  return items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
}

export function memberDraftItemCount(items: SerializableCartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
