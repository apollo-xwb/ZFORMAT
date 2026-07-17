import React, { useState } from "react";
import { Palette, Check, RotateCcw, Sparkles } from "lucide-react";
import {
  LuthoPalette,
  DEFAULT_PALETTE,
  PALETTE_PRESETS,
  applyPalette,
  savePalette,
  isValidHex,
  contrastText,
} from "../theme";

interface ThemeStudioProps {
  palette: LuthoPalette;
  onChange: (palette: LuthoPalette) => void;
  onToast?: (message: string, type?: "success" | "info") => void;
}

const SWATCHES: { key: keyof LuthoPalette; label: string; hint: string }[] = [
  { key: "primary", label: "Primary", hint: "Buttons, active states, links" },
  { key: "secondary", label: "Secondary", hint: "Silver / chrome accents, dividers" },
  { key: "tertiary", label: "Tertiary", hint: "Awards & celebratory highlights" },
];

export const ThemeStudio: React.FC<ThemeStudioProps> = ({ palette, onChange, onToast }) => {
  const [draft, setDraft] = useState<LuthoPalette>(palette);

  const updateDraft = (key: keyof LuthoPalette, value: string) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    if (isValidHex(value)) applyPalette(next); // live preview
  };

  const applyPreset = (preset: LuthoPalette) => {
    setDraft(preset);
    applyPalette(preset);
    onToast?.("Preview applied — Save to keep it", "info");
  };

  const save = () => {
    const clean: LuthoPalette = {
      primary: isValidHex(draft.primary) ? draft.primary : DEFAULT_PALETTE.primary,
      secondary: isValidHex(draft.secondary) ? draft.secondary : DEFAULT_PALETTE.secondary,
      tertiary: isValidHex(draft.tertiary) ? draft.tertiary : DEFAULT_PALETTE.tertiary,
    };
    setDraft(clean);
    applyPalette(clean);
    savePalette(clean);
    onChange(clean);
    onToast?.("Theme saved — this is now your brand look", "success");
  };

  const reset = () => {
    setDraft(DEFAULT_PALETTE);
    applyPalette(DEFAULT_PALETTE);
    savePalette(DEFAULT_PALETTE);
    onChange(DEFAULT_PALETTE);
    onToast?.("Reset to the Lutho default palette", "info");
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3E5E93] flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-sm">Theme Studio</h3>
            <p className="text-zinc-400 text-xs">Match the app to your brand. Changes preview instantly.</p>
          </div>
        </div>

        <div className="grid gap-3">
          {SWATCHES.map(({ key, label, hint }) => (
            <div key={key} className="flex items-center gap-3 rounded-2xl bg-black/40 border border-zinc-800 p-3">
              <label
                className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 shrink-0 cursor-pointer"
                style={{ backgroundColor: isValidHex(draft[key]) ? draft[key] : "#000" }}
              >
                <input
                  type="color"
                  value={isValidHex(draft[key]) ? draft[key] : "#000000"}
                  onChange={(e) => updateDraft(key, e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label={`${label} colour picker`}
                />
              </label>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white font-black uppercase text-xs">{label}</span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isValidHex(draft[key]) ? draft[key] : "#000",
                      color: isValidHex(draft[key]) ? contrastText(draft[key]) : "#fff",
                    }}
                  >
                    {isValidHex(draft[key]) ? "AA" : "?"}
                  </span>
                </div>
                <p className="text-zinc-500 text-[10px]">{hint}</p>
                <input
                  value={draft[key]}
                  onChange={(e) => updateDraft(key, e.target.value)}
                  spellCheck={false}
                  className={`mt-1 w-full bg-[#121212] border rounded-lg px-2 py-1.5 text-white font-mono text-xs uppercase ${
                    isValidHex(draft[key]) ? "border-zinc-800" : "border-red-500/60"
                  }`}
                  placeholder="#3E5E93"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={save}
            className="px-4 py-3 rounded-2xl bg-[#3E5E93] font-black uppercase text-xs flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Save theme
          </button>
          <button
            onClick={reset}
            className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-black uppercase text-xs flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#3E5E93]" />
          <h3 className="text-white font-black uppercase text-sm">Quick presets</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PALETTE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.palette)}
              className="rounded-2xl border border-zinc-800 bg-black/40 p-3 text-left hover:border-zinc-600 transition-colors"
            >
              <div className="flex gap-1 mb-2">
                <span className="w-6 h-6 rounded-md" style={{ backgroundColor: preset.palette.primary }} />
                <span className="w-6 h-6 rounded-md" style={{ backgroundColor: preset.palette.secondary }} />
                <span className="w-6 h-6 rounded-md" style={{ backgroundColor: preset.palette.tertiary }} />
              </div>
              <span className="text-white text-[11px] font-bold leading-tight block">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
        <h3 className="text-white font-black uppercase text-sm mb-3">Live preview</h3>
        <div className="rounded-2xl border border-zinc-800 p-4 space-y-3 bg-[#121212]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-[#3E5E93] text-xs font-black uppercase">Primary CTA</span>
            <span className="lutho-secondary-bg px-3 py-1.5 rounded-full text-xs font-black uppercase">Secondary</span>
            <span className="lutho-tertiary-bg px-3 py-1.5 rounded-full text-xs font-black uppercase">Tertiary</span>
          </div>
          <p className="text-sm text-zinc-300">
            Body copy stays high-contrast on the beige canvas while your{" "}
            <span className="text-[#3E5E93] font-bold">brand colour</span> drives the calls to action.
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-[#3E5E93] text-xs font-black uppercase">Order now</button>
            <button className="px-4 py-2 rounded-xl border border-[#3E5E93] text-[#3E5E93] text-xs font-black uppercase">
              Call waiter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
