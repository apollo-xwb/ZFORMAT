// One-shot white-label migration: RocoMamas/ROCO -> Lutho, urban-orange palette -> Lutho navy/beige/silver.
// Run once with: node scripts/lutho-migrate.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const targetFiles = [
  "src/App.tsx",
  "src/data.ts",
  "src/luthoDocs.ts",
  "src/qrConfig.ts",
  "src/rocoAudio.ts",
  "src/rocoTables.ts",
  "src/orderPass.ts",
  "src/chatStore.ts",
  "src/remoteSplit.ts",
  "src/restaurantHours.ts",
  "src/splitBillSync.ts",
  "src/tableServiceSync.ts",
  "src/tableSittingHistory.ts",
  "src/trainingManualPdf.ts",
  "src/components/BillRequestSummary.tsx",
  "src/components/ClaimCodeScannerModal.tsx",
  "src/components/HalftoneQRCode.tsx",
  "src/components/OrderMasonryGrid.tsx",
  "src/components/StaffFloorBlueprint.tsx",
  "src/components/ThuneeFullscreenApp.tsx",
  "index.html",
  "metadata.json",
  "README.md",
  "docs/PILOT-INTEGRATION-OWNER-GUIDE.md",
  "scripts/deploy-firestore-rules.ps1",
];

// Ordered list of [regex, replacement]. Order matters: specific first.
const rules = [
  // --- Specific asset URLs ---
  [/https:\/\/www\.rocomamas\.co\.ke\/images\/\/logo-combined\.png/g, "/lutho-logo.png"],
  [/https:\/\/static-prod\.dineplan\.com\/restaurant\/restaurants\/logos\/logo_4118\.png\?d=1714983479/g, "/lutho-stamp-logo.png"],
  [/https:\/\/i\.pinimg\.com\/736x\/d1\/7d\/31\/d17d3138e7946042bd5180af48250c35\.jpg/g, ""],
  // RocoMamas CMS menu images no longer resolve for the white-label; drop so keyword/emoji fallbacks render.
  [/https?:\/\/cms\.rocomamas\.com\/[^\s"'`)]*/g, ""],
  [/\/roco-stamp-logo\.png/g, "/lutho-stamp-logo.png"],

  // --- Domains ---
  [/rocomamas-franchise\.net/g, "lutho-franchise.net"],
  [/api\.rocomamas\.com/g, "api.lutho.app"],
  [/simphony\.rocomamas\.co\.za/g, "simphony.lutho.app"],
  [/rocomamas\.co\.ke/g, "lutho.app"],
  [/rocomamas\.co\.za/g, "lutho.app"],
  [/rocomamas\.com/g, "lutho.app"],

  // --- Brand words (compound) ---
  [/RocoMamas/g, "Lutho"],
  [/ROCOMAMAS/g, "LUTHO"],
  [/Rocomamas/g, "Lutho"],
  [/rocomamas/g, "lutho"],

  // --- Storage keys / tokens ---
  [/roco_/g, "lutho_"],
  [/roco-sec/g, "lutho-sec"],
  [/Roco-ALERT/g, "Lutho-ALERT"],
  [/ROCO-404/g, "LUTHO-404"],

  // --- Remaining brand tokens & identifiers (camelCase, CONSTANTS, text) ---
  [/ROCO/g, "LUTHO"],
  [/Roco/g, "Lutho"],
  [/roco/g, "lutho"],

  // --- Colors: urban orange -> Lutho light-navy primary ---
  [/#FF5A00/g, "#3E5E93"],
  [/#E78A3E/g, "#3E5E93"],
  [/rgba\(255,\s*90,\s*0/g, "rgba(62, 94, 147"],
  [/rgb\(255,\s*90,\s*0\)/g, "rgb(62, 94, 147)"],
];

let changedFiles = 0;
for (const rel of targetFiles) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    console.warn("skip (missing):", rel);
    continue;
  }
  let content = fs.readFileSync(abs, "utf8");
  const before = content;
  for (const [re, rep] of rules) content = content.replace(re, rep);
  if (content !== before) {
    fs.writeFileSync(abs, content, "utf8");
    changedFiles++;
    console.log("migrated:", rel);
  }
}

// --- File renames ---
const renames = [
  ["src/rocoTables.ts", "src/luthoTables.ts"],
  ["src/rocoAudio.ts", "src/luthoAudio.ts"],
];
for (const [from, to] of renames) {
  const absFrom = path.join(root, from);
  const absTo = path.join(root, to);
  if (fs.existsSync(absFrom)) {
    fs.renameSync(absFrom, absTo);
    console.log("renamed:", from, "->", to);
  }
}

console.log(`\nDone. ${changedFiles} files migrated.`);
