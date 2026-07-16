import { Bell, Receipt, UserRound } from "lucide-react";
import { ROCO_TABLES, REMOTE_TABLE_ID, formatTableLabel, getStaffOrderColor, type TableConfig } from "../rocoTables";

type TableState = "Available" | "Occupied" | "Booked";

export type TableNotificationSummary = {
  openOrders: number;
  waiterCalls: number;
  billRequests: number;
  hasAlert: boolean;
};

type Props = {
  selectedTableId: string | null;
  tablesState: Record<string, TableState | string>;
  tableWaiterAssignments: Record<string, string>;
  tableNotifications: Record<string, TableNotificationSummary>;
  tableServices?: Record<
    string,
    {
      active: boolean;
      covers: number;
      primaryTableId: string;
      memberTableIds: string[];
    }
  >;
  onTableSelect: (tableId: string) => void;
  /** "manage" opens/inspects a table; "combine" multi-selects physical tables. */
  mode?: "manage" | "combine";
  /** Extra tables already chosen for combine (lead table uses selectedTableId). */
  multiSelectedIds?: string[];
  /** Tables that cannot be tapped (e.g. remote, or other live parties). */
  disabledTableIds?: string[];
  hideRemote?: boolean;
  compact?: boolean;
};

function TableShape({
  table,
  tableId,
  isSelected,
  isRemote,
  state
}: {
  table: TableConfig;
  tableId: string;
  isSelected: boolean;
  isRemote: boolean;
  state: string;
}) {
  const isBooked = state === "Booked";
  const isOccupied = state === "Occupied";
  const accent = isSelected ? "bg-[#E78A3E]" : isBooked ? "bg-purple-700" : isOccupied ? "bg-amber-600" : "bg-[#2f190a]";
  const surface = isSelected
    ? "bg-[#5a3a22] border-[#E78A3E]"
    : isBooked
      ? "bg-purple-950/50 border-purple-600/40"
      : isOccupied
        ? "bg-amber-950/40 border-amber-500/30"
        : "bg-[#4a2f1b] border-[#3e2413]";

  if (isRemote) {
    return (
      <div className="relative w-full h-[clamp(40px,10vw,72px)] flex items-center justify-center">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex flex-col items-center justify-center font-mono text-[9px] sm:text-[10px] font-black leading-none z-10 ${isSelected ? "border-[#E78A3E] bg-[#5a3a22] text-[#E78A3E]" : "border-[#3e2413] bg-[#4a2f1b] text-zinc-200"}`}>
          <span>Remote</span>
        </div>
      </div>
    );
  }

  if (table.type === "booth") {
    if (table.orientation === "vertical") {
      return (
        <div className="flex items-center gap-0.5 w-full h-[clamp(40px,10vw,72px)] p-0.5">
          <div className={`w-1 sm:w-1.5 h-full rounded-l shrink-0 ${accent}`} />
          <div className={`flex-1 h-full rounded flex flex-col items-center justify-center font-mono text-[8px] sm:text-[9px] font-black leading-none border ${surface}`}>
            <span>T{tableId}</span>
            <span className="text-[5px] sm:text-[6px] opacity-75 font-sans leading-none mt-0.5 font-bold">BTH</span>
          </div>
          <div className={`w-1 sm:w-1.5 h-full rounded-r shrink-0 ${accent}`} />
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-0.5 w-full h-[clamp(40px,10vw,72px)] p-0.5">
        <div className={`h-1 sm:h-1.5 w-full rounded-t shrink-0 ${accent}`} />
        <div className={`w-full flex-1 rounded flex flex-col items-center justify-center font-mono text-[8px] sm:text-[9px] font-black leading-none border ${surface}`}>
          <span>T{tableId}</span>
          <span className="text-[5px] sm:text-[6px] opacity-75 font-sans leading-none mt-0.5 font-bold">BTH</span>
        </div>
        <div className={`h-1 sm:h-1.5 w-full rounded-b shrink-0 ${accent}`} />
      </div>
    );
  }

  if (table.type === "round") {
    return (
      <div className="relative w-full h-[clamp(40px,10vw,72px)] flex items-center justify-center">
        {[0, 60, 120, 180, 240, 300].map((angle, k) => (
          <div
            key={k}
            className={`absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full border ${k % 2 === 0 ? "bg-[#E78A3E] border-[#2f190a]" : "bg-black border-zinc-800"}`}
            style={{ transform: `rotate(${angle}deg) translateY(clamp(-10px, -2.5vw, -14px))` }}
          />
        ))}
        <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border flex flex-col items-center justify-center font-mono text-[8px] sm:text-[9px] font-black leading-none z-10 ${isSelected ? "border-[#E78A3E] bg-[#5a3a22] text-[#E78A3E]" : surface}`}>
          <span>T{tableId}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[clamp(40px,10vw,72px)] flex items-center justify-center">
      {[0, 90, 180, 270].map((angle, k) => (
        <div
          key={k}
          className={`absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-sm border ${k % 2 === 0 ? "bg-[#E78A3E] border-[#2f190a]" : "bg-black border-zinc-800"}`}
          style={{ transform: `rotate(${angle}deg) translateY(clamp(-9px, -2.2vw, -12px))` }}
        />
      ))}
      <div className={`w-6 h-6 sm:w-7 sm:h-7 rotate-45 border rounded flex items-center justify-center relative ${isSelected ? "border-[#E78A3E] bg-[#5a3a22]" : surface}`}>
        <div className="-rotate-45 flex flex-col items-center justify-center font-mono text-[7px] sm:text-[8px] font-black leading-none">
          <span>T{tableId}</span>
        </div>
      </div>
    </div>
  );
}

