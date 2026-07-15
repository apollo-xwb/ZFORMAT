import type { MasterBillItem } from "./types";

export type BillSplitMode = "EQUAL" | "ITEMS" | "CUSTOM";

export type BillRequestLineItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  unpaidQuantity?: number;
};

export type BillRequestDetails = {
  splitMode: BillSplitMode;
  guestPayAmount: number;
  guestSubtotal: number;
  tipAmount: number;
  tipPercent: number;
  tableTotal: number;
  tableRemaining: number;
  tableAlreadyPaid: number;
  splitCount?: number;
  equalShareAmount?: number;
  selectedItems?: BillRequestLineItem[];
  tableItems?: BillRequestLineItem[];
  guestName?: string;
};

export function formatBillSplitModeLabel(mode: BillSplitMode, splitCount?: number): string {
  if (mode === "EQUAL") {
    return splitCount ? `Equal split · ${splitCount} ways` : "Equal split";
  }
  if (mode === "ITEMS") return "Pay by item";
  return "Custom amount";
}

export function buildBillRequestDetails(input: {
  splitMode: BillSplitMode;
  guestSubtotal: number;
  tipAmount: number;
  tipPercent: number;
  tableTotal: number;
  tableRemaining: number;
  tableAlreadyPaid: number;
  splitCount?: number;
  masterBillItems: MasterBillItem[];
  itemSharesToPay?: Record<string, number>;
  guestName?: string;
}): BillRequestDetails {
  const tableItems: BillRequestLineItem[] = input.masterBillItems.map((item) => {
    const unpaidQuantity = Math.max(0, item.quantity - item.paidCount);
    return {
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      lineTotal: item.price * item.quantity,
      unpaidQuantity,
    };
  });

  let selectedItems: BillRequestLineItem[] | undefined;
  if (input.splitMode === "ITEMS" && input.itemSharesToPay) {
    selectedItems = Object.entries(input.itemSharesToPay)
      .map(([id, qty]) => {
        const match = input.masterBillItems.find((item) => item.id === id);
        if (!match || qty <= 0) return null;
        return {
          name: match.name,
          quantity: qty,
          unitPrice: match.price,
          lineTotal: match.price * qty,
        };
      })
      .filter((item): item is BillRequestLineItem => item !== null);
  }

  const equalShareAmount =
    input.splitMode === "EQUAL" && input.splitCount
      ? parseFloat((input.tableRemaining / input.splitCount).toFixed(2))
      : undefined;

  return {
    splitMode: input.splitMode,
    guestPayAmount: input.guestSubtotal + input.tipAmount,
    guestSubtotal: input.guestSubtotal,
    tipAmount: input.tipAmount,
    tipPercent: input.tipPercent,
    tableTotal: input.tableTotal,
    tableRemaining: input.tableRemaining,
    tableAlreadyPaid: input.tableAlreadyPaid,
    splitCount: input.splitMode === "EQUAL" ? input.splitCount : undefined,
    equalShareAmount,
    selectedItems,
    tableItems,
    guestName: input.guestName?.trim() || undefined,
  };
}

export function resolveBillRequestDetails(request: {
  note?: string;
  billDetails?: BillRequestDetails;
}): BillRequestDetails | null {
  if (request.billDetails) return request.billDetails;

  const note = request.note || "";
  const amountMatch = note.match(/Request:\s*R([\d.]+)\s*\(([^)]+)\)/i);
  if (!amountMatch) return null;

  const guestPayAmount = parseFloat(amountMatch[1]);
  const splitText = amountMatch[2].toLowerCase();
  const tipMatch = note.match(/Tip\s*R([\d.]+)/i);
  const tipAmount = tipMatch ? parseFloat(tipMatch[1]) : 0;

  let splitMode: BillSplitMode = "CUSTOM";
  let splitCount: number | undefined;
  if (splitText.includes("equal")) {
    splitMode = "EQUAL";
    const waysMatch = splitText.match(/(\d+)\s*way/);
    splitCount = waysMatch ? parseInt(waysMatch[1], 10) : 2;
  } else if (splitText.includes("item")) {
    splitMode = "ITEMS";
  }

  const guestSubtotal = Math.max(0, guestPayAmount - tipAmount);

  return {
    splitMode,
    guestPayAmount,
    guestSubtotal,
    tipAmount,
    tipPercent: guestSubtotal > 0 ? Math.round((tipAmount / guestSubtotal) * 100) : 0,
    tableTotal: guestPayAmount,
    tableRemaining: guestPayAmount,
    tableAlreadyPaid: 0,
    splitCount,
    equalShareAmount: splitMode === "EQUAL" && splitCount ? guestSubtotal : undefined,
  };
}

export function formatBillRequestStaffSummary(details: BillRequestDetails): string {
  const splitLabel = formatBillSplitModeLabel(details.splitMode, details.splitCount);
  const guest = details.guestName ? `${details.guestName} pays ` : "Guest pays ";
  const tip = details.tipAmount > 0 ? ` incl. R${details.tipAmount.toFixed(0)} tip` : "";
  return `${guest}R${details.guestPayAmount.toFixed(2)} · ${splitLabel}${tip}`;
}
