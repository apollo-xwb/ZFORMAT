export interface TableConfig {
  id: string;
  name: string;
  type: "booth" | "round" | "small";
  capacity: number;
  orientation?: "vertical" | "horizontal";
  row: number;
  col: number;
}

export const REMOTE_TABLE_ID = "14";

export const ROCO_TABLES: TableConfig[] = [
  { id: "1", name: "Booth 1", type: "booth", capacity: 6, orientation: "vertical", row: 2, col: 2 },
  { id: "2", name: "Booth 2", type: "booth", capacity: 6, orientation: "vertical", row: 2, col: 3 },
  { id: "3", name: "Booth 3", type: "booth", capacity: 6, orientation: "vertical", row: 2, col: 4 },
  { id: "9", name: "Small Table 1", type: "small", capacity: 4, row: 3, col: 2 },
  { id: "10", name: "Small Table 2", type: "small", capacity: 4, row: 3, col: 3 },
  { id: "11", name: "Small Table 3", type: "small", capacity: 4, row: 3, col: 4 },
  { id: "4", name: "Booth 4", type: "booth", capacity: 6, orientation: "horizontal", row: 4, col: 1 },
  { id: "8", name: "Round Table 1", type: "round", capacity: 6, row: 4, col: 2 },
  { id: "12", name: "Small Table 4", type: "small", capacity: 4, row: 4, col: 3 },
  { id: "13", name: "Small Table 5", type: "small", capacity: 4, row: 4, col: 4 },
  { id: "5", name: "Booth 5", type: "booth", capacity: 6, orientation: "horizontal", row: 5, col: 1 },
  { id: "6", name: "Booth 6", type: "booth", capacity: 6, orientation: "vertical", row: 5, col: 2 },
  { id: "7", name: "Booth 7", type: "booth", capacity: 6, orientation: "vertical", row: 5, col: 3 },
  { id: "14", name: "Remote Table", type: "round", capacity: 1, row: 6, col: 1 },
];

export function formatTableLabel(tableId: string | null | undefined): string {
  if (!tableId) return "Table";
  if (tableId === REMOTE_TABLE_ID) return "Remote Table";
  return `Table ${tableId}`;
}

export function formatTableShort(tableId: string | null | undefined): string {
  if (!tableId) return "—";
  if (tableId === REMOTE_TABLE_ID) return "R";
  return `T${tableId}`;
}

export function getStaffOrderColor(staffName?: string): string {
  const STAFF_ORDER_COLORS = ["#E78A3E", "#10B981", "#3B82F6", "#A855F7", "#EF4444", "#F59E0B"];
  if (!staffName) return "#71717A";
  let hash = 0;
  for (let i = 0; i < staffName.length; i++) hash = staffName.charCodeAt(i) + ((hash << 5) - hash);
  return STAFF_ORDER_COLORS[Math.abs(hash) % STAFF_ORDER_COLORS.length];
}
