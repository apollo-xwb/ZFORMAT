export const ROCO_BRAND_LOGO_URL = "https://www.rocomamas.co.ke/images//logo-combined.png";
/** Stamp / skull logo used on loyalty stamps (QR center art). */
export const ROCO_STAMP_LOGO_URL =
  "https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479";

export const QR_OVERLAY_STORAGE_KEY = "roco_qr_overlays";
export const CUSTOM_QR_STORAGE_KEY = "roco_custom_qrs";

export function readStoredQrOverlays(): Record<string, string> {
  try {
    const saved = localStorage.getItem(QR_OVERLAY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function readStoredCustomQrs(): Record<string, string> {
  try {
    const saved = localStorage.getItem(CUSTOM_QR_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function resolveQrOverlaySrc(
  tableId: string,
  overlays: Record<string, string>
): string | undefined {
  const perTable = overlays[tableId];
  if (perTable) return perTable;
  const globalDefault = overlays._default;
  if (globalDefault) return globalDefault;
  return undefined;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("Failed to read file"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
