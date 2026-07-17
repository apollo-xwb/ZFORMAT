import React, { useMemo, useRef, useState } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  Plus,
  Check,
  Wand2,
  Table as TableIcon,
} from "lucide-react";
import { MenuItem } from "../types";
import { fileToDataUrl } from "../qrConfig";
import {
  ParsedTable,
  MenuField,
  DraftMenuItem,
  parseDelimited,
  parseFreeText,
  autoMapHeaders,
  tableToDrafts,
  draftsToMenuItems,
  draftId,
  guessEmoji,
  readImportedMenu,
  saveImportedMenu,
} from "../menuImport";

interface MenuImporterProps {
  onToast?: (message: string, type?: "success" | "info") => void;
  onImported?: (items: MenuItem[]) => void;
}

const FIELD_OPTIONS: { value: MenuField; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "description", label: "Description" },
  { value: "category", label: "Category" },
  { value: "section", label: "Section" },
  { value: "emoji", label: "Emoji" },
  { value: "ignore", label: "Ignore" },
];

export const MenuImporter: React.FC<MenuImporterProps> = ({ onToast, onImported }) => {
  const [table, setTable] = useState<ParsedTable | null>(null);
  const [mapping, setMapping] = useState<MenuField[]>([]);
  const [drafts, setDrafts] = useState<DraftMenuItem[]>([]);
  const [pasteText, setPasteText] = useState("");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const savedCount = useMemo(() => readImportedMenu().length, [drafts]);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    const isJson = file.type === "application/json" || /\.json$/i.test(file.name);
    const isCsvLike = /\.(csv|tsv|txt)$/i.test(file.name) || file.type.includes("csv") || file.type.includes("text");

    if (isImage) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setReferenceImage(dataUrl);
        onToast?.("Menu image loaded — add items below and attach photos", "info");
      } catch {
        onToast?.("Could not read that image", "info");
      }
      return;
    }
    if (isPdf) {
      onToast?.("PDF loaded as reference — type or paste the items to map them", "info");
      setReferenceImage(null);
      return;
    }

    const text = await file.text();
    if (isJson) {
      try {
        const data = JSON.parse(text);
        const arr: any[] = Array.isArray(data) ? data : data.items || data.menu || [];
        const imported: DraftMenuItem[] = arr.map((row) => {
          const name = String(row.name || row.title || row.item || "").trim();
          const category = (String(row.category || "").toLowerCase().startsWith("d") ? "DRINK" : "EAT") as
            | "EAT"
            | "DRINK";
          return {
            id: draftId(),
            name,
            price: Number(row.price) || 0,
            priceText: row.priceText || (row.price != null ? String(row.price) : undefined),
            description: String(row.description || row.desc || "").trim(),
            category,
            emoji: row.emoji || guessEmoji(name, category),
            sectionName: row.sectionName || row.section || undefined,
            image: row.image || undefined,
          };
        });
        setDrafts(imported.filter((d) => d.name));
        setTable(null);
        onToast?.(`Parsed ${imported.length} items from JSON`, "success");
      } catch {
        onToast?.("Invalid JSON file", "info");
      }
      return;
    }

    if (isCsvLike) {
      const parsed = parseDelimited(text);
      if (parsed.headers.length > 1 && parsed.rows.length > 0) {
        setTable(parsed);
        const auto = autoMapHeaders(parsed.headers);
        setMapping(auto);
        setDrafts(tableToDrafts(parsed, auto));
        onToast?.(`Loaded ${parsed.rows.length} rows — check the field mapping`, "success");
      } else {
        const items = parseFreeText(text);
        setDrafts(items);
        setTable(null);
        onToast?.(`Parsed ${items.length} items from text`, "success");
      }
      return;
    }

    // Fallback: treat as free text
    const items = parseFreeText(text);
    setDrafts(items);
    setTable(null);
    onToast?.(`Parsed ${items.length} items`, "success");
  };

  const updateMapping = (colIndex: number, field: MenuField) => {
    if (!table) return;
    const next = [...mapping];
    next[colIndex] = field;
    setMapping(next);
    setDrafts(tableToDrafts(table, next));
  };

  const parsePasted = () => {
    if (!pasteText.trim()) {
      onToast?.("Paste your menu text first", "info");
      return;
    }
    const items = parseFreeText(pasteText);
    setDrafts((prev) => [...prev, ...items]);
    onToast?.(`Added ${items.length} items`, "success");
  };

  const updateDraft = (id: string, patch: Partial<DraftMenuItem>) => {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const removeDraft = (id: string) => setDrafts((prev) => prev.filter((d) => d.id !== id));

  const addBlankDraft = () => {
    setDrafts((prev) => [
      ...prev,
      { id: draftId(), name: "", price: 0, description: "", category: "EAT", emoji: "🍽️", sectionName: "Imported" },
    ]);
  };

  const setDraftImage = async (id: string, file: File) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      updateDraft(id, { image: dataUrl });
    } catch {
      onToast?.("Could not read that image", "info");
    }
  };

  const commit = () => {
    const items = draftsToMenuItems(drafts);
    if (items.length === 0) {
      onToast?.("Nothing to import yet", "info");
      return;
    }
    saveImportedMenu(items);
    onImported?.(items);
    onToast?.(`Imported ${items.length} menu items — now live`, "success");
  };

  return (
    <div className="space-y-4">
      {/* Uploader */}
      <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3E5E93] flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-sm">Import your menu</h3>
            <p className="text-zinc-400 text-xs">CSV, TSV, JSON, plain text, PDF or a photo — we'll help you map it.</p>
          </div>
        </div>

        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) void handleFile(f);
          }}
          className="block border-2 border-dashed border-zinc-700 rounded-2xl p-6 text-center cursor-pointer hover:border-[#3E5E93] transition-colors"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.tsv,.txt,.json,.pdf,image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
          <FileText className="w-7 h-7 mx-auto text-[#3E5E93] mb-2" />
          <p className="text-white text-sm font-bold">Drop a file or click to upload</p>
          <p className="text-zinc-500 text-xs mt-1">{fileName ? `Loaded: ${fileName}` : "Any format accepted"}</p>
        </label>

        <div>
          <label className="block text-white text-xs font-bold uppercase mb-1.5">…or paste your menu</label>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={4}
            placeholder={"BURGERS\nSmash Burger - beef, cheese, house sauce  R120\nChicken Burger  R110\n\nDRINKS\nCraft Lager  R45"}
            className="w-full bg-[#121212] border border-zinc-800 rounded-xl px-3 py-3 text-white placeholder:text-zinc-600 focus:border-[#3E5E93] outline-none resize-y"
          />
          <button
            onClick={parsePasted}
            className="mt-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-black uppercase text-xs flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" /> Parse text
          </button>
        </div>

        {referenceImage && (
          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-black/40 text-zinc-300 text-xs font-bold uppercase">
              <ImageIcon className="w-4 h-4" /> Menu reference
            </div>
            <img src={referenceImage} alt="Menu reference" className="w-full max-h-72 object-contain bg-[#121212]" />
          </div>
        )}
      </div>

      {/* Field mapping */}
      {table && (
        <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-[#3E5E93]" />
            <h3 className="text-white font-black uppercase text-sm">Map columns</h3>
          </div>
          <p className="text-zinc-400 text-xs">Tell Lutho what each column means.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {table.headers.map((header, i) => (
              <div key={i} className="rounded-xl bg-black/40 border border-zinc-800 p-2.5">
                <div className="text-zinc-300 text-xs font-bold truncate mb-1" title={header}>
                  {header || `Column ${i + 1}`}
                </div>
                <div className="text-zinc-500 text-[10px] truncate mb-1.5">
                  e.g. {table.rows[0]?.[i] || "—"}
                </div>
                <select
                  value={mapping[i] || "ignore"}
                  onChange={(e) => updateMapping(i, e.target.value as MenuField)}
                  className="w-full bg-[#121212] border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-xs"
                >
                  {FIELD_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview + edit */}
      <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-white font-black uppercase text-sm">
            Preview <span className="text-zinc-500">({drafts.length})</span>
          </h3>
          <button
            onClick={addBlankDraft}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold uppercase text-[11px] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add item
          </button>
        </div>

        {drafts.length === 0 ? (
          <p className="text-zinc-500 text-sm py-6 text-center">
            Upload, paste, or add items to see the preview here.
          </p>
        ) : (
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {drafts.map((d) => (
              <div key={d.id} className="rounded-2xl bg-black/40 border border-zinc-800 p-3">
                <div className="flex gap-3">
                  {/* Image slot */}
                  <label className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 shrink-0 cursor-pointer bg-[#121212] flex items-center justify-center">
                    {d.image ? (
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{d.emoji}</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void setDraftImage(d.id, f);
                      }}
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 uppercase">
                      Photo
                    </span>
                  </label>

                  <div className="flex-1 min-w-0 grid gap-1.5">
                    <div className="flex gap-1.5">
                      <input
                        value={d.name}
                        onChange={(e) => updateDraft(d.id, { name: e.target.value })}
                        placeholder="Item name"
                        className="flex-1 bg-[#121212] border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-sm font-bold"
                      />
                      <input
                        value={d.priceText ?? (d.price ? String(d.price) : "")}
                        onChange={(e) => {
                          const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
                          updateDraft(d.id, { priceText: e.target.value, price: isNaN(num) ? 0 : num });
                        }}
                        placeholder="Price"
                        className="w-24 bg-[#121212] border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-sm"
                      />
                    </div>
                    <input
                      value={d.description}
                      onChange={(e) => updateDraft(d.id, { description: e.target.value })}
                      placeholder="Description"
                      className="w-full bg-[#121212] border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-300 text-xs"
                    />
                    <div className="flex gap-1.5 items-center">
                      <input
                        value={d.emoji}
                        onChange={(e) => updateDraft(d.id, { emoji: e.target.value })}
                        className="w-12 bg-[#121212] border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-sm text-center"
                        maxLength={4}
                      />
                      <select
                        value={d.category}
                        onChange={(e) => updateDraft(d.id, { category: e.target.value as "EAT" | "DRINK" })}
                        className="bg-[#121212] border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-xs"
                      >
                        <option value="EAT">Eat</option>
                        <option value="DRINK">Drink</option>
                      </select>
                      <input
                        value={d.sectionName || ""}
                        onChange={(e) => updateDraft(d.id, { sectionName: e.target.value })}
                        placeholder="Section"
                        className="flex-1 min-w-0 bg-[#121212] border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-300 text-xs"
                      />
                      <button
                        onClick={() => removeDraft(d.id)}
                        className="p-2 rounded-lg bg-red-950/30 text-red-300 border border-red-500/20 shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800">
          <p className="text-zinc-500 text-xs">
            {savedCount > 0 ? `${savedCount} items currently live` : "No custom menu saved yet"}
          </p>
          <button
            onClick={commit}
            disabled={drafts.length === 0}
            className="px-5 py-3 rounded-2xl bg-[#3E5E93] font-black uppercase text-xs flex items-center gap-2 disabled:opacity-40"
          >
            <Check className="w-4 h-4" /> Import {drafts.length > 0 ? `${drafts.length} items` : "menu"}
          </button>
        </div>
      </div>
    </div>
  );
};
