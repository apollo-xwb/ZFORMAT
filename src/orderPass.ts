import type { CartItem, HistoricOrder } from "./types";
import { formatTableLabel, REMOTE_TABLE_ID } from "./luthoTables";
import { LUTHO_STAMP_LOGO_LOCAL_URL, loadCanvasLogoImage } from "./qrConfig";
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

const ORANGE = "#3E5E93";
const BLACK = "#0A0A0B";
const WHITE = "#FFFFFF";
const MUTED = "#A1A1AA";

export function generateClaimCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function buildClaimPayload(orderId: string, claimCode: string): string {
  return `lutho-claim:${orderId}:${claimCode}`;
}

export function parseClaimPayload(value: string): { orderId: string; claimCode: string } | null {
  const trimmed = value.trim();
  const match = trimmed.match(/^lutho-claim:([^:]+):(\d{4})$/i);
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

function tablePassLabel(tableId: string) {
  return String(tableId) === REMOTE_TABLE_ID ? "Remote Ordering" : formatTableLabel(tableId);
}

export function buildOrderPassText(payload: OrderPassPayload): string {
  const { order, tableId, orderedBy, assignedStaffName, isRemote, isGroup, groupRoundId, claimCode } = payload;
  const when = new Date(order.createdAt || Date.now()).toLocaleString();
  return [
    "══════════════════════════════════",
    "   LUTHO OS — GUEST ORDER PASS",
    "══════════════════════════════════",
    "",
    `Pass ID:     ${order.id}`,
    claimCode ? `CLAIM CODE:  ${claimCode}` : null,
    `Table:       ${tablePassLabel(tableId)}`,
    isRemote ? "Channel:     Remote Ordering" : "Channel:     Dine-in",
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
    "LUTHO → PILOT POS MANUAL ENTRY",
    "--------------------------------",
    `Order:  ${payload.orderId}`,
    payload.claimCode ? `Claim:  ${payload.claimCode}` : null,
    `Table:  ${tablePassLabel(payload.tableId)}`,
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
    "then mark Preparing → Ready → Served/Paid in LUTHO.",
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

function drawGridBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = BLACK;
  ctx.fillRect(0, 0, width, height);

  // Soft radial glow behind badge area
  const glow = ctx.createRadialGradient(width / 2, 210, 20, width / 2, 210, 280);
  glow.addColorStop(0, "rgba(231, 138, 62, 0.22)");
  glow.addColorStop(1, "rgba(231, 138, 62, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, 480);

  ctx.strokeStyle = "rgba(231, 138, 62, 0.12)";
  ctx.lineWidth = 1;
  const step = 28;
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }

  // Fine diagonal hatch accent
  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
  for (let i = -height; i < width; i += 18) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

async function buildPassCanvas(payload: OrderPassPayload): Promise<HTMLCanvasElement> {
  const claimCode = payload.claimCode || "----";
  const claimQr = buildClaimPayload(payload.order.id, claimCode);
  const qrDataUrl = await QRCode.toDataURL(claimQr, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 420,
    color: { dark: "#0A0A0B", light: "#FFFFFF" },
  });

  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 1100;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  drawGridBackground(ctx, canvas.width, canvas.height);

  // Top orange rule
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 0, canvas.width, 6);

  // Brand header card
  roundRect(ctx, 36, 36, canvas.width - 72, 118, 20);
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fill();
  ctx.strokeStyle = "rgba(231, 138, 62, 0.45)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const stamp = await loadCanvasLogoImage(LUTHO_STAMP_LOGO_LOCAL_URL);
  if (stamp) {
    const badge = 72;
    const bx = 56;
    const by = 52;
    ctx.beginPath();
    ctx.arc(bx + badge / 2, by + badge / 2, badge / 2 + 3, 0, Math.PI * 2);
    ctx.fillStyle = WHITE;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx + badge / 2, by + badge / 2, badge / 2 + 1, 0, Math.PI * 2);
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.arc(bx + badge / 2, by + badge / 2, badge / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(stamp, bx, by, badge, badge);
    ctx.restore();
  }

  ctx.fillStyle = ORANGE;
  ctx.font = "800 13px Inter, Arial, sans-serif";
  ctx.fillText("LUTHO OS  ·  COLLECTION PASS", 148, 78);
  ctx.fillStyle = WHITE;
  ctx.font = "900 34px Inter, Arial, sans-serif";
  ctx.fillText("ORDER PASS", 148, 118);
  ctx.fillStyle = MUTED;
  ctx.font = "600 12px Inter, Arial, sans-serif";
  ctx.fillText(tablePassLabel(payload.tableId).toUpperCase(), 148, 140);

  // Claim code panel
  roundRect(ctx, 36, 174, canvas.width - 72, 120, 18);
  ctx.fillStyle = ORANGE;
  ctx.fill();
  ctx.fillStyle = BLACK;
  ctx.font = "800 12px Inter, Arial, sans-serif";
  ctx.fillText("CLAIM CODE", 58, 208);
  ctx.font = "900 56px Inter, Arial, sans-serif";
  ctx.fillText(claimCode, 58, 268);
  ctx.font = "700 14px Inter, Arial, sans-serif";
  const guestLine = `${payload.orderedBy || "Guest"}  ·  R${payload.order.total}`;
  ctx.fillText(guestLine, 340, 248);

  // QR panel
  const qrPanelY = 318;
  roundRect(ctx, 36, qrPanelY, canvas.width - 72, 420, 22);
  ctx.fillStyle = WHITE;
  ctx.fill();

  const qrImg = await loadImage(qrDataUrl);
  const qrSize = 300;
  const qrX = (canvas.width - qrSize) / 2;
  const qrY = qrPanelY + 48;
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // Stamp logo in QR center
  if (stamp) {
    const logoSize = 78;
    const lx = (canvas.width - logoSize) / 2;
    const ly = qrY + (qrSize - logoSize) / 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, ly + logoSize / 2, logoSize / 2 + 8, 0, Math.PI * 2);
    ctx.fillStyle = WHITE;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, ly + logoSize / 2, logoSize / 2 + 5, 0, Math.PI * 2);
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, ly + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(stamp, lx, ly, logoSize, logoSize);
    ctx.restore();
  }

  ctx.fillStyle = BLACK;
  ctx.font = "700 13px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Staff scan QR  ·  or enter claim code at counter", canvas.width / 2, qrPanelY + 380);
  ctx.fillStyle = MUTED;
  ctx.font = "600 11px Inter, Arial, sans-serif";
  ctx.fillText(`Pass ${payload.order.id}`, canvas.width / 2, qrPanelY + 400);
  ctx.textAlign = "left";

  // Items panel
  const itemsY = 760;
  roundRect(ctx, 36, itemsY, canvas.width - 72, 280, 18);
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fill();
  ctx.strokeStyle = "rgba(231, 138, 62, 0.35)";
  ctx.lineWidth = 1.25;
  ctx.stroke();

  ctx.fillStyle = ORANGE;
  ctx.font = "800 12px Inter, Arial, sans-serif";
  ctx.fillText("ITEMS", 56, itemsY + 32);
  ctx.fillStyle = MUTED;
  ctx.font = "600 11px Inter, Arial, sans-serif";
  ctx.fillText(new Date(payload.order.createdAt || Date.now()).toLocaleString(), 420, itemsY + 32);

  let y = itemsY + 62;
  ctx.font = "600 15px Inter, Arial, sans-serif";
  const maxItems = 7;
  payload.order.items.slice(0, maxItems).forEach((item) => {
    ctx.fillStyle = WHITE;
    ctx.fillText(`${item.quantity}×  ${item.menuItem.name}`.slice(0, 38), 56, y);
    ctx.fillStyle = ORANGE;
    ctx.textAlign = "right";
    ctx.fillText(`R${item.menuItem.price * item.quantity}`, canvas.width - 56, y);
    ctx.textAlign = "left";
    y += 28;
  });
  if (payload.order.items.length > maxItems) {
    ctx.fillStyle = MUTED;
    ctx.fillText(`+${payload.order.items.length - maxItems} more…`, 56, y);
    y += 28;
  }

  ctx.strokeStyle = "rgba(231, 138, 62, 0.35)";
  ctx.beginPath();
  ctx.moveTo(56, y + 4);
  ctx.lineTo(canvas.width - 56, y + 4);
  ctx.stroke();

  ctx.fillStyle = WHITE;
  ctx.font = "800 16px Inter, Arial, sans-serif";
  ctx.fillText("TOTAL", 56, y + 34);
  ctx.fillStyle = ORANGE;
  ctx.font = "900 28px Inter, Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`R${payload.order.total}`, canvas.width - 56, y + 34);
  ctx.textAlign = "left";

  // Bottom accent
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, canvas.height - 6, canvas.width, 6);

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
  downloadBlob(`lutho-pass-${payload.order.id}-${guest}.png`, blob);
}

export async function downloadOrderPassPdf(payload: OrderPassPayload) {
  const canvas = await buildPassCanvas(payload);
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  // Full-bleed black page behind the pass card
  pdf.setFillColor(10, 10, 11);
  pdf.rect(0, 0, pageW, pageH, "F");
  const margin = 28;
  const drawW = pageW - margin * 2;
  const drawH = (canvas.height / canvas.width) * drawW;
  const y = Math.max(margin, (pageH - drawH) / 2);
  pdf.addImage(img, "PNG", margin, y, drawW, Math.min(drawH, pageH - margin * 2));
  const guest = (payload.orderedBy || "guest").replace(/\s+/g, "-").toLowerCase();
  pdf.save(`lutho-pass-${payload.order.id}-${guest}.pdf`);
}

export async function downloadOrderPass(payload: OrderPassPayload, format: PassFormat = "pdf") {
  if (format === "png") await downloadOrderPassPng(payload);
  else await downloadOrderPassPdf(payload);
  return buildOrderPassText(payload);
}
