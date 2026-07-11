import type { CartItem, HistoricOrder, MenuItem } from "./types";
import { sanitizeForFirestore } from "./firestoreUtils";

export type StaffOrderRecord = {
  id: string;
  timestamp: string;
  createdAt: number;
  items: Array<{ quantity: number; menuItem: Pick<MenuItem, "id" | "name" | "price" | "emoji" | "category"> }>;
  total: number;
  status: HistoricOrder["status"];
  tableId: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  paymentStatus?: string;
  notes?: string;
  timerDuration?: number;
  timerRemaining?: number;
  timerExpired?: boolean;
  updatedAt?: number;
};

function slimMenuItem(menuItem: MenuItem) {
  return {
    id: menuItem.id,
    name: menuItem.name,
    price: menuItem.price,
    emoji: menuItem.emoji,
    category: menuItem.category,
  };
}

export function buildStaffOrderRecord(input: {
  order: HistoricOrder;
  tableId: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
}): StaffOrderRecord {
  const { order, tableId, assignedStaffId, assignedStaffName } = input;
  return {
    id: order.id,
    timestamp: order.timestamp,
    createdAt: order.createdAt ?? Date.now(),
    items: order.items.map((item: CartItem) => ({
      quantity: item.quantity,
      menuItem: slimMenuItem(item.menuItem),
    })),
    total: order.total,
    status: order.status,
    tableId,
    assignedStaffId: assignedStaffId || "",
    assignedStaffName: assignedStaffName || "",
    paymentStatus: "UNPAID",
    notes: order.notes,
    timerDuration: order.timerDuration,
    timerRemaining: order.timerRemaining,
    timerExpired: order.timerExpired ?? false,
    updatedAt: Date.now(),
  };
}

export function toFirestoreOrder(record: StaffOrderRecord): Record<string, unknown> {
  return sanitizeForFirestore(record) as Record<string, unknown>;
}

export function remoteOrderToHistoric(remote: StaffOrderRecord): HistoricOrder {
  return {
    id: remote.id,
    timestamp: remote.timestamp,
    createdAt: remote.createdAt,
    items: remote.items.map((item) => ({
      quantity: item.quantity,
      menuItem: {
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        emoji: item.menuItem.emoji,
        category: item.menuItem.category,
        description: "",
      },
    })),
    total: remote.total,
    status: remote.status,
    notes: remote.notes,
    timerDuration: remote.timerDuration,
    timerRemaining: remote.timerRemaining,
    timerExpired: remote.timerExpired,
  };
}
