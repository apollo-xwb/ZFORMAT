// Lutho Theme Studio — runtime palette engine.
// Any venue can retheme the entire app by setting three brand colours.
// These map to the CSS variables consumed across the app (see index.css).

export interface LuthoPalette {
  primary: string;   // main CTAs / active states  (default: light navy)
  secondary: string; // silver / chrome accents
  tertiary: string;  // champagne / celebratory accents
}

export const DEFAULT_PALETTE: LuthoPalette = {
  primary: "#3E5E93",
  secondary: "#9AA6B8",
  tertiary: "#C7A468",
};

const STORAGE_KEY = "lutho_theme_palette";

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHex(value: string): boolean {
  return HEX_RE.test((value || "").trim());
}

function normalizeHex(hex: string): string {
  let h = (hex || "").trim();
  if (!h.startsWith("#")) h = `#${h}`;
  if (h.length === 4) {
    // #abc -> #aabbcc
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  return h.toLowerCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = normalizeHex(hex);
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  };
}

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

/** Return a darker shade of a hex colour (for hover states). */
export function shade(hex: string, amount = 0.16): string {
  const { r, g, b } = hexToRgb(hex);
  const f = 1 - amount;
  return `#${[r * f, g * f, b * f]
    .map((v) => clamp(v).toString(16).padStart(2, "0"))
    .join("")}`;
}

/** Choose black or white text for best contrast on a background colour. */
export function contrastText(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  // Perceived luminance (sRGB)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1A1A1A" : "#FFFFFF";
}

export function readStoredPalette(): LuthoPalette {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PALETTE };
    const parsed = JSON.parse(raw) as Partial<LuthoPalette>;
    return {
      primary: isValidHex(parsed.primary || "") ? normalizeHex(parsed.primary!) : DEFAULT_PALETTE.primary,
      secondary: isValidHex(parsed.secondary || "") ? normalizeHex(parsed.secondary!) : DEFAULT_PALETTE.secondary,
      tertiary: isValidHex(parsed.tertiary || "") ? normalizeHex(parsed.tertiary!) : DEFAULT_PALETTE.tertiary,
    };
  } catch {
    return { ...DEFAULT_PALETTE };
  }
}

export function savePalette(palette: LuthoPalette): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palette));
  } catch {
    /* ignore quota / privacy errors */
  }
}

/** Push a palette into the live document as CSS custom properties. */
export function applyPalette(palette: LuthoPalette): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--lutho-primary", palette.primary);
  root.style.setProperty("--lutho-primary-strong", shade(palette.primary, 0.18));
  root.style.setProperty("--lutho-on-primary", contrastText(palette.primary));
  root.style.setProperty("--lutho-secondary", palette.secondary);
  root.style.setProperty("--lutho-tertiary", palette.tertiary);
}

/** Load + apply the stored palette. Call once on app boot. */
export function bootstrapTheme(): LuthoPalette {
  const palette = readStoredPalette();
  applyPalette(palette);
  return palette;
}

/** A few tasteful ready-made brand presets owners can start from. */
export const PALETTE_PRESETS: { name: string; palette: LuthoPalette }[] = [
  { name: "Lutho (default)", palette: { primary: "#3E5E93", secondary: "#9AA6B8", tertiary: "#C7A468" } },
  { name: "Espresso & Cream", palette: { primary: "#6F4E37", secondary: "#B7A99A", tertiary: "#D9B382" } },
  { name: "Vineyard", palette: { primary: "#6D284E", secondary: "#A98DA6", tertiary: "#C9A227" } },
  { name: "Forest Bistro", palette: { primary: "#2F5D50", secondary: "#9CB4AB", tertiary: "#C9A05B" } },
  { name: "Sunset Grill", palette: { primary: "#C2410C", secondary: "#B9A79A", tertiary: "#E0A458" } },
  { name: "Midnight Lounge", palette: { primary: "#1F2937", secondary: "#8B93A3", tertiary: "#C0A15B" } },
  { name: "Ocean Cafe", palette: { primary: "#0E7490", secondary: "#93B4BC", tertiary: "#E2B857" } },
];
