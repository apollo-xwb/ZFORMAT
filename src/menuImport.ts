// Menu import helpers — parse an uploaded menu (any format) into draft items.
import { MenuItem } from "./types";

export type MenuField = "name" | "price" | "description" | "category" | "section" | "emoji" | "ignore";

export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

export interface DraftMenuItem {
  id: string;
  name: string;
  price: number;
  priceText?: string;
  description: string;
  category: "EAT" | "DRINK";
  emoji: string;
  sectionName?: string;
  image?: string;
}

let uid = 0;
export function draftId(): string {
  uid += 1;
  return `import-${Date.now().toString(36)}-${uid}`;
}

/** Split a raw CSV/TSV string into a table (auto-detects delimiter). */
export function parseDelimited(raw: string): ParsedTable {
  const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const delimiter = detectDelimiter(lines[0]);
  const splitLine = (line: string) => splitCsvLine(line, delimiter);

  const headers = splitLine(lines[0]).map((h) => h.trim());
  const rows = lines.slice(1).map(splitLine);
  return { headers, rows };
}

function detectDelimiter(line: string): string {
  const candidates = [",", "\t", ";", "|"];
  let best = ",";
  let bestCount = -1;
  for (const c of candidates) {
    const count = line.split(c).length;
    if (count > bestCount) {
      bestCount = count;
      best = c;
    }
  }
  return best;
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

/** Pull the first number out of a string like "R 129.00" or "$12". */
export function parsePrice(value: string): { price: number; priceText?: string } {
  if (!value) return { price: 0 };
  const match = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  const price = match ? parseFloat(match[0]) : 0;
  return { price: isNaN(price) ? 0 : price, priceText: value.trim() || undefined };
}

/** Guess whether an item is a drink from its text. */
export function guessCategory(text: string): "EAT" | "DRINK" {
  const t = text.toLowerCase();
  const drinkWords = ["beer", "wine", "cocktail", "coffee", "latte", "cappuccino", "espresso", "tea", "juice", "soda", "cola", "water", "whisky", "vodka", "gin", "rum", "shot", "cider", "smoothie", "milkshake", "lemonade", "spirit", "draught", "draft", "shooter", "liqueur"];
  return drinkWords.some((w) => t.includes(w)) ? "DRINK" : "EAT";
}

const FOOD_EMOJI: [string[], string][] = [
  [["burger", "smash"], "🍔"],
  [["pizza"], "🍕"],
  [["chicken", "wing"], "🍗"],
  [["rib", "steak", "grill", "beef"], "🥩"],
  [["fries", "chips"], "🍟"],
  [["salad", "veg", "greens"], "🥗"],
  [["fish", "seafood", "prawn", "calamari"], "🐟"],
  [["taco", "wrap", "burrito"], "🌮"],
  [["pasta", "noodle"], "🍝"],
  [["dessert", "cake", "ice", "sweet"], "🍰"],
  [["coffee", "latte", "espresso", "cappuccino"], "☕"],
  [["beer", "cider", "draught", "lager", "ale"], "🍺"],
  [["wine"], "🍷"],
  [["cocktail", "gin", "vodka", "rum", "whisky", "spirit"], "🍸"],
  [["juice", "smoothie", "soda", "cola", "lemonade"], "🥤"],
  [["breakfast", "egg"], "🍳"],
];

export function guessEmoji(text: string, category: "EAT" | "DRINK"): string {
  const t = text.toLowerCase();
  for (const [words, emoji] of FOOD_EMOJI) {
    if (words.some((w) => t.includes(w))) return emoji;
  }
  return category === "DRINK" ? "🥤" : "🍽️";
}

/** Best-effort auto-mapping of table headers to menu fields. */
export function autoMapHeaders(headers: string[]): MenuField[] {
  return headers.map((h) => {
    const k = h.toLowerCase();
    if (/(^|\b)(name|item|dish|title|product)\b/.test(k)) return "name";
    if (/(price|cost|amount|r\b|zar|\$)/.test(k)) return "price";
    if (/(desc|detail|ingredient|about)/.test(k)) return "description";
    if (/(category|type|group)/.test(k)) return "category";
    if (/(section|menu|course|heading)/.test(k)) return "section";
    if (/(emoji|icon)/.test(k)) return "emoji";
    return "ignore";
  });
}

/** Parse free-form pasted text where each line is one item. */
export function parseFreeText(raw: string): DraftMenuItem[] {
  const lines = raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const items: DraftMenuItem[] = [];
  let currentSection: string | undefined;

  for (const line of lines) {
    // A line with no price and short-ish -> treat as a section heading
    const priceMatch = line.match(/(?:R|ZAR|\$|€|£)?\s?\d+(?:[.,]\d{1,2})?/);
    const looksLikeHeading = !priceMatch && line.length <= 40 && !line.includes(":");
    if (looksLikeHeading && /^[A-Z0-9][A-Za-z0-9 &'/-]*$/.test(line)) {
      currentSection = line;
      continue;
    }

    // Try "Name - description ... price" patterns
    let name = line;
    let priceText: string | undefined;
    let description = "";

    if (priceMatch) {
      priceText = priceMatch[0].trim();
      name = line.slice(0, priceMatch.index).trim();
    }
    // Separate name / description on common separators
    const sep = name.match(/\s[–—-]\s|:\s/);
    if (sep && sep.index !== undefined) {
      description = name.slice(sep.index + sep[0].length).trim();
      name = name.slice(0, sep.index).trim();
    }
    name = name.replace(/[.\s]+$/, "").trim();
    if (!name) continue;

    const category = guessCategory(`${name} ${description} ${currentSection || ""}`);
    const { price } = parsePrice(priceText || "");
    items.push({
      id: draftId(),
      name,
      price,
      priceText,
      description,
      category,
      emoji: guessEmoji(`${name} ${description}`, category),
      sectionName: currentSection,
    });
  }
  return items;
}

/** Convert a parsed table + mapping into draft items. */
export function tableToDrafts(table: ParsedTable, mapping: MenuField[]): DraftMenuItem[] {
  const idx = (field: MenuField) => mapping.indexOf(field);
  const nameI = idx("name");
  const priceI = idx("price");
  const descI = idx("description");
  const catI = idx("category");
  const secI = idx("section");
  const emojiI = idx("emoji");

  const out: DraftMenuItem[] = [];
  for (const row of table.rows) {
    const name = nameI >= 0 ? (row[nameI] || "").trim() : "";
    if (!name) continue;
    const priceRaw = priceI >= 0 ? row[priceI] || "" : "";
    const { price, priceText } = parsePrice(priceRaw);
    const description = descI >= 0 ? (row[descI] || "").trim() : "";
    const sectionName = secI >= 0 ? (row[secI] || "").trim() || undefined : undefined;
    const rawCat = catI >= 0 ? (row[catI] || "").toLowerCase() : "";
    const category: "EAT" | "DRINK" = rawCat
      ? rawCat.startsWith("d") || rawCat.includes("drink") || rawCat.includes("bev")
        ? "DRINK"
        : "EAT"
      : guessCategory(`${name} ${description} ${sectionName || ""}`);
    const emoji = emojiI >= 0 && row[emojiI] ? row[emojiI].trim() : guessEmoji(`${name} ${description}`, category);
    out.push({ id: draftId(), name, price, priceText: priceText, description, category, emoji, sectionName });
  }
  return out;
}

export function draftsToMenuItems(drafts: DraftMenuItem[]): MenuItem[] {
  return drafts
    .filter((d) => d.name.trim().length > 0)
    .map((d) => ({
      id: d.id,
      name: d.name.trim(),
      price: d.price || 0,
      priceText: d.priceText,
      description: d.description || "",
      category: d.category,
      emoji: d.emoji || "🍽️",
      sectionName: d.sectionName || "Imported",
      image: d.image || undefined,
    }));
}

const IMPORTED_MENU_KEY = "lutho_imported_menu";

export function readImportedMenu(): MenuItem[] {
  try {
    const raw = localStorage.getItem(IMPORTED_MENU_KEY);
    return raw ? (JSON.parse(raw) as MenuItem[]) : [];
  } catch {
    return [];
  }
}

export function saveImportedMenu(items: MenuItem[]): void {
  try {
    localStorage.setItem(IMPORTED_MENU_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("lutho_menu_updated"));
  } catch {
    /* ignore */
  }
}
