import type { CartItem, MenuItem } from "./types";

/** Realistic kitchen prep estimate in minutes (not gamified 60s defaults). */
export function getItemPrepMinutes(item: MenuItem): number {
  const name = item.name.toLowerCase();

  if (item.category === "DRINK") {
    if (name.includes("shake") || name.includes("milkshake") || name.includes("coffee")) return 4;
    if (name.includes("cocktail") || name.includes("mimosa") || name.includes("margarita") || name.includes("mojito")) return 6;
    if (name.includes("wine") || name.includes("craft") || name.includes("lager") || name.includes("beer")) return 3;
    return 3;
  }

  if (name.includes("ribs") || name.includes("platter") || name.includes("combo")) return 20;
  if (name.includes("wings") || name.includes("strips") || name.includes("southern fried")) return 15;
  if (name.includes("burger") || name.includes("smash") || name.includes("maccoy") || name.includes("bun")) return 12;
  if (name.includes("mac") && name.includes("cheese")) return 10;
  if (name.includes("fries") || name.includes("slaw") || name.includes("side") || name.includes("onion ring")) return 7;
  if (name.includes("brekkie") || name.includes("breakfast") || name.includes("egg")) return 10;
  if (name.includes("wrap") || name.includes("taco") || name.includes("quesadilla")) return 11;
  if (name.includes("salad")) return 8;
  if (item.price >= 150) return 18;
  if (item.price >= 100) return 14;
  return 10;
}

export function getItemPrepSeconds(item: MenuItem): number {
  return getItemPrepMinutes(item) * 60;
}

/** Longest single-item prep drives the order speed standard (parallel kitchen). */
export function getOrderPrepSeconds(items: CartItem[]): number {
  if (items.length === 0) return 10 * 60;
  return Math.max(...items.map((line) => getItemPrepSeconds(line.menuItem)));
}

export function formatPrepMinutes(minutes: number): string {
  return `${minutes} min`;
}
