import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { sanitizeForFirestore } from "./firestoreUtils";
import type { StaffOrderRecord } from "./orderSync";

export type SittingLineItem = {
  quantity: number;
  name: string;
  price: number;
  emoji?: string;
};

export type SittingOrderSummary = {
  orderId: string;
  orderedBy?: string;
  status: string;
  total: number;
  notes?: string;
  items: SittingLineItem[];
  createdAt?: number;
};

export type TableSittingRecord = {
  id: string;
  tableId: string;
  waiterName: string;
  waiterStaffId?: string;
  clearedBy?: string;
  startedAt: number;
  clearedAt: number;
  orderCount: number;
  itemCount: number;
  total: number;
  orders: SittingOrderSummary[];
  guestNames: string[];
  /** Captured for records created after table-service analytics was introduced. */
  covers?: number;
  partyId?: string;
  primaryTableId?: string;
  memberTableIds?: string[];
};

export function buildSittingFromOrders(input: {
  tableId: string;
  waiterName: string;
  waiterStaffId?: string;
  clearedBy?: string;
  orders: StaffOrderRecord[];
  covers?: number;
  partyId?: string;
  primaryTableId?: string;
  memberTableIds?: string[];
}): TableSittingRecord {
  const orders: SittingOrderSummary[] = input.orders.map((order) => ({
    orderId: order.id,
    orderedBy: order.orderedBy,
    status: order.status,
    total: order.total,
    notes: order.notes,
    createdAt: order.createdAt,
    items: (order.items || []).map((item) => ({
      quantity: item.quantity,
      name: item.menuItem?.name || "Item",
      price: item.menuItem?.price || 0,
      emoji: item.menuItem?.emoji,
    })),
  }));

  const itemCount = orders.reduce(
    (sum, order) => sum + order.items.reduce((s, item) => s + (item.quantity || 0), 0),
    0
  );
  const total = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const guestNames = Array.from(
    new Set(orders.map((o) => o.orderedBy).filter((name): name is string => !!name))
  );
  const startedAt = orders.reduce(
    (min, order) => Math.min(min, order.createdAt || Date.now()),
    Date.now()
  );

  return {
    id: `sit-${input.tableId}-${Date.now().toString(36)}`,
    tableId: input.tableId,
    waiterName: input.waiterName,
    waiterStaffId: input.waiterStaffId,
    clearedBy: input.clearedBy,
    startedAt,
    clearedAt: Date.now(),
    orderCount: orders.length,
    itemCount,
    total,
    orders,
    guestNames,
    covers: input.covers,
    partyId: input.partyId,
    primaryTableId: input.primaryTableId,
    memberTableIds: input.memberTableIds,
  };
}

export async function saveTableSitting(record: TableSittingRecord) {
  await setDoc(
    doc(db, "table_sittings", record.id),
    sanitizeForFirestore(record) as Record<string, unknown>,
    { merge: true }
  );
}

export function listenTableSittings(
  onData: (records: TableSittingRecord[]) => void,
  limitCount = 120
): Unsubscribe {
  const q = query(collection(db, "table_sittings"), orderBy("clearedAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<TableSittingRecord, "id">) }))
        .slice(0, limitCount);
      onData(rows);
    },
    (error) => {
      console.error("[ROCO] Table sittings listen failed:", error);
      onData([]);
    }
  );
}

export function sittingsForWaiter(records: TableSittingRecord[], waiterName: string) {
  const needle = waiterName.trim().toLowerCase();
  return records.filter((r) => r.waiterName.trim().toLowerCase() === needle);
}
