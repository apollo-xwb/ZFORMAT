import React from "react";
import {
  BillRequestDetails,
  formatBillSplitModeLabel,
  resolveBillRequestDetails,
} from "../billRequest";

type Props = {
  note?: string;
  billDetails?: BillRequestDetails;
  variant?: "staff" | "guest" | "compact";
  className?: string;
};

function money(value: number) {
  return `R${value.toFixed(2)}`;
}

export function BillRequestSummary({
  note,
  billDetails,
  variant = "staff",
  className = "",
}: Props) {
  const details = resolveBillRequestDetails({ note, billDetails });
  if (!details) {
    if (!note) return null;
    return (
      <p className={`text-zinc-500 text-xs mt-1 ${className}`}>{note}</p>
    );
  }

  const isGuest = variant === "guest";
  const isCompact = variant === "compact";
  const labelClass = isGuest ? "text-zinc-700" : "text-zinc-500";
  const valueClass = isGuest ? "text-black font-bold" : "text-zinc-300";
  const accentClass = isGuest ? "text-[#3E5E93]" : "text-[#3E5E93]";

  if (isCompact) {
    return (
      <p className={`text-xs mt-1 ${labelClass} ${className}`}>
        <span className={accentClass}>{money(details.guestPayAmount)}</span>
        {" · "}
        {formatBillSplitModeLabel(details.splitMode, details.splitCount)}
        {details.tipAmount > 0 ? ` · tip ${money(details.tipAmount)}` : ""}
      </p>
    );
  }

  return (
    <div className={`mt-2 space-y-2 ${className}`}>
      <div className={`grid ${isGuest ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"} gap-2 text-xs`}>
        <div className={`rounded-xl border p-2.5 ${isGuest ? "border-zinc-200 bg-zinc-50" : "border-zinc-800 bg-black/40"}`}>
          <p className={`uppercase text-[9px] font-mono tracking-wider ${labelClass}`}>This payment</p>
          <p className={`text-sm font-black ${accentClass}`}>{money(details.guestPayAmount)}</p>
          <p className={`${labelClass} mt-0.5`}>
            Subtotal {money(details.guestSubtotal)}
            {details.tipAmount > 0 ? ` · Tip ${money(details.tipAmount)} (${details.tipPercent}%)` : " · No tip"}
          </p>
        </div>
        <div className={`rounded-xl border p-2.5 ${isGuest ? "border-zinc-200 bg-zinc-50" : "border-zinc-800 bg-black/40"}`}>
          <p className={`uppercase text-[9px] font-mono tracking-wider ${labelClass}`}>Split method</p>
          <p className={`text-sm font-black uppercase ${valueClass}`}>
            {formatBillSplitModeLabel(details.splitMode, details.splitCount)}
          </p>
          {details.splitMode === "EQUAL" && details.splitCount && (
            <p className={`${labelClass} mt-0.5`}>
              {details.splitCount} guests · {money(details.equalShareAmount || details.guestSubtotal)} each
            </p>
          )}
          {details.splitMode === "CUSTOM" && (
            <p className={`${labelClass} mt-0.5`}>Guest chose a custom share of the remaining balance</p>
          )}
          {details.guestName && (
            <p className={`${labelClass} mt-0.5`}>Requested by {details.guestName}</p>
          )}
        </div>
      </div>

      <div className={`rounded-xl border p-2.5 text-xs ${isGuest ? "border-zinc-200 bg-white" : "border-zinc-800 bg-black/30"}`}>
        <p className={`uppercase text-[9px] font-mono tracking-wider ${labelClass}`}>Table bill context</p>
        <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-1 ${valueClass}`}>
          <span>Total {money(details.tableTotal)}</span>
          <span>Remaining {money(details.tableRemaining)}</span>
          <span>Paid so far {money(details.tableAlreadyPaid)}</span>
        </div>
      </div>

      {details.splitMode === "ITEMS" && details.selectedItems && details.selectedItems.length > 0 && (
        <div className={`rounded-xl border p-2.5 text-xs ${isGuest ? "border-zinc-200 bg-white" : "border-zinc-800 bg-black/30"}`}>
          <p className={`uppercase text-[9px] font-mono tracking-wider ${labelClass}`}>Paying for these items</p>
          <ul className={`mt-1 space-y-1 ${valueClass}`}>
            {details.selectedItems.map((item, index) => (
              <li key={`${item.name}-${index}`} className="flex justify-between gap-2">
                <span>{item.quantity}× {item.name}</span>
                <span className={accentClass}>{money(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {details.tableItems && details.tableItems.length > 0 && variant === "staff" && (
        <div className="rounded-xl border border-zinc-800 bg-black/20 p-2.5 text-xs">
          <p className="uppercase text-[9px] font-mono tracking-wider text-zinc-500">Full table bill</p>
          <ul className="mt-1 space-y-1 text-zinc-400 max-h-28 overflow-y-auto">
            {details.tableItems.map((item, index) => (
              <li key={`${item.name}-${index}`} className="flex justify-between gap-2">
                <span>
                  {item.quantity}× {item.name}
                  {(item.unpaidQuantity ?? 0) > 0 && item.unpaidQuantity! < item.quantity
                    ? ` (${item.unpaidQuantity} unpaid)`
                    : (item.unpaidQuantity ?? 0) === 0
                      ? " (paid)"
                      : ""}
                </span>
                <span>{money(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
