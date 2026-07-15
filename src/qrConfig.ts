export const ROCO_BRAND_LOGO_URL = "https://www.rocomamas.co.ke/images//logo-combined.png";
/** Stamp / skull logo used on loyalty stamps (QR center art). */
export const ROCO_STAMP_LOGO_URL =
  "https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479";
/** Same-origin copy for canvas/print export (avoids CORS taint). */
export const ROCO_STAMP_LOGO_LOCAL_URL = "/roco-stamp-logo.png";

const canvasLogoCache = new Map<string, string>();

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to read logo blob"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read logo blob"));
    reader.readAsDataURL(blob);
  });
}

function loadImageElement(src: string, crossOrigin = false): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/** Resolve any logo source to a canvas-safe data URL for print/export. */
export async function resolveCanvasLogoDataUrl(src: string): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith("data:") || src.startsWith("blob:")) return src;

  const cached = canvasLogoCache.get(src);
  if (cached) return cached;

  if (src === ROCO_STAMP_LOGO_URL) {
    try {
      const local = await loadImageElement(ROCO_STAMP_LOGO_LOCAL_URL);
      const canvas = document.createElement("canvas");
      canvas.width = local.naturalWidth;
      canvas.height = local.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(local, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      canvasLogoCache.set(src, dataUrl);
      canvasLogoCache.set(ROCO_STAMP_LOGO_LOCAL_URL, dataUrl);
      return dataUrl;
    } catch {
      // fall through to remote strategies
    }
  }

  try {
    const response = await fetch(src, { mode: "cors", credentials: "omit" });
    if (!response.ok) throw new Error("Logo fetch failed");
    const dataUrl = await blobToDataUrl(await response.blob());
    canvasLogoCache.set(src, dataUrl);
    return dataUrl;
  } catch {
    try {
      const img = await loadImageElement(src, true);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      canvasLogoCache.set(src, dataUrl);
      return dataUrl;
    } catch {
      return null;
    }
  }
}

export async function loadCanvasLogoImage(src: string): Promise<HTMLImageElement | null> {
  const dataUrl = await resolveCanvasLogoDataUrl(src);
  if (!dataUrl) return null;
  try {
    return await loadImageElement(dataUrl);
  } catch {
    return null;
  }
}

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
