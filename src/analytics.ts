import type { StaffOrderRecord } from "./orderSync";
import type { TableSittingRecord } from "./tableSittingHistory";

export type AnalyticsRangeKey = "today" | "7d" | "30d" | "90d" | "all" | "custom";

export type AnalyticsDateRange = {
  key: AnalyticsRangeKey;
  from: number;
  to: number;
  label: string;
};

export type AnalyticsRequest = {
  id: string;
  type: "WAITER" | "BILL";
  tableId: string;
  status: "OPEN" | "ACKNOWLEDGED" | "DONE";
  createdAt: number;
  assignedStaffName?: string;
  acknowledgedAt?: number;
  doneAt?: number;
};

export type AnalyticsStaffProfile = {
  id: string;
  name: string;
  role: "admin" | "general";
  onShift: boolean;
};

export type TrendPoint = {
  key: string;
  label: string;
  revenue: number;
  orders: number;
  items: number;
};

export type RankedItem = {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  orders: number;
};

export type StaffMetric = {
  name: string;
  revenue: number;
  orders: number;
  items: number;
  avgTicket: number;
  activeOrders: number;
  sittings: number;
  covers: number;
};

export type TableMetric = {
  tableId: string;
  revenue: number;
  orders: number;
  items: number;
  sittings: number;
  covers: number;
  avgTurnMinutes: number | null;
};

export type AnalyticsSnapshot = {
  orders: StaffOrderRecord[];
  sittings: TableSittingRecord[];
  requests: AnalyticsRequest[];
  grossSales: number;
  recognizedSales: number;
  outstandingValue: number;
  paidOrders: number;
  openOrders: number;
  orderCount: number;
  itemCount: number;
  avgTicket: number;
  avgItemsPerOrder: number;
  dineInSales: number;
  remoteSales: number;
  staffEnteredSales: number;
  guestEnteredSales: number;
  covers: number;
  avgSpendPerCover: number | null;
  avgTurnMinutes: number | null;
  trend: TrendPoint[];
  previousGrossSales: number;
  previousOrderCount: number;
  topItems: RankedItem[];
  staff: StaffMetric[];
  tables: TableMetric[];
  requestCounts: {
    total: number;
    waiter: number;
    bill: number;
    open: number;
    acknowledged: number;
    done: number;
    avgResponseMinutes: number | null;
  };
  hourlyHeatmap: Array<{ day: number; hour: number; orders: number; revenue: number }>;
  quality: {
    missingCreatedAt: number;
    missingPaymentStatus: number;
    missingStaff: number;
    missingSource: number;
    historicalCoversAvailable: boolean;
  };
};

const DAY_MS = 86_400_000;

export function startOfLocalDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function endOfLocalDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

