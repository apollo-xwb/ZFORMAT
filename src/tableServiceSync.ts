import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { sanitizeForFirestore } from "./firestoreUtils";

export type TableServiceRecord = {
  tableId: string;
  partyId: string;
  primaryTableId: string;
  memberTableIds: string[];
  covers: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
  active: boolean;
  needsCoverCount?: boolean;
  createdAt: number;
  updatedAt: number;
};

export type TableServiceMap = Record<string, TableServiceRecord>;

const tableServiceRef = (tableId: string) => doc(db, "table_services", String(tableId));

export function createPartyId(primaryTableId: string): string {
  return `party-${primaryTableId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function listenTableServices(onData: (records: TableServiceMap) => void): Unsubscribe {
  return onSnapshot(
    collection(db, "table_services"),
    (snap) => {
      const next: TableServiceMap = {};
      snap.docs.forEach((entry) => {
        const data = entry.data() as TableServiceRecord;
        next[entry.id] = {
          ...data,
          tableId: data.tableId || entry.id,
          primaryTableId: data.primaryTableId || data.tableId || entry.id,
          memberTableIds: Array.isArray(data.memberTableIds)
            ? data.memberTableIds.map(String)
            : [data.tableId || entry.id],
          covers: Number(data.covers) || 0,
          active: data.active !== false,
        };
      });
      onData(next);
    },
    (error) => console.error("[ROCO] Table service sync failed:", error)
  );
}

export async function upsertTableService(record: TableServiceRecord): Promise<void> {
  await setDoc(
    tableServiceRef(record.tableId),
    sanitizeForFirestore({
      ...record,
      tableId: String(record.tableId),
      primaryTableId: String(record.primaryTableId),
      memberTableIds: record.memberTableIds.map(String),
      covers: Math.max(0, Math.round(record.covers)),
      updatedAt: Date.now(),
    }) as Record<string, unknown>,
    { merge: true }
  );
}

export async function savePartyAcrossTables(input: {
  partyId: string;
  primaryTableId: string;
  memberTableIds: string[];
  covers: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt?: number;
}): Promise<void> {
  const memberTableIds = Array.from(new Set(input.memberTableIds.map(String)));
  const batch = writeBatch(db);
  const now = Date.now();

  memberTableIds.forEach((tableId) => {
    const record: TableServiceRecord = {
      tableId,
      partyId: input.partyId,
      primaryTableId: String(input.primaryTableId),
      memberTableIds,
      covers: Math.max(0, Math.round(input.covers)),
      assignedStaffId: input.assignedStaffId,
      assignedStaffName: input.assignedStaffName,
      active: true,
      needsCoverCount: input.covers <= 0,
      createdAt: input.createdAt || now,
      updatedAt: now,
    };
    batch.set(
      tableServiceRef(tableId),
      sanitizeForFirestore(record) as Record<string, unknown>,
      { merge: true }
    );
  });

  await batch.commit();
}

export async function closeTableParty(memberTableIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  const now = Date.now();
  Array.from(new Set(memberTableIds.map(String))).forEach((tableId) => {
    batch.set(
      tableServiceRef(tableId),
      { active: false, needsCoverCount: false, updatedAt: now },
      { merge: true }
    );
  });
  await batch.commit();
}

export async function moveTableParty(input: {
  source: TableServiceRecord;
  targetTableId: string;
  orderIds: string[];
  requestIds: string[];
}): Promise<void> {
  const targetTableId = String(input.targetTableId);
  const sourceMembers = Array.from(new Set(input.source.memberTableIds.map(String)));
  const now = Date.now();
  const batch = writeBatch(db);

  sourceMembers.forEach((tableId) => {
    batch.set(
      tableServiceRef(tableId),
      { active: false, needsCoverCount: false, updatedAt: now },
      { merge: true }
    );
  });

  const targetRecord: TableServiceRecord = {
    ...input.source,
    tableId: targetTableId,
    primaryTableId: targetTableId,
    memberTableIds: [targetTableId],
    active: true,
    updatedAt: now,
  };
  batch.set(
    tableServiceRef(targetTableId),
    sanitizeForFirestore(targetRecord) as Record<string, unknown>,
    { merge: true }
  );

  input.orderIds.forEach((orderId) => {
    batch.update(doc(db, "staff_orders", orderId), {
      tableId: targetTableId,
      partyId: input.source.partyId,
      physicalTableId: targetTableId,
      updatedAt: now,
    });
  });
  input.requestIds.forEach((requestId) => {
    batch.update(doc(db, "service_requests", requestId), {
      tableId: targetTableId,
      partyId: input.source.partyId,
      updatedAt: now,
    });
  });

  await batch.commit();
}

export async function combineTableParties(input: {
  primaryTableId: string;
  memberTableIds: string[];
  partyId: string;
  covers: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
  orderIds: string[];
  requestIds: string[];
}): Promise<void> {
  const primaryTableId = String(input.primaryTableId);
  const memberTableIds = Array.from(new Set(input.memberTableIds.map(String)));
  const now = Date.now();
  const batch = writeBatch(db);

  memberTableIds.forEach((tableId) => {
    const record: TableServiceRecord = {
      tableId,
      partyId: input.partyId,
      primaryTableId,
      memberTableIds,
      covers: Math.max(1, Math.round(input.covers)),
      assignedStaffId: input.assignedStaffId,
      assignedStaffName: input.assignedStaffName,
      active: true,
      needsCoverCount: false,
      createdAt: now,
      updatedAt: now,
    };
    batch.set(
      tableServiceRef(tableId),
      sanitizeForFirestore(record) as Record<string, unknown>,
      { merge: true }
    );
  });

  input.orderIds.forEach((orderId) => {
    batch.update(doc(db, "staff_orders", orderId), {
      tableId: primaryTableId,
      partyId: input.partyId,
      updatedAt: now,
    });
  });
  input.requestIds.forEach((requestId) => {
    batch.update(doc(db, "service_requests", requestId), {
      tableId: primaryTableId,
      partyId: input.partyId,
      updatedAt: now,
    });
  });

  await batch.commit();
}
