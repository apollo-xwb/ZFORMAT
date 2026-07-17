import React, { useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  Clock,
  Utensils,
  Palette,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Sparkles,
  CircleCheck,
} from "lucide-react";
import {
  ONBOARDING_STEPS,
  OnboardingStep,
  OnboardingField,
  BusinessProfile,
  BusinessKnowledgeBase,
  readKnowledgeBase,
  saveKnowledgeBase,
  compileKnowledgeDoc,
} from "../onboarding";

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  Building2,
  MapPin,
  Clock,
  Utensils,
  Palette,
};

interface OnboardingWizardProps {
  onToast?: (message: string, type?: "success" | "info") => void;
  onComplete?: (kb: BusinessKnowledgeBase) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onToast, onComplete }) => {
  const [kb, setKb] = useState<BusinessKnowledgeBase>(() => readKnowledgeBase());
  const [profile, setProfile] = useState<BusinessProfile>(() => kb.profile || {});
  const [stepIndex, setStepIndex] = useState(0);

  const step = ONBOARDING_STEPS[stepIndex];
  const StepIcon = ICONS[step.icon] || Sparkles;

  const progress = useMemo(() => {
    const total = ONBOARDING_STEPS.length;
    const done = kb.completedSteps.length;
    return Math.round((done / total) * 100);
  }, [kb.completedSteps]);

  const setField = (fieldId: string, value: string | string[] | number) => {
    setProfile((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleMulti = (fieldId: string, option: string) => {
    setProfile((prev) => {
      const current = Array.isArray(prev[fieldId]) ? (prev[fieldId] as string[]) : [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [fieldId]: next };
    });
  };

  const persist = (completedSteps: string[], completed: boolean) => {
    const next: BusinessKnowledgeBase = {
      profile,
      updatedAt: Date.now(),
      completed,
      completedSteps,
    };
    setKb(next);
    saveKnowledgeBase(next);
    return next;
  };

  const stepMissingRequired = step.fields
    .filter((f) => f.required)
    .some((f) => {
      const v = profile[f.id];
      return v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
    });

  const handleSaveStep = (advance: boolean) => {
    if (stepMissingRequired) {
      onToast?.("Fill in the required fields first", "info");
      return;
    }
    const completedSteps = Array.from(new Set([...kb.completedSteps, step.id]));
    const isLast = stepIndex === ONBOARDING_STEPS.length - 1;
    const allDone = ONBOARDING_STEPS.every((s) => completedSteps.includes(s.id));
    const next = persist(completedSteps, allDone);
    onToast?.(isLast && allDone ? "Onboarding complete!" : "Step saved", "success");
    if (isLast && allDone) onComplete?.(next);
    if (advance && !isLast) setStepIndex((i) => Math.min(i + 1, ONBOARDING_STEPS.length - 1));
  };

  const downloadKnowledgeBase = () => {
    const doc = compileKnowledgeDoc({ ...kb, profile, updatedAt: Date.now() });
    const blob = new Blob([doc], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(profile.businessName as string) || "business"}-knowledge-base.md`
      .replace(/[^a-z0-9.-]+/gi, "-")
      .toLowerCase();
    a.click();
    URL.revokeObjectURL(url);
    onToast?.("Knowledge base exported", "success");
  };

  const renderField = (field: OnboardingField) => {
    const value = profile[field.id];
    const baseInput =
      "w-full bg-[#121212] border border-zinc-800 rounded-xl px-3 py-3 text-white placeholder:text-zinc-600 focus:border-[#3E5E93] outline-none";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            value={(value as string) || ""}
            onChange={(e) => setField(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={baseInput + " resize-y min-h-[84px]"}
          />
        );
      case "select":
        return (
          <select
            value={(value as string) || ""}
            onChange={(e) => setField(field.id, e.target.value)}
            className={baseInput}
          >
            <option value="">Select…</option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "multiselect":
        return (
          <div className="flex flex-wrap gap-2">
            {(field.options || []).map((opt) => {
              const selected = Array.isArray(value) && (value as string[]).includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleMulti(field.id, opt)}
                  className={`px-3 py-2 rounded-full text-xs font-bold border transition-colors ${
                    selected
                      ? "bg-[#3E5E93] border-[#3E5E93]"
                      : "bg-black/40 border-zinc-800 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  {selected && <Check className="w-3 h-3 inline mr-1 -mt-0.5" />}
                  {opt}
                </button>
              );
            })}
          </div>
        );
      case "number":
        return (
          <input
            type="number"
            value={(value as number) ?? ""}
            onChange={(e) => setField(field.id, e.target.value === "" ? "" : Number(e.target.value))}
            placeholder={field.placeholder}
            className={baseInput}
          />
        );
      default:
        return (
          <input
            type={field.type}
            value={(value as string) || ""}
            onChange={(e) => setField(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInput}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-white font-black uppercase text-sm">Business onboarding</h3>
            <p className="text-zinc-400 text-xs">
              Answer a few questions to build your knowledge base and go live fast.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[#3E5E93] font-black text-2xl leading-none">{progress}%</div>
            <div className="text-zinc-500 text-[10px] uppercase">complete</div>
          </div>
        </div>
        <div className="h-2 rounded-full bg-black/50 overflow-hidden">
          <div className="h-full bg-[#3E5E93] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Step chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {ONBOARDING_STEPS.map((s: OnboardingStep, i) => {
            const done = kb.completedSteps.includes(s.id);
            const active = i === stepIndex;
            return (
              <button
                key={s.id}
                onClick={() => setStepIndex(i)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 transition-colors ${
                  active
                    ? "bg-[#3E5E93] border-[#3E5E93]"
                    : done
                    ? "bg-black/40 border-[#3E5E93]/50 text-[#3E5E93]"
                    : "bg-black/40 border-zinc-800 text-zinc-400"
                }`}
              >
                {done ? <CircleCheck className="w-3.5 h-3.5" /> : <span className="w-4 text-center">{i + 1}</span>}
                {s.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current step */}
      <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#3E5E93] flex items-center justify-center shrink-0">
            <StepIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-black uppercase text-sm">{step.title}</h4>
            <p className="text-zinc-400 text-xs">{step.subtitle}</p>
          </div>
        </div>

        <div className="grid gap-4">
          {step.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-white text-xs font-bold uppercase mb-1.5">
                {field.label}
                {field.required && <span className="text-[#3E5E93] ml-1">*</span>}
              </label>
              {renderField(field)}
              {field.help && <p className="text-zinc-500 text-[10px] mt-1">{field.help}</p>}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 mt-6">
          <button
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
            className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-black uppercase text-xs flex items-center gap-1.5 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleSaveStep(false)}
              className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-black uppercase text-xs"
            >
              Save
            </button>
            {stepIndex === ONBOARDING_STEPS.length - 1 ? (
              <button
                onClick={() => handleSaveStep(true)}
                className="px-4 py-3 rounded-2xl bg-[#3E5E93] font-black uppercase text-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Finish
              </button>
            ) : (
              <button
                onClick={() => handleSaveStep(true)}
                className="px-4 py-3 rounded-2xl bg-[#3E5E93] font-black uppercase text-xs flex items-center gap-1.5"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Knowledge base export */}
      <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-white font-black uppercase text-sm">Knowledge base</h4>
          <p className="text-zinc-400 text-xs">
            Your answers are compiled into a shareable brief for staff and AI assistance.
          </p>
        </div>
        <button
          onClick={downloadKnowledgeBase}
          className="px-4 py-3 rounded-2xl border border-[#3E5E93] text-[#3E5E93] font-black uppercase text-xs flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" /> Export brief
        </button>
      </div>
    </div>
  );
};
