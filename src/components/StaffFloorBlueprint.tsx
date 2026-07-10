import { ROCO_TABLES, REMOTE_TABLE_ID, formatTableLabel, type TableConfig } from "../rocoTables";

type TableState = "Available" | "Occupied" | "Booked";

type Props = {
  selectedTableId: string | null;
  tablesState: Record<string, TableState | string>;
  tableWaiterAssignments: Record<string, string>;
  openOrderCounts: Record<string, number>;
  openRequestCounts: Record<string, number>;
  onTableSelect: (tableId: string) => void;
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

export function StaffFloorBlueprint({
  selectedTableId,
  tablesState,
  tableWaiterAssignments,
  openOrderCounts,
  openRequestCounts,
  onTableSelect
}: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
      <div className="w-full bg-zinc-950 text-zinc-300 p-3 sm:p-4 rounded-2xl border border-[#E78A3E]/30 shadow-inner">
        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
          <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-extrabold">
            Intuitive floor matrix
          </span>
          {selectedTableId ? (
            <span className="text-[9px] sm:text-[10px] bg-[#E78A3E] text-black px-2 py-0.5 rounded font-mono font-black uppercase">
              Selected: {formatTableLabel(selectedTableId)}
            </span>
          ) : (
            <span className="text-[9px] sm:text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-black uppercase">
              Tap a table to manage
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 bg-black/60 p-2 rounded-xl text-[7px] sm:text-[8px] font-mono text-zinc-500 uppercase tracking-wider border border-zinc-900">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2 bg-[#5a3a22] border border-[#E78A3E]/20 rounded-sm" />
            <span>Booth (6 max)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#5a3a22] border border-[#E78A3E]/20" />
            <span>Round (6 max)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rotate-45 bg-[#5a3a22] border border-[#E78A3E]/20" />
            <span>Small (4 max)</span>
          </div>
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
                const state = (tablesState[tableId] as string) || "Available";
                const isSelected = selectedTableId === tableId;
                const openOrders = openOrderCounts[tableId] || 0;
                const openRequests = openRequestCounts[tableId] || 0;

                return (
                  <button
                    key={table.id}
                    type="button"
                    onClick={() => onTableSelect(tableId)}
                    className={`relative p-0.5 sm:p-1 rounded-lg flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer border transform active:scale-95 min-h-[clamp(48px,11vw,80px)] ${
                      isSelected
                        ? "bg-[#E78A3E]/15 border-[#E78A3E] shadow-[0_0_12px_rgba(231,138,62,0.35)] scale-[1.02] z-10"
                        : state === "Booked"
                          ? "bg-purple-950/20 border-purple-600/30"
                          : state === "Occupied"
                            ? "bg-amber-950/20 border-amber-500/25"
                            : "bg-zinc-900/40 border-zinc-800 hover:border-[#E78A3E]/50"
                    }`}
                    title={`${formatTableLabel(tableId)} • ${state} • ${tableWaiterAssignments[tableId] || "Unassigned"}`}
                  >
                    <TableShape table={table} tableId={tableId} isSelected={isSelected} isRemote={isRemote} state={state} />
                    <span className="text-[6px] sm:text-[7px] font-mono uppercase text-[#E78A3E] truncate max-w-full px-1 mt-0.5">
                      {(tableWaiterAssignments[tableId] || "Open").split(" ")[0]}
                    </span>
                    {(openOrders > 0 || openRequests > 0) && (
                      <div className="absolute top-1 right-1 flex flex-col gap-0.5">
                        {openRequests > 0 && (
                          <span className="px-1 py-0.5 rounded-full bg-red-600 text-white text-[6px] sm:text-[7px] font-mono font-black">{openRequests}R</span>
                        )}
                        {openOrders > 0 && (
                          <span className="px-1 py-0.5 rounded-full bg-[#E78A3E] text-black text-[6px] sm:text-[7px] font-mono font-black">{openOrders}O</span>
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