function NotificationBanner({ notify }: { notify: TableNotificationSummary }) {
  const parts: string[] = [];
  if (notify.waiterCalls > 0) parts.push(`WAITER ×${notify.waiterCalls}`);
  if (notify.billRequests > 0) parts.push(`BILL ×${notify.billRequests}`);
  if (notify.openOrders > 0) parts.push(`${notify.openOrders} ORDER${notify.openOrders > 1 ? "S" : ""}`);
  if (notify.hasAlert && parts.length === 0) parts.push("ALERT");

  if (parts.length === 0) return null;

  const isUrgent = notify.hasAlert || notify.waiterCalls > 0;

  return (
    <div
      className={`absolute inset-x-1 top-1 z-20 rounded-md px-1 py-0.5 text-center font-black uppercase tracking-wide animate-pulse ${
        isUrgent
          ? "bg-red-600 text-white border border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.7)]"
          : "bg-[#E78A3E] text-black border border-black/20"
      }`}
    >
      <span className="text-[6px] sm:text-[7px] leading-tight block">{parts.join(" • ")}</span>
    </div>
  );
}

export function StaffFloorBlueprint({
  selectedTableId,
  tablesState,
  tableWaiterAssignments,
  tableNotifications,
  tableServices = {},
  onTableSelect,
  mode = "manage",
  multiSelectedIds = [],
  disabledTableIds = [],
  hideRemote = false,
  compact = false,
}: Props) {
  const isCombine = mode === "combine";
  const disabledSet = new Set(disabledTableIds.map(String));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
      <div className={`w-full bg-zinc-950 text-zinc-300 rounded-2xl border border-[#E78A3E]/30 shadow-inner ${compact ? "p-2 sm:p-3" : "p-3 sm:p-4"}`}>
        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
          <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-extrabold">
            {isCombine ? "Tap tables to combine" : "Intuitive floor matrix"}
          </span>
          {isCombine ? (
            <span className="text-[9px] sm:text-[10px] bg-[#E78A3E] text-black px-2 py-0.5 rounded font-mono font-black uppercase">
              {1 + multiSelectedIds.length} selected
            </span>
          ) : selectedTableId ? (
            <span className="text-[9px] sm:text-[10px] bg-[#E78A3E] text-black px-2 py-0.5 rounded font-mono font-black uppercase">
              Selected: {formatTableLabel(selectedTableId)}
            </span>
          ) : (
            <span className="text-[9px] sm:text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-black uppercase">
              Tap a table to manage
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-3 bg-black/60 p-2 rounded-xl text-[7px] sm:text-[8px] font-mono text-zinc-500 uppercase tracking-wider border border-zinc-900">
          {isCombine ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#E78A3E]" />
                <span>Lead / selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Already in party</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-zinc-700" />
                <span>Available to add</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-zinc-900 border border-zinc-700" />
                <span>Unavailable</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-600 animate-pulse" />
                <span>Waiter / alert</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#E78A3E]" />
                <span>Open orders</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Receipt className="w-3 h-3 text-purple-400" />
                <span>Bill request</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span>Assigned waiter</span>
              </div>
            </>
          )}
        </div>

        <div
          className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-2.5 p-2 sm:p-3 rounded-2xl border border-zinc-950 shadow-2xl relative overflow-hidden w-full"
          style={{
            backgroundColor: "#0b0b0c",
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255, 90, 0, 0.035) 0px, rgba(255, 90, 0, 0.035) 2px, transparent 2px, transparent 14px), repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.5) 0px, rgba(0, 0, 0, 0.5) 4px, transparent 4px, transparent 8px)"
          }}
        >
          {Array.from({ length: 6 }, (_, rIdx) => {
            const r = rIdx + 1;
            return Array.from({ length: 5 }, (_, cIdx) => {
              const c = cIdx + 1;

              if (r === 1) {
                if (c === 1) {
                  return (
                    <div
                      key="kitchen-zone-span"
                      className="col-span-4 rounded-lg border border-dashed border-[#E78A3E]/25 bg-[#E78A3E]/5 flex items-center justify-center text-center p-1 min-h-[clamp(48px,11vw,80px)]"
                    >
                      <span className="text-[8px] sm:text-[10px] font-mono uppercase font-black text-[#E78A3E] tracking-widest">
                        Kitchen
                      </span>
                    </div>
                  );
                }
                if (c === 2 || c === 3 || c === 4) return null;
              }

              if ((r === 2 || r === 3) && c === 1) {
                return (
                  <div
                    key={`kitchen-ext-${r}`}
                    className="rounded-lg border border-dashed border-[#E78A3E]/25 bg-[#E78A3E]/5 flex items-center justify-center text-center p-1 min-h-[clamp(48px,11vw,80px)]"
                  >
                    <span className="text-[7px] sm:text-[8px] font-mono uppercase font-black text-[#E78A3E]/80">Kitchen</span>
                  </div>
                );
              }

              const table = ROCO_TABLES.find((t) => t.row === r && t.col === c);
              if (table) {
                const tableId = table.id;
                const isRemote = tableId === REMOTE_TABLE_ID;
                if (hideRemote && isRemote) {
                  return (
                    <div
                      key={table.id}
                      className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/60 flex items-center justify-center text-center p-1 min-h-[clamp(48px,11vw,80px)]"
                    >
                      <span className="text-[7px] sm:text-[8px] font-mono uppercase font-black text-zinc-600">
                        Remote separate
                      </span>
                    </div>
                  );
                }

                const state = (tablesState[tableId] as string) || "Available";
                const isLead = selectedTableId === tableId;
                const isMultiSelected = multiSelectedIds.includes(tableId);
                const isSelected = isCombine ? isLead || isMultiSelected : selectedTableId === tableId;
                const isDisabled = disabledSet.has(tableId) || (isCombine && isRemote);
                const notify = tableNotifications[tableId] || {
                  openOrders: 0,
                  waiterCalls: 0,
                  billRequests: 0,
                  hasAlert: false
                };
                const service = tableServices[tableId]?.active ? tableServices[tableId] : null;
                const isHot = !isCombine && (notify.hasAlert || notify.waiterCalls > 0 || notify.billRequests > 0 || notify.openOrders > 0);

                const waiterName = tableWaiterAssignments[tableId] || "";
                const isAssigned = !!waiterName;
                const waiterColor = getStaffOrderColor(waiterName || undefined);
                const waiterShort = waiterName
                  ? waiterName.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase()
                  : "";

                return (
                  <button
                    key={table.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (isDisabled) return;
                      onTableSelect(tableId);
                    }}
                    className={`relative p-0.5 sm:p-1 rounded-lg flex flex-col items-center justify-center transition-all duration-200 select-none border transform active:scale-95 min-h-[clamp(48px,11vw,80px)] ${
                      isDisabled
                        ? "bg-zinc-950/50 border-zinc-800 opacity-40 cursor-not-allowed"
                        : isCombine && isLead
                          ? "bg-[#E78A3E]/25 border-[#E78A3E] ring-2 ring-[#E78A3E] shadow-[0_0_12px_rgba(231,138,62,0.45)] cursor-default"
                          : isCombine && isMultiSelected
                            ? "bg-[#E78A3E]/20 border-[#E78A3E] ring-1 ring-[#E78A3E]/70 cursor-pointer"
                            : isCombine
                              ? "bg-zinc-900/50 border-zinc-700 hover:border-[#E78A3E]/70 cursor-pointer"
                          : notify.hasAlert || notify.waiterCalls > 0
                        ? "bg-red-950/40 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.55)] ring-2 ring-red-500/60 animate-pulse cursor-pointer"
                        : notify.billRequests > 0
                          ? "bg-purple-950/35 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.45)] ring-1 ring-purple-500/50 cursor-pointer"
                          : notify.openOrders > 0
                            ? "bg-[#E78A3E]/20 border-[#E78A3E] shadow-[0_0_10px_rgba(231,138,62,0.4)] cursor-pointer"
                            : isAssigned
                              ? "bg-emerald-950/25 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.35)] cursor-pointer"
                              : isSelected
                                ? "bg-[#E78A3E]/15 border-[#E78A3E] shadow-[0_0_12px_rgba(231,138,62,0.35)] scale-[1.02] z-10 cursor-pointer"
                                : state === "Booked"
                                  ? "bg-purple-950/20 border-purple-600/30 cursor-pointer"
                                  : state === "Occupied"
                                    ? "bg-amber-950/20 border-amber-500/25 cursor-pointer"
                                    : "bg-zinc-900/40 border-zinc-800 hover:border-[#E78A3E]/50 cursor-pointer"
                    }`}
                    title={`${formatTableLabel(tableId)} • ${state} • ${waiterName || "Unassigned"}${service ? ` • ${service.covers || "?"} covers` : ""}${isCombine && isLead ? " • Lead" : ""}${isCombine && isMultiSelected ? " • Selected" : ""}`}
                  >
                    {!isCombine && <NotificationBanner notify={notify} />}

                    {!isCombine && (notify.hasAlert || notify.waiterCalls > 0) && (
                      <div className="absolute -top-2 -right-2 z-30 w-5 h-5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-lg">
                        <Bell className="w-3 h-3 text-white" />
                      </div>
                    )}

                    {!isCombine && isAssigned && (
                      <div
                        className="absolute -top-1.5 -left-1.5 z-30 min-w-[18px] h-[18px] px-1 rounded-full border-2 border-black flex items-center justify-center text-[7px] font-black text-black animate-pulse shadow-lg"
                        style={{ backgroundColor: waiterColor }}
                        title={waiterName}
                      >
                        {waiterShort || <UserRound className="w-2.5 h-2.5" />}
                      </div>
                    )}

                    {!isCombine && notify.billRequests > 0 && (
                      <div className="absolute -bottom-1 -left-1 z-30 px-1.5 py-0.5 rounded-full bg-purple-600 border border-white text-white text-[7px] font-black uppercase flex items-center gap-0.5">
                        <Receipt className="w-2.5 h-2.5" /> Bill
                      </div>
                    )}

                    {isCombine && isLead && (
                      <div className="absolute -top-1.5 -left-1.5 z-30 px-1.5 py-0.5 rounded-full bg-[#E78A3E] border border-black text-black text-[6px] font-black uppercase">
                        Lead
                      </div>
                    )}

                    {isCombine && isMultiSelected && !isLead && (
                      <div className="absolute -top-1.5 -right-1.5 z-30 w-4 h-4 rounded-full bg-[#E78A3E] border border-black text-black text-[8px] font-black flex items-center justify-center">
                        ✓
                      </div>
                    )}

                    {!isCombine && service && (
                      <div className="absolute -bottom-1 right-0.5 z-30 px-1.5 py-0.5 rounded-full bg-black border border-[#E78A3E] text-[#E78A3E] text-[6px] sm:text-[7px] font-black uppercase">
                        {service.memberTableIds.length > 1 ? `G${service.memberTableIds.length} • ` : ""}
                        {service.covers || "?"}C
                      </div>
                    )}

                    <TableShape table={table} tableId={tableId} isSelected={isSelected} isRemote={isRemote} state={state} />

                    <span
                      className={`text-[6px] sm:text-[7px] font-mono uppercase truncate max-w-full px-1 mt-0.5 ${
                        isCombine
                          ? isLead || isMultiSelected
                            ? "text-[#E78A3E] font-black"
                            : "text-zinc-500"
                          : isAssigned
                            ? "text-emerald-300 font-black"
                            : "text-zinc-500"
                      }`}
                    >
                      {isCombine
                        ? isLead
                          ? "Lead"
                          : isMultiSelected
                            ? "Added"
                            : "Tap"
                        : isAssigned
                          ? waiterName.split(" ")[0]
                          : "Open"}
                    </span>

                    {isHot && (
                      <div className="absolute bottom-1 right-1 flex gap-0.5 z-20">
                        {notify.openOrders > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#E78A3E] text-black text-[7px] sm:text-[8px] font-mono font-black border border-black/30">
                            {notify.openOrders}O
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              }

              let label = "";
              let isEnt = false;
              if (r === 2 && c === 5) {
                label = "Entrance";
                isEnt = true;
              }
              if (r === 6 && c === 1) label = "Bath";

              return (
                <div
                  key={`empty-${r}-${c}`}
                  className={`rounded-lg border border-dashed flex items-center justify-center text-center p-0.5 min-h-[clamp(48px,11vw,80px)] ${
                    isEnt ? "border-[#E78A3E]/40 bg-[#E78A3E]/5" : "border-zinc-900/60 bg-zinc-950/20"
                  }`}
                >
                  {label ? (
                    <span className={`text-[6px] sm:text-[7px] font-mono uppercase font-black leading-none tracking-widest ${isEnt ? "text-[#E78A3E]" : "text-zinc-600"}`}>
                      {label}
                    </span>
                  ) : (
                    <div className="w-0.5 h-0.5 rounded-full bg-zinc-800" />
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}
