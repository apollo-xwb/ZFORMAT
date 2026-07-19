import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  FileSpreadsheet,
  Filter,
  Gauge,
  LayoutDashboard,
  PackageOpen,
  Printer,
  ReceiptText,
  RefreshCw,
  ShoppingBag,
  TableProperties,
  TrendingDown,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import {
  buildAnalyticsSnapshot,
  buildDailySummaryCsv,
  buildOrderLinesCsv,
  buildOrdersCsv,
  downloadAnalyticsFile,
  formatCurrency,
  getAnalyticsRange,
  type AnalyticsRangeKey,
  type AnalyticsRequest,
  type AnalyticsStaffProfile,
  type AnalyticsSnapshot,
  type TrendPoint,
} from "../analytics";
import type { StaffOrderRecord } from "../orderSync";
import type { TableSittingRecord } from "../tableSittingHistory";
import type { TableServiceMap } from "../tableServiceSync";
import { REMOTE_TABLE_ID, formatTableLabel } from "../rocoTables";

type AnalyticsSection = "executive" | "sales" | "operations" | "team" | "accounting";

type Props = {
  orders: StaffOrderRecord[];
  sittings: TableSittingRecord[];
  requests: AnalyticsRequest[];
  staffProfiles: AnalyticsStaffProfile[];
  tableServices: TableServiceMap;
};

const SECTION_TABS: Array<{
  id: AnalyticsSection;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "executive", label: "Executive", icon: LayoutDashboard },
  { id: "sales", label: "Sales", icon: BarChart3 },
  { id: "operations", label: "Operations", icon: Gauge },
  { id: "team", label: "Team", icon: Users },
  { id: "accounting", label: "Accounting", icon: ReceiptText },
];

const RANGE_OPTIONS: Array<{ id: AnalyticsRangeKey; label: string }> = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "all", label: "All time" },
  { id: "custom", label: "Custom" },
];

function percentDelta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

function DeltaBadge({ current, previous }: { current: number; previous: number }) {
  const delta = percentDelta(current, previous);
  if (delta === null) {
    return (
      <span className="rounded-full border border-zinc-700 bg-black/30 px-2 py-1 text-[9px] font-black uppercase text-zinc-400">
        New activity
      </span>
    );
  }
  const positive = delta >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-black ${
        positive
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
          : "border-red-400/30 bg-red-400/10 text-red-300"
      }`}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-white/10 bg-white/[0.055] shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

function KpiCard({
  label,
  value,
  note,
  icon: Icon,
  delta,
  accent = false,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof WalletCards;
  delta?: ReactNode;
  accent?: boolean;
}) {
  return (
    <GlassCard className={`relative overflow-hidden p-4 sm:p-5 ${accent ? "border-[#E78A3E]/50" : ""}`}>
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${
          accent ? "bg-[#E78A3E]/30" : "bg-white/5"
        }`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className={`rounded-2xl p-2.5 ${accent ? "bg-[#E78A3E] text-black" : "bg-black/50 text-[#E78A3E]"}`}>
          <Icon className="h-4 w-4" />
        </div>
        {delta}
      </div>
      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">{value}</p>
      <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">{note}</p>
    </GlassCard>
  );
}

function SectionHeader({
  eyebrow,
  title,
  detail,
  action,
}: {
  eyebrow: string;
  title: string;
  detail: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#E78A3E]">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-black uppercase tracking-tight text-white sm:text-xl">{title}</h2>
        <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-zinc-500">{detail}</p>
      </div>
      {action}
    </div>
  );
}