export function getAnalyticsRange(
  key: AnalyticsRangeKey,
  customFrom?: string,
  customTo?: string,
  now = Date.now()
): AnalyticsDateRange {
  if (key === "all") {
    return { key, from: 0, to: now, label: "All recorded data" };
  }
  if (key === "custom") {
    const from = customFrom ? startOfLocalDay(new Date(`${customFrom}T00:00:00`).getTime()) : startOfLocalDay(now);
    const to = customTo ? endOfLocalDay(new Date(`${customTo}T00:00:00`).getTime()) : endOfLocalDay(now);
    return {
      key,
      from: Math.min(from, to),
      to: Math.max(from, to),
      label: `${formatShortDate(Math.min(from, to))} – ${formatShortDate(Math.max(from, to))}`,
    };
  }

  const days = key === "today" ? 1 : key === "7d" ? 7 : key === "30d" ? 30 : 90;
  const from = startOfLocalDay(now) - (days - 1) * DAY_MS;
  return {
    key,
    from,
    to: endOfLocalDay(now),
    label: key === "today" ? "Today" : `Last ${days} days`,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatShortDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

export function formatDateTime(timestamp?: number): string {
  if (!timestamp) return "";
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function isWithin(timestamp: number | undefined, range: AnalyticsDateRange): boolean {
  if (!timestamp) return range.key === "all";
  return timestamp >= range.from && timestamp <= range.to;
}

function isRecognized(order: StaffOrderRecord): boolean {
  return (
    order.paymentStatus === "PAID" ||
    order.status === "Paid" ||
    order.status === "Completed"
  );
}

function lineItemCount(order: StaffOrderRecord): number {
  return (order.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

function dateKey(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function buildTrend(orders: StaffOrderRecord[], range: AnalyticsDateRange): TrendPoint[] {
  if (orders.length === 0) return [];
  const spanDays = Math.max(1, Math.ceil((range.to - range.from + 1) / DAY_MS));
  const bucketByMonth = range.key === "all" || spanDays > 120;
  const buckets = new Map<string, TrendPoint>();

  orders.forEach((order) => {
    const createdAt = order.createdAt || 0;
    const date = new Date(createdAt);
    const key = bucketByMonth
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      : dateKey(createdAt);
    const label = bucketByMonth
      ? new Intl.DateTimeFormat("en-ZA", { month: "short", year: "2-digit" }).format(date)
      : new Intl.DateTimeFormat("en-ZA", { day: "2-digit", month: "short" }).format(date);
    const current = buckets.get(key) || { key, label, revenue: 0, orders: 0, items: 0 };
    current.revenue += Number(order.total) || 0;
    current.orders += 1;
    current.items += lineItemCount(order);
    buckets.set(key, current);
  });

  return Array.from(buckets.values()).sort((a, b) => a.key.localeCompare(b.key));
}

function previousRange(range: AnalyticsDateRange): AnalyticsDateRange | null {
  if (range.key === "all") return null;
  const duration = range.to - range.from + 1;
  return {
    key: range.key,
    from: range.from - duration,
    to: range.from - 1,
    label: "Previous period",
  };
}

export function buildAnalyticsSnapshot(input: {
  orders: StaffOrderRecord[];
  sittings: TableSittingRecord[];
  requests: AnalyticsRequest[];
  range: AnalyticsDateRange;
}): AnalyticsSnapshot {
  const { range } = input;
  const orders = input.orders.filter((order) => isWithin(order.createdAt, range));
  const sittings = input.sittings.filter((sitting) => isWithin(sitting.clearedAt, range));
  const requests = input.requests.filter((request) => isWithin(request.createdAt, range));
  const recognizedOrders = orders.filter(isRecognized);
  const open = orders.filter((order) => !isRecognized(order));
  const grossSales = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const recognizedSales = recognizedOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const outstandingValue = open.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const itemCount = orders.reduce((sum, order) => sum + lineItemCount(order), 0);
  const historicalCovers = sittings.reduce((sum, sitting) => sum + (Number(sitting.covers) || 0), 0);
  const covers = historicalCovers;
  const validTurns = sittings
    .map((sitting) => (sitting.clearedAt - sitting.startedAt) / 60_000)
    .filter((minutes) => Number.isFinite(minutes) && minutes >= 0 && minutes < 24 * 60);

  const itemMap = new Map<string, RankedItem>();
  orders.forEach((order) => {
    (order.items || []).forEach((line) => {
      const id = String(line.menuItem?.id || line.menuItem?.name || "unknown");
      const current = itemMap.get(id) || {
        id,
        name: line.menuItem?.name || "Unknown item",
        quantity: 0,
        revenue: 0,
        orders: 0,
      };
      current.quantity += Number(line.quantity) || 0;
      current.revenue += (Number(line.quantity) || 0) * (Number(line.menuItem?.price) || 0);
      current.orders += 1;
      itemMap.set(id, current);
    });
  });

  const staffMap = new Map<string, StaffMetric>();
  orders.forEach((order) => {
    const name = order.assignedStaffName || order.enteredByStaffName || "Unassigned";
    const current = staffMap.get(name) || {
      name,
      revenue: 0,
      orders: 0,
      items: 0,
      avgTicket: 0,
      activeOrders: 0,
      sittings: 0,
      covers: 0,
    };
    current.revenue += Number(order.total) || 0;
    current.orders += 1;
    current.items += lineItemCount(order);
    if (!isRecognized(order)) current.activeOrders += 1;
    staffMap.set(name, current);
  });
  sittings.forEach((sitting) => {
    const name = sitting.waiterName || "Unassigned";
    const current = staffMap.get(name) || {
      name,
      revenue: 0,
      orders: 0,
      items: 0,
      avgTicket: 0,
      activeOrders: 0,
      sittings: 0,
      covers: 0,
    };
    current.sittings += 1;
    current.covers += Number(sitting.covers) || 0;
    staffMap.set(name, current);
  });
  staffMap.forEach((metric) => {
    metric.avgTicket = metric.orders > 0 ? metric.revenue / metric.orders : 0;
  });

  const tableMap = new Map<string, TableMetric & { turnTotal: number; turnCount: number }>();
  orders.forEach((order) => {
    const tableId = String(order.tableId || "unknown");
    const current = tableMap.get(tableId) || {
      tableId,
      revenue: 0,
      orders: 0,
      items: 0,
      sittings: 0,
      covers: 0,
      avgTurnMinutes: null,
      turnTotal: 0,
      turnCount: 0,
    };
    current.revenue += Number(order.total) || 0;
    current.orders += 1;
    current.items += lineItemCount(order);
    tableMap.set(tableId, current);
  });
  sittings.forEach((sitting) => {
    const tableId = String(sitting.tableId || "unknown");
    const current = tableMap.get(tableId) || {
      tableId,
      revenue: 0,
      orders: 0,
      items: 0,
      sittings: 0,
      covers: 0,
      avgTurnMinutes: null,
      turnTotal: 0,
      turnCount: 0,
    };
    current.sittings += 1;
    current.covers += Number(sitting.covers) || 0;
    const turn = (sitting.clearedAt - sitting.startedAt) / 60_000;
    if (Number.isFinite(turn) && turn >= 0 && turn < 24 * 60) {
      current.turnTotal += turn;
      current.turnCount += 1;
    }
    tableMap.set(tableId, current);
  });
  tableMap.forEach((metric) => {
    metric.avgTurnMinutes =
      metric.turnCount > 0 ? metric.turnTotal / metric.turnCount : null;
  });

  const responseMinutes = requests
    .map((request) => {
      const resolvedAt = request.acknowledgedAt || request.doneAt;
      return resolvedAt ? (resolvedAt - request.createdAt) / 60_000 : NaN;
    })
    .filter((value) => Number.isFinite(value) && value >= 0);

  const heatmap = new Map<string, { day: number; hour: number; orders: number; revenue: number }>();
  orders.forEach((order) => {
    if (!order.createdAt) return;
    const date = new Date(order.createdAt);
    const day = date.getDay();
    const hour = date.getHours();
    const key = `${day}-${hour}`;
    const current = heatmap.get(key) || { day, hour, orders: 0, revenue: 0 };
    current.orders += 1;
    current.revenue += Number(order.total) || 0;
    heatmap.set(key, current);
  });

  const prior = previousRange(range);
  const previousOrders = prior
    ? input.orders.filter((order) => isWithin(order.createdAt, prior))
    : [];

  return {
    orders,
    sittings,
    requests,
    grossSales,
    recognizedSales,
    outstandingValue,
    paidOrders: recognizedOrders.length,
    openOrders: open.length,
    orderCount: orders.length,
    itemCount,
    avgTicket: orders.length > 0 ? grossSales / orders.length : 0,
    avgItemsPerOrder: orders.length > 0 ? itemCount / orders.length : 0,
    dineInSales: orders
      .filter((order) => String(order.tableId) !== "14")
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0),
    remoteSales: orders
      .filter((order) => String(order.tableId) === "14")
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0),
    staffEnteredSales: orders
      .filter((order) => order.orderSource === "STAFF")
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0),
    guestEnteredSales: orders
      .filter((order) => order.orderSource !== "STAFF")
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0),
    covers,
    avgSpendPerCover: covers > 0 ? grossSales / covers : null,
    avgTurnMinutes:
      validTurns.length > 0
        ? validTurns.reduce((sum, value) => sum + value, 0) / validTurns.length
        : null,
    trend: buildTrend(orders, range),
    previousGrossSales: previousOrders.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0
    ),
    previousOrderCount: previousOrders.length,
    topItems: Array.from(itemMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 12),
    staff: Array.from(staffMap.values()).sort((a, b) => b.revenue - a.revenue),
    tables: Array.from(tableMap.values())
      .map(({ turnTotal: _turnTotal, turnCount: _turnCount, ...metric }) => metric)
      .sort((a, b) => b.revenue - a.revenue),
    requestCounts: {
      total: requests.length,
      waiter: requests.filter((request) => request.type === "WAITER").length,
      bill: requests.filter((request) => request.type === "BILL").length,
      open: requests.filter((request) => request.status === "OPEN").length,
      acknowledged: requests.filter((request) => request.status === "ACKNOWLEDGED").length,
      done: requests.filter((request) => request.status === "DONE").length,
      avgResponseMinutes:
        responseMinutes.length > 0
          ? responseMinutes.reduce((sum, value) => sum + value, 0) / responseMinutes.length
          : null,
    },
    hourlyHeatmap: Array.from(heatmap.values()),
    quality: {
      missingCreatedAt: input.orders.filter((order) => !order.createdAt).length,
      missingPaymentStatus: orders.filter((order) => !order.paymentStatus).length,
      missingStaff: orders.filter((order) => !order.assignedStaffName).length,
      missingSource: orders.filter((order) => !order.orderSource).length,
      historicalCoversAvailable: input.sittings.some((sitting) => Number(sitting.covers) > 0),
    },
  };
}

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows: unknown[][]): string {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export function downloadAnalyticsFile(filename: string, content: string, type = "text/csv;charset=utf-8"): void {
  const blob = new Blob(["\uFEFF", content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function buildOrdersCsv(orders: StaffOrderRecord[]): string {
  return toCsv([
    [
      "Order ID",
      "Created at",
      "Table",
      "Party ID",
      "Source",
      "Ordered by",
      "Assigned waiter",
      "Entered by staff",
      "Status",
      "Payment status",
      "Item quantity",
      "Recorded total (ZAR)",
      "Notes",
    ],
    ...orders.map((order) => [
      order.id,
      formatDateTime(order.createdAt),
      order.tableId,
      order.partyId,
      order.orderSource || "LEGACY/UNKNOWN",
      order.orderedBy,
      order.assignedStaffName,
      order.enteredByStaffName,
      order.status,
      order.paymentStatus,
      lineItemCount(order),
      Number(order.total || 0).toFixed(2),
      order.notes,
    ]),
  ]);
}

export function buildOrderLinesCsv(orders: StaffOrderRecord[]): string {
  return toCsv([
    [
      "Order ID",
      "Created at",
      "Table",
      "Menu item ID",
      "Menu item",
      "Category",
      "Quantity",
      "Unit price (ZAR)",
      "Line total (ZAR)",
      "Payment status",
      "Assigned waiter",
    ],
    ...orders.flatMap((order) =>
      (order.items || []).map((line) => [
        order.id,
        formatDateTime(order.createdAt),
        order.tableId,
        line.menuItem?.id,
        line.menuItem?.name,
        line.menuItem?.category,
        line.quantity,
        Number(line.menuItem?.price || 0).toFixed(2),
        ((Number(line.quantity) || 0) * (Number(line.menuItem?.price) || 0)).toFixed(2),
        order.paymentStatus,
        order.assignedStaffName,
      ])
    ),
  ]);
}

export function buildDailySummaryCsv(snapshot: AnalyticsSnapshot): string {
  return toCsv([
    ["Date", "Recorded sales (ZAR)", "Orders", "Items", "Average order (ZAR)"],
    ...snapshot.trend.map((point) => [
      point.label,
      point.revenue.toFixed(2),
      point.orders,
      point.items,
      (point.orders > 0 ? point.revenue / point.orders : 0).toFixed(2),
    ]),
    [],
    ["Period total", snapshot.grossSales.toFixed(2), snapshot.orderCount, snapshot.itemCount, snapshot.avgTicket.toFixed(2)],
    ["Recognized paid/completed", snapshot.recognizedSales.toFixed(2)],
    ["Outstanding/open", snapshot.outstandingValue.toFixed(2)],
  ]);
}
