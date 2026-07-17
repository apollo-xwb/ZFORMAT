// Lutho onboarding + business knowledge base.
// The staff onboarding flow asks the owner a series of questions about their
// business; the answers are compiled into a structured knowledge base that
// powers menus, staff training, guest messaging and AI assistance.

export type OnboardingFieldType =
  | "text"
  | "textarea"
  | "tel"
  | "email"
  | "number"
  | "select"
  | "multiselect";

export interface OnboardingField {
  id: string;
  label: string;
  type: OnboardingFieldType;
  placeholder?: string;
  help?: string;
  required?: boolean;
  options?: string[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // lucide icon name (resolved in the wizard)
  fields: OnboardingField[];
}

export interface BusinessProfile {
  [fieldId: string]: string | string[] | number | undefined;
}

export interface BusinessKnowledgeBase {
  profile: BusinessProfile;
  updatedAt: number;
  completed: boolean;
  completedSteps: string[];
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "identity",
    title: "Business identity",
    subtitle: "Tell us who you are so we can brand the app for your guests.",
    icon: "Building2",
    fields: [
      { id: "businessName", label: "Business name", type: "text", placeholder: "e.g. Harbour & Vine", required: true },
      {
        id: "businessType",
        label: "Type of venue",
        type: "select",
        required: true,
        options: ["Restaurant", "Bar / Pub", "Cafe", "Bistro", "Fine dining", "Fast casual", "Food truck", "Lounge", "Other"],
      },
      { id: "tagline", label: "Tagline / short description", type: "text", placeholder: "Coastal small plates & natural wine" },
      { id: "yearEstablished", label: "Year established", type: "number", placeholder: "2019" },
      { id: "story", label: "Your story", type: "textarea", placeholder: "A sentence or two guests and new staff should know about the venue.", help: "Used in the guest welcome screen and staff training." },
    ],
  },
  {
    id: "contact",
    title: "Location & contact",
    subtitle: "Where guests find you and how they reach you.",
    icon: "MapPin",
    fields: [
      { id: "address", label: "Street address", type: "text", placeholder: "12 Marine Drive" },
      { id: "city", label: "City / suburb", type: "text", placeholder: "Cape Town" },
      { id: "phone", label: "Phone", type: "tel", placeholder: "+27 21 000 0000" },
      { id: "email", label: "Contact email", type: "email", placeholder: "hello@yourvenue.com" },
      { id: "website", label: "Website / social", type: "text", placeholder: "instagram.com/yourvenue" },
      { id: "reviewUrl", label: "Google review link", type: "text", placeholder: "https://…", help: "Powers the in-app review request & reward flow." },
    ],
  },
  {
    id: "operations",
    title: "Service & operations",
    subtitle: "How your floor runs day to day.",
    icon: "Clock",
    fields: [
      { id: "seatingCapacity", label: "Seating capacity", type: "number", placeholder: "80" },
      { id: "tableCount", label: "Number of tables", type: "number", placeholder: "15" },
      {
        id: "serviceStyles",
        label: "Service styles offered",
        type: "multiselect",
        options: ["Dine-in", "Table QR ordering", "Takeaway", "Delivery", "Bookings", "Walk-ins", "Events"],
      },
      { id: "openingHours", label: "Opening hours", type: "textarea", placeholder: "Mon–Fri 11:00–22:00\nSat–Sun 09:00–23:00" },
      { id: "avgPrepTime", label: "Average kitchen prep time (mins)", type: "number", placeholder: "18" },
      { id: "currency", label: "Currency symbol", type: "text", placeholder: "R" },
    ],
  },
  {
    id: "menu",
    title: "Menu & offering",
    subtitle: "What you serve — this seeds your menu and specials.",
    icon: "Utensils",
    fields: [
      {
        id: "cuisines",
        label: "Cuisine / categories",
        type: "multiselect",
        options: ["Burgers", "Grill / Steakhouse", "Pizza", "Seafood", "Vegetarian / Vegan", "Breakfast", "Coffee", "Cocktails", "Craft beer", "Wine", "Desserts", "Tapas / Small plates"],
      },
      { id: "signatureDishes", label: "Signature dishes", type: "textarea", placeholder: "List a few dishes you're known for." },
      { id: "priceRange", label: "Typical price range", type: "select", options: ["$ Budget", "$$ Mid", "$$$ Premium", "$$$$ Fine dining"] },
      {
        id: "dietary",
        label: "Dietary options highlighted",
        type: "multiselect",
        options: ["Vegetarian", "Vegan", "Halaal", "Kosher", "Gluten-free", "Dairy-free", "Nut-free", "Low-carb"],
      },
      { id: "allergenNotes", label: "Allergen / kitchen notes", type: "textarea", placeholder: "Anything staff must tell guests about allergens or prep." },
    ],
  },
  {
    id: "brand",
    title: "Brand & voice",
    subtitle: "How the app should look and sound to your guests.",
    icon: "Palette",
    fields: [
      { id: "brandVibe", label: "Brand vibe", type: "select", options: ["Premium & minimal", "Warm & rustic", "Bold & energetic", "Playful & casual", "Classic & elegant"] },
      { id: "welcomeMessage", label: "Guest welcome message", type: "textarea", placeholder: "Welcome! Scan, order and we'll bring it right over." },
      { id: "houseRules", label: "House rules / FAQs", type: "textarea", placeholder: "Corkage, kids policy, loyalty, anything guests ask about.", help: "Feeds the guest help & staff knowledge base." },
      { id: "loyaltyOffer", label: "Loyalty / reward offer", type: "text", placeholder: "10% off after 5 visits" },
    ],
  },
];