function RevenueChart({ points }: { points: TrendPoint[] }) {
  if (points.length === 0) {
    return <EmptyState title="No sales in this range" detail="Change the date range or wait for synced orders." />;
  }
  const width = 760;
  const height = 260;
  const padding = 28;
  const max = Math.max(...points.map((point) => point.revenue), 1);
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  const coords = points.map((point, index) => ({
    x: padding + index * step,
    y: height - padding - (point.revenue / max) * (height - padding * 2),
  }));
  const line = coords.map((coord, index) => `${index === 0 ? "M" : "L"} ${coord.x} ${coord.y}`).join(" ");
  const area = `${line} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

  return (
    <div className="min-w-0">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Recorded sales trend" className="h-64 w-full overflow-visible">
        <defs>
          <linearGradient id="rocoRevenueArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E78A3E" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#E78A3E" stopOpacity="0" />
          </linearGradient>
          <filter id="rocoGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding + ratio * (height - padding * 2);
          return <line key={ratio} x1={padding} x2={width - padding} y1={y} y2={y} stroke="rgba(255,255,255,.08)" />;
        })}
        <path d={area} fill="url(#rocoRevenueArea)" />
        <path d={line} fill="none" stroke="#E78A3E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#rocoGlow)" />
        {coords.map((coord, index) => (
          <g key={points[index].key}>
            <circle cx={coord.x} cy={coord.y} r="4" fill="#000" stroke="#E78A3E" strokeWidth="3">
              <title>{`${points[index].label}: ${formatCurrency(points[index].revenue)} • ${points[index].orders} orders`}</title>
            </circle>
          </g>
        ))}
      </svg>
      <div className="flex gap-5 overflow-hidden px-3 text-[8px] font-mono uppercase text-zinc-600">
        {points
          .filter((_, index) => index === 0 || index === points.length - 1 || index % Math.ceil(points.length / 5) === 0)
          .map((point) => (
            <span key={point.key} className="min-w-0 flex-1 truncate text-center">{point.label}</span>
          ))}
      </div>
    </div>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/15 p-6 text-center">
      <PackageOpen className="h-6 w-6 text-zinc-700" />
      <p className="mt-3 text-xs font-black uppercase text-zinc-300">{title}</p>
      <p className="mt-1 max-w-sm text-[10px] text-zinc-600">{detail}</p>
    </div>
  );
}

function SalesMix({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  const total = Math.max(snapshot.grossSales, 1);
  const dineIn = (snapshot.dineInSales / total) * 100;
  const remote = (snapshot.remoteSales / total) * 100;
  const staff = (snapshot.staffEnteredSales / total) * 100;
  return (
    <div className="space-y-5">
      {[
        { label: "Dine-in", value: snapshot.dineInSales, percent: dineIn, color: "#E78A3E" },
        { label: "Remote ordering", value: snapshot.remoteSales, percent: remote, color: "#8B5CF6" },
        { label: "Waiter-entered", value: snapshot.staffEnteredSales, percent: staff, color: "#22C55E" },
      ].map((row) => (
        <div key={row.label}>
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-bold text-zinc-300">{row.label}</span>
            <span className="font-mono text-zinc-500">{formatCurrency(row.value)} • {row.percent.toFixed(0)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/50">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, row.percent)}%`, backgroundColor: row.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TopProducts({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  if (snapshot.topItems.length === 0) {
    return <EmptyState title="No product mix yet" detail="Product performance appears after orders sync." />;
  }
  const max = Math.max(...snapshot.topItems.map((item) => item.revenue), 1);
  return (
    <div className="space-y-3">
      {snapshot.topItems.slice(0, 8).map((item, index) => (
        <div key={item.id} className="group rounded-2xl border border-white/5 bg-black/20 p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-black/50 text-[10px] font-black text-[#E78A3E]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="truncate text-xs font-bold text-white">{item.name}</p>
                <p className="shrink-0 text-xs font-black text-white">{formatCurrency(item.revenue)}</p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/50">
                <div className="h-full rounded-full bg-[#E78A3E]" style={{ width: `${(item.revenue / max) * 100}%` }} />
              </div>
              <p className="mt-1 text-[9px] text-zinc-600">{item.quantity} units across {item.orders} order lines</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderHeatmap({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  const days = [
    { id: 1, label: "Mon" },
    { id: 2, label: "Tue" },
    { id: 3, label: "Wed" },
    { id: 4, label: "Thu" },
    { id: 5, label: "Fri" },
    { id: 6, label: "Sat" },
    { id: 0, label: "Sun" },
  ];
  const hours = Array.from({ length: 13 }, (_, index) => index + 10);
  const lookup = new Map(snapshot.hourlyHeatmap.map((cell) => [`${cell.day}-${cell.hour}`, cell]));
  const max = Math.max(...snapshot.hourlyHeatmap.map((cell) => cell.orders), 1);
  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[620px]">
        <div className="grid gap-1" style={{ gridTemplateColumns: `42px repeat(${hours.length}, minmax(28px, 1fr))` }}>
          <span />
          {hours.map((hour) => (
            <span key={hour} className="pb-1 text-center text-[8px] font-mono text-zinc-600">{hour}:00</span>
          ))}
          {days.flatMap((day) => [
            <span key={`${day.id}-label`} className="flex items-center text-[9px] font-black uppercase text-zinc-500">{day.label}</span>,
            ...hours.map((hour) => {
              const cell = lookup.get(`${day.id}-${hour}`);
              const intensity = cell ? 0.16 + (cell.orders / max) * 0.84 : 0.05;
              return (
                <div
                  key={`${day.id}-${hour}`}
                  className="aspect-square rounded-md border border-white/5"
                  style={{ backgroundColor: `rgba(231,138,62,${intensity})` }}
                  title={`${day.label} ${hour}:00 • ${cell?.orders || 0} orders • ${formatCurrency(cell?.revenue || 0)}`}
                />
              );
            }),
          ])}
        </div>
      </div>
    </div>
  );
}

function DataQuality({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  const issues = [
    snapshot.quality.missingCreatedAt > 0 && `${snapshot.quality.missingCreatedAt} orders lack timestamps`,
    snapshot.quality.missingPaymentStatus > 0 && `${snapshot.quality.missingPaymentStatus} orders lack payment status`,
    snapshot.quality.missingStaff > 0 && `${snapshot.quality.missingStaff} orders are unassigned`,
    snapshot.quality.missingSource > 0 && `${snapshot.quality.missingSource} legacy orders lack channel/source`,
    !snapshot.quality.historicalCoversAvailable && "Historical covers are not available for older sittings",
  ].filter(Boolean) as string[];
  return (
    <GlassCard className="p-4">
      <div className="flex items-start gap-3">
        <div className={`rounded-xl p-2 ${issues.length === 0 ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"}`}>
          {issues.length === 0 ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
        </div>
        <div>
          <h3 className="text-xs font-black uppercase text-white">Data confidence</h3>
          {issues.length === 0 ? (
            <p className="mt-1 text-[10px] text-zinc-500">The selected period has the expected operational fields.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-[10px] text-zinc-500">
              {issues.map((issue) => <li key={issue}>• {issue}</li>)}
            </ul>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export function AdminAnalyticsDashboard({
  orders,
  sittings,
  requests,
  staffProfiles,
  tableServices,
}: Props) {
  const [section, setSection] = useState<AnalyticsSection>("executive");
  const [rangeKey, setRangeKey] = useState<AnalyticsRangeKey>("30d");
  const [customFrom, setCustomFrom] = useState(() => new Date(Date.now() - 29 * 86_400_000).toISOString().slice(0, 10));
  const [customTo, setCustomTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [staffFilter, setStaffFilter] = useState("all");
  const [tableFilter, setTableFilter] = useState("all");
  const [exportOpen, setExportOpen] = useState(false);

  const range = useMemo(
    () => getAnalyticsRange(rangeKey, customFrom, customTo),
    [rangeKey, customFrom, customTo]
  );
  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          (staffFilter === "all" || order.assignedStaffName === staffFilter) &&
          (tableFilter === "all" || String(order.tableId) === tableFilter)
      ),
    [orders, staffFilter, tableFilter]
  );
  const filteredSittings = useMemo(
    () =>
      sittings.filter(
        (sitting) =>
          (staffFilter === "all" || sitting.waiterName === staffFilter) &&
          (tableFilter === "all" || String(sitting.tableId) === tableFilter)
      ),
    [sittings, staffFilter, tableFilter]
  );
  const filteredRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          (staffFilter === "all" || request.assignedStaffName === staffFilter) &&
          (tableFilter === "all" || String(request.tableId) === tableFilter)
      ),
    [requests, staffFilter, tableFilter]
  );
  const snapshot = useMemo(
    () =>
      buildAnalyticsSnapshot({
        orders: filteredOrders,
        sittings: filteredSittings,
        requests: filteredRequests,
        range,
      }),
    [filteredOrders, filteredRequests, filteredSittings, range]
  );

  const staffNames = useMemo(
    () =>
      Array.from(
        new Set([
          ...staffProfiles.map((profile) => profile.name),
          ...orders.map((order) => order.assignedStaffName).filter((name): name is string => !!name),
        ])
      ).sort(),
    [orders, staffProfiles]
  );
  const tableIds = useMemo(
    () => Array.from(new Set(orders.map((order) => String(order.tableId)))).sort((a, b) => Number(a) - Number(b)),
    [orders]
  );
  const activeServices = Object.values(tableServices).filter(
    (service) =>
      service.active &&
      service.tableId === service.primaryTableId &&
      service.tableId !== REMOTE_TABLE_ID
  );
  const activeCovers = activeServices.reduce((sum, service) => sum + Math.max(0, service.covers), 0);
  const exportSlug = range.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const exportOrders = () =>
    downloadAnalyticsFile(`roco-orders-${exportSlug}.csv`, buildOrdersCsv(snapshot.orders));
  const exportLines = () =>
    downloadAnalyticsFile(`roco-order-lines-${exportSlug}.csv`, buildOrderLinesCsv(snapshot.orders));
  const exportDaily = () =>
    downloadAnalyticsFile(`roco-daily-summary-${exportSlug}.csv`, buildDailySummaryCsv(snapshot));

  return (
    <div
      className="relative min-h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#090909] text-white shadow-2xl print:overflow-visible print:border-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at 8% 4%, rgba(231,138,62,.20), transparent 24%), radial-gradient(circle at 88% 8%, rgba(59,130,246,.14), transparent 22%), linear-gradient(145deg, #090909 0%, #111 52%, #080808 100%)",
      }}
    >
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative p-3 sm:p-5 lg:p-7">
        <header className="rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-2xl sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E78A3E] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-black">
                  Admin only
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500">Owner intelligence</span>
              </div>
              <h1 className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">Restaurant Analytics</h1>
              <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-zinc-500">
                Live operational reporting from ROCO orders, table sittings and service requests. Accounting exports reconcile recorded app activity—not POS tender or tax.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExportOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[10px] font-black uppercase text-white hover:border-[#E78A3E]/60"
                >
                  <Download className="h-4 w-4 text-[#E78A3E]" />
                  Export
                  <ChevronDown className="h-3 w-3 text-zinc-500" />
                </button>
                {exportOpen && (
                  <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-2xl border border-white/10 bg-[#171717]/95 p-2 shadow-2xl backdrop-blur-xl">
                    <button type="button" onClick={() => { exportDaily(); setExportOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold text-zinc-200 hover:bg-white/5">
                      <FileSpreadsheet className="h-4 w-4 text-[#E78A3E]" /> Daily summary CSV
                    </button>
                    <button type="button" onClick={() => { exportOrders(); setExportOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold text-zinc-200 hover:bg-white/5">
                      <ReceiptText className="h-4 w-4 text-[#E78A3E]" /> Order ledger CSV
                    </button>
                    <button type="button" onClick={() => { exportLines(); setExportOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold text-zinc-200 hover:bg-white/5">
                      <ShoppingBag className="h-4 w-4 text-[#E78A3E]" /> Product lines CSV
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#E78A3E] px-4 py-3 text-[10px] font-black uppercase text-black hover:bg-[#d67a32]"
              >
                <Printer className="h-4 w-4" />
                Print / PDF
              </button>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 print:hidden">
            {SECTION_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSection(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2.5 text-[10px] font-black uppercase transition ${
                    section === tab.id
                      ? "border-[#E78A3E] bg-[#E78A3E] text-black"
                      : "border-white/10 bg-black/20 text-zinc-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        <GlassCard className="mt-4 p-3 print:hidden">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
              <CalendarDays className="h-4 w-4 shrink-0 text-[#E78A3E]" />
              {RANGE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRangeKey(option.id)}
                  className={`shrink-0 rounded-xl px-3 py-2 text-[9px] font-black uppercase ${
                    rangeKey === option.id ? "bg-white text-black" : "bg-black/30 text-zinc-500 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {rangeKey === "custom" && (
                <div className="flex items-center gap-2">
                  <input type="date" value={customFrom} onChange={(event) => setCustomFrom(event.target.value)} className="min-w-0 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white [color-scheme:dark]" />
                  <span className="text-zinc-700">–</span>
                  <input type="date" value={customTo} onChange={(event) => setCustomTo(event.target.value)} className="min-w-0 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white [color-scheme:dark]" />
                </div>
              )}
              <div className="flex gap-2">
                <label className="relative flex min-w-0 flex-1 items-center">
                  <Users className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-zinc-600" />
                  <select value={staffFilter} onChange={(event) => setStaffFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-7 text-[10px] font-bold text-zinc-300">
                    <option value="all">All staff</option>
                    {staffNames.map((name) => <option key={name} value={name}>{name}</option>)}
                  </select>
                </label>
                <label className="relative flex min-w-0 flex-1 items-center">
                  <TableProperties className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-zinc-600" />
                  <select value={tableFilter} onChange={(event) => setTableFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-7 text-[10px] font-bold text-zinc-300">
                    <option value="all">All tables</option>
                    {tableIds.map((tableId) => <option key={tableId} value={tableId}>{formatTableLabel(tableId)}</option>)}
                  </select>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-[9px] font-mono uppercase text-zinc-600">
            <span>{range.label}</span>
            <span className="inline-flex items-center gap-1"><RefreshCw className="h-3 w-3" /> Firestore live</span>
          </div>
        </GlassCard>

        <main className="mt-4 space-y-4">
          {section === "executive" && (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard label="Recorded sales" value={formatCurrency(snapshot.grossSales)} note="All synced ticket totals in the selected period." icon={WalletCards} accent delta={<DeltaBadge current={snapshot.grossSales} previous={snapshot.previousGrossSales} />} />
                <KpiCard label="Orders" value={snapshot.orderCount.toLocaleString()} note={`${snapshot.itemCount.toLocaleString()} menu items recorded.`} icon={ShoppingBag} delta={<DeltaBadge current={snapshot.orderCount} previous={snapshot.previousOrderCount} />} />
                <KpiCard label="Average order" value={formatCurrency(snapshot.avgTicket)} note={`${snapshot.avgItemsPerOrder.toFixed(1)} items per order.`} icon={BarChart3} />
                <KpiCard label="Outstanding" value={formatCurrency(snapshot.outstandingValue)} note={`${snapshot.openOrders} open/unpaid tickets need reconciliation.`} icon={AlertTriangle} />
              </div>
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.8fr)]">
                <GlassCard className="p-4 sm:p-5">
                  <SectionHeader eyebrow="Performance" title="Recorded sales trend" detail="Gross app ticket value over time; hover points for sales and order count." />
                  <div className="mt-5"><RevenueChart points={snapshot.trend} /></div>
                </GlassCard>
                <GlassCard className="p-4 sm:p-5">
                  <SectionHeader eyebrow="Channel mix" title="Where sales originate" detail="Dine-in, remote ordering, and staff-entered contribution." />
                  <div className="mt-6"><SalesMix snapshot={snapshot} /></div>
                </GlassCard>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <GlassCard className="p-4 sm:p-5">
                  <SectionHeader eyebrow="Demand" title="Orders by day and hour" detail="Hotter cells identify service peaks and staffing pressure." />
                  <div className="mt-5"><OrderHeatmap snapshot={snapshot} /></div>
                </GlassCard>
                <GlassCard className="p-4 sm:p-5">
                  <SectionHeader eyebrow="Menu intelligence" title="Top products by revenue" detail="Recorded line revenue, not margin—ingredient cost is not stored." />
                  <div className="mt-5"><TopProducts snapshot={snapshot} /></div>
                </GlassCard>
              </div>
            </>
          )}

          {section === "sales" && (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard label="Paid / completed" value={formatCurrency(snapshot.recognizedSales)} note={`${snapshot.paidOrders} orders recognized by ROCO status.`} icon={CheckCircle2} accent />
                <KpiCard label="Remote sales" value={formatCurrency(snapshot.remoteSales)} note="Orders routed through Remote Ordering." icon={Activity} />
                <KpiCard label="Dine-in sales" value={formatCurrency(snapshot.dineInSales)} note="Physical table ticket value." icon={TableProperties} />
                <KpiCard label="Spend per cover" value={snapshot.avgSpendPerCover === null ? "Not available" : formatCurrency(snapshot.avgSpendPerCover)} note="Only sittings with captured covers are included." icon={Users} />
              </div>
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
                <GlassCard className="p-4 sm:p-5">
                  <SectionHeader eyebrow="Product mix" title="Best sellers" detail="Ranked by recorded revenue with unit velocity." />
                  <div className="mt-5"><TopProducts snapshot={snapshot} /></div>
                </GlassCard>
                <GlassCard className="p-4 sm:p-5">
                  <SectionHeader eyebrow="Daily book" title="Sales period breakdown" detail="Use the export for spreadsheet reconciliation." />
                  <div className="mt-5 max-h-[520px] overflow-auto">
                    <table className="w-full min-w-[460px] text-left text-xs">
                      <thead className="sticky top-0 bg-[#171717] text-[9px] uppercase tracking-wider text-zinc-600">
                        <tr><th className="p-3">Period</th><th className="p-3 text-right">Orders</th><th className="p-3 text-right">Items</th><th className="p-3 text-right">Sales</th></tr>
                      </thead>
                      <tbody>
                        {snapshot.trend.map((point) => (
                          <tr key={point.key} className="border-t border-white/5">
                            <td className="p-3 font-bold text-zinc-300">{point.label}</td>
                            <td className="p-3 text-right text-zinc-500">{point.orders}</td>
                            <td className="p-3 text-right text-zinc-500">{point.items}</td>
                            <td className="p-3 text-right font-black text-white">{formatCurrency(point.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </div>
            </>
          )}

          {section === "operations" && (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard label="Active dine-in parties" value={activeServices.length.toString()} note={`${activeCovers} live covers currently assigned.`} icon={TableProperties} accent />
                <KpiCard label="Average turn" value={snapshot.avgTurnMinutes === null ? "Not available" : `${snapshot.avgTurnMinutes.toFixed(0)} min`} note={`${snapshot.sittings.length} cleared sittings in range.`} icon={Clock3} />
                <KpiCard label="Service requests" value={snapshot.requestCounts.total.toString()} note={`${snapshot.requestCounts.waiter} waiter • ${snapshot.requestCounts.bill} bill.`} icon={Activity} />
                <KpiCard label="Open requests" value={snapshot.requestCounts.open.toString()} note={`${snapshot.requestCounts.acknowledged} acknowledged, ${snapshot.requestCounts.done} done.`} icon={AlertTriangle} />
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <GlassCard className="p-4 sm:p-5">
                  <SectionHeader eyebrow="Capacity planning" title="Order demand heatmap" detail="Use peaks to plan floor and kitchen coverage." />
                  <div className="mt-5"><OrderHeatmap snapshot={snapshot} /></div>
                </GlassCard>
                <GlassCard className="p-4 sm:p-5">
                  <SectionHeader eyebrow="Floor yield" title="Table performance" detail="Sales, turns and covers by primary table." />
                  <div className="mt-5 max-h-[480px] overflow-auto">
                    <table className="w-full min-w-[560px] text-left text-xs">
                      <thead className="sticky top-0 bg-[#171717] text-[9px] uppercase tracking-wider text-zinc-600">
                        <tr><th className="p-3">Table</th><th className="p-3 text-right">Sales</th><th className="p-3 text-right">Orders</th><th className="p-3 text-right">Turns</th><th className="p-3 text-right">Avg turn</th></tr>
                      </thead>
                      <tbody>
                        {snapshot.tables.map((table) => (
                          <tr key={table.tableId} className="border-t border-white/5">
                            <td className="p-3 font-black text-zinc-300">{formatTableLabel(table.tableId)}</td>
                            <td className="p-3 text-right font-black text-white">{formatCurrency(table.revenue)}</td>
                            <td className="p-3 text-right text-zinc-500">{table.orders}</td>
                            <td className="p-3 text-right text-zinc-500">{table.sittings}</td>
                            <td className="p-3 text-right text-zinc-500">{table.avgTurnMinutes === null ? "—" : `${table.avgTurnMinutes.toFixed(0)}m`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </div>
            </>
          )}

          {section === "team" && (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard label="On shift now" value={staffProfiles.filter((profile) => profile.onShift).length.toString()} note={`${staffProfiles.length} staff profiles in ROCO.`} icon={Users} accent />
                <KpiCard label="Assigned sales" value={formatCurrency(snapshot.staff.reduce((sum, staff) => sum + staff.revenue, 0))} note="Ticket value grouped by assigned waiter." icon={WalletCards} />
                <KpiCard label="Unassigned orders" value={(snapshot.staff.find((staff) => staff.name === "Unassigned")?.orders || 0).toString()} note="Reduce this to improve accountability." icon={AlertTriangle} />
                <KpiCard label="Response time" value={snapshot.requestCounts.avgResponseMinutes === null ? "Not captured" : `${snapshot.requestCounts.avgResponseMinutes.toFixed(1)} min`} note="New requests need acknowledged/done timestamps." icon={Clock3} />
              </div>
              <GlassCard className="overflow-hidden">
                <div className="p-4 sm:p-5">
                  <SectionHeader eyebrow="Team performance" title="Waiter contribution" detail="Sales attribution is operational, not a payroll or tips calculation." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-xs">
                    <thead className="bg-black/25 text-[9px] uppercase tracking-wider text-zinc-600">
                      <tr><th className="p-4">Staff</th><th className="p-4 text-right">Sales</th><th className="p-4 text-right">Orders</th><th className="p-4 text-right">Avg ticket</th><th className="p-4 text-right">Items</th><th className="p-4 text-right">Sittings</th><th className="p-4 text-right">Open</th></tr>
                    </thead>
                    <tbody>
                      {snapshot.staff.map((staff, index) => (
                        <tr key={staff.name} className="border-t border-white/5 hover:bg-white/[0.03]">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E78A3E] text-[10px] font-black text-black">{index + 1}</span>
                              <span className="font-black text-white">{staff.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right font-black text-white">{formatCurrency(staff.revenue)}</td>
                          <td className="p-4 text-right text-zinc-500">{staff.orders}</td>
                          <td className="p-4 text-right text-zinc-500">{formatCurrency(staff.avgTicket)}</td>
                          <td className="p-4 text-right text-zinc-500">{staff.items}</td>
                          <td className="p-4 text-right text-zinc-500">{staff.sittings}</td>
                          <td className="p-4 text-right"><span className={`rounded-full px-2 py-1 text-[9px] font-black ${staff.activeOrders ? "bg-amber-400/10 text-amber-300" : "bg-emerald-400/10 text-emerald-300"}`}>{staff.activeOrders}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </>
          )}

          {section === "accounting" && (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard label="Recorded gross" value={formatCurrency(snapshot.grossSales)} note="Sum of ROCO order totals." icon={WalletCards} accent />
                <KpiCard label="Recognized status" value={formatCurrency(snapshot.recognizedSales)} note="Orders marked Paid or Completed." icon={CheckCircle2} />
                <KpiCard label="Outstanding" value={formatCurrency(snapshot.outstandingValue)} note="Open statuses requiring POS reconciliation." icon={AlertTriangle} />
                <KpiCard label="Recognition rate" value={`${snapshot.grossSales > 0 ? ((snapshot.recognizedSales / snapshot.grossSales) * 100).toFixed(1) : "0.0"}%`} note={`${snapshot.paidOrders} of ${snapshot.orderCount} orders.`} icon={Gauge} />
              </div>
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]">
                <GlassCard className="p-4 sm:p-5">
                  <SectionHeader
                    eyebrow="Export centre"
                    title="Accounting and reconciliation files"
                    detail="CSV files open in Excel, Google Sheets and accounting import workflows."
                  />
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      { title: "Daily summary", detail: "Sales, order count, items and average ticket by period.", icon: CalendarDays, action: exportDaily },
                      { title: "Order ledger", detail: "One row per ticket with status, source, staff and total.", icon: ReceiptText, action: exportOrders },
                      { title: "Product lines", detail: "One row per menu line for product and category analysis.", icon: ShoppingBag, action: exportLines },
                      { title: "Print owner report", detail: "Browser print layout for PDF filing or management packs.", icon: Printer, action: () => window.print() },
                    ].map((exportItem) => {
                      const Icon = exportItem.icon;
                      return (
                        <button key={exportItem.title} type="button" onClick={exportItem.action} className="group rounded-2xl border border-white/10 bg-black/20 p-4 text-left hover:border-[#E78A3E]/60">
                          <Icon className="h-5 w-5 text-[#E78A3E]" />
                          <p className="mt-4 text-xs font-black uppercase text-white">{exportItem.title}</p>
                          <p className="mt-1 text-[10px] leading-relaxed text-zinc-600">{exportItem.detail}</p>
                          <span className="mt-4 inline-flex items-center gap-2 text-[9px] font-black uppercase text-[#E78A3E]">Download <Download className="h-3 w-3" /></span>
                        </button>
                      );
                    })}
                  </div>
                </GlassCard>
                <GlassCard className="border-amber-400/20 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-amber-400/10 p-2.5 text-amber-300"><AlertTriangle className="h-5 w-5" /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">Accounting boundary</p>
                      <h3 className="mt-1 text-sm font-black uppercase text-white">Reconcile against Pilot / POS</h3>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3 text-[10px] leading-relaxed text-zinc-500">
                    <p>ROCO currently stores ticket totals and payment status. It does not store tender type, VAT split, discounts, refunds, void reasons, tips paid, cash drawer movements, supplier costs or COGS.</p>
                    <p>Therefore, this is an operational sales ledger—not a statutory general ledger, VAT report, bank reconciliation or profit-and-loss statement.</p>
                    <p className="rounded-xl border border-[#E78A3E]/20 bg-[#E78A3E]/5 p-3 text-zinc-300">Use the exports to match ROCO tickets to Pilot POS, then post accounting from the POS/accounting system of record.</p>
                  </div>
                </GlassCard>
              </div>
            </>
          )}

          <DataQuality snapshot={snapshot} />
        </main>
      </div>
    </div>
  );
}
