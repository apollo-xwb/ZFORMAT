import type { CartItem, HistoricOrder } from "./types";
import { formatTableLabel } from "./rocoTables";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

export type OrderPassPayload = {
  order: HistoricOrder;
  tableId: string;
  orderedBy?: string;
  assignedStaffName?: string;
  isRemote?: boolean;
  isGroup?: boolean;
  groupRoundId?: string;
  claimCode?: string;
};

export type PassFormat = "pdf" | "png";

export function generateClaimCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function buildClaimPayload(orderId: string, claimCode: string): string {
  return `roco-claim:${orderId}:${claimCode}`;
}

export function parseClaimPayload(value: string): { orderId: string; claimCode: string } | null {
  const trimmed = value.trim();
  const match = trimmed.match(/^roco-claim:([^:]+):(\d{4})$/i);
  if (match) return { orderId: match[1], claimCode: match[2] };
  if (/^\d{4}$/.test(trimmed)) return { orderId: "", claimCode: trimmed };
  return null;
}

function lineItems(items: CartItem[]) {
  return items
    .map(
      (item) =>
        `  ${item.quantity}× ${item.menuItem.name.padEnd(28).slice(0, 28)} R${item.menuItem.price * item.quantity}`
    )
    .join("\n");
}

export function buildOrderPassText(payload: OrderPassPayload): string {
  const { order, tableId, orderedBy, assignedStaffName, isRemote, isGroup, groupRoundId, claimCode } = payload;
  const when = new Date(order.createdAt || Date.now()).toLocaleString();
  return [
    "══════════════════════════════════",
    "   ROCO OS — GUEST ORDER PASS",
    "══════════════════════════════════",
    "",
    `Pass ID:     ${order.id}`,
    claimCode ? `CLAIM CODE:  ${claimCode}` : null,
    `Table:       ${formatTableLabel(tableId)}`,
    isRemote ? "Channel:     Remote Table" : "Channel:     Dine-in",
    isGroup ? "Mode:        Group lock-in round" : "Mode:        Solo order",
    orderedBy ? `Guest:       ${orderedBy}` : null,
    assignedStaffName ? `Waiter:      ${assignedStaffName}` : null,
    groupRoundId ? `Group round: ${groupRoundId}` : null,
    `Sent:        ${when}`,
    `Status:      ${order.status}`,
    "",
    "────────── ITEMS ──────────",
    lineItems(order.items),
    "───────────────────────────",
    `TOTAL                    R${order.total}`,
    order.notes ? `\nKitchen notes:\n  ${order.notes}` : "",
    "",
    claimCode
      ? "Show this pass / claim code when collecting.\nStaff scan the QR or type your 4-digit code."
      : "Show this pass at collection / to staff.",
    "Re-download anytime from Active Kitchen Orders.",
    "══════════════════════════════════",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function buildPilotSummaryText(payload: {
  orderId: string;
  tableId: string;
  orderedBy?: string;
  assignedStaffName?: string;
  items: CartItem[];
  total: number;
  notes?: string;
  isRemoteGroupOrder?: boolean;
  claimCode?: string;
}): string {
  const lines = [
    "ROCO → PILOT POS MANUAL ENTRY",
    "--------------------------------",
    `Order:  ${payload.orderId}`,
    payload.claimCode ? `Claim:  ${payload.claimCode}` : null,
    `Table:  ${formatTableLabel(payload.tableId)}`,
    payload.orderedBy ? `Guest:  ${payload.orderedBy}` : null,
    payload.isRemoteGroupOrder ? "Flag:   Remote / split guest" : null,
    payload.assignedStaffName ? `Staff:  ${payload.assignedStaffName}` : null,
    "",
    "LINES:",
    ...payload.items.map(
      (item) => `${item.quantity} x ${item.menuItem.name} @ R${item.menuItem.price}`
    ),
    "",
    `TOTAL: R${payload.total}`,
    payload.notes ? `NOTES: ${payload.notes}` : null,
    "--------------------------------",
    "Enter these lines into Pilot manually,",
    "then mark Preparing → Ready → Served/Paid in ROCO.",
  ].filter((line): line is string => line !== null);
  return lines.join("\n");
}

export function downloadTextFile(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function buildPassCanvas(payload: OrderPassPayload): Promise<HTMLCanvasElement> {
  const claimCode = payload.claimCode || "----";
  const claimQr = buildClaimPayload(payload.order.id, claimCode);
  const qrDataUrl = await QRCode.toDataURL(claimQr, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 360,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 1020;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, 96);
  ctx.fillStyle = "#E78A3E";
  ctx.font = "bold 36px Arial";
  ctx.fillText("ROCO ORDER PASS", 36, 58);

  ctx.fillStyle = "#000000";
  ctx.font = "bold 28px Arial";
  ctx.fillText(`CLAIM CODE  ${claimCode}`, 36, 150);
  ctx.font = "18px Arial";
  ctx.fillText(`${formatTableLabel(payload.tableId)}  •  ${payload.orderedBy || "Guest"}`, 36, 186);
  ctx.fillText(`Order ${payload.order.id}`, 36, 214);
  ctx.fillText(`Total R${payload.order.total}`, 36, 242);

  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, 180, 280, 360, 360);

  ctx.font = "16px Arial";
  ctx.fillText("Staff scan this QR or enter your 4-digit claim code.", 36, 680);
  ctx.fillText("Re-download from Active Kitchen Orders on your phone.", 36, 708);

  let y = 760;
  ctx.font = "bold 16px Arial";
  ctx.fillText("ITEMS", 36, y);
  y += 28;
  ctx.font = "15px Arial";
  payload.order.items.forEach((item) => {
    ctx.fillText(`${item.quantity}× ${item.menuItem.name}`, 36, y);
    ctx.fillText(`R${item.menuItem.price * item.quantity}`, 560, y);
    y += 24;
  });

  return canvas;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function downloadOrderPassPng(payload: OrderPassPayload) {
  const canvas = await buildPassCanvas(payload);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("PNG export failed");
  const guest = (payload.orderedBy || "guest").replace(/\s+/g, "-").toLowerCase();
  downloadBlob(`roco-pass-${payload.order.id}-${guest}.png`, blob);
}

export async function downloadOrderPassPdf(payload: OrderPassPayload) {
  const canvas = await buildPassCanvas(payload);
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 36;
  const drawW = pageW - margin * 2;
  const drawH = (canvas.height / canvas.width) * drawW;
  const y = Math.max(margin, (pageH - drawH) / 2);
  pdf.addImage(img, "PNG", margin, y, drawW, Math.min(drawH, pageH - margin * 2));
  const guest = (payload.orderedBy || "guest").replace(/\s+/g, "-").toLowerCase();
  pdf.save(`roco-pass-${payload.order.id}-${guest}.pdf`);
}

export async function downloadOrderPass(payload: OrderPassPayload, format: PassFormat = "pdf") {
  if (format === "png") await downloadOrderPassPng(payload);
  else await downloadOrderPassPdf(payload);
  return buildOrderPassText(payload);
}