const KB_STORAGE_KEY = "lutho_knowledge_base";

export function emptyKnowledgeBase(): BusinessKnowledgeBase {
  return { profile: {}, updatedAt: 0, completed: false, completedSteps: [] };
}

export function readKnowledgeBase(): BusinessKnowledgeBase {
  try {
    const raw = localStorage.getItem(KB_STORAGE_KEY);
    if (!raw) return emptyKnowledgeBase();
    const parsed = JSON.parse(raw) as BusinessKnowledgeBase;
    return {
      profile: parsed.profile || {},
      updatedAt: parsed.updatedAt || 0,
      completed: !!parsed.completed,
      completedSteps: parsed.completedSteps || [],
    };
  } catch {
    return emptyKnowledgeBase();
  }
}

export function saveKnowledgeBase(kb: BusinessKnowledgeBase): void {
  try {
    localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(kb));
    window.dispatchEvent(new CustomEvent("lutho_kb_updated"));
  } catch {
    /* ignore */
  }
}

export function isOnboardingComplete(): boolean {
  return readKnowledgeBase().completed;
}

function fmtValue(value: BusinessProfile[string]): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value === undefined || value === "") return "—";
  return String(value);
}

/** Compile the profile into a human/AI-readable knowledge base document. */
export function compileKnowledgeDoc(kb: BusinessKnowledgeBase): string {
  const p = kb.profile;
  const name = fmtValue(p.businessName) || "This venue";
  const lines: string[] = [];
  lines.push(`# ${name} — Business Knowledge Base`);
  lines.push("");
  lines.push(`_Generated by Lutho OS onboarding${kb.updatedAt ? ` on ${new Date(kb.updatedAt).toLocaleString()}` : ""}._`);
  for (const step of ONBOARDING_STEPS) {
    const rows = step.fields
      .filter((f) => p[f.id] !== undefined && p[f.id] !== "" && !(Array.isArray(p[f.id]) && (p[f.id] as string[]).length === 0))
      .map((f) => `- **${f.label}:** ${fmtValue(p[f.id])}`);
    if (rows.length === 0) continue;
    lines.push("");
    lines.push(`## ${step.title}`);
    lines.push(...rows);
  }
  return lines.join("\n");
}
