import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { db, auth } from "./firebase";
import { collection, doc, getDoc, onSnapshot, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { LUTHO_PRD_CONTENT, LUTHO_TRD_CONTENT } from "./luthoDocs";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
import { 
  Bell, 
  Sparkles, 
  Plus, 
  Minus, 
  ShoppingBag, 
  X, 
  ChevronUp, 
  Utensils, 
  Beer, 
  Clock, 
  Receipt, 
  Check, 
  Copy,
  Upload,
  Printer,
  Award, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Volume2,
  Users,
  CreditCard,
  Download,
  Percent,
  Trash2,
  RotateCcw,
  QrCode,
  Share2,
  UserPlus,
  Pizza,
  Wine,
  Coffee,
  Search,
  Egg,
  Leaf,
  Star,
  Megaphone,
  CheckCircle,
  Calendar,
  MessageSquare,
  AlertTriangle,
  HelpCircle,
  Sliders,
  Menu,
  Send,
  Heart,
  Trophy,
  Play,
  Pause,
  TrendingUp,
  Zap,
  Server,
  ShieldAlert,
  Fingerprint,
  Lock,
  Unlock,
  Terminal,
  KeyRound,
  Eye,
  EyeOff,
  Globe,
  LogIn,
  LogOut,
  ScanLine,
  History,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThuneeFullscreenApp } from "./components/ThuneeFullscreenApp";
import { HalftoneQRCode } from "./components/HalftoneQRCode";
import {
  CUSTOM_QR_STORAGE_KEY,
  QR_OVERLAY_STORAGE_KEY,
  LUTHO_BRAND_LOGO_URL,
  fileToDataUrl,
  readStoredCustomQrs,
  readStoredQrOverlays,
} from "./qrConfig";
import { StaffFloorBlueprint } from "./components/StaffFloorBlueprint";
import { OrderMasonryGrid } from "./components/OrderMasonryGrid";
import { MenuItem, CartItem, HistoricOrder, MasterBillItem } from "./types";
import { MENU_ITEMS, SPECIALS } from "./data";
import {
  LUTHO_TABLES,
  REMOTE_TABLE_ID,
  formatTableLabel,
  formatTableShort,
  getStaffOrderColor,
  type TableConfig
} from "./luthoTables";
import {
  RONDEBOSCH_VENUE,
  getBookingTimeSlots,
  getDefaultBookingTime,
  getHoursLabelForDate,
} from "./restaurantHours";
import { getOrderPrepSeconds, formatPrepMinutes } from "./prepTimes";
import {
  createSplitSession,
  getSplitBillStorageKey,
  getSplitJoinUrl,
  joinSplitSession,
  loadJoinedSplitSession,
  loadSplitSession,
  parseSplitFromLocation,
  parseSplitIdFromValue,
  saveSplitSession,
  type RemoteSplitSession
} from "./remoteSplit";
import { appendChatMessage, loadChatMessages, saveChatMessages } from "./chatStore";
import { omitUndefined, sanitizeForFirestore } from "./firestoreUtils";
import { buildStaffOrderRecord, remoteOrderToHistoric, toFirestoreOrder, type StaffOrderRecord } from "./orderSync";
import {
  allMembersLocked,
  claimGroupRoundSubmission,
  countLockedMembers,
  deserializeCartItems,
  ensureGroupOrderDraft,
  groupOrderDraftRef,
  memberDraftItemCount,
  memberDraftTotal,
  resetGroupOrderRound,
  syncMemberGroupDraft,
  type GroupOrderDraft,
} from "./groupOrderSync";
import { playBeep as luthoPlayBeep, setupLuthoAudioUnlock } from "./luthoAudio";
import { OnboardingWizard } from "./components/OnboardingWizard";
import { ThemeStudio } from "./components/ThemeStudio";
import { MenuImporter } from "./components/MenuImporter";
import { bootstrapTheme, type LuthoPalette } from "./theme";
import { readKnowledgeBase, isOnboardingComplete } from "./onboarding";
import { readImportedMenu } from "./menuImport";
import {
  fetchSplitSession,
  listenSplitBill,
  listenSplitSession,
  mergeCartIntoBillItems,
  upsertSplitBillItems,
  upsertSplitSession,
} from "./splitBillSync";
import {
  buildClaimPayload,
  buildPilotSummaryText,
  downloadOrderPass,
  downloadOrderPassPdf,
  downloadOrderPassPng,
  downloadTextFile,
  generateClaimCode,
  parseClaimPayload,
  type PassFormat,
} from "./orderPass";
import {
  buildSittingFromOrders,
  listenTableSittings,
  saveTableSitting,
  sittingsForWaiter,
  type TableSittingRecord,
} from "./tableSittingHistory";
import { archiveStaffProfile, DEFAULT_STAFF_PIN } from "./staffArchive";
import { ClaimCodeScannerModal } from "./components/ClaimCodeScannerModal";
import { BillRequestSummary } from "./components/BillRequestSummary";
import {
  buildBillRequestDetails,
  formatBillRequestStaffSummary,
  resolveBillRequestDetails,
  type BillRequestDetails,
} from "./billRequest";
import { downloadTrainingManualPdf } from "./trainingManualPdf";
import {
  closeTableParty,
  combineTableParties,
  createPartyId,
  listenTableServices,
  moveTableParty,
  savePartyAcrossTables,
  upsertTableService,
  type TableServiceMap,
  type TableServiceRecord,
} from "./tableServiceSync";

const MY_ORDER_IDS_KEY = "lutho_my_kitchen_order_ids";

function readMyOrderIds(): Set<string> {
  try {
    const saved = sessionStorage.getItem(MY_ORDER_IDS_KEY);
    if (!saved) return new Set();
    const parsed = JSON.parse(saved);
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

function rememberMyOrderId(orderId: string) {
  if (!orderId) return;
  const next = readMyOrderIds();
  next.add(orderId);
  try {
    sessionStorage.setItem(MY_ORDER_IDS_KEY, JSON.stringify([...next]));
  } catch {}
}

function isRemoteKitchenFeedOrder(
  order: Pick<StaffOrderRecord, "id" | "orderedBy" | "isRemoteGroupOrder" | "groupRoundId">,
  opts: {
    myName: string;
    sessionMembers: string[];
    inSplitSession: boolean;
  }
): boolean {
  const myIds = readMyOrderIds();
  if (myIds.has(order.id)) return true;

  const myName = opts.myName.trim().toLowerCase();
  const orderedBy = (order.orderedBy || "").trim().toLowerCase();
  if (myName && orderedBy && orderedBy === myName) return true;

  // Group lock-in: show tickets for everyone in your open split session.
  if (
    order.isRemoteGroupOrder &&
    opts.inSplitSession &&
    opts.sessionMembers.length > 0 &&
    orderedBy &&
    opts.sessionMembers.some((m) => m.trim().toLowerCase() === orderedBy)
  ) {
    return true;
  }

  return false;
}

const LUTHO_GOOGLE_REVIEW_URL = "https://share.google/uwYFGZKMKA9eKMYUA";
const QUICK_DRINK_IDS = ["soda-coke", "soda-sprite", "soda-zero", "bos-peach", "water-still", "shake-oreo"] as const;

export { LUTHO_TABLES, REMOTE_TABLE_ID, formatTableLabel, formatTableShort, getStaffOrderColor };
export type { TableConfig };

type StaffRole = "admin" | "general";
type StaffWorkspace = "overview" | "orders" | "tables" | "requests" | "team" | "onboarding" | "theme" | "menu" | "settings";
type ServiceRequestType = "WAITER" | "BILL";
type ServiceRequestStatus = "OPEN" | "ACKNOWLEDGED" | "DONE";

interface StaffProfile {
  id: string;
  name: string;
  pin: string;
  role: StaffRole;
  onShift: boolean;
  mustChangePin?: boolean;
}

interface ServiceRequest {
  id: string;
  type: ServiceRequestType;
  tableId: string;
  status: ServiceRequestStatus;
  createdAt: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
  note?: string;
  billDetails?: BillRequestDetails;
  partyId?: string;
}

const DEFAULT_GENERAL_PROFILE: StaffProfile = {
  id: "admin-root",
  name: "General",
  pin: "8034",
  role: "admin",
  onShift: true,
  mustChangePin: false
};

export function isAdminKioskRoute(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "1") return true;
    const cleanPath = window.location.pathname.replace(/^\/|\/$/g, "").toLowerCase();
    return cleanPath === "admin";
  } catch {
    return false;
  }
}

function resolveActiveTableId(fallback: string): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get("table");
    if (tableParam) {
      const cleanId = tableParam.replace(/\D/g, "");
      return cleanId || tableParam;
    }
  } catch {}
  return fallback || REMOTE_TABLE_ID;
}

function formatTimerRemaining(seconds: number): string {
  if (seconds <= 0) return "0 min";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.ceil(seconds / 60);
  return `${mins} min`;
}

function SplashKeywords({ playBeep, onComplete }: { playBeep: any, onComplete: () => void }) {
  const words = [
    "INITIALIZING SYSTEM... ⏳",
    "ESTABLISHING TABLE WIRELESS IP 🌐",
    "SYNCING THABO ON-DUTY FEEDS 👨‍🍳",
    "BREWING COLD SAVANNAS & CASTLES 🍺",
    "ENTERING INTENSE MULTIPLAYER LOBBY 🎮",
    "SYNCING DINER REWARDS CARD 🎫",
    "ACTIVATING SECURE BILL SPLITTER 🧮",
    "LUTHO GUEST OS ONLINE 🔥"
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= words.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Wait a tiny bit then complete
          return prev;
        }
        try {
          // Audio unlocks after the first user gesture — skip splash interval beeps.
        } catch {}
        return prev + 1;
      });
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return null;
}

export function getProductResolvedImage(item: any): string {
  if (!item) return "";
  const nameLower = (item.name || "").toLowerCase();
  const secLower = (item.sectionName || "").toLowerCase();
  const subLower = (item.subsectionName || "").toLowerCase();
  const descLower = (item.description || "").toLowerCase();

  // Check if current image is a generic placeholder or missing
  const isGenericImage = 
    !item.image || 
    item.image.includes("placeholder") || 
    item.image.includes("logo_4118") || 
    item.image.includes("dineplan") || 
    item.image.includes("encrypted-tbn0.gstatic.com");

  if (!isGenericImage) {
    return item.image;
  }

  // 1. Fries
  if (
    secLower.includes("fries") || 
    nameLower.includes("fries") || 
    nameLower.includes("chip") ||
    descLower.includes("fries")
  ) {
    return "https://images.spurcorp.com/A2273EE8-4611-4F5C-B378-7360D3688CA5";
  }

  // 2. Wings
  if (
    secLower.includes("wings") || 
    nameLower.includes("wings") || 
    descLower.includes("wings")
  ) {
    return "https://images.spurcorp.com/0B33BC2F-BBBC-4B8B-91AB-976D26DD8AF3";
  }

  // 3. Ribs
  if (
    secLower.includes("ribs") || 
    nameLower.includes("ribs") || 
    descLower.includes("ribs")
  ) {
    return "https://images.spurcorp.com/EA9C255E-3956-4D9E-B436-A209E50B3B6A";
  }

  // 4. Pops / Sodas (soda pop)
  if (
    subLower.includes("soda") || 
    nameLower.includes("soda") || 
    nameLower.includes("coke") || 
    nameLower.includes("fanta") || 
    nameLower.includes("sprite") || 
    nameLower.includes("creme") || 
    nameLower.includes("pop") ||
    secLower.includes("pop") ||
    subLower.includes("pop")
  ) {
    return "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80";
  }

  return item.image || "";
}

export default function App() {
  // --- States ---
  const [theme, setTheme] = useState<"LUTHO" | "DARK" | "LIGHT">(() => {
    try {
      const saved = localStorage.getItem("lutho_theme");
      return (saved === "DARK" || saved === "LIGHT" || saved === "LUTHO") ? saved : "LUTHO";
    } catch {
      return "LUTHO";
    }
  });
  useEffect(() => {
    try { localStorage.setItem("lutho_theme", theme); } catch {}
  }, [theme]);

  // Runtime brand palette (Theme Studio) — applied to CSS variables on boot.
  const [luthoPalette, setLuthoPalette] = useState<LuthoPalette>(() => bootstrapTheme());
  useEffect(() => {
    bootstrapTheme();
  }, []);

  // Owner-imported custom menu (overrides the seed menu when present).
  const [importedMenu, setImportedMenu] = useState<MenuItem[]>(() => readImportedMenu());
  useEffect(() => {
    const handler = () => setImportedMenu(readImportedMenu());
    window.addEventListener("lutho_menu_updated", handler);
    return () => window.removeEventListener("lutho_menu_updated", handler);
  }, []);

  // Onboarding completion (drives the first-run prompt in the staff console).
  const [onboardingDone, setOnboardingDone] = useState<boolean>(() => isOnboardingComplete());
  useEffect(() => {
    const handler = () => setOnboardingDone(isOnboardingComplete());
    window.addEventListener("lutho_kb_updated", handler);
    return () => window.removeEventListener("lutho_kb_updated", handler);
  }, []);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState<"DRINK" | "EAT">("EAT");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [waiterSummoned, setWaiterSummoned] = useState(false);
  const [selectedSpecialIndex, setSelectedSpecialIndex] = useState(0);

  // Stateful Specials list that can be managed by staff in real-time
  const [specials, setSpecials] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_specials_v4");
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = [...parsed];
        SPECIALS.forEach(preset => {
          if (!merged.some(m => m.id === preset.id)) {
            merged.push(preset);
          }
        });
        return merged;
      }
      return SPECIALS;
    } catch {
      return SPECIALS;
    }
  });

  // Keep track of dynamic new special drop alerts to show clients
  const [droppedSpecialNotification, setDroppedSpecialNotification] = useState<{ id: string; title: string; deal: string; description: string } | null>(null);

  // Google Review Machine coupon state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userReviewRating, setUserReviewRating] = useState(5);
  const [userReviewText, setUserReviewText] = useState("");
  const [couponCode, setCouponCode] = useState<string | null>(() => {
    return localStorage.getItem("lutho_applied_coupon_code") || null;
  });
  const [couponApplied, setCouponApplied] = useState(() => {
    return localStorage.getItem("lutho_coupon_applied") === "true";
  });

  // QR modal state
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [splitQrStep, setSplitQrStep] = useState<"choose" | "host" | "join">("choose");
  const [joinSplitInput, setJoinSplitInput] = useState("");
  const [remoteSplitSession, setRemoteSplitSession] = useState<RemoteSplitSession | null>(() => loadJoinedSplitSession());
  const [remoteOrderMode, setRemoteOrderMode] = useState<"solo" | "group">("solo");
  const [groupOrderDraft, setGroupOrderDraft] = useState<GroupOrderDraft | null>(null);
  const submittingGroupRoundRef = useRef<string | null>(null);
  const lastGroupRoundIdRef = useRef<string | null>(null);
  const skipSplitBillEchoRef = useRef(false);
  const [lastOrderPassId, setLastOrderPassId] = useState<string | null>(null);

  // Custom QR override states
  const [qrCustomizeOpen, setQrCustomizeOpen] = useState(false);
  const [customQrs, setCustomQrs] = useState<Record<string, string>>(readStoredCustomQrs);
  const [qrOverlayImages, setQrOverlayImages] = useState<Record<string, string>>(readStoredQrOverlays);

  useEffect(() => {
    localStorage.setItem(CUSTOM_QR_STORAGE_KEY, JSON.stringify(customQrs));
  }, [customQrs]);

  useEffect(() => {
    localStorage.setItem(QR_OVERLAY_STORAGE_KEY, JSON.stringify(qrOverlayImages));
  }, [qrOverlayImages]);

  const [showQrPrintSheet, setShowQrPrintSheet] = useState(false);
  const [qrPrintTheme, setQrPrintTheme] = useState<"ORANGE" | "DARK" | "MINIMAL" | "LIGHT">("ORANGE");

  const openQrPrintSheet = useCallback((withCustomize = false) => {
    setQrCustomizeOpen(withCustomize);
    setShowQrPrintSheet(true);
  }, []);

  // Helper: Copy dynamic full URL for a table
  const handleCopyUrl = (tableId: string) => {
    let secureToken = "";
    try {
      const saved = localStorage.getItem("lutho_tables_security_configs");
      if (saved) {
        const configs = JSON.parse(saved);
        if (configs[tableId]) secureToken = configs[tableId].secureToken;
      }
    } catch {}
    if (!secureToken) {
      const pins: Record<string, string> = {
        "1": "1394", "2": "2485", "3": "3571", "4": "4619", "5": "5728",
        "6": "6837", "7": "7942", "8": "8051", "9": "9163", "10": "5084",
        "11": "2195", "12": "1294", "13": "3141", "14": "4529", "15": "5670"
      };
      const pin = pins[tableId] || "1294";
      secureToken = `lutho-sec-t${tableId.padStart(2, "0")}-${pin}f8c2b5`;
    }
    const tableUrl = `${window.location.origin}${window.location.pathname}?table=${tableId}&token=${secureToken}`;
    navigator.clipboard.writeText(tableUrl);
    triggerToast(`Table ${tableId} secure guest link copied! 📋`, "success");
    playBeep(520, "sine", 0.05);
  };

  // Helper: Copy parameter slug for a table
  const handleCopySlug = (tableId: string) => {
    const slug = `table=${tableId}`;
    navigator.clipboard.writeText(slug);
    triggerToast(`Table ${tableId} slug copied! 📋`, "success");
    playBeep(520, "sine", 0.05);
  };

  const handleQrUpload = async (tableId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const base64Data = await fileToDataUrl(file);
      setCustomQrs((prev) => ({ ...prev, [tableId]: base64Data }));
      triggerToast(`Custom QR image mapped to ${formatTableLabel(tableId)}`, "success");
      playBeep(600, "sine", 0.08);
    } catch {
      triggerToast("Could not read that image file.", "info");
    }
    event.target.value = "";
  };

  const handleBatchQrUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const base64Data = await fileToDataUrl(file);
      const batch: Record<string, string> = {};
      LUTHO_TABLES.forEach((table) => {
        batch[table.id] = base64Data;
      });
      setCustomQrs(batch);
      triggerToast("Same QR image applied to all tables — replace per-table uploads for unique codes", "success");
      playBeep(600, "sine", 0.08);
    } catch {
      triggerToast("Could not read that image file.", "info");
    }
    event.target.value = "";
  };

  const handleClearTableQr = (tableId: string) => {
    setCustomQrs((prev) => {
      const next = { ...prev };
      delete next[tableId];
      return next;
    });
    triggerToast(`Reset ${formatTableLabel(tableId)} to system QR`, "info");
  };

  const handleRestoreAllQrs = () => {
    setCustomQrs({});
    setQrOverlayImages({});
    triggerToast("All tables restored to system halftone QR codes", "info");
  };

  // Dynamic state representing the physical Table ID we are sitting at (defaults to 12)
  const [currentTableId, setCurrentTableId] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get("table");
      if (tableParam) {
        const cleanId = tableParam.replace(/\D/g, "");
        return cleanId || tableParam;
      }
    } catch (e) {
      console.error(e);
    }
    return REMOTE_TABLE_ID;
  });

  // Check if we are on a table card (client view has ?table=XX)
  const hasTableSlug = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return !!params.get("table");
    } catch {
      return false;
    }
  })();

  const isValidTable = (() => {
    try {
      // Validate pathname first to catch custom paths like /er
      const cleanPath = window.location.pathname.replace(/^\/|\/$/g, "");
      if (cleanPath && cleanPath !== "index.html") {
        return false;
      }

      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get("table");
      if (!tableParam) return true; // Default view or staff view is valid
      const cleanId = tableParam.replace(/\D/g, "");
      const idNum = parseInt(cleanId || tableParam, 10);
      return !isNaN(idNum) && idNum >= 1 && idNum <= 14;
    } catch {
      return false;
    }
  })();

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("table")) {
        return false;
      }
      return localStorage.getItem("lutho_admin_unlocked") === "true";
    } catch {
      return false;
    }
  });

  const [adminPinInput, setAdminPinInput] = useState<string>("");
  const [onAdminKioskRoute, setOnAdminKioskRoute] = useState(() => isAdminKioskRoute());

  // --- Waiter Dashboard / Staff View States ---
  const [appMode, setAppMode] = useState<"CUSTOMER" | "STAFF">(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("table")) {
        return "CUSTOMER";
      }
      return "CUSTOMER";
    } catch {
      return "CUSTOMER";
    }
  });

  // Track URL change to dynamically synchronize table mapping
  useEffect(() => {
    const syncTableId = () => {
      const adminRoute = isAdminKioskRoute();
      setOnAdminKioskRoute(adminRoute);

      if (adminRoute) {
        setShowSplash(false);
        setShowStaffGate(false);

        const params = new URLSearchParams(window.location.search);
        const cleanPath = window.location.pathname.replace(/^\/|\/$/g, "").toLowerCase();
        if (cleanPath === "admin" && params.get("admin") !== "1") {
          window.history.replaceState({}, "", `${window.location.pathname}?admin=1`);
        }
        if (params.get("table")) {
          window.history.replaceState({}, "", `${window.location.pathname}?admin=1`);
        }

        const savedProfileId = localStorage.getItem("lutho_active_staff_profile_id") || "";
        const unlocked = localStorage.getItem("lutho_admin_unlocked") === "true";
        if (unlocked && savedProfileId) {
          setActiveStaffProfileId(savedProfileId);
          setAppMode("STAFF");
          // Do not force workspace here — polling was resetting every tab back to Floor layout
        }
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get("table");
      if (tableParam) {
        const cleanId = tableParam.replace(/\D/g, "");
        const tableId = cleanId || tableParam;
        setCurrentTableId(tableId);
        localStorage.setItem("lutho_active_customer_table", tableId);
        // Scanning a table QR code should always return Customer View, never staff view
        setAppMode("CUSTOMER");
      } else {
        // If kiosk operator explicitly asked for admin, don't rewrite URL.
        if (params.get("admin") === "1") {
          return;
        }

        // Raw domain: default users to Remote Ordering (Table 14).
        try {
          const config = generateDefaultConfig("14");
          const next = `?table=14&token=${encodeURIComponent(config.secureToken)}`;
          window.history.replaceState({}, "", `${window.location.pathname}${next}`);
          setCurrentTableId("14");
          localStorage.setItem("lutho_active_customer_table", "14");
          setAppMode("CUSTOMER");
          setIsAdminUnlocked(false);
        } catch {
          setAppMode("CUSTOMER");
          setIsAdminUnlocked(false);
        }
      }
    };
    window.addEventListener("popstate", syncTableId);
    
    // Also periodically poll for URL search parameter change (if changed in simulation)
    const interval = setInterval(syncTableId, 1000);
    // Run once on mount to normalize initial URL.
    syncTableId();
    return () => {
      window.removeEventListener("popstate", syncTableId);
      clearInterval(interval);
    };
  }, []);

  // Automatically mark table as Occupied when scanned/accessed in Customer View
  useEffect(() => {
    if (
      appMode === "CUSTOMER" &&
      currentTableId &&
      (currentTableId === REMOTE_TABLE_ID || isTableUnlocked)
    ) {
      setTablesState(prev => {
        if (prev[currentTableId] === "Available") {
          return { ...prev, [currentTableId]: "Occupied" };
        }
        return prev;
      });
    }
  }, [appMode, currentTableId]);

  // Selected menu item for details modal
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);
  const [detailModifiers, setDetailModifiers] = useState<{ bacon: boolean; cheddar: boolean }>({ bacon: false, cheddar: false });

  // Reset modifiers whenever selectedDetailItem changes
  useEffect(() => {
    setDetailModifiers({ bacon: false, cheddar: false });
  }, [selectedDetailItem]);

  // --- Ultimate Lutho Booking, Games, Table Occupancy, Chat States ---
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isGamesModalOpen, setIsGamesModalOpen] = useState(false);

  // Scroll to top when viewport-shifting modals are opened (extremely useful for scrolling iframe setups)
  useEffect(() => {
    if (isBookingModalOpen || isGamesModalOpen || !!selectedDetailItem) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      document.body.scrollTo({ top: 0, behavior: "smooth" });
      
      // Prevent body/viewport scrolling (fixing loose behavior)
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, [isBookingModalOpen, isGamesModalOpen, selectedDetailItem]);
  const [activeGameId, setActiveGameId] = useState<"ASTEROIDS" | "DARTS" | null>(null);
  const [arcadeScore, setArcadeScore] = useState(0);
  const [arcadeHighScore, setArcadeHighScore] = useState(150);

  // Control Menu Center
  const [isControlMenuOpen, setIsControlMenuOpen] = useState(false);

  // Custom Drink Games States
  const [selectedDrinkingGame, setSelectedDrinkingGame] = useState<"KINGS_CUP" | "TRUTH_DARE" | "NEVER_EVER" | "MOST_LIKELY" | "SPIN_BOTTLE" | "WOULD_RATHER" | null>(null);
  const [kingsCupCard, setKingsCupCard] = useState<{ suit: string; value: string; title: string; rule: string } | null>(null);
  const [truthOrDarePrompt, setTruthOrDarePrompt] = useState<{ type: "TRUTH" | "DARE"; text: string } | null>(null);
  const [neverEverPrompt, setNeverEverPrompt] = useState<string>("Never have I ever texted my ex after 3 craft beers.");
  const [mostLikelyPrompt, setMostLikelyPrompt] = useState<string>("Most likely to pay the whole table bill tonight.");
  const [bottleRotation, setBottleRotation] = useState<number>(0);
  const [bottleTargetOutcome, setBottleTargetOutcome] = useState<string>("Click Spin to start drinking!");
  const [isBottleSpinning, setIsBottleSpinning] = useState<boolean>(false);
  const [wouldRatherPrompt, setWouldRatherPrompt] = useState<[string, string] | null>(["Be the karaoke opening starter", "Pay for the next round of table craft pints"]);
  const [wouldRatherVotes, setWouldRatherVotes] = useState<[number, number] | null>(null);

  // States for active offline retro games
  const [asteroids, setAsteroids] = useState<{ id: number; x: number; y: number; speed: number; emoji: string }[]>([]);
  const [asteroidsLives, setAsteroidsLives] = useState(3);
  const [dartsLeft, setDartsLeft] = useState(3);
  const [dartScores, setDartScores] = useState<string[]>([]);
  const [powerBarPercentage, setPowerBarPercentage] = useState(50);
  const [powerBarDirection, setPowerBarDirection] = useState("UP");

  // Stop all active games if the main games modal closes!
  useEffect(() => {
    if (!isGamesModalOpen) {
      setIsBurgerPlaying(false);
      setIsDefuserPlaying(false);
      setActiveGameId(null);
      setFallingIngredients([]);
      setAsteroids([]);
    }
  }, [isGamesModalOpen]);

  // Game cycle 1: Asteroids move loop
  useEffect(() => {
    if (activeGameId !== "ASTEROIDS" || !isGamesModalOpen) {
      setAsteroids([]);
      return;
    }

    const interval = setInterval(() => {
      setAsteroids(prev => {
        const next = prev.map(a => ({ ...a, y: a.y + a.speed }))
          .filter(a => {
            if (a.y >= 92) {
              setAsteroidsLives(l => {
                if (l <= 1) {
                  playBeep(120, "sawtooth", 0.45);
                  triggerToast("💀 Asteroids overrun Table 12! Game Over!", "info");
                  setAsteroids([]);
                } else {
                  playBeep(180, "sawtooth", 0.12);
                }
                return Math.max(0, l - 1);
              });
              return false;
            }
            return true;
          });
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [activeGameId, isGamesModalOpen]);

  // Game cycle 2: Spawn new Asteroids
  useEffect(() => {
    if (activeGameId !== "ASTEROIDS" || !isGamesModalOpen || asteroidsLives <= 0) return;

    const interval = setInterval(() => {
      const emojis = ["☄️", "👾", "🛰️", "🛸", "💥"];
      const newAsteroid = {
        id: Date.now() + Math.random(),
        x: Math.random() * 85 + 5,
        y: 0,
        speed: Math.random() * 2.5 + 4,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      };
      setAsteroids(prev => [...prev, newAsteroid]);
    }, 1300);

    return () => clearInterval(interval);
  }, [activeGameId, isGamesModalOpen, asteroidsLives]);

  // Game cycle 3: Darts rotating targeting power bar
  useEffect(() => {
    if (activeGameId !== "DARTS" || !isGamesModalOpen || dartsLeft <= 0) return;

    const interval = setInterval(() => {
      setPowerBarPercentage(p => {
        const dir = p >= 96 ? "DOWN" : p <= 4 ? "UP" : powerBarDirection;
        if (dir !== powerBarDirection) {
          setPowerBarDirection(dir);
        }
        return dir === "UP" ? p + 4 : p - 4;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [activeGameId, isGamesModalOpen, dartsLeft, powerBarDirection]);

  // Form states for booking
  const [bookingDate, setBookingDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState(() => getDefaultBookingTime(new Date().toISOString().split("T")[0]));
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingTableId, setBookingTableId] = useState<string | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingOccasion, setBookingOccasion] = useState("Just Vibes");
  const [bookingSpecialRequests, setBookingSpecialRequests] = useState("");
  const [bookingStep, setBookingStep] = useState(1);

  useEffect(() => {
    const slots = getBookingTimeSlots(bookingDate);
    if (!slots.includes(bookingTime)) {
      setBookingTime(getDefaultBookingTime(bookingDate));
    }
  }, [bookingDate, bookingTime]);

  // Booking list
  const [bookings, setBookings] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_bookings");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 1-15 tables state: "Available" | "Occupied" | "Booked" | "Pending Cleanup"
  const [tablesState, setTablesState] = useState<Record<string, "Available" | "Occupied" | "Booked" | "Pending Cleanup">>(() => {
    try {
      const saved = localStorage.getItem("lutho_tables_occupancy");
      if (saved) return JSON.parse(saved);
    } catch {}
    const defaults: Record<string, "Available" | "Occupied" | "Booked" | "Pending Cleanup"> = {};
    for (let i = 1; i <= 13; i++) {
      defaults[String(i)] = "Available";
    }
    return defaults;
  });

  // Table chat messages lobby
  const [chatMessages, setChatMessages] = useState<any[]>(() => loadChatMessages());

  // Active chat input state
  const [chatInputText, setChatInputText] = useState("");
  // Selected conversation table in Waiter Dashboard Chat lobby (defaults to 12)
  const [activeChatTableId, setActiveChatTableId] = useState("12");

  // Live customer-side chat drawer states
  const [isCustomerChatOpen, setIsCustomerChatOpen] = useState(false);
  const [customerChatInput, setCustomerChatInput] = useState("");

  // Browser notification popup alert dismissed state
  const [activeBookingWarning, setActiveBookingWarning] = useState<string | null>(null);

  // --- Ultimate POS Integration & Sync Control Center states ---
  const [isPosConfigOpen, setIsPosConfigOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [selectedPosSystem, setSelectedPosSystem] = useState<string>(() => {
    return localStorage.getItem("lutho_pos_selected") || "PILOT";
  });
  const [posSettings, setPosSettings] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem("lutho_pos_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      PILOT: {
        apiUrl: "https://api.pilotpos.co.za/v1",
        storeCode: "PIL-7281-RM",
        apiKey: "pk_plt_8271a8f96b281bf011",
        channelId: "LUTHO-GUEST-APP-SWG",
        tableMappingType: "DYNAMIC_NUMERIC",
        bufferTimeout: "3000"
      },
      GAAP: {
        gatewayUrl: "https://gaapcloud.net/integrator/api/v2",
        siteId: "GAAP-LUTHO-DURBAN-SOUTH",
        clientSecret: "sc_gp_91823eb21a",
        webhookUrl: "https://api.lutho.app/webhooks/gaap",
        diningOptionCode: "10"
      },
      TOAST: {
        clientId: "toast_client_lutho_app",
        clientSecret: "toast_sec_99182522a",
        groupId: "39a8cd4b-8812-4211-bb1e-128292851a",
        envMode: "SANDBOX"
      },
      LIGHTSPEED: {
        tenantId: "ls_rm_982",
        registerId: "reg_01_south",
        accessToken: "tok_ls_8827104b2b"
      },
      MICROS: {
        simphonyUrl: "https://simphony.lutho.app:8080/api",
        workstationId: "WS-04-FRONT",
        revenueCenterId: "RVC-BAR-02",
        employeeId: "10092"
      },
      CLOVER: {
        merchantId: "cl_merch_881920",
        env: "PRODUCTION",
        accessToken: "clv_acc_8716b92a"
      },
      REST: {
        customUrl: "https://api.lutho-franchise.net/orders/v1",
        bearerToken: "Bearer lutho_franchise_9921_sec",
        signingSecret: "wh_sign_9821aa8716cc"
      }
    };
  });
  const [isPosConnecting, setIsPosConnecting] = useState(false);
  const [isPosConnected, setIsPosConnected] = useState(() => {
    return localStorage.getItem("lutho_pos_connected") === "true";
  });
  const [posConnectionLogs, setPosConnectionLogs] = useState<string[]>([]);

  // Track known booking IDs to detect and popup newly booked ones
  const [knownBookingIds, setKnownBookingIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_bookings");
      let parsed = saved ? JSON.parse(saved) : [];
      parsed = parsed.filter((b: any) => b.id !== "b-1" && b.id !== "b-2" && b.name !== "Jessica Smith" && b.name !== "Marcus Dun");
      return parsed.map((b: any) => b.id);
    } catch {
      return [];
    }
  });

  // Staff promotion creation states
  const [staffSpecialSelectId, setStaffSpecialSelectId] = useState("");
  const [staffSpecialTitle, setStaffSpecialTitle] = useState("");
  const [staffSpecialDeal, setStaffSpecialDeal] = useState("");
  const [staffSpecialDescription, setStaffSpecialDescription] = useState("");
  const [staffSpecialBadge, setStaffSpecialBadge] = useState("");

  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 15000); // update every 15s to be accurate
    return () => clearInterval(interval);
  }, []);

  const getElapsedMinutesAgo = (createdAtTimestamp?: number, fallbackTimeString?: string) => {
    if (!createdAtTimestamp) {
      if (fallbackTimeString) {
        try {
          const [hours, minutes] = fallbackTimeString.split(":").map(Number);
          const d = new Date();
          d.setHours(hours, minutes, 0, 0);
          const diffMs = Date.now() - d.getTime();
          const diffMin = Math.max(0, Math.floor(diffMs / 60000));
          if (diffMin >= 0 && diffMin < 1440) {
            return `${diffMin}m ago`;
          }
        } catch {}
      }
      return "12m ago";
    }
    const diffMs = now - createdAtTimestamp;
    const diffMin = Math.max(0, Math.floor(diffMs / 60000));
    return `${diffMin}m ago`;
  };
  
  // Dynamic alerts list
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" | "stamp" }[]>([]);

  // Stamps tracking (persisted)
  const [stamps, setStamps ] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("lutho_stamps");
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Track the history of submitted orders to mimic real "connected" Lutho OS
  const [historicOrders, setHistoricOrders] = useState<HistoricOrder[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Notes for current cart order
  const [orderNotes, setOrderNotes] = useState("");

  // Sound preference state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Splash Screen & First-time onboarding states
  const [showSplash, setShowSplash] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isClaimScannerOpen, setIsClaimScannerOpen] = useState(false);
  const [isTableHistoryOpen, setIsTableHistoryOpen] = useState(false);
  const [tableHistoryTableId, setTableHistoryTableId] = useState<string | null>(null);
  const [passFormatChoiceOrder, setPassFormatChoiceOrder] = useState<HistoricOrder | null>(null);
  const [pendingPassFormat, setPendingPassFormat] = useState<PassFormat>("pdf");
  const [passDownloadPrompt, setPassDownloadPrompt] = useState<{
    order: HistoricOrder;
    tableId: string;
    orderedBy?: string;
    assignedStaffName?: string;
    isRemote?: boolean;
    isGroup?: boolean;
    groupRoundId?: string;
    claimCode?: string;
  } | null>(null);
  const [isGuestNameOpen, setIsGuestNameOpen] = useState(() => {
    try {
      return !localStorage.getItem("lutho_guest_name_confirmed");
    } catch {
      return true;
    }
  });
  const [guestNicknameInput, setGuestNicknameInput] = useState("");

  // Dynamic state-based Menu Items list for the Live Menu manager & favorites
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_menu_items_v4");
      let base = saved ? JSON.parse(saved) : MENU_ITEMS;
      base = base.map((item: any) => {
        if (item.id === "promo-3") {
          return { ...item, price: 129, priceText: "R 129" };
        }
        return item;
      });
      return base.filter((item: any) => item.id !== "promo-1");
    } catch {
      return MENU_ITEMS.map((item: any) => {
        if (item.id === "promo-3") {
          return { ...item, price: 129, priceText: "R 129" };
        }
        return item;
      }).filter((item: any) => item.id !== "promo-1");
    }
  });

  const [favoritedIds, setFavoritedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic game selection tabs & multi-game states
  const [activeGameTab, setActiveGameTab] = useState<"DRINKING" | "ARCADE" | "CHALLENGES">("DRINKING");
  
  // Lutho Burger Catcher Game states
  const [burgerCatcherScore, setBurgerCatcherScore] = useState(0);
  const [burgerPosition, setBurgerPosition] = useState(190);
  const [fallingIngredients, setFallingIngredients] = useState<{ id: number; x: number; y: number; emoji: string; speed: number; isBad: boolean }[]>([]);
  const [burgerCatcherLives, setBurgerCatcherLives] = useState(3);
  const [isBurgerPlaying, setIsBurgerPlaying] = useState(false);

  // Touch & Hold states for Burger Catcher
  const [isPressingLeft, setIsPressingLeft] = useState(false);
  const [isPressingRight, setIsPressingRight] = useState(false);

  // Authenticated Loyalty User Profile states
  const [userProfile, setUserProfile] = useState<{ email: string; username: string } | null>(() => {
    try {
      const saved = localStorage.getItem("lutho_user_profile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [hasPromptedLoyaltyForThisTx, setHasPromptedLoyaltyForThisTx] = useState(false);
  const [earnedStampsPending, setEarnedStampsPending] = useState(0);
  const [loyaltyEmailInput, setLoyaltyEmailInput] = useState("");
  const [loyaltyUsernameInput, setLoyaltyUsernameInput] = useState("");

  // Memory Match game states
  const [memoryCards, setMemoryCards] = useState<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [selectedCardIdxs, setSelectedCardIdxs] = useState<number[]>([]);
  const [memoryStatus, setMemoryStatus] = useState("Tap cards to match pairs!");
  const [memoryScore, setMemoryScore] = useState(0);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // --- CHILI CHEEZE BOMB DEFUSER GAME STATES ---
  const [isDefuserPlaying, setIsDefuserPlaying] = useState(false);
  const [defuserScore, setDefuserScore] = useState(0);
  const [defuserLives, setDefuserLives] = useState(3);
  const [defuserGrid, setDefuserGrid] = useState<{ id: number; type: "CHILI" | "CHEESE" | "GOLD"; fuse: number; active: boolean }[]>(() => 
    Array.from({ length: 9 }).map((_, idx) => ({ id: idx, type: "CHEESE", fuse: 100, active: false }))
  );
  const [defuserHighScore, setDefuserHighScore] = useState<number>(() => {
    return Number(localStorage.getItem("lutho_defuser_highscore") || "120");
  });
  const [defuserLeaderboard, setDefuserLeaderboard] = useState<{ name: string; score: number; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_defuser_leaderboard");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [leaderboardNameInput, setLeaderboardNameInput] = useState("");
  const [showLeaderboardSubmit, setShowLeaderboardSubmit] = useState(false);
  const [defuserScreenshake, setDefuserScreenshake] = useState(false);

  // --- THUNEE CARD GAME STATES ---
  const [isThuneePlaying, setIsThuneePlaying] = useState(false);
  const [thuneeHand, setThuneeHand] = useState<any[]>([]);
  const [thuneeStage, setThuneeStage] = useState<"DEAL" | "TRUMP_SELECTION" | "PLAY" | "ROUND_OVER" | "GAME_OVER">("DEAL");
  const [thuneeTrumpSuit, setThuneeTrumpSuit] = useState<"HEARTS" | "DIAMONDS" | "CLUBS" | "SPADES" | null>(null);
  const [thuneeLeadPlayer, setThuneeLeadPlayer] = useState<"You" | "Left" | "Partner" | "Right">("You");
  const [thuneePlayedCards, setThuneePlayedCards] = useState<{ player: string; card: any }[]>([]);
  const [thuneeRoundScores, setThuneeRoundScores] = useState({ ourTeam: 0, enemyTeam: 0 }); // round trick points (max 304)
  const [thuneeGameScores, setThuneeGameScores] = useState({ ourTeam: 0, enemyTeam: 0 }); // game match points (first to 4 wins)
  const [thuneeCallThunee, setThuneeCallThunee] = useState<boolean>(false);
  const [thuneeThuneeCaller, setThuneeThuneeCaller] = useState<string | null>(null);
  const [thuneeTricksWon, setThuneeTricksWon] = useState({ ourTeam: 0, enemyTeam: 0 });
  const [thuneeGameStatusText, setThuneeGameStatusText] = useState("Tap Deal to start Thunee!");
  const [thuneeAllCards, setThuneeAllCards] = useState<Record<string, any[]>>({}); // cards of all 4 players
  const [thuneeCurrentTurn, setThuneeCurrentTurn] = useState<"You" | "Left" | "Partner" | "Right" | null>(null);
  
  // High-fidelity Multi-user Absolute Seat States
  const [thuneeGameMode, setThuneeGameMode] = useState<"AI" | "MULTIPLAYER" | null>(null);
  const [thuneeSeats, setThuneeSeats] = useState<(string | null)[]>([null, null, null, null]);
  const [thuneeHostName, setThuneeHostName] = useState<string>("");
  const [thuneeCurrentTurnIndex, setThuneeCurrentTurnIndex] = useState<number | null>(null);
  const [thuneePlayedCardsNew, setThuneePlayedCardsNew] = useState<{ playerIndex: number; name: string; card: any }[]>([]);
  const [thuneeAllCardsNew, setThuneeAllCardsNew] = useState<Record<string, any[]>>({});
  const [thuneeLeadPlayerIndex, setThuneeLeadPlayerIndex] = useState<number>(0);
  const [thuneeShowHelpSheet, setThuneeShowHelpSheet] = useState(false);
  const [thuneeAdviceText, setThuneeAdviceText] = useState<string | null>(null);
  const [thuneeSuggestedCardId, setThuneeSuggestedCardId] = useState<string | null>(null);

  // --- STAFF AUTH, SHIFT ROSTERING & SERVICE CONTROL ---
  const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>(() => [DEFAULT_GENERAL_PROFILE]);
  const [selectedStaffProfileId, setSelectedStaffProfileId] = useState<string>(() => DEFAULT_GENERAL_PROFILE.id);
  const [staffPinInput, setStaffPinInput] = useState("");
  const [staffTablePinPrompt, setStaffTablePinPrompt] = useState<string | null>(null);
  const [selectedStaffTable, setSelectedStaffTable] = useState<string | null>(null);
  const [staffTablePinInput, setStaffTablePinInput] = useState("");
  const [activeStaffProfileId, setActiveStaffProfileId] = useState<string>(() => localStorage.getItem("lutho_active_staff_profile_id") || "");
  const [staffWorkspace, setStaffWorkspace] = useState<StaffWorkspace>("overview");
  const [staffSidebarOpen, setStaffSidebarOpen] = useState(false);
  const [staffInspectorChatOpen, setStaffInspectorChatOpen] = useState(true);
  const [staffChatInput, setStaffChatInput] = useState("");
  const [staffAuthError, setStaffAuthError] = useState("");
  const [staffCreateName, setStaffCreateName] = useState("");
  const [staffCreatePin, setStaffCreatePin] = useState("");
  const [staffCreateRole, setStaffCreateRole] = useState<StaffRole>("general");
  const [staffResetCurrentPin, setStaffResetCurrentPin] = useState("");
  const [staffResetNewPin, setStaffResetNewPin] = useState("");
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [sharedStaffOrders, setSharedStaffOrders] = useState<StaffOrderRecord[]>([]);
  const [tableSittings, setTableSittings] = useState<TableSittingRecord[]>([]);
  /** Floor pulse flags — synced via Firestore system/tableAlerts across devices. */
  const [tableAlerts, setTableAlerts] = useState<Record<string, boolean>>({});
  const [tableServices, setTableServices] = useState<TableServiceMap>({});
  const [staffManualOrderOpen, setStaffManualOrderOpen] = useState(false);
  const [staffManualOrderSearch, setStaffManualOrderSearch] = useState("");
  const [staffManualOrderCart, setStaffManualOrderCart] = useState<CartItem[]>([]);
  const [staffManualOrderNotes, setStaffManualOrderNotes] = useState("");
  const [staffMoveTarget, setStaffMoveTarget] = useState("");
  const [staffCombineTables, setStaffCombineTables] = useState<string[]>([]);
  const [expandedSittingId, setExpandedSittingId] = useState<string | null>(null);
  const knownStaffOrderIdsRef = useRef<string[]>([]);

  const activeStaffProfile = useMemo(
    () => staffProfiles.find(profile => profile.id === activeStaffProfileId) || null,
    [staffProfiles, activeStaffProfileId]
  );

  const isAdminStaff = activeStaffProfile?.role === "admin";

  // Hide staff sign-in behind a kiosk easter-egg.
  // The app should open on the customer homepage by default.
  const [showStaffGate, setShowStaffGate] = useState(false);
  const [staffLogoClicks, setStaffLogoClicks] = useState(0);
  const [staffGateUnlocked, setStaffGateUnlocked] = useState(false);

  // Admin kiosk route: skip splash and use full-page login (not the customer landing).
  useEffect(() => {
    if (isAdminKioskRoute()) {
      setShowSplash(false);
    }
  }, []);

  // --- LUTHO CREW ACADEMY, SHIFT ROSTERING & TIMERS STATES ---
  const [waitersList, setWaitersList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_waiters_list");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { name: "Lutho Crew (Grill Champion)", onShift: true, progress: 100, completedModules: ["efficiency", "timers", "thunee"], history: [
        { orderId: "ORD-K8F", tableId: "10", itemsCount: 3, prepTimeSeconds: 45, deliveryTimeSeconds: 38, onTime: true },
        { orderId: "ORD-M3A", tableId: "14", itemsCount: 2, prepTimeSeconds: 30, deliveryTimeSeconds: 22, onTime: true }
      ] },
      { name: "Lerato (Floor Lead)", onShift: true, progress: 66, completedModules: ["efficiency", "timers"], history: [
        { orderId: "ORD-U9X", tableId: "11", itemsCount: 4, prepTimeSeconds: 60, deliveryTimeSeconds: 52, onTime: true }
      ] },
      { name: "Zoe (Shake Master)", onShift: true, progress: 33, completedModules: ["efficiency"], history: [] },
      { name: "Devon (Burger Scholar)", onShift: false, progress: 0, completedModules: [], history: [] }
    ];
  });

  const [activeWaiterProfileName, setActiveWaiterProfileName] = useState<string>(() => {
    return localStorage.getItem("lutho_active_waiter_profile") || "Zoe (Shake Master)";
  });

  const [staffRegistrationName, setStaffRegistrationName] = useState("");

  const [tableWaiterAssignments, setTableWaiterAssignments] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("lutho_table_assignments");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [academyActiveModule, setAcademyActiveModule] = useState<string>("efficiency");
  const [academyQuizSelectedAns, setAcademyQuizSelectedAns] = useState<number | null>(null);
  const [academyQuizResult, setAcademyQuizResult] = useState<"pass" | "fail" | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("lutho_waiters_list", JSON.stringify(waitersList));
  }, [waitersList]);

  useEffect(() => {
    localStorage.setItem("lutho_table_assignments", JSON.stringify(tableWaiterAssignments));
  }, [tableWaiterAssignments]);

  useEffect(() => {
    localStorage.setItem("lutho_active_waiter_profile", activeWaiterProfileName);
  }, [activeWaiterProfileName]);

  useEffect(() => {
    localStorage.setItem("lutho_active_staff_profile_id", activeStaffProfileId);
  }, [activeStaffProfileId]);

  useEffect(() => {
    const ensureDefaultAdmin = async () => {
      try {
        const adminRef = doc(db, "staff_profiles", "admin-root");
        const snapshot = await getDoc(adminRef);
        const desired = {
          name: "General",
          pin: "8034",
          role: "admin",
          onShift: true,
          mustChangePin: false
        };

        if (!snapshot.exists()) {
          await setDoc(adminRef, desired);
          return;
        }

        const current = snapshot.data() as Partial<typeof desired>;
        const needsUpdate =
          current?.name !== desired.name ||
          current?.pin !== desired.pin ||
          current?.role !== desired.role ||
          current?.onShift !== desired.onShift ||
          current?.mustChangePin !== desired.mustChangePin;

        if (needsUpdate) {
          await updateDoc(adminRef, desired);
        }
      } catch (error) {
        console.error(error);
      }
    };

    ensureDefaultAdmin();

    const logFirestorePilotError = (label: string, error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("permission") || message.includes("Permission")) {
        console.warn(`[LUTHO] Firestore pilot sync unavailable (${label}). Deploy firestore.rules or check Firebase auth.`);
        return;
      }
      console.error(error);
    };

    const unsubProfiles = onSnapshot(collection(db, "staff_profiles"), snap => {
      const nextProfiles = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<StaffProfile, "id">)
      })) as StaffProfile[];
      const merged = [
        DEFAULT_GENERAL_PROFILE,
        ...nextProfiles.filter((p) => p.id !== DEFAULT_GENERAL_PROFILE.id)
      ];
      setStaffProfiles(merged.sort((a, b) => a.name.localeCompare(b.name)));
      if (!selectedStaffProfileId) {
        setSelectedStaffProfileId(DEFAULT_GENERAL_PROFILE.id);
      }
    }, error => logFirestorePilotError("staff_profiles", error));

    const unsubRequests = onSnapshot(collection(db, "service_requests"), snap => {
      const nextRequests = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ServiceRequest, "id">)
      })) as ServiceRequest[];
      setServiceRequests(nextRequests.sort((a, b) => b.createdAt - a.createdAt));
    }, error => logFirestorePilotError("service_requests", error));

    const unsubOrders = onSnapshot(collection(db, "staff_orders"), snap => {
      const nextOrders = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<StaffOrderRecord, "id">)
      })) as StaffOrderRecord[];
      nextOrders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setSharedStaffOrders(nextOrders);
    }, error => logFirestorePilotError("staff_orders", error));

    const unsubAssignments = onSnapshot(doc(db, "system", "tableAssignments"), snap => {
      const data = snap.data() as Record<string, string> | undefined;
      if (data) {
        setTableWaiterAssignments(data);
      }
    }, error => logFirestorePilotError("tableAssignments", error));

    const unsubAlerts = onSnapshot(doc(db, "system", "tableAlerts"), snap => {
      const data = snap.data() as Record<string, boolean> | undefined;
      if (data) {
        setTableAlerts(data);
      } else if (!snap.exists()) {
        setTableAlerts({});
      }
    }, error => logFirestorePilotError("tableAlerts", error));

    const unsubSittings = listenTableSittings((records) => {
      setTableSittings(records);
    });
    const unsubTableServices = listenTableServices((records) => {
      setTableServices(records);
    });

    return () => {
      unsubProfiles();
      unsubRequests();
      unsubOrders();
      unsubAssignments();
      unsubAlerts();
      unsubSittings();
      unsubTableServices();
    };
  }, []);

  // Guard: Menu, Onboarding and Theme workspaces are admin-only.
  useEffect(() => {
    if (!activeStaffProfile) return;
    const adminOnly: StaffWorkspace[] = ["menu", "onboarding", "theme"];
    if (activeStaffProfile.role !== "admin" && adminOnly.includes(staffWorkspace)) {
      setStaffWorkspace("overview");
    }
  }, [activeStaffProfile, staffWorkspace]);

  const getNextAvailableWaiter = (assignments: Record<string, string>): StaffProfile | null => {
    const availableProfiles = staffProfiles.filter(
      profile => profile.role === "general" && profile.onShift && profile.id !== "admin-root" && profile.name !== "General"
    );
    if (availableProfiles.length === 0) {
      return DEFAULT_GENERAL_PROFILE;
    }

    const activePrimaryServices = (Object.values(tableServices) as TableServiceRecord[]).filter(
      (service: TableServiceRecord) =>
        service.active &&
        service.tableId === service.primaryTableId &&
        String(service.tableId) !== REMOTE_TABLE_ID
    );

    const loadScores = availableProfiles.reduce((acc, profile) => {
      const services = activePrimaryServices.filter(
        (service: TableServiceRecord) => service.assignedStaffName === profile.name
      );
      const covers = services.reduce(
        (sum: number, service: TableServiceRecord) => sum + Math.max(1, service.covers),
        0
      );
      const partyIds = new Set(services.map((service: TableServiceRecord) => service.partyId));
      const openTickets = sharedStaffOrders.filter(
        (order) =>
          order.status !== "Completed" &&
          (order.assignedStaffName === profile.name ||
            (!!order.partyId && partyIds.has(order.partyId)))
      ).length;
      const billRequests = serviceRequests.filter(
        (request) =>
          request.status !== "DONE" &&
          request.type === "BILL" &&
          services.some((service: TableServiceRecord) =>
            service.memberTableIds.includes(String(request.tableId))
          )
      ).length;

      // Covers are the base load; live tickets and bills add operational pressure.
      acc[profile.name] = covers + openTickets * 2 + billRequests * 3;
      return acc;
    }, {} as Record<string, number>);

    return [...availableProfiles].sort((a, b) => {
      const loadDelta = (loadScores[a.name] || 0) - (loadScores[b.name] || 0);
      if (loadDelta !== 0) return loadDelta;
      const partyCount = (profile: StaffProfile) =>
        activePrimaryServices.filter(
          (service) => service.assignedStaffName === profile.name
        ).length +
        Object.entries(assignments).filter(
          ([tableId, waiterName]) =>
            waiterName === profile.name && !tableServices[tableId]?.active
        ).length;
      const tableDelta = partyCount(a) - partyCount(b);
      if (tableDelta !== 0) return tableDelta;
      return a.name.localeCompare(b.name);
    })[0] || null;
  };

  const persistTableAssignments = async (nextAssignments: Record<string, string>) => {
    setTableWaiterAssignments(nextAssignments);
    try {
      // Full document replace — merge:true would leave deleted table keys on other devices.
      await setDoc(doc(db, "system", "tableAssignments"), nextAssignments);
    } catch (error) {
      console.error(error);
    }
  };

  /** Cross-device floor pulse / alert flags (Firestore-backed, not local-only). */
  const persistTableAlerts = async (nextAlerts: Record<string, boolean>) => {
    setTableAlerts(nextAlerts);
    try {
      await setDoc(doc(db, "system", "tableAlerts"), sanitizeForFirestore(nextAlerts) as Record<string, unknown>);
    } catch (error) {
      console.error("[LUTHO] Failed to sync table alerts:", error);
    }
  };

  const setTableAlertFlag = async (tableId: string, active: boolean) => {
    const id = String(tableId);
    setTableAlerts((prev) => {
      const next = { ...prev, [id]: active };
      void setDoc(doc(db, "system", "tableAlerts"), sanitizeForFirestore(next) as Record<string, unknown>).catch(
        (error) => console.error("[LUTHO] Failed to sync table alert:", error)
      );
      return next;
    });
  };

  const createServiceRequest = async (type: ServiceRequestType, tableId: string, note?: string) => {
    const service = tableServices[String(tableId)]?.active ? tableServices[String(tableId)] : null;
    const requestTableId = service?.primaryTableId || tableId;
    const waiter =
      service?.assignedStaffName ||
      tableWaiterAssignments[tableId] ||
      getNextAvailableWaiter(tableWaiterAssignments)?.name ||
      "";
    const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const assignedProfile = staffProfiles.find(profile => profile.name === waiter);
    const payload = omitUndefined({
      id: requestId,
      type,
      tableId: requestTableId,
      partyId: service?.partyId,
      status: "OPEN" as const,
      createdAt: Date.now(),
      assignedStaffId: assignedProfile?.id,
      assignedStaffName: assignedProfile?.name,
      note
    });

    setServiceRequests(prev => [payload as ServiceRequest, ...prev]);
    try {
      await setDoc(doc(db, "service_requests", requestId), payload);
    } catch (error) {
      console.error(error);
    }
  };

  const upsertSharedOrder = async (order: StaffOrderRecord) => {
    try {
      await setDoc(doc(db, "staff_orders", order.id), toFirestoreOrder(order), { merge: true });
    } catch (error) {
      console.error("[LUTHO] Failed to sync order to Firestore:", error);
    }
  };

  const updateSharedOrderStatus = async (orderId: string, status: HistoricOrder["status"]) => {
    const existing = sharedStaffOrders.find(o => o.id === orderId);
    if (
      existing &&
      (existing.status === "Completed" || existing.status === "Paid" || (existing as any).paymentStatus === "PAID")
    ) {
      if (!window.confirm("This order was already marked paid/completed. Are you sure you want to update it again?")) {
        return;
      }
    }

    const paymentStatus =
      status === "Paid" || status === "Completed"
        ? "PAID"
        : (existing as any)?.paymentStatus === "PAID"
          ? "PAID"
          : "UNPAID";

    const patch = { status, paymentStatus, updatedAt: Date.now() };

    setSharedStaffOrders(prev => prev.map(order => order.id === orderId ? { ...order, ...patch } : order));
    setIncomingOrders(prev => prev.map(order => order.id === orderId ? { ...order, ...patch } : order));
    setHistoricOrders(prev => prev.map(order => order.id === orderId ? { ...order, ...patch } : order));
    setOtherTablesOrders(prev => {
      const next: Record<string, any[]> = {};
      Object.entries(prev as Record<string, any[]>).forEach(([tableId, orders]) => {
        next[tableId] = orders.map(order => order.id === orderId ? { ...order, ...patch } : order);
      });
      return next;
    });

    try {
      await updateDoc(doc(db, "staff_orders", orderId), sanitizeForFirestore(patch) as Record<string, unknown>);
    } catch (error) {
      console.error("[LUTHO] Failed to update order status:", error);
    }
  };

  const handleUniversalStaffLogin = () => {
    const pin = normalizePin(adminPinInput || staffPinInput);
    if (!pin) {
      setStaffAuthError("Enter your staff PIN.");
      return;
    }

    const matchedProfile = staffProfiles.find(profile => profile.pin === pin);
    if (!matchedProfile) {
      setStaffAuthError("Incorrect PIN.");
      playBeep(180, "sawtooth", 0.25);
      return;
    }

    setStaffAuthError("");
    setAdminPinInput("");
    setStaffPinInput("");
    setActiveStaffProfileId(matchedProfile.id);
    setSelectedStaffProfileId(matchedProfile.id);
    setShowStaffGate(false);
    setStaffLogoClicks(0);
    setIsAdminUnlocked(true);
    setAppMode("STAFF");
    setStaffWorkspace(onAdminKioskRoute ? "tables" : "overview");
    localStorage.setItem("lutho_admin_unlocked", "true");
    localStorage.setItem("lutho_active_staff_profile_id", matchedProfile.id);
    localStorage.setItem("lutho_app_mode", "STAFF");
    triggerToast(`Welcome back, ${matchedProfile.name}`, "success");
  };

  const handleOpenStaffTable = (tableId: string) => {
    playBeep(520, "sine", 0.06);
    setSelectedStaffTable(tableId);
    setActiveChatTableId(tableId);
    setStaffInspectorChatOpen(true);
    setStaffChatInput("");
    setStaffManualOrderOpen(false);
    setStaffManualOrderSearch("");
    setStaffManualOrderCart([]);
    setStaffManualOrderNotes("");
    setStaffMoveTarget("");
    setStaffCombineTables([]);
    if (String(tableId) === REMOTE_TABLE_ID) return;
    const service = tableServices[String(tableId)];
    if (
      tableWaiterAssignments[tableId] &&
      (!service || !service.active || service.covers <= 0)
    ) {
      window.setTimeout(() => {
        const covers = askForCovers(tableId, 1);
        if (covers === null) return;
        const waiterName = tableWaiterAssignments[tableId];
        const waiter = staffProfiles.find((profile) => profile.name === waiterName);
        void savePartyAcrossTables({
          partyId: service?.partyId || createPartyId(tableId),
          primaryTableId: service?.primaryTableId || tableId,
          memberTableIds: service?.memberTableIds || [tableId],
          covers,
          assignedStaffId: waiter?.id,
          assignedStaffName: waiterName,
          createdAt: service?.createdAt,
        }).then(() => {
          triggerToast(
            `${formatTableLabel(tableId)} set to ${covers} cover${covers === 1 ? "" : "s"}.`,
            "success"
          );
        });
      }, 150);
    }
  };

  const getActiveTableService = (tableId: string): TableServiceRecord | null => {
    const record = tableServices[String(tableId)];
    return record?.active ? record : null;
  };

  const askForCovers = (tableId: string, fallback = 1): number | null => {
    if (String(tableId) === REMOTE_TABLE_ID) return 0;
    const raw = window.prompt(
      `How many guests are seated across ${formatTableLabel(tableId)}?\n\n` +
        `LUTHO uses covers (not just table count) to balance the next assignment.`,
      String(Math.max(1, fallback))
    );
    if (raw === null) return null;
    const covers = Math.round(Number(raw));
    if (!Number.isFinite(covers) || covers < 1 || covers > 200) {
      triggerToast("Enter a guest count between 1 and 200.", "info");
      return null;
    }
    return covers;
  };

  const handleAssignTableWithCovers = async (tableId: string, waiterName: string) => {
    const isRemote = String(tableId) === REMOTE_TABLE_ID;
    const existing = getActiveTableService(tableId);
    if (!waiterName) {
      const nextAssignments = { ...tableWaiterAssignments };
      (existing?.memberTableIds || [tableId]).forEach((id) => delete nextAssignments[id]);
      await persistTableAssignments(nextAssignments);
      if (existing && !isRemote) {
        await Promise.all(
          existing.memberTableIds.map((id) =>
            upsertTableService({
              ...existing,
              tableId: id,
              assignedStaffId: undefined,
              assignedStaffName: undefined,
              updatedAt: Date.now(),
            })
          )
        );
      }
      triggerToast(`${formatTableLabel(tableId)} is now unassigned.`, "info");
      return;
    }

    const waiter = staffProfiles.find((profile) => profile.name === waiterName);

    // Remote ordering is not a physical seat — assign waiter only, never ask covers.
    if (isRemote) {
      await persistTableAssignments({ ...tableWaiterAssignments, [tableId]: waiterName });
      triggerToast(`${waiterName} assigned to Remote Ordering.`, "success");
      return;
    }

    const covers = askForCovers(tableId, existing?.covers || 1);
    if (covers === null) return;
    const partyId = existing?.partyId || createPartyId(tableId);
    const memberTableIds = (existing?.memberTableIds || [tableId]).filter(
      (id) => String(id) !== REMOTE_TABLE_ID
    );
    const primaryTableId = existing?.primaryTableId || tableId;

    await savePartyAcrossTables({
      partyId,
      primaryTableId,
      memberTableIds,
      covers,
      assignedStaffId: waiter?.id,
      assignedStaffName: waiterName,
      createdAt: existing?.createdAt,
    });

    const nextAssignments = { ...tableWaiterAssignments };
    memberTableIds.forEach((id) => {
      nextAssignments[id] = waiterName;
    });
    await persistTableAssignments(nextAssignments);
    setTablesState((prev) => {
      const next = { ...prev };
      memberTableIds.forEach((id) => {
        next[id] = "Occupied";
      });
      return next;
    });
    triggerToast(
      `${waiterName} assigned to ${formatTableLabel(primaryTableId)} • ${covers} cover${covers === 1 ? "" : "s"}.`,
      "success"
    );
  };

  const handleUpdateTableCovers = async (tableId: string) => {
    if (String(tableId) === REMOTE_TABLE_ID) {
      triggerToast("Remote Ordering does not use physical covers.", "info");
      return;
    }
    const existing = getActiveTableService(tableId);
    if (!existing) {
      triggerToast("Assign a waiter first to start this table service.", "info");
      return;
    }
    const covers = askForCovers(existing.primaryTableId, existing.covers || 1);
    if (covers === null) return;
    await savePartyAcrossTables({
      partyId: existing.partyId,
      primaryTableId: existing.primaryTableId,
      memberTableIds: existing.memberTableIds.filter((id) => String(id) !== REMOTE_TABLE_ID),
      covers,
      assignedStaffId: existing.assignedStaffId,
      assignedStaffName: existing.assignedStaffName,
      createdAt: existing.createdAt,
    });
    triggerToast(
      `${formatTableLabel(existing.primaryTableId)} updated to ${covers} cover${covers === 1 ? "" : "s"}.`,
      "success"
    );
  };

  const handleAddManualOrderItem = (item: MenuItem) => {
    setStaffManualOrderCart((prev) => {
      const existing = prev.find((entry) => entry.menuItem.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.menuItem.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const handleSubmitStaffManualOrder = async (tableId: string) => {
    if (staffManualOrderCart.length === 0) {
      triggerToast("Add at least one menu item.", "info");
      return;
    }

    let service = getActiveTableService(tableId);
    let waiterName =
      service?.assignedStaffName ||
      tableWaiterAssignments[tableId] ||
      activeStaffProfile?.name ||
      "General";
    const waiter = staffProfiles.find((profile) => profile.name === waiterName);

    if (!service) {
      const covers = askForCovers(tableId, 1);
      if (covers === null) return;
      const partyId = createPartyId(tableId);
      await savePartyAcrossTables({
        partyId,
        primaryTableId: tableId,
        memberTableIds: [tableId],
        covers,
        assignedStaffId: waiter?.id,
        assignedStaffName: waiterName,
      });
      await persistTableAssignments({ ...tableWaiterAssignments, [tableId]: waiterName });
      service = {
        tableId,
        partyId,
        primaryTableId: tableId,
        memberTableIds: [tableId],
        covers,
        assignedStaffId: waiter?.id,
        assignedStaffName: waiterName,
        active: true,
        needsCoverCount: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    } else if (service.covers <= 0) {
      const covers = askForCovers(service.primaryTableId, 1);
      if (covers === null) return;
      await savePartyAcrossTables({
        partyId: service.partyId,
        primaryTableId: service.primaryTableId,
        memberTableIds: service.memberTableIds,
        covers,
        assignedStaffId: service.assignedStaffId || waiter?.id,
        assignedStaffName: service.assignedStaffName || waiterName,
        createdAt: service.createdAt,
      });
      service = { ...service, covers, needsCoverCount: false };
    }

    if (!service.assignedStaffName) {
      await savePartyAcrossTables({
        partyId: service.partyId,
        primaryTableId: service.primaryTableId,
        memberTableIds: service.memberTableIds,
        covers: service.covers,
        assignedStaffId: waiter?.id,
        assignedStaffName: waiterName,
        createdAt: service.createdAt,
      });
      const nextAssignments = { ...tableWaiterAssignments };
      service.memberTableIds.forEach((id) => {
        nextAssignments[id] = waiterName;
      });
      await persistTableAssignments(nextAssignments);
      service = {
        ...service,
        assignedStaffId: waiter?.id,
        assignedStaffName: waiterName,
      };
    }

    waiterName = service.assignedStaffName || waiterName;
    const targetTableId = service.primaryTableId;
    const total = staffManualOrderCart.reduce(
      (sum, entry) => sum + entry.menuItem.price * entry.quantity,
      0
    );
    const prepSeconds = getOrderPrepSeconds(staffManualOrderCart);
    const order: HistoricOrder = {
      id: `staff-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
      items: staffManualOrderCart,
      total,
      status: "Sent",
      notes: staffManualOrderNotes.trim() || undefined,
      timerDuration: prepSeconds,
      timerRemaining: prepSeconds,
      timerExpired: false,
    };
    const record = buildStaffOrderRecord({
      order,
      tableId: targetTableId,
      physicalTableId: tableId,
      partyId: service.partyId,
      assignedStaffId: service.assignedStaffId || waiter?.id,
      assignedStaffName: waiterName,
      orderedBy: "Waiter-entered",
      orderSource: "STAFF",
      enteredByStaffId: activeStaffProfile?.id,
      enteredByStaffName: activeStaffProfile?.name,
    });

    await upsertSharedOrder(record);
    setSharedStaffOrders((prev) => [record, ...prev.filter((entry) => entry.id !== record.id)]);
    setIncomingOrders((prev) => [record, ...prev]);
    setTablesState((prev) => ({ ...prev, [targetTableId]: "Occupied" }));
    void setTableAlertFlag(targetTableId, true);
    setStaffManualOrderCart([]);
    setStaffManualOrderNotes("");
    setStaffManualOrderOpen(false);
    triggerToast(
      `Waiter order sent for ${formatTableLabel(targetTableId)} • R${total.toFixed(2)}.`,
      "success"
    );
  };

  const handleMoveCurrentTable = async (tableId: string) => {
    const source = getActiveTableService(tableId);
    const targetTableId = String(staffMoveTarget);
    if (!source) {
      triggerToast("Start/assign this table before moving it.", "info");
      return;
    }
    if (!targetTableId || source.memberTableIds.includes(targetTableId)) {
      triggerToast("Choose a different destination table.", "info");
      return;
    }
    if (getActiveTableService(targetTableId)) {
      triggerToast("Destination already has a party. Use Combine tables instead.", "info");
      return;
    }
    if (
      !window.confirm(
        `Move ${source.covers} cover${source.covers === 1 ? "" : "s"} from ` +
          `${formatTableLabel(source.primaryTableId)} to ${formatTableLabel(targetTableId)}?\n\n` +
          `Orders, requests, bill context and waiter ownership will move with them.`
      )
    ) {
      return;
    }

    const partyOrders = sharedStaffOrders.filter(
      (order) =>
        order.partyId === source.partyId ||
        source.memberTableIds.includes(String(order.tableId))
    );
    const partyRequests = serviceRequests.filter(
      (request) => source.memberTableIds.includes(String(request.tableId))
    );
    await moveTableParty({
      source,
      targetTableId,
      orderIds: partyOrders.map((order) => order.id),
      requestIds: partyRequests.map((request) => request.id),
    });

    const nextAssignments = { ...tableWaiterAssignments };
    source.memberTableIds.forEach((id) => delete nextAssignments[id]);
    if (source.assignedStaffName) nextAssignments[targetTableId] = source.assignedStaffName;
    await persistTableAssignments(nextAssignments);
    setTablesState((prev) => {
      const next = { ...prev, [targetTableId]: "Occupied" as const };
      source.memberTableIds.forEach((id) => {
        next[id] = "Available";
      });
      return next;
    });
    setChatMessages((prev) =>
      prev.map((message) =>
        source.memberTableIds.includes(String(message.tableId))
          ? { ...message, tableId: targetTableId }
          : message
      )
    );
    await persistTableAlerts({
      ...tableAlerts,
      ...Object.fromEntries(source.memberTableIds.map((id) => [id, false])),
      [targetTableId]: partyOrders.some((order) => order.status !== "Completed"),
    });
    setSelectedStaffTable(targetTableId);
    setStaffMoveTarget("");
    triggerToast(
      `Party moved to ${formatTableLabel(targetTableId)} with ${partyOrders.length} order${partyOrders.length === 1 ? "" : "s"}.`,
      "success"
    );
  };

  const handleCombineCurrentTables = async (tableId: string) => {
    const selected = Array.from(new Set([tableId, ...staffCombineTables].map(String)));
    if (selected.length < 2) {
      triggerToast("Choose at least one more physical table to combine.", "info");
      return;
    }
    if (selected.includes(REMOTE_TABLE_ID)) {
      triggerToast("Remote Ordering cannot be combined with dine-in tables.", "info");
      return;
    }

    const existingServices = selected
      .map((id) => getActiveTableService(id))
      .filter((record): record is TableServiceRecord => !!record);
    const allMembers = Array.from(
      new Set([
        ...selected,
        ...existingServices.flatMap((record) => record.memberTableIds),
      ])
    );
    const currentService = getActiveTableService(tableId);
    const defaultCovers = Math.max(
      1,
      existingServices
        .filter(
          (record, index, all) =>
            all.findIndex((entry) => entry.partyId === record.partyId) === index
        )
        .reduce((sum, record) => sum + Math.max(1, record.covers), 0)
    );
    const covers = askForCovers(tableId, defaultCovers);
    if (covers === null) return;

    const waiterName =
      currentService?.assignedStaffName ||
      tableWaiterAssignments[tableId] ||
      activeStaffProfile?.name ||
      "General";
    const waiter = staffProfiles.find((profile) => profile.name === waiterName);
    const partyId = currentService?.partyId || createPartyId(tableId);
    const relatedPartyIds = new Set(existingServices.map((record) => record.partyId));
    const partyOrders = sharedStaffOrders.filter(
      (order) =>
        (!!order.partyId && relatedPartyIds.has(order.partyId)) ||
        allMembers.includes(String(order.tableId))
    );
    const partyRequests = serviceRequests.filter((request) =>
      allMembers.includes(String(request.tableId))
    );

    if (
      !window.confirm(
        `Combine ${allMembers.map(formatTableShort).join(" + ")} as one party?\n\n` +
          `${covers} covers • Lead table ${formatTableLabel(tableId)} • ${waiterName}\n` +
          `Orders and bills from every member table will roll into the lead table.`
      )
    ) {
      return;
    }

    await combineTableParties({
      primaryTableId: tableId,
      memberTableIds: allMembers,
      partyId,
      covers,
      assignedStaffId: waiter?.id,
      assignedStaffName: waiterName,
      orderIds: partyOrders.map((order) => order.id),
      requestIds: partyRequests.map((request) => request.id),
    });

    const nextAssignments = { ...tableWaiterAssignments };
    allMembers.forEach((id) => {
      nextAssignments[id] = waiterName;
    });
    await persistTableAssignments(nextAssignments);
    const combinedAlert =
      allMembers.some((id) => !!tableAlerts[id]) ||
      partyOrders.some((order) => order.status !== "Completed");
    await persistTableAlerts({
      ...tableAlerts,
      ...Object.fromEntries(allMembers.map((id) => [id, combinedAlert])),
    });
    setTablesState((prev) => {
      const next = { ...prev };
      allMembers.forEach((id) => {
        next[id] = "Occupied";
      });
      return next;
    });
    setStaffCombineTables([]);
    triggerToast(
      `${allMembers.length} tables combined • ${covers} covers • ${waiterName}.`,
      "success"
    );
  };

  const handleSendStaffTableChat = () => {
    if (!selectedStaffTable || !staffChatInput.trim()) return;
    const newMsg = {
      id: `staff-${Date.now()}`,
      tableId: selectedStaffTable,
      sender: "Staff",
      text: staffChatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setChatMessages((prev) => appendChatMessage(prev, newMsg));
    setStaffChatInput("");
    playBeep(520, "sine", 0.05);
    triggerToast(`Message sent to ${formatTableLabel(selectedStaffTable)}`, "success");
  };

  const handleHostSplitSession = async () => {
    const name = currentPlayerName || sessionStorage.getItem("lutho_my_session_name") || "Guest";
    const session = createSplitSession(name, REMOTE_TABLE_ID);
    setRemoteSplitSession(session);
    setSplitQrStep("host");
    playBeep(520, "sine", 0.06);
    try {
      await upsertSplitSession(session);
      await upsertSplitBillItems({
        sessionId: session.id,
        tableId: session.tableId,
        hostName: session.hostName,
        members: session.members,
        items: [],
      });
    } catch (error) {
      console.error("[LUTHO] Failed to publish split session:", error);
    }
  };

  const handleJoinSplitSession = async () => {
    const sessionId = parseSplitIdFromValue(joinSplitInput);
    if (!sessionId) {
      triggerToast("Paste a valid split link or session code.", "info");
      return;
    }
    const name = currentPlayerName || sessionStorage.getItem("lutho_my_session_name") || "Guest";
    let session = joinSplitSession(sessionId, name);
    if (!session) {
      try {
        const remote = await fetchSplitSession(sessionId);
        if (remote) {
          const members = remote.members.includes(name) ? remote.members : [...remote.members, name];
          session = { ...remote, members };
          saveSplitSession(session);
        }
      } catch (error) {
        console.error("[LUTHO] Failed to fetch split session:", error);
      }
    }
    if (!session) {
      triggerToast("Split session not found. Ask your host to share their QR.", "info");
      return;
    }
    setRemoteSplitSession(session);
    setIsQrModalOpen(false);
    setSplitQrStep("choose");
    setJoinSplitInput("");
    playBeep(520, "sine", 0.06);
    triggerToast(`Joined split with ${session.hostName}`, "success");
    try {
      await upsertSplitSession(session);
    } catch (error) {
      console.error("[LUTHO] Failed to sync joined split:", error);
    }
  };

  const handleStaffLogin = () => {
    const selectedProfile = staffProfiles.find(profile => profile.id === selectedStaffProfileId);
    if (!selectedProfile) {
      setStaffAuthError("Select a staff profile first.");
      return;
    }

    if (selectedProfile.pin !== staffPinInput) {
      setStaffAuthError("Incorrect PIN.");
      playBeep(180, "sawtooth", 0.25);
      return;
    }

    setStaffAuthError("");
    setStaffPinInput("");
    setActiveStaffProfileId(selectedProfile.id);
    setShowStaffGate(false);
    setStaffLogoClicks(0);
    setIsAdminUnlocked(true);
    setAppMode("STAFF");
    setStaffWorkspace(onAdminKioskRoute ? "tables" : "overview");
    localStorage.setItem("lutho_admin_unlocked", "true");
    localStorage.setItem("lutho_app_mode", "STAFF");
    triggerToast(`Welcome back, ${selectedProfile.name}`, "success");
  };

  const handleStaffLogout = () => {
    setActiveStaffProfileId("");
    setIsAdminUnlocked(false);
    setShowStaffGate(false);
    setStaffLogoClicks(0);
    setAdminPinInput("");
    setStaffPinInput("");
    setAppMode("CUSTOMER");
    setStaffWorkspace("overview");
    localStorage.removeItem("lutho_admin_unlocked");
    localStorage.removeItem("lutho_active_staff_profile_id");
    localStorage.setItem("lutho_app_mode", "CUSTOMER");
  };

  // --- Staff profile creation + PIN validation helpers ---
  const normalizeStaffName = (name: string) => name.trim().replace(/\s+/g, " ");

  const normalizePin = (pin: string) => pin.trim().replace(/\s+/g, "");

  const isNumericPin = (pin: string) => /^\d{4,6}$/.test(pin);

  const isWeakStaffPin = (pin: string) => {
    // Weak if all digits are the same: 0000, 1111, etc.
    if (/^(\d)\1+$/.test(pin)) return true;

    const digits = pin.split("").map((d) => Number(d));

    // Weak if strictly sequential up or down (e.g. 1234, 4321, 23456)
    const isSequentialUp = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1);
    const isSequentialDown = digits.every((d, i) => i === 0 || d === digits[i - 1] - 1);
    if (isSequentialUp || isSequentialDown) return true;

    // Common weak values (kept explicit for clarity; covered by sequential/repeated rules too)
    const explicitlyBad = new Set(["1234", "12345", "54321", "0000", "1111"]);
    if (explicitlyBad.has(pin)) return true;

    return false;
  };

  const handleCreateStaffProfile = async () => {
    const normalizedName = normalizeStaffName(staffCreateName);
    const rawPin = normalizePin(staffCreatePin);
    const usingDefaultPin = !rawPin;
    const normalizedPin = usingDefaultPin ? DEFAULT_STAFF_PIN : rawPin;

    if (!normalizedName) {
      triggerToast("Enter a staff name.", "info");
      return;
    }

    if (!isNumericPin(normalizedPin)) {
      triggerToast("PIN must be 4 to 6 digits (numbers only).", "info");
      return;
    }

    if (!usingDefaultPin && isWeakStaffPin(normalizedPin)) {
      triggerToast("That PIN is too weak. Choose a less predictable PIN.", "info");
      return;
    }

    const normalizedLower = normalizedName.toLowerCase();
    const duplicateExists = staffProfiles.some(
      (p) => normalizeStaffName(p.name).toLowerCase() === normalizedLower
    );
    if (duplicateExists) {
      triggerToast("A staff profile with this name already exists.", "info");
      return;
    }

    // Basic guardrails for the app's own generated id.
    if (normalizedName.length < 2) {
      triggerToast("Name must be at least 2 characters.", "info");
      return;
    }

    // Regular staff by default — only admins explicitly choosing "Admin" get elevated.
    const role: StaffRole = staffCreateRole === "admin" ? "admin" : "general";

    const id = `staff-${normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;
    const payload: StaffProfile = {
      id,
      name: normalizedName,
      pin: normalizedPin,
      role,
      onShift: true,
      mustChangePin: true
    };

    try {
      await setDoc(doc(db, "staff_profiles", id), payload);
      setStaffCreateName("");
      setStaffCreatePin("");
      setStaffCreateRole("general");
      triggerToast(
        usingDefaultPin
          ? `Created ${payload.role} profile for ${payload.name} • Default PIN ${DEFAULT_STAFF_PIN} (they should change it)`
          : `Created ${payload.role} profile for ${payload.name}`,
        "success"
      );
    } catch (error) {
      console.error(error);
      triggerToast("Failed to create staff profile.", "info");
    }
  };

  const handleDeleteStaffProfile = async (profile: StaffProfile) => {
    if (profile.id === "admin-root") {
      triggerToast("The default General/admin profile can't be deleted.", "info");
      return;
    }
    if (!window.confirm(`Delete staff profile "${profile.name}"? This will archive their record and remove table assignments.`)) {
      return;
    }
    try {
      await archiveStaffProfile({ profile, archivedBy: activeStaffProfile?.name });
      await deleteDoc(doc(db, "staff_profiles", profile.id));

      if (activeStaffProfileId === profile.id) {
        handleStaffLogout();
      }

      const nextAssignments = { ...tableWaiterAssignments };
      let assignmentsChanged = false;
      Object.entries(nextAssignments).forEach(([tableId, waiterName]) => {
        if (waiterName === profile.name) {
          delete nextAssignments[tableId];
          assignmentsChanged = true;
        }
      });
      if (assignmentsChanged) {
        await persistTableAssignments(nextAssignments);
      }

      triggerToast(`Removed ${profile.name} from staff.`, "success");
    } catch (error) {
      console.error(error);
      triggerToast("Failed to delete staff profile.", "info");
    }
  };

  const handleResetOwnPin = async () => {
    if (!activeStaffProfile) return;
    if (activeStaffProfile.pin !== staffResetCurrentPin) {
      triggerToast("Current PIN is incorrect.", "info");
      return;
    }

    const normalizedNewPin = normalizePin(staffResetNewPin);

    if (!isNumericPin(normalizedNewPin)) {
      triggerToast("New PIN must be 4 to 6 digits (numbers only).", "info");
      return;
    }

    if (isWeakStaffPin(normalizedNewPin)) {
      triggerToast("That new PIN is too weak. Choose a less predictable PIN.", "info");
      return;
    }

    if (normalizedNewPin === activeStaffProfile.pin) {
      triggerToast("New PIN must be different from your current PIN.", "info");
      return;
    }

    try {
      await updateDoc(doc(db, "staff_profiles", activeStaffProfile.id), {
        pin: normalizedNewPin,
        mustChangePin: false
      });
      setStaffResetCurrentPin("");
      setStaffResetNewPin("");
      triggerToast("PIN updated successfully.", "success");
    } catch (error) {
      console.error(error);
      triggerToast("Unable to update PIN.", "info");
    }
  };

  const handleToggleStaffShift = async (profile: StaffProfile) => {
    try {
      await updateDoc(doc(db, "staff_profiles", profile.id), {
        onShift: !profile.onShift
      });
    } catch (error) {
      console.error(error);
      triggerToast("Failed to update shift state.", "info");
    }
  };

  const [currentPlayerName, setCurrentPlayerName] = useState<string>(() => {
    const cached = localStorage.getItem("lutho_current_player_name") || sessionStorage.getItem("lutho_my_session_name");
    return cached || "";
  });

  // Challenges stopwatch states
  const [activeStopwatchChallenge, setActiveStopwatchChallenge] = useState<string | null>(null);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [challengesLeaderboard, setChallengesLeaderboard] = useState<{ name: string; table: string; challenge: string; duration: string; rank: number }[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_leaderboard");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Staff Menu Item addition form states
  const [staffMenuAddName, setStaffMenuAddName] = useState("");
  const [staffMenuAddPrice, setStaffMenuAddPrice] = useState("");
  const [staffMenuAddCategory, setStaffMenuAddCategory] = useState<"EAT" | "DRINK">("EAT");
  const [staffMenuAddEmoji, setStaffMenuAddEmoji] = useState("🍔");
  const [staffMenuAddImage, setStaffMenuAddImage] = useState("");
  const [staffMenuAddDesc, setStaffMenuAddDesc] = useState("");
  const [staffMenuAddBadge, setStaffMenuAddBadge] = useState("");
  const [staffMenuAddIsSpecial, setStaffMenuAddIsSpecial] = useState(false);
  const [staffMenuAddSectionName, setStaffMenuAddSectionName] = useState("");
  const [staffMenuAddSubsectionName, setStaffMenuAddSubsectionName] = useState("");
  const [staffMenuAddPriceText, setStaffMenuAddPriceText] = useState("");
  const [editingMenuItemId, setEditingMenuItemId] = useState<string | null>(null);
  const [staffMenuSearchQuery, setStaffMenuSearchQuery] = useState("");

  // Storage synchronization effect hooks
  useEffect(() => {
    localStorage.setItem("lutho_menu_items_v4", JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem("lutho_favorites", JSON.stringify(favoritedIds));
  }, [favoritedIds]);

  useEffect(() => {
    localStorage.setItem("lutho_leaderboard", JSON.stringify(challengesLeaderboard));
  }, [challengesLeaderboard]);

  // Stopwatch ticking clock interval
  useEffect(() => {
    let intervalID: any;
    if (isStopwatchRunning) {
      intervalID = setInterval(() => {
        setStopwatchSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(intervalID);
  }, [isStopwatchRunning]);

  // Burger catcher core animation loop
  useEffect(() => {
    if (!isBurgerPlaying || activeGameTab !== "ARCADE" || !isGamesModalOpen) return;

    const interval = setInterval(() => {
      setFallingIngredients(prev => {
        const updated = prev.map(ing => ({ ...ing, y: ing.y + ing.speed }));

        // Collision box test: Bun is at Y=85, X inside [burgerPosition - 25, burgerPosition + 25]
        const caught = updated.filter(ing => ing.y >= 82 && ing.y <= 90 && Math.abs(ing.x - burgerPosition) < 28);

        if (caught.length > 0) {
          caught.forEach(ing => {
            if (ing.isBad) {
              setBurgerCatcherLives(l => {
                if (l <= 1) {
                  setIsBurgerPlaying(false);
                  triggerToast("💀 Asteroids overrun Table 12! Game Over!", "info");
                }
                return l - 1;
              });
              playBeep(220, "sawtooth", 0.15);
            } else {
              setBurgerCatcherScore(s => s + 10);
              playBeep(650, "sine", 0.05);
            }
          });
        }

        return updated.filter(ing => ing.y < 95 && !(ing.y >= 82 && Math.abs(ing.x - burgerPosition) < 28));
      });
    }, 70);

    return () => clearInterval(interval);
  }, [isBurgerPlaying, activeGameTab, isGamesModalOpen, burgerPosition]);

  // Continuous smooth touch-and-hold burger position updates
  useEffect(() => {
    if (!isBurgerPlaying || !isGamesModalOpen) {
      if (isPressingLeft) setIsPressingLeft(false);
      if (isPressingRight) setIsPressingRight(false);
      return;
    }
    if (!isPressingLeft && !isPressingRight) return;

    const interval = setInterval(() => {
      setBurgerPosition(p => {
        if (isPressingLeft) {
          return Math.max(15, p - 14);
        }
        if (isPressingRight) {
          return Math.min(345, p + 14);
        }
        return p;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isBurgerPlaying, isGamesModalOpen, isPressingLeft, isPressingRight]);

  // Falling toppings random spawn generator
  useEffect(() => {
    if (!isBurgerPlaying || activeGameTab !== "ARCADE" || !isGamesModalOpen) return;

    const interval = setInterval(() => {
      const selections = [
        { emoji: "🍔", isBad: false },
        { emoji: "🍔", isBad: false },
        { emoji: "🍔", isBad: false },
        { emoji: "🍔", isBad: false },
        { emoji: "🍔", isBad: false },
        { emoji: "🍔", isBad: false },
      ];
      const drawn = selections[Math.floor(Math.random() * selections.length)];
      const spawned = {
        id: Date.now() + Math.random(),
        x: Math.random() * 320 + 20,
        y: 0,
        emoji: drawn.emoji,
        speed: 2.2 + Math.random() * 2.8,
        isBad: drawn.isBad
      };
      setFallingIngredients(prev => [...prev, spawned]);
    }, 1050);

    return () => clearInterval(interval);
  }, [isBurgerPlaying, activeGameTab, isGamesModalOpen]);

  // --- CHILI CHEEZE BOMB DEFUSER GAME LOOPS ---
  // Loop 1: Core Fuse Tick (50ms interval)
  useEffect(() => {
    if (!isDefuserPlaying || !isGamesModalOpen || activeGameTab !== "ARCADE") return;

    const interval = setInterval(() => {
      // Speed multiplier increases as score rises to make it crazy challenging!
      const speedFactor = 1 + (defuserScore / 110);
      const decayAmount = 2.4 * speedFactor;

      setDefuserGrid(prev => {
        let lifeLost = false;
        let scoreBonus = 0;
        let notifyType: "CHEESE" | "CHILI" | null = null;

        const updated = prev.map(cell => {
          if (!cell.active) return cell;

          const nextFuse = cell.fuse - decayAmount;
          if (nextFuse <= 0) {
            // Fuse burned down!
            if (cell.type === "CHEESE") {
              lifeLost = true;
              notifyType = "CHEESE";
            } else if (cell.type === "CHILI") {
              // Successfully ignored red chili bomb!
              scoreBonus += 15;
              notifyType = "CHILI";
            }
            return { ...cell, active: false, fuse: 100 };
          }
          return { ...cell, fuse: nextFuse };
        });

        if (lifeLost) {
          setDefuserLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) {
              // Game Over! Lock score and handle leaderboard check
              setIsDefuserPlaying(false);
              playBeep(120, "sawtooth", 0.45);
              triggerToast("💀 Grid Overload! Game Over!", "info");
              
              setDefuserHighScore(currentHigh => {
                if (defuserScore > currentHigh) {
                  localStorage.setItem("lutho_defuser_highscore", defuserScore.toString());
                  return defuserScore;
                }
                return currentHigh;
              });

              // Check if score qualifies for leaderboard
              const lowestLeaderboardScore = defuserLeaderboard.length >= 5 
                ? Math.min(...defuserLeaderboard.map(e => e.score))
                : 0;
              if (defuserScore > lowestLeaderboardScore || defuserLeaderboard.length < 5) {
                setShowLeaderboardSubmit(true);
              }
            } else {
              playBeep(180, "sawtooth", 0.15);
              setDefuserScreenshake(true);
              setTimeout(() => setDefuserScreenshake(false), 200);
            }
            return Math.max(0, nextL);
          });
        }

        if (scoreBonus > 0) {
          setDefuserScore(s => s + scoreBonus);
          playBeep(720, "sine", 0.04);
          if (notifyType === "CHILI") {
            triggerToast("🔥 Chili safely decayed (+15 pts)!", "success");
          }
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isDefuserPlaying, isGamesModalOpen, activeGameTab, defuserScore, defuserLeaderboard]);

  // Loop 2: Grid Spawner (Decides when to ignite/activate plates)
  useEffect(() => {
    if (!isDefuserPlaying || !isGamesModalOpen || activeGameTab !== "ARCADE" || defuserLives <= 0) return;

    // Tick speed scales up as score rises!
    const spawnIntervalDuration = Math.max(380, 850 - (defuserScore * 2.5));

    const interval = setInterval(() => {
      setDefuserGrid(prev => {
        // Find inactive indexes
        const inactiveIndices = prev.filter(c => !c.active).map(c => c.id);
        if (inactiveIndices.length === 0) return prev;

        // Choose random inactive cell
        const randomIdx = inactiveIndices[Math.floor(Math.random() * inactiveIndices.length)];
        
        // Pick type: CHEESE (65% chance), CHILI (25% chance), GOLD (10% chance)
        const randType = Math.random();
        let chosenType: "CHEESE" | "CHILI" | "GOLD" = "CHEESE";
        if (randType > 0.90) {
          chosenType = "GOLD";
        } else if (randType > 0.65) {
          chosenType = "CHILI";
        }

        const nextGrid = [...prev];
        nextGrid[randomIdx] = {
          id: randomIdx,
          type: chosenType,
          fuse: 100,
          active: true
        };

        // play spark beep
        playBeep(chosenType === "GOLD" ? 950 : chosenType === "CHILI" ? 380 : 540, "sine", 0.03);

        return nextGrid;
      });
    }, spawnIntervalDuration);

    return () => clearInterval(interval);
  }, [isDefuserPlaying, isGamesModalOpen, activeGameTab, defuserScore, defuserLives]);

  // --- THUNEE CARD GAME CORE LOGIC ENGINE ---
  const THUNEE_CARD_POINTS: Record<string, number> = {
    "J": 30,
    "9": 20,
    "A": 11,
    "10": 10,
    "K": 3,
    "Q": 2
  };

  const THUNEE_RANK_ORDER = ["J", "9", "A", "10", "K", "Q"];

  // Relative seat labeling based on current user's seat position
  const getRelativeSeatLabel = (seatIdx: number, mySeat: number) => {
    const diff = (seatIdx - mySeat + 4) % 4;
    if (diff === 0) return "You";
    if (diff === 1) return "Left";
    if (diff === 2) return "Partner";
    return "Right";
  };

  // Synchronize absolute coordinates automatically into backward-compatible views
  useEffect(() => {
    const myIdx = thuneeSeats.indexOf(currentPlayerName) >= 0 ? thuneeSeats.indexOf(currentPlayerName) : 0;
    
    // Sync thuneePlayedCards
    const mappedPlayed = thuneePlayedCardsNew.map(p => ({
      player: getRelativeSeatLabel(p.playerIndex, myIdx),
      card: p.card
    }));
    setThuneePlayedCards(mappedPlayed);

    // Sync thuneeAllCards
    const mappedAll: Record<string, any[]> = {};
    Object.keys(thuneeAllCardsNew).forEach(key => {
      const idx = parseInt(key);
      const label = getRelativeSeatLabel(idx, myIdx);
      mappedAll[label] = thuneeAllCardsNew[key];
    });
    setThuneeAllCards(mappedAll);

    // Sync thuneeCurrentTurn relative label
    if (thuneeCurrentTurnIndex === null) {
      setThuneeCurrentTurn(null);
    } else {
      setThuneeCurrentTurn(getRelativeSeatLabel(thuneeCurrentTurnIndex, myIdx) as any);
    }
  }, [thuneePlayedCardsNew, thuneeAllCardsNew, thuneeCurrentTurnIndex, thuneeSeats, currentPlayerName]);

  // Comprehensive update helper which coordinates both AI-local and Multiplayer states
  const updateThuneeGame = (update: {
    mode?: "AI" | "MULTIPLAYER" | null;
    seats?: (string | null)[];
    stage?: "DEAL" | "TRUMP_SELECTION" | "PLAY" | "ROUND_OVER" | "GAME_OVER";
    trumpSuit?: "HEARTS" | "DIAMONDS" | "CLUBS" | "SPADES" | null;
    currentTurn?: number | null;
    playedCards?: { playerIndex: number; name: string; card: any }[];
    gameScores?: { ourTeam: number; enemyTeam: number };
    roundScores?: { ourTeam: number; enemyTeam: number };
    tricksWon?: { ourTeam: number; enemyTeam: number };
    allCards?: Record<string, any[]>;
    statusText?: string;
    caller?: string | null;
    callThuneeFlag?: boolean;
    host?: string;
  }) => {
    if (update.mode !== undefined) setThuneeGameMode(update.mode);
    if (update.seats !== undefined) setThuneeSeats(update.seats);
    if (update.stage !== undefined) setThuneeStage(update.stage);
    if (update.trumpSuit !== undefined) setThuneeTrumpSuit(update.trumpSuit);
    if (update.currentTurn !== undefined) setThuneeCurrentTurnIndex(update.currentTurn);
    if (update.playedCards !== undefined) setThuneePlayedCardsNew(update.playedCards);
    if (update.gameScores !== undefined) setThuneeGameScores(update.gameScores);
    if (update.roundScores !== undefined) setThuneeRoundScores(update.roundScores);
    if (update.tricksWon !== undefined) setThuneeTricksWon(update.tricksWon);
    if (update.allCards !== undefined) setThuneeAllCardsNew(update.allCards);
    if (update.statusText !== undefined) setThuneeGameStatusText(update.statusText);
    if (update.caller !== undefined) setThuneeThuneeCaller(update.caller);
    if (update.callThuneeFlag !== undefined) setThuneeCallThunee(update.callThuneeFlag);
    if (update.host !== undefined) setThuneeHostName(update.host);

    const activeMode = update.mode !== undefined ? update.mode : thuneeGameMode;
    if (activeMode === "MULTIPLAYER") {
      const stateObj = {
        mode: activeMode,
        seats: update.seats !== undefined ? update.seats : thuneeSeats,
        stage: update.stage !== undefined ? update.stage : thuneeStage,
        trumpSuit: update.trumpSuit !== undefined ? update.trumpSuit : thuneeTrumpSuit,
        currentTurn: update.currentTurn !== undefined ? update.currentTurn : thuneeCurrentTurnIndex,
        playedCards: update.playedCards !== undefined ? update.playedCards : thuneePlayedCardsNew,
        gameScores: update.gameScores !== undefined ? update.gameScores : thuneeGameScores,
        roundScores: update.roundScores !== undefined ? update.roundScores : thuneeRoundScores,
        tricksWon: update.tricksWon !== undefined ? update.tricksWon : thuneeTricksWon,
        allCards: update.allCards !== undefined ? update.allCards : thuneeAllCardsNew,
        statusText: update.statusText !== undefined ? update.statusText : thuneeGameStatusText,
        caller: update.caller !== undefined ? update.caller : thuneeThuneeCaller,
        callThuneeFlag: update.callThuneeFlag !== undefined ? update.callThuneeFlag : thuneeCallThunee,
        host: update.host !== undefined ? update.host : thuneeHostName || currentPlayerName,
        lastUpdated: Date.now()
      };
      localStorage.setItem("lutho_thunee_room_" + currentTableId, JSON.stringify(stateObj));
      if (currentTableId) {
        setDoc(doc(db, "thunee_rooms", currentTableId), stateObj).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `thunee_rooms/${currentTableId}`);
        });
      }
    }
  };

  const determineThuneeTrickWinner = (
    playedCards: { playerIndex: number; name: string; card: any }[],
    trumpSuit: "HEARTS" | "DIAMONDS" | "CLUBS" | "SPADES" | null
  ) => {
    if (playedCards.length === 0) return null;
    
    const leadCard = playedCards[0].card;
    const leadSuit = leadCard.suit;
    
    let winningIndex = 0;
    let winningCard = leadCard;
    
    for (let i = 1; i < playedCards.length; i++) {
      const currentCard = playedCards[i].card;
      let currentBeatsWinning = false;
      
      if (trumpSuit && currentCard.suit === trumpSuit && winningCard.suit !== trumpSuit) {
        currentBeatsWinning = true;
      } else if (currentCard.suit === winningCard.suit) {
        const currentRankIdx = THUNEE_RANK_ORDER.indexOf(currentCard.rank);
        const winningRankIdx = THUNEE_RANK_ORDER.indexOf(winningCard.rank);
        if (currentRankIdx < winningRankIdx) {
          currentBeatsWinning = true;
        }
      }
      
      if (currentBeatsWinning) {
        winningIndex = i;
        winningCard = currentCard;
      }
    }
    
    return playedCards[winningIndex];
  };

  const handleNicknameChange = (newName: string) => {
    if (!newName) return;
    const oldName = currentPlayerName;
    setCurrentPlayerName(newName);
    localStorage.setItem("lutho_current_player_name", newName);
    sessionStorage.setItem("lutho_my_session_name", newName);

    // If seated at any thunee desk, update seat
    if (thuneeSeats.includes(oldName)) {
      const nextSeats = thuneeSeats.map(s => s === oldName ? newName : s);
      const nextHost = thuneeHostName === oldName ? newName : thuneeHostName;
      updateThuneeGame({
        seats: nextSeats,
        host: nextHost,
        statusText: `Nickname updated from ${oldName} to ${newName}`
      });
    }
  };

  const getThuneeCoachAdviceMessage = () => {
    if (thuneeStage !== "PLAY") {
      return {
        text: "Please deal cards and start the round first! We need to analyze hands in progress.",
        recoCard: null
      };
    }
    const myIdx = thuneeSeats.indexOf(currentPlayerName) >= 0 ? thuneeSeats.indexOf(currentPlayerName) : 0;
    if (thuneeCurrentTurnIndex !== myIdx) {
      return {
        text: "Sit tight, standard procedure! Wait for opponents to throw their card before you calculate your next move.",
        recoCard: null
      };
    }
    const myHand = thuneeHand;
    if (myHand.length === 0) {
      return {
        text: "Your current hand has no cards left! Sit back and let the scores calculate.",
        recoCard: null
      };
    }

    let playableCards = [...myHand];
    let reason = "You have the lead on this trick! You can throw any card. Throwing a Jack or Nine is high-tier to draw opponent trumps.";
    
    if (thuneePlayedCardsNew.length > 0) {
      const leadCard = thuneePlayedCardsNew[0].card;
      const leadSuit = leadCard.suit;
      const sameSuitCards = myHand.filter(c => c.suit === leadSuit);
      if (sameSuitCards.length > 0) {
        playableCards = sameSuitCards;
        reason = `You must follow suit! Play a ${leadSuit.toLowerCase()} card from your hand.`;
      } else {
        const trumps = myHand.filter(c => c.suit === thuneeTrumpSuit);
        if (trumps.length > 0) {
          playableCards = trumps;
          reason = `No ${leadSuit.toLowerCase()} card in your hand! You can CUT the points with a Trump card (${thuneeTrumpSuit}), or throw anything to discard!`;
        } else {
          reason = `No ${leadSuit.toLowerCase()} or Trump cards in your hand! Throw a low point card to discard safely.`;
        }
      }
    }

    const sorted = [...playableCards].sort((a, b) => b.points - a.points);
    const recommended = sorted[0];

    return {
      text: `Coach Grill Boss says: Play the **${recommended.rank} of ${recommended.suit}** (${recommended.points} pts).\n\nReason: ${reason}`,
      recoCard: recommended
    };
  };

  const triggerLobbyBackfill = () => {
    playBeep(550, "sine", 0.08);
    const nextSeats = [...thuneeSeats];
    const botNames = ["🤖 South Diner", "🧑‍🍳 Grill Boss Bot", "⚔️ Supa Smash Bot", "🍗 Wing Ranger Bot"];
    for (let i = 0; i < 4; i++) {
      if (!nextSeats[i]) {
        nextSeats[i] = botNames[i];
      }
    }
    updateThuneeGame({
      seats: nextSeats,
      statusText: "Host filled empty seats with calibrated restaurant bots! Ready to clash!"
    });
    triggerToast("Vacant seats backfilled with Bots!", "success");
  };

  const triggerLobbyReset = () => {
    playBeep(440, "sine", 0.08);
    const nextSeats = [currentPlayerName, null, null, null];
    updateThuneeGame({
      mode: "MULTIPLAYER",
      seats: nextSeats,
      stage: "DEAL",
      trumpSuit: null,
      currentTurn: null,
      playedCards: [],
      gameScores: { ourTeam: 0, enemyTeam: 0 },
      roundScores: { ourTeam: 0, enemyTeam: 0 },
      tricksWon: { ourTeam: 0, enemyTeam: 0 },
      allCards: {},
      statusText: `${currentPlayerName} reset the table lobby! Join a seat!`,
      caller: null,
      callThuneeFlag: false,
      host: currentPlayerName
    });
    triggerToast("Multiplayer Table Lobby has been reset!", "success");
  };

  const startThuneeRound = () => {
    const ranks = ["J", "9", "A", "10", "K", "Q"];
    const suits = ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"] as const;
    const deck: any[] = [];
    
    let count = 0;
    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        deck.push({
          id: `card-${suit}-${rank}-${count++}`,
          rank,
          suit,
          points: THUNEE_CARD_POINTS[rank]
        });
      });
    });
    
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    const hands: Record<string, any[]> = { "0": [], "1": [], "2": [], "3": [] };
    
    for (let i = 0; i < 4; i++) {
      hands[i.toString()] = shuffled.slice(i * 4, (i + 1) * 4);
    }
    
    const remainingDeck = shuffled.slice(16);
    hands["Remaining"] = remainingDeck;

    // First Lead defaults to the Dealer (absolute Seat 0 / Host)
    const myIdx = thuneeSeats.indexOf(currentPlayerName) >= 0 ? thuneeSeats.indexOf(currentPlayerName) : 0;
    const activeLeadSeat = myIdx;

    updateThuneeGame({
      stage: "TRUMP_SELECTION",
      trumpSuit: null,
      currentTurn: activeLeadSeat,
      playedCards: [],
      tricksWon: { ourTeam: 0, enemyTeam: 0 },
      roundScores: { ourTeam: 0, enemyTeam: 0 },
      allCards: hands,
      callThuneeFlag: false,
      caller: null,
      statusText: `${thuneeSeats[activeLeadSeat] || "Leader"} must nominate Trump suit! Tap your chosen suit below.`
    });
    
    // Set my hand specifically
    setThuneeHand(hands[myIdx.toString()] || []);
    playBeep(650, "sine", 0.1);
  };

  const finalDealThunee = (selectedSuit: "HEARTS" | "DIAMONDS" | "CLUBS" | "SPADES") => {
    playBeep(700, "sine", 0.1);
    
    const remaining = thuneeAllCardsNew["Remaining"] || [];
    const updatedCards = { ...thuneeAllCardsNew };
    
    for (let i = 0; i < 4; i++) {
      const extra = remaining.slice(i * 2, (i + 1) * 2);
      updatedCards[i.toString()] = [...(updatedCards[i.toString()] || []), ...extra];
    }
    
    delete updatedCards["Remaining"];

    const myIdx = thuneeSeats.indexOf(currentPlayerName) >= 0 ? thuneeSeats.indexOf(currentPlayerName) : 0;
    setThuneeHand(updatedCards[myIdx.toString()] || []);

    const leaderIdx = myIdx; // Nomineer leads the first trick
    const suitSymbol = selectedSuit === "HEARTS" ? "♥️" : selectedSuit === "DIAMONDS" ? "♦️" : selectedSuit === "CLUBS" ? "♣️" : "♠️";

    updateThuneeGame({
      trumpSuit: selectedSuit,
      allCards: updatedCards,
      stage: "PLAY",
      currentTurn: leaderIdx,
      statusText: `Trump is set to ${suitSymbol} ${selectedSuit}! Trick #1: ${thuneeSeats[leaderIdx]}'s turn to lead.`
    });
  };

  const makeAiThuneeMove = (aiSeatIdx: number, currentPlayed: { playerIndex: number; name: string; card: any }[]) => {
    const hand = thuneeAllCardsNew[aiSeatIdx.toString()] || [];
    if (hand.length === 0) return;
    
    let playableCards = [...hand];
    
    if (currentPlayed.length > 0) {
      const leadCard = currentPlayed[0].card;
      const leadSuit = leadCard.suit;
      const sameSuitCards = hand.filter(c => c.suit === leadSuit);
      if (sameSuitCards.length > 0) {
        playableCards = sameSuitCards;
      }
    }
    
    let chosenCard = playableCards[0];
    if (currentPlayed.length === 0) {
      const hasJackOrNine = playableCards.filter(c => c.rank === "J" || c.rank === "9");
      if (hasJackOrNine.length > 0 && Math.random() < 0.6) {
        chosenCard = hasJackOrNine[0];
      } else {
        const hasLow = playableCards.filter(c => c.rank === "Q" || c.rank === "K");
        if (hasLow.length > 0) {
          chosenCard = hasLow[hasLow.length - 1];
        } else {
          chosenCard = playableCards[Math.floor(Math.random() * playableCards.length)];
        }
      }
    } else {
      const leadCard = currentPlayed[0].card;
      const sameSuitCards = hand.filter(c => c.suit === leadCard.suit);
      
      if (sameSuitCards.length > 0) {
        sameSuitCards.sort((a, b) => THUNEE_RANK_ORDER.indexOf(a.rank) - THUNEE_RANK_ORDER.indexOf(b.rank));
        chosenCard = sameSuitCards[0];
      } else {
        const trumps = hand.filter(c => c.suit === thuneeTrumpSuit);
        if (trumps.length > 0) {
          trumps.sort((a, b) => THUNEE_RANK_ORDER.indexOf(a.rank) - THUNEE_RANK_ORDER.indexOf(b.rank));
          chosenCard = trumps[0];
        } else {
          const lowCards = [...playableCards].sort((a, b) => b.points - a.points);
          chosenCard = lowCards[0] || playableCards[0];
        }
      }
    }
    
    const updatedPlayed = [...currentPlayed, { playerIndex: aiSeatIdx, name: thuneeSeats[aiSeatIdx] || `BOT ${aiSeatIdx}`, card: chosenCard }];
    const remainingHand = hand.filter(c => c.id !== chosenCard.id);
    
    const nextTurnIdx = (aiSeatIdx + 1) % 4;
    const finalAllCards = {
      ...thuneeAllCardsNew,
      [aiSeatIdx.toString()]: remainingHand
    };

    playBeep(480, "triangle", 0.05);

    if (updatedPlayed.length === 4) {
      updateThuneeGame({
        allCards: finalAllCards,
        playedCards: updatedPlayed,
        currentTurn: null,
        statusText: "Trick complete! Tap Collect Trick."
      });
    } else {
      updateThuneeGame({
        allCards: finalAllCards,
        playedCards: updatedPlayed,
        currentTurn: nextTurnIdx,
        statusText: `${thuneeSeats[nextTurnIdx]}'s turn to play...`
      });
    }
  };

  const collectThuneeTrick = () => {
    if (thuneePlayedCardsNew.length < 4) return;
    
    const winnerBundle = determineThuneeTrickWinner(thuneePlayedCardsNew, thuneeTrumpSuit);
    if (!winnerBundle) return;
    
    const winnerIdx = winnerBundle.playerIndex;
    const winnerName = winnerBundle.name;
    
    // Team 0 consists of South (0) and North (2). Team 1 consists of West (1) and East (3)
    const isOurTeamWinner = winnerIdx === 0 || winnerIdx === 2;
    const trickPoints = thuneePlayedCardsNew.reduce((sum, item) => sum + item.card.points, 0);
    
    const updatedTricksWon = {
      ourTeam: thuneeTricksWon.ourTeam + (isOurTeamWinner ? 1 : 0),
      enemyTeam: thuneeTricksWon.enemyTeam + (isOurTeamWinner ? 0 : 1)
    };

    const updatedRoundScores = {
      ourTeam: thuneeRoundScores.ourTeam + (isOurTeamWinner ? trickPoints : 0),
      enemyTeam: thuneeRoundScores.enemyTeam + (isOurTeamWinner ? 0 : trickPoints)
    };

    triggerToast(`🏆 ${winnerName} won the trick! (+${trickPoints} Pts)`, "success");
    playBeep(840, "sine", 0.08);
    
    const myIdx = thuneeSeats.indexOf(currentPlayerName) >= 0 ? thuneeSeats.indexOf(currentPlayerName) : 0;
    const cardsLeft = (thuneeAllCardsNew[myIdx.toString()] || []).length;
    const roundIsOver = cardsLeft === 0;
    
    if (roundIsOver) {
      updateThuneeGame({
        tricksWon: updatedTricksWon,
        roundScores: updatedRoundScores,
        stage: "ROUND_OVER",
        currentTurn: null,
        statusText: "Round complete! All tricks finished. Tap Resolve Board."
      });
    } else {
      updateThuneeGame({
        tricksWon: updatedTricksWon,
        roundScores: updatedRoundScores,
        playedCards: [],
        currentTurn: winnerIdx,
        statusText: `${winnerName} won the trick and leads this round!`
      });
    }
  };

  const resolveThuneeRound = () => {
    let ourGamePointsGained = 0;
    let enemyGamePointsGained = 0;
    let reason = "";
    
    if (thuneeCallThunee) {
      const isOurTeamCaller = thuneeThuneeCaller === thuneeSeats[0] || thuneeThuneeCaller === thuneeSeats[2];
      if (isOurTeamCaller) {
        const weWonAll = thuneeTricksWon.ourTeam === 6;
        if (weWonAll) {
          ourGamePointsGained = 4;
          reason = `SENSATIONAL! ${thuneeThuneeCaller} called THUNEE & swept all 6 tricks! +4 Match points!`;
        } else {
          enemyGamePointsGained = 4;
          reason = `BUSTED! Your team called THUNEE but lost a trick! Opponents score +4 Match points!`;
        }
      } else {
        const enemyWonAll = thuneeTricksWon.enemyTeam === 6;
        if (enemyWonAll) {
          enemyGamePointsGained = 4;
          reason = `DAMN! Opponent called THUNEE & scored a clean sweep! They score +4 Match points!`;
        } else {
          ourGamePointsGained = 4;
          reason = `CAUGHT OUT! Opponent called THUNEE but your team intercepted a trick! You score +4 Match points!`;
        }
      }
    } else {
      if (thuneeRoundScores.ourTeam >= 151) {
        if (thuneeTricksWon.ourTeam === 6) {
          ourGamePointsGained = 2;
          reason = `🚨 KANSEE SWEEP! Your team won all 6 tricks. +2 game points!`;
        } else {
          ourGamePointsGained = 1;
          reason = `VICTORY! Your team secured majority points (${thuneeRoundScores.ourTeam} vs ${thuneeRoundScores.enemyTeam}). +1 game point!`;
        }
      } else {
        enemyGamePointsGained = 2;
        reason = `CAUGHT OUT! Your team failed to hit 151 points (${thuneeRoundScores.ourTeam}/304). Opponents get +2 game points!`;
      }
    }
    
    const updatedScores = {
      ourTeam: thuneeGameScores.ourTeam + ourGamePointsGained,
      enemyTeam: thuneeGameScores.enemyTeam + enemyGamePointsGained
    };
    
    const targetToWin = 4;
    if (updatedScores.ourTeam >= targetToWin) {
      updateThuneeGame({
        gameScores: updatedScores,
        stage: "GAME_OVER",
        statusText: "🏆 GRAND MATCH OVER! YOUR TEAM IS THE ULTIMATE DURBAN THUNEE CHAMPS!"
      });
      playBeep(980, "sine", 0.2);
    } else if (updatedScores.enemyTeam >= targetToWin) {
      updateThuneeGame({
        gameScores: updatedScores,
        stage: "GAME_OVER",
        statusText: "🏆 GRAND MATCH OVER! YOUR TEAM IS THE ULTIMATE DURBAN THUNEE CHAMPS!"
      });
      playBeep(140, "sawtooth", 0.25);
    } else {
      updateThuneeGame({
        gameScores: updatedScores,
        stage: "DEAL",
        statusText: reason + " Tap Deal for the next round!"
      });
    }
  };

  const handleUserPlayThuneeCard = (card: any) => {
    const myIdx = thuneeSeats.indexOf(currentPlayerName) >= 0 ? thuneeSeats.indexOf(currentPlayerName) : 0;
    if (thuneeStage !== "PLAY" || thuneeCurrentTurnIndex !== myIdx) return;
    
    // Check follow suit
    if (thuneePlayedCardsNew.length > 0) {
      const leadCard = thuneePlayedCardsNew[0].card;
      const leadSuit = leadCard.suit;
      const userHasLeadSuit = thuneeHand.some(c => c.suit === leadSuit);
      
      if (userHasLeadSuit && card.suit !== leadSuit) {
        const suitSymbol = leadSuit === "HEARTS" ? "♥️" : leadSuit === "DIAMONDS" ? "♦️" : leadSuit === "CLUBS" ? "♣️" : "♠️";
        triggerToast(`Must follow suit of ${suitSymbol} ${leadSuit}!`, "info");
        playBeep(220, "sawtooth", 0.08);
        return;
      }
    }
    
    // Valid play!
    playBeep(580, "sine", 0.05);
    const updatedPlayed = [...thuneePlayedCardsNew, { playerIndex: myIdx, name: currentPlayerName, card }];
    const remainingHand = thuneeHand.filter(c => c.id !== card.id);
    
    setThuneeHand(remainingHand);

    const nextTurnIdx = (myIdx + 1) % 4;
    const finalAllCards = {
      ...thuneeAllCardsNew,
      [myIdx.toString()]: remainingHand
    };

    if (updatedPlayed.length === 4) {
      updateThuneeGame({
        allCards: finalAllCards,
        playedCards: updatedPlayed,
        currentTurn: null,
        statusText: "Trick complete! All 4 cards played. Tap Collect Trick."
      });
    } else {
      updateThuneeGame({
        allCards: finalAllCards,
        playedCards: updatedPlayed,
        currentTurn: nextTurnIdx,
        statusText: `${thuneeSeats[nextTurnIdx]}'s turn to play...`
      });
    }
  };

  // Auto-play AI turns cascade
  useEffect(() => {
    if (!isThuneePlaying || thuneeStage !== "PLAY" || thuneeCurrentTurnIndex === null) return;

    const isBotTurn = thuneeSeats[thuneeCurrentTurnIndex] && (
      thuneeSeats[thuneeCurrentTurnIndex].includes("Bot") || 
      thuneeSeats[thuneeCurrentTurnIndex].startsWith("🧑‍🍳")
    );

    if (!isBotTurn) return;

    // Only allow simulation if Solo Mode OR you are the synchronized multiplayer room host
    const isRoomHost = thuneeGameMode === "AI" || thuneeHostName === currentPlayerName;
    if (!isRoomHost) return;

    const timer = setTimeout(() => {
      makeAiThuneeMove(thuneeCurrentTurnIndex, thuneePlayedCardsNew);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [isThuneePlaying, thuneeStage, thuneeCurrentTurnIndex, thuneePlayedCardsNew, thuneeSeats, thuneeGameMode, thuneeHostName]);

  // Reset the coach advice when turn or state changes
  useEffect(() => {
    setThuneeAdviceText(null);
    setThuneeSuggestedCardId(null);
  }, [thuneeCurrentTurnIndex, thuneePlayedCardsNew, thuneeStage]);

  // On mount: check first time user to trigger help automatically
  useEffect(() => {
    const hasVisited = localStorage.getItem("lutho_has_visited");
    if (!hasVisited) {
      // Delay so it triggers elegantly right as the splash screen completes
      const timer = setTimeout(() => {
        setIsHelpOpen(true);
        localStorage.setItem("lutho_has_visited", "true");
      }, 3400);
      return () => clearTimeout(timer);
    }
  }, []);

  // --- Sync storage ---
  useEffect(() => {
    localStorage.setItem("lutho_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("lutho_stamps", stamps.toString());
  }, [stamps]);

  useEffect(() => {
    localStorage.setItem("lutho_orders", JSON.stringify(historicOrders));
  }, [historicOrders]);

  useEffect(() => {
    localStorage.setItem("lutho_specials_v4", JSON.stringify(specials));
  }, [specials]);

  useEffect(() => {
    localStorage.setItem("lutho_coupon_applied", couponApplied.toString());
  }, [couponApplied]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem("lutho_applied_coupon_code", couponCode);
    } else {
      localStorage.removeItem("lutho_applied_coupon_code");
    }
  }, [couponCode]);

  // Table overall active bill (master bill items, containing what's ordered on table so far)
  const [masterBillItems, setMasterBillItems] = useState<MasterBillItem[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_master_bill");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove mock initial elements starting with "init-"
          const filtered = parsed.filter((item: any) => item && item.id && !item.id.startsWith("init-"));
          return filtered;
        }
      }
    } catch {}

    // Default pre-ordered elements - empty for live compliance
    return [];
  });

  // Collaborative Bill Splitting Session Members
  // Collaborative Bill Splitting Session Members
  const [sessionMembers, setSessionMembers] = useState<string[]>([]);

  const isRemoteTable = currentTableId === REMOTE_TABLE_ID;
  const isRemoteSplitConnected = !isRemoteTable || !!remoteSplitSession;
  const displaySessionMembers = isRemoteTable
    ? (remoteSplitSession?.members ?? (currentPlayerName ? [currentPlayerName] : []))
    : sessionMembers;

  const myMemberName = currentPlayerName || sessionStorage.getItem("lutho_my_session_name") || "";
  const myGroupDraft = groupOrderDraft?.members[myMemberName];
  const isMyGroupOrderLocked = !!myGroupDraft?.locked;
  const groupLockedCount = groupOrderDraft
    ? countLockedMembers(groupOrderDraft, displaySessionMembers)
    : 0;
  const isGroupOrderReadyToSubmit = !!(
    remoteSplitSession &&
    groupOrderDraft &&
    groupOrderDraft.roundStatus === "building" &&
    allMembersLocked(groupOrderDraft, displaySessionMembers)
  );
  const useRemoteGroupOrderFlow = isRemoteTable && !!remoteSplitSession && remoteOrderMode === "group";

  /** Guest kitchen feed — remote table only shows this device/group's tickets. */
  const kitchenFeedOrders = useMemo(() => {
    if (!isRemoteTable) return historicOrders;
    const myName = myMemberName || currentPlayerName || sessionStorage.getItem("lutho_my_session_name") || "";
    const feedOpts = {
      myName,
      sessionMembers: remoteSplitSession?.members || [],
      inSplitSession: !!remoteSplitSession && remoteOrderMode === "group",
    };
    return historicOrders.filter((order) => {
      const remote = sharedStaffOrders.find((o) => o.id === order.id);
      if (!remote) return true;
      return isRemoteKitchenFeedOrder(remote, feedOpts);
    });
  }, [
    isRemoteTable,
    historicOrders,
    myMemberName,
    currentPlayerName,
    remoteSplitSession?.members,
    remoteSplitSession?.id,
    remoteOrderMode,
    sharedStaffOrders,
  ]);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [highlightKitchenOrders, setHighlightKitchenOrders] = useState(false);

  // Split view UI state managers
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [billSplitMode, setBillSplitMode] = useState<"EQUAL" | "ITEMS" | "CUSTOM">("EQUAL");
  const [splitCount, setSplitCount] = useState<number>(2);
  const [selectedTipPercent, setSelectedTipPercent] = useState<number>(10);
  const [customAmountInput, setCustomAmountInput] = useState<string>("");
  
  // Maps item ID to how many shares of that item the current user is choosing to pay
  const [itemSharesToPay, setItemSharesToPay] = useState<Record<string, number>>({});

  // Lock body scroll when modals/control center is active
  useEffect(() => {
    const isModalOpen = isControlMenuOpen || isBookingModalOpen || isGamesModalOpen || !!selectedDetailItem || showQrPrintSheet || isQrModalOpen || isPosConfigOpen || isTermsOpen || isBillOpen || isHelpOpen || showStaffGate || isGuestNameOpen || isCustomerChatOpen || isCartOpen || isReviewModalOpen || !!staffTablePinPrompt || selectedStaffTable !== null;
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isControlMenuOpen, isBookingModalOpen, isGamesModalOpen, selectedDetailItem, showQrPrintSheet, isQrModalOpen, isPosConfigOpen, isTermsOpen, isBillOpen, isHelpOpen, showStaffGate, isGuestNameOpen, isCustomerChatOpen, isCartOpen, isReviewModalOpen, staffTablePinPrompt, selectedStaffTable]);
  
  const [pendingBillRequestId, setPendingBillRequestId] = useState<string | null>(null);
  const [billRequestSubmitted, setBillRequestSubmitted] = useState(false);
  const [submittedBillDetails, setSubmittedBillDetails] = useState<BillRequestDetails | null>(null);

  const [incomingOrders, setIncomingOrders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_incoming_orders");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Keep records of orders for other tables
  const [otherTablesOrders, setOtherTablesOrders] = useState<Record<string, any[]>>(() => {
    try {
      const saved = localStorage.getItem("lutho_other_tables_orders");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [shiftStartTime] = useState("18:30");
  const [manualActiveTab, setManualActiveTab] = useState<"seating" | "orders" | "chat" | "menu" | "summons" | "blueprint" | "security">("seating");
  const [blueprintDocMode, setBlueprintDocMode] = useState<"PRD" | "TRD">("PRD");

  // ==========================================
  // --- LUTHO SHIELD (V1.2) SECURITY TUNNEL ---
  // ==========================================
  const generateDefaultConfig = (tableId: string): { tableId: string; pin: string; secureToken: string; rotatedAt: number } => {
    const pins: Record<string, string> = {
      "1": "1394", "2": "2485", "3": "3571", "4": "4619", "5": "5728",
      "6": "6837", "7": "7942", "8": "8051", "9": "9163", "10": "5084",
      "11": "2195", "12": "1294", "13": "3141", "14": "4529", "15": "5670"
    };
    const pin = pins[tableId] || "1294";
    const secureToken = `lutho-sec-t${tableId.padStart(2, "0")}-${pin}f8c2b5`;
    return {
      tableId,
      pin,
      secureToken,
      rotatedAt: Date.now()
    };
  };

  const [tableSecurityConfigs, setTableSecurityConfigs] = useState<Record<string, { tableId: string; pin: string; secureToken: string; rotatedAt: number }>>(() => {
    try {
      const saved = localStorage.getItem("lutho_tables_security_configs");
      if (saved) return JSON.parse(saved);
    } catch {}
    const map: Record<string, any> = {};
    for (let i = 1; i <= 15; i++) {
      const tId = String(i);
      map[tId] = generateDefaultConfig(tId);
    }
    return map;
  });

  const [isTableUnlocked, setIsTableUnlocked] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tableId = params.get("table");
      if (!tableId) return true; // Default view or staff view, not restricted by guest table locks

      // Remote ordering must allow concurrent sessions globally.
      if (tableId === "14") return true;

      const activeTable = localStorage.getItem("lutho_active_customer_table");
      const urlToken = params.get("token");
      const urlPin = params.get("pin");

      // Get table security configuration synchronously
      let configsSaved: Record<string, any> = {};
      try {
        const saved = localStorage.getItem("lutho_tables_security_configs");
        if (saved) configsSaved = JSON.parse(saved);
      } catch {}

      const pins: Record<string, string> = {
        "1": "1394", "2": "2485", "3": "3571", "4": "4619", "5": "5728",
        "6": "6837", "7": "7942", "8": "8051", "9": "9163", "10": "5084",
        "11": "2195", "12": "1294", "13": "3141", "14": "4529", "15": "5670"
      };
      const pin = pins[tableId] || "1294";
      const defaultToken = `lutho-sec-t${tableId.padStart(2, "0")}-${pin}f8c2b5`;
      const config = configsSaved[tableId] || {
        tableId,
        pin,
        secureToken: defaultToken
      };

      // Direct URL Token/Pin scans update the active customer table and bypass lock
      if (urlToken && urlToken === config.secureToken) {
        localStorage.setItem("lutho_active_customer_table", tableId);
        return true;
      }
      if (urlPin && urlPin === config.pin) {
        localStorage.setItem("lutho_active_customer_table", tableId);
        return true;
      }

      // Guest can only access this table if it matches their currently active unlocked table
      if (activeTable === tableId) {
        let unlockedRegistry: Record<string, string> = {};
        try {
          const saved = localStorage.getItem("lutho_unlocked_table_tokens");
          if (saved) unlockedRegistry = JSON.parse(saved);
        } catch {}

        if (unlockedRegistry[tableId] === config.secureToken) {
          return true;
        }
      }
    } catch {}
    return false;
  });
  const [pinInput, setPinInput] = useState<string>("");
  const [securityAttempts, setSecurityAttempts] = useState<number>(0);
  const [securityLockoutSecs, setSecurityLockoutSecs] = useState<number>(0);
  
  const [securityAuditLogs, setSecurityAuditLogs] = useState<{ id: string; timestamp: number; type: "SUCCESS" | "FAILED" | "ROTATED" | "BLOCK"; message: string; tableId: string }[]>(() => {
    try {
      const saved = localStorage.getItem("lutho_security_audit_logs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const logSecurityEvent = (type: "SUCCESS" | "FAILED" | "ROTATED" | "BLOCK", message: string, tableId: string) => {
    const newLog = {
      id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      timestamp: Date.now(),
      type,
      message,
      tableId
    };
    setSecurityAuditLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 50);
      localStorage.setItem("lutho_security_audit_logs", JSON.stringify(updated));
      return updated;
    });
  };

  const getSecureGuestUrl = (tableId: string): string => {
    const config = tableSecurityConfigs[tableId] || generateDefaultConfig(tableId);
    return `${window.location.origin}${window.location.pathname}?table=${tableId}&token=${config.secureToken}`;
  };

  // Lockout countdown timer
  useEffect(() => {
    if (securityLockoutSecs <= 0) return;
    const interval = setInterval(() => {
      setSecurityLockoutSecs(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [securityLockoutSecs]);

  // Security Unlock Checker
  useEffect(() => {
    if (!currentTableId) return;

    const config = tableSecurityConfigs[currentTableId] || generateDefaultConfig(currentTableId);
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlPin = params.get("pin");

    // Remote ordering allows concurrent sessions (no device/table lock).
    if (currentTableId === "14") {
      setIsTableUnlocked(true);
      return;
    }

    let unlockedRegistry: Record<string, string> = {};
    try {
      const saved = localStorage.getItem("lutho_unlocked_table_tokens");
      if (saved) unlockedRegistry = JSON.parse(saved);
    } catch {}

    const savedToken = unlockedRegistry[currentTableId];
    const activeTable = localStorage.getItem("lutho_active_customer_table");

    if (urlToken && urlToken === config.secureToken) {
      unlockedRegistry[currentTableId] = config.secureToken;
      localStorage.setItem("lutho_unlocked_table_tokens", JSON.stringify(unlockedRegistry));
      localStorage.setItem("lutho_active_customer_table", currentTableId);
      document.cookie = `lutho_session_${currentTableId}=${config.secureToken}; max-age=86400; path=/; SameSite=Strict; Secure`;
      setIsTableUnlocked(true);
      setSecurityAttempts(0);
    } else if (urlPin && urlPin === config.pin) {
      unlockedRegistry[currentTableId] = config.secureToken;
      localStorage.setItem("lutho_unlocked_table_tokens", JSON.stringify(unlockedRegistry));
      localStorage.setItem("lutho_active_customer_table", currentTableId);
      document.cookie = `lutho_session_${currentTableId}=${config.secureToken}; max-age=86400; path=/; SameSite=Strict; Secure`;
      setIsTableUnlocked(true);
      setSecurityAttempts(0);
    } else if (activeTable === currentTableId && savedToken && savedToken === config.secureToken) {
      setIsTableUnlocked(true);
    } else {
      setIsTableUnlocked(false);
    }
  }, [currentTableId, tableSecurityConfigs]);

  const handlePinSubmit = (enteredPin: string) => {
    if (securityLockoutSecs > 0) {
      playBeep(250, "sawtooth", 0.15);
      triggerToast("Security lockout active. Please wait.", "info");
      return;
    }

    // Remote ordering never requires unlocking.
    if (currentTableId === "14") {
      setIsTableUnlocked(true);
      setPinInput("");
      return;
    }

    const config = tableSecurityConfigs[currentTableId] || generateDefaultConfig(currentTableId);
    if (enteredPin === config.pin) {
      playBeep(750, "sine", 0.08);
      
      const updatedRegistry: Record<string, string> = {};
      try {
        const saved = localStorage.getItem("lutho_unlocked_table_tokens");
        if (saved) Object.assign(updatedRegistry, JSON.parse(saved));
      } catch {}
      
      updatedRegistry[currentTableId] = config.secureToken;
      localStorage.setItem("lutho_unlocked_table_tokens", JSON.stringify(updatedRegistry));
      localStorage.setItem("lutho_active_customer_table", currentTableId);
      document.cookie = `lutho_session_${currentTableId}=${config.secureToken}; max-age=86400; path=/; SameSite=Strict; Secure`;
      
      setIsTableUnlocked(true);
      setSecurityAttempts(0);
      setPinInput("");
      
      logSecurityEvent("SUCCESS", `Device successfully unlocked Table ${currentTableId} using active physical PIN.`, currentTableId);
      triggerToast(`Lutho-Shield: Table ${currentTableId} unlocked successfully! 🛡️`, "success");
    } else {
      playBeep(220, "triangle", 0.12);
      const attempts = securityAttempts + 1;
      setSecurityAttempts(attempts);
      setPinInput("");
      
      logSecurityEvent("FAILED", `Incorrect PIN attempt on Table ${currentTableId} (${attempts}/5).`, currentTableId);
      
      if (attempts >= 5) {
        setSecurityLockoutSecs(30);
        setSecurityAttempts(0);
        logSecurityEvent("BLOCK", `Table ${currentTableId} brute-force blocked for 30 seconds.`, currentTableId);
        triggerToast("Brute-force security lockout enabled! Please wait 30s.", "info");
      } else {
        triggerToast(`ACCESS DENIED: PIN mismatch (${attempts}/5)`, "info");
      }
    }
  };

  const rotateTableSecurity = (tableId: string) => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomHex = "";
    for (let i = 0; i < 12; i++) {
      randomHex += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newSecureToken = `lutho-sec-t${tableId.padStart(2, "0")}-${randomHex}`;
    
    setTableSecurityConfigs(prev => {
      const updated = {
        ...prev,
        [tableId]: {
          tableId,
          pin: newPin,
          secureToken: newSecureToken,
          rotatedAt: Date.now()
        }
      };
      localStorage.setItem("lutho_tables_security_configs", JSON.stringify(updated));
      return updated;
    });

    logSecurityEvent("ROTATED", `Rotated credentials for Table ${tableId}. Old session keys invalidated.`, tableId);
    
    try {
      const saved = localStorage.getItem("lutho_unlocked_table_tokens");
      if (saved) {
        const registry = JSON.parse(saved);
        delete registry[tableId];
        localStorage.setItem("lutho_unlocked_table_tokens", JSON.stringify(registry));
      }
    } catch {}

    triggerToast(`Rotated Table ${tableId}! New Pin: ${newPin} ⚙️`, "success");
  };
  // ==========================================

  useEffect(() => {
    // Sanitary cleanup of old mock items to guarantee completely live data
    setIncomingOrders(prev => prev.filter(o => o.id !== "ord-INC-99" && o.id !== "ord-INC-88"));
    setChatMessages(prev => prev.filter(m => m.id !== "c1" && m.id !== "c2"));
    setBookings(prev => prev.filter(b => b.id !== "b-1" && b.id !== "b-2" && b.name !== "Jessica Smith" && b.name !== "Marcus Dun"));
  }, []);

  // Check for any new dynamic reservations to trigger an immediate popup warning alert
  useEffect(() => {
    const newBookedItems = bookings.filter(b => b.id !== "b-1" && b.id !== "b-2" && b.name !== "Jessica Smith" && b.name !== "Marcus Dun" && !knownBookingIds.includes(b.id));
    if (newBookedItems.length > 0) {
      const newest = newBookedItems[0];
      
      // Removed mock full-screen warning alerts for a cleaner user experience
      triggerToast(`New Booking Alert: Table ${newest.tableId} reserved! 🎫`, "success");

      // Add to known IDs
      setKnownBookingIds(prev => [...prev, ...newBookedItems.map(b => b.id)]);
    } else {
      // Keep in sync in case a booking is deleted
      const currentIds = bookings.map(b => b.id);
      if (knownBookingIds.some(id => !currentIds.includes(id))) {
        setKnownBookingIds(currentIds);
      }
    }
  }, [bookings, knownBookingIds]);

  useEffect(() => {
    setupLuthoAudioUnlock();
  }, []);

  // Keep guest order cards in sync with Firestore status updates from staff.
  // Remote table: never inject other devices' solo tickets into this guest's kitchen feed.
  useEffect(() => {
    const activeTableId = resolveActiveTableId(currentTableId);
    const activeService = tableServices[String(activeTableId)]?.active
      ? tableServices[String(activeTableId)]
      : null;
    const serviceOrders = sharedStaffOrders.filter(
      (order) =>
        String(order.tableId) === String(activeTableId) ||
        (!!activeService &&
          (order.partyId === activeService.partyId ||
            activeService.memberTableIds.includes(String(order.tableId))))
    );
    if (serviceOrders.length === 0) return;

    const isRemote = String(activeTableId) === REMOTE_TABLE_ID;
    const myName = myMemberName || currentPlayerName || sessionStorage.getItem("lutho_my_session_name") || "";
    const sessionMembers = remoteSplitSession?.members || [];
    const feedOpts = {
      myName,
      sessionMembers,
      inSplitSession: !!remoteSplitSession && remoteOrderMode === "group",
    };

    setHistoricOrders((prev) => {
      const prevById = new Map<string, HistoricOrder>(prev.map((order) => [order.id, order]));
      let changed = false;
      let next: HistoricOrder[] = [...prev];

      // Drop foreign remote tickets already stuck in local history from older syncs.
      if (isRemote) {
        const owned = next.filter((order) => {
          const remote = serviceOrders.find((r) => r.id === order.id);
          // Keep device-local tickets (placed here) even before/after staff snapshot churn.
          if (!remote) return true;
          return isRemoteKitchenFeedOrder(remote, feedOpts);
        });
        if (owned.length !== next.length) {
          next = owned;
          changed = true;
        }
      }

      serviceOrders.forEach((remote: StaffOrderRecord) => {
        if (isRemote && !isRemoteKitchenFeedOrder(remote, feedOpts)) {
          return;
        }

        const existing = prevById.get(remote.id) || next.find((o) => o.id === remote.id);
        if (!existing) {
          next.unshift(remoteOrderToHistoric(remote));
          changed = true;
          return;
        }
        if (
          existing.status !== remote.status ||
          existing.timerRemaining !== remote.timerRemaining ||
          existing.timerExpired !== remote.timerExpired
        ) {
          const index = next.findIndex((order) => order.id === remote.id);
          if (index !== -1) {
            next[index] = {
              ...existing,
              status: remote.status,
              timerRemaining: remote.timerRemaining ?? existing.timerRemaining,
              timerExpired: remote.timerExpired ?? existing.timerExpired,
            };
            changed = true;
          }
        }
      });

      return changed ? next : prev;
    });
  }, [
    sharedStaffOrders,
    currentTableId,
    myMemberName,
    currentPlayerName,
    remoteSplitSession?.id,
    remoteSplitSession?.members,
    remoteOrderMode,
    tableServices,
  ]);

  // Dine-in bill is derived from the shared Firestore tickets. This means a
  // guest who scans after a waiter entered the order still sees the real bill.
  useEffect(() => {
    const timer = window.setTimeout(() => {
    const activeTableId = resolveActiveTableId(currentTableId);
    if (!activeTableId || activeTableId === REMOTE_TABLE_ID) return;
    const service = tableServices[activeTableId]?.active
      ? tableServices[activeTableId]
      : null;
    const orders = sharedStaffOrders.filter(
      (order) =>
        order.status !== "Completed" &&
        (String(order.tableId) === String(activeTableId) ||
          (!!service &&
            (order.partyId === service.partyId ||
              service.memberTableIds.includes(String(order.tableId)))))
    );

    const grouped = new Map<string, MasterBillItem>();
    orders.forEach((order) => {
      const paid = order.paymentStatus === "PAID" || order.status === "Paid";
      order.items.forEach((entry) => {
        const key = entry.menuItem.id || entry.menuItem.name;
        const current = grouped.get(key);
        if (current) {
          current.quantity += entry.quantity;
          if (paid) current.paidCount += entry.quantity;
          return;
        }
        grouped.set(key, {
          id: `shared-${service?.partyId || activeTableId}-${key}`,
          name: entry.menuItem.name,
          price: entry.menuItem.price,
          emoji: entry.menuItem.emoji || "🍽️",
          quantity: entry.quantity,
          paidCount: paid ? entry.quantity : 0,
        });
      });
    });

    const next = Array.from(grouped.values());
    setMasterBillItems((prev) =>
      JSON.stringify(prev) === JSON.stringify(next) ? prev : next
    );
    }, 0);
    return () => window.clearTimeout(timer);
  }, [currentTableId, sharedStaffOrders, tableServices]);

  useEffect(() => {
    localStorage.setItem("lutho_app_mode", appMode);
  }, [appMode]);

  useEffect(() => {
    // Alerts are Firestore-synced via system/tableAlerts — clear stale local copies.
    try {
      localStorage.removeItem("lutho_table_alerts");
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("lutho_incoming_orders", JSON.stringify(incomingOrders));
  }, [incomingOrders]);

  useEffect(() => {
    localStorage.setItem("lutho_other_tables_orders", JSON.stringify(otherTablesOrders));
  }, [otherTablesOrders]);

  // --- AUTOMATED ROTATING TABLE WAITER ASSIGNMENT ON QR SCAN ---
  useEffect(() => {
    if (appMode === "CUSTOMER" && currentTableId) {
      if (!tableWaiterAssignments[currentTableId]) {
        const nextWaiter = getNextAvailableWaiter(tableWaiterAssignments);
        if (nextWaiter) {
          const nextAssignments = {
            ...tableWaiterAssignments,
            [currentTableId]: nextWaiter.name
          };

          void persistTableAssignments(nextAssignments);
          if (currentTableId !== REMOTE_TABLE_ID) {
            const existing = tableServices[currentTableId];
            void savePartyAcrossTables({
              partyId: existing?.partyId || createPartyId(currentTableId),
              primaryTableId: existing?.primaryTableId || currentTableId,
              memberTableIds: existing?.memberTableIds || [currentTableId],
              covers: existing?.covers || 0,
              assignedStaffId: nextWaiter.id,
              assignedStaffName: nextWaiter.name,
              createdAt: existing?.createdAt,
            });
          }
          setTimeout(() => {
            triggerToast(
              currentTableId === REMOTE_TABLE_ID
                ? `${nextWaiter.name} assigned to Remote Ordering.`
                : `${nextWaiter.name} assigned to ${formatTableLabel(currentTableId)} • cover count required.`,
              "success"
            );
            playBeep(659.25, "sine", 0.1);
          }, 1000);
        }
      }
    }
  }, [appMode, currentTableId, isTableUnlocked, staffProfiles, tableWaiterAssignments, tableServices]);

  // --- COMPLEXITY-BASED REAL-TIME ORDER TIMER DECREMENT ---
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Decrement incomingOrders
      setIncomingOrders(prev => {
        let changed = false;
        const updated = prev.map(order => {
          if (order.status === "Sent" && order.timerRemaining !== undefined) {
            const rem = order.timerRemaining;
            if (rem > 0) {
              changed = true;
              const nextRem = rem - 1;
              return {
                ...order,
                timerRemaining: nextRem,
                timerExpired: nextRem === 0 ? true : order.timerExpired
              };
            }
          }
          return order;
        });
        return changed ? updated : prev;
      });

      // 2. Decrement historicOrders
      setHistoricOrders(prev => {
        let changed = false;
        const updated = prev.map(order => {
          if ((order.status === "Sent" || order.status === "Preparing") && order.timerRemaining !== undefined) {
            const rem = order.timerRemaining;
            if (rem > 0) {
              changed = true;
              const nextRem = rem - 1;
              return {
                ...order,
                timerRemaining: nextRem,
                timerExpired: nextRem === 0 ? true : order.timerExpired
              };
            }
          }
          return order;
        });
        return changed ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activeAlertsCount = useMemo(() => {
    let count = 0;
    if (waiterSummoned) count++;
    Object.keys(tableAlerts).forEach(k => {
      if (tableAlerts[k]) count++;
    });
    return count;
  }, [waiterSummoned, tableAlerts]);

  useEffect(() => {
    localStorage.setItem("lutho_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem("lutho_user_profile", JSON.stringify(userProfile));
    } else {
      localStorage.removeItem("lutho_user_profile");
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("lutho_tables_occupancy", JSON.stringify(tablesState));
  }, [tablesState]);

  useEffect(() => {
    if (Object.keys(tableServices).length === 0) return;
    setTablesState((prev) => {
      const next = { ...prev };
      (Object.values(tableServices) as TableServiceRecord[]).forEach((service: TableServiceRecord) => {
        if (String(service.tableId) === REMOTE_TABLE_ID) return;
        if (next[service.tableId] === "Booked" && !service.active) return;
        next[service.tableId] = service.active ? "Occupied" : "Available";
      });
      return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
    });
  }, [tableServices]);

  useEffect(() => {
    saveChatMessages(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    const syncChat = () => {
      const next = loadChatMessages();
      setChatMessages((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "lutho_chat_messages") syncChat();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("lutho_chat_updated", syncChat);
    const interval = setInterval(syncChat, 2000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("lutho_chat_updated", syncChat);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const syncSplit = () => {
      const joined = loadJoinedSplitSession();
      setRemoteSplitSession((prev) => {
        if (!joined && !prev) return prev;
        if (joined && prev && joined.id === prev.id && JSON.stringify(joined.members) === JSON.stringify(prev.members)) return prev;
        return joined;
      });
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("lutho_remote_split_") || e.key === "lutho_remote_split_joined") syncSplit();
    };
    window.addEventListener("storage", onStorage);
    const interval = setInterval(syncSplit, 2000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const splitId = parseSplitFromLocation();
    if (!splitId || resolveActiveTableId(currentTableId) !== REMOTE_TABLE_ID) return;
    const name = currentPlayerName || sessionStorage.getItem("lutho_my_session_name");
    if (!name) return;
    if (remoteSplitSession?.id === splitId) return;

    let cancelled = false;
    void (async () => {
      let session = joinSplitSession(splitId, name);
      if (!session) {
        try {
          const remote = await fetchSplitSession(splitId);
          if (remote) {
            const members = remote.members.includes(name) ? remote.members : [...remote.members, name];
            session = { ...remote, members };
            saveSplitSession(session);
          }
        } catch (error) {
          console.error("[LUTHO] Failed to fetch split session from URL:", error);
        }
      }
      if (cancelled || !session) return;
      setRemoteSplitSession(session);
      triggerToast(`Joined ${session.hostName}'s split session`, "success");
      try {
        await upsertSplitSession(session);
      } catch (error) {
        console.error("[LUTHO] Failed to sync URL join split:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentTableId, currentPlayerName, remoteSplitSession?.id]);

  useEffect(() => {
    if (!remoteSplitSession) {
      setGroupOrderDraft(null);
      return;
    }
    void ensureGroupOrderDraft(remoteSplitSession.id);
    const unsub = onSnapshot(
      groupOrderDraftRef(remoteSplitSession.id),
      (snap) => {
        if (snap.exists()) {
          setGroupOrderDraft(snap.data() as GroupOrderDraft);
        } else {
          setGroupOrderDraft(null);
        }
      },
      (error) => console.error("[LUTHO] Group order draft sync failed:", error)
    );
    return () => unsub();
  }, [remoteSplitSession?.id]);

  useEffect(() => {
    if (!groupOrderDraft?.roundId) return;
    if (lastGroupRoundIdRef.current && lastGroupRoundIdRef.current !== groupOrderDraft.roundId) {
      setCart([]);
      setOrderNotes("");
    }
    lastGroupRoundIdRef.current = groupOrderDraft.roundId;
  }, [groupOrderDraft?.roundId]);

  useEffect(() => {
    if (!useRemoteGroupOrderFlow || !remoteSplitSession || !myMemberName) return;
    if (isMyGroupOrderLocked) return;
    const timer = setTimeout(() => {
      void syncMemberGroupDraft({
        sessionId: remoteSplitSession.id,
        memberName: myMemberName,
        items: cart,
        notes: orderNotes,
        locked: false,
      });
    }, 450);
    return () => clearTimeout(timer);
  }, [cart, orderNotes, useRemoteGroupOrderFlow, remoteSplitSession?.id, myMemberName, isMyGroupOrderLocked]);

  // Handle upcoming bookings and show popups/Browser Notifications
  useEffect(() => {
    if (appMode === "STAFF") {
      const todayString = new Date().toISOString().split('T')[0];
      // Search for booking today on tables currently marked Occupied
      const conflicts = bookings.filter(b => b.date === todayString && tablesState[b.tableId] === "Occupied");
      
      if (conflicts.length > 0) {
        // Table 4 default simulated 15-min warning
        const firstConflict = conflicts[0];
        const warningMsg = `⚠️ Table ${firstConflict.tableId} has a booking in ${firstConflict.tableId === "4" ? "15" : "30"} mins! Please inform current guests.`;
        
        // Removed full screen warning overlay for standard toast notification
        triggerToast(warningMsg, "info");

        // Request browser permission if needed
        if ("Notification" in window) {
          if (Notification.permission === "default") {
            Notification.requestPermission();
          }
          if (Notification.permission === "granted") {
            try {
              new Notification("Lutho OS: Booking Alert!", {
                body: warningMsg,
                icon: "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Lutho-ALERT"
              });
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    }
  }, [appMode, bookings, tablesState]);

  useEffect(() => {
    if (isRemoteTable && remoteSplitSession) {
      setSplitCount(Math.max(remoteSplitSession.members.length, 2));
    }
  }, [isRemoteTable, remoteSplitSession?.members.length, remoteSplitSession?.id]);

  useEffect(() => {
    if (!remoteSplitSession) return;
    const unsubSession = listenSplitSession(remoteSplitSession.id, (session) => {
      if (!session) return;
      setRemoteSplitSession((prev) => {
        if (!prev || prev.id !== session.id) return prev;
        if (
          prev.hostName === session.hostName &&
          prev.members.join("|") === session.members.join("|")
        ) {
          return prev;
        }
        saveSplitSession(session);
        return session;
      });
    });
    const unsubBill = listenSplitBill(remoteSplitSession.id, (items) => {
      skipSplitBillEchoRef.current = true;
      setMasterBillItems((prev) => (JSON.stringify(prev) === JSON.stringify(items) ? prev : items));
    });
    return () => {
      unsubSession();
      unsubBill();
    };
  }, [remoteSplitSession?.id]);

  useEffect(() => {
    if (!remoteSplitSession) return;
    const billKey = getSplitBillStorageKey(remoteSplitSession.id);
    const syncBill = () => {
      try {
        const saved = localStorage.getItem(billKey);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return;
        const filtered = parsed.filter((item: any) => item && item.id && !item.id.startsWith("init-"));
        setMasterBillItems((prev) => (JSON.stringify(prev) === JSON.stringify(filtered) ? prev : filtered));
      } catch {
        // ignore parse errors
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === billKey) syncBill();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, [remoteSplitSession?.id]);

  // Dynamic table-scoped master bill initialization and synchronization
  useEffect(() => {
    const myName = currentPlayerName || sessionStorage.getItem("lutho_my_session_name") || "";

    const billKey =
      currentTableId === REMOTE_TABLE_ID && remoteSplitSession
        ? getSplitBillStorageKey(remoteSplitSession.id)
        : `lutho_master_bill_${currentTableId}`;

    // Remote solo guests (no split session/host) still get a persistent bill,
    // keyed the same as a normal table (`lutho_master_bill_14`), so it survives reloads.
    try {
      const savedBill = localStorage.getItem(billKey);
      if (savedBill) {
        const parsed = JSON.parse(savedBill);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((item: any) => item && item.id && !item.id.startsWith("init-"));
          setMasterBillItems(filtered);
        } else {
          setMasterBillItems([]);
        }
      } else {
        setMasterBillItems([]);
      }
    } catch {
      setMasterBillItems([]);
    }

    if (currentTableId !== REMOTE_TABLE_ID) {
      try {
        const savedMembersStr = localStorage.getItem("lutho_session_members_" + currentTableId);
        let currentMembers: string[] = savedMembersStr ? JSON.parse(savedMembersStr) : [];
        if (myName && !currentMembers.includes(myName)) {
          currentMembers = [...currentMembers, myName];
        }
        setSessionMembers(currentMembers.filter(Boolean));
      } catch {
        setSessionMembers(myName ? [myName] : []);
      }
    }
  }, [currentTableId, remoteSplitSession?.id, currentPlayerName]);

  // Persist master bill when modified (+ live Firestore push for remote splits)
  useEffect(() => {
    if (!currentTableId) return;

    const billKey =
      currentTableId === REMOTE_TABLE_ID && remoteSplitSession
        ? getSplitBillStorageKey(remoteSplitSession.id)
        : `lutho_master_bill_${currentTableId}`;

    localStorage.setItem(billKey, JSON.stringify(masterBillItems));

    if (remoteSplitSession && currentTableId === REMOTE_TABLE_ID) {
      if (skipSplitBillEchoRef.current) {
        skipSplitBillEchoRef.current = false;
        return;
      }
      const timer = window.setTimeout(() => {
        void upsertSplitBillItems({
          sessionId: remoteSplitSession.id,
          tableId: remoteSplitSession.tableId,
          hostName: remoteSplitSession.hostName,
          members: remoteSplitSession.members,
          items: masterBillItems,
        }).catch((error) => console.error("[LUTHO] Split bill sync failed:", error));
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, [masterBillItems, currentTableId, remoteSplitSession?.id, remoteSplitSession?.hostName, remoteSplitSession?.members, remoteSplitSession?.tableId]);

  // Persist session members when modified (dine-in tables only)
  useEffect(() => {
    if (currentTableId && currentTableId !== REMOTE_TABLE_ID) {
      localStorage.setItem("lutho_session_members_" + currentTableId, JSON.stringify(sessionMembers));
    }
  }, [sessionMembers, currentTableId]);

  // Listen for storage events to synchronize master bill/sessions live across all tabs!
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "lutho_master_bill_" + currentTableId) {
        try {
          if (e.newValue) {
            setMasterBillItems(JSON.parse(e.newValue));
          }
        } catch {}
      }
      if (e.key === "lutho_session_members_" + currentTableId) {
        try {
          if (e.newValue) {
            setSessionMembers(JSON.parse(e.newValue));
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentTableId]);

  // Subscribe to real-time Thunee Room state from Firestore!
  useEffect(() => {
    if (!currentTableId) return;

    const docRef = doc(db, "thunee_rooms", currentTableId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        setThuneeGameMode(data.mode || null);
        setThuneeSeats(data.seats || [null, null, null, null]);
        setThuneeStage(data.stage || "DEAL");
        setThuneeTrumpSuit(data.trumpSuit || null);
        setThuneeCurrentTurnIndex(data.currentTurn !== undefined ? data.currentTurn : null);
        setThuneePlayedCardsNew(data.playedCards || []);
        setThuneeGameScores(data.gameScores || { ourTeam: 0, enemyTeam: 0 });
        setThuneeRoundScores(data.roundScores || { ourTeam: 0, enemyTeam: 0 });
        setThuneeTricksWon(data.tricksWon || { ourTeam: 0, enemyTeam: 0 });
        setThuneeAllCardsNew(data.allCards || {});
        setThuneeGameStatusText(data.statusText || "");
        setThuneeThuneeCaller(data.caller || null);
        setThuneeCallThunee(data.callThuneeFlag || false);
        setThuneeHostName(data.host || "");
        
        const myIdx = (data.seats || []).indexOf(currentPlayerName);
        if (myIdx >= 0 && data.allCards) {
          setThuneeHand(data.allCards[myIdx.toString()] || []);
        }
      } else {
        // Fallback to local storage if Firestore doesn't have it yet, or initialize it from local
        const saved = localStorage.getItem("lutho_thunee_room_" + currentTableId);
        if (saved) {
          try {
            const data = JSON.parse(saved);
            setThuneeGameMode(data.mode);
            setThuneeSeats(data.seats);
            setThuneeStage(data.stage);
            setThuneeTrumpSuit(data.trumpSuit);
            setThuneeCurrentTurnIndex(data.currentTurn);
            setThuneePlayedCardsNew(data.playedCards || []);
            setThuneeGameScores(data.gameScores || { ourTeam: 0, enemyTeam: 0 });
            setThuneeRoundScores(data.roundScores || { ourTeam: 0, enemyTeam: 0 });
            setThuneeTricksWon(data.tricksWon || { ourTeam: 0, enemyTeam: 0 });
            setThuneeAllCardsNew(data.allCards || {});
            setThuneeGameStatusText(data.statusText || "");
            setThuneeThuneeCaller(data.caller || null);
            setThuneeCallThunee(data.callThuneeFlag || false);
            setThuneeHostName(data.host || "");
            
            const myIdx = data.seats.indexOf(currentPlayerName);
            if (myIdx >= 0 && data.allCards) {
              setThuneeHand(data.allCards[myIdx.toString()] || []);
            }
          } catch {}
        } else {
          setThuneeGameMode(null);
          setThuneeSeats([null, null, null, null]);
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `thunee_rooms/${currentTableId}`);
    });

    return () => unsubscribe();
  }, [currentTableId, currentPlayerName]);

  // Audio synthesize system for industrial tactile feel
  const playBeep = useCallback((freq = 440, type: OscillatorType = "sine", duration = 0.08) => {
    luthoPlayBeep(freq, type, duration, soundEnabled);
  }, [soundEnabled]);

  // Trigger Toast Notification Helper
  const triggerToast = (message: string, type: "success" | "info" | "stamp" = "info") => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Play contextual synthesized pitch
    if (type === "success") {
      playBeep(523.25, "sine", 0.12); // C5
      setTimeout(() => playBeep(659.25, "sine", 0.15), 80); // E5
    } else if (type === "stamp") {
      playBeep(329.63, "triangle", 0.1); // E4
      setTimeout(() => playBeep(493.88, "triangle", 0.1), 60); // B4
      setTimeout(() => playBeep(659.25, "triangle", 0.2), 120); // E5
    } else {
      playBeep(380, "sawtooth", 0.06); // Low gritty buzz
    }

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Alert staff when a new live order lands via Firestore.
  useEffect(() => {
    const currentIds = sharedStaffOrders.map((order) => order.id);

    if (appMode !== "STAFF") {
      knownStaffOrderIdsRef.current = currentIds;
      return;
    }

    const known = new Set(knownStaffOrderIdsRef.current);
    if (knownStaffOrderIdsRef.current.length > 0) {
      const freshOrders = sharedStaffOrders.filter((order) => !known.has(order.id));
      if (freshOrders.length > 0) {
        const latest = freshOrders[0];
        triggerToast(`New order — ${formatTableLabel(latest.tableId)}`, "success");
        playBeep(880, "sine", 0.12);
        void setTableAlertFlag(latest.tableId, true);
        setHighlightKitchenOrders(true);
        setTimeout(() => setHighlightKitchenOrders(false), 4500);
      }
    }

    knownStaffOrderIdsRef.current = currentIds;
  }, [sharedStaffOrders, appMode, playBeep]);

  // --- Call Waiter ---
  const handleCallWaiter = async () => {
    setWaiterSummoned(true);
    if (currentTableId) {
      void setTableAlertFlag(currentTableId, true);
      await createServiceRequest("WAITER", currentTableId, "Guest requested waiter assistance");
    }
    triggerToast("Lutho Crew has been notified. He'll be right there.", "info");
    // Pulse animation of waiter icon can stay highlighted.
    setTimeout(() => {
      setWaiterSummoned(false);
      if (currentTableId) void setTableAlertFlag(currentTableId, false);
    }, 45000); // kept at 45 seconds for convenient testing
  };

  // --- Staff View Handler methods ---
  const handleMarkAllServedForTable = async (tableId: string) => {
    playBeep(587.33, "sine", 0.08);
    setTimeout(() => playBeep(698.46, "sine", 0.12), 65);

    const activeStatuses: HistoricOrder["status"][] = ["Sent", "Preparing", "Ready"];
    const targets = sharedStaffOrders.filter(
      (order) => String(order.tableId) === String(tableId) && activeStatuses.includes(order.status)
    );

    if (targets.length === 0) {
      triggerToast("No active kitchen tickets to mark served.", "info");
      return;
    }

    await Promise.all(targets.map((order) => updateSharedOrderStatus(order.id, "Served")));
    triggerToast(`Marked ${targets.length} order${targets.length === 1 ? "" : "s"} served on ${formatTableLabel(tableId)}`, "success");
  };

  const handleClearTableForNewParty = async (tableId: string) => {
    const isRemoteClear = String(tableId) === REMOTE_TABLE_ID;
    const service = getActiveTableService(tableId);
    // Remote Ordering is a separate lane — never bundle it into dine-in clears.
    const memberTableIds = (
      isRemoteClear
        ? [REMOTE_TABLE_ID]
        : (service?.memberTableIds || [tableId]).filter((id) => String(id) !== REMOTE_TABLE_ID)
    );
    const primaryTableId = isRemoteClear
      ? REMOTE_TABLE_ID
      : service?.primaryTableId && service.primaryTableId !== REMOTE_TABLE_ID
        ? service.primaryTableId
        : tableId;
    const openOrders = sharedStaffOrders.filter((order) => {
      if (order.status === "Completed") return false;
      if (isRemoteClear) {
        return String(order.tableId) === REMOTE_TABLE_ID;
      }
      if (String(order.tableId) === REMOTE_TABLE_ID) return false;
      return (
        String(order.tableId) === String(primaryTableId) ||
        (!!service &&
          (order.partyId === service.partyId ||
            memberTableIds.includes(String(order.tableId))))
      );
    });
    const waiterName =
      service?.assignedStaffName ||
      tableWaiterAssignments[tableId] ||
      activeStaffProfile?.name ||
      openOrders.find((o) => o.assignedStaffName)?.assignedStaffName ||
      "Unassigned";
    const waiterProfile = staffProfiles.find((p) => p.name === waiterName);

    const confirmed = window.confirm(
      `Clear ${formatTableLabel(primaryTableId)}${!isRemoteClear && memberTableIds.length > 1 ? ` (${memberTableIds.length} combined tables)` : ""} for a new party?\n\n` +
        (isRemoteClear
          ? `This only clears Remote Ordering tickets. Dine-in tables stay untouched.\n\n`
          : `Remote Ordering stays untouched.\n\n`) +
        `This archives ${openOrders.length} order(s) under ${waiterName}, marks tickets completed, resets the bill, and releases ${isRemoteClear ? "remote prep" : "every member table"}.`
    );
    if (!confirmed) return;

    playBeep(523, "sine", 0.08);

    try {
      if (openOrders.length > 0) {
        const sitting = buildSittingFromOrders({
          tableId: primaryTableId,
          waiterName,
          waiterStaffId: waiterProfile?.id,
          clearedBy: activeStaffProfile?.name || waiterName,
          orders: openOrders,
        });
        await saveTableSitting(sitting);

        setWaitersList((prev) =>
          prev.map((w) => {
            if (w.name !== waiterName) return w;
            const detailHistory = {
              sittingId: sitting.id,
              orderId: sitting.id,
              tableId: primaryTableId,
              itemsCount: sitting.itemCount,
              prepTimeSeconds: 0,
              deliveryTimeSeconds: 0,
              onTime: true,
              total: sitting.total,
              guestNames: sitting.guestNames,
              items: sitting.orders.flatMap((o) =>
                o.items.map((item) => `${item.quantity}× ${item.name}`)
              ),
              clearedAt: sitting.clearedAt,
            };
            return {
              ...w,
              history: [detailHistory, ...(w.history || [])],
            };
          })
        );

        await Promise.all(openOrders.map((order) => updateSharedOrderStatus(order.id, "Completed")));
      }

      memberTableIds.forEach((memberId) => {
        localStorage.removeItem(`lutho_master_bill_${memberId}`);
        localStorage.removeItem(`lutho_session_members_${memberId}`);
      });
      if (memberTableIds.includes(String(currentTableId))) {
        setMasterBillItems([]);
        setSessionMembers([]);
        setHistoricOrders([]);
      }

      setTablesState((prev) => {
        const next = { ...prev };
        memberTableIds.forEach((memberId) => {
          next[memberId] = "Available";
        });
        return next;
      });
      const clearedAlerts = {
        ...tableAlerts,
        ...Object.fromEntries(memberTableIds.map((memberId) => [memberId, false])),
      };
      await persistTableAlerts(clearedAlerts);
      if (!isRemoteClear) {
        await closeTableParty(memberTableIds);
      }
      if (memberTableIds.includes(String(currentTableId))) {
        setWaiterSummoned(false);
      }

      const openRequests = serviceRequests.filter((r) => {
        if (r.status === "DONE") return false;
        if (isRemoteClear) return String(r.tableId) === REMOTE_TABLE_ID;
        if (String(r.tableId) === REMOTE_TABLE_ID) return false;
        return memberTableIds.includes(String(r.tableId)) || r.partyId === service?.partyId;
      });
      await Promise.all(
        openRequests.map((r) => updateDoc(doc(db, "service_requests", r.id), { status: "DONE" }))
      );

      setChatMessages((prev) =>
        prev.filter((m) => !memberTableIds.includes(String(m.tableId)))
      );

      const nextAssignments = { ...tableWaiterAssignments };
      memberTableIds.forEach((memberId) => delete nextAssignments[memberId]);
      await persistTableAssignments(nextAssignments);

      triggerToast(
        openOrders.length > 0
          ? `${formatTableLabel(primaryTableId)} cleared — sitting saved to ${waiterName}'s record.`
          : `${formatTableLabel(primaryTableId)} cleared and ready for a new party.`,
        "success"
      );
      setSelectedStaffTable(null);

      // End-of-floor cleanup only looks at dine-in tables — remote is a separate lane.
      if (!isRemoteClear) {
        const dineInTables = LUTHO_TABLES.filter((table) => table.id !== REMOTE_TABLE_ID);
        const stillOpenElsewhere = sharedStaffOrders.some(
          (order) =>
            order.status !== "Completed" &&
            String(order.tableId) !== REMOTE_TABLE_ID &&
            !memberTableIds.includes(String(order.tableId))
        );
        const allOtherDineInAvailable = dineInTables.every(
          (table) =>
            memberTableIds.includes(table.id) ||
            (tablesState[table.id] || "Available") === "Available"
        );
        if (!stillOpenElsewhere && allOtherDineInAvailable) {
          await handleClearAllTableAssignments();
        }
      }
    } catch (error) {
      console.error("[LUTHO] Clear table failed:", error);
      triggerToast("Could not clear the table. Try again.", "info");
    }
  };

  const handleClearAllTableAssignments = async () => {
    const dineInTables = LUTHO_TABLES.filter((table) => table.id !== REMOTE_TABLE_ID);
    const allDineInAvailable = dineInTables.every(
      (table) => (tablesState[table.id] || "Available") === "Available"
    );
    const noOpenDineInOrders = sharedStaffOrders.every(
      (order) =>
        order.status === "Completed" || String(order.tableId) === REMOTE_TABLE_ID
    );
    if (!allDineInAvailable || !noOpenDineInOrders) return;

    const nextAssignments = { ...tableWaiterAssignments };
    const hadDineIn = dineInTables.some((table) => !!nextAssignments[table.id]);
    if (!hadDineIn) return;
    dineInTables.forEach((table) => delete nextAssignments[table.id]);
    // Preserve Remote Ordering assignment — it is not part of the floor rotation.
    await persistTableAssignments(nextAssignments);
  };

  const handleResetTableAssignments = async () => {
    const dineInAssignedCount = Object.keys(tableWaiterAssignments).filter(
      (tableId) => tableId !== REMOTE_TABLE_ID
    ).length;
    if (dineInAssignedCount === 0) {
      triggerToast("No dine-in table assignments to reset.", "info");
      return;
    }
    const confirmed = window.confirm(
      `Reset all dine-in waiter table assignments (${dineInAssignedCount})?\n\n` +
        `Remote Ordering stays assigned. Floor tables stay as they are — only dine-in coverage ownership clears.`
    );
    if (!confirmed) return;
    playBeep(320, "sine", 0.08);
    const nextAssignments = { ...tableWaiterAssignments };
    const remoteWaiter = nextAssignments[REMOTE_TABLE_ID];
    LUTHO_TABLES.filter((table) => table.id !== REMOTE_TABLE_ID).forEach((table) => {
      delete nextAssignments[table.id];
    });
    if (remoteWaiter) nextAssignments[REMOTE_TABLE_ID] = remoteWaiter;
    else delete nextAssignments[REMOTE_TABLE_ID];
    await persistTableAssignments(nextAssignments);
    await Promise.all(
      (Object.values(tableServices) as TableServiceRecord[])
        .filter(
          (service: TableServiceRecord) =>
            service.active &&
            !!service.assignedStaffName &&
            String(service.tableId) !== REMOTE_TABLE_ID
        )
        .map((service: TableServiceRecord) =>
          upsertTableService({
            ...service,
            assignedStaffId: undefined,
            assignedStaffName: undefined,
            updatedAt: Date.now(),
          })
        )
    );
    triggerToast("Dine-in table assignments cleared. Remote Ordering left intact.", "success");
  };

  const handleCopyPilotSummary = (order: StaffOrderRecord) => {
    const text = buildPilotSummaryText({
      orderId: order.id,
      tableId: order.tableId,
      orderedBy: order.orderedBy,
      assignedStaffName: order.assignedStaffName,
      items: order.items.map((item) => ({
        quantity: item.quantity,
        menuItem: {
          id: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          emoji: item.menuItem.emoji,
          category: item.menuItem.category,
          description: "",
        },
      })),
      total: order.total,
      notes: order.notes,
      isRemoteGroupOrder: order.isRemoteGroupOrder,
    });
    navigator.clipboard.writeText(text);
    downloadTextFile(`pilot-${order.id}.txt`, text);
    playBeep(520, "sine", 0.06);
    triggerToast("Pilot POS summary copied + downloaded. Enter it into Pilot, then update status here.", "success");
  };

  const handleAcceptIncomingOrder = (order: any) => {
    playBeep(659.25, "sine", 0.08); // E5
    setTimeout(() => playBeep(880, "sine", 0.1), 70); // A5

    const wasExpired = order.timerRemaining === 0 || order.timerExpired;
    const timeTaken = order.timerDuration !== undefined && order.timerRemaining !== undefined 
      ? (order.timerDuration - order.timerRemaining) 
      : 30;

    const acceptedOrder = {
      ...order,
      status: "Served", // Accepted & Served!
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timerExpired: wasExpired
    };

    // Remove from incoming queue
    setIncomingOrders(prev => prev.filter(o => o.id !== order.id));

    // Update Staff profile history
    const assignedWaiter = tableWaiterAssignments[order.tableId] || "General";
    setWaitersList(prev => prev.map(w => {
      if (w.name === assignedWaiter) {
        const itemHistory = {
          orderId: order.id,
          tableId: order.tableId,
          itemsCount: order.items?.reduce((s: number, i: any) => s + (i.quantity || 1), 0) || 1,
          prepTimeSeconds: order.timerDuration || 45,
          deliveryTimeSeconds: timeTaken,
          onTime: !wasExpired
        };
        return {
          ...w,
          history: [itemHistory, ...(w.history || [])]
        };
      }
      return w;
    }));

    const destinationId = order.tableId;
    if (destinationId === currentTableId) {
      setHistoricOrders(prev => [acceptedOrder, ...prev.filter(o => o.id !== order.id)]);
      
      // Append the actual items directly to the master split bill so companions can split it
      setMasterBillItems(prev => {
        let next = [...prev];
        order.items.forEach((item: any) => {
          const matchIndex = next.findIndex(m => m.name === item.menuItem.name);
          if (matchIndex > -1) {
            next[matchIndex] = {
              ...next[matchIndex],
              quantity: next[matchIndex].quantity + item.quantity
            };
          } else {
            next.push({
              id: "item-add-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
              name: item.menuItem.name,
              price: item.menuItem.price,
              emoji: item.menuItem.emoji || "🍽️",
              quantity: item.quantity,
              paidCount: 0
            });
          }
        });

        // Add Free apology Sundae if the timer ran out
        if (wasExpired) {
          next.push({
            id: "comp-apology-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
            name: "🎁 Speed Apology Free Sundae",
            price: 0,
            emoji: "🍦",
            quantity: 1,
            paidCount: 0
          });
        }
        return next;
      });
    } else {
      setOtherTablesOrders(prev => {
        const currentOrders = (prev[destinationId] || []).filter(o => o.id !== order.id);
        return {
          ...prev,
          [destinationId]: [acceptedOrder, ...currentOrders]
        };
      });
    }

    if (wasExpired) {
      triggerToast(`⚠️ Timer EXPIRED! Free apology Sundae added to Table ${destinationId}'s bill!`, "info");
    } else {
      triggerToast(`Order accepted and successfully delivered to Table ${destinationId}!`, "success");
    }
  };

  const handleAskKitchen = (orderId: string) => {
    playBeep(415.3, "sawtooth", 0.1); // G#4
    triggerToast(`Checked with Kitchen concern regarding Order #${orderId}`, "info");
  };

  const handleResolveAlertForTable = (tableId: string) => {
    playBeep(523.25, "sine", 0.06);
    void setTableAlertFlag(tableId, false);
    if (tableId === currentTableId) {
      setWaiterSummoned(false);
    }
    triggerToast(`${formatTableLabel(tableId)} alert has been marked as resolved!`, "success");
  };

  const handleEndShift = () => {
    playBeep(220, "sawtooth", 0.15);
    setTimeout(() => playBeep(180, "sawtooth", 0.2), 120);

    setAppMode("CUSTOMER");
    setIsAdminUnlocked(false);
    localStorage.removeItem("lutho_admin_unlocked");
    triggerToast("Shift successfully ended. Stand down, Lutho Crew!", "info");
  };

  const handleDownloadTrainingManual = async () => {
    playBeep(620, "sine", 0.06);
    triggerToast("Building branded training PDF…", "info");
    try {
      await downloadTrainingManualPdf();
      triggerToast("Training manual downloaded — ready for your first session.", "success");
    } catch (error) {
      console.error("[LUTHO] Training PDF export failed:", error);
      triggerToast("Could not export the training PDF. Try again.", "info");
    }
  };

  // --- Add to Cart ---
  const handleAddToCart = (item: MenuItem) => {
    if (useRemoteGroupOrderFlow && isMyGroupOrderLocked) {
      triggerToast("Unlock your order to add more items — or wait for the group to submit.", "info");
      return;
    }
    setCart(prevCart => {
      const existing = prevCart.find(c => c.menuItem.id === item.id);
      if (existing) {
        return prevCart.map(c => 
          c.menuItem.id === item.id 
            ? { ...c, quantity: c.quantity + 1 } 
            : c
        );
      } else {
        return [...prevCart, { menuItem: item, quantity: 1 }];
      }
    });

    triggerToast(`Added ${item.name} to order`, "success");
  };

  // --- Modify Quantity ---
  const handleUpdateQuantity = (itemId: string, change: number) => {
    if (useRemoteGroupOrderFlow && isMyGroupOrderLocked) return;
    playBeep(change > 0 ? 580 : 380, "sine", 0.05);
    setCart(prevCart => {
      return prevCart.map(c => {
        if (c.menuItem.id === itemId) {
          const newQty = c.quantity + change;
          if (newQty <= 0) return null;
          return { ...c, quantity: newQty };
        }
        return c;
      }).filter((c): c is CartItem => c !== null);
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    playBeep(220, "sine", 0.1);
    setCart(prevCart => prevCart.filter(c => c.menuItem.id !== itemId));
  };

  // --- Calculations ---
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const submitRemoteGroupRound = async (draft: GroupOrderDraft, memberNames: string[]) => {
    const activeTableId = REMOTE_TABLE_ID;
    const assignedWaiterName =
      tableWaiterAssignments[activeTableId] || getNextAvailableWaiter(tableWaiterAssignments)?.name || "";
    const assignedWaiterProfile = staffProfiles.find((profile) => profile.name === assignedWaiterName);

    if (activeTableId && !tableWaiterAssignments[activeTableId] && assignedWaiterName) {
      persistTableAssignments({
        ...tableWaiterAssignments,
        [activeTableId]: assignedWaiterName,
      });
    }

    let combinedCart: CartItem[] = [];
    let mySubmittedOrder: HistoricOrder | null = null;
    let mySubmittedClaimCode: string | undefined;

    for (const memberName of memberNames) {
      const memberDraft = draft.members[memberName];
      if (!memberDraft) continue;
      const memberItems = deserializeCartItems(memberDraft.items);
      if (memberItems.length === 0) continue;

      combinedCart = [...combinedCart, ...memberItems];
      const memberTotal = memberItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
      const maxPrepSeconds = getOrderPrepSeconds(memberItems);
      const memberNotes = memberDraft.notes?.trim();
      const memberClaimCode = generateClaimCode();

      const newOrder: HistoricOrder = {
        id: `ord-${memberName.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        items: memberItems,
        total: memberTotal,
        status: "Sent",
        notes: memberNotes ? `${memberName}: ${memberNotes}` : `${memberName}'s remote order`,
        timerDuration: maxPrepSeconds,
        timerRemaining: maxPrepSeconds,
        timerExpired: false,
      };

      const staffOrder = buildStaffOrderRecord({
        order: newOrder,
        tableId: activeTableId,
        assignedStaffId: assignedWaiterProfile?.id,
        assignedStaffName: assignedWaiterName,
        orderedBy: memberName,
        groupRoundId: draft.roundId,
        isRemoteGroupOrder: true,
        claimCode: memberClaimCode,
      });

      if (memberName === myMemberName) {
        mySubmittedOrder = newOrder;
        mySubmittedClaimCode = memberClaimCode;
      }
      setIncomingOrders(prev => [staffOrder, ...prev]);

      await upsertSharedOrder(staffOrder);
    }

    if (mySubmittedOrder) {
      rememberMyOrderId(mySubmittedOrder.id);
      setHistoricOrders((prev) => [mySubmittedOrder!, ...prev]);
      openPassDownloadPrompt({
        order: mySubmittedOrder,
        tableId: activeTableId,
        orderedBy: myMemberName || "Guest",
        assignedStaffName: assignedWaiterName,
        isRemote: true,
        isGroup: true,
        groupRoundId: draft.roundId,
        claimCode: mySubmittedClaimCode,
      });
    }

    if (combinedCart.length > 0) {
      setMasterBillItems((prev) => mergeCartIntoBillItems(prev, combinedCart));
    }

    if (remoteSplitSession) {
      await resetGroupOrderRound(remoteSplitSession.id);
    }

    setCart([]);
    setOrderNotes("");
    setIsCartOpen(false);
    setHighlightKitchenOrders(true);
    setTimeout(() => setHighlightKitchenOrders(false), 4500);
    triggerToast(`Group order sent to kitchen — ${memberNames.length} guest${memberNames.length === 1 ? "" : "s"} locked in! Choose PDF or PNG for your claim pass.`, "success");
  };

  const handleLockGroupOrder = async () => {
    if (!remoteSplitSession) {
      triggerToast("Host or join a split session before ordering.", "info");
      return;
    }
    if (!myMemberName) {
      triggerToast("Set your guest name first.", "info");
      setIsGuestNameOpen(true);
      return;
    }
    if (isMyGroupOrderLocked) {
      triggerToast("You already locked in. Waiting for the rest of your group.", "info");
      return;
    }

    await syncMemberGroupDraft({
      sessionId: remoteSplitSession.id,
      memberName: myMemberName,
      items: cart,
      notes: orderNotes,
      locked: true,
    });
    playBeep(659.25, "sine", 0.1);
    triggerToast(
      cart.length === 0
        ? "Locked in with no items. Waiting for your group..."
        : "Locked in! Your picks are in the group order.",
      "success"
    );
  };

  const openPassDownloadPrompt = (payload: {
    order: HistoricOrder;
    tableId: string;
    orderedBy?: string;
    assignedStaffName?: string;
    isRemote?: boolean;
    isGroup?: boolean;
    groupRoundId?: string;
    claimCode?: string;
  }) => {
    setPassDownloadPrompt(payload);
    setPendingPassFormat("pdf");
    setLastOrderPassId(payload.order.id);
    window.setTimeout(() => {
      downloadOrderPassPdf(payload).catch((error) => console.error("[LUTHO] Pass PDF auto-download failed:", error));
    }, 400);
  };

  const handleRedownloadOrderPass = (order: HistoricOrder) => {
    const activeTableId = resolveActiveTableId(currentTableId);
    const guestLabel = myMemberName || currentPlayerName || sessionStorage.getItem("lutho_my_session_name") || "Guest";
    const assignedWaiterName = activeTableId
      ? (tableWaiterAssignments[activeTableId] || "")
      : "";
    const knownClaimCode =
      incomingOrders.find((o) => o.id === order.id)?.claimCode ||
      sharedStaffOrders.find((o) => o.id === order.id)?.claimCode;
    openPassDownloadPrompt({
      order,
      tableId: activeTableId,
      orderedBy: guestLabel,
      assignedStaffName: assignedWaiterName || undefined,
      isRemote: true,
      isGroup: !!remoteSplitSession && remoteOrderMode === "group",
      groupRoundId: groupOrderDraft?.roundId,
      claimCode: knownClaimCode,
    });
  };

  // --- Send Order To Kitchen ---
  const handleSendOrder = async () => {
    if (useRemoteGroupOrderFlow) {
      await handleLockGroupOrder();
      return;
    }

    if (cart.length === 0) {
      triggerToast("Your basket is empty!", "info");
      return;
    }

    const activeTableId = resolveActiveTableId(currentTableId);
    if (activeTableId !== currentTableId) {
      setCurrentTableId(activeTableId);
    }
    localStorage.setItem("lutho_active_customer_table", activeTableId);

    const maxPrepSeconds = getOrderPrepSeconds(cart);

    const tableService =
      activeTableId !== REMOTE_TABLE_ID && tableServices[activeTableId]?.active
        ? tableServices[activeTableId]
        : null;
    const orderTableId = tableService?.primaryTableId || activeTableId;
    const assignedWaiterName = activeTableId
      ? (
          tableService?.assignedStaffName ||
          tableWaiterAssignments[activeTableId] ||
          getNextAvailableWaiter(tableWaiterAssignments)?.name ||
          ""
        )
      : "";

    if (activeTableId && !tableWaiterAssignments[activeTableId] && assignedWaiterName) {
      void persistTableAssignments({
        ...tableWaiterAssignments,
        [activeTableId]: assignedWaiterName
      });
    }

    let partyId = tableService?.partyId;
    if (activeTableId !== REMOTE_TABLE_ID && !tableService) {
      partyId = createPartyId(activeTableId);
      const waiter = staffProfiles.find((profile) => profile.name === assignedWaiterName);
      void savePartyAcrossTables({
        partyId,
        primaryTableId: activeTableId,
        memberTableIds: [activeTableId],
        covers: 0,
        assignedStaffId: waiter?.id,
        assignedStaffName: assignedWaiterName,
      });
    }

    const newOrder: HistoricOrder = {
      id: "ord-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      items: [...cart],
      total: cartTotal,
      status: "Sent",
      notes: orderNotes.trim() || undefined,
      timerDuration: maxPrepSeconds,
      timerRemaining: maxPrepSeconds,
      timerExpired: false
    };

    setHistoricOrders(prev => [newOrder, ...prev]);
    rememberMyOrderId(newOrder.id);

    const assignedWaiterProfile = staffProfiles.find(profile => profile.name === assignedWaiterName);
    const guestLabel = myMemberName || "Guest";
    const claimCode = isRemoteTable ? generateClaimCode() : undefined;
    const staffOrder = buildStaffOrderRecord({
      order: newOrder,
      tableId: orderTableId,
      physicalTableId: activeTableId,
      partyId,
      assignedStaffId: assignedWaiterProfile?.id,
      assignedStaffName: assignedWaiterName,
      orderedBy: isRemoteTable ? guestLabel : undefined,
      isRemoteGroupOrder: useRemoteGroupOrderFlow,
      claimCode,
    });
    setIncomingOrders(prev => [staffOrder, ...prev]);
    await upsertSharedOrder(staffOrder);

    // Update Stamps: user earns stamp for each item ordered (maximum capped at 10)
    let addedStampsCount = cartTotalItems;
    let oldStamps = stamps;
    let newStampsVal = oldStamps + addedStampsCount;
    
    // Check for free drink reward activation
    if (newStampsVal >= 10) {
      newStampsVal = newStampsVal % 10;
      setTimeout(() => {
        triggerToast("🎉 LOYALTY UNLOCKED: Free Savanna or Windhoek Draft! Tell Lutho Crew!", "stamp");
      }, 1500);
    } else {
      setTimeout(() => {
        triggerToast(`Earned ${addedStampsCount} gold stamps on this order!`, "stamp");
      }, 1500);
    }
    
    setStamps(newStampsVal);
    
    // Remote solo guests sync their own local bill immediately too — no host required.
    const canSyncSplitBill = true;
    if (canSyncSplitBill) {
      setMasterBillItems((prev) => mergeCartIntoBillItems(prev, cart));
    }

    if (isRemoteTable) {
      openPassDownloadPrompt({
        order: newOrder,
        tableId: activeTableId,
        orderedBy: guestLabel,
        assignedStaffName: assignedWaiterName,
        isRemote: true,
        isGroup: false,
        claimCode,
      });
    }

    setCart([]);
    setOrderNotes("");
    setIsCartOpen(false);
    setHighlightKitchenOrders(true);
    setTimeout(() => {
      setHighlightKitchenOrders(false);
    }, 4500);

    triggerToast(
      isRemoteTable
        ? `Order sent! Choose PDF or PNG for your claim pass — find it again under Active Kitchen Orders.`
        : `Order sent to ${formatTableLabel(activeTableId)}! Lutho Crew will bring your drinks/food shortly.`,
      "success"
    );

    // Fast-mock status upgrade timers (guest view only — staff controls Firestore status)
    const orderId = newOrder.id;
    setTimeout(() => {
      setHistoricOrders(prev => 
        prev.map(o => o.id === orderId ? { ...o, status: "Preparing" } : o)
      );
    }, 12000);

    setTimeout(() => {
      setHistoricOrders(prev => 
        prev.map(o => o.id === orderId ? { ...o, status: "Served" } : o)
      );
    }, 35000);
  };

  useEffect(() => {
    if (!useRemoteGroupOrderFlow || !remoteSplitSession || !groupOrderDraft) return;
    if (groupOrderDraft.roundStatus !== "building") return;
    if (!isGroupOrderReadyToSubmit) return;
    if (submittingGroupRoundRef.current === groupOrderDraft.roundId) return;

    submittingGroupRoundRef.current = groupOrderDraft.roundId;
    const sessionId = remoteSplitSession.id;
    const members = [...displaySessionMembers];

    void (async () => {
      try {
        const claimed = await claimGroupRoundSubmission(sessionId, members);
        if (!claimed) {
          submittingGroupRoundRef.current = null;
          return;
        }
        await submitRemoteGroupRound(claimed, members);
      } catch (error) {
        console.error("[LUTHO] Group order submission failed:", error);
        submittingGroupRoundRef.current = null;
        triggerToast("Could not submit the group order. Try locking in again.", "info");
      }
    })();
  }, [
    useRemoteGroupOrderFlow,
    remoteSplitSession?.id,
    groupOrderDraft?.roundId,
    groupOrderDraft?.roundStatus,
    isGroupOrderReadyToSubmit,
    displaySessionMembers,
  ]);

  // --- Interactive Bill Splitting & Slicing Calculations ---
  
  // Total of master bill elements (original total)
  const billOriginalTotal = useMemo(() => {
    return masterBillItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [masterBillItems]);

  // Total paid of master bill elements so far
  const billAlreadyPaidTotal = useMemo(() => {
    return masterBillItems.reduce((sum, item) => sum + (item.price * item.paidCount), 0);
  }, [masterBillItems]);

  // Outstanding unpaid balance
  const billRemainingTotal = useMemo(() => {
    const remaining = billOriginalTotal - billAlreadyPaidTotal;
    return remaining > 0 ? remaining : 0;
  }, [billOriginalTotal, billAlreadyPaidTotal]);

  // Percentage of bill paid
  const billPaidPercent = useMemo(() => {
    if (billOriginalTotal === 0) return 0;
    return Math.min(100, Math.round((billAlreadyPaidTotal / billOriginalTotal) * 100));
  }, [billOriginalTotal, billAlreadyPaidTotal]);

  // Specific item payments total
  const selectedItemsPayTotal = useMemo(() => {
    return Object.entries(itemSharesToPay).reduce((sum, [id, qty]) => {
      const match = masterBillItems.find(m => m.id === id);
      return sum + (match ? (match.price as number) * Number(qty) : 0);
    }, 0);
  }, [itemSharesToPay, masterBillItems]);

  // Determine current active subtotal to pay depending on selection
  const currentPaySubtotal = useMemo(() => {
    if (billSplitMode === "EQUAL") {
      const equalShare = billRemainingTotal / splitCount;
      return Math.min(billRemainingTotal, parseFloat(equalShare.toFixed(2)));
    } else if (billSplitMode === "ITEMS") {
      return selectedItemsPayTotal;
    } else {
      const customVal = parseFloat(customAmountInput) || 0;
      return Math.min(billRemainingTotal, customVal);
    }
  }, [billSplitMode, billRemainingTotal, splitCount, selectedItemsPayTotal, customAmountInput]);

  // Calculate tip and final payment
  const currentPayTipAmount = useMemo(() => {
    return Math.round(currentPaySubtotal * (selectedTipPercent / 100));
  }, [currentPaySubtotal, selectedTipPercent]);

  const currentPayFinalAmount = useMemo(() => {
    return currentPaySubtotal + currentPayTipAmount;
  }, [currentPaySubtotal, currentPayTipAmount]);

  // Z-Format: when staff marks a bill request DONE, settle the guest bill in real time
  useEffect(() => {
    if (!pendingBillRequestId || !currentTableId) return;
    const request = serviceRequests.find(r => r.id === pendingBillRequestId);
    if (!request || request.status !== "DONE") return;

    setMasterBillItems(prev => prev.map(item => ({ ...item, paidCount: item.quantity })));
    setPendingBillRequestId(null);
    setBillRequestSubmitted(false);
    setTablesState(prev => ({ ...prev, [currentTableId]: "Available" }));
    triggerToast("Your bill has been settled by staff. Thank you!", "success");
  }, [serviceRequests, pendingBillRequestId, currentTableId]);

  useEffect(() => {
    if (!pendingBillRequestId) return;
    const request = serviceRequests.find((r) => r.id === pendingBillRequestId);
    if (!request) return;
    const details = resolveBillRequestDetails({
      note: request.note,
      billDetails: request.billDetails,
    });
    if (details) setSubmittedBillDetails(details);
  }, [pendingBillRequestId, serviceRequests]);

  // Update item selection share inside checklist
  const handleUpdateItemShare = (itemId: string, delta: number) => {
    const item = masterBillItems.find(m => m.id === itemId);
    if (!item) return;

    const currentSelected = itemSharesToPay[itemId] || 0;
    const maxUnpaid = item.quantity - item.paidCount;
    const nextVal = currentSelected + delta;

    if (nextVal >= 0 && nextVal <= maxUnpaid) {
      playBeep(delta > 0 ? 600 : 400, "sine", 0.05);
      setItemSharesToPay(prev => ({
        ...prev,
        [itemId]: nextVal
      }));
    } else {
      playBeep(200, "sawtooth", 0.08); // Out of bounds warning buzz
    }
  };

  // Export full table tab outstanding receipt
  const handleExportFullReceipt = () => {
    playBeep(480, "sine", 0.08);
    const divider = "------------------------------------------\n";
    const header = `🍻 Lutho (TABLE ${currentTableId}) 🍻\n` +
                   "      INDUSTRIAL TABLE ORDERING\n" +
                   `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n` +
                   "Server Staff: Lutho Crew (Live OS)\n" +
                   divider +
                   "QTY  ITEM                        PRICE\n" +
                   divider;
    
    let itemsBody = "";
    masterBillItems.forEach(item => {
      const padName = item.name.padEnd(26, " ").slice(0, 26);
      const padQty = String(item.quantity).padStart(2, " ");
      const totalCost = (item.quantity * item.price).toFixed(2);
      itemsBody += `${padQty}x  ${padName} R${totalCost}\n`;
    });

    const subTotalStr = `Master Subtotal:             R${masterBillItems.reduce((acc, i) => acc + (i.quantity * i.price), 0).toFixed(2)}\n`;
    const remainingStr = `Table Outstanding Balance:  R${billRemainingTotal.toFixed(2)}\n`;
    const footer = divider +
                   subTotalStr +
                   remainingStr +
                   "==========================================\n" +
                   "   Thank you for dining with us! 🔥\n" +
                   "   Powered by Lutho Guest OS\n";

    const fullText = header + itemsBody + footer;

    try {
      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Lutho_Table12_MasterReceipt_${Date.now().toString().slice(-6)}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      
      navigator.clipboard.writeText(fullText);
      triggerToast("📄 Master Receipt downloaded & copied to clipboard!", "success");
    } catch (e) {
      triggerToast("Failed to download receipt.", "info");
    }
  };

  const handleConfirmGuestName = () => {
    const trimmed = guestNicknameInput.trim().slice(0, 16);
    if (!trimmed) {
      triggerToast("What would you like to be called?", "info");
      return;
    }
    const formatted = trimmed.replace(/\s+/g, " ");
    setCurrentPlayerName(formatted);
    localStorage.setItem("lutho_current_player_name", formatted);
    sessionStorage.setItem("lutho_my_session_name", formatted);
    localStorage.setItem("lutho_guest_name_confirmed", "true");
    setSessionMembers((prev) => {
      const withoutYou = prev.filter((m) => m !== "You");
      return [formatted, ...withoutYou.filter((m) => m !== formatted)];
    });
    setIsGuestNameOpen(false);
    playBeep(520, "sine", 0.08);
    triggerToast(`Welcome, ${formatted}!`, "success");
  };

  const handleStaffTablePinSubmit = () => {
    if (!staffTablePinPrompt) return;
    if (staffTablePinInput !== "8034" && staffTablePinInput !== activeStaffProfile?.pin) {
      setStaffAuthError("Incorrect staff PIN.");
      playBeep(180, "sawtooth", 0.2);
      return;
    }
    setStaffAuthError("");
    setSelectedStaffTable(staffTablePinPrompt);
    setStaffTablePinPrompt(null);
    setStaffTablePinInput("");
    triggerToast(`${formatTableLabel(staffTablePinPrompt)} unlocked.`, "success");
  };

  // Open bill splitter (Z-Format: no in-app payments)
  const handleRequestBill = () => {
    playBeep(440, "sine", 0.08);
    if (!currentTableId) {
      triggerToast("No active table linked to this session.", "info");
      return;
    }
    setItemSharesToPay({});
    setCustomAmountInput("");
    setBillRequestSubmitted(false);
    setPendingBillRequestId(null);
    setSubmittedBillDetails(null);
    setIsBillOpen(true);
  };

  const handleSubmitBillRequest = async () => {
    if (!currentTableId) {
      triggerToast("No active table linked to this session.", "info");
      return;
    }
    if (currentPaySubtotal <= 0 && billRemainingTotal > 0) {
      triggerToast("Select your share of the bill before requesting.", "info");
      return;
    }

    playBeep(520, "sine", 0.08);
    const billDetails = buildBillRequestDetails({
      splitMode: billSplitMode,
      guestSubtotal: currentPaySubtotal,
      tipAmount: currentPayTipAmount,
      tipPercent: selectedTipPercent,
      tableTotal: billOriginalTotal,
      tableRemaining: billRemainingTotal,
      tableAlreadyPaid: billAlreadyPaidTotal,
      splitCount: billSplitMode === "EQUAL" ? splitCount : undefined,
      masterBillItems,
      itemSharesToPay: billSplitMode === "ITEMS" ? itemSharesToPay : undefined,
      guestName: myMemberName || currentPlayerName || undefined,
    });
    const note = formatBillRequestStaffSummary(billDetails);

    const tableService =
      tableServices[currentTableId]?.active ? tableServices[currentTableId] : null;
    const requestTableId = tableService?.primaryTableId || currentTableId;
    const waiter =
      tableService?.assignedStaffName ||
      tableWaiterAssignments[currentTableId] ||
      getNextAvailableWaiter(tableWaiterAssignments)?.name ||
      "";
    const assignedProfile = staffProfiles.find(profile => profile.name === waiter);
    const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const payload = omitUndefined({
      id: requestId,
      type: "BILL" as const,
      tableId: requestTableId,
      partyId: tableService?.partyId,
      status: "OPEN" as const,
      createdAt: Date.now(),
      assignedStaffId: assignedProfile?.id,
      assignedStaffName: assignedProfile?.name,
      note,
      billDetails,
    });

    setServiceRequests(prev => [payload as ServiceRequest, ...prev]);
    setPendingBillRequestId(requestId);
    setBillRequestSubmitted(true);
    setSubmittedBillDetails(billDetails);

    try {
      await setDoc(doc(db, "service_requests", requestId), payload);
      triggerToast(`Bill request sent: ${formatBillRequestStaffSummary(billDetails)}. Staff will settle at your table.`, "success");
    } catch (error) {
      console.error(error);
      triggerToast("Could not send bill request. Try again.", "info");
    }
  };

  // Clever filtering states (pills and Search)
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getSubcategory = (item: MenuItem): string => {
    if (item.category === "EAT") {
      return item.sectionName || "other";
    } else {
      return item.subsectionName || item.sectionName || "other";
    }
  };

  // Helper lists to map items inside current categories
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      // 1. Basic category test (EAT vs DRINK)
      if (item.category !== activeCategory) return false;

      // 2. Subcategory pill test
      if (activeSubcategory !== "all") {
        const sub = getSubcategory(item);
        if (sub !== activeSubcategory) return false;
      }

      // 3. Search query test
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });
  }, [menuItems, activeCategory, activeSubcategory, searchQuery]);

  const isStaff = appMode === "STAFF";

  return (
    <>
      {/* snazzy rapid splash screen with interactive micro beeps */}
      <AnimatePresence>
        {showSplash && !onAdminKioskRoute && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="lutho-dark-surface fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 text-center select-none font-sans bg-cover bg-center"
            style={{ backgroundImage: "url('')" }}
          >
            {/* Dark glass backdrop overlay for heavy contrast rendering */}
            <div className="absolute inset-0 bg-black/55 backdrop-blur-xs pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45)_0%,transparent_80%)] pointer-events-none" />
            
            <div className="flex flex-col items-center justify-center gap-5 max-w-sm relative z-10">
              {/* Spinning logo item - way bigger on no background */}
              <motion.div
                initial={{ scale: 0.75, opacity: 0, rotate: -15 }}
                animate={{ scale: 1.15, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 12 }}
                className="relative cursor-pointer"
                onClick={() => {
                  playBeep(880, "sine", 0.05);
                }}
              >
                <div className="absolute inset-0 rounded-full bg-[#3E5E93]/25 blur-3xl animate-pulse" />
                <img
                  src="/lutho-logo.png"
                  alt="Lutho Logo"
                  className="w-56 h-56 md:w-64 md:h-64 object-contain relative z-10 transition-transform duration-300 drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Title brand typography */}
              <div className="space-y-1">
                <motion.h1
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="font-display tracking-[0.25em] text-3xl font-black text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
                >
                  <span>OS</span>
                </motion.h1>
              </div>

              {/* Cool fitting quote styled for brand consistency */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="my-1.5 px-4 py-2 bg-black/60 backdrop-blur-md border border-neutral-900 rounded-xl max-w-[280px]"
              >
                <p className="text-amber-500 font-sans italic text-[11px] md:text-xs font-black tracking-wider uppercase leading-tight drop-shadow-sm">
                  "WE'RE NOT FAST FOOD, WE'RE LUTHO. SMASH. GRAB. REPENT."
                </p>
              </motion.div>

              {/* Keyword flasher component */}
              <SplashKeywords playBeep={playBeep} onComplete={() => {
                setShowSplash(false);
              }} />

              {/* Quick skip trigger */}
              <button
                type="button"
                onClick={() => {
                  playBeep(700, "sine", 0.05);
                  setShowSplash(false);
                }}
                className="mt-4 px-5 py-2 bg-black/85 hover:bg-neutral-950 border border-neutral-800 text-white text-[9px] font-mono uppercase tracking-widest rounded-xl transition-all cursor-pointer transform active:scale-95 shadow-md font-bold hover:border-[#3E5E93]/40"
              >
                Skip Intro ⚡
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        id="lutho-os-container" 
        className={`w-full ${isStaff ? "max-w-none" : "max-w-[500px]"} mx-auto min-h-screen bg-[#121212] text-white flex flex-col relative shadow-2xl border-x border-[#2C2C2E]/50 ${isStaff ? "md:rounded-none border-0" : "md:rounded-3xl"} overflow-x-hidden grunge-pattern select-none font-sans ${isStaff ? "pb-0" : "pb-32"} transition-all duration-350 theme-${theme}`}
      >
      
      {/* Dynamic Toast System */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[440px] px-4 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, type: "spring", stiffness: 200, damping: 15 }}
              className={`p-4 rounded-xl shadow-2xl border border-black backdrop-blur-md flex items-center justify-between text-sm font-sub font-black pointer-events-auto ${
                toast.type === "success" 
                  ? "bg-[#1C1C1E] text-[#3E5E93] border-l-4 border-l-[#3E5E93]"
                  : toast.type === "stamp"
                  ? "bg-[#2C2C2E] text-white border-l-4 border-l-orange-400 border-orange-400/30"
                  : "bg-black text-[#A0A0A0] border-l-4 border-l-zinc-500"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === "success" ? <Check className="w-5 h-5 text-[#3E5E93] shrink-0" /> : 
                  toast.type === "stamp" ? (
                    <img 
                      src="/lutho-stamp-logo.png" 
                      alt="Stamp" 
                      className="w-6 h-6 object-contain shrink-0 animate-bounce rounded-full bg-[#1C1C1E]" 
                      referrerPolicy="no-referrer"
                    />
                  ) : 
                  <Clock className="w-5 h-5 text-zinc-400 shrink-0" />}
                <p className="tracking-wide uppercase leading-tight">{toast.message}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setToasts(prev => prev.filter(t => t.id !== toast.id));
                }}
                className="ml-3 text-zinc-500 hover:text-white transition-colors"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {onAdminKioskRoute && !(appMode === "STAFF" && activeStaffProfile) ? (
        <div
          className="lutho-dark-surface min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6 relative z-55 text-white font-sans overflow-y-auto select-none w-full max-w-[500px] mx-auto border-x border-[#1F1F22] shadow-[0_0_80px_rgba(0,0,0,0.85)]"
          style={{ backgroundImage: "url('')" }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

          <div className="w-full max-w-sm relative z-10 flex flex-col items-center gap-5">
            <img
              src="/lutho-logo.png"
              alt="Lutho Logo"
              className="w-36 h-36 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
              referrerPolicy="no-referrer"
            />

            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#3E5E93]/20 border border-[#3E5E93]/50 rounded-full text-[10px] font-sans font-black tracking-widest text-[#3E5E93] uppercase mb-3">
                Staff kiosk
              </div>
              <h2 className="font-display font-black text-white text-xl tracking-tight uppercase">
                Enter staff PIN
              </h2>
              <p className="text-[11px] text-zinc-400 mt-2 font-mono uppercase tracking-wider">
                Universal access code for floor operations
              </p>
            </div>

            <div className="w-full bg-white border-2 border-[#3E5E93] rounded-3xl p-5 shadow-2xl space-y-4">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={adminPinInput}
                onChange={(e) => {
                  setAdminPinInput(e.target.value.replace(/\D/g, ""));
                  setStaffAuthError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleUniversalStaffLogin()}
                placeholder="Staff PIN"
                className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3.5 text-base text-black text-center tracking-[0.35em] focus:outline-none focus:border-[#3E5E93] focus:ring-2 focus:ring-[#3E5E93]/30"
                autoFocus
              />

              {staffAuthError && (
                <p className="text-red-600 text-xs font-mono text-center">{staffAuthError}</p>
              )}

              <button
                type="button"
                onClick={handleUniversalStaffLogin}
                disabled={adminPinInput.trim().length < 4}
                className="w-full py-3.5 bg-[#3E5E93] hover:bg-[#d67a32] text-black font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Open floor layout
              </button>
            </div>
          </div>
        </div>
      ) : appMode === "CUSTOMER" ? (
        <>
          {!hasTableSlug ? (
            <div 
              className="lutho-dark-surface min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6 relative z-55 text-white font-sans overflow-y-auto select-none w-full max-w-[500px] mx-auto border-x border-[#1F1F22] shadow-[0_0_80px_rgba(0,0,0,0.85)]"
              style={{ backgroundImage: "url('')" }}
            >
              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

              <div className="w-full max-w-sm text-center mb-5 mt-4 animate-fade-in relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative cursor-pointer mb-1"
                  onClick={() => {
                    playBeep(880, "sine", 0.05);
                    setStaffLogoClicks((prev) => {
                      const next = prev + 1;
                      if (next >= 5) {
                    setStaffGateUnlocked(true);
                        setShowStaffGate(true);
                        triggerToast("Staff console unlocked", "success");
                        return 0;
                      }
                      return next;
                    });
                  }}
                >
                  <img
                    src="/lutho-logo.png"
                    alt="Lutho Logo"
                    className="w-40 h-40 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                {staffLogoClicks > 0 && (
                  <p className="text-[10px] text-zinc-400 mt-2 font-mono">
                    Staff gate: {staffLogoClicks}/5
                  </p>
                )}

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#3E5E93]/25 border border-[#3E5E93]/40 rounded-full text-[10px] font-sans font-black tracking-widest text-[#3E5E93] uppercase mb-3.5">
                  Digital Ordering
                </div>

                <h2 className="font-display font-black text-white text-xl tracking-tight uppercase">
                  Remote ordering
                </h2>
                <p className="text-[11px] text-zinc-350 mt-2 leading-relaxed font-sans max-w-xs mx-auto bg-black/70 border border-zinc-800/80 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg">
                  Scan the QR below to order from anywhere — burgers, drinks, and bill splitting included.
                </p>
              </div>

              <div className="w-full max-w-sm bg-black/60 backdrop-blur-lg border border-zinc-800/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden mb-5 flex flex-col items-center gap-4 z-10">
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#3E5E93] to-transparent" />

                {(() => {
                  const remoteUrl = getSecureGuestUrl("14");
                  return (
                    <>
                      <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-4 flex flex-col items-center gap-3 text-center">
                        <div className="font-display font-black text-[#3E5E93] text-xs uppercase tracking-widest">
                          Remote order QR
                        </div>
                        <div className="pointer-events-none">
                          <HalftoneQRCode text={remoteUrl} size={184} />
                        </div>
                        <a
                          href={remoteUrl}
                          className="w-full h-11 bg-[#3E5E93] hover:bg-orange-500 font-sans text-[#121214] font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-[0_4px_15px_rgba(62, 94, 147,0.3)]"
                        >
                          Start remote order
                        </a>
                      </div>

                      <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
                        For staff: click the logo 5 times.
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : !isValidTable ? (
            <div 
              className="lutho-dark-surface min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 relative z-55 text-white font-sans overflow-y-auto select-none w-full max-w-[500px] mx-auto border-x border-[#1F1F22] shadow-[0_0_80px_rgba(0,0,0,0.85)]"
              style={{ backgroundImage: "url('')" }}
            >
              {/* Warm gradient and blur overlay for high contrast and beautiful branding overlay */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xs pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />

              {/* Lutho Brand Header */}
              <div className="w-full max-w-sm text-center mb-6 animate-fade-in relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.82, opacity: 0, rotate: -5 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  className="mb-2"
                  onClick={() => playBeep(220, "sawtooth", 0.15)}
                >
                  <img
                    src="/lutho-logo.png"
                    alt="Lutho Logo"
                    className="w-36 h-36 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/60 border border-red-500/40 rounded-full text-[9px] font-mono font-black tracking-widest text-[#3E5E93] uppercase mb-4 shadow-[0_0_12px_rgba(239,68,68,0.2)] animate-pulse">
                  ⚠️ 404 TABLE NOT FOUND
                </div>
                
                <h2 className="font-display font-black text-white text-2xl tracking-wide uppercase">
                  LOST IN THE SMASH!
                </h2>
                
                {/* Error Frame Box */}
                <div className="w-full max-w-sm bg-black/75 border border-zinc-800/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden mt-4 text-center">
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-red-500 via-[#3E5E93] to-red-500" />
                  
                  <div className="flex justify-center mb-2.5">
                    <ShieldAlert className="w-12 h-12 text-[#3E5E93] animate-bounce" />
                  </div>
                  
                  <h3 className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2">
                    ERROR CONSOLE CODE: LUTHO-404-COORDINATES-VOID
                  </h3>
                  
                  <p className="text-[11.5px] text-zinc-300 leading-relaxed font-sans font-medium px-1">
                    Whoops! Looks like this tabletop coordinate does not exist on our restaurant floor plan. Lutho dine-in tables range from <strong className="text-[#3E5E93]">Table 1</strong> to <strong className="text-[#3E5E93]">Table 13</strong>, plus our <strong className="text-[#3E5E93]">Remote Table</strong> for online orders.
                  </p>
                  
                  <p className="text-[10px] text-zinc-500 mt-3 font-mono">
                    You might have scanned a rogue / decommissioned QR code or attempted a manual coordinate hop.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-sm flex flex-col gap-2 relative z-10 px-2">
                <button
                  onClick={() => {
                    playBeep(600, "sine", 0.08);
                    window.location.search = ""; 
                  }}
                  className="w-full h-12 bg-[#3E5E93] hover:bg-orange-500 hover:scale-[1.02] font-sans text-[#121214] font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-[0_4px_15px_rgba(62, 94, 147,0.3)] flex items-center justify-center gap-1.5 active:scale-95"
                >
                  ← RETURN TO TABLE SELECTION BOARD
                </button>

                <button
                  onClick={() => {
                    playBeep(440, "sawtooth", 0.25);
                    triggerToast("SOS SIGNAL TRANSMITTED: Flight captain summoned!", "success");
                  }}
                  className="w-full h-11 bg-zinc-950/70 hover:bg-[#18181B] border border-zinc-850 hover:border-red-500/30 text-white font-mono text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  🔔 SIGNAL FLIGHT CAPTAIN (SOS)
                </button>
              </div>

              {/* Footer Secure line */}
              <div className="w-full max-w-sm text-center mt-6 text-[9px] text-[#A1A1AA]/50 relative z-10 font-mono tracking-widest uppercase">
                🔒 LUTHO OS SECURITY SUITE V1.0
              </div>
            </div>
          ) : !isTableUnlocked ? (
            <div 
              className="lutho-dark-surface min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 relative z-55 text-white font-sans overflow-y-auto select-none w-full max-w-[500px] mx-auto border-x border-[#1F1F22] shadow-[0_0_80px_rgba(0,0,0,0.85)]"
              style={{ backgroundImage: "url('')" }}
            >
              {/* Warm gradient and blur overlay for high contrast and beautiful branding overlay */}
              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

              {/* Lutho Brand Header */}
              <div className="w-full max-w-sm text-center mb-5 mt-4 animate-fade-in relative z-10 flex flex-col items-center">
                {/* Large brand logo */}
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative cursor-pointer mb-1"
                  onClick={() => playBeep(880, "sine", 0.05)}
                >
                  <img
                    src="/lutho-logo.png"
                    alt="Lutho Logo"
                    className="w-40 h-40 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#3E5E93]/25 border border-[#3E5E93]/40 rounded-full text-[10px] font-sans font-black tracking-widest text-[#3E5E93] uppercase mb-3.5">
                  🍔 SECURE YOUR SESSION
                </div>
                
                <h2 className="font-display font-black text-white text-xl tracking-tight uppercase">
                  ENTER TABLE {currentTableId || "12"} PASSCODE
                </h2>
                <p className="text-[11.5px] text-zinc-200 mt-2 leading-relaxed font-sans max-w-xs mx-auto bg-black/80 border border-zinc-800/80 px-4 py-2.5 rounded-xl backdrop-blur-md shadow-lg">
                  📍 Please enter the 4-digit security PIN printed at the bottom of your physical tabletop card.
                </p>
              </div>

              {/* Security Shield Lock Status Frame */}
              <div className="w-full max-w-sm bg-black/60 backdrop-blur-lg border border-zinc-800/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden mb-5 flex flex-col items-center gap-4 z-10">
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#3E5E93] to-transparent" />
                
                {/* Active ordering prompt */}
                <div className="w-full text-center space-y-0.5">
                  <p className="text-[10px] font-sub font-black uppercase tracking-wider text-amber-500">
                    ⚡ rock your hunger ⚡
                  </p>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Fast order smash, instant payouts, and live bills!
                  </p>
                </div>

                {/* Bullet Display cells for typed PIN code */}
                <div className="flex gap-3 justify-center my-1.5">
                  {[0, 1, 2, 3].map((idx) => {
                    const char = pinInput[idx];
                    return (
                      <div 
                        key={idx}
                        className={`w-12 h-14 rounded-xl border border-zinc-800 shadow-md flex items-center justify-center transition-all bg-black font-display font-black text-lg ${
                          char 
                            ? "border-[#3E5E93] text-[#3E5E93] shadow-[0_0_12px_rgba(62, 94, 147,0.25)]" 
                            : "text-zinc-700"
                        }`}
                      >
                        {char ? "●" : "○"}
                      </div>
                    );
                  })}
                </div>

                {/* Lockout Screen overlay block */}
                {securityLockoutSecs > 0 && (
                  <div className="absolute inset-2 bg-[#09090B]/95 backdrop-blur-md rounded-xl flex flex-col items-center justify-center text-center p-4">
                    <ShieldAlert className="w-8 h-8 text-[#3E5E93] animate-bounce mb-2" />
                    <span className="text-xs font-sans font-black text-[#3E5E93] uppercase tracking-widest">
                      RATE LIMIT ENFORCED
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-1 max-w-[220px] leading-relaxed">
                      Please try again in a few moments, or ask a friendly flight captain / waiter for assistance.
                    </p>
                    <div className="mt-4 px-4 py-2 bg-orange-950/40 border border-orange-500/20 rounded-lg text-xs font-mono font-black text-[#3E5E93] tracking-wider animate-pulse">
                      RETRY IN: {securityLockoutSecs}s
                    </div>
                  </div>
                )}
              </div>

              {/* Numerical Virtual Tactile Keypad */}
              <div className="w-full max-w-sm grid grid-cols-3 gap-2.5 px-2 relative z-10">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    disabled={securityLockoutSecs > 0}
                    onClick={() => {
                      if (pinInput.length < 4) {
                        playBeep(450 + num * 20, "sine", 0.05);
                        setPinInput(prev => prev + num);
                      }
                    }}
                    className="h-14 bg-zinc-950/80 hover:bg-[#18181B] active:bg-zinc-900 border border-zinc-850 text-white font-display font-black text-lg rounded-xl transition-all active:scale-95 flex items-center justify-center select-none cursor-pointer hover:border-[#3E5E93]/30 disabled:opacity-40 disabled:pointer-events-none backdrop-blur-xs"
                  >
                    {num}
                  </button>
                ))}
                
                {/* Backspace/Clear button */}
                <button
                  type="button"
                  disabled={securityLockoutSecs > 0}
                  onClick={() => {
                    playBeep(320, "sine", 0.05);
                    setPinInput(prev => prev.slice(0, -1));
                  }}
                  className="h-14 bg-zinc-950/55 hover:bg-[#18181B] border border-zinc-850 text-zinc-450 hover:text-white font-mono text-xs font-black uppercase rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer disabled:opacity-40 backdrop-blur-xs"
                >
                  Clear
                </button>

                {/* Zero button */}
                <button
                  type="button"
                  disabled={securityLockoutSecs > 0}
                  onClick={() => {
                    if (pinInput.length < 4) {
                      playBeep(450, "sine", 0.05);
                      setPinInput(prev => prev + "0");
                    }
                  }}
                  className="h-14 bg-zinc-950/80 hover:bg-[#18181B] border border-zinc-850 text-white font-display font-black text-lg rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer hover:border-[#3E5E93]/30 disabled:opacity-40 backdrop-blur-xs"
                >
                  0
                </button>

                {/* OK Submit button */}
                <button
                  type="button"
                  disabled={securityLockoutSecs > 0 || pinInput.length < 4}
                  onClick={() => handlePinSubmit(pinInput)}
                  className="h-14 bg-[#3E5E93] hover:bg-orange-500 font-sans text-[#121214] font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-[0_4px_15px_rgba(62, 94, 147,0.3)] disabled:opacity-30 disabled:pointer-events-none"
                >
                  OK
                </button>
              </div>

              {/* Extra Security Context Lines */}
              <div className="w-full max-w-sm text-center mt-6 text-[10px] text-[#A1A1AA] space-y-1 relative z-10">
                <p className="flex items-center justify-center gap-1 font-sans uppercase tracking-widest font-black text-zinc-500 text-[9px]">
                  <span>🔒 SECURE ENCRYPTED SESSION</span>
                </p>
              </div>

              {/* Back to Home simulation option if they got the wrong table */}
              <button
                onClick={() => {
                  playBeep(520, "sine", 0.05);
                  window.location.search = ""; 
                }}
                className="mt-6 text-[10.5px] font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-all cursor-pointer bg-black/60 hover:bg-black/90 px-3.5 py-1.5 rounded-full border border-zinc-800 relative z-10 backdrop-blur-xs"
              >
                ← Back to Table Selection Board
              </button>
            </div>
          ) : (
            <>
              {/* HEADER SECTION (Table & Waiter Area) */}
      <header className="p-3 bg-[#1C1C1E] border-b-2 border-black/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 relative z-20 shadow-lg">
        {/* Left segment: Logo combined and CONTROL button */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <img
            src="/lutho-logo.png"
            alt="Lutho Logo"
            className="h-14 md:h-16 object-contain cursor-pointer hover:rotate-3 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onClick={() => {
              playBeep(600, "sine", 0.08);
              setIsHelpOpen(true);
              setStaffLogoClicks((prev) => {
                const next = prev + 1;
                if (next >= 5) {
                  setStaffGateUnlocked(true);
                  setShowStaffGate(true);
                  triggerToast("Admin gate unlocked", "success");
                  return 0;
                }
                return next;
              });
            }}
            title="Click for Onboarding Assistant"
          />
          
          {!hasTableSlug && (
            <button
              type="button"
              onClick={() => {
                playBeep(520, "sine", 0.08);
                setIsControlMenuOpen(true);
              }}
              className="px-3 py-1.5 bg-[#3E5E93] hover:bg-orange-400 text-black font-sub font-black text-[9px] uppercase rounded-xl tracking-wider transition-all transform active:scale-95 cursor-pointer flex items-center gap-1 shadow-md border border-[#3E5E93] font-bold shrink-0"
            >
              <Sliders className="w-3 h-3" />
              <span>CONTROL ⚡</span>
            </button>
          )}
        </div>

        {/* Right segment: Smaller compact waiter section */}
        <div className="bg-[#121212]/90 px-3 py-1.5 rounded-xl border border-zinc-900 flex items-center justify-between gap-3 shadow-inner sm:max-w-xs flex-1 sm:flex-initial flex-wrap pb-2 sm:pb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 shrink-0 rounded-full bg-[#2C2C2E] border border-[#3E5E93]/25 flex items-center justify-center overflow-hidden"
              aria-label={formatTableLabel(currentTableId)}
            >
              {currentTableId === REMOTE_TABLE_ID ? (
                <Globe className="w-3.5 h-3.5 text-[#3E5E93]" aria-hidden="true" />
              ) : (
                <span className="font-display text-[10px] text-[#3E5E93] font-bold leading-none">
                  {formatTableShort(currentTableId || "12")}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[8px] uppercase font-mono tracking-wider text-zinc-500 leading-tight truncate">
                {currentPlayerName ? (
                  <>Hey, <span className="text-[#3E5E93] font-sans font-bold">{currentPlayerName}</span></>
                ) : (
                  <>Staff: <span className="text-white font-sans font-bold">Lutho Crew</span></>
                )}
              </p>
              <p className="text-[8px] uppercase font-mono tracking-wider text-zinc-500 leading-tight truncate">
                {formatTableLabel(currentTableId)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                playBeep(560, "sine", 0.06);
                setIsHelpOpen(true);
              }}
              className="cursor-pointer px-2.5 py-1 border border-[#3E5E93]/50 bg-[#3E5E93]/10 rounded-md font-sub font-black text-[10px] uppercase tracking-wider flex items-center gap-1 text-[#3E5E93] hover:bg-[#3E5E93] hover:text-black transition-all duration-300 transform active:scale-95 font-bold"
              title="How LUTHO works"
            >
              <HelpCircle className="w-2.5 h-2.5" />
              <span>How to</span>
            </button>
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="cursor-pointer px-2.5 py-1 border border-zinc-800 bg-zinc-900 rounded-md font-sub font-black text-[10px] uppercase tracking-wider flex items-center gap-1 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-300 transform active:scale-95 font-bold"
              title="Terms & Conditions"
            >
              <span>Terms</span>
            </button>
            <button
              onClick={() => {
                playBeep(440, "sine", 0.05);
                setIsCustomerChatOpen(true);
              }}
              className="cursor-pointer px-2.5 py-1 border border-zinc-800 bg-zinc-900 rounded-md font-sub font-black text-[10px] uppercase tracking-wider flex items-center gap-1 text-zinc-400 hover:text-[#3E5E93] hover:border-[#3E5E93]/40 transition-all duration-300 transform active:scale-95 font-bold"
            >
              <MessageSquare className="w-2.5 h-2.5" />
              <span>Chat</span>
            </button>

            {staffGateUnlocked && (
              <button
                type="button"
                onClick={() => {
                  playBeep(520, "sine", 0.06);
                  setShowStaffGate(true);
                }}
                className="cursor-pointer px-2.5 py-1 border border-[#3E5E93]/35 bg-[#3E5E93]/10 rounded-md font-sub font-black text-[10px] uppercase tracking-wider flex items-center gap-1 text-[#3E5E93] hover:bg-[#3E5E93] hover:text-black transition-all duration-300 transform active:scale-95 font-bold"
                title="Open staff console"
              >
                <span>Staff</span>
              </button>
            )}

            <button
              onClick={handleCallWaiter}
              className={`cursor-pointer px-2.5 py-1 border rounded-md font-sub font-black text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all duration-300 transform active:scale-95 ${
                waiterSummoned
                  ? "bg-red-950 border-red-500 text-red-500 animate-pulse font-bold"
                  : "border-[#3E5E93]/70 text-[#3E5E93] hover:bg-[#3E5E93] hover:text-black hover:shadow-md"
              }`}
            >
              <Bell className={`w-2.5 h-2.5 ${waiterSummoned ? "animate-bounce" : ""}`} />
              {waiterSummoned ? "Summon" : "Call"}
            </button>
          </div>
        </div>
      </header>

      {/* Scrolling specials announcement ticker — always renders, never blank */}
      {(() => {
        const FALLBACK_ANNOUNCEMENTS = [
          "Welcome to LUTHO Rondebosch",
          "Smashburgers • Loaded Shakes • Wings",
          "Remote order & collect available",
          "Scan your table QR to get started",
          "Ask staff about today's specials",
        ];
        const specialStrings = specials
          .filter((s) => s && (s.title || s.deal || s.description))
          .map((s) => {
            const title = (s.title || "Special").toString().trim();
            const deal = (s.deal || "").toString().trim();
            return deal ? `${title} — ${deal}` : title;
          });
        const marqueeItems = specialStrings.length > 0 ? specialStrings : FALLBACK_ANNOUNCEMENTS;
        const marqueeText = marqueeItems.join("   •   ");
        return (
          <div className="mx-3 mt-2 rounded-xl border border-zinc-900 bg-black/55 overflow-hidden min-h-[26px]">
            <style>{`
              @keyframes luthoMarquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
            <div className="py-1.5 px-3 text-[10px] font-mono uppercase tracking-widest text-[#3E5E93] whitespace-nowrap overflow-hidden">
              <div
                className="inline-flex"
                style={{
                  animation: "luthoMarquee 26s linear infinite",
                }}
              >
                <span className="pr-8">{marqueeText}</span>
                <span className="pr-8">{marqueeText}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* DYNAMIC TOP KITCHEN LIVE TRACKER */}
      {(() => {
        const activeKitchenOrders = kitchenFeedOrders.filter(o => o.status === "Sent" || o.status === "Preparing");
        if (activeKitchenOrders.length === 0) return null;

        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              borderColor: highlightKitchenOrders ? "#3E5E93" : "rgba(44, 44, 46, 0.4)",
              boxShadow: highlightKitchenOrders 
                ? "0 0 20px rgba(62, 94, 147, 0.45)" 
                : "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
            }}
            transition={{ type: "spring", damping: 18, stiffness: 155 }}
            className={`mx-4 mt-4 bg-[#1C1C1E] border-2 rounded-xl p-3 flex flex-col gap-2.5 relative overflow-hidden transition-all duration-300 shadow-xl`}
          >
            {/* Pulsing indicator line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-600 to-[#3E5E93]" />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#3E5E93] font-bold">
                  Live Kitchen Feed
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold bg-black/40 px-2 py-0.5 rounded">
                ● Connected to {formatTableLabel(currentTableId)}
              </span>
            </div>

            <div className="flex gap-2.5 items-center">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-600/10 to-[#3E5E93]/10 flex items-center justify-center font-display text-xl border border-[#3E5E93]/20 shrink-0">
                🍔
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sub font-black text-xs text-white uppercase truncate">
                  {activeKitchenOrders[0].items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  <span className="text-[9px] text-[#A0A0A0] uppercase font-mono">Status:</span>
                  <span className="text-[9.5px] text-[#3E5E93] uppercase font-mono font-black tracking-widest animate-pulse">
                    {activeKitchenOrders[0].status === "Sent" ? "KITCHEN RECEIVED" : "CHEF PREPARING..."}
                  </span>
                  <span className="text-zinc-500 font-mono text-[9.5px] font-bold">
                    ({getElapsedMinutesAgo(activeKitchenOrders[0].createdAt, activeKitchenOrders[0].timestamp)})
                  </span>
                </div>
                
                {/* Designated Server Info */}
                <p className="text-[9.5px] text-zinc-400 font-mono mt-1">
                  Designated Server: <strong className="text-emerald-400 font-black">{tableWaiterAssignments[currentTableId] || "General"} ⚡</strong>
                </p>

                {/* VISUAL TIMER COUNTDOWN AND COMPENSATION TRIGGER */}
                {activeKitchenOrders[0].timerRemaining !== undefined && (
                  <div className="mt-2 bg-black/60 border border-zinc-900 rounded-xl p-2 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px] font-mono leading-none">
                      <span className="text-zinc-500 uppercase tracking-wider">LUTHO SPEED STANDARD:</span>
                      {activeKitchenOrders[0].timerRemaining > 0 ? (
                        <span className="text-orange-400 font-black animate-pulse font-bold">{formatTimerRemaining(activeKitchenOrders[0].timerRemaining)} remaining</span>
                      ) : (
                        <span className="text-red-500 font-black flex items-center gap-1">
                          ⚠️ TIMED OUT (+🍦 FREE SUNDAE)
                        </span>
                      )}
                    </div>
                    {/* Visual bar tracker */}
                    <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          activeKitchenOrders[0].timerRemaining > 15 
                            ? "bg-emerald-500" 
                            : activeKitchenOrders[0].timerRemaining > 0 
                              ? "bg-amber-500" 
                              : "bg-red-500 animate-pulse w-full"
                        }`}
                        style={{ 
                          width: activeKitchenOrders[0].timerRemaining > 0 
                            ? `${(activeKitchenOrders[0].timerRemaining / (activeKitchenOrders[0].timerDuration || 45)) * 100}%` 
                            : "100%" 
                        }}
                      />
                    </div>
                    {activeKitchenOrders[0].timerRemaining === 0 ? (
                      <p className="text-[8.5px] leading-tight text-white font-black uppercase mt-0.5 animate-bounce text-center bg-red-950/40 py-1 rounded border border-red-950/80">
                        🎁 TIMER DEFEATED! Claim your free Apology Ice Cream Sundae from {tableWaiterAssignments[currentTableId]?.split(" ")[0] || "General"}! 🍦
                      </p>
                    ) : (
                      <p className="text-[8px] text-zinc-500 font-mono italic">
                        If our crew doesn't deliver before countdown expires, you'll earn a free Sundae!
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button 
                onClick={() => {
                  playBeep(450, "sine", 0.05);
                  const element = document.getElementById("active-kitchen-orders-section");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    setHighlightKitchenOrders(true);
                    setTimeout(() => setHighlightKitchenOrders(false), 2000);
                  }
                }}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-[#3E5E93] hover:text-black border border-zinc-800 hover:border-transparent rounded-lg text-[9px] font-mono font-bold text-[#3E5E93] uppercase tracking-wider transition-all transform active:scale-95 cursor-pointer shrink-0"
              >
                Locate ↓
              </button>
            </div>
          </motion.div>
        );
      })()}

      {/* SPECIALS CAROUSEL BANNER */}
      {specials.length > 0 && (() => {
        const safeIndex = selectedSpecialIndex >= specials.length ? 0 : selectedSpecialIndex;
        const currentSpec = specials[safeIndex];
        if (!currentSpec) return null;

        // Resolve a background image URL if any of the specials match or are configured with an image
        const getSpecialImageUrl = (spec: any) => {
          if (spec.imageUrl) return spec.imageUrl;
          const titleLower = (spec.title || "").toLowerCase();
          if (spec.id === "promo-1" || titleLower.includes("double points")) {
            return "";
          }
          if (spec.id === "promo-2" || titleLower.includes("treat yoself") || titleLower.includes("treat yourself")) {
            return "";
          }
          if (spec.id === "promo-3" || titleLower.includes("chicken smash") || titleLower.includes("southern fried chicken")) {
            return "";
          }
          return null;
        };

        const specImgUrl = getSpecialImageUrl(currentSpec);
        const hasBgImage = !!specImgUrl;

        return (
          <section className="px-4 pt-4 pb-2" id="specials-section">
            <div 
              onClick={() => {
                if (hasBgImage) {
                  playBeep(520, "sine", 0.05);
                  triggerToast(`Special Promo: ${currentSpec.title} ⚡ Ask Lutho Crew to redeem!`, "info");
                }
              }}
              className={`rounded-2xl border-2 border-dashed border-black overflow-hidden relative shadow-lg transition-all duration-300 ${
                hasBgImage 
                  ? "bg-zinc-900 bg-cover bg-center w-full aspect-[4/3] cursor-pointer hover:border-[#3E5E93]/60 active:scale-[0.99] select-none" 
                  : "bg-[#3E5E93] w-full min-h-[185px] flex flex-col justify-between"
              }`}
              style={hasBgImage ? { backgroundImage: `url('${specImgUrl}')` } : undefined}
            >
              {hasBgImage && currentSpec.id === "promo-3" && (
                <div className="absolute inset-x-0 bottom-4 px-4 flex gap-3 z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playBeep(450, "sine", 0.05);
                      setSelectedDetailItem({
                        id: "chicken-burger-solo",
                        name: "Southern Fried Chicken Burger",
                        price: 69,
                        priceText: "R 69",
                        description: "Crispy basted southern fried chicken burger with YoMayo, fresh pickles and savory crunch.",
                        category: "EAT",
                        emoji: "🍔",
                        sectionName: "Promos",
                        image: "https://images.spurcorp.com/a0532576-8922-439d-a8ce-ca7a198e55db"
                      });
                    }}
                    className="flex-1 py-1.5 px-2 bg-black/95 hover:bg-[#3E5E93] text-white hover:text-black hover:border-transparent border border-zinc-850 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer text-center group font-sans shadow-lg"
                  >
                    <span className="font-display font-extrabold text-[9px] uppercase tracking-wider">Solo Burger</span>
                    <span className="font-mono text-xs font-black text-[#3E5E93] group-hover:text-black">R69</span>
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playBeep(450, "sine", 0.05);
                      setSelectedDetailItem({
                        id: "promo-3",
                        name: "Southern Fried Chicken Burger, 4 Wings & Fries",
                        price: 129,
                        priceText: "R 129",
                        description: "Crispy basted southern fried chicken burger paired with 4 signature wings & golden fries.",
                        category: "EAT",
                        emoji: "🍔",
                        sectionName: "Promos",
                        image: ""
                      });
                    }}
                    className="flex-1 py-1.5 px-2 bg-[#3E5E93] hover:bg-orange-400 text-black rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer text-center font-sans shadow-lg font-bold"
                  >
                    <span className="font-display font-extrabold text-[9px] uppercase tracking-wider">Full Combo Pack</span>
                    <span className="font-mono text-xs font-black">R129</span>
                  </button>
                </div>
              )}
              {/* Brush Stroke Title Label */}
              {!hasBgImage && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-black text-[11px] font-display uppercase tracking-widest text-white px-2 py-0.5 rounded-md font-bold">
                    SPECIALS
                  </span>
                </div>
              )}

              {/* Arrow controllers */}
              {specials.length > 1 && (
                <div className="absolute right-3 top-3 z-10 flex gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playBeep(400, "sine", 0.04);
                      setSelectedSpecialIndex(prev => prev === 0 ? specials.length - 1 : prev - 1);
                    }}
                    className="p-1 rounded bg-black/80 border border-black/30 text-white hover:text-[#3E5E93] transition-colors cursor-pointer"
                    aria-label="Previous special"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playBeep(400, "sine", 0.04);
                      setSelectedSpecialIndex(prev => (prev + 1) % specials.length);
                    }}
                    className="p-1 rounded bg-black/80 border border-black/30 text-white hover:text-[#3E5E93] transition-colors cursor-pointer"
                    aria-label="Next special"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Layout for spec content */}
              {!hasBgImage && (
                <div className="p-4 pt-11 min-h-[110px] flex flex-col justify-between relative bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_100%)]">
                  <div>
                    <p className="text-[10px] font-mono tracking-widest text-[#121212] uppercase font-black mb-1">
                      {currentSpec.badge || "LIMITED TIME DEAL"}
                    </p>
                    <h2 className="font-sub font-black text-xl text-black tracking-wide uppercase leading-tight">
                      {currentSpec.title}
                    </h2>
                    <p className="font-mono text-lg font-black text-white hover:text-black tracking-wider w-fit bg-black px-2.5 py-0.5 rounded-lg mt-2 drop-shadow-sm">
                      {currentSpec.deal}
                    </p>
                  </div>
                  <p className="text-xs font-sans text-black mt-2 font-semibold italic leading-relaxed">
                    {currentSpec.description}
                  </p>
                  
                  {/* Action shortcut to automatically fetch linked burgers/mimosas */}
                  <div className="mt-3.5 pt-3 border-t border-black/10 flex justify-end">
                    <button
                      onClick={() => {
                        playBeep(520, "sine", 0.05);
                        const menuId = currentSpec.menuItemId;
                        if (menuId) {
                          const item = menuItems.find(m => m.id === menuId);
                          if (item) {
                            handleAddToCart(item);
                            triggerToast(`Added ${item.name} deal to order!`, "success");
                          } else {
                            triggerToast("This special deal is off-line", "info");
                          }
                        } else {
                          // Match old static ones or synthesize
                          if (currentSpec.id === "spec-1") {
                            const item = menuItems.find(m => m.id === "fries-shoestring-reg");
                            if (item) {
                              handleAddToCart(item);
                              triggerToast("Regular Shoestring Fries added!", "success");
                            }
                          } else if (currentSpec.id === "spec-2") {
                            const item = menuItems.find(m => m.id === "eat-2");
                            if (item) {
                              handleAddToCart(item);
                              triggerToast("Lutho Beef Burger added!", "success");
                            }
                          } else {
                            // Search keyword matching
                            const keyword = currentSpec.title?.toLowerCase().split(" ")[0];
                            const item = MENU_ITEMS.find(m => m.name.toLowerCase().includes(keyword));
                            if (item) {
                              handleAddToCart(item);
                              triggerToast(`${item.name} deal added!`, "success");
                            } else {
                              // Synthesize a cool temporary dynamic custom menu item
                              const tempPriceStr = currentSpec.deal.replace(/[^0-9]/g, "");
                              const tempPrice = parseInt(tempPriceStr, 10) || 99;
                              const tempItem = {
                                id: "custom-spec-" + Date.now(),
                                name: currentSpec.title,
                                price: tempPrice,
                                category: "EAT" as const,
                                emoji: "🔥",
                                description: currentSpec.description
                              };
                              handleAddToCart(tempItem);
                              triggerToast(`${currentSpec.title} added!`, "success");
                            }
                          }
                        }
                      }}
                      className="bg-[#121212] border border-[#3E5E93]/50 hover:border-[#3E5E93] text-xs font-sub font-bold tracking-wider text-[#3E5E93] hover:bg-[#3E5E93] hover:text-black px-3.5 py-1.5 rounded transition-all flex items-center gap-1.5 uppercase cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3 h-3" /> Get Great Deal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* --- CUSTOMER OS QUICK INTERACTION HUBS --- */}
      <section className="px-4 py-2 grid grid-cols-2 gap-3.5 pb-4">
        
        {/* BOOK A TABLE BUTTON */}
        <button
          onClick={() => {
            playBeep(480, "sine", 0.08);
            setIsBookingModalOpen(true);
          }}
          className="bg-[#1C1C1E] hover:bg-zinc-855 border-2 border-dashed border-[#3E5E93]/30 hover:border-[#3E5E93] text-white p-3.5 rounded-xl flex flex-col items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer text-center relative overflow-hidden group shadow-heavy diagonal-stripes"
        >
          <div className="absolute -top-1 right-2 bg-[#3E5E93]/10 text-[#3E5E93] text-[8px] font-mono font-bold px-1.5 py-1 rounded-b border border-t-0 border-[#3E5E93]/20 uppercase tracking-widest">
            RESERVE
          </div>
          <div className="w-10 h-10 rounded-full bg-[#121212] border border-[#3E5E93]/15 flex items-center justify-center text-xl text-[#3E5E93] group-hover:scale-110 transition-transform">
            📆
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xs uppercase tracking-wider text-white">
              Book a Table
            </span>
            <span className="text-[9px] text-zinc-500 uppercase font-mono mt-0.5">
              Tables 1-13 + Remote
            </span>
          </div>
        </button>

        {/* 🎮 PLAY AT TABLE BUTTON */}
        <button
          onClick={() => {
            playBeep(520, "sine", 0.08);
            setIsGamesModalOpen(true);
          }}
          className="bg-[#1C1C1E] hover:bg-zinc-855 border-2 border-dashed border-[#3E5E93]/30 hover:border-[#3E5E93] text-white p-3.5 rounded-xl flex flex-col items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer text-center relative overflow-hidden group shadow-heavy diagonal-stripes-orange"
        >
          <div className="absolute -top-1 right-2 bg-red-650 text-red-100 text-[8px] font-mono font-bold px-1.5 py-1 rounded-b uppercase tracking-widest animate-pulse">
            ARCADE
          </div>
          <div className="w-10 h-10 rounded-full bg-[#121212] border border-[#3E5E93]/15 flex items-center justify-center text-xl text-orange-500 group-hover:scale-110 transition-transform">
            🎮
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xs uppercase tracking-wider text-white">
              🎮 Play at Table
            </span>
            <span className="text-[9px] text-zinc-500 uppercase font-mono mt-0.5">
              Live In-Pub Arena
            </span>
          </div>
        </button>

      </section>

      {/* --- CONFIRMED RESERVATIONS DASHBOARD LOG --- */}
      {bookings.length > 0 && (
        <div className="px-4 mb-4 animate-fadeIn">
          <div className="bg-[#1C1C1E] p-4 rounded-2xl border border-zinc-950 flex flex-col gap-3 shadow-heavy diagonal-stripes">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎫</span>
                <div>
                  <h5 className="font-display font-black text-xs uppercase tracking-wider text-white">
                    Your Booked Tables
                  </h5>
                  <p className="text-[9px] font-mono text-[#3E5E93] uppercase tracking-widest mt-0.5 font-bold">
                    WE'RE NOT NORMAL 🤘
                  </p>
                </div>
              </div>
              <span className="bg-[#3E5E93]/10 text-[#3E5E93] border border-[#3E5E93]/20 text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase font-black">
                {bookings.length} Confirmed
              </span>
            </div>

            <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
              {bookings.map((b) => {
                const table = LUTHO_TABLES.find(t => t.id === b.tableId);
                return (
                  <div key={b.id} className="bg-black/40 p-3 rounded-xl border border-[#3E5E93]/15 flex items-center justify-between text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[#3E5E93] font-bold uppercase text-xs">
                          {table ? `${table.name} (T${b.tableId})` : `TABLE ${b.tableId}`}
                        </span>
                        <span className="text-[8px] px-1 bg-zinc-800 text-zinc-300 rounded uppercase font-sans">
                          {b.guests} Guests
                        </span>
                      </div>
                      <p className="text-[10.5px] text-zinc-300">
                        Date: {b.date} • {b.time}
                      </p>
                      {b.occasion && (
                        <p className="text-[9.5px] text-[#3E5E93] italic font-black">
                          Occasion: {b.occasion}
                        </p>
                      )}
                      {b.specialRequests && (
                        <p className="text-[9.5px] text-zinc-400 truncate max-w-[200px] border-l border-[#3E5E93]/30 pl-1.5 mt-1">
                          "{b.specialRequests}"
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playBeep(330, "sawtooth", 0.08);
                        setBookings(prev => prev.filter(x => x.id !== b.id));
                        setTablesState(prev => {
                          const next = { ...prev };
                          if (next[b.tableId] === "Booked") {
                            next[b.tableId] = "Available";
                          }
                          return next;
                        });
                        triggerToast("Booking canceled!", "info");
                      }}
                      className="p-1.5 px-2.5 border border-red-900 bg-red-950/20 hover:bg-red-950/50 hover:border-red-500 text-red-400 font-bold transition-all text-[9.5px] uppercase cursor-pointer rounded-lg shrink-0 self-center"
                    >
                      Cancel
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Loyalty stamp board container moved above Drink/Eat Tabs */}
      <div className="px-4 mt-5 mb-1 animate-fadeIn">
        <div className="bg-[#1C1C1E] p-3.5 rounded-2xl border border-zinc-900 flex flex-col gap-2.5 shadow-xl relative overflow-hidden">
          {userProfile ? (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-[#3E5E93] animate-pulse" />
                  <div>
                    <h4 className="font-sub font-black tracking-wider text-xs uppercase text-[#3E5E93] leading-none">
                      Loyalty Stamp Companion
                    </h4>
                    <p className="text-[9px] font-mono text-zinc-400 mt-1 uppercase font-bold">
                      ROCKER: <span className="text-white">@{userProfile.username}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#A0A0A0] bg-black/40 px-2 py-0.5 rounded uppercase font-black">
                  {stamps === 10 ? "CLAIM NOW!" : `${10 - stamps} STAMPS TIL FREE DRINK`}
                </span>
              </div>

              {/* Graphical stamp circles */}
              <div className="grid grid-cols-10 gap-1.5 pt-0.5">
                {Array.from({ length: 10 }).map((_, i) => {
                  const active = i < stamps;
                  return (
                    <div 
                      key={i} 
                      className={`stamp p-1 text-[11px] font-display aspect-square cursor-default select-none ${
                        active ? "active text-[#3E5E93]" : "text-zinc-700 bg-black/20"
                      }`}
                      title={active ? `Loyalty stamp earned!` : `Stamp Spot ${i + 1}`}
                    >
                      {active ? (
                        <img 
                          src="/lutho-stamp-logo.png" 
                          alt="Stamp" 
                          className="w-full h-full object-contain rounded-full select-none"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-zinc-550" />
                  <div>
                    <h4 className="font-sub font-black tracking-wider text-xs uppercase text-zinc-400 leading-none">
                      Loyalty Stamp Companion
                    </h4>
                    <p className="text-[9px] font-mono text-zinc-500 mt-1 uppercase font-bold">
                      STATUS: <span className="text-zinc-500">ANONYMOUS DINER</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 bg-black/40 px-2 py-0.5 rounded uppercase font-black">
                  1 STAMP BY DEFAULT
                </span>
              </div>

              {/* Greyed out stars/stamps display by default with only 1 given */}
              <div className="grid grid-cols-10 gap-1.5 pt-0.5 opacity-40 saturate-[0.10]">
                {Array.from({ length: 10 }).map((_, i) => {
                  const active = i < stamps;
                  return (
                    <div 
                      key={i} 
                      className={`stamp p-1 text-[11px] font-display aspect-square cursor-default select-none ${
                        active ? "active text-zinc-400" : "text-zinc-700 bg-black/20"
                      }`}
                      title={active ? `Loyalty stamp earned!` : `Stamp Spot ${i + 1}`}
                    >
                      {active ? (
                        <img 
                          src="/lutho-stamp-logo.png" 
                          alt="Stamp" 
                          className="w-full h-full object-contain rounded-full select-none"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[9px] text-zinc-550 font-sans leading-tight text-left mt-0.5">
                Create your Rockstar profile during ticket checkout to claim stamps & start earning free drafts!
              </p>
            </>
          )}
        </div>
      </div>

      {/* TABS CONTROLLER (EAT vs DRINK) */}
      <section className="px-4 py-3.5 sticky top-0 bg-[#121212]/95 z-30 flex flex-col gap-2.5 backdrop-blur-md border-b-2 border-zinc-900/60 pt-4">
        <div className="grid grid-cols-2 gap-2 bg-[#1C1C1E] p-1.5 rounded-xl border border-zinc-900 shadow">
          
          {/* EAT TAB */}
          <button
            onClick={() => {
              setActiveCategory("EAT");
              setActiveSubcategory("all");
              setSearchQuery("");
              playBeep(500, "triangle", 0.05);
            }}
            className={`py-3.5 focus:outline-none flex justify-center items-center gap-2 font-display tracking-widest text-lg font-black transition-all duration-200 uppercase cursor-pointer rounded-lg ${
              activeCategory === "EAT"
                ? "bg-[#3E5E93] text-white shadow-md scale-[1.02] border border-orange-600 font-bold"
                : "text-zinc-500 hover:text-zinc-300 bg-transparent"
            }`}
          >
            <Utensils className={`w-5 h-5 ${activeCategory === "EAT" ? "text-white animate-bounce" : "text-zinc-650"}`} />
            <span>EAT</span>
          </button>

          {/* DRINK TAB */}
          <button
            onClick={() => {
              setActiveCategory("DRINK");
              setActiveSubcategory("all");
              setSearchQuery("");
              playBeep(500, "triangle", 0.05);
            }}
            className={`py-3.5 focus:outline-none flex justify-center items-center gap-2 font-display tracking-widest text-lg font-black transition-all duration-200 uppercase cursor-pointer rounded-lg ${
              activeCategory === "DRINK"
                ? "bg-[#3E5E93] text-white shadow-md scale-[1.02] border border-orange-600 font-bold"
                : "text-zinc-500 hover:text-zinc-300 bg-transparent"
            }`}
          >
            <Beer className={`w-5 h-5 ${activeCategory === "DRINK" ? "text-white fill-current animate-bounce" : "text-zinc-650"}`} />
            <span>DRINK</span>
          </button>

        </div>

        {/* Playful Interactive Dual-Filter Engine */}
        <div className="flex flex-col gap-2">
          
          {/* 1. Sleek Search Input Bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                playBeep(650, "sine", 0.01);
              }}
              placeholder={`Search ${activeCategory === "EAT" ? "burgers, steaks, pizzas, sides..." : "wines, beverages, champagne..."}`}
              className="w-full bg-[#1C1C1E] text-zinc-100 placeholder-zinc-650 text-xs rounded-lg pl-9 pr-8 py-2.5 border border-zinc-850/80 focus:outline-none focus:border-[#3E5E93] focus:ring-1 focus:ring-[#3E5E93]/20 font-sans transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  playBeep(400, "sine", 0.02);
                }}
                className="absolute right-2.5 p-1 text-zinc-500 hover:text-zinc-250 focus:outline-none rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. Scrollable Filter Pills Segment */}
          <div 
            className="flex items-center gap-1.5 overflow-x-auto py-1 -mx-4 px-4 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {(activeCategory === "EAT" 
              ? [
                  { id: "all", label: "All Food", icon: Sparkles },
                  { id: "Promos", label: "Promos 🏷️", icon: Award },
                  { id: "Lutho Drop", label: "Lutho Drop 🔥", icon: Flame },
                  { id: "Smashburgers", label: "Burgers 🍔", icon: Utensils },
                  { id: "Combos", label: "Combos 👑", icon: Award },
                  { id: "Ribs", label: "Ribs 🥩", icon: Flame },
                  { id: "Wings", label: "Wings 🍗", icon: Leaf },
                  { id: "Bombs", label: "Bombs 💣", icon: Pizza },
                  { id: "Salads & Chicken Strips", label: "Salads & Strips 🥗", icon: Leaf },
                  { id: "Fries", label: "Fries 🍟", icon: Users },
                  { id: "Kid Rock", label: "Kid Rock 🧸", icon: Sparkles },
                  { id: "Desserts", label: "Desserts 🧇", icon: Clock }
                ]
              : [
                  { id: "all", label: "All Drinks", icon: Coffee },
                  { id: "#G-Shakes", label: "G-Shakes 🥤", icon: Sparkles },
                  { id: "#Bos Ice Tea", label: "Ice Tea 🍹", icon: Flame },
                  { id: "#Sodas", label: "Sodas 🥤", icon: Coffee },
                  { id: "#Juice", label: "Juices 🧃", icon: Clock },
                  { id: "#Energy", label: "Energy ⚡", icon: Flame },
                  { id: "#Water", label: "Water 💧", icon: Sparkles },
                  { id: "#Tiser's", label: "Tiser's 🥂", icon: Coffee }
                ]
            ).map((sub) => {
              const SubIcon = sub.icon;
              const isSelected = activeSubcategory === sub.id;
              
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setActiveSubcategory(sub.id);
                    playBeep(520, "triangle", 0.03);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10.5px] font-sub font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#3E5E93] text-black border border-[#3E5E93] shadow-[0_2px_8px_rgba(62, 94, 147,0.25)] scale-[1.03]"
                      : "bg-[#1C1C1E] text-zinc-400 hover:text-zinc-200 border border-zinc-850"
                  }`}
                >
                  <SubIcon className={`w-3 h-3 ${isSelected ? "text-black" : "text-[#3E5E93]/70"}`} />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#1C1C1E] p-2.5">
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#3E5E93] font-black mb-2 px-0.5">
              Quick drinks — tap to add
            </p>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {QUICK_DRINK_IDS.map((drinkId) => {
                const drink = menuItems.find((m) => m.id === drinkId);
                if (!drink) return null;
                return (
                  <button
                    key={drinkId}
                    type="button"
                    onClick={() => {
                      handleAddToCart(drink);
                      triggerToast(`Added ${drink.name}`, "success");
                    }}
                    className="shrink-0 px-3 py-2 rounded-lg bg-white/5 border border-zinc-800 hover:border-[#3E5E93] text-left transition-all"
                  >
                    <span className="text-sm leading-none">{drink.emoji}</span>
                    <span className="block text-[9px] font-black uppercase text-white mt-1 max-w-[88px] truncate">
                      {drink.name.replace(" 300ml", "").replace(" G-Shake", "")}
                    </span>
                    <span className="block text-[9px] font-mono text-[#3E5E93] mt-0.5">R{drink.price}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("DRINK");
                  setActiveSubcategory("all");
                  playBeep(500, "triangle", 0.05);
                }}
                className="shrink-0 px-3 py-2 rounded-lg bg-[#3E5E93]/15 border border-[#3E5E93]/40 text-[9px] font-black uppercase text-[#3E5E93] self-stretch min-w-[72px]"
              >
                All drinks →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MENU GRID */}
      <section className="px-4 py-3 flex-1" id="menu-grid-section">
        <div className="grid grid-cols-2 gap-3 pb-10">
          <AnimatePresence mode="popLayout">
            {filteredMenuItems.map((item) => {
              // Quantify if is already in cart
              const cartMatch = cart.find(c => c.menuItem.id === item.id);
              const qty = cartMatch ? cartMatch.quantity : 0;
              const hasSelected = qty > 0;
              const isFavorited = favoritedIds.includes(item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    playBeep(440, "sine", 0.05);
                    setSelectedDetailItem(item);
                  }}
                  className={`bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-lg flex flex-col relative border transition-all duration-300 cursor-pointer ${
                    hasSelected 
                      ? "border-[#3E5E93] ring-1 ring-[#3E5E93]/25 scale-[1.01]" 
                      : "border-zinc-900 bg-[#1C1C1E] hover:border-zinc-800 hover:scale-[1.01] hover:shadow-xl"
                  }`}
                >
                  {/* Top Image block */}
                  <div className="h-52 w-full bg-[#121212]/50 flex items-center justify-center relative overflow-hidden shrink-0 group p-0">
                    {(() => {
                      const resolvedImage = getProductResolvedImage(item);
                      return resolvedImage ? (
                        <img 
                          src={resolvedImage} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-505 group-hover:scale-102"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const prev = e.currentTarget.nextElementSibling as HTMLElement;
                            if (prev) prev.style.display = 'block';
                          }}
                        />
                      ) : null;
                    })()}
                    
                    {/* Fallback Emoji */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-[#3E5E93]/10 to-zinc-950 flex items-center justify-center"
                      style={{ display: getProductResolvedImage(item) ? 'none' : 'flex' }}
                    >
                      <span className="text-4xl filter drop-shadow-md">{item.emoji}</span>
                    </div>

                    {/* Popularity / Special Indicator overlay */}
                    {item.popularityBadge && (
                      <div className="absolute bottom-2 left-2 z-10">
                        <span className="bg-black/85 backdrop-blur-sm text-[#3E5E93] text-[7.5px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded border border-[#3E5E93]/30 shadow">
                          {item.popularityBadge.split(" (")[0]}
                        </span>
                      </div>
                    )}
                    
                    {item.isSpecial && (
                      <div className="absolute bottom-2 right-2 z-10">
                        <span className="bg-red-600 text-white text-[7.5px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded border border-red-500/30 shadow animate-pulse">
                          SPECIAL DEAL
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content Details */}
                  <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                    <div>
                      <h3 className="font-sub font-black text-xs text-white uppercase tracking-wide leading-tight line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-sans tracking-tight mt-1 leading-normal min-h-[34px]">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-zinc-900/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">PRICE</span>
                        <span className="font-mono text-sm font-black text-[#3E5E93]">
                          R{item.price}
                        </span>
                      </div>

                      {/* Add button or Quantity Controller */}
                      {hasSelected ? (
                        <div className="flex items-center w-full bg-[#121212] border border-[#3E5E93]/50 rounded-xl overflow-hidden shadow-inner shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQuantity(item.id, -1);
                            }}
                            className="flex-1 py-1.5 text-[#3E5E93] hover:bg-[#3E5E93] hover:text-black transition-colors flex items-center justify-center cursor-pointer"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono font-black text-xs text-white">
                            {qty} ADDED
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQuantity(item.id, 1);
                            }}
                            className="flex-1 py-1.5 text-[#3E5E93] hover:bg-[#3E5E93] hover:text-black transition-colors flex items-center justify-center cursor-pointer"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.id === "promo-3" || item.id === "chicken-burger-solo") {
                              setSelectedDetailItem(item);
                              playBeep(450, "sine", 0.05);
                            } else {
                              handleAddToCart(item);
                            }
                          }}
                          className="w-full bg-[#3E5E93] hover:bg-orange-400 active:scale-95 text-[#121212] font-sub font-black text-[10px] py-1.5 rounded-xl tracking-wider transition-all uppercase flex items-center justify-center gap-1 font-bold cursor-pointer"
                        >
                          <Plus className="w-3 h-3 shrink-0" /> Add to Order
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredMenuItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1C1C1E]/50 rounded-2xl border border-dashed border-zinc-800/80 p-9 text-center flex flex-col items-center justify-center gap-4 shadow-xl col-span-full"
              >
                <div className="w-14 h-14 rounded-full bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-[#3E5E93]">
                  <Utensils className="w-5 h-5 text-zinc-500 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-sub font-black text-sm text-zinc-200 uppercase tracking-widest">
                    No Matching Items Found
                  </h4>
                  <p className="text-xs text-zinc-500 font-sans mt-1.5 max-w-[280px] mx-auto leading-relaxed">
                    We couldn't find any pub dishes or drinks matching "{searchQuery}" or the active subcategory filters.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveSubcategory("all");
                    playBeep(450, "triangle", 0.05);
                  }}
                  className="bg-[#121212] border border-[#3E5E93]/50 hover:border-[#3E5E93] text-[10.5px] font-sub font-black uppercase tracking-wider text-[#3E5E93] px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Reset Active Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* TRACKING PRECENT ORDERS (Active Kitchen Orders Simulator) */}
      {kitchenFeedOrders.length > 0 && (
        <section 
          id="active-kitchen-orders-section" 
          className={`px-4 py-4 border-t border-zinc-900 mt-6 md:pb-8 rounded-xl transition-all duration-500 ${
            highlightKitchenOrders 
              ? "bg-amber-950/20 ring-2 ring-[#3E5E93] shadow-[0_0_25px_rgba(62, 94, 147,0.45)]" 
              : ""
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E5E93] animate-pulse" />
            <h3 className="font-sub font-black text-xs uppercase tracking-widest text-[#3E5E93]">
              Active Kitchen Orders
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {kitchenFeedOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-[#1C1C1E]/50 p-3 rounded-xl border border-zinc-900 flex md:flex-row flex-col justify-between items-start md:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-zinc-400 uppercase">
                      {order.id}
                    </span>
                    <span className="text-zinc-600 text-[10px] font-mono">
                      @{order.timestamp}
                    </span>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 text-[#3E5E93] text-[10px] font-mono font-bold rounded border border-amber-500/20">
                      <Clock className="w-2.5 h-2.5 text-[#3E5E93] animate-pulse" />
                      {getElapsedMinutesAgo(order.createdAt, order.timestamp)}
                    </span>
                  </div>
                  
                  {/* Render inline mini summary */}
                  <p className="text-xs text-zinc-400 font-sans mt-1 line-clamp-1">
                    {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                  </p>

                  {order.notes && (
                    <div className="mt-1.5 px-2.5 py-1 bg-amber-950/20 border border-amber-500/10 rounded text-[10.5px] text-amber-500 flex items-center gap-1.5 font-mono">
                      <span className="font-sans font-black text-[9px] uppercase tracking-wider text-amber-500/70 shrink-0">Note:</span>
                      <span className="italic">"{order.notes}"</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-3 shrink-0">
                  <span className="font-mono text-xs font-bold text-white">
                    R{order.total}
                  </span>
                  
                  {/* Status pills */}
                  {isRemoteTable && lastOrderPassId === order.id && (
                    <button
                      type="button"
                      onClick={() => handleRedownloadOrderPass(order)}
                      className="flex items-center gap-1 px-2 py-1 rounded border border-[#3E5E93]/40 bg-[#3E5E93]/10 text-[10px] font-mono font-bold uppercase text-[#3E5E93] hover:bg-[#3E5E93] hover:text-black transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Pass
                    </button>
                  )}

                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-widest uppercase ${
                    order.status === "Sent" 
                      ? "bg-zinc-800 text-zinc-400 border border-zinc-750" 
                      : order.status === "Preparing" 
                      ? "bg-amber-950 text-amber-500 border border-amber-800/40 animate-pulse" 
                      : "bg-emerald-950 text-emerald-500 border border-emerald-800/40"
                  }`}>
                    {order.status === "Sent" ? "KITCHEN RECEIVED" : 
                     order.status === "Preparing" ? "PREPARING" : "SERVED! 🍻"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STICKY BOTTOM CARD BAR (Static visual toggle) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-[#1C1C1E] border-t-2 border-black/90 p-4 pb-6 z-40 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 justify-between">
          
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-widest text-[#A0A0A0] uppercase">
              Current Order
            </span>
            <span className="text-sm font-sub font-black text-white uppercase tracking-wider">
              {cartTotalItems} items | R{cartTotal}
            </span>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleRequestBill}
              className="py-3 px-3.5 rounded-lg border-2 border-zinc-800 hover:border-[#3E5E93] text-zinc-300 hover:text-[#3E5E93] bg-black/30 font-sub font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" /> Bill
            </button>

            <button
              onClick={() => {
                playBeep(450, "sine", 0.08);
                setIsCartOpen(true);
              }}
              className="py-3 px-6 rounded-lg bg-[#3E5E93] hover:bg-orange-400 active:scale-95 text-[#121212] font-sub font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 select-none shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              View Order
            </button>
          </div>

        </div>

        {/* Small Lutho OS Footer Credit */}
        <div className="mt-4 pt-2 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-650 font-mono">
          <span>{formatTableLabel(currentTableId)} SYSTEM</span>
          {false && (
            <button
              onClick={() => {
                playBeep(440, "sine", 0.08);
                setAppMode("STAFF");
                triggerToast("Logged in as Lutho Crew (Staff View active)", "success");
              }}
              className="tracking-widest uppercase font-bold text-[#3E5E93]/80 hover:text-[#3E5E93] transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#3E5E93]/5 hover:bg-[#3E5E93]/15 px-2.5 py-1.5 rounded-lg border border-[#3E5E93]/20 font-mono text-[9px] hover:shadow-[0_0_10px_rgba(62, 94, 147,0.15)]"
            >
              Staff View ➔
            </button>
          )}
        </div>
      </div>

      {/* CART DRAWER SLIDE UP SHEET */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />

            {/* Slider container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-0 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-[6%] sm:bottom-[6%] w-full sm:max-w-[520px] bg-[#F7F4EF] border-2 border-[#3E5E93] sm:rounded-3xl z-55 overflow-hidden flex flex-col max-h-[100dvh] sm:max-h-none shadow-2xl"
            >
              <div className="p-4 bg-black border-b-2 border-[#3E5E93] flex justify-between items-center relative shrink-0">
                <div>
                  <h3 className="font-display font-black text-[#3E5E93] tracking-widest text-lg uppercase">
                    Your Order
                  </h3>
                  <p className="text-[10px] font-mono tracking-wider text-white uppercase">
                    {formatTableLabel(resolveActiveTableId(currentTableId))} • {cartTotalItems} item{cartTotalItems === 1 ? "" : "s"}
                  </p>
                </div>
                
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 min-h-[150px]">
                {isRemoteTable && (
                  <div className="mb-4 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-black mb-2">
                      How are you ordering?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRemoteOrderMode("solo");
                          playBeep(480, "sine", 0.05);
                        }}
                        className={`py-2.5 px-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                          remoteOrderMode === "solo"
                            ? "bg-[#3E5E93] border-[#3E5E93] text-black"
                            : "bg-[#F7F4EF] border-zinc-300 text-zinc-700 hover:border-[#3E5E93]"
                        }`}
                      >
                        Just me
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRemoteOrderMode("group");
                          playBeep(480, "sine", 0.05);
                        }}
                        className={`py-2.5 px-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                          remoteOrderMode === "group"
                            ? "bg-black border-[#3E5E93] text-[#3E5E93]"
                            : "bg-[#F7F4EF] border-zinc-300 text-zinc-700 hover:border-[#3E5E93]"
                        }`}
                      >
                        Group order
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-2 leading-relaxed">
                      {remoteOrderMode === "solo"
                        ? "Send your order straight to the kitchen. Connect below so the shared bill updates live when others order too."
                        : "Everyone locks in their picks; the full order sends when the last person locks in."}
                    </p>
                  </div>
                )}

                {isRemoteTable && (
                  <div className="mb-4 bg-gradient-to-br from-zinc-900 to-black p-4 rounded-xl border border-zinc-800 flex flex-col gap-3.5 relative overflow-hidden">
                    <div className="absolute top-2.5 right-2.5 w-12 h-12 pointer-events-none opacity-[0.03]">
                      <QrCode className="w-12 h-12 text-[#3E5E93]" />
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#3E5E93] uppercase font-black bg-[#3E5E93]/10 px-2.5 py-0.5 rounded">
                          LIVE SPLITTING CONNECT
                        </span>
                        <h4 className="font-sub font-black text-sm text-white uppercase mt-1 px-0.5 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#3E5E93]" />
                          {isRemoteSplitConnected
                            ? `Split group (${displaySessionMembers.length})`
                            : "Not connected"}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          playBeep(450, "sine", 0.05);
                          setSplitQrStep("choose");
                          setIsQrModalOpen(true);
                        }}
                        className="px-3.5 py-2 bg-[#3E5E93] hover:bg-orange-400 text-[#121212] rounded-lg text-[10.5px] font-sub font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 shrink-0"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Scan QR Code
                      </button>
                    </div>
                    {isRemoteSplitConnected && remoteSplitSession ? (
                      <>
                        <div className="flex flex-wrap gap-1.5 items-center bg-black/40 p-2.5 rounded-lg border border-zinc-900">
                          <span className="text-[9.5px] font-mono text-zinc-500 uppercase font-black">Joined:</span>
                          {displaySessionMembers.map((member) => (
                            <span
                              key={member}
                              className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold font-sub uppercase flex items-center gap-1 border border-zinc-800 shrink-0 ${
                                member === currentPlayerName ? "bg-zinc-800 text-white" : "bg-zinc-900/80 text-[#3E5E93]"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              {member}
                              {remoteSplitSession.hostName === member ? " (host)" : ""}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                          Solo orders on this split update the shared bill instantly for everyone connected.
                        </p>
                      </>
                    ) : (
                      <p className="text-[10px] text-zinc-400 leading-relaxed">
                        Host or join a split so companions see your order on the live bill — you can still send a solo kitchen ticket without it.
                      </p>
                    )}
                  </div>
                )}

                {useRemoteGroupOrderFlow && (
                  <div className="mb-4 rounded-2xl border-2 border-[#3E5E93] bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-black uppercase text-sm text-black tracking-wider">Group order</h4>
                        <p className="text-[10px] font-mono uppercase text-zinc-600 mt-0.5">
                          {groupLockedCount}/{displaySessionMembers.length} locked in
                        </p>
                      </div>
                      {groupOrderDraft?.roundStatus === "submitting" && (
                        <span className="text-[10px] font-black uppercase text-[#3E5E93] animate-pulse">Sending...</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {displaySessionMembers.map((member) => {
                        const draft = groupOrderDraft?.members[member];
                        const itemCount = draft ? memberDraftItemCount(draft.items) : 0;
                        const total = draft ? memberDraftTotal(draft.items) : 0;
                        const isMe = member === myMemberName;
                        return (
                          <div
                            key={member}
                            className={`rounded-xl border p-3 ${isMe ? "border-[#3E5E93] bg-[#3E5E93]/10" : "border-zinc-200 bg-[#F7F4EF]"}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${draft?.locked ? "bg-emerald-500" : "bg-zinc-400"}`} />
                                <span className="font-black uppercase text-xs text-black truncate">
                                  {member}{isMe ? " (you)" : ""}{remoteSplitSession?.hostName === member ? " • host" : ""}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono uppercase text-zinc-600 shrink-0">
                                {draft?.locked ? "Locked" : "Choosing"}
                              </span>
                            </div>
                            {itemCount > 0 ? (
                              <div className="mt-2 space-y-1">
                                {draft!.items.map((item, idx) => (
                                  <div key={`${member}-${idx}`} className="flex justify-between text-[11px] text-zinc-700">
                                    <span>{item.quantity}× {item.menuItem.name}</span>
                                    <span>R{item.menuItem.price * item.quantity}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between text-xs font-black text-black border-t border-zinc-200 pt-1.5 mt-1">
                                  <span>Subtotal</span>
                                  <span>R{total}</span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[10px] text-zinc-500 mt-2 italic">
                                {draft?.locked ? "No items — passed this round" : "Still browsing..."}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[10px] text-zinc-600 mt-3 leading-relaxed">
                      Everyone&apos;s picks sync here live. Lock in when ready — the full group order hits the kitchen once the last person locks in.
                    </p>
                  </div>
                )}

                {isRemoteTable && remoteOrderMode === "group" && !remoteSplitSession && (
                  <div className="mb-4 rounded-2xl border border-dashed border-zinc-300 bg-white p-4 text-center">
                    <p className="text-xs font-black uppercase text-black">Host or join a split for group orders</p>
                    <p className="text-[10px] text-zinc-600 mt-1">Scan a split QR from the bill panel, or switch to &quot;Just me&quot; to order on your own.</p>
                  </div>
                )}

                {useRemoteGroupOrderFlow && (
                  <h4 className="font-black uppercase text-xs text-black tracking-wider mb-2">Your picks</h4>
                )}

                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-white rounded-full border border-dashed border-zinc-300 flex items-center justify-center text-zinc-500 mb-3 text-2xl">
                      🥩
                    </div>
                    <h4 className="font-sub font-black text-black text-sm uppercase tracking-wider">
                      Your Order is Empty
                    </h4>
                    <p className="text-xs text-zinc-600 font-sans mt-1 max-w-[250px] leading-relaxed">
                      Browse the menu and add smashburgers, wings, or an ice-cold Windhoek to get started.
                    </p>
                  </div>
                ) : (
                  <OrderMasonryGrid
                    items={cart}
                    onUpdateQuantity={isMyGroupOrderLocked ? () => undefined : handleUpdateQuantity}
                    resolveImage={getProductResolvedImage}
                  />
                )}

                {/* --- INTELLIGENT CONTEXTUAL UP-SELLING ENGINE --- */}
                {cart.length > 0 && (() => {
                  const hasEatItems = cart.some(c => c.menuItem.category === "EAT");
                  const hasDrinkOnly = !hasEatItems;

                  const friesItem = menuItems.find(m => m.id === "fries-shoestring-reg");
                  const drinkItem = menuItems.find(m => m.id === "soda-coke") || menuItems.find(m => m.id === "soda-sprite");
                  const upsellItem = hasDrinkOnly
                    ? friesItem
                    : drinkItem;

                  if (!upsellItem) return null;
                  const alreadyInCart = cart.some(c => c.menuItem.id === upsellItem.id);
                  if (alreadyInCart) return null;

                  return (
                    <div className="mt-2.5 p-3 rounded-xl border border-dashed border-[#3E5E93]/40 bg-gradient-to-br from-[#3E5E93]/5 to-transparent flex flex-col gap-2.5 relative overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#3E5E93] animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#3E5E93] font-black">
                          {hasDrinkOnly ? "Add a side?" : "Thirsty? Add a drink"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{upsellItem.emoji}</span>
                          <div>
                            <h5 className="font-sub font-black text-black text-11px uppercase leading-none tracking-wide">
                              {upsellItem.name}
                            </h5>
                            <p className="text-[10px] text-zinc-600 leading-tight mt-0.5 line-clamp-1 max-w-[190px]">
                              {upsellItem.description}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            playBeep(520, "sine", 0.08);
                            handleAddToCart(upsellItem);
                            triggerToast(`Paired up! Added ${upsellItem.name} to order.`, "success");
                          }}
                          className="px-3 py-1.5 bg-[#3E5E93] hover:bg-[#3E5E93]/95 text-black hover:text-[#121212] font-sub font-black text-[9px] uppercase rounded-lg transition-colors flex items-center justify-center gap-1 shrink-0 cursor-pointer shadow-md transform active:scale-95"
                        >
                          <Plus className="w-2.5 h-2.5" /> add R{upsellItem.price}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Custom Order Notes input section */}
                {cart.length > 0 && (
                  <div className="mt-4 p-3.5 bg-white rounded-xl border border-zinc-200 flex flex-col gap-2 shadow-sm">
                    <label htmlFor="order-notes-textarea" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-600 select-none font-black">
                      <span>Kitchen notes</span>
                    </label>
                    <textarea
                      id="order-notes-textarea"
                      rows={2}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      disabled={useRemoteGroupOrderFlow && isMyGroupOrderLocked}
                      placeholder="e.g. Medium burger, no onions, extra ice on beer please..."
                      className="w-full bg-[#F7F4EF] text-black placeholder-zinc-400 text-xs rounded-lg p-3 border border-zinc-300 focus:outline-none focus:border-[#3E5E93] focus:ring-1 focus:ring-[#3E5E93]/30 font-sans transition-all resize-none"
                    />
                  </div>
                )}
              </div>

              {(cart.length > 0 || useRemoteGroupOrderFlow) && (
                <div className="px-4 py-4 bg-white border-t border-zinc-200 flex flex-col gap-3 shrink-0">
                  {/* Detail pricing list */}
                  {cart.length > 0 && (
                  <>
                  <div className="flex flex-col gap-1.5 text-xs text-zinc-600 font-mono">
                    <div className="flex justify-between">
                      <span>Order Subtotal</span>
                      <span className="font-sans text-black">R{(cartTotal * 0.85).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (15% Included)</span>
                      <span className="font-sans text-black font-bold text-[#3E5E93]">R{(cartTotal * 0.15).toFixed(2)}</span>
                    </div>

                    {couponApplied && (
                      <div className="flex justify-between text-emerald-700 border-t border-zinc-200 pt-1.5 text-11px">
                        <span>Google Review Code applied</span>
                        <span className="font-sub font-black font-sans">-R50.00</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm text-black font-sub font-black border-t border-zinc-200 pt-2 uppercase">
                      <span>Total Price</span>
                      <span className="font-mono text-base text-[#3E5E93]">
                        R{Math.max(0, cartTotal - (couponApplied ? 50 : 0))}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F7F4EF] rounded-lg border border-[#3E5E93]/20 flex items-center gap-2.5 text-[11px] font-mono text-zinc-700">
                    <Award className="w-4 h-4 text-[#3E5E93] shrink-0" />
                    <p className="leading-relaxed text-[10.5px]">
                      Sending this order wins you <span className="text-black font-bold">{cartTotalItems} gold stamp(s)</span> on your card!
                    </p>
                  </div>

                  {/* Google Review Voucher Machine Selector Panel */}
                  {couponCode ? (
                    !couponApplied && (
                      <div className="p-3 bg-emerald-950/10 border border-emerald-500/25 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎁</span>
                          <div>
                            <h5 className="text-[10.5px] font-sub font-black uppercase text-white leading-none">R50 Voucher Code</h5>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">{couponCode}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            playBeep(520, "sine", 0.08);
                            setCouponApplied(true);
                            triggerToast("R50 discount code successfully applied to order!", "success");
                          }}
                          className="px-3 py-1.5 bg-emerald-500 text-black hover:bg-emerald-400 font-sub font-black text-[9px] uppercase rounded-lg transition-colors cursor-pointer active:scale-95"
                        >
                          Apply Now
                        </button>
                      </div>
                    )
                  ) : (
                    <button
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        setIsReviewModalOpen(true);
                      }}
                      className="w-full mt-0.5 py-2.5 px-3 bg-[#1C1C1E] hover:bg-zinc-850 border border-dashed border-[#3E5E93]/35 text-[#3E5E93] hover:text-white rounded-xl text-[10.5px] font-sub font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-black/20"
                    >
                      <Star className="w-3.5 h-3.5 fill-[#3E5E93] text-transparent" />
                      Review Us on Google for dynamic R50 Voucher!
                    </button>
                  )}
                  </>
                  )}

                  {/* Call CTAs */}
                  <div className="flex gap-2.5 mt-1">
                    <button
                      onClick={handleRequestBill}
                      className="flex-1 py-3.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#3E5E93] hover:border-[#3E5E93] uppercase font-sub font-black text-xs tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Request Bill
                    </button>

                    <button
                      onClick={handleSendOrder}
                      disabled={
                        (useRemoteGroupOrderFlow && isMyGroupOrderLocked && !isGroupOrderReadyToSubmit) ||
                        (isRemoteTable && remoteOrderMode === "group" && !remoteSplitSession)
                      }
                      className={`flex-[2] py-4 font-sub font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-lg ${
                        useRemoteGroupOrderFlow && isMyGroupOrderLocked
                          ? "bg-zinc-800 text-zinc-300 cursor-not-allowed"
                          : "bg-[#3E5E93] hover:bg-[#d67a32] text-black"
                      } ${isRemoteTable && remoteOrderMode === "group" && !remoteSplitSession ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isRemoteTable && remoteOrderMode === "group" && !remoteSplitSession ? (
                        <>Join split for group order</>
                      ) : useRemoteGroupOrderFlow && isMyGroupOrderLocked ? (
                        <>Waiting for group ({groupLockedCount}/{displaySessionMembers.length})</>
                      ) : useRemoteGroupOrderFlow ? (
                        <>Lock in my order</>
                      ) : (
                        <><Plus className="w-4 h-4 shrink-0" /> Send Order to Kitchen</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CUSTOMER CHAT DRAWER */}
      <AnimatePresence>
        {isCustomerChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCustomerChatOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />

            {/* Slider container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-[#1C1C1E] border-t-4 border-[#3E5E93] rounded-t-3xl z-55 overflow-hidden flex flex-col max-h-[85vh] shadow-2xl pb-6"
            >
              {/* Header drawer controls */}
              <div className="p-4 bg-[#121212] border-b border-zinc-900 flex justify-between items-center relative">
                <div>
                  <h3 className="font-display font-black text-[#3E5E93] tracking-widest text-lg uppercase flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#3E5E93]" />
                    <span>Lounge Chat</span>
                  </h3>
                  <p className="text-[10px] font-mono tracking-wider text-zinc-550 uppercase">
                    Direct live line to {formatTableLabel(currentTableId || "12")} crew
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playBeep(400, "sine", 0.05);
                    setIsCustomerChatOpen(false);
                  }}
                  className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages thread */}
              <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3 min-h-[250px] max-h-[400px]">
                {(() => {
                  const tableKey = resolveActiveTableId(currentTableId);
                  const filtered = chatMessages.filter(
                    (m) => String(m.tableId) === String(tableKey)
                  );
                  if (filtered.length === 0) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-70">
                        <span className="text-3xl">💬</span>
                        <h4 className="font-sub font-black text-white text-xs uppercase tracking-wider mt-3">
                          No messages yet
                        </h4>
                        <p className="text-[10px] text-zinc-500 max-w-[220px] mt-1 italic leading-relaxed">
                          Need napkins, extra ice, or a billing question? Send a live note directly to the team!
                        </p>
                      </div>
                    );
                  }
                  return filtered.map((msg, idx) => {
                    const isStaffMsg = msg.sender === "Staff";
                    return (
                      <div
                        key={msg.id || idx}
                        className={`flex flex-col max-w-[85%] ${
                          isStaffMsg ? "self-start items-start" : "self-end items-end"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5 text-[8px] font-mono uppercase text-zinc-500">
                          <span>{isStaffMsg ? "Lutho Crew (Staff)" : "You (Guest)"}</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div
                          className={`p-3 rounded-xl text-xs leading-relaxed ${
                            isStaffMsg
                              ? "bg-[#1C1C1E] border border-zinc-850 text-white rounded-tl-none font-sans"
                              : "bg-[#3E5E93] text-black font-medium font-sans rounded-tr-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Input section */}
              <div className="p-4 bg-black/40 border-t border-zinc-900/60 flex gap-2">
                <input
                  type="text"
                  value={customerChatInput}
                  onChange={(e) => setCustomerChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customerChatInput.trim()) {
                      e.preventDefault();
                      const sendBtn = document.getElementById("cust-chat-send-btn");
                      if (sendBtn) sendBtn.click();
                    }
                  }}
                  placeholder="Ask crew for assistance, napkins..."
                  className="flex-1 bg-black border border-zinc-800 p-3 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#3E5E93]"
                />
                <button
                  id="cust-chat-send-btn"
                  onClick={() => {
                    if (!customerChatInput.trim()) return;
                    playBeep(650, "sine", 0.05);

                    const tableKey = resolveActiveTableId(currentTableId);
                    const newMsg = {
                      id: "c-guest-" + Date.now().toString(36),
                      tableId: tableKey,
                      sender: currentPlayerName || "Guest",
                      text: customerChatInput.trim(),
                      timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    };

                    setChatMessages((prev) => appendChatMessage(prev, newMsg));
                    void setTableAlertFlag(tableKey, true);
                    setCustomerChatInput("");
                    triggerToast("Message dispatched to Lutho Crew dashboard! 💬", "success");
                  }}
                  className="bg-[#3E5E93] hover:bg-orange-400 text-black px-4.5 rounded-xl font-sub font-black text-xs uppercase tracking-wider flex items-center justify-center cursor-pointer font-bold shrink-0 transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* REMOTE SPLIT QR MODAL */}
      <AnimatePresence>
        {isQrModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsQrModalOpen(false);
                setSplitQrStep("choose");
                setJoinSplitInput("");
              }}
              className="fixed inset-0 bg-black/90 z-[9948]"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              className="fixed inset-x-4 top-[10%] max-w-md mx-auto bg-white border-2 border-[#3E5E93] rounded-3xl z-[9950] overflow-hidden shadow-2xl"
            >
              <div className="p-4 bg-black border-b border-[#3E5E93] flex justify-between items-center">
                <div>
                  <h3 className="font-display font-black text-[#3E5E93] text-lg uppercase">Split QR</h3>
                  <p className="text-[10px] font-mono text-white uppercase">
                    {splitQrStep === "choose" && "Host or join a live split"}
                    {splitQrStep === "host" && "Share this QR with your group"}
                    {splitQrStep === "join" && "Paste a scanned split link"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsQrModalOpen(false);
                    setSplitQrStep("choose");
                    setJoinSplitInput("");
                  }}
                  className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {splitQrStep === "choose" && (
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!currentPlayerName && !sessionStorage.getItem("lutho_my_session_name")) {
                          triggerToast("Set your guest name first.", "info");
                          setIsGuestNameOpen(true);
                          return;
                        }
                        handleHostSplitSession();
                      }}
                      className="w-full py-4 bg-[#3E5E93] hover:bg-orange-400 text-black font-black uppercase text-sm rounded-2xl transition-all"
                    >
                      Host
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitQrStep("join")}
                      className="w-full py-4 bg-black hover:bg-zinc-900 text-white font-black uppercase text-sm rounded-2xl border border-zinc-800 transition-all"
                    >
                      Join Split
                    </button>
                    <p className="text-[10px] text-zinc-600 text-center leading-relaxed">
                      Scan your friend&apos;s split QR with your camera, or paste their link after choosing Join Split.
                    </p>
                  </div>
                )}

                {splitQrStep === "host" && remoteSplitSession && (
                  <div className="flex flex-col items-center gap-4">
                    <HalftoneQRCode
                      text={getSplitJoinUrl(remoteSplitSession.id, REMOTE_TABLE_ID)}
                      size={200}
                    />
                    <p className="text-xs text-zinc-700 text-center">
                      Friends scan this to join <span className="font-bold">{remoteSplitSession.hostName}</span>&apos;s split.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(getSplitJoinUrl(remoteSplitSession.id, REMOTE_TABLE_ID));
                        triggerToast("Split invite copied!", "success");
                      }}
                      className="w-full py-3 bg-zinc-100 border border-zinc-300 text-black font-black uppercase text-xs rounded-xl"
                    >
                      Copy invite link
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsQrModalOpen(false);
                        setSplitQrStep("choose");
                      }}
                      className="w-full py-3 bg-[#3E5E93] text-black font-black uppercase text-xs rounded-xl"
                    >
                      Done — orders will sync
                    </button>
                  </div>
                )}

                {splitQrStep === "join" && (
                  <div className="space-y-3">
                    <input
                      value={joinSplitInput}
                      onChange={(e) => setJoinSplitInput(e.target.value)}
                      placeholder="Paste split link or session code..."
                      className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-[#3E5E93] focus:ring-2 focus:ring-[#3E5E93]/30"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!currentPlayerName && !sessionStorage.getItem("lutho_my_session_name")) {
                          triggerToast("Set your guest name first.", "info");
                          setIsGuestNameOpen(true);
                          return;
                        }
                        handleJoinSplitSession();
                      }}
                      className="w-full py-3 bg-[#3E5E93] text-black font-black uppercase text-sm rounded-xl"
                    >
                      Join split
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitQrStep("choose")}
                      className="w-full py-2 text-zinc-600 text-xs font-mono uppercase"
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* GOOGLE REVIEW VOUCHER MODAL */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="fixed inset-0 bg-black/90 z-[9920] backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 18 }}
              transition={{ type: "spring", damping: 24, stiffness: 230 }}
              className="fixed inset-x-4 top-[18%] max-w-[420px] mx-auto bg-white border-2 border-[#3E5E93] rounded-3xl z-[9925] overflow-hidden shadow-2xl grunge-pattern"
              role="dialog"
              aria-modal="true"
              aria-label="Google Review voucher"
            >
              <div className="p-4 bg-black border-b border-[#3E5E93] flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-[#3E5E93] uppercase tracking-widest text-sm flex items-center gap-2">
                    <Star className="w-4 h-4 fill-[#3E5E93] text-transparent" />
                    Review &amp; Save R50
                  </h3>
                  <p className="text-[10px] font-mono text-white uppercase mt-1">
                    Leave a Google review, then claim your voucher
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  aria-label="Close review modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-sm text-zinc-900">
                <p className="leading-relaxed">
                  Had a great time at LUTHO? Tap below to open our Google review page. After you&apos;ve posted your review, come back and tap &quot;I&apos;ve reviewed&quot; to unlock your <span className="font-black text-[#3E5E93]">R50 voucher</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    playBeep(520, "sine", 0.08);
                    window.open(LUTHO_GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
                  }}
                  className="w-full py-3.5 bg-[#3E5E93] hover:bg-[#d67a32] text-black font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4 fill-black text-black" />
                  Open Google Review
                </button>
              </div>

              <div className="p-4 border-t border-[#3E5E93]/30 bg-white flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playBeep(659, "sine", 0.1);
                    const code = `LUTHO-REVIEW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                    setCouponCode(code);
                    localStorage.setItem("lutho_applied_coupon_code", code);
                    setIsReviewModalOpen(false);
                    triggerToast("R50 voucher unlocked! Apply it before you send your order.", "success");
                  }}
                  className="w-full py-3 bg-black hover:bg-zinc-900 text-[#3E5E93] font-black uppercase tracking-wider rounded-xl transition-all border border-[#3E5E93]"
                >
                  I&apos;ve reviewed — give me R50
                </button>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="w-full py-2 text-zinc-500 hover:text-zinc-800 text-[10px] font-mono uppercase tracking-wider transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* TERMS & CONDITIONS MODAL */}
      <AnimatePresence>
        {isTermsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTermsOpen(false)}
              className="fixed inset-0 bg-black/90 z-[9920] backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 18 }}
              transition={{ type: "spring", damping: 24, stiffness: 230 }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] max-w-[520px] mx-auto bg-white border-2 border-[#3E5E93] rounded-3xl z-[9925] overflow-hidden shadow-2xl flex flex-col grunge-pattern"
              role="dialog"
              aria-modal="true"
              aria-label="Terms and Conditions"
            >
              <div className="p-4 bg-black border-b border-[#3E5E93] flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-[#3E5E93] uppercase tracking-widest text-sm">
                    Terms & Conditions
                  </h3>
                  <p className="text-[10px] font-mono text-white uppercase mt-1">
                    LUTHO OS guest usage guidelines
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(false)}
                  className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  aria-label="Close terms"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 text-sm text-zinc-900 leading-relaxed space-y-3">
                <p>
                  By using LUTHO OS, you agree to order respectfully. Requests are routed to the restaurant team and may be delayed during peak periods.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-800">
                  <li>Menu availability may change without notice.</li>
                  <li>Prices shown are indicative and may be adjusted at the restaurant's discretion.</li>
                  <li>This app does not process payments. Payment is completed in person with staff.</li>
                  <li>Bill and waiter requests are delivered to the staff console in real time.</li>
                  <li>Remote Table orders are prepared for collection or delivery as arranged with the venue.</li>
                </ul>
                <p className="text-[11px] text-zinc-500 font-mono uppercase">
                  Last updated: {new Date().getFullYear()}
                </p>
              </div>

              <div className="p-4 border-t border-[#3E5E93]/30 bg-white">
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(false)}
                  className="w-full py-3 bg-[#3E5E93] hover:bg-[#d67a32] text-black font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* GUEST NAME PROMPT */}
      <AnimatePresence>
        {isGuestNameOpen && !showSplash && appMode === "CUSTOMER" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-[9918] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="fixed inset-x-4 top-[20%] max-w-[420px] mx-auto bg-white border-2 border-[#3E5E93] rounded-3xl z-[9919] overflow-hidden shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Choose your name"
            >
              <div className="p-4 bg-black border-b border-[#3E5E93]">
                <h3 className="font-display font-black text-[#3E5E93] uppercase tracking-widest text-sm">Welcome to LUTHO</h3>
                <p className="text-[10px] font-mono text-white uppercase mt-1">What would you like to be called?</p>
              </div>
              <div className="p-5 space-y-4">
                <input
                  type="text"
                  maxLength={16}
                  value={guestNicknameInput}
                  onChange={(e) => setGuestNicknameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConfirmGuestName()}
                  placeholder="Your nickname"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-base text-black focus:outline-none focus:border-[#3E5E93] focus:ring-2 focus:ring-[#3E5E93]/30"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleConfirmGuestName}
                  className="w-full py-3.5 bg-[#3E5E93] hover:bg-[#d67a32] text-black font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ONBOARDING ASSISTANT */}
      <AnimatePresence>
        {isHelpOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpOpen(false)}
              className="fixed inset-0 bg-black/80 z-[9910] backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 18 }}
              transition={{ type: "spring", damping: 24, stiffness: 230 }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] max-w-[520px] mx-auto bg-[#0B0B0D] border border-zinc-850 rounded-3xl z-[9915] overflow-hidden shadow-2xl flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Onboarding assistant"
            >
              <div className="relative p-4 border-b border-zinc-900 flex items-center justify-between overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(62, 94, 147,0.35), transparent 55%), radial-gradient(circle at 85% 40%, rgba(62, 94, 147,0.18), transparent 55%)" }} />
                <div>
                  <h3 className="font-display font-black text-white uppercase tracking-[0.18em] text-sm">
                    How LUTHO Works
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase mt-1 tracking-widest">
                    Complete guest guide
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHelpOpen(false)}
                  className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  aria-label="Close help"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 text-sm text-zinc-300 leading-relaxed space-y-3">
                <div className={`rounded-2xl p-4 border ${isRemoteTable ? "border-[#3E5E93] bg-[#3E5E93]/10" : "border-zinc-900 bg-gradient-to-br from-black/70 to-zinc-950/40"}`}>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#3E5E93] font-black">
                    {isRemoteTable ? "Remote table guide" : "Dine-in guide"}
                  </p>
                  <p className="mt-1 font-display font-black uppercase tracking-wider text-white text-sm">
                    {isRemoteTable ? "Solo orders, claim codes & collection" : "Table service, from seated to served"}
                  </p>
                  <p className="text-[12px] text-zinc-300 mt-1">
                    {isRemoteTable
                      ? "Remote Table orders don't need a host — your shared bill updates live even when you order solo. After you send an order you'll get a 4-digit claim code and a downloadable pass (choose PDF or PNG). Show the pass QR or read out your code to staff at collection. Lost it? Re-download anytime from Active Kitchen Orders below."
                      : "Scan the QR at your table to join that table's session — your orders route straight to your seat. Lutho Crew is assigned automatically; call them anytime with the header Call button, and request your bill or split it whenever you're ready."}
                  </p>
                </div>
                {[
                  {
                    step: "Join your table",
                    title: "Scan QR or open Remote Table",
                    body: "Scan the QR on your table to join that table's session. No table? Use Remote Table ordering from the home link — your orders route to Remote Table, not a random dine-in table."
                  },
                  {
                    step: "Set your name",
                    title: "Choose a nickname",
                    body: "On first visit you'll be asked what to call you. This name appears on the shared bill and in table chat so your group knows who ordered what."
                  },
                  {
                    step: "Browse & order",
                    title: "Menu, photos & Your Order",
                    body: "Tap items to add them. Open Your Order to see a staggered card view with photos, realistic prep times per item, quantities, and kitchen notes before you send."
                  },
                  {
                    step: "Speed standard",
                    title: "Kitchen timer",
                    body: "Each order gets a realistic prep timer based on what's cooking — drinks ~3 min, burgers ~12 min, ribs/combos up to ~20 min. Beat the timer for rewards; if it expires, ask staff about the apology sundae."
                  },
                  {
                    step: "Track status",
                    title: "Live order updates",
                    body: "After sending, watch your order move through Sent → Preparing → Ready → Served. Status appears on the home screen kitchen panel."
                  },
                  {
                    step: "Call staff",
                    title: "Summon waiter",
                    body: "Tap Call in the header to ping your waiter. Staff see a high-visibility alert on the floor plan for your table."
                  },
                  {
                    step: "Chat",
                    title: "Table chat",
                    body: "Open chat from the header to message your table group or staff. Staff can reply from the table inspector on the floor console."
                  },
                  {
                    step: "Bill & pay",
                    title: "Request bill & split",
                    body: "Request Bill from Your Order or the bill modal. View the master bill, split by item or percentage, and track what's paid vs outstanding."
                  },
                  {
                    step: "Book a table",
                    title: "Reservations",
                    body: `Book at ${RONDEBOSCH_VENUE.name} (${RONDEBOSCH_VENUE.address}). ${RONDEBOSCH_VENUE.summary}. Choose party size, date, time slot, then pick your seat on the floor map.`
                  },
                  {
                    step: "Rewards",
                    title: "Stamps & vouchers",
                    body: "Earn gold stamps per item ordered. Collect 10 for a free draft. Leave a Google review to unlock an R50 voucher code you can apply at checkout."
                  },
                  {
                    step: "Games",
                    title: "Thunee & arcade",
                    body: "Open Games from the menu for Thunee card nights and mini-games while you wait. Multiplayer lobbies sync to your table."
                  }
                ].map((section) => (
                  <div key={section.step} className="rounded-2xl p-4 border border-zinc-900 bg-gradient-to-br from-black/70 to-zinc-950/40">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#3E5E93] font-black">
                      {section.step}
                    </p>
                    <p className="mt-1 font-display font-black uppercase tracking-wider text-white text-sm">
                      {section.title}
                    </p>
                    <p className="text-[12px] text-zinc-350 mt-1">
                      {section.body}
                    </p>
                  </div>
                ))}

                <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest text-center pt-1">
                  Tap outside to close • {RONDEBOSCH_VENUE.summary}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* STAFF TABLE PIN PROMPT */}
      <AnimatePresence>
        {staffTablePinPrompt && appMode === "STAFF" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => { setStaffTablePinPrompt(null); setStaffTablePinInput(""); }}
              className="fixed inset-0 bg-black/90 z-[9950] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-x-4 top-[25%] max-w-[360px] mx-auto bg-white border-2 border-[#3E5E93] rounded-3xl z-[9955] overflow-hidden shadow-2xl"
            >
              <div className="p-4 bg-black border-b border-[#3E5E93]">
                <h3 className="font-display font-black text-[#3E5E93] uppercase text-sm">Staff PIN required</h3>
                <p className="text-[10px] font-mono text-white uppercase mt-1">Open {formatTableLabel(staffTablePinPrompt)}</p>
              </div>
              <div className="p-5 space-y-3">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={staffTablePinInput}
                  onChange={(e) => setStaffTablePinInput(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleStaffTablePinSubmit()}
                  placeholder="Enter 4-digit PIN"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-base text-black text-center tracking-[0.3em] focus:outline-none focus:border-[#3E5E93]"
                  autoFocus
                />
                {staffAuthError && <p className="text-red-600 text-xs font-mono text-center">{staffAuthError}</p>}
                <button
                  type="button"
                  onClick={handleStaffTablePinSubmit}
                  className="w-full py-3 bg-[#3E5E93] hover:bg-[#d67a32] text-black font-black uppercase rounded-xl"
                >
                  Unlock table
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* STAFF SIGN-IN GATE (modal) */}
      <AnimatePresence>
        {showStaffGate && appMode === "CUSTOMER" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStaffGate(false)}
              className="fixed inset-0 bg-black/90 z-[9900] backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 18 }}
              transition={{ type: "spring", damping: 24, stiffness: 230 }}
              className="fixed inset-x-4 top-[8%] bottom-[8%] max-w-[520px] mx-auto z-[9905] overflow-hidden rounded-3xl border border-zinc-850 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Staff sign in"
            >
              <div
                className="lutho-dark-surface h-full bg-cover bg-center flex flex-col items-center justify-center p-4 relative text-white font-sans overflow-y-auto select-none"
                style={{ backgroundImage: "url('')" }}
              >
                <div className="absolute inset-0 bg-black/75 backdrop-blur-xs pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

                <div className="w-full max-w-sm text-center mb-5 mt-2 relative z-10 flex flex-col items-center">
                  <div className="w-full flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowStaffGate(false)}
                      className="p-2 bg-black/60 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                      aria-label="Close staff sign in"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative cursor-pointer mb-2"
                    onClick={() => playBeep(880, "sine", 0.05)}
                  >
                    <img
                      src="/lutho-logo.png"
                      alt="Lutho Logo"
                      className="w-32 h-32 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>

                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-950/50 border border-red-500/30 rounded-full text-[10px] font-sans font-black tracking-widest text-[#3E5E93] uppercase mb-3.5">
                    Staff terminal gateway
                  </div>

                  <h2 className="font-display font-black text-white text-xl tracking-tight uppercase">
                    Staff Sign In
                  </h2>
                  <p className="text-[11.5px] text-zinc-350 mt-2 leading-relaxed font-sans max-w-xs mx-auto bg-black/80 border border-zinc-800/80 px-4 py-2.5 rounded-xl backdrop-blur-md shadow-lg">
                    Select your staff profile, enter your PIN, and open the staff console.
                  </p>
                </div>

                <div className="w-full max-w-sm bg-black/60 backdrop-blur-lg border border-zinc-800/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden mb-2 flex flex-col gap-4 z-10">
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#3E5E93] to-transparent" />

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase font-black block">Staff profile</label>
                    <select
                      value={selectedStaffProfileId}
                      onChange={(e) => {
                        setSelectedStaffProfileId(e.target.value);
                        setStaffAuthError("");
                      }}
                      className="w-full bg-[#121212] border border-zinc-800 text-white rounded-xl px-3 py-3 outline-none focus:border-[#3E5E93]"
                    >
                      <option value={DEFAULT_GENERAL_PROFILE.id}>
                        {DEFAULT_GENERAL_PROFILE.name} • {DEFAULT_GENERAL_PROFILE.role}
                      </option>
                      {staffProfiles
                        .filter((p) => p.id !== DEFAULT_GENERAL_PROFILE.id)
                        .map((profile) => (
                          <option key={profile.id} value={profile.id}>
                            {profile.name} • {profile.role}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase font-black block">PIN</label>
                    <input
                      type="password"
                      value={staffPinInput}
                      onChange={(e) => {
                        setStaffPinInput(e.target.value);
                        setStaffAuthError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleStaffLogin();
                      }}
                      placeholder="Enter your PIN"
                      className="w-full bg-[#121212] border border-zinc-800 text-white rounded-xl px-3 py-3 outline-none focus:border-[#3E5E93]"
                    />
                  </div>

                  {staffAuthError && (
                    <div className="text-[11px] rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 px-3 py-2">
                      {staffAuthError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleStaffLogin}
                    disabled={!selectedStaffProfileId || staffPinInput.trim().length < 4}
                    className="h-12 bg-[#3E5E93] hover:bg-orange-500 font-sans text-[#121214] font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-[0_4px_15px_rgba(62, 94, 147,0.3)] disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Open Staff Console
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

          {/* --- THE ULTIMATE "TYPEFORM STYLE" Lutho BOOKING ENGINE MODAL --- */}
          {createPortal(
            <AnimatePresence>
              {isBookingModalOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setBookingStep(1);
                    }}
                    className="fixed inset-0 bg-black/90 z-[9900] backdrop-blur-xs cursor-pointer"
                  />

                  {/* Centered Modal Wrapper Container */}
                  <div className="fixed inset-0 z-[9905] flex items-center justify-center p-3 sm:p-4 overflow-hidden pointer-events-none">
                    {/* Modal Container */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 30 }}
                      transition={{ type: "spring", damping: 26, stiffness: 210 }}
                      className="w-full max-w-[460px] h-[88vh] max-h-[92%] sm:max-h-[580px] bg-[#3E5E93] text-zinc-950 rounded-3xl shadow-[0_0_50px_rgba(62, 94, 147,0.4)] overflow-hidden flex flex-col font-sans pointer-events-auto"
                    >
                  {/* Title Bar (Typeform minimalist layout) */}
                  <div className="p-4 bg-zinc-950 text-white flex justify-between items-center shrink-0 border-b border-[#3E5E93]/20">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src="/lutho-stamp-logo.png" 
                        alt="Lutho Logo" 
                        className="w-8 h-8 object-contain rounded-full border border-[#3E5E93]/30 shadow-inner p-0.5 bg-[#121212]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-display font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                          LUTHO TABLE WIZARD
                        </h4>
                        <p className="text-[8px] font-mono text-[#3E5E93] uppercase tracking-widest mt-0.5 font-bold">
                          OFFICIAL BOOKING OS 🤘
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-zinc-400 font-bold tracking-widest uppercase">
                        STEP {bookingStep}/5
                      </span>
                      <button
                        onClick={() => {
                          playBeep(450, "sine", 0.05);
                          setIsBookingModalOpen(false);
                          setBookingStep(1);
                        }}
                        className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer border border-zinc-805"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="h-1 bg-zinc-900 w-full shrink-0">
                    <motion.div 
                      className="h-full bg-white transition-all duration-300"
                      initial={{ width: "20%" }}
                      animate={{ width: `${(bookingStep / 5) * 100}%` }}
                    />
                  </div>

                  {/* Form Scrollable Content Body */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 [overscroll-behavior:contain] text-zinc-950">
                    {/* STEP 1: PARTY SIZE */}
                      {bookingStep === 1 && (
                        <motion.div
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4"
                        >
                          <span className="text-[10px] font-mono tracking-widest uppercase font-black bg-zinc-950 text-white px-2.5 py-1 rounded-full">
                            01. PARTY SIZE
                          </span>
                          <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight text-zinc-950 leading-tight mt-2">
                            How many rockers are we seating? 🤘
                          </h3>
                          <p className="text-[10.5px] text-zinc-900 leading-relaxed font-semibold">
                            Choose your party count. Note: Our small tables take maximum 4 guests, round tables and booths take up to 6.
                          </p>

                          {/* Fast Selection Buttons */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                            {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => {
                                  playBeep(380 + (num * 15), "triangle", 0.05);
                                  setBookingGuests(num);
                                }}
                                className={`p-3 rounded-2xl border-2 font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                                  bookingGuests === num
                                    ? "bg-zinc-950 text-[#3E5E93] border-zinc-950 shadow-md scale-[1.03]"
                                    : "bg-white/80 hover:bg-white text-zinc-950 border-black/10 hover:border-zinc-950"
                                }`}
                              >
                                {num === 1 ? "1 Guest 👤" : num === 8 ? "8 (Multiple)" : num === 10 ? "10 (Cru)" : `${num} Guests 👥`}
                              </button>
                            ))}
                          </div>

                          {/* Custom Slider Input */}
                          <div className="bg-zinc-950/5 p-4 rounded-2xl border border-black/10 mt-3 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[9.5px] font-mono font-bold text-zinc-900">CUSTOM PARTY SIZE:</span>
                              <span className="font-display font-black text-sm text-zinc-950">{bookingGuests} PEOPLE</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="12"
                              value={bookingGuests}
                              onChange={(e) => {
                                playBeep(450, "sine", 0.04);
                                setBookingGuests(parseInt(e.target.value, 10));
                              }}
                              className="w-full h-1.5 rounded-lg cursor-pointer"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 2: DATE & TIME SLOT */}
                      {bookingStep === 2 && (
                        <motion.div
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4"
                        >
                          <span className="text-[10px] font-mono tracking-widest uppercase font-black bg-zinc-950 text-white px-2.5 py-1 rounded-full">
                            02. DATE & HOUR
                          </span>
                          <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight text-zinc-950 leading-tight mt-2">
                            When is the crusade joining us? ⏰
                          </h3>
                          <p className="text-[10.5px] text-zinc-900 leading-relaxed font-semibold">
                            Pick a date at {RONDEBOSCH_VENUE.name}, {RONDEBOSCH_VENUE.address}. {RONDEBOSCH_VENUE.summary}
                          </p>
                          <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-wider">
                            Selected day: {getHoursLabelForDate(bookingDate)}
                          </p>

                          <div className="space-y-3 pt-2">
                            <div>
                              <label className="block text-[8px] font-mono font-black uppercase text-zinc-900 tracking-wider mb-1">
                                🗓️ BOOKING DATE REGISTER
                              </label>
                              <input
                                type="date"
                                value={bookingDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => {
                                  playBeep(480, "sine", 0.05);
                                  setBookingDate(e.target.value);
                                  setBookingTableId(null); // clear selection
                                }}
                                className="w-full bg-zinc-950 text-white border border-black/10 p-3 rounded-2xl font-mono text-xs uppercase focus:outline-none focus:ring-2 focus:ring-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[8px] font-mono font-black uppercase text-zinc-900 tracking-wider mb-1.5">
                                ⏰ HOUR-BLOCK TIMESLOT
                              </label>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                                {getBookingTimeSlots(bookingDate).map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => {
                                      playBeep(520, "sine", 0.05);
                                      setBookingTime(t);
                                    }}
                                    className={`p-2.5 rounded-xl border-2 font-mono font-black text-xs uppercase transition-all cursor-pointer ${
                                      bookingTime === t
                                        ? "bg-zinc-950 text-white border-zinc-950 shadow-md scale-[1.03]"
                                        : "bg-white/80 hover:bg-white text-zinc-950 border-black/10"
                                    }`}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 3: INTERACTIVE SEATING MAP BLUEPRINT */}
                      {bookingStep === 3 && (
                        <motion.div
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-3"
                        >
                          <span className="text-[10px] font-mono tracking-widest uppercase font-black bg-zinc-950 text-white px-2.5 py-1 rounded-full">
                            03. SEATING BLUEPRINT
                          </span>
                          <h3 className="font-display font-black text-lg md:text-xl uppercase tracking-tight text-zinc-950 leading-tight py-0.5">
                            Claw your space on our blueprint 🗺️
                          </h3>

                          {/* Seating Map Container (black contrast overlay) */}
                          <div className="bg-zinc-950 text-zinc-300 p-3.5 rounded-2xl border border-[#3E5E93]/30 shadow-inner">
                            <div className="flex justify-between items-center mb-2 flex-wrap gap-1">
                              <span className="text-[7.5px] font-mono text-zinc-550 uppercase tracking-wider font-extrabold">
                                📍 INTUITIVE FLOOR MATRIX
                              </span>
                              {bookingTableId ? (
                                <span className="text-[8.5px] bg-[#3E5E93] text-black px-1.5 py-0.5 rounded font-mono font-black uppercase">
                                  SELECTED: TABLE {bookingTableId}
                                </span>
                              ) : (
                                <span className="text-[8.5px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-black uppercase">
                                  TAP A TABLE TO SEAT
                                </span>
                              )}
                            </div>

                            {/* Legend explaining table types */}
                            <div className="grid grid-cols-3 gap-1 mb-2.5 bg-black/60 p-1.5 rounded-xl text-[7px] font-mono text-zinc-500 uppercase tracking-wider border border-zinc-900">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2 bg-[#5a3a22] border border-[#3E5E93]/20 rounded-sm" />
                                <span>Booth (6 max)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#5a3a22] border border-[#3E5E93]/20" />
                                <span>Round (6 max)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rotate-45 bg-[#5a3a22] border border-[#3E5E93]/20" />
                                <span>Small (4 max)</span>
                              </div>
                            </div>

                            {/* Blueprint grid rendering with custom diagonal texture */}
                            <div 
                              className="grid grid-cols-5 gap-1.5 p-2 rounded-xl border border-zinc-950 shadow-2xl max-w-sm mx-auto relative overflow-hidden"
                              style={{
                                backgroundColor: "#0b0b0c",
                                backgroundImage: "repeating-linear-gradient(45deg, rgba(62, 94, 147, 0.035) 0px, rgba(62, 94, 147, 0.035) 2px, transparent 2px, transparent 14px), repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.5) 0px, rgba(0, 0, 0, 0.5) 4px, transparent 4px, transparent 8px)"
                              }}
                            >
                              {Array.from({ length: 6 }, (_, rIdx) => {
                                const r = rIdx + 1;
                                return Array.from({ length: 5 }, (_, cIdx) => {
                                  const c = cIdx + 1;
                                  
                                  // Special check for Kitchen spanning Row 1, Col 1-4 (Top of L-shape)
                                  if (r === 1) {
                                    if (c === 1) {
                                      return (
                                        <div 
                                          key="kitchen-zone-span"
                                          className="col-span-4 rounded-lg border border-dashed border-[#3E5E93]/25 bg-[#3E5E93]/5 flex flex-col items-center justify-center text-center p-1 min-h-[46px]"
                                        >
                                          <span className="text-[7px] font-mono uppercase font-black leading-none tracking-widest text-[#3E5E93]">
                                            🍳 KITCHEN
                                          </span>
                                        </div>
                                      );
                                    }
                                    if (c === 2 || c === 3 || c === 4) {
                                      return null; // covered by col-span-4
                                    }
                                  }

                                  // Kitchen vertical leg of the L-shape running next to T1 and T9, ending above T4
                                  if ((r === 2 || r === 3) && c === 1) {
                                    return (
                                      <div 
                                        key={`kitchen-ext-${r}`}
                                        className="rounded-lg border border-dashed border-[#3E5E93]/25 bg-[#3E5E93]/5 flex flex-col items-center justify-center text-center p-1 min-h-[46px]"
                                      >
                                        <span className="text-[6px] font-mono uppercase font-black leading-none tracking-wider text-[#3E5E93]/80">
                                          🍳 KITCHEN
                                        </span>
                                      </div>
                                    );
                                  }

                                  const table = LUTHO_TABLES.find(t => t.row === r && t.col === c);

                                  if (table) {
                                    const tableId = table.id;
                                    const isBooked = bookings.some(
                                      b => String(b.tableId) === tableId && b.date === bookingDate
                                    );
                                    const isSelected = bookingTableId === tableId;

                                    return (
                                      <button
                                        key={table.id}
                                        type="button"
                                        onClick={() => {
                                          if (isBooked) {
                                            playBeep(220, "sawtooth", 0.15);
                                            triggerToast(`Table ${tableId} is booked! Choose another.`, "info");
                                          } else {
                                            playBeep(480 + (rIdx * 20), "sine", 0.05);
                                            setBookingTableId(tableId);
                                          }
                                        }}
                                        className={`relative p-0.5 rounded-lg flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer border transform active:scale-95 min-h-[46px] ${
                                          isBooked 
                                            ? "bg-red-950/20 border-red-500/25 text-red-500 cursor-not-allowed opacity-50" 
                                            : isSelected
                                            ? "bg-[#3E5E93]/15 border-[#3E5E93] text-[#3E5E93] shadow-[0_0_8px_rgba(62, 94, 147,0.3)] scale-[1.03]"
                                            : "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                                        }`}
                                        title={`${table.name} (Max ${table.capacity} guests)`}
                                      >
                                        {table.type === "booth" && (
                                          table.orientation === "vertical" ? (
                                            <div className="flex items-center gap-0.5 w-full h-[36px] p-0.5">
                                              <div className={`w-1 h-full rounded-l shrink-0 ${isSelected ? "bg-[#3E5E93]" : isBooked ? "bg-red-950/70" : "bg-[#2f190a]"}`} />
                                              <div className={`flex-1 h-full rounded flex flex-col items-center justify-center font-mono text-[8px] font-black leading-none ${isSelected ? "bg-[#5a3a22] border border-[#3E5E93]" : "bg-[#4a2f1b] border border-[#3e2413]"}`}>
                                                <span>T{tableId}</span>
                                                <span className="text-[4.5px] opacity-75 font-sans leading-none mt-0.5 font-bold">BTH</span>
                                              </div>
                                              <div className={`w-1 h-full rounded-r shrink-0 ${isSelected ? "bg-[#3E5E93]" : isBooked ? "bg-red-950/70" : "bg-[#2f190a]"}`} />
                                            </div>
                                          ) : (
                                            <div className="flex flex-col items-center gap-0.5 w-full h-[36px] p-0.5">
                                              <div className={`h-1 w-full rounded-t shrink-0 ${isSelected ? "bg-[#3E5E93]" : isBooked ? "bg-red-950/70" : "bg-[#2f190a]"}`} />
                                              <div className={`w-full flex-1 rounded flex flex-col items-center justify-center font-mono text-[8px] font-black leading-none ${isSelected ? "bg-[#5a3a22] border border-[#3E5E93]" : "bg-[#4a2f1b] border border-[#3e2413]"}`}>
                                                <span>T{tableId}</span>
                                                <span className="text-[4.5px] opacity-75 font-sans leading-none mt-0.5 font-bold">BTH</span>
                                              </div>
                                              <div className={`h-1 w-full rounded-b shrink-0 ${isSelected ? "bg-[#3E5E93]" : isBooked ? "bg-red-950/70" : "bg-[#2f190a]"}`} />
                                            </div>
                                          )
                                        )}

                                        {table.type === "round" && (
                                          <div className="relative w-full h-[36px] flex items-center justify-center">
                                            {[0, 60, 120, 180, 240, 300].map((angle, k) => (
                                              <div 
                                                key={k}
                                                className={`absolute w-1 h-1 rounded-full border ${k % 2 === 0 ? "bg-[#3E5E93] border-[#2f190a]" : "bg-black border-zinc-800"}`}
                                                style={{ transform: `rotate(${angle}deg) translateY(-11px)` }}
                                              />
                                            ))}
                                            <div className={`w-6.5 h-6.5 rounded-full border flex flex-col items-center justify-center font-mono text-[8px] font-black leading-none z-10 ${isSelected ? "border-[#3E5E93] bg-[#5a3a22]" : "border-[#3e2413] bg-[#4a2f1b]"}`}>
                                              <span>T{tableId}</span>
                                            </div>
                                          </div>
                                        )}

                                        {table.type === "small" && (
                                          <div className="relative w-full h-[36px] flex items-center justify-center">
                                            {[0, 90, 180, 270].map((angle, k) => (
                                              <div 
                                                key={k}
                                                className={`absolute w-1 h-1 rounded-sm border ${k % 2 === 0 ? "bg-[#3E5E93] border-[#2f190a]" : "bg-black border-zinc-800"}`}
                                                style={{ transform: `rotate(${angle}deg) translateY(-10px)` }}
                                              />
                                            ))}
                                            <div className={`w-5.5 h-5.5 rotate-45 border rounded flex items-center justify-center relative ${isSelected ? "border-[#3E5E93] bg-[#5a3a22]" : "border-[#3e2413] bg-[#4a2f1b]"}`}>
                                              <div className="-rotate-45 flex flex-col items-center justify-center font-mono text-[7.5px] font-black leading-none">
                                                <span>T{tableId}</span>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </button>
                                    );
                                  } else {
                                    let label = "";
                                    let isEnt = false;
                                    
                                    if (r === 2 && c === 5) { 
                                      label = "🚪 ENTRANCE"; 
                                      isEnt = true; 
                                    }
                                    if (r === 6 && c === 1) { 
                                      label = "🚽 BATH"; 
                                    }
                                    
                                    return (
                                      <div 
                                        key={`empty-${r}-${c}`} 
                                        className={`rounded-lg border border-dashed flex items-center justify-center text-center p-0.5 min-h-[46px] ${
                                          isEnt ? "border-[#3E5E93]/40 bg-[#3E5E93]/5" : "border-zinc-900/60 bg-zinc-950/20"
                                        }`}
                                      >
                                        {label ? (
                                          <span className={`text-[5px] font-mono uppercase font-black leading-none tracking-widest ${
                                            isEnt ? "text-[#3E5E93]" : "text-zinc-650"
                                          }`}>
                                            {label}
                                          </span>
                                        ) : (
                                          <div className="w-0.5 h-0.5 rounded-full bg-zinc-800" />
                                        )}
                                      </div>
                                    );
                                  }
                                });
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 4: GUEST IDENTITY, OCCASION & CRAZY REQUESTS */}
                      {bookingStep === 4 && (
                        <motion.div
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-3.5"
                        >
                          <span className="text-[10px] font-mono tracking-widest uppercase font-black bg-zinc-950 text-white px-2.5 py-1 rounded-full">
                            04. VIBES & DETAILS
                          </span>
                          <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight text-zinc-950 leading-tight mt-2">
                            Who's leading the crusade? 👤
                          </h3>
                          <p className="text-[10.5px] text-zinc-900 leading-relaxed font-semibold">
                            Enter the leader's identity & secure contact details. Plus, clarify your crazy dining vibes/requests below.
                          </p>

                          <div className="space-y-3 pt-1">
                            <div>
                              <label className="block text-[8px] font-mono font-black uppercase text-zinc-900 mb-1">
                                👤 CUSTOMER LEADER NAME
                              </label>
                              <input
                                type="text"
                                required
                                value={bookingName}
                                onChange={(e) => setBookingName(e.target.value)}
                                placeholder="E.g. JASON STATHAM"
                                className="w-full bg-zinc-950 text-white border border-black/10 p-2.5 rounded-xl font-mono text-xs uppercase focus:outline-none focus:ring-1 focus:ring-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[8px] font-mono font-black uppercase text-zinc-900 mb-1">
                                📞 MOBILE DIGITS TEL
                              </label>
                              <input
                                type="tel"
                                required
                                value={bookingPhone}
                                onChange={(e) => setBookingPhone(e.target.value)}
                                placeholder="CELLULAR NUMBER"
                                className="w-full bg-zinc-950 text-white border border-black/10 p-2.5 rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-white"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[8px] font-mono font-black uppercase text-zinc-900 mb-1">
                                  🎉 VIBE OCCASION
                                </label>
                                <select
                                  value={bookingOccasion}
                                  onChange={(e) => {
                                    playBeep(480, "sine", 0.04);
                                    setBookingOccasion(e.target.value);
                                  }}
                                  className="w-full bg-zinc-950 text-white border border-black/10 p-2.5 rounded-xl font-mono text-xs uppercase focus:outline-none"
                                >
                                  {["Just Vibes", "Birthday Bash", "Cheat Day", "Savage Hunger", "Date Night", "Crew Gathering"].map(occ => (
                                    <option key={occ} value={occ} className="bg-zinc-950">{occ}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[8px] font-mono font-black uppercase text-zinc-900 mb-1">
                                  ⚡ G-WAVE / REQUIREMENTS
                                </label>
                                <input
                                  type="text"
                                  value={bookingSpecialRequests}
                                  onChange={(e) => setBookingSpecialRequests(e.target.value)}
                                  placeholder="E.g. Extra hot wings, child seat"
                                  className="w-full bg-zinc-950 text-white border border-black/10 p-2.5 rounded-xl font-mono text-xs focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 5: TICKET SUMMARY & CONFIRM */}
                      {bookingStep === 5 && (
                        <motion.div
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-3.5"
                        >
                          <span className="text-[10px] font-mono tracking-widest uppercase font-black bg-zinc-950 text-white px-2.5 py-1 rounded-full">
                            05. DISPATCH TICKET
                          </span>
                          <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight text-zinc-950 leading-tight mt-2">
                            Secure your booking spot! 🎯
                          </h3>

                          {/* Retro ticket design block */}
                          <div className="bg-zinc-950 text-[#3E5E93] p-4 rounded-2xl border-2 border-dashed border-[#3E5E93] font-mono relative overflow-hidden shadow-2xl space-y-3">
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#3E5E93]" />
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#3E5E93]" />

                            <div className="text-center pb-2 border-b-2 border-dashed border-[#3E5E93]/30">
                              <h6 className="text-[12px] font-black text-white tracking-widest uppercase">
                                LUTHO CRUSADE TICKET
                              </h6>
                              <p className="text-[8px] text-zinc-400 mt-0.5">
                                SERIAL: {Date.now().toString(36).toUpperCase()}-OS
                              </p>
                            </div>

                            <div className="space-y-1.5 text-xs text-zinc-300">
                              <div className="flex justify-between">
                                <span className="text-zinc-500">LEADER:</span>
                                <span className="font-bold text-white uppercase">{bookingName || "NOT INPUTTED"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">MOBILE CELL:</span>
                                <span className="font-bold text-white">{bookingPhone || "NOT INPUTTED"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">PARTY SIZE:</span>
                                <span className="font-bold text-[#3E5E93]">{bookingGuests} GUESTS</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">DATE & HOUR:</span>
                                <span className="font-bold text-white">{bookingDate} • {bookingTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">TABLE CHOSEN:</span>
                                <span className="font-bold text-[#3E5E93] uppercase">
                                  {bookingTableId ? `TABLE ${bookingTableId}` : "NOT CHOSEN ❌"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">OCCASION:</span>
                                <span className="font-bold text-white uppercase">{bookingOccasion}</span>
                              </div>
                              {bookingSpecialRequests && (
                                <div className="border-t border-[#3E5E93]/20 pt-1.5 mt-2">
                                  <span className="text-zinc-500 text-[10px]">CRAZY GUESTS REQUESTS:</span>
                                  <p className="text-zinc-300 italic text-[10.5px] mt-0.5">"{bookingSpecialRequests}"</p>
                                </div>
                              )}
                            </div>

                            <div className="text-center pt-2 border-t-2 border-dashed border-[#3E5E93]/30 text-[9px] text-[#3E5E93]/80">
                              <p className="font-extrabold tracking-widest uppercase">
                                🤘 WE'RE NOT NORMAL 🤘
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Slogan & Wizard Controls Footer section (Sticky Bottom Bar) */}
                    <div className="p-4 sm:p-5 border-t border-black/10 bg-[#3E5E93] shrink-0 mt-auto flex flex-col gap-3">
                      <div className="text-center">
                        <span className="text-[10px] font-display font-black tracking-widest text-zinc-950 uppercase select-none opacity-80 animate-pulse">
                          WE'RE NOT NORMAL SQUAD 🤘
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {bookingStep > 1 ? (
                          <button
                            type="button"
                            onClick={() => {
                              playBeep(450, "sine", 0.05);
                              setBookingStep(prev => prev - 1);
                            }}
                            className="px-4 py-3 bg-zinc-950 text-white font-sans text-xs uppercase rounded-xl tracking-wider transition-all cursor-pointer font-bold border border-zinc-900 active:scale-95 shrink-0"
                          >
                            Back ⬅️
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              playBeep(450, "sine", 0.05);
                              setIsBookingModalOpen(false);
                            }}
                            className="px-4 py-3 bg-zinc-950 text-zinc-400 font-sans text-xs uppercase rounded-xl tracking-wider transition-all cursor-pointer font-bold active:scale-95 shrink-0"
                          >
                            Close
                          </button>
                        )}

                        {bookingStep < 5 ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (bookingStep === 3 && !bookingTableId) {
                                playBeep(220, "sawtooth", 0.1);
                                triggerToast("Claw/choose an available table from the blueprint map to advance!", "info");
                                return;
                              }
                              if (bookingStep === 4 && (!bookingName.trim() || !bookingPhone.trim())) {
                                playBeep(220, "sawtooth", 0.1);
                                triggerToast("Rocker Leader Name and Mobile Telephone are required!", "info");
                                return;
                              }
                              playBeep(600, "sine", 0.05);
                              setBookingStep(prev => prev + 1);
                            }}
                            className="flex-1 py-3 bg-zinc-950 text-white hover:bg-zinc-900 font-sans text-xs uppercase rounded-xl tracking-wider transition-transform active:scale-95 cursor-pointer text-center font-bold"
                          >
                            CONTINUE WIZARD ➡️
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (!bookingTableId) {
                                playBeep(220, "sawtooth", 0.1);
                                triggerToast("Please return to Step 3 and pick a seating plan spot!", "info");
                                setBookingStep(3);
                                return;
                              }
                              if (!bookingName.trim() || !bookingPhone.trim()) {
                                playBeep(220, "sawtooth", 0.1);
                                triggerToast("Leader Name and Contact numbers are requested!", "info");
                                setBookingStep(4);
                                return;
                              }

                              playBeep(659.25, "sine", 0.08); // E5
                              setTimeout(() => playBeep(880, "sine", 0.12), 70); // A5

                              const newBooking = {
                                id: "b-" + Date.now().toString(36).toUpperCase(),
                                date: bookingDate,
                                time: bookingTime,
                                guests: bookingGuests,
                                tableId: bookingTableId,
                                name: bookingName.trim(),
                                phone: bookingPhone.trim(),
                                occasion: bookingOccasion,
                                specialRequests: bookingSpecialRequests.trim()
                              };

                              setBookings(prev => [newBooking, ...prev]);

                              setTablesState(prev => ({
                                ...prev,
                                [bookingTableId]: "Booked"
                              }));

                              setIsBookingModalOpen(false);
                              setBookingStep(1);
                              triggerToast(`Table ${bookingTableId} is successfully secured for ${bookingName}! 🎫`, "success");

                              setBookingName("");
                              setBookingPhone("");
                              setBookingSpecialRequests("");
                              setBookingOccasion("Just Vibes");
                              setBookingTableId(null);
                            }}
                            className="flex-1 py-3 bg-white text-zinc-950 hover:bg-zinc-100 font-sans text-xs uppercase rounded-xl tracking-wider transition-transform active:scale-95 cursor-pointer text-center font-black drop-shadow-md"
                          >
                            LOCK IN RESERVATION 🔥
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

          {/* --- THE GAMES ARENA INTERACTIVE PLAYGROUND --- */}
          {createPortal(
            <AnimatePresence>
              {isGamesModalOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setIsGamesModalOpen(false);
                      setSelectedDrinkingGame(null);
                    }}
                    className="fixed inset-0 bg-black/95 z-[9910] backdrop-blur-sm cursor-pointer"
                  />

                  {/* Centered Modal Wrapper Container */}
                  <div className="fixed inset-0 z-[9915] flex items-center justify-center p-3 sm:p-4 overflow-hidden pointer-events-none">
                    {/* Modal */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: 20 }}
                      className={`w-full h-[90vh] max-h-[725px] bg-[#141614] border-2 rounded-3xl overflow-hidden flex flex-col font-sans pointer-events-auto transition-all duration-300 ${
                        isThuneePlaying 
                          ? "max-w-[980px] border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]" 
                          : "max-w-[440px] border-[#3E5E93] shadow-[0_0_40px_rgba(62, 94, 147,0.3)]"
                      }`}
                    >
                  {/* Header Bar */}
                  <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl animate-bounce">{isThuneePlaying ? "🃏" : "🍺"}</span>
                      <div>
                        <h4 className={`font-display font-black text-xs uppercase tracking-widest leading-none ${isThuneePlaying ? 'text-emerald-400' : 'text-[#3E5E93]'}`}>
                          {isThuneePlaying ? "DURBANITE THUNEE CARD COCKPIT" : "LUTHO OS GAMES"}
                        </h4>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase mt-1 border-none pb-0">
                          {isThuneePlaying ? `MODE: ${thuneeGameMode || "LOBBY RECEPTION"}` : selectedDrinkingGame ? `GAME: ${selectedDrinkingGame.replace("_", " ")}` : "CONNECTED OFFLINE PLAYGROUND"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        setIsGamesModalOpen(false);
                        setSelectedDrinkingGame(null);
                      }}
                      className="p-2 bg-[#121212] border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Viewport */}
                  <div className="flex-1 bg-black relative flex flex-col overflow-y-auto select-none">
                    {/* Geometric Grid Texture Design once opened */}
                    <div className="absolute inset-x-0 top-0 h-[350px] bg-[linear-gradient(to_right,#1c1c1e_12%,transparent_12%),linear-gradient(to_bottom,#1c1c1e_12%,transparent_12%)] bg-[size:20px_20px] opacity-[0.16] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(#2c2c30_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-[0.25]" />
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-orange-500/[0.04] to-transparent pointer-events-none" />
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#3E5E93]/40 to-transparent pointer-events-none" />
                    
                    {/* TOP TAB CONTROL - Only visible in the main lobby selection */}
                    {selectedDrinkingGame === null && (
                      <div className="px-4 pt-3.5 pb-0.5 border-b border-zinc-900 bg-[#121212] flex gap-1 justify-between shrink-0 relative z-10">
                        {(["DRINKING", "ARCADE", "CHALLENGES"] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => {
                              playBeep(520, "sine", 0.05);
                              setActiveGameTab(tab);
                            }}
                            className={`flex-1 py-3 text-center font-display font-black text-[10px] uppercase tracking-wider rounded-t-xl transition-all border-b-2 cursor-pointer ${
                              activeGameTab === tab
                                ? "bg-[#1C1C1E] text-[#3E5E93] border-b-[#3E5E93] font-bold"
                                : "text-zinc-500 hover:text-zinc-300 border-b-transparent"
                            }`}
                          >
                            {tab === "DRINKING" ? "🥤 PARTY" : tab === "ARCADE" ? "🕹️ ARCADE" : "🏆 CHALLENGES"}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* MAIN GAME LOBBY */}
                    {selectedDrinkingGame === null ? (
                      <div className="flex-1 flex flex-col justify-between p-5">
                        
                        {/* --- TAB 1: PARTY PARLOR GAMES --- */}
                        {activeGameTab === "DRINKING" && (
                          <div className="w-full">
                            {/* Centers Brand Header */}
                            <div className="flex flex-col items-center justify-center pt-2 pb-1 text-center">
                              <img 
                                src="/lutho-logo.png" 
                                alt="Lutho" 
                                className="w-16 h-16 object-contain hover:scale-105 transition-transform duration-300 pointer-events-none" 
                                referrerPolicy="no-referrer"
                              />
                              <h2 className="text-[#3E5E93] font-display font-black text-xl tracking-[0.14em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1 leading-none">
                                PARTY ARENA
                              </h2>
                            </div>

                            <div className="text-center px-1 mb-4 mt-0.5">
                              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Welcome to the Lounge!</h3>
                              <p className="text-[10px] text-zinc-400 mt-0.5 max-w-[280px] mx-auto">Pick a parlor game and complete challenges with milkshakes & sodas!</p>
                            </div>

                            {/* Durbanite Thunee Arena moved to Top of Party Section */}
                            <div className="mb-4 p-4 bg-[#1C1C1E] rounded-2xl border border-zinc-850 flex flex-col justify-between items-stretch gap-3 text-left">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">🃏</span>
                                <div>
                                  <h4 className="font-display font-black text-[#10B981] text-xs uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
                                    Durbanite Thunee Arena 🃏
                                    <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest leading-none">PARTY FAVORITE</span>
                                  </h4>
                                  <p className="text-[10px] leading-none text-zinc-400 font-mono uppercase tracking-wide mt-1">
                                    SOUTH AFRICAN CLASSIC
                                  </p>
                                  <p className="text-[9.5px] text-zinc-400 mt-1.5 leading-tight border-none pb-0">
                                    A rapid-fire South African trick-taking classic! Partner with the griddle team to win 151 pts, call THUNEE, or trigger a KANSEE sweep!
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  playBeep(900, "sine", 0.08);
                                  setIsThuneePlaying(true);
                                  setIsGamesModalOpen(false); // Close the Games Arena modal trigger so it does not lie open underneath!
                                  localStorage.removeItem("lutho_thunee_room_" + currentTableId);
                                  setThuneeGameMode(null);
                                  setThuneeSeats([null, null, null, null]);
                                  setThuneeGameScores({ ourTeam: 0, enemyTeam: 0 });
                                  setThuneeRoundScores({ ourTeam: 0, enemyTeam: 0 });
                                  setThuneeStage("DEAL");
                                  setThuneeHand([]);
                                  setThuneePlayedCardsNew([]);
                                  setThuneeGameStatusText("Nominate Trump! Choose a suit that matches your top Jack or Nine!");
                                }}
                                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-black text-xs uppercase rounded-xl tracking-wider cursor-pointer font-extrabold text-center transition-colors"
                              >
                                Launch Party Thunee 🃏
                              </button>
                            </div>

                            {/* 2-Column Grid */}
                            <div className="grid grid-cols-2 gap-3 mt-1">
                              {[
                                { id: "KINGS_CUP" as const, title: "Kings Cup", desc: "Draw wings & follow crazy rules", icon: "👑" },
                                { id: "TRUTH_DARE" as const, title: "Truth or Dare", desc: "Speak clean truth or face challenges", icon: "❓" },
                                { id: "NEVER_EVER" as const, title: "Never Have I Ever", desc: "Confess food crimes or take a sip", icon: "🚫" },
                                { id: "MOST_LIKELY" as const, title: "Most Likely To", desc: "Point out who eats the most ribs", icon: "👥" },
                                { id: "SPIN_BOTTLE" as const, title: "Spin the Bottle", desc: "Spin the mustard bottle, take challenges", icon: "🔄" },
                                { id: "WOULD_RATHER" as const, title: "Would You Rather", desc: "Pick a side, minority munches fries", icon: "⚖️" },
                              ].map((g) => (
                                <button
                                  key={g.id}
                                  onClick={() => {
                                    playBeep(550, "sine", 0.08);
                                    setSelectedDrinkingGame(g.id);
                                    if (g.id === "KINGS_CUP") {
                                      setKingsCupCard(null);
                                    } else if (g.id === "TRUTH_DARE") {
                                      setTruthOrDarePrompt(null);
                                    } else if (g.id === "SPIN_BOTTLE") {
                                      setBottleRotation(0);
                                      setBottleTargetOutcome("Ready, tap SPIN to start!");
                                      setIsBottleSpinning(false);
                                    } else if (g.id === "WOULD_RATHER") {
                                      setWouldRatherVotes(null);
                                    }
                                  }}
                                  className="bg-[#1C1C1E] hover:bg-zinc-900 border border-zinc-800 text-left p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer relative overflow-hidden group shadow-md min-h-[125px]"
                                >
                                  <div className="w-9 h-9 rounded-full bg-black/60 border border-[#3E5E93]/20 flex items-center justify-center text-base text-orange-500 shadow-inner group-hover:scale-110 transition-transform">
                                    {g.icon}
                                  </div>
                                  <div className="flex flex-col items-center flex-1 justify-center">
                                    <span className="font-sans font-black text-xs uppercase tracking-wider text-white">
                                      {g.title}
                                    </span>
                                    <span className="text-[9px] text-zinc-500 font-sans mt-0.5 leading-tight text-center max-w-[130px]">
                                      {g.desc}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* --- TAB 2: RETRO TABLE ARCADE --- */}
                        {activeGameTab === "ARCADE" && (
                          <div className="w-full flex flex-col">
                            
                            {/* If Burger Catcher is playing */}
                            {isBurgerPlaying ? (
                              <div className="bg-zinc-950 p-2 rounded-2xl border border-zinc-900">
                                <div className="flex justify-between items-center bg-black/80 px-3 py-1.5 rounded-xl border border-zinc-900">
                                  <div className="text-left font-mono">
                                    <p className="text-[8px] uppercase text-zinc-500">Toppings Caught</p>
                                    <p className="text-sm font-sub font-black text-[#3E5E93]">{burgerCatcherScore} PTS</p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-mono text-zinc-400 mr-1 uppercase">Lives:</span>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                      <span key={i} className={`text-sm ${i < burgerCatcherLives ? "opacity-100" : "opacity-15"}`}>🍔</span>
                                    ))}
                                  </div>
                                </div>

                                <div className="h-[400px] w-full bg-[#121212] border border-zinc-900 rounded-xl relative overflow-hidden mt-3 shadow-inner">
                                  {/* Scanning lines */}
                                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/35 pointer-events-none" />
                                  
                                  {/* Falling toppings elements */}
                                  {fallingIngredients.map((ing) => (
                                    <div
                                      key={ing.id}
                                      className="absolute text-3xl pointer-events-none"
                                      style={{ 
                                        left: `${Math.min(90, Math.max(5, (ing.x / 360) * 100))}%`, 
                                        top: `${Math.min(92, Math.max(0, ing.y))}%`,
                                        transform: "translateX(-12px)"
                                      }}
                                    >
                                      {ing.emoji}
                                    </div>
                                  ))}

                                  {/* Catcher flat bottom bun */}
                                  <div 
                                    className="absolute bottom-2 h-7 bg-transparent flex items-center justify-center text-4xl transition-all duration-75 pointer-events-none font-bold"
                                    style={{ 
                                      left: `${Math.min(90, Math.max(10, (burgerPosition / 360) * 100))}%`, 
                                      transform: "translateX(-20px)" 
                                    }}
                                  >
                                    🍞
                                  </div>
                                </div>

                                {/* Joystick Clickers */}
                                <div className="flex gap-2.5 mt-3.5 select-none touch-none">
                                  <button
                                    onMouseDown={() => {
                                      setIsPressingLeft(true);
                                      playBeep(330, "sine", 0.05);
                                    }}
                                    onMouseUp={() => setIsPressingLeft(false)}
                                    onMouseLeave={() => setIsPressingLeft(false)}
                                    onTouchStart={(e) => {
                                      e.preventDefault();
                                      playBeep(330, "sine", 0.05);
                                      setIsPressingLeft(true);
                                    }}
                                    onTouchEnd={(e) => {
                                      e.preventDefault();
                                      setIsPressingLeft(false);
                                    }}
                                    className="flex-1 py-3.5 bg-[#1C1C1E] active:bg-[#3E5E93] active:text-black hover:border-zinc-700 border border-zinc-800 text-zinc-300 font-sans font-black text-xs uppercase tracking-wide rounded-xl transition-all cursor-pointer text-center select-none touch-none"
                                  >
                                    ◀◀ PRESS & HOLD LEFT
                                  </button>
                                  <button
                                    onMouseDown={() => {
                                      setIsPressingRight(true);
                                      playBeep(330, "sine", 0.05);
                                    }}
                                    onMouseUp={() => setIsPressingRight(false)}
                                    onMouseLeave={() => setIsPressingRight(false)}
                                    onTouchStart={(e) => {
                                      e.preventDefault();
                                      playBeep(330, "sine", 0.05);
                                      setIsPressingRight(true);
                                    }}
                                    onTouchEnd={(e) => {
                                      e.preventDefault();
                                      setIsPressingRight(false);
                                    }}
                                    className="flex-1 py-3.5 bg-[#1C1C1E] active:bg-[#3E5E93] active:text-black hover:border-zinc-700 border border-zinc-800 text-zinc-300 font-sans font-black text-xs uppercase tracking-wide rounded-xl transition-all cursor-pointer text-center select-none touch-none"
                                  >
                                    PRESS & HOLD RIGHT ▶▶
                                  </button>
                                </div>

                                <button
                                  onClick={() => {
                                    playBeep(250, "sine", 0.05);
                                    setIsBurgerPlaying(false);
                                  }}
                                  className="w-full mt-3.5 text-center text-[10px] font-mono uppercase text-red-400 hover:underline cursor-pointer block"
                                >
                                  Quit Active Catcher Game
                                </button>
                              </div>
                            ) : (isDefuserPlaying || showLeaderboardSubmit) ? (
                              <div className={`bg-zinc-950 p-2.5 rounded-2xl border border-zinc-900 flex flex-col gap-3 transition-transform ${defuserScreenshake ? 'animate-shake' : ''}`}>
                                {/* Header / Stats panel */}
                                <div className="flex justify-between items-center bg-black/80 px-3 py-1.5 rounded-xl border border-zinc-900">
                                  <div className="text-left font-mono">
                                    <p className="text-[8px] uppercase text-zinc-500">Volts / Score</p>
                                    <p className="text-xs font-bold text-[#3E5E93]">{defuserScore} PTS</p>
                                  </div>
                                  <div className="text-center font-mono">
                                    <p className="text-[8px] uppercase text-zinc-500">HI-SCORE</p>
                                    <p className="text-xs font-black text-zinc-300">{defuserHighScore} PTS</p>
                                  </div>
                                  <div className="flex items-center gap-1.55">
                                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Lives:</span>
                                    <div className="flex gap-0.5">
                                      {Array.from({ length: 3 }).map((_, i) => (
                                        <span key={i} className={`text-xs ${i < defuserLives ? "opacity-100" : "opacity-15 grayscale"}`}>❤️</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {showLeaderboardSubmit ? (
                                  /* LEADERBOARD RECORD SUBMISSION SCREEN */
                                  <div className="bg-black/60 p-4 rounded-xl border border-orange-500/30 flex flex-col items-center text-center gap-3">
                                    <span className="text-3xl animate-bounce">🏆</span>
                                    <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest leading-none">
                                      NEW ROCK RECORD!
                                    </h4>
                                    <p className="text-[10px] text-zinc-400 max-w-[280px]">
                                      You scored <span className="text-[#3E5E93] font-black">{defuserScore} PTS</span>! Input your rocker name to record your place on the local griddle charts!
                                    </p>
                                    <div className="w-full space-y-1.5">
                                      <input
                                        type="text"
                                        maxLength={10}
                                        placeholder="E.G. SLASH"
                                        value={leaderboardNameInput}
                                        onChange={(e) => setLeaderboardNameInput(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                                        className="w-full p-2 bg-zinc-900 border border-zinc-800 text-center uppercase font-mono text-xs rounded-lg text-[#3E5E93] focus:outline-none focus:border-[#3E5E93] font-bold"
                                      />
                                      <button
                                        onClick={() => {
                                          if (!leaderboardNameInput.trim()) {
                                            triggerToast("Input your rocker name!", "info");
                                            return;
                                          }
                                          playBeep(880, "sine", 0.1);
                                          const nextEntry = {
                                            name: leaderboardNameInput.toUpperCase().trim(),
                                            score: defuserScore,
                                            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                                          };
                                          setDefuserLeaderboard(prev => {
                                            const updated = [...prev, nextEntry]
                                              .sort((a,b) => b.score - a.score)
                                              .slice(0, 5);
                                            localStorage.setItem("lutho_defuser_leaderboard", JSON.stringify(updated));
                                            return updated;
                                          });
                                          setShowLeaderboardSubmit(false);
                                          triggerToast("Record saved to leaderboard! 🤘", "success");
                                        }}
                                        className="w-full py-2 bg-[#3E5E93] hover:bg-orange-400 text-black font-sans font-black text-xs uppercase rounded-lg tracking-wide cursor-pointer font-bold"
                                      >
                                        Record Placement 🤘
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  /* ACTIVE PLAY GRID (3x3) */
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-2 bg-black/40 p-2 rounded-xl border border-zinc-900 shadow-inner">
                                      {defuserGrid.map((cell) => {
                                        return (
                                          <button
                                            key={cell.id}
                                            onClick={() => {
                                              if (!cell.active || defuserLives <= 0) return;

                                              if (cell.type === "CHILI") {
                                                // BOOM! Big damage!
                                                playBeep(140, "sawtooth", 0.25);
                                                setDefuserLives(l => {
                                                  const nextL = l - 1;
                                                  if (nextL <= 0) {
                                                    setIsDefuserPlaying(false);
                                                    triggerToast("💀 Chili bomb exploded! Game Over!", "info");
                                                    setDefuserHighScore(currentHigh => {
                                                      if (defuserScore > currentHigh) {
                                                        localStorage.setItem("lutho_defuser_highscore", defuserScore.toString());
                                                        return defuserScore;
                                                      }
                                                      return currentHigh;
                                                    });
                                                    // Check qualification
                                                    const lowestLeaderboardScore = defuserLeaderboard.length >= 5 
                                                      ? Math.min(...defuserLeaderboard.map(e => e.score))
                                                      : 0;
                                                    if (defuserScore > lowestLeaderboardScore || defuserLeaderboard.length < 5) {
                                                      setShowLeaderboardSubmit(true);
                                                    }
                                                  } else {
                                                    setDefuserScreenshake(true);
                                                    setTimeout(() => setDefuserScreenshake(false), 200);
                                                    triggerToast("💥 Ouch! Tapped a red chili!", "info");
                                                  }
                                                  return Math.max(0, nextL);
                                                });
                                                // reset current cell
                                                setDefuserGrid(prev => prev.map(c => c.id === cell.id ? { ...c, active: false } : c));
                                              } else if (cell.type === "GOLD") {
                                                // big bonus
                                                playBeep(920, "sine", 0.08);
                                                setDefuserScore(s => s + 30);
                                                triggerToast("✨ GOLD FRY BONUS (+30 pts)! 🍟", "success");
                                                setDefuserGrid(prev => prev.map(c => c.id === cell.id ? { ...c, active: false } : c));
                                              } else {
                                                // cheese bomb
                                                playBeep(640, "sine", 0.05);
                                                setDefuserScore(s => s + 10);
                                                setDefuserGrid(prev => prev.map(c => c.id === cell.id ? { ...c, active: false } : c));
                                              }
                                            }}
                                            className={`aspect-square rounded-xl border relative flex flex-col items-center justify-center cursor-pointer transition-all ${
                                              cell.active
                                                ? cell.type === "CHILI"
                                                  ? "bg-red-950/70 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse"
                                                  : cell.type === "GOLD"
                                                  ? "bg-amber-950/70 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                                                  : "bg-orange-950/70 border-[#3E5E93] shadow-[0_0_12px_rgba(62, 94, 147,0.5)]"
                                                : "bg-[#1C1C1E]/40 border-zinc-900/60 opacity-60 hover:bg-[#1C1C1E]/70"
                                            }`}
                                          >
                                            {cell.active ? (
                                              <div className="flex flex-col items-center gap-1 w-full px-1">
                                                <span className="text-lg select-none leading-none">
                                                  {cell.type === "CHILI" ? "🌶️" : cell.type === "GOLD" ? "🍟" : "💥"}
                                                </span>
                                                <span className={`text-[7.5px] font-bold uppercase tracking-wider ${cell.type === "CHILI" ? "text-red-400" : cell.type === "GOLD" ? "text-amber-400" : "text-[#3E5E93]"} select-none leading-none`}>
                                                  {cell.type === "CHILI" ? "AVOID!" : cell.type === "GOLD" ? "BONUS!" : "DEFUSE!"}
                                                </span>
                                                
                                                {/* Fuse progress bar */}
                                                <div className="w-full bg-zinc-950/80 h-1 rounded-full overflow-hidden mt-1">
                                                  <div 
                                                    className={`h-full ${cell.type === "CHILI" ? "bg-red-500" : cell.type === "GOLD" ? "bg-amber-400" : "bg-orange-500"} rounded-full transition-all duration-75`} 
                                                    style={{ width: `${cell.fuse}%` }} 
                                                  />
                                                </div>
                                              </div>
                                            ) : (
                                              <span className="text-zinc-700 text-[8px] uppercase font-mono select-none">Plate {cell.id + 1}</span>
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* High-tension level indicators */}
                                <div className="flex justify-between items-center text-[8.5px] font-mono uppercase bg-black/30 p-2 rounded-xl border border-zinc-900 text-zinc-500">
                                  <span>HEAT SCALE:</span>
                                  <span className={`font-black ${
                                    defuserScore > 180 ? "text-red-500 animate-pulse" : 
                                    defuserScore > 100 ? "text-orange-500" : "text-orange-400/70"
                                  }`}>
                                    {defuserScore > 180 ? "🔥 HELLFIRE HYPERMODE" : 
                                     defuserScore > 100 ? "🔥 DOUBLE SIZZLE" : "🍔 MILD SLOW-COOK"}
                                  </span>
                                </div>

                                {/* Quit/Go Back buttons */}
                                <button
                                  onClick={() => {
                                    playBeep(250, "sine", 0.05);
                                    setIsDefuserPlaying(false);
                                    setShowLeaderboardSubmit(false);
                                  }}
                                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 hover:border-red-550 border border-zinc-850 text-zinc-400 font-sans font-black text-xs uppercase tracking-wide rounded-xl transition-all cursor-pointer text-center font-bold"
                                >
                                  Return to Select Menu
                                </button>
                              </div>
                            ) : isThuneePlaying ? (
                              <div className="p-8 text-center bg-zinc-950/90 rounded-2xl border border-zinc-900">
                                <span className="text-3xl animate-pulse">🃏</span>
                                <h4 className="text-white font-display font-black text-xs uppercase mt-3 tracking-widest">
                                  THUNEE ARENA ACTIVE
                                </h4>
                                <p className="text-[10px] text-zinc-400 max-w-xs mx-auto mt-2 leading-relaxed font-mono">
                                  The Durban Classic Arena is now running in fullscreen. Head back to the main client floor to access the live scoreboard table and coach strategy desk!
                                </p>
                                <div className="mt-5 flex gap-2 justify-center">
                                  <button
                                    onClick={() => {
                                      playBeep(250, "sine", 0.05);
                                      setIsGamesModalOpen(false);
                                    }}
                                    className="px-4 py-2 bg-[#3E5E93] text-black hover:bg-orange-400 font-sans font-black text-[10px] uppercase tracking-wide rounded-xl transition-all cursor-pointer"
                                  >
                                    Go to Fullscreen Arena
                                  </button>
                                  <button
                                    onClick={() => {
                                      playBeep(250, "sine", 0.05);
                                      setIsThuneePlaying(false);
                                    }}
                                    className="px-4 py-2 bg-zinc-900 text-red-400 hover:text-red-300 border border-zinc-805 font-sans font-black text-[10px] uppercase rounded-xl transition-all cursor-pointer"
                                  >
                                    Shutdown Arena
                                  </button>
                                </div>
                              </div>
                            ) : false ? (
                              <div className="space-y-4 flex flex-col h-full min-h-[560px] text-zinc-300">
                                {/* GAME MODE CHOICE LAUNCHER */}
                                {thuneeGameMode === null ? (
                                  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0c1810] to-[#040905] rounded-2xl border border-emerald-900/30 text-center space-y-6">
                                    <div className="space-y-2">
                                      <div className="inline-flex items-center justify-center p-3 bg-emerald-950/40 border border-emerald-500/10 rounded-full text-3xl animate-pulse text-emerald-400">
                                        ♠️ 👑 ♣️
                                      </div>
                                      <h3 className="font-display font-black text-white text-base tracking-widest uppercase">
                                        DURBAN CLASSIC THUNEE CLUB
                                      </h3>
                                      <p className="text-[10px] text-emerald-500/80 uppercase font-mono tracking-widest">
                                        EST. 1982 • HIGH-STAKES RESTAURANT TABLE ARENA
                                      </p>
                                    </div>

                                    <div className="max-w-md text-xs text-zinc-400 leading-relaxed">
                                      Welcome to <span className="text-emerald-400 font-bold">Thunee</span>, the ultimate fast-paced South African card game of wit, trick-sweeping, and high-fidelity call declarations! Choose your playground mode:
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-2">
                                      {/* Option A: Solo vs AI Bots */}
                                      <button
                                        onClick={() => {
                                          playBeep(880, "sine", 0.08);
                                          const nextSeats = [currentPlayerName, "🧑‍🍳 Grill Boss Bot", "⚔️ Supa Smash Bot", "🍗 Wing Ranger Bot"];
                                          setThuneeGameMode("AI");
                                          setThuneeSeats(nextSeats);
                                          setThuneeHostName(currentPlayerName);
                                          setThuneeStage("DEAL");
                                          setThuneeGameScores({ ourTeam: 0, enemyTeam: 0 });
                                          setThuneeRoundScores({ ourTeam: 0, enemyTeam: 0 });
                                          setThuneeTricksWon({ ourTeam: 0, enemyTeam: 0 });
                                          setThuneePlayedCardsNew([]);
                                          setThuneeTrumpSuit(null);
                                          setThuneeGameStatusText("Ready to deal! Click 'DEAL ROUND 1' below.");
                                          triggerToast("Solo Practice Game Initialized! 🤖", "success");
                                        }}
                                        className="p-5 bg-black/60 hover:bg-[#07190d]/50 border border-emerald-900/40 hover:border-emerald-500/50 rounded-2xl text-left transition-all duration-300 group cursor-pointer hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex flex-col justify-between space-y-4"
                                      >
                                        <div className="space-y-1.5">
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/40 uppercase">SOLO PRACTICE</span>
                                            <span className="text-zinc-600 font-mono text-[9px] uppercase font-bold">Bot Arena</span>
                                          </div>
                                          <h4 className="font-sans font-black text-white text-xs uppercase tracking-wide group-hover:text-emerald-400 duration-200">
                                            🤖 Duel the Kitchen Bots
                                          </h4>
                                          <p className="text-[10px] text-zinc-500 leading-normal">
                                            Instant round starts against calibrated diner bots. Perfect for sharpening your trick calculus offline!
                                          </p>
                                        </div>
                                        <div className="text-[10px] font-mono text-emerald-500 uppercase flex items-center gap-1 font-bold pt-1.5 border-t border-zinc-900">
                                          Launch Practice Match ▶
                                        </div>
                                      </button>

                                      {/* Option B: Multiplayer Table Lobby */}
                                      <button
                                        onClick={() => {
                                          playBeep(880, "sine", 0.08);
                                          const nextSeats = [currentPlayerName, null, null, null];
                                          setThuneeGameMode("MULTIPLAYER");
                                          setThuneeHostName(currentPlayerName);
                                          setThuneeSeats(nextSeats);
                                          setThuneeStage("DEAL");
                                          setThuneeGameScores({ ourTeam: 0, enemyTeam: 0 });
                                          setThuneeRoundScores({ ourTeam: 0, enemyTeam: 0 });
                                          setThuneeTricksWon({ ourTeam: 0, enemyTeam: 0 });
                                          setThuneePlayedCardsNew([]);
                                          setThuneeTrumpSuit(null);
                                          setThuneeGameStatusText("Multiplayer Lobby initialized! Sit at an open chair and invite other participants.");
                                          
                                          const stateObj = {
                                            mode: "MULTIPLAYER",
                                            seats: nextSeats,
                                            stage: "DEAL",
                                            trumpSuit: null,
                                            currentTurn: null,
                                            playedCards: [],
                                            gameScores: { ourTeam: 0, enemyTeam: 0 },
                                            roundScores: { ourTeam: 0, enemyTeam: 0 },
                                            tricksWon: { ourTeam: 0, enemyTeam: 0 },
                                            allCards: {},
                                            statusText: `${currentPlayerName} opened a multiplayer lobby! Join a seat!`,
                                            caller: null,
                                            callThuneeFlag: false,
                                            host: currentPlayerName,
                                            lastUpdated: Date.now()
                                          };
                                          localStorage.setItem("lutho_thunee_room_" + currentTableId, JSON.stringify(stateObj));
                                          triggerToast("Multiplayer Table Lounge opened! 👥", "success");
                                        }}
                                        className="p-5 bg-black/60 hover:bg-[#1a1208]/50 border border-amber-900/40 hover:border-amber-500/50 rounded-2xl text-left transition-all duration-300 group cursor-pointer hover:shadow-[0_0_20px_rgba(245,158,11,0.08)] flex flex-col justify-between space-y-4"
                                      >
                                        <div className="space-y-1.5">
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs font-mono text-amber-500 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/40 uppercase font-bold">MULTIPLAYER</span>
                                            <span className="text-zinc-650 font-mono text-[9px] uppercase font-bold">Real-time</span>
                                          </div>
                                          <h4 className="font-sans font-black text-white text-xs uppercase tracking-wide group-hover:text-amber-400 duration-200">
                                            👥 Restaurant Table Lobby
                                          </h4>
                                          <p className="text-[10px] text-zinc-500 leading-normal">
                                            Congregate with other table participants. Join seats securely from separated bills & browser tabs on this table ID!
                                          </p>
                                        </div>
                                        <div className="text-[10px] font-mono text-amber-500 uppercase flex items-center gap-1 font-bold pt-1.5 border-t border-zinc-900">
                                          Open Congregational Lounge ▶
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                ) : (thuneeGameMode === "MULTIPLAYER" && thuneeStage === "DEAL") ? (
                                  /* MULTIPLAYER LOBBY CONGREGATIONAL LOUNGE */
                                  <div className="flex-1 flex flex-col lg:flex-row gap-4 bg-black/40 p-4 rounded-2xl border border-zinc-900">
                                    {/* Left: Interactive Restaurant Table representation */}
                                    <div className="flex-1 bg-zinc-950 rounded-2xl border border-zinc-900 p-5 flex flex-col items-center justify-center relative min-h-[340px]">
                                      <div className="text-center space-y-1 absolute top-4 z-25">
                                        <span className="text-2xl text-amber-500">🥘</span>
                                        <h4 className="font-display font-black text-xs text-white uppercase tracking-wider">
                                          TABLE {currentTableId} CONGREGATION ZONE
                                        </h4>
                                        <p className="text-[9px] font-mono text-zinc-500 uppercase">
                                          Settle yourself around the grill to begin
                                        </p>

                                        {/* Dynamic Nickname Selection Block */}
                                        <div className="mt-2 bg-zinc-900/95 border border-zinc-800 p-2.5 rounded-xl flex flex-col items-center gap-1 w-60 mx-auto shadow-2xl backdrop-blur-md">
                                          <span className="text-[8.2px] font-mono text-amber-400 font-bold uppercase tracking-widest">👤 CHOOSE YOUR NAME:</span>
                                          <input
                                            type="text"
                                            maxLength={12}
                                            value={currentPlayerName}
                                            onChange={(e) => {
                                              const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9_ ]/g, '').slice(0, 12);
                                              handleNicknameChange(formatted);
                                            }}
                                            placeholder="CHOOSE MONIKER"
                                            className="w-full bg-black text-amber-500 px-3 py-1.5 text-center font-mono text-xs uppercase tracking-widest rounded border border-zinc-800 focus:outline-none focus:border-amber-500 font-black"
                                          />
                                        </div>
                                      </div>

                                      {/* Outer wood bumper table wrapper */}
                                      <div className="w-[280px] h-[190px] rounded-[100px] border-8 border-amber-950 bg-radial-gradient from-emerald-800 to-emerald-950 relative shadow-2xl flex items-center justify-center p-3 my-12">
                                        <span className="text-[10px] font-mono font-black text-emerald-950 select-none uppercase tracking-widest opacity-40">
                                          LUTHO felt
                                        </span>

                                        {/* SEAT 0: Bottom Seat */}
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 w-[120px]">
                                          {thuneeSeats[0] ? (
                                            <div className="bg-zinc-900 border border-emerald-500/40 rounded-lg px-2 py-1 text-center shadow-md text-[10px] text-white">
                                              <p className="font-black text-[9px] uppercase flex items-center justify-center gap-1">
                                                <span>👇 {thuneeSeats[0]}</span>
                                                {thuneeSeats[0] === thuneeHostName && <span className="text-amber-500 text-[8px]">👑</span>}
                                              </p>
                                              <p className="text-[8px] text-emerald-400 font-mono font-bold uppercase mt-0.5">Seat 1 (South)</p>
                                              {thuneeSeats[0] === currentPlayerName && (
                                                <button
                                                  onClick={() => {
                                                    playBeep(450, "sine", 0.08);
                                                    const next = [...thuneeSeats];
                                                    next[0] = null;
                                                    updateThuneeGame({ seats: next });
                                                  }}
                                                  className="text-[7.5px] font-mono text-red-400 uppercase hover:underline font-bold mt-1 cursor-pointer block w-full"
                                                >
                                                  [Leave Chair]
                                                </button>
                                              )}
                                            </div>
                                          ) : (
                                            <button
                                              onClick={() => {
                                                const next = thuneeSeats.map(s => s === currentPlayerName ? null : s);
                                                next[0] = currentPlayerName;
                                                updateThuneeGame({ seats: next, statusText: `${currentPlayerName} sat at Seat 1 (South)` });
                                              }}
                                              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-emerald-950 hover:border-emerald-500 border border-zinc-800 text-emerald-400 hover:text-white rounded-lg text-[9px] font-mono uppercase font-bold tracking-tight cursor-pointer duration-200 transition-all text-center"
                                            >
                                              🪑 South Chair OPEN
                                            </button>
                                          )}
                                        </div>

                                        {/* SEAT 1: Left Seat */}
                                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-10 w-[110px]">
                                          {thuneeSeats[1] ? (
                                            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-center shadow-md text-[10px] text-white">
                                              <p className="font-black text-[9px] uppercase flex items-center justify-center gap-0.5">
                                                <span>👤 {thuneeSeats[1]}</span>
                                                {thuneeSeats[1] === thuneeHostName && <span className="text-amber-500 text-[8px]">👑</span>}
                                              </p>
                                              <p className="text-[8px] text-zinc-500 font-mono uppercase">Seat 2 (West)</p>
                                              {thuneeSeats[1] === currentPlayerName && (
                                                <button
                                                  onClick={() => {
                                                    playBeep(450, "sine", 0.08);
                                                    const next = [...thuneeSeats];
                                                    next[1] = null;
                                                    updateThuneeGame({ seats: next });
                                                  }}
                                                  className="text-[7.5px] font-mono text-red-400 uppercase hover:underline font-bold mt-1 cursor-pointer block w-full"
                                                >
                                                  [Leave Chair]
                                                </button>
                                              )}
                                            </div>
                                          ) : (
                                            <button
                                              onClick={() => {
                                                const next = thuneeSeats.map(s => s === currentPlayerName ? null : s);
                                                next[1] = currentPlayerName;
                                                updateThuneeGame({ seats: next, statusText: `${currentPlayerName} sat at Seat 2 (West)` });
                                              }}
                                              className="px-2 py-1 bg-zinc-900 hover:bg-emerald-950 hover:border-emerald-500 border border-zinc-800 text-emerald-400 hover:text-white rounded-lg text-[9px] font-mono uppercase font-bold tracking-tight cursor-pointer duration-200 text-center"
                                            >
                                              🪑 West Chair OPEN
                                            </button>
                                          )}
                                        </div>

                                        {/* SEAT 2: Top Seat (Partner) */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 w-[120px]">
                                          {thuneeSeats[2] ? (
                                            <div className="bg-zinc-900 border border-emerald-500/30 rounded-lg px-2 py-1 text-center shadow-md text-[10px] text-white">
                                              <p className="font-black text-[9px] uppercase flex items-center justify-center gap-0.5">
                                                <span>🧑‍🍳 {thuneeSeats[2]}</span>
                                                {thuneeSeats[2] === thuneeHostName && <span className="text-amber-500 text-[8px]">👑</span>}
                                              </p>
                                              <p className="text-[8px] text-emerald-400/90 font-mono uppercase mt-0.5">Seat 3 (North)</p>
                                              {thuneeSeats[2] === currentPlayerName && (
                                                <button
                                                  onClick={() => {
                                                    playBeep(450, "sine", 0.08);
                                                    const next = [...thuneeSeats];
                                                    next[2] = null;
                                                    updateThuneeGame({ seats: next });
                                                  }}
                                                  className="text-[7.5px] font-mono text-red-400 uppercase hover:underline font-bold mt-1 cursor-pointer block w-full"
                                                >
                                                  [Leave Chair]
                                                </button>
                                              )}
                                            </div>
                                          ) : (
                                            <button
                                              onClick={() => {
                                                const next = thuneeSeats.map(s => s === currentPlayerName ? null : s);
                                                next[2] = currentPlayerName;
                                                updateThuneeGame({ seats: next, statusText: `${currentPlayerName} sat at Seat 3 (North/Partner)` });
                                              }}
                                              className="px-2 py-1 bg-zinc-900 hover:bg-emerald-950 hover:border-emerald-500 border border-zinc-800 text-emerald-400 hover:text-white rounded-lg text-[9px] font-mono uppercase font-bold tracking-tight cursor-pointer duration-200 text-center"
                                            >
                                              🪑 North Chair OPEN
                                            </button>
                                          )}
                                        </div>

                                        {/* SEAT 3: Right Seat */}
                                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-10 w-[110px]">
                                          {thuneeSeats[3] ? (
                                            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-center shadow-md text-[10px] text-white">
                                              <p className="font-black text-[9px] uppercase flex items-center justify-center gap-0.5">
                                                <span>👤 {thuneeSeats[3]}</span>
                                                {thuneeSeats[3] === thuneeHostName && <span className="text-amber-500 text-[8px]">👑</span>}
                                              </p>
                                              <p className="text-[8px] text-zinc-500 font-mono uppercase">Seat 4 (East)</p>
                                              {thuneeSeats[3] === currentPlayerName && (
                                                <button
                                                  onClick={() => {
                                                    playBeep(450, "sine", 0.08);
                                                    const next = [...thuneeSeats];
                                                    next[3] = null;
                                                    updateThuneeGame({ seats: next });
                                                  }}
                                                  className="text-[7.5px] font-mono text-red-400 uppercase hover:underline font-bold mt-1 cursor-pointer block w-full"
                                                >
                                                  [Leave Chair]
                                                </button>
                                              )}
                                            </div>
                                          ) : (
                                            <button
                                              onClick={() => {
                                                const next = thuneeSeats.map(s => s === currentPlayerName ? null : s);
                                                next[3] = currentPlayerName;
                                                updateThuneeGame({ seats: next, statusText: `${currentPlayerName} sat at Seat 4 (East)` });
                                              }}
                                              className="px-2 py-1 bg-zinc-900 hover:bg-emerald-950 hover:border-emerald-500 border border-zinc-800 text-emerald-400 hover:text-white rounded-lg text-[9px] font-mono uppercase font-bold tracking-tight cursor-pointer duration-200 text-center"
                                            >
                                              🪑 East Chair OPEN
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right: Table Congregation Console */}
                                    <div className="w-full lg:w-80 bg-zinc-950 rounded-2xl border border-zinc-900 p-4 flex flex-col justify-between space-y-4">
                                      <div className="space-y-4">
                                        <div className="pb-3 border-b border-zinc-900">
                                          <h5 className="font-display font-bold text-[10.5px] uppercase tracking-wider text-amber-500">
                                            LOBBY CONTROL ROOM
                                          </h5>
                                          <p className="text-[8px] font-mono text-zinc-500 mt-0.5 uppercase">
                                            Room Host: {thuneeHostName || "None"}
                                          </p>
                                        </div>

                                        {/* My Nickname custom configuration */}
                                        <div className="space-y-1">
                                          <label className="text-[8.5px] font-mono text-zinc-400 uppercase tracking-wider">Configure Lobby Moniker</label>
                                          <div className="flex gap-2">
                                            <input
                                              type="text"
                                              maxLength={12}
                                              value={currentPlayerName}
                                              onChange={(e) => {
                                                const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9_ ]/g, '').slice(0, 12);
                                                handleNicknameChange(formatted);
                                              }}
                                              className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-white font-mono text-xs rounded-lg uppercase tracking-tight focus:outline-none focus:border-amber-500"
                                            />
                                          </div>
                                        </div>

                                        {/* Status Message Log Board */}
                                        <div className="space-y-1">
                                          <label className="text-[8.5px] font-mono text-zinc-400 uppercase tracking-wider block">Live Log Feed</label>
                                          <div className="bg-black/8 w-full h-[90px] border border-zinc-900 rounded-lg p-2 font-mono text-[9px] text-zinc-400 overflow-y-auto leading-relaxed space-y-1">
                                            <p className="text-emerald-500">🟢 Table Lobby Synced Successfully.</p>
                                            <p className="text-amber-500/80">📋 Status: {thuneeGameStatusText}</p>
                                            {thuneeSeats.filter(Boolean).map((s, idx) => (
                                              <p key={idx} className="text-zinc-550">→ Player '{s}' is seated and waiting...</p>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Operational Controls conditional to Host Status */}
                                      <div className="space-y-3 pt-3 border-t border-zinc-900">
                                        {currentPlayerName === thuneeHostName ? (
                                          <div className="space-y-2">
                                            <button
                                              onClick={triggerLobbyBackfill}
                                              className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-zinc-300 font-sans font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer duration-150 text-center"
                                            >
                                              🤖 BACKFILL VACANT SEATS WITH BOTS
                                            </button>

                                            <button
                                              onClick={() => {
                                                // Make sure active player has selected a seat
                                                const hasSeat = thuneeSeats.includes(currentPlayerName);
                                                if (!hasSeat) {
                                                  triggerToast("You must sit in an open chair to join the game!", "info");
                                                  return;
                                                }
                                                // Ensure all 4 seats are occupied
                                                const activeSeatsCount = thuneeSeats.filter(Boolean).length;
                                                if (activeSeatsCount < 4) {
                                                  triggerToast("Table requires 4 seated players (Fill vacancies with Bots!)", "info");
                                                  return;
                                                }
                                                // Launch and deal!
                                                startThuneeRound();
                                              }}
                                              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-sans font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-center block"
                                            >
                                              🔥 LAUNCH THUNEE CLASH!
                                            </button>

                                            <button
                                              onClick={triggerLobbyReset}
                                              className="w-full text-center text-[8.5px] font-mono uppercase text-red-400/80 hover:text-red-400 tracking-tight hover:underline cursor-pointer block pt-1"
                                            >
                                              [Reset Multi Table Lobby]
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="space-y-2.5 text-center">
                                            <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1c1206]/50 rounded-lg border border-amber-900/40">
                                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                                              <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-tight">
                                                WAITING FOR {thuneeHostName || "HOST"} TO START...
                                              </span>
                                            </div>
                                            <button
                                              onClick={() => {
                                                playBeep(450, "sine", 0.08);
                                                const next = thuneeSeats.map(s => s === currentPlayerName ? null : s);
                                                updateThuneeGame({ seats: next });
                                                setThuneeGameMode(null);
                                              }}
                                              className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 hover:text-zinc-100 border border-zinc-800 text-zinc-400 font-sans font-black text-[9.5px] uppercase tracking-wide rounded-lg cursor-pointer text-center"
                                            >
                                              Leave Table Lobby
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* ACTIVE STYLISH WOODEN PLUSH FELT CARD ARENA VIEW */
                                  <div className="flex-1 flex flex-col space-y-4">
                                    {/* Multi-view Interactive Scoreboard and HUD */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-zinc-950 p-3 rounded-2xl border border-zinc-900/60 font-mono text-xs shadow-md">
                                      {/* US vs THEM match scores indicator */}
                                      <div className="text-left bg-black/50 px-3 py-1.5 rounded-xl border border-zinc-900 flex flex-col justify-between">
                                        <p className="text-[8px] uppercase tracking-wider text-zinc-500">Match score (To 4 win)</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <span className="text-emerald-400 font-black text-[13px]">US: {thuneeGameScores.ourTeam}W</span>
                                          <span className="text-zinc-700 leading-none">|</span>
                                          <span className="text-zinc-400 font-bold text-xs">THEM: {thuneeGameScores.enemyTeam}W</span>
                                        </div>
                                      </div>

                                      {/* Active Trump panel */}
                                      <div className="text-center bg-black/50 px-3 py-1.5 rounded-xl border border-zinc-900 flex flex-col items-center justify-center">
                                        <p className="text-[8px] uppercase tracking-wider text-zinc-500">TRUMP SETTING</p>
                                        {thuneeTrumpSuit ? (
                                          <span className={`text-[11.5px] font-black tracking-wide mt-0.5 ${
                                            thuneeTrumpSuit === "HEARTS" || thuneeTrumpSuit === "DIAMONDS" ? "text-red-500 animate-pulse" : "text-zinc-100"
                                          }`}>
                                            {thuneeTrumpSuit === "HEARTS" ? "♥️ HEARTS" : 
                                             thuneeTrumpSuit === "DIAMONDS" ? "♦️ DIAMONDS" : 
                                             thuneeTrumpSuit === "CLUBS" ? "♣️ CLUBS" : "♠️ SPADES"}
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-amber-500 animate-pulse uppercase tracking-widest font-black mt-1">
                                            ⚙️ NOMINATING
                                          </span>
                                        )}
                                      </div>

                                      {/* Active round points scoreboard card */}
                                      <div className="text-right bg-black/50 px-3 py-1.5 rounded-xl border border-zinc-900 flex flex-col justify-between">
                                        <p className="text-[8px] uppercase tracking-wider text-zinc-500">This Round Points</p>
                                        <div className="text-xs font-black text-zinc-300 mt-0.5">
                                          <span className="text-emerald-400">{thuneeRoundScores.ourTeam} PTS</span>
                                          <span className="text-zinc-650 mx-0.5">/</span>
                                          <span>304</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Status bar alert bar */}
                                    <div className="bg-emerald-950/20 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-center shadow-inner">
                                      <p className="text-[10px] font-mono text-emerald-400 font-bold tracking-tight uppercase flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                        <span>STATUS: {thuneeGameStatusText}</span>
                                      </p>
                                    </div>

                                    {/* THE MAJESTIC 3D WOOD-TRIMMED CARDS TABLE ARENA */}
                                    <div className="h-[365px] bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-[42px] border-[10px] border-[#3f2512] shadow-[inset_0_4px_24px_rgba(0,0,0,0.85),0_12px_45px_#000000] overflow-hidden relative flex flex-col items-center justify-center p-4">
                                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                                      {/* Felt watermark graphics */}
                                      <div className="absolute flex flex-col items-center justify-center select-none pointer-events-none text-emerald-950/20 text-center font-display leading-tight opacity-75">
                                        <span className="text-2xl font-black tracking-widest border-b border-emerald-955/10 pb-1">DURBAN CLASSIC</span>
                                        <span className="text-[10px] font-mono tracking-[0.3em] font-normal uppercase mt-1">ESTD. 1982 THUNEE FELT</span>
                                      </div>

                                      {/* Absolute Position Index Mapping & Rotation for Seat Coordinates */}
                                      {(() => {
                                        const myIdx = thuneeSeats.indexOf(currentPlayerName) >= 0 ? thuneeSeats.indexOf(currentPlayerName) : 0;
                                        
                                        // Indexes calculated relatively: Top (Partner) = +2, Left = +1, Right = +3
                                        const leftIdx = (myIdx + 1) % 4;
                                        const partnerIdx = (myIdx + 2) % 4;
                                        const rightIdx = (myIdx + 3) % 4;

                                        const leftOccupant = thuneeSeats[leftIdx] || `Seat 2 (BOT)`;
                                        const partnerOccupant = thuneeSeats[partnerIdx] || `Seat 3 (BOT)`;
                                        const rightOccupant = thuneeSeats[rightIdx] || `Seat 4 (BOT)`;

                                        const leftTurn = thuneeCurrentTurnIndex === leftIdx;
                                        const partnerTurn = thuneeCurrentTurnIndex === partnerIdx;
                                        const rightTurn = thuneeCurrentTurnIndex === rightIdx;
                                        const userTurn = thuneeCurrentTurnIndex === myIdx;

                                        return (
                                          <>
                                            {/* SEAT NORTH: Partner (Top position) */}
                                            <div className="absolute top-3.5 flex flex-col items-center text-center space-y-1 z-10 bg-black/40 px-3 py-1.5 rounded-xl border border-emerald-900/10">
                                              <div className="flex items-center gap-1.5">
                                                {partnerTurn && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />}
                                                <span className={`text-[10px] uppercase font-bold tracking-widest font-mono ${partnerTurn ? "text-orange-400" : "text-zinc-300"}`}>
                                                  🤝 {partnerOccupant} (PARTNER)
                                                </span>
                                              </div>
                                              <p className="text-[8px] font-mono text-zinc-500 uppercase leading-none font-bold">
                                                HAND: {(thuneeAllCardsNew[partnerIdx.toString()] || []).length} CRDS
                                              </p>
                                              {/* Tiny graphical face-down cards banner preview */}
                                              <div className="flex gap-0.5 justify-center mt-1">
                                                {Array.from({ length: (thuneeAllCardsNew[partnerIdx.toString()] || []).length }).map((_, i) => (
                                                  <div key={i} className="w-2.5 h-4 bg-zinc-950 border border-zinc-800 rounded-sm shadow-sm" />
                                                ))}
                                              </div>
                                            </div>

                                            {/* SEAT WEST: Opponent Left (Left center position) */}
                                            <div className="absolute left-3.5 text-center flex flex-col items-center space-y-1 z-10 max-w-[100px] bg-black/40 px-2.5 py-1.5 rounded-xl border border-emerald-900/10">
                                              <div className="flex items-center gap-1">
                                                {leftTurn && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />}
                                                <span className={`text-[10px] uppercase font-bold tracking-tight font-mono leading-tight ${leftTurn ? "text-orange-400 animate-pulse" : "text-zinc-300"}`}>
                                                  ⚔️ {leftOccupant}
                                                </span>
                                              </div>
                                              <p className="text-[8px] font-mono text-zinc-500 uppercase leading-none font-bold">
                                                HAND: {(thuneeAllCardsNew[leftIdx.toString()] || []).length} CRDS
                                              </p>
                                              {/* Vertical/Compact card stack visualization */}
                                              <div className="flex gap-0.5 justify-center mt-1">
                                                {Array.from({ length: (thuneeAllCardsNew[leftIdx.toString()] || []).length }).map((_, i) => (
                                                  <div key={i} className="w-2.5 h-4 bg-zinc-950 border border-zinc-800 rounded-sm shadow-sm" />
                                                ))}
                                              </div>
                                            </div>

                                            {/* SEAT EAST: Opponent Right (Right center position) */}
                                            <div className="absolute right-3.5 text-center flex flex-col items-center space-y-1 z-10 max-w-[100px] bg-black/40 px-2.5 py-1.5 rounded-xl border border-emerald-900/10">
                                              <div className="flex items-center gap-1">
                                                {rightTurn && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />}
                                                <span className={`text-[10px] uppercase font-bold tracking-tight font-mono leading-tight ${rightTurn ? "text-orange-400 animate-pulse" : "text-zinc-300"}`}>
                                                  ⚔️ {rightOccupant}
                                                </span>
                                              </div>
                                              <p className="text-[8px] font-mono text-zinc-500 uppercase leading-none font-bold">
                                                HAND: {(thuneeAllCardsNew[rightIdx.toString()] || []).length} CRDS
                                              </p>
                                              {/* Compact card stacks */}
                                              <div className="flex gap-0.5 justify-center mt-1">
                                                {Array.from({ length: (thuneeAllCardsNew[rightIdx.toString()] || []).length }).map((_, i) => (
                                                  <div key={i} className="w-2.5 h-4 bg-zinc-950 border border-zinc-800 rounded-sm shadow-sm" />
                                                ))}
                                              </div>
                                            </div>

                                            {/* SEAT SOUTH: Active User Seat (Bottom area) */}
                                            <div className="absolute bottom-2.5 bg-black/70 border border-emerald-500/20 px-4 py-1.5 rounded-2xl z-20 flex items-center gap-2">
                                              <span className={`w-2 h-2 rounded-full ${userTurn ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
                                              <span className="text-[10.5px] font-mono text-white uppercase tracking-wider font-extrabold flex items-center gap-1">
                                                👇 {currentPlayerName} (YOU SEAT 1)
                                                {userTurn && <span className="text-emerald-400 text-[8px] font-sans font-black tracking-normal ml-1 bg-emerald-950/65 border border-emerald-500/30 px-1 py-0.5 rounded">YOUR TURN TO ACT</span>}
                                              </span>
                                            </div>
                                          </>
                                        );
                                      })()}

                                      {/* THE CENTRAL TRICK PLAYFIELD */}
                                      <div className="w-[170px] h-[170px] rounded-full border border-dashed border-emerald-500/20 flex items-center justify-center relative bg-black/45 shadow-inner">
                                        {/* Golden center ring */}
                                        <div className="absolute inset-4 rounded-full border border-double border-emerald-500/10 pointer-events-none" />

                                        {thuneePlayedCardsNew.map((played, idx) => {
                                          const isSpadeOrClub = played.card.suit === "CLUBS" || played.card.suit === "SPADES";
                                          const rankSymbol = played.card.rank;
                                          const suitEmoji = played.card.suit === "HEARTS" ? "♥️" : played.card.suit === "DIAMONDS" ? "♦️" : played.card.suit === "CLUBS" ? "♣️" : "♠️";
                                          
                                          // Absolute Seat Rotation mapping relative to User index
                                          const myIdx = thuneeSeats.indexOf(currentPlayerName) >= 0 ? thuneeSeats.indexOf(currentPlayerName) : 0;
                                          const relativeSeatDiff = (played.playerIndex - myIdx + 4) % 4;

                                          // Pin card visual positions: Bottom, Left, Top, Right
                                          let positionClasses = "";
                                          let rotAngle = "rotate-0";
                                          if (relativeSeatDiff === 0) {
                                            positionClasses = "bottom-1.5 left-1/2 -translate-x-1/2";
                                            rotAngle = "rotate-2";
                                          } else if (relativeSeatDiff === 1) {
                                            positionClasses = "left-1.5 top-1/2 -translate-y-1/2";
                                            rotAngle = "-rotate-12";
                                          } else if (relativeSeatDiff === 2) {
                                            positionClasses = "top-1.5 left-1/2 -translate-x-1/2";
                                            rotAngle = "rotate-6";
                                          } else if (relativeSeatDiff === 3) {
                                            positionClasses = "right-1.5 top-1/2 -translate-y-1/2";
                                            rotAngle = "rotate-[-4deg]";
                                          }

                                          return (
                                            <div 
                                              key={played.playerIndex} 
                                              className={`absolute p-1 bg-white border border-zinc-200 text-black rounded-lg shadow-lg flex flex-col justify-between items-center w-[48px] h-[66px] ${positionClasses} ${rotAngle} animate-fade-in transition-all`}
                                            >
                                              <div className="flex justify-between items-center w-full px-0.5 antialiased">
                                                <span className={`text-[12px] font-black font-mono leading-none ${isSpadeOrClub ? "text-zinc-900" : "text-red-500"}`}>
                                                  {rankSymbol}
                                                </span>
                                                <span className={`text-[10px] leading-none ${isSpadeOrClub ? "text-zinc-900" : "text-red-500"}`}>
                                                  {suitEmoji}
                                                </span>
                                              </div>
                                              <div className={`text-[14px] font-black tracking-normal select-none leading-none -mt-1 ${isSpadeOrClub ? "text-zinc-905" : "text-red-500"}`}>
                                                {suitEmoji}
                                              </div>
                                              <span className="text-[6.5px] font-mono leading-none font-bold uppercase tracking-tight text-zinc-500 block text-center truncate w-full p-0.5 border-t border-zinc-100">
                                                {played.name.split(" ")[0]}
                                              </span>
                                            </div>
                                          );
                                        })}

                                        {thuneePlayedCardsNew.length === 0 && (
                                          <div className="text-center font-mono opacity-20 pointer-events-none select-none z-0">
                                            <p className="text-[9px] uppercase tracking-widest font-bold text-emerald-400">TRICK POOL</p>
                                            <span className="text-[8px] text-zinc-400">WAITING LEAD</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* USER INTERACTION INTERFACE CONTROL COMPONENT (Stage conditional) */}
                                    <div className="space-y-4 pt-1 bg-zinc-950 p-4 rounded-3xl border border-zinc-900/60 shadow-lg shrink-0">
                                      {/* DEALER NOMINATION STAGE */}
                                      {thuneeStage === "DEAL" && (
                                        <div className="flex flex-col items-center gap-3">
                                          <div className="text-center">
                                            <h4 className="font-display font-black text-white text-xs uppercase tracking-wide">Ready for Next Hand</h4>
                                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Dealer is standing by. Press Start Round below to deal 4 cards.</p>
                                          </div>
                                          <button
                                            onClick={() => {
                                              startThuneeRound();
                                            }}
                                            className="w-full py-3 bg-[#3E5E93] hover:bg-orange-400 text-black font-sans font-black text-xs uppercase rounded-xl tracking-wider cursor-pointer font-bold transition-all duration-200 text-center"
                                          >
                                            🔥 DEAL FOUR CARDS
                                          </button>
                                        </div>
                                      )}

                                      {/* TRUMP NOMINATION DECISION STAGE */}
                                      {thuneeStage === "TRUMP_SELECTION" && (
                                        <div className="bg-zinc-950 p-2 text-center rounded-xl flex flex-col items-center gap-3">
                                          {(() => {
                                            const myIdx = thuneeSeats.indexOf(currentPlayerName) >= 0 ? thuneeSeats.indexOf(currentPlayerName) : 0;
                                            const isMyTurnToNominate = thuneeCurrentTurnIndex === myIdx;

                                            return (
                                              <>
                                                <div className="space-y-1">
                                                  <h5 className="font-display font-black text-emerald-400 text-xs uppercase tracking-wider leading-none">
                                                    🎨 TRUMP SUIT DETERMINATION
                                                  </h5>
                                                  <p className="text-[10.5px] text-zinc-400">
                                                    {isMyTurnToNominate 
                                                      ? "You are the Nomineer! Choose the Trump suit based on your 4 deal cards below:" 
                                                      : `Waiting for ${thuneeSeats[thuneeCurrentTurnIndex || 0]} to nominate Trump Suit...`
                                                    }
                                                  </p>
                                                </div>

                                                {/* If my turn, show nominating buttons */}
                                                {isMyTurnToNominate ? (
                                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                                                    <button
                                                      onClick={() => finalDealThunee("HEARTS")}
                                                      className="py-3 bg-[#1c0d0d] hover:bg-[#2d1212] border border-red-900 text-red-500 font-sans font-bold text-xs uppercase rounded-xl tracking-wide cursor-pointer text-center duration-150 active:scale-95"
                                                    >
                                                      ♥️ HEARTS
                                                    </button>
                                                    <button
                                                      onClick={() => finalDealThunee("DIAMONDS")}
                                                      className="py-3 bg-[#1c0d0d] hover:bg-[#2d1212] border border-red-900 text-rose-400 font-sans font-bold text-xs uppercase rounded-xl tracking-wide cursor-pointer text-center duration-150 active:scale-95"
                                                    >
                                                      ♦️ DIAMONDS
                                                    </button>
                                                    <button
                                                      onClick={() => finalDealThunee("CLUBS")}
                                                      className="py-3 bg-[#111] hover:bg-zinc-900 border border-zinc-800 text-zinc-100 font-sans font-bold text-xs uppercase rounded-xl tracking-wide cursor-pointer text-center duration-150 active:scale-95"
                                                    >
                                                      ♣️ CLUBS
                                                    </button>
                                                    <button
                                                      onClick={() => finalDealThunee("SPADES")}
                                                      className="py-3 bg-[#111] hover:bg-zinc-900 border border-zinc-800 text-zinc-300 font-sans font-bold text-xs uppercase rounded-xl tracking-wide cursor-pointer text-center duration-150 active:scale-95"
                                                    >
                                                      ♠️ SPADES
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <div className="text-[11px] font-mono text-zinc-500 italic py-2 animate-pulse">
                                                    ⏳ Setting up arena deck...
                                                  </div>
                                                )}

                                                {/* Pre-nominating review of user's 4 Deal cards */}
                                                <div className="space-y-1 w-full border-t border-zinc-900 pt-3">
                                                  <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest font-black">YOUR 4 DEAL CARDS AT THIS TABLE</span>
                                                  <div className="flex gap-1.5 justify-center mt-1">
                                                    {thuneeHand.map((card) => {
                                                      const isRuby = card.suit === "HEARTS" || card.suit === "DIAMONDS";
                                                      const suitSymbol = card.suit === "HEARTS" ? "♥️" : card.suit === "DIAMONDS" ? "♦️" : card.suit === "CLUBS" ? "♣️" : "♠️";
                                                      return (
                                                        <div
                                                          key={card.id}
                                                          className={`px-3 py-1.5 border border-zinc-800 bg-zinc-900 rounded-lg text-[10.5px] font-mono font-black ${isRuby ? 'text-red-500' : 'text-zinc-100'}`}
                                                        >
                                                          {card.rank}{suitSymbol}
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              </>
                                            );
                                          })()}
                                        </div>
                                      )}

                                      {/* THE MAIN PLAY GAMEPLAY CONTROL ENGINE */}
                                      {thuneeStage === "PLAY" && (
                                        <div className="space-y-3">
                                          {/* Displaying Client Active Hand with large premium luxury card graphics */}
                                          <div className="space-y-2 bg-black/50 p-3 rounded-2xl border border-zinc-900/60 shadow-inner">
                                            {(() => {
                                              const myIdx = thuneeSeats.indexOf(currentPlayerName) >= 0 ? thuneeSeats.indexOf(currentPlayerName) : 0;
                                              const isMyTurn = thuneeCurrentTurnIndex === myIdx;

                                              return (
                                                <>
                                                  <div className="flex justify-between items-center px-1">
                                                    <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-widest font-bold">YOUR HAND ({thuneeHand.length} CLASH CARDS)</span>
                                                    <div className="flex items-center gap-1.5">
                                                      <span className={`w-1.5 h-1.5 rounded-full ${isMyTurn ? "bg-emerald-400 animate-ping" : "bg-zinc-600"}`} />
                                                      <span className={`text-[9px] font-mono font-black uppercase ${isMyTurn ? "text-emerald-400" : "text-zinc-500"}`}>
                                                        {isMyTurn ? "YOUR TURN TO THROW CARD!" : "⏳ Opponent Action Pending..."}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="flex flex-wrap gap-2.5 justify-center py-2">
                                                    {thuneeHand.map((card) => {
                                                      const isRuby = card.suit === "HEARTS" || card.suit === "DIAMONDS";
                                                      const suitSymbol = card.suit === "HEARTS" ? "♥️" : card.suit === "DIAMONDS" ? "♦️" : card.suit === "CLUBS" ? "♣️" : "♠️";
                                                      
                                                      return (
                                                        <button
                                                          key={card.id}
                                                          disabled={!isMyTurn}
                                                          onClick={() => handleUserPlayThuneeCard(card)}
                                                          className={`flex flex-col justify-between p-2.5 w-[52px] h-[74px] border rounded-xl font-mono transition-all duration-200 shadow-sm bg-white text-zinc-900 select-none cursor-pointer ${
                                                            isMyTurn
                                                              ? "hover:-translate-y-2 hover:shadow-xl hover:border-emerald-500 ring-2 ring-emerald-500/5 hover:scale-105 active:scale-95"
                                                              : "opacity-40 grayscale cursor-not-allowed hover:scale-100"
                                                          }`}
                                                        >
                                                          <div className="flex justify-between items-center w-full leading-none">
                                                            <span className={`text-sm font-black tracking-tight ${isRuby ? "text-red-600" : "text-zinc-900"}`}>{card.rank}</span>
                                                            <span className={`text-[10px] ${isRuby ? "text-red-500" : "text-zinc-900"}`}>{suitSymbol}</span>
                                                          </div>
                                                          <div className={`text-base font-black text-center leading-none -mt-1 w-full ${isRuby ? "text-red-500" : "text-zinc-900"}`}>
                                                            {suitSymbol}
                                                          </div>
                                                          <div className="text-[6.5px] font-mono text-zinc-400 uppercase leading-none font-bold text-center w-full block border-t border-zinc-100 pt-0.5">
                                                            {card.points} PTS
                                                          </div>
                                                        </button>
                                                      );
                                                    })}
                                                    {thuneeHand.length === 0 && (
                                                      <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest py-3 italic">
                                                        No cards remaining in your deck. Wait for round summary.
                                                      </span>
                                                    )}
                                                  </div>
                                                </>
                                              );
                                            })()}
                                          </div>

                                          {/* Operation Commands panel for Declarations or Collections */}
                                          <div className="flex gap-3">
                                            {/* Call Thunee declaration option */}
                                            {!thuneeCallThunee && thuneeHand.length > 0 && (
                                              <button
                                                onClick={() => {
                                                  playBeep(980, "sine", 0.15);
                                                  updateThuneeGame({
                                                    caller: currentPlayerName,
                                                    callThuneeFlag: true,
                                                    statusText: `🔥 ${currentPlayerName} SHOUTED THUNEE! Durban Sweep rule applied! 6/6 tricks required!`
                                                  });
                                                  triggerToast("😱 THUNEE CALL ACTIVATED! SWEEP COMPELLED!", "success");
                                                }}
                                                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-[#3E5E93] hover:from-red-500 hover:to-orange-500 text-black font-sans font-black text-xs uppercase tracking-widest rounded-xl cursor-pointer shadow-[0_4px_12px_rgba(239,68,68,0.3)] text-center transition-all active:scale-95 font-bold"
                                              >
                                                🚨 DECLARE THUNEE!
                                              </button>
                                            )}

                                            {/* Collect current trick pile once 4 cards are accumulated */}
                                            {thuneePlayedCardsNew.length === 4 && (
                                              <button
                                                onClick={() => collectThuneeTrick()}
                                                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer duration-200 shadow-md font-bold text-center animate-bounce flex items-center justify-center gap-1.5"
                                              >
                                                <span>⚡ COLLECT TRICK</span>
                                                <span className="text-[10px] font-mono px-2 py-0.5 bg-black/20 rounded uppercase">Trick #{(6 - thuneeHand.length)} COMPLETE</span>
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* ROUND OVER RESOLUTION WRAPPER */}
                                      {thuneeStage === "ROUND_OVER" && (
                                        <div className="flex flex-col items-center gap-3 bg-[#131b15] p-4 rounded-2xl border border-emerald-900/30 text-center">
                                          <div>
                                            <h5 className="font-display font-black text-emerald-400 text-xs uppercase tracking-widest">
                                              ROUND SHUFFLE ANALYSIS
                                            </h5>
                                            <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Comparing accumulated points values</p>
                                          </div>
                                          
                                          <div className="grid grid-cols-2 gap-4 w-full max-w-md py-1.5 font-mono text-center">
                                            <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-900">
                                              <p className="text-[8px] text-zinc-500 uppercase font-black">Your Team (South/North)</p>
                                              <p className="text-sm font-bold text-emerald-400 mt-0.5">{thuneeTricksWon.ourTeam} Tricks</p>
                                              <p className="text-xs font-black text-white">{thuneeRoundScores.ourTeam} Round Pts</p>
                                            </div>
                                            <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-900">
                                              <p className="text-[8px] text-zinc-500 uppercase font-black">Opponent Team</p>
                                              <p className="text-sm font-bold text-zinc-400 mt-0.5">{thuneeTricksWon.enemyTeam} Tricks</p>
                                              <p className="text-xs font-black text-zinc-300">{thuneeRoundScores.enemyTeam} Round Pts</p>
                                            </div>
                                          </div>

                                          <button
                                            onClick={() => resolveThuneeRound()}
                                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-bold text-xs uppercase rounded-xl tracking-wider cursor-pointer text-center duration-150 active:scale-95"
                                          >
                                            🏆 RESOLVE ROUND SCOREBOARD
                                          </button>
                                        </div>
                                      )}

                                      {/* GRAND MATCH COMPLETED OVER BLOCK */}
                                      {thuneeStage === "GAME_OVER" && (
                                        <div className="flex flex-col items-stretch gap-3 bg-black/60 p-5 rounded-2xl border border-emerald-500/30 text-center">
                                          <span className="text-4xl">👑</span>
                                          <div>
                                            <h4 className="font-display font-black text-white text-sm uppercase tracking-widest leading-none">
                                              MATCH TERMINATED!
                                            </h4>
                                            <p className="text-[10px] text-zinc-500 italic mt-1 font-mono">First to set 4 match wins criteria hit!</p>
                                          </div>
                                          
                                          <div className="bg-emerald-950/20 border border-emerald-500/20 py-2 rounded-xl">
                                            <p className="text-[10.5px] font-mono text-zinc-300">
                                              WINNING TEAM: <span className="text-emerald-400 font-black">{thuneeGameScores.ourTeam >= 4 ? "YOUR TEAM" : "THE OPPONENT TEAM"}</span>
                                            </p>
                                            <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">Final scores: {thuneeGameScores.ourTeam} - {thuneeGameScores.enemyTeam}</p>
                                          </div>

                                          <button
                                            onClick={() => {
                                              playBeep(880, "sine", 0.08);
                                              // Clear match scores and start new game!
                                              updateThuneeGame({
                                                gameScores: { ourTeam: 0, enemyTeam: 0 },
                                                roundScores: { ourTeam: 0, enemyTeam: 0 },
                                                tricksWon: { ourTeam: 0, enemyTeam: 0 },
                                                stage: "DEAL",
                                                playedCards: [],
                                                trumpSuit: null,
                                                caller: null,
                                                callThuneeFlag: false,
                                                statusText: "New match started! Dealer stands ready."
                                              });
                                            }}
                                            className="w-full mt-1.5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-black text-xs uppercase rounded-xl cursor-pointer text-center font-bold"
                                          >
                                            🔄 PLAY NEW MATCH SERIES
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Outer exit operations drawer */}
                                <div className="flex gap-2.5 border-t border-zinc-900 pt-3">
                                  {thuneeGameMode !== null && (
                                    <button
                                      onClick={() => {
                                        playBeep(250, "sine", 0.05);
                                        // Back to selection menu
                                        setThuneeGameMode(null);
                                        setThuneeSeats([null, null, null, null]);
                                      }}
                                      className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-sans font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center font-bold border border-zinc-800/80"
                                    >
                                      🪑 EXIT ACTIVE ROOM TO SELECTION
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      playBeep(250, "sine", 0.05);
                                      setIsThuneePlaying(false);
                                    }}
                                    className="px-5 py-2.5 bg-black hover:bg-zinc-950 text-red-400 hover:text-red-300 text-[10px] font-mono uppercase tracking-widest rounded-xl transition-all border border-red-950/45 cursor-pointer text-center font-black"
                                  >
                                    ✖ CLOSE ARENA
                                  </button>
                                </div>
                              </div>
                            ) : memoryCards.length > 0 ? (
                              <div className="bg-zinc-950 p-2 rounded-2xl border border-zinc-900">
                                <div className="flex justify-between items-center bg-black/80 px-3 py-1.5 rounded-xl border border-zinc-900 mb-3">
                                  <div className="text-left font-mono">
                                    <p className="text-[8px] text-zinc-500 uppercase">Score / Moves</p>
                                    <p className="text-xs font-bold text-[#3E5E93]">{memoryScore} PTS / {memoryMoves} MOVES</p>
                                  </div>
                                  <span className="text-[10px] font-mono uppercase text-emerald-500 animate-pulse">{memoryStatus}</span>
                                </div>

                                {/* 4x3 card grid */}
                                <div className="grid grid-cols-4 gap-2 py-1">
                                  {memoryCards.map((card, idx) => {
                                    const handleCardClick = () => {
                                      if (selectedCardIdxs.length >= 2 || card.isFlipped || card.isMatched) return;
                                      
                                      playBeep(580, "sine", 0.05);
                                      const updated = [...memoryCards];
                                      updated[idx].isFlipped = true;
                                      setMemoryCards(updated);
                                      
                                      const nextSelected = [...selectedCardIdxs, idx];
                                      setSelectedCardIdxs(nextSelected);
                                      
                                      if (nextSelected.length === 2) {
                                        setMemoryMoves(m => m + 1);
                                        const [first, second] = nextSelected;
                                        if (memoryCards[first].symbol === memoryCards[second].symbol) {
                                          setTimeout(() => {
                                            setMemoryCards(prev => {
                                              const cards = [...prev];
                                              cards[first].isMatched = true;
                                              cards[second].isMatched = true;
                                              return cards;
                                            });
                                            setSelectedCardIdxs([]);
                                            setMemoryScore(prev => prev + 25);
                                            setMemoryStatus("🎉 MATCHED!");
                                            playBeep(880, "sine", 0.08);
                                          }, 450);
                                        } else {
                                          setTimeout(() => {
                                            setMemoryCards(prev => {
                                              const cards = [...prev];
                                              cards[first].isFlipped = false;
                                              cards[second].isFlipped = false;
                                              return cards;
                                            });
                                            setSelectedCardIdxs([]);
                                            setMemoryStatus("❌ TRY AGAIN");
                                            playBeep(250, "sine", 0.08);
                                          }, 950);
                                        }
                                      }
                                    };

                                    return (
                                      <button
                                        key={card.id}
                                        onClick={handleCardClick}
                                        className={`h-12 rounded-xl flex items-center justify-center text-lg font-bold cursor-pointer transition-all duration-300 transform active:scale-95 border ${
                                          card.isMatched
                                            ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 opacity-80"
                                            : card.isFlipped
                                            ? "bg-zinc-800 border-orange-500 text-white"
                                            : "bg-[#1C1C1E] hover:bg-zinc-850 border-zinc-805 text-zinc-500 hover:text-white"
                                        }`}
                                      >
                                        {card.isFlipped || card.isMatched ? card.symbol : "❓"}
                                      </button>
                                    );
                                  })}
                                </div>

                                <div className="flex gap-2 mt-4 shrink-0">
                                  <button
                                    onClick={() => {
                                      playBeep(440, "sine", 0.05);
                                      const symbols = ["🍔", "🍟", "🥤", "🥩", "🧀", "🥓"];
                                      const duplicated = [...symbols, ...symbols]
                                        .map((sym, index) => ({ id: index, symbol: sym, isFlipped: false, isMatched: false }))
                                        .sort(() => Math.random() - 0.5);
                                      setMemoryCards(duplicated);
                                      setSelectedCardIdxs([]);
                                      setMemoryMoves(0);
                                      setMemoryScore(0);
                                      setMemoryStatus("TAP TILES TO BEGIN!");
                                    }}
                                    className="flex-1 py-2.5 bg-[#3E5E93] text-black font-sub font-black text-xs uppercase tracking-wider rounded-xl hover:bg-orange-400 transition-all font-bold cursor-pointer text-center"
                                  >
                                    RESET MATCH 🔄
                                  </button>
                                  <button
                                    onClick={() => {
                                      playBeep(250, "sine", 0.05);
                                      setMemoryCards([]);
                                    }}
                                    className="px-4 py-2.5 bg-[#1C1C1E] text-zinc-400 border border-zinc-805 font-sub font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
                                  >
                                    MENU
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Retro Dashboard Launcher */
                              <div className="space-y-3.5 mt-2">
                                <div className="p-4 bg-[#1C1C1E] rounded-2xl border border-zinc-850 flex flex-col justify-between items-stretch gap-3">
                                  <div className="flex items-center gap-3">
                                    <span className="text-3xl">🍔</span>
                                    <div>
                                      <h4 className="font-display font-black text-white text-xs uppercase tracking-wider">
                                        Lutho Burger Catcher
                                      </h4>
                                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                                        Stack the cheese, meat, & buns! Catch good ingredients on your bottom bun, avoid highly toxic skulls 💀!
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      playBeep(600, "sine", 0.08);
                                      setIsBurgerPlaying(true);
                                      setBurgerCatcherScore(0);
                                      setBurgerCatcherLives(3);
                                      setBurgerPosition(160);
                                      setFallingIngredients([]);
                                    }}
                                    className="w-full py-2.5 bg-[#3E5E93] hover:bg-orange-400 text-black font-sans font-black text-xs uppercase rounded-xl tracking-wider cursor-pointer font-bold text-center"
                                  >
                                    Launch Burger Stacker 🎮
                                  </button>
                                </div>

                                <div className="p-4 bg-[#1C1C1E] rounded-2xl border border-zinc-850 flex flex-col justify-between items-stretch gap-3">
                                  <div className="flex items-center gap-3">
                                    <span className="text-3xl">🧠</span>
                                    <div>
                                      <h4 className="font-display font-black text-white text-xs uppercase tracking-wider">
                                        Foodie Memory Arena
                                      </h4>
                                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                                        Match the double-smashes, cheese bombs & fries pairs together under record move counts!
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      playBeep(600, "sine", 0.08);
                                      const symbols = ["🍔", "🍟", "🥤", "🥩", "🧀", "🥓"];
                                      const duplicated = [...symbols, ...symbols]
                                        .map((sym, index) => ({ id: index, symbol: sym, isFlipped: false, isMatched: false }))
                                        .sort(() => Math.random() - 0.5);
                                      setMemoryCards(duplicated);
                                      setSelectedCardIdxs([]);
                                      setMemoryMoves(0);
                                      setMemoryScore(0);
                                      setMemoryStatus("TAP TILES TO BEGIN!");
                                    }}
                                    className="w-full py-2.5 bg-zinc-900 border border-zinc-800 hover:border-[#3E5E93]/50 text-[#3E5E93] font-sans font-black text-xs uppercase rounded-xl tracking-wider cursor-pointer font-bold text-center"
                                  >
                                    Launch Memory Match 🧠
                                  </button>
                                </div>

                                <div className="p-4 bg-[#1C1C1E] rounded-2xl border border-zinc-850 flex flex-col justify-between items-stretch gap-3">
                                  <div className="flex items-center gap-3">
                                    <span className="text-3xl">🌶️</span>
                                    <div>
                                      <h4 className="font-display font-black text-white text-xs uppercase tracking-wider">
                                        Chilli Cheeze Defusal 🤘
                                      </h4>
                                      <p className="text-[10.5px] leading-none text-orange-400 font-mono uppercase tracking-wide">
                                        ULTRA-CHALLENGING SIZZLE
                                      </p>
                                      <p className="text-[9.5px] text-zinc-400 mt-1 leading-tight">
                                        Defuse cheese bombs & hit golden fries before fuses burn down! AVOID hot red chilli bombs! Rapid fire speed increases!
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      playBeep(880, "sawtooth", 0.1);
                                      setIsDefuserPlaying(true);
                                      setDefuserScore(0);
                                      setDefuserLives(3);
                                      setShowLeaderboardSubmit(false);
                                      setLeaderboardNameInput("");
                                      setDefuserGrid(Array.from({ length: 9 }).map((_, idx) => ({ id: idx, type: "CHEESE", fuse: 100, active: false })));
                                    }}
                                    className="w-full py-2.5 bg-[#3E5E93] hover:bg-orange-400 text-black font-sans font-black text-xs uppercase rounded-xl tracking-wider cursor-pointer font-bold text-center"
                                  >
                                    Defuse the Griddle 🔥
                                  </button>
                                </div>

                                {/* HIGH VOLTAGE RETRO LEADERBOARD */}
                                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 flex flex-col gap-2 shadow-inner">
                                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
                                    <h5 className="font-display font-black text-white text-[10px] uppercase tracking-wider flex items-center gap-1.5 leading-none">
                                      🏆 DEFUSER LEADERBOARD
                                    </h5>
                                    <span className="text-[8px] font-mono text-zinc-550 font-bold uppercase">LOCAL ROCKERS</span>
                                  </div>
                                  <div className="space-y-1.5">
                                    {defuserLeaderboard.map((e, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-[11px] font-mono py-1 border-b border-zinc-900/10 last:border-0">
                                        <div className="flex items-center gap-2">
                                          <span className={`text-[10px] font-bold ${idx === 0 ? 'text-[#3E5E93]' : idx === 1 ? 'text-zinc-300' : 'text-zinc-650'}`}>
                                            #{idx + 1}
                                          </span>
                                          <span className="text-zinc-300 font-bold uppercase">{e.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className="text-[#3E5E93] font-black">{e.score} PTS</span>
                                          <span className="text-[8.5px] text-zinc-650 uppercase font-bold">{e.date}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                        {/* --- TAB 3: SPEED CHALLENGES BOARD --- */}
                        {activeGameTab === "CHALLENGES" && (
                          <div className="w-full flex flex-col">
                            
                            {/* If stopwatch is actively selected */}
                            {activeStopwatchChallenge ? (
                              <div className="bg-zinc-950 p-4 border border-orange-500/20 rounded-2xl flex flex-col items-center text-center gap-3">
                                <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest block font-bold">⏱️ ACTIVE EATING SPEED TRIAL</span>
                                <h4 className="font-sub font-black text-base text-white uppercase leading-tight">{activeStopwatchChallenge}</h4>
                                
                                {/* DIGITAL STOPWATCH CLOCK FACE */}
                                <div className="text-5xl font-mono text-white font-black tracking-widest py-3 px-6 bg-black rounded-2xl border-2 border-zinc-900 shadow-inner my-1.5 animate-pulse">
                                  {/* formatStopwatchTime */}
                                  {(() => {
                                    const m = Math.floor(stopwatchSeconds / 60);
                                    const s = stopwatchSeconds % 60;
                                    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
                                  })()}
                                </div>

                                <div className="flex gap-2 w-full mt-1.5">
                                  {!isStopwatchRunning ? (
                                    <button
                                      onClick={() => {
                                        playBeep(640, "sine", 0.08);
                                        setIsStopwatchRunning(true);
                                      }}
                                      className="flex-1 py-2.5 bg-emerald-650 hover:bg-emerald-600 text-white text-xs font-sans font-black rounded-xl uppercase tracking-wider cursor-pointer font-bold"
                                    >
                                      START CLOCK ▶
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        playBeep(420, "sine", 0.08);
                                        setIsStopwatchRunning(false);
                                      }}
                                      className="flex-1 py-2.5 bg-red-650 hover:bg-red-600 text-white text-xs font-sans font-black rounded-xl uppercase tracking-wider cursor-pointer font-bold"
                                    >
                                      STOP CLOCK ⏹
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => {
                                      playBeep(240, "sine", 0.05);
                                      setIsStopwatchRunning(false);
                                      setStopwatchSeconds(0);
                                    }}
                                    className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-sans font-black rounded-xl uppercase cursor-pointer"
                                  >
                                    RESET
                                  </button>
                                </div>

                                {/* Form to submit finished record */}
                                {stopwatchSeconds > 0 && !isStopwatchRunning && (
                                  <div className="w-full bg-[#1C1C1E] border border-zinc-900 p-3 rounded-xl flex flex-col gap-2 mt-4 text-left">
                                    <p className="text-[8px] font-mono text-orange-400 uppercase font-black tracking-wider text-center">🎉 Record Cleared! Post your performance:</p>
                                    <div className="flex gap-1.5 items-center mt-1">
                                      <input
                                        type="text"
                                        placeholder="ENTER YOUR CONTENDER NAME"
                                        value={userReviewText}
                                        onChange={(e) => setUserReviewText(e.target.value.substring(0, 15))}
                                        className="flex-1 bg-black text-white text-[10px] font-mono border border-zinc-805 rounded-lg p-2 uppercase shrink-0"
                                      />
                                      <button
                                        onClick={() => {
                                          const name = userReviewText.trim().toUpperCase() || "PATRON";
                                          const finalTime = (() => {
                                            const m = Math.floor(stopwatchSeconds / 60);
                                            const s = stopwatchSeconds % 60;
                                            return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
                                          })();
                                          const newRecord = {
                                            rank: challengesLeaderboard.length + 1,
                                            name,
                                            table: "T-12",
                                            challenge: activeStopwatchChallenge,
                                            duration: finalTime
                                          };
                                          
                                          // Sort ascending by duration
                                          const updated = [...challengesLeaderboard, newRecord]
                                            .sort((a, b) => a.duration.localeCompare(b.duration))
                                            .map((item, idx) => ({ ...item, rank: idx + 1 }));
                                          
                                          setChallengesLeaderboard(updated);
                                          setUserReviewText("");
                                          setActiveStopwatchChallenge(null);
                                          setStopwatchSeconds(0);
                                          playBeep(880, "sine", 0.08);
                                          triggerToast("🏆 Posted successfully to Table Leaderboard!", "success");
                                        }}
                                        className="px-3.5 py-2 bg-[#3E5E93] text-black font-sub font-black text-[10px] uppercase rounded-lg cursor-pointer shrink-0"
                                      >
                                        Post 🚀
                                      </button>
                                    </div>
                                  </div>
                                )}

                                <button
                                  onClick={() => {
                                    playBeep(250, "sine", 0.05);
                                    setActiveStopwatchChallenge(null);
                                    setIsStopwatchRunning(false);
                                    setStopwatchSeconds(0);
                                  }}
                                  className="text-center text-[9px] font-mono text-zinc-500 hover:underline hover:text-white uppercase mt-1 cursor-pointer"
                                >
                                  ← Back to Challenges List
                                </button>
                              </div>
                            ) : (
                              /* Show Challenges and Leaderboard Lists */
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest block font-bold">🍔 ACTIVE SHOWDOWNS (TAP TO COMMENCE TIME)</span>
                                  {[
                                    { name: "The Slacker Burger Challenge", desc: "Crush 1x Double Chili Smashburger + fries", emoji: "🍔" },
                                    { name: "24 Wings Fire-Storm", desc: "Munch 24 hot wings with no blue cheese cooling", emoji: "🍗" },
                                    { name: "Chilli Cheeze Bomb Sprint", desc: "Gulp down 6 extreme molten cheese bombs", emoji: "💣" },
                                    { name: "Cookies & Scream Marathon", desc: "Finish the massive double ice-cream waffle singlehandedly", emoji: "🧇" },
                                  ].map((ch) => (
                                    <button
                                      key={ch.name}
                                      onClick={() => {
                                        playBeep(520, "sine", 0.08);
                                        setActiveStopwatchChallenge(ch.name);
                                        setStopwatchSeconds(0);
                                        setIsStopwatchRunning(false);
                                      }}
                                      className="w-full bg-[#1C1C1E] hover:border-[#3E5E93]/40 border border-zinc-850 p-2.5 rounded-xl text-left flex gap-3 transition-all hover:scale-[1.01] active:scale-99 cursor-pointer"
                                    >
                                      <span className="text-2xl pt-0.5 shrink-0">{ch.emoji}</span>
                                      <div>
                                        <h5 className="font-display font-black text-white text-[11px] uppercase tracking-wider">{ch.name}</h5>
                                        <p className="text-[9px] text-zinc-400 leading-snug mt-0.5">{ch.desc}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>

                                {/* Dynamic Leaderboard list */}
                                <div className="space-y-2 pt-2 border-t border-zinc-900">
                                  <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest block font-bold">🏆 SPEED LEADERBOARDS</span>
                                    <span className="text-[8px] font-mono text-zinc-500 uppercase">ASCENDING TIME</span>
                                  </div>
                                  
                                  <div className="bg-[#121212] border border-zinc-900 rounded-xl overflow-hidden p-1 space-y-1">
                                    {challengesLeaderboard.slice(0, 5).map((entry, idx) => (
                                      <div 
                                        key={idx} 
                                        className={`flex items-center justify-between text-[10px] font-mono p-1.5 px-2.5 rounded-lg ${
                                          entry.table === "T-12" ? "bg-orange-950/20 text-[#3E5E93] border border-orange-500/20" : "bg-[#1C1C1E] text-zinc-300"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-orange-400">
                                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`}
                                          </span>
                                          <span className="font-bold uppercase text-white truncate max-w-[80px]">{entry.name}</span>
                                          <span className="text-[8px] bg-zinc-900 text-zinc-500 px-1 py-0.2 rounded border border-zinc-800 ml-1 font-sans">{entry.table}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[8px] text-zinc-500 font-sans uppercase truncate max-w-[125px]">{entry.challenge.replace("The ", "").replace(" Challenge", "")}</span>
                                          <span className="font-black text-white font-mono text-[10.5px] shrink-0">{entry.duration}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                        {/* Extra brand badge and exit panel info */}
                        <div className="py-2.5 mt-8 border-t border-zinc-900 text-center font-mono text-[9px] text-[#3E5E93]/45 tracking-widest uppercase flex items-center justify-center gap-2 shrink-0">
                          <span>LUTHO ARENA STATIONS ACTIVE</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3E5E93] animate-ping" />
                        </div>
                      </div>
                    ) : (
                      
                      /* CHOSEN ACTIVE SUB-GAME CONTAINER */
                      <div className="flex-1 flex flex-col justify-between p-5 min-h-[360px]">
                        
                        {/* back button */}
                        <button
                          onClick={() => {
                            playBeep(450, "sine", 0.05);
                            setSelectedDrinkingGame(null);
                          }}
                          className="self-start px-3.5 py-1.5 bg-zinc-950 border border-zinc-850 hover:text-[#3E5E93] hover:border-zinc-800 text-zinc-400 font-sub font-black text-[9px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 mb-4"
                        >
                          ← BACK TO LOBBY
                        </button>

                        <div className="flex-1 flex flex-col justify-center py-2">
                          
                          {/* 1) KINGS CUP BOARD */}
                          {selectedDrinkingGame === "KINGS_CUP" && (
                            <div className="flex flex-col items-center text-center gap-5">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#3E5E93] font-bold">👑 KINGS CUP CLASSIC DECK</span>
                              
                              {kingsCupCard ? (
                                <motion.div 
                                  initial={{ rotateY: 90, scale: 0.8 }}
                                  animate={{ rotateY: 0, scale: 1 }}
                                  className="w-[190px] h-[260px] bg-white text-zinc-950 rounded-2xl p-5 border-4 border-[#3E5E93] flex flex-col justify-between relative shadow-[0_15px_30px_rgba(0,0,0,0.8)] select-none"
                                >
                                  {/* Suit symbol in corners */}
                                  <div className="absolute top-3 left-3 flex flex-col items-center leading-none">
                                    <span className="text-lg font-sans font-black">{kingsCupCard.value}</span>
                                    <span className={`text-base ${["♥", "♦"].includes(kingsCupCard.suit) ? "text-red-650" : "text-zinc-900"}`}>{kingsCupCard.suit}</span>
                                  </div>
                                  <div className="absolute bottom-3 right-3 flex flex-col items-center leading-none rotate-180">
                                    <span className="text-lg font-sans font-black">{kingsCupCard.value}</span>
                                    <span className={`text-base ${["♥", "♦"].includes(kingsCupCard.suit) ? "text-red-650" : "text-zinc-900"}`}>{kingsCupCard.suit}</span>
                                  </div>

                                  {/* Main card center value & suit */}
                                  <div className="flex-1 flex flex-col justify-center items-center gap-2 mt-2 px-1">
                                    <span className="text-sm font-sub font-black tracking-wider uppercase text-zinc-900 bg-[#3E5E93]/10 px-2 py-0.5 rounded border border-[#3E5E93]/20">{kingsCupCard.title}</span>
                                    <span className={`text-5xl my-1.5 ${["♥", "♦"].includes(kingsCupCard.suit) ? "text-red-650" : "text-zinc-900"}`}>{kingsCupCard.suit}</span>
                                    <p className="text-[10.5px] font-sans font-semibold text-zinc-700 leading-normal max-w-[170px]">
                                      {kingsCupCard.rule}
                                    </p>
                                  </div>
                                </motion.div>
                              ) : (
                                <div 
                                  onClick={() => {
                                    playBeep(600, "sine", 0.08);
                                    const suits = ["♠", "♥", "♦", "♣"];
                                    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
                                    const cardRules = {
                                      "A": { title: "WATERFALL", rule: "Continuous sip cascade! Pass a chip to the next person, you can't stop munching until the left person stops! 🌊" },
                                      "2": { title: "CHOOSE YOU", rule: "Point at someone at Table 12. They must gobble up 1 gold chip or take a soda sip! 👈" },
                                      "3": { title: "MUNCH FOR ME", rule: "You take a nice bite of your fries or a sip of shake! To your appetite! 🍔" },
                                      "4": { title: "TOUCH FLOOR", rule: "Last person at the table to touch the actual floor has to munch a fry! ⬇️" },
                                      "5": { title: "MUNCH BOYS", rule: "All the guys/gents at Table 12 must eat a hot wing! 👦" },
                                      "6": { title: "MUNCH CHICKS", rule: "All the ladies/girls take a refreshing chip and munch it nicely! 👧" },
                                      "7": { title: "TO HEAVEN", rule: "Last person at Table 12 to raise their hands in the air must take a soda sip! ☁️" },
                                      "8": { title: "PICK A MATE", rule: "Nominate a mate. For the rest of the game, whenever you take a fry, they must eat one with you! 👥" },
                                      "9": { title: "RHYME OR BURST", rule: "Give a word. Going clockwise, each person must rhyme. First to fail or lag munches a chip! 🎤" },
                                      "10": { title: "CATEGORIES", rule: "Declare a category (e.g., burger toppings). Clockwise, everyone names one. First to fail munches a fry! 🏷️" },
                                      "J": { title: "NEVER EVER", rule: "Instantly play a quick round of Never Have I Ever. First person to put a finger down munches! 🚫" },
                                      "Q": { title: "QUEST MASTER", rule: "You are the Question Master. Anyone who answers any question you ask them must eat a fry! 👑" },
                                      "K": { title: "KINGS CUP", rule: "The drawer of the 4th King has to eat the ultimate Chilli Cheeze Bomb! 🏆" }
                                    };
                                    
                                    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
                                    const randomValue = values[Math.floor(Math.random() * values.length)];
                                    const schema = cardRules[randomValue as keyof typeof cardRules] || cardRules["3"];
                                    
                                    setKingsCupCard({
                                      suit: randomSuit,
                                      value: randomValue,
                                      title: schema.title,
                                      rule: schema.rule
                                    });
                                  }}
                                  className="w-[190px] h-[260px] bg-gradient-to-br from-zinc-900 to-[#121212] rounded-2xl p-5 border-4 border-dashed border-[#3E5E93]/50 flex flex-col items-center justify-center text-center gap-4 shadow-[#3E5E93]/10 shadow-[0_10px_35px] cursor-pointer hover:border-[#3E5E93] transition-all group scale-98 active:scale-95 animate-pulse"
                                >
                                  <div className="w-12 h-12 rounded-full bg-black border border-[#3E5E93]/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    🍺
                                  </div>
                                  <div>
                                    <h4 className="font-sub font-black text-white text-xs uppercase tracking-widest">TAP TO REVEAL</h4>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase max-w-[140px] leading-tight">Click on card back to draw next round card</p>
                                  </div>
                                </div>
                              )}

                              {kingsCupCard && (
                                <button
                                  onClick={() => {
                                    playBeep(520, "sine", 0.05);
                                    // re-draw card
                                    const suits = ["♠", "♥", "♦", "♣"];
                                    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
                                    const cardRules = {
                                      "A": { title: "WATERFALL", rule: "Continuous sip cascade! Pass a chip to the next person, you can't stop munching until the left person stops! 🌊" },
                                      "2": { title: "CHOOSE YOU", rule: "Point at someone at Table 12. They must gobble up 1 gold chip or take a soda sip! 👈" },
                                      "3": { title: "MUNCH FOR ME", rule: "You take a nice bite of your fries or a sip of shake! To your appetite! 🍔" },
                                      "4": { title: "TOUCH FLOOR", rule: "Last person at the table to touch the actual floor has to munch a fry! ⬇️" },
                                      "5": { title: "MUNCH BOYS", rule: "All the guys/gents at Table 12 must eat a hot wing! 👦" },
                                      "6": { title: "MUNCH CHICKS", rule: "All the ladies/girls take a refreshing chip and munch it nicely! 👧" },
                                      "7": { title: "TO HEAVEN", rule: "Last person at Table 12 to raise their hands in the air must take a soda sip! ☁️" },
                                      "8": { title: "PICK A MATE", rule: "Nominate a mate. For the rest of the game, whenever you take a fry, they must eat one with you! 👥" },
                                      "9": { title: "RHYME OR BURST", rule: "Give a word. Going clockwise, each person must rhyme. First to fail or lag munches a chip! 🎤" },
                                      "10": { title: "CATEGORIES", rule: "Declare a category (e.g., burger toppings). Clockwise, everyone names one. First to fail munches a fry! 🏷️" },
                                      "J": { title: "NEVER EVER", rule: "Instantly play a quick round of Never Have I Ever. First person to put a finger down munches! 🚫" },
                                      "Q": { title: "QUEST MASTER", rule: "You are the Question Master. Anyone who answers any question you ask them must eat a fry! 👑" },
                                      "K": { title: "KINGS CUP", rule: "The drawer of the 4th King has to eat the ultimate Chilli Cheeze Bomb! 🏆" }
                                    };
                                    
                                    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
                                    const randomValue = values[Math.floor(Math.random() * values.length)];
                                    const schema = cardRules[randomValue as keyof typeof cardRules] || cardRules["3"];
                                    
                                    setKingsCupCard({
                                      suit: randomSuit,
                                      value: randomValue,
                                      title: schema.title,
                                      rule: schema.rule
                                    });
                                  }}
                                  className="px-6 py-2.5 bg-[#3E5E93] hover:bg-orange-400 text-black uppercase font-sub font-black text-xs tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-bold"
                                >
                                  🃏 DRAW NEW CARD
                                </button>
                              )}
                            </div>
                          )}

                          {/* 2) TRUTH OR DARE BOARD */}
                          {selectedDrinkingGame === "TRUTH_DARE" && (
                            <div className="flex flex-col items-center text-center gap-5">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#3E5E93] font-bold">❓ TRUTH OR DARE CHALLENGE</span>
                              
                              <div className="w-full max-w-[320px] bg-[#121212] border border-zinc-805 rounded-2xl p-5 min-h-[160px] flex flex-col justify-center items-center shadow-lg">
                                {truthOrDarePrompt ? (
                                  <div className="space-y-3">
                                    <span className={`px-3 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase font-black ${
                                      truthOrDarePrompt.type === "TRUTH" ? "bg-amber-400/10 text-amber-400 border border-amber-400/30" : "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                                    }`}>
                                      {truthOrDarePrompt.type} DRAWN
                                    </span>
                                    <p className="text-zinc-200 text-sm font-sans font-semibold italic leading-relaxed px-2 select-text">
                                      "{truthOrDarePrompt.text}"
                                    </p>
                                    <p className="text-[9.5px] font-mono text-zinc-500 uppercase mt-4">
                                      Complete correctly or take a penalty bite of a fry/chip! 🍟
                                    </p>
                                  </div>
                                ) : (
                                  <div className="text-center py-2">
                                    <p className="text-xs text-zinc-500 font-sans italic leading-normal max-w-[240px] mx-auto">
                                      Is Table 12 feeling brave? Choose either Truth or Dare button down to get selection!
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2.5 w-full max-w-[320px]">
                                <button
                                  onClick={() => {
                                    playBeep(480, "sine", 0.08);
                                    const truths = [
                                      "Who at Table 12 has the worst music selection during food runs?",
                                      "What is the most embarrassing pickup line you have ever attempted?",
                                      "Who is realistically the cheapest/stingiest close friend at Table 12?",
                                      "What was the most ridiculous lie you told so you could skip a gathering?",
                                      "Have you ever secretly fed a dog your crusts under the table?",
                                      "Who is the most responsible adult at this table right now?"
                                    ];
                                    const t = truths[Math.floor(Math.random() * truths.length)];
                                    setTruthOrDarePrompt({ type: "TRUTH", text: t });
                                  }}
                                  className="flex-1 py-3 bg-neutral-900 border border-amber-500/30 text-amber-400 hover:text-white rounded-xl text-xs uppercase font-sub font-black tracking-wider transition-all cursor-pointer hover:border-amber-500 active:scale-95 font-bold"
                                >
                                  🔎 TRUTH
                                </button>

                                <button
                                  onClick={() => {
                                    playBeep(560, "sine", 0.08);
                                    const dares = [
                                      "Munch a fry from the plate using absolutely no hands!",
                                      "Gently ask Lutho Crew the waiter for his autograph as if he's an international rockstar.",
                                      "Let the person to your left send any emoji of their choice to anyone on your chat app.",
                                      "Do a 10-second dramatic toast declaring your undying absolute love for Table 12.",
                                      "Exchange sunglasses or a piece of outer apparel with someone until the slot booking finishes.",
                                      "Speak with a subtle fake British pub dialect for the next three minutes."
                                    ];
                                    const d = dares[Math.floor(Math.random() * dares.length)];
                                    setTruthOrDarePrompt({ type: "DARE", text: d });
                                  }}
                                  className="flex-1 py-3 bg-neutral-900 border border-purple-500/30 text-purple-400 hover:text-white rounded-xl text-xs uppercase font-sub font-black tracking-wider transition-all cursor-pointer hover:border-purple-500 active:scale-95 font-bold"
                                >
                                  🔥 DARE
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 3) NEVER HAVE I EVER */}
                          {selectedDrinkingGame === "NEVER_EVER" && (
                            <div className="flex flex-col items-center text-center gap-5">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#3E5E93] font-bold">🚫 NEVER HAVE I EVER</span>
                              
                              <div className="w-full max-w-[320px] bg-zinc-950 border border-zinc-850 rounded-2xl p-6 min-h-[140px] flex items-center justify-center select-text">
                                <p className="text-white text-base font-sans font-bold italic leading-relaxed text-center px-1">
                                  "{neverEverPrompt}"
                                </p>
                              </div>

                              <div className="text-[10px] uppercase tracking-widest font-mono text-zinc-500">
                                📢 <span className="text-[#3E5E93] font-bold">CONFESS OR DRINK UP!</span> IF YOU ARE GUILTY.
                              </div>

                              <button
                                onClick={() => {
                                  playBeep(523.25, "sine", 0.08);
                                  const statements = [
                                    "Never have I ever spent on a luxury gym membership I only visited once.",
                                    "Never have I ever texted an ex-romantic partner after three separate drafts.",
                                    "Never have I ever pretended to be a fast food connoisseur just to impress someone.",
                                    "Never have I ever accidentally walked into the wrong gender restroom at a crowded spot.",
                                    "Never have I ever snoozed my phone alarm, went back to sleep and completely missed a flight.",
                                    "Never have I ever spent more than R500 on a single round of milkshakes for strangers.",
                                    "Never have I ever lied about my actual birthday to receive a free restaurant dessert."
                                  ];
                                  const s = statements[Math.floor(Math.random() * statements.length)];
                                  setNeverEverPrompt(s);
                                  triggerToast("Drawn new statement!", "success");
                                }}
                                className="w-full max-w-[320px] py-3.5 bg-[#3E5E93] hover:bg-orange-400 text-black font-sub font-black text-xs uppercase rounded-xl transition-all cursor-pointer tracking-wider active:scale-95 font-bold shadow-md"
                              >
                                🃏 NEXT STATEMENT
                              </button>
                            </div>
                          )}

                          {/* 4) MOST LIKELY TO */}
                          {selectedDrinkingGame === "MOST_LIKELY" && (
                            <div className="flex flex-col items-center text-center gap-5">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#3E5E93] font-bold">👥 MOST LIKELY TO</span>
                              
                              <div className="w-full max-w-[320px] bg-zinc-950 border border-zinc-850 rounded-2xl p-6 min-h-[140px] flex items-center justify-center select-text">
                                <p className="text-white text-base font-sans font-bold italic leading-relaxed text-center px-1">
                                  "{mostLikelyPrompt}"
                                </p>
                              </div>

                              <div className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase">
                                👉 COUNT 3, 2, 1 AND POINT! <span className="text-red-500 font-bold">MOST VOTED TAKE A SODA SIP.</span>
                              </div>

                              <button
                                onClick={() => {
                                  playBeep(523.25, "sine", 0.08);
                                  const scenarios = [
                                    "Most likely to pay the entire master food bill tonight",
                                    "Most likely to lose their credit card or keys inside the taxi on the ride home",
                                    "Most likely to challenge Lutho Crew the waiter to an impromptu arm wrestling contest",
                                    "Most likely to shed tears during a sad country song in the background",
                                    "Most likely to suggest ordering another round of fries before the current drinks are even finished",
                                    "Most likely to order chips for the table and eat exactly 90% of them alone",
                                    "Most likely to start singing karaoke with zero encouragement or preparation"
                                  ];
                                  const s = scenarios[Math.floor(Math.random() * scenarios.length)];
                                  setMostLikelyPrompt(s);
                                  triggerToast("Drawn next voting scenario!", "success");
                                }}
                                className="w-full max-w-[320px] py-3.5 bg-[#3E5E93] hover:bg-orange-400 text-black font-sub font-black text-xs uppercase rounded-xl transition-all cursor-pointer tracking-wider active:scale-95 font-bold shadow-md"
                              >
                                🎲 NEXT SCENARIO
                              </button>
                            </div>
                          )}

                          {/* 5) SPIN THE BOTTLE */}
                          {selectedDrinkingGame === "SPIN_BOTTLE" && (
                            <div className="flex flex-col items-center text-center gap-5">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#3E5E93] font-black">🔄 SPIN THE BOTTLE WHEEL</span>
                              
                              <div className="relative w-[210px] h-[210px] flex items-center justify-center select-none bg-zinc-950/60 rounded-full border border-zinc-900 shadow-inner">
                                {/* sectors markers */}
                                <div className="absolute top-2 font-mono text-[8px] uppercase font-bold text-zinc-500">WHO DRAWS</div>
                                <div className="absolute bottom-2 font-mono text-[8px] uppercase font-bold text-zinc-500">YOU DRINK</div>
                                <div className="absolute right-2 font-mono text-[8px] uppercase font-bold text-zinc-500">LEFT DRINKS</div>
                                <div className="absolute left-2 font-mono text-[8px] uppercase font-bold text-zinc-500">RIGHT DRINKS</div>

                                {/* Animated green/gold digital glass bottle */}
                                <motion.div
                                  animate={{ rotate: bottleRotation }}
                                  transition={isBottleSpinning ? { duration: 3.5, ease: [0.1, 0.8, 0.25, 1] } : { duration: 0 }}
                                  className="w-18 h-18 relative flex items-center justify-center pointer-events-none drop-shadow-2xl"
                                >
                                  {/* Pointer Vector bottle */}
                                  <div className="w-2.5 h-16 bg-gradient-to-t from-emerald-800 to-orange-400 rounded-full border border-[#3E5E93]/40 shadow-xl relative">
                                    {/* Cap indicator pointing UP */}
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border border-white animate-pulse" />
                                  </div>
                                </motion.div>
                              </div>

                              <div className="w-full max-w-[310px] bg-zinc-950 px-4 py-3 border border-zinc-900 rounded-xl">
                                <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 block">POINTED SECTOR DIRECTION OUTCOME:</span>
                                <h4 className="text-white text-xs font-sans font-bold uppercase tracking-wider mt-1 text-orange-500">
                                  {isBottleSpinning ? "💫 SPEED RECORD SPINNING..." : bottleTargetOutcome}
                                </h4>
                              </div>

                              <button
                                disabled={isBottleSpinning}
                                onClick={() => {
                                  setIsBottleSpinning(true);
                                  playBeep(440, "sine", 0.05);
                                  setTimeout(() => playBeep(554.37, "sine", 0.05), 100);
                                  setTimeout(() => playBeep(659.25, "sine", 0.05), 200);

                                  const spinDegrees = 1440 + Math.floor(Math.random() * 720); // 4-6 complete circles
                                  const finalRot = bottleRotation + spinDegrees;
                                  setBottleRotation(finalRot);

                                  const outcomes = [
                                    "YOU MUNCH FRIES! Take 2 massive fries! 🍟",
                                    "LEFT SIDE MUNCHES! Everybody sitting on your left eats 1 golden chip! 👈",
                                    "RIGHT SIDE MUNCHES! Everybody sitting on your right eats 1 golden chip! 👉",
                                    "THE ASSIGNED CHOSEN MASTER: Lutho Crew chooses who gets a free cheese bomb! 👨‍🍳",
                                    "PARTNERS: Pick any buddy! Both of you eat 2 fries! 👥",
                                    "EVERYONE MUNCHES! Everyone raises a tasty fry for Table 12! 🍟",
                                    "YOU ARE SAFE! Hand control to the person opposite to spin. 😎"
                                  ];

                                  const targetIdx = Math.floor(Math.random() * outcomes.length);

                                  setTimeout(() => {
                                    setIsBottleSpinning(false);
                                    setBottleTargetOutcome(outcomes[targetIdx]);
                                    playBeep(880, "sine", 0.1);
                                    setTimeout(() => playBeep(1046.5, "sine", 0.15), 80);
                                    triggerToast("🎯 Spin Outcome: " + outcomes[targetIdx].split("!")[0], "success");
                                  }, 3500);
                                }}
                                className={`w-full max-w-[320px] py-3.5 ${isBottleSpinning ? "bg-zinc-805 text-zinc-500" : "bg-[#3E5E93] hover:bg-orange-400 text-black cursor-pointer"} font-sub font-black text-xs uppercase rounded-xl transition-all font-bold tracking-wider active:scale-95 shadow-md`}
                              >
                                {isBottleSpinning ? "🚨 DISK SPINNING REELS..." : "⚡ SPIN BOTTLE 🍟"}
                              </button>
                            </div>
                          )}

                          {/* 6) WOULD YOU RATHER */}
                          {selectedDrinkingGame === "WOULD_RATHER" && (
                            <div className="flex flex-col items-center text-center gap-5">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#3E5E93] font-bold">⚖️ WOULD YOU RATHER</span>
                              
                              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                                CHOOSE PREFERRED OPTION. <span className="text-orange-400 font-bold">MINORITY MUNCHES FRIES!</span>
                              </span>

                              {wouldRatherPrompt && (
                                <div className="flex flex-col gap-3.5 w-full max-w-[320px]">
                                  
                                  {/* Option A Card */}
                                  <button
                                    onClick={() => {
                                      if (wouldRatherVotes) return;
                                      playBeep(523.25, "sine", 0.08);
                                      const votesA = 35 + Math.floor(Math.random() * 30);
                                      const votesB = 100 - votesA;
                                      setWouldRatherVotes([votesA, votesB]);
                                      triggerToast(votesA < votesB ? "🔴 MINORITY! MUNCH 1 CHIP!" : "🟢 MAJORITY! SAFE!", "info");
                                    }}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                                      wouldRatherVotes 
                                        ? wouldRatherVotes[0] < wouldRatherVotes[1] 
                                          ? "border-red-500 bg-red-950/20 text-red-400" 
                                          : "border-emerald-500 bg-[#121212]/40 text-emerald-400"
                                        : "border-zinc-800 bg-[#121212]/90 hover:border-[#3E5E93]/50 text-[#3E5E93] hover:text-white cursor-pointer active:scale-98"
                                    } flex flex-col gap-1`}
                                  >
                                    <div className="flex justify-between items-center w-full">
                                      <span className="text-[10px] font-mono uppercase tracking-widest font-black text-amber-500">OPTION A</span>
                                      {wouldRatherVotes && (
                                        <span className="font-mono text-xs font-black">{wouldRatherVotes[0]}% Voted</span>
                                      )}
                                    </div>
                                    <p className="text-xs font-sans font-bold leading-normal text-white mt-1">
                                      {wouldRatherPrompt[0]}
                                    </p>
                                    {wouldRatherVotes && wouldRatherVotes[0] < wouldRatherVotes[1] && (
                                      <span className="text-[9px] font-mono uppercase font-black tracking-widest text-red-505 mt-2">🍺 LOSER MINORITY - MUNCH FRY 🍺</span>
                                    )}
                                  </button>

                                  {/* Option B Card */}
                                  <button
                                    onClick={() => {
                                      if (wouldRatherVotes) return;
                                      playBeep(493.88, "sine", 0.08);
                                      const votesB = 35 + Math.floor(Math.random() * 30);
                                      const votesA = 100 - votesB;
                                      setWouldRatherVotes([votesA, votesB]);
                                      triggerToast(votesB < votesA ? "🔴 MINORITY! MUNCH 1 CHIP!" : "🟢 MAJORITY! SAFE!", "info");
                                    }}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                                      wouldRatherVotes 
                                        ? wouldRatherVotes[1] < wouldRatherVotes[0] 
                                          ? "border-red-500 bg-red-950/20 text-red-400" 
                                          : "border-emerald-500 bg-[#121212]/40 text-emerald-400"
                                        : "border-zinc-800 bg-[#121212]/90 hover:border-[#3E5E93]/50 text-[#3E5E93] hover:text-white cursor-pointer active:scale-98"
                                    } flex flex-col gap-1`}
                                  >
                                    <div className="flex justify-between items-center w-full">
                                      <span className="text-[10px] font-mono uppercase tracking-widest font-black text-amber-500">OPTION B</span>
                                      {wouldRatherVotes && (
                                        <span className="font-mono text-xs font-black">{wouldRatherVotes[1]}% Voted</span>
                                      )}
                                    </div>
                                    <p className="text-xs font-sans font-bold leading-normal text-white mt-1">
                                      {wouldRatherPrompt[1]}
                                    </p>
                                    {wouldRatherVotes && wouldRatherVotes[1] < wouldRatherVotes[0] && (
                                      <span className="text-[9px] font-mono uppercase font-black tracking-widest text-red-500 mt-2">🍺 LOSER MINORITY - MUNCH FRY 🍺</span>
                                    )}
                                  </button>

                                </div>
                              )}

                              {wouldRatherVotes && (
                                <button
                                  onClick={() => {
                                    playBeep(523.25, "sine", 0.08);
                                    const dilemmas: [string, string][] = [
                                      ["Only eat double cheezebombs for breakfast", "Only eat smashburgers for dinner for a month"],
                                      ["Sing the opening verse of a song karaoke starter", "Give Lutho Crew waiter a generous R100 direct tip"],
                                      ["Eat standard pub fries for 48 hours straight", "Never eat South African biltong again for rest of life"],
                                      ["Dance on top of your chair for exactly 30 seconds", "Do 15 quick pushups right next to Table 12"],
                                      ["Let people draw a face tattoo using erasable marker", "Eat the hottest wings on the table with no blue cheese sauce"]
                                    ];
                                    const index = Math.floor(Math.random() * dilemmas.length);
                                    setWouldRatherPrompt(dilemmas[index]);
                                    setWouldRatherVotes(null);
                                    triggerToast("New dilemma loaded!", "success");
                                  }}
                                  className="w-full max-w-[320px] py-3.5 bg-neutral-900 border border-zinc-800 text-white font-sub font-black text-xs uppercase rounded-xl transition-all cursor-pointer tracking-wider font-bold shadow-md active:scale-95 group-hover:border-[#3E5E93]"
                                >
                                  ⚖️ NEXT DILEMMA
                                </button>
                              )}
                            </div>
                          )}

                        </div>

                        {/* Quick switch inside active game to return to select screen */}
                        <div className="pt-3 mt-4 border-t border-[#3E5E93]/20 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                          <span>TABLE: 12 • OUTCOME SAVED</span>
                          <span className="text-[#3E5E93]">LUTHO OS ENGINE</span>
                        </div>

                      </div>
                    )}
                    
                  </div>

                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* --- IMMERSIVE FULLSCREEN THUNEE CLUB OVERLAY APP --- */}
      {isThuneePlaying && createPortal(
        <ThuneeFullscreenApp
          isThuneePlaying={isThuneePlaying}
          setIsThuneePlaying={setIsThuneePlaying}
          currentPlayerName={currentPlayerName}
          setCurrentPlayerName={setCurrentPlayerName}
          thuneeGameMode={thuneeGameMode}
          setThuneeGameMode={setThuneeGameMode}
          thuneeStage={thuneeStage}
          setThuneeStage={setThuneeStage}
          thuneeSeats={thuneeSeats}
          thuneeHostName={thuneeHostName}
          thuneeTrumpSuit={thuneeTrumpSuit}
          setThuneeTrumpSuit={setThuneeTrumpSuit}
          thuneeHand={thuneeHand}
          setThuneeHand={setThuneeHand}
          thuneeCurrentTurnIndex={thuneeCurrentTurnIndex}
          thuneePlayedCardsNew={thuneePlayedCardsNew}
          thuneeRoundScores={thuneeRoundScores}
          thuneeGameScores={thuneeGameScores}
          thuneeTricksWon={thuneeTricksWon}
          thuneeCallThunee={thuneeCallThunee}
          thuneeThuneeCaller={thuneeThuneeCaller}
          thuneeGameStatusText={thuneeGameStatusText}
          thuneeAllCardsNew={thuneeAllCardsNew}
          thuneeLeadPlayerIndex={thuneeLeadPlayerIndex}
          currentTableId={currentTableId}
          updateThuneeGame={updateThuneeGame}
          handleUserPlayThuneeCard={handleUserPlayThuneeCard}
          collectThuneeTrick={collectThuneeTrick}
          resolveThuneeRound={resolveThuneeRound}
          triggerLobbyReset={triggerLobbyReset}
          triggerLobbyBackfill={triggerLobbyBackfill}
          startThuneeRound={startThuneeRound}
          playBeep={playBeep}
          triggerToast={triggerToast}
          handleNicknameChange={handleNicknameChange}
          thuneeShowHelpSheet={thuneeShowHelpSheet}
          setThuneeShowHelpSheet={setThuneeShowHelpSheet}
          thuneeAdviceText={thuneeAdviceText}
          setThuneeAdviceText={setThuneeAdviceText}
          thuneeSuggestedCardId={thuneeSuggestedCardId}
          setThuneeSuggestedCardId={setThuneeSuggestedCardId}
          getThuneeCoachAdviceMessage={getThuneeCoachAdviceMessage}
        />,
        document.body
      )}

      {/* INTERACTIVE BILL SPLITTER CENTRAL MODAL */}
      <AnimatePresence>
        {isBillOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBillOpen(false)}
              className="fixed inset-0 bg-black/95 z-[9930] backdrop-blur-sm cursor-pointer"
            />

            {/* Central Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-x-4 top-[6%] bottom-[6%] max-w-[480px] mx-auto bg-white border-2 border-[#3E5E93] rounded-3xl z-[9935] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 bg-black border-b border-[#3E5E93] flex justify-between items-center relative">
                <div>
                  <h3 className="font-display font-black text-[#3E5E93] tracking-widest text-lg uppercase flex items-center gap-1.5">
                    <Receipt className="w-5 h-5" /> REQUEST BILL
                  </h3>
                  <p className="text-[10px] font-mono tracking-wider text-white uppercase">
                    {formatTableLabel(currentTableId)} • Split & request staff settlement
                  </p>
                </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsBillOpen(false)}
                        className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        aria-label="Close bill drawer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body Scroll area */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-zinc-900 to-black p-4 rounded-xl border border-zinc-800 flex flex-col gap-3.5 relative overflow-hidden shrink-0 min-h-[160px]">
                      <div className="absolute top-2.5 right-2.5 w-12 h-12 pointer-events-none opacity-[0.03]">
                        <QrCode className="w-12 h-12 text-[#3E5E93]" />
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-mono tracking-widest text-[#3E5E93] uppercase font-black bg-[#3E5E93]/10 px-2.5 py-0.5 rounded">
                            LIVE SPLITTING CONNECT
                          </span>
                          <h4 className="font-sub font-black text-sm text-white uppercase mt-1 px-0.5 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#3E5E93]" />
                            {isRemoteTable
                              ? isRemoteSplitConnected
                                ? `Split group (${displaySessionMembers.length})`
                                : "Not connected"
                              : `Active Table (${displaySessionMembers.length})`}
                          </h4>
                        </div>

                        <button
                          onClick={() => {
                            playBeep(450, "sine", 0.05);
                            setSplitQrStep("choose");
                            setIsQrModalOpen(true);
                          }}
                          className="px-3.5 py-2 bg-[#3E5E93] hover:bg-orange-400 text-[#121212] rounded-lg text-[10.5px] font-sub font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 text-center"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Scan QR Code
                        </button>
                      </div>

                      {isRemoteTable && !isRemoteSplitConnected ? (
                        <div className="bg-black/40 p-3 rounded-lg border border-zinc-900">
                          <p className="text-[10px] text-zinc-400 leading-relaxed">
                            Ordering solo — your bill updates live below. Want to split with friends? Scan a split QR to{" "}
                            <span className="text-[#3E5E93] font-bold">Host</span> or{" "}
                            <span className="text-[#3E5E93] font-bold">Join Split</span> and share one synced bill.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 items-center bg-black/40 p-2.5 rounded-lg border border-zinc-900">
                          <span className="text-[9.5px] font-mono text-zinc-500 uppercase font-black">Joined:</span>
                          {displaySessionMembers.length === 0 ? (
                            <span className="text-[10px] text-zinc-500 italic">No one connected yet</span>
                          ) : (
                            displaySessionMembers.map((member) => (
                              <motion.span
                                key={member}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold font-sub uppercase flex items-center gap-1 border border-zinc-800 shrink-0 ${
                                  member === currentPlayerName
                                    ? "bg-zinc-800 text-white"
                                    : "bg-zinc-900/80 text-[#3E5E93]"
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {member}
                                {remoteSplitSession?.hostName === member ? " (host)" : ""}
                              </motion.span>
                            ))
                          )}
                        </div>
                      )}

                      {!isRemoteTable && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const url = getSecureGuestUrl(currentTableId || REMOTE_TABLE_ID);
                              navigator.clipboard.writeText(url);
                              playBeep(600, "sine", 0.08);
                              setCopiedLink(true);
                              triggerToast("Table splitting link copied to clipboard!", "success");
                              setTimeout(() => setCopiedLink(false), 2000);
                            }}
                            className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-850 hover:border-zinc-800 uppercase rounded text-[9.5px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                            {copiedLink ? "Link Copied!" : "Copy Table Link"}
                          </button>
                        </div>
                      )}

                      {isRemoteTable && isRemoteSplitConnected && remoteSplitSession && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const url = getSplitJoinUrl(remoteSplitSession.id, REMOTE_TABLE_ID);
                              navigator.clipboard.writeText(url);
                              playBeep(600, "sine", 0.08);
                              setCopiedLink(true);
                              triggerToast("Split invite link copied!", "success");
                              setTimeout(() => setCopiedLink(false), 2000);
                            }}
                            className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-850 hover:border-zinc-800 uppercase rounded text-[9.5px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                            {copiedLink ? "Link Copied!" : "Copy Split Invite"}
                          </button>
                        </div>
                      )}
                    </div>

                    {isRemoteTable && !isRemoteSplitConnected && (
                      <div className="rounded-xl border border-zinc-300 bg-zinc-50 p-3 text-center">
                        <p className="text-[11px] font-black uppercase text-zinc-800 tracking-wider">
                          Solo bill — updates live
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-1">
                          Items appear on your bill below as soon as you order. Host or join a split anytime to share one bill with friends.
                        </p>
                      </div>
                    )}

                    {billRequestSubmitted && (
                      <div className="rounded-xl border border-[#3E5E93] bg-[#3E5E93]/10 p-3">
                        <p className="text-[11px] font-black uppercase text-black tracking-wider text-center">
                          Bill request sent — awaiting staff
                        </p>
                        <p className="text-[10px] text-zinc-700 mt-1 text-center">
                          Staff see your split choice and payment amount below. You will be notified when marked paid.
                        </p>
                        {submittedBillDetails && (
                          <BillRequestSummary
                            billDetails={submittedBillDetails}
                            variant="guest"
                            className="mt-3"
                          />
                        )}
                      </div>
                    )}

                    {/* Bill Status / Progress Board */}
                    <div className="bg-[#121212] p-3.5 rounded-xl border border-zinc-900 shadow-inner flex flex-col gap-2.5 shrink-0">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                            Table Total Cost
                          </p>
                          <h4 className="font-sub font-black text-xl text-white">
                            R{billOriginalTotal}
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-[#3E5E93]">
                            Remaining Unpaid
                          </p>
                          <h4 className="font-mono text-xl font-black text-[#3E5E93]">
                            R{billRemainingTotal}
                          </h4>
                        </div>
                      </div>

                      {/* Custom Progress Bar */}
                      <div className="w-full bg-[#1C1C1E] h-3 rounded-full overflow-hidden border border-zinc-850 p-0.5 flex relative">
                        <div 
                          className="bg-gradient-to-r from-orange-600 to-[#3E5E93] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(62, 94, 147,0.5)]"
                          style={{ width: `${billPaidPercent}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                        <span>Paid: R{billAlreadyPaidTotal} ({billPaidPercent}%)</span>
                        <span>Table settled: {billRemainingTotal === 0 ? "100% READY" : "PENDING SHARE"}</span>
                      </div>
                    </div>

                    {/* RECEIPT EXPORT & CONTROL CENTRE */}
                    <div className="bg-[#121212] p-3 rounded-xl border border-zinc-900 flex flex-col gap-2 shrink-0">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🧾</span>
                          <div>
                            <span className="text-[10px] font-mono uppercase text-[#3E5E93] font-bold block leading-none">Receipt Export Center</span>
                            <span className="text-[11px] font-sans text-zinc-400">Save full {formatTableLabel(currentTableId)} bill</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleExportFullReceipt}
                          className="px-3.5 py-2 bg-zinc-900 hover:bg-[#3E5E93] hover:text-black border border-zinc-800 hover:border-transparent rounded-lg text-[10px] uppercase font-mono font-black tracking-wide flex items-center gap-1.5 text-zinc-300 transition-all cursor-pointer active:scale-95 shadow-md"
                        >
                          <Download className="w-3.5 h-3.5 text-[#3E5E93] group-hover:text-black" /> Export Receipt
                        </button>
                      </div>
                    </div>

                    {billRemainingTotal <= 0 ? (
                      /* Fully settled receipt block */
                      <div className="flex flex-col items-center justify-center py-8 text-center bg-[#F7F4EF] rounded-xl border border-emerald-600/30 p-4">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full border border-emerald-500/40 flex items-center justify-center text-emerald-700 mb-3 text-2xl">
                          💳
                        </div>
                        <h4 className="font-sub font-black text-black text-base uppercase tracking-wider">
                          Fully Settled!
                        </h4>
                        <p className="text-xs text-black max-w-[280px] mt-1">
                          This bill is fully sorted. Lutho Crew is happy, the kitchen is ready. You&apos;re set!
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Selector Tabs for Split Mode */}
                        <div className="grid grid-cols-3 gap-2 bg-[#121212] p-1 rounded-xl border border-zinc-900">
                          <button
                            onClick={() => {
                              playBeep(450, "sine", 0.05);
                              setBillSplitMode("EQUAL");
                            }}
                            className={`py-2 px-1 text-center font-sub text-[10px] tracking-wider font-extrabold uppercase rounded-lg transition-all ${
                              billSplitMode === "EQUAL"
                                ? "bg-[#3E5E93] text-black shadow-md font-black"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            Split Equally
                          </button>

                          <button
                            onClick={() => {
                              playBeep(450, "sine", 0.05);
                              setBillSplitMode("ITEMS");
                            }}
                            className={`py-2 px-1 text-center font-sub text-[10px] tracking-wider font-extrabold uppercase rounded-lg transition-all ${
                              billSplitMode === "ITEMS"
                                ? "bg-[#3E5E93] text-black shadow-md font-black"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            By Items
                          </button>

                          <button
                            onClick={() => {
                              playBeep(450, "sine", 0.05);
                              setBillSplitMode("CUSTOM");
                            }}
                            className={`py-2 px-1 text-center font-sub text-[10px] tracking-wider font-extrabold uppercase rounded-lg transition-all ${
                              billSplitMode === "CUSTOM"
                                ? "bg-[#3E5E93] text-black shadow-md font-black"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            Custom Amount
                          </button>
                        </div>

                        {/* SPLIT EQUAL INPUT CONTENT */}
                        {billSplitMode === "EQUAL" && (
                          <div className="bg-[#121212] p-4 rounded-xl border border-zinc-900 flex flex-col gap-3">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                              How many people are sharing?
                            </label>

                            <div className="flex items-center justify-between">
                              <span className="font-sub font-black text-sm text-white uppercase">
                                SPLITTING {splitCount} WAYS
                              </span>

                              <div className="flex items-center bg-[#1C1C1E] border border-zinc-850 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => {
                                    if (splitCount > 1) {
                                      playBeep(380, "sine", 0.05);
                                      setSplitCount(splitCount - 1);
                                    }
                                  }}
                                  className="px-3.5 py-1.5 text-zinc-400 hover:text-[#3E5E93] transitions-all"
                                  disabled={splitCount <= 1}
                                  aria-label="Decrease split share count"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-4 font-mono font-black text-base text-white">
                                  {splitCount}
                                </span>
                                <button
                                  onClick={() => {
                                    if (splitCount < 12) {
                                      playBeep(480, "sine", 0.05);
                                      setSplitCount(splitCount + 1);
                                    }
                                  }}
                                  className="px-3.5 py-1.5 text-zinc-400 hover:text-[#3E5E93] transition-all"
                                  disabled={splitCount >= 12}
                                  aria-label="Increase split share count"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="border-t border-zinc-850/50 mt-2 pt-2.5 flex items-center justify-between">
                              <span className="text-xs text-zinc-400">YOUR SHARE TO PAY:</span>
                              <span className="font-mono text-lg font-black text-[#3E5E93]">
                                R{(billRemainingTotal / splitCount).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* SPLIT BY ITEMS CHECKLIST CONTENT */}
                        {billSplitMode === "ITEMS" && (
                          <div className="bg-[#121212] p-3 rounded-xl border border-zinc-900 flex flex-col gap-2.5">
                            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                              Tick ordered plates/drinks you are covering:
                            </p>

                            <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                              {masterBillItems.filter(item => item.quantity - item.paidCount > 0).length === 0 ? (
                                <p className="text-zinc-600 text-xs italic py-2 text-center">
                                  All individual items are marked as paid!
                                </p>
                              ) : (
                                masterBillItems.map((item) => {
                                  const unpaidCount = item.quantity - item.paidCount;
                                  if (unpaidCount <= 0) return null;
                                  
                                  const shareSelected = itemSharesToPay[item.id] || 0;

                                  return (
                                    <div 
                                      key={item.id} 
                                      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                                        shareSelected > 0 
                                          ? "bg-[#1C1C1E] border-[#3E5E93]/50" 
                                          : "bg-black/30 border-zinc-900 hover:border-zinc-850"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="text-lg shrink-0">{item.emoji}</span>
                                        <div className="min-w-0">
                                          <h5 className="font-sub font-black text-xs text-white uppercase tracking-wider truncate">
                                            {item.name}
                                          </h5>
                                          <p className="font-mono text-[10px] text-zinc-400">
                                            R{item.price} • {unpaidCount} unpaid left
                                          </p>
                                        </div>
                                      </div>

                                      {/* Counter setup */}
                                      <div className="flex items-center bg-black rounded-lg overflow-hidden shrink-0 border border-zinc-800">
                                        <button
                                          onClick={() => handleUpdateItemShare(item.id, -1)}
                                          className="px-2 py-1 text-zinc-400 hover:text-white"
                                          disabled={shareSelected <= 0}
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className={`px-2.5 font-mono text-xs font-bold ${shareSelected > 0 ? "text-[#3E5E93] font-black" : "text-zinc-600"}`}>
                                          {shareSelected}
                                        </span>
                                        <button
                                          onClick={() => handleUpdateItemShare(item.id, 1)}
                                          className="px-2 py-1 text-zinc-400 hover:text-white"
                                          disabled={shareSelected >= unpaidCount}
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>

                            <div className="border-t border-zinc-850/50 mt-1 pt-2 flex justify-between items-center text-xs">
                              <span className="text-zinc-400 font-mono">SELECTED ITEMS TOTAL:</span>
                              <span className="font-mono text-base font-black text-[#3E5E93]">
                                R{selectedItemsPayTotal}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* CUSTOM AMOUNT CONTENT */}
                        {billSplitMode === "CUSTOM" && (
                          <div className="bg-[#121212] p-4 rounded-xl border border-zinc-900 flex flex-col gap-3">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                              Enter what custom amount you want to pay:
                            </label>

                            <div className="flex gap-2 relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sub font-black text-base text-zinc-400">
                                R
                              </span>
                              <input
                                type="number"
                                value={customAmountInput}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCustomAmountInput(val);
                                  playBeep(400, "sine", 0.02);
                                }}
                                max={billRemainingTotal}
                                placeholder={`Enter amount (max R${billRemainingTotal})`}
                                className="w-full bg-black border border-zinc-800 focus:border-[#3E5E93] focus:ring-1 focus:ring-[#3E5E93] rounded-xl pl-8 pr-4 py-3 font-mono text-sm text-white focus:outline-none placeholder-zinc-700"
                              />
                            </div>
                            
                            {/* Preset Buttons */}
                            <div className="grid grid-cols-4 gap-2 mt-1">
                              {[
                                { label: "R20", val: 20 },
                                { label: "R50", val: 50 },
                                { label: "R105", val: 105 },
                                { label: "Max Over", val: billRemainingTotal }
                              ].map((preset, i) => {
                                const disabled = preset.val > billRemainingTotal;
                                return (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      playBeep(400 + (i * 50), "sine", 0.05);
                                      setCustomAmountInput(preset.val.toString());
                                    }}
                                    disabled={disabled}
                                    className={`py-1.5 rounded bg-[#1C1C1E] border border-zinc-800 text-[10px] font-mono tracking-wider font-bold uppercase transition-all ${
                                      disabled 
                                        ? "opacity-30 text-zinc-700" 
                                        : "text-[#3E5E93] hover:bg-[#3E5E93] hover:text-black hover:border-transparent cursor-pointer"
                                    }`}
                                  >
                                    {preset.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* GRATUITY SELECTOR (Lutho Crew Tip Panel) */}
                        <div className="bg-[#121212]/30 p-2.5 rounded-xl border border-zinc-900 flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                            Support Lutho Crew (Tip Option)
                          </label>

                          <div className="grid grid-cols-5 gap-1.5">
                            {[
                              { label: "No Tip", pct: 0 },
                              { label: "10%", pct: 10 },
                              { label: "15%", pct: 15 },
                              { label: "20%", pct: 20 },
                              { label: "25%", pct: 25 }
                            ].map((tip, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  playBeep(500 + idx * 40, "triangle", 0.05);
                                  setSelectedTipPercent(tip.pct);
                                }}
                                className={`py-1.5 px-0.5 rounded-lg border text-center font-sub text-[10px] font-extrabold uppercase transition-all flex flex-col items-center justify-center cursor-pointer ${
                                  selectedTipPercent === tip.pct
                                    ? "bg-[#3E5E93]/10 border-[#3E5E93] text-[#3E5E93] font-black"
                                    : "bg-black/30 border-zinc-850 text-zinc-500 hover:text-zinc-200"
                                }`}
                              >
                                <span>{tip.label}</span>
                                {tip.pct > 0 && (
                                  <span className="text-[7.5px] font-mono text-zinc-500 mt-0.5">
                                    +R{Math.round(currentPaySubtotal * (tip.pct / 100))}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* LIVE CALCULATION BREAKDOWN SHEET */}
                        <div className="p-3.5 bg-black rounded-xl border border-zinc-900 flex flex-col gap-1.5 text-xs font-mono text-zinc-500">
                          <div className="flex justify-between">
                            <span>Contribution Share</span>
                            <span className="text-white">R{currentPaySubtotal.toFixed(2)}</span>
                          </div>
                          
                          {currentPayTipAmount > 0 && (
                            <div className="flex justify-between">
                              <span>Waiter Gratuity ({selectedTipPercent}%)</span>
                              <span className="text-[#3E5E93]">R{currentPayTipAmount.toFixed(2)}</span>
                            </div>
                          )}

                          <div className="flex justify-between border-t border-zinc-850 pt-2 text-sm text-white font-sub font-black uppercase">
                            <span>Final Charge Amount</span>
                            <span className="font-mono text-[#3E5E93] text-base font-black">
                              R{currentPayFinalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="mt-1 flex gap-2">
                          <button
                            onClick={() => setIsBillOpen(false)}
                            className="flex-1 py-3.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white uppercase font-sub font-black text-xs tracking-wider rounded-xl transition-all cursor-pointer"
                          >
                            Back To Menu
                          </button>

                          <button
                            onClick={handleSubmitBillRequest}
                            disabled={billRequestSubmitted || (currentPaySubtotal <= 0 && billRemainingTotal > 0)}
                            className={`flex-[2] py-4 rounded-xl flex items-center justify-center gap-2 font-sub font-black text-xs uppercase tracking-wider transition-all transform active:scale-95 cursor-pointer ${
                              !billRequestSubmitted && (currentPaySubtotal > 0 || billRemainingTotal <= 0)
                                ? "bg-[#3E5E93] hover:bg-[#d67a32] text-black shadow-lg"
                                : "bg-zinc-800 border-zinc-850 text-zinc-500 cursor-not-allowed opacity-50"
                            }`}
                          >
                            <Receipt className="w-4 h-4" /> {billRequestSubmitted ? "REQUEST SENT" : `REQUEST BILL (R${currentPayFinalAmount.toFixed(0)})`}
                          </button>
                        </div>
                      </>
                    )}

                  </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
            </>
          )}
        </>
      ) : (
        <>
        <div className="fixed inset-0 z-40 bg-[#121212] flex overflow-hidden select-text">
          {!staffSidebarOpen && (
            <button
              type="button"
              onClick={() => {
                playBeep(440, "sine", 0.05);
                setStaffSidebarOpen(true);
              }}
              className="fixed left-0 top-1/2 -translate-y-1/2 z-50 w-9 h-20 bg-[#1C1C1E] border border-l-0 border-[#3E5E93] rounded-r-2xl flex items-center justify-center text-[#3E5E93] hover:bg-[#3E5E93] hover:text-black transition-all shadow-lg"
              aria-label="Open staff menu"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {staffSidebarOpen && (
            <button
              type="button"
              aria-label="Close staff menu"
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setStaffSidebarOpen(false)}
            />
          )}

          <aside
            className={`fixed inset-y-0 left-0 z-50 w-[min(300px,88vw)] shrink-0 bg-[#1C1C1E] border-r border-[#3E5E93]/40 flex flex-col gap-4 shadow-2xl p-4 overflow-y-auto transition-transform duration-300 ease-out ${
              staffSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src="/lutho-logo.png"
                alt="Lutho Logo"
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#3E5E93] font-black">Staff Console</p>
                <h2 className="text-white font-black uppercase text-sm">{activeStaffProfile?.name || "Staff"}</h2>
                <p className="text-zinc-500 text-[10px] uppercase">{activeStaffProfile?.role || "general"} • {activeStaffProfile?.onShift ? "on shift" : "off shift"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-black/50 border border-zinc-800 p-3">
                <div className="text-zinc-500 text-[9px] uppercase font-mono">Open orders</div>
                <div className="text-white text-xl font-black">{sharedStaffOrders.filter(order => order.status !== "Completed").length}</div>
              </div>
              <div className="rounded-2xl bg-black/50 border border-zinc-800 p-3">
                <div className="text-zinc-500 text-[9px] uppercase font-mono">Open requests</div>
                <div className="text-white text-xl font-black">{serviceRequests.filter(request => request.status !== "DONE").length}</div>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {([
                ["overview", "Overview"],
                ["orders", "Orders"],
                ["tables", "Floor layout"],
                ["requests", "Requests"],
                ["team", "Team"],
                ...(isAdminStaff
                  ? ([
                      ["onboarding", onboardingDone ? "Onboarding" : "Onboarding •"],
                      ["theme", "Theme Studio"],
                      ["menu", "Menu"],
                    ] as [StaffWorkspace, string][])
                  : []),
                ["settings", "Settings"]
              ] as [StaffWorkspace, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    playBeep(420, "sine", 0.04);
                    setStaffWorkspace(key);
                    setStaffSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-3 rounded-2xl border text-sm font-bold transition-all ${
                    staffWorkspace === key
                      ? "bg-[#3E5E93] text-black border-[#3E5E93]"
                      : "bg-black/40 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => {
                  playBeep(600, "sine", 0.06);
                  setIsClaimScannerOpen(true);
                  setStaffSidebarOpen(false);
                }}
                className="w-full text-left px-3 py-3 rounded-2xl border text-sm font-bold transition-all bg-[#3E5E93]/10 text-[#3E5E93] border-[#3E5E93]/40 hover:bg-[#3E5E93] hover:text-black flex items-center gap-2"
              >
                <ScanLine className="w-4 h-4" />
                Scan claim
              </button>
            </nav>

            <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  playBeep(523.25, "sine", 0.1);
                  setAppMode("CUSTOMER");
                  triggerToast(`Reconnected to ${formatTableLabel(currentTableId)} self-ordering UI`, "info");
                }}
                className="w-full px-3 py-3 bg-black text-zinc-300 border border-zinc-800 rounded-2xl hover:text-white"
              >
                Customer View
              </button>
              <button
                onClick={handleStaffLogout}
                className="w-full px-3 py-3 bg-red-950/30 text-red-300 border border-red-500/20 rounded-2xl hover:bg-red-950/50"
              >
                Sign Out
              </button>
            </div>
          </aside>

          <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            {/* ALWAYS-VISIBLE CLOCK IN/OUT + CLAIM SCANNER BAR */}
            {activeStaffProfile && (
              <div className="shrink-0 p-3 md:p-4 pb-0">
                <div className="rounded-2xl bg-[#1C1C1E] border border-[#3E5E93]/40 p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${activeStaffProfile.onShift ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                    <div className="min-w-0">
                      <p className="text-white font-black uppercase text-sm truncate">{activeStaffProfile.name}</p>
                      <p className="text-zinc-500 text-[10px] uppercase font-mono">{activeStaffProfile.onShift ? "Currently clocked in" : "Currently clocked out"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const action = activeStaffProfile.onShift ? "OUT" : "IN";
                        if (!window.confirm(`Clock ${action} as ${activeStaffProfile.name}?`)) return;
                        playBeep(activeStaffProfile.onShift ? 300 : 620, "sine", 0.08);
                        handleToggleStaffShift(activeStaffProfile);
                      }}
                      className={`flex-1 sm:flex-initial px-5 py-3 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                        activeStaffProfile.onShift
                          ? "bg-red-950/40 text-red-300 border border-red-500/30 hover:bg-red-950/60"
                          : "bg-[#3E5E93] text-black hover:bg-[#d67a32]"
                      }`}
                    >
                      {activeStaffProfile.onShift ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                      {activeStaffProfile.onShift ? "Clock Out" : "Clock In"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playBeep(600, "sine", 0.06);
                        setIsClaimScannerOpen(true);
                      }}
                      className="px-4 py-3 rounded-2xl bg-black/50 border border-[#3E5E93]/40 text-[#3E5E93] font-black uppercase text-xs flex items-center gap-2 hover:bg-[#3E5E93] hover:text-black transition-all active:scale-95"
                      title="Scan a guest's claim code"
                    >
                      <ScanLine className="w-4 h-4" />
                      Scan claim
                    </button>
                  </div>
                </div>
              </div>
            )}
            {staffWorkspace !== "tables" && (
            <div className="shrink-0 p-4 md:p-6 pb-0">
            <div className="bg-[#1C1C1E] border border-zinc-800/80 rounded-3xl p-5 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-[#3E5E93] text-black font-mono text-[9px] font-black uppercase rounded tracking-widest">
                      Staff View Active
                    </span>
                    <span className="px-2.5 py-0.5 bg-black border border-zinc-800 text-zinc-400 font-mono text-[9px] rounded uppercase">
                      {activeStaffProfile?.role || "general"}
                    </span>
                  </div>
                  <h1 className="text-white text-2xl font-black uppercase mt-2">Lutho Floor Control</h1>
                  <p className="text-zinc-500 text-xs mt-1">
                    Decluttered workflow for manual order handling, bill requests, and table coverage.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                  <div className="rounded-2xl bg-black/50 border border-zinc-800 p-3">
                    <div className="text-zinc-500 text-[9px] uppercase font-mono">On shift</div>
                    <div className="text-white text-lg font-black">{staffProfiles.filter(profile => profile.onShift).length}</div>
                  </div>
                  <div className="rounded-2xl bg-black/50 border border-zinc-800 p-3">
                    <div className="text-zinc-500 text-[9px] uppercase font-mono">Tables assigned</div>
                    <div className="text-white text-lg font-black">{Object.keys(tableWaiterAssignments).length}</div>
                  </div>
                  <div className="rounded-2xl bg-black/50 border border-zinc-800 p-3">
                    <div className="text-zinc-500 text-[9px] uppercase font-mono">Bill requests</div>
                    <div className="text-white text-lg font-black">{serviceRequests.filter(request => request.type === "BILL" && request.status !== "DONE").length}</div>
                  </div>
                  <div className="rounded-2xl bg-black/50 border border-zinc-800 p-3">
                    <div className="text-zinc-500 text-[9px] uppercase font-mono">Waiter calls</div>
                    <div className="text-white text-lg font-black">{serviceRequests.filter(request => request.type === "WAITER" && request.status !== "DONE").length}</div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            )}

            <div className={`flex-1 min-h-0 overflow-y-auto ${staffWorkspace === "tables" ? "p-0" : "p-4 md:p-6 pt-4"}`}>
            {isAdminStaff && !onboardingDone && staffWorkspace !== "onboarding" && (
              <button
                onClick={() => setStaffWorkspace("onboarding")}
                className="w-full text-left mb-4 rounded-3xl border-2 border-[#3E5E93] bg-[#3E5E93]/10 p-4 flex items-center gap-4 hover:bg-[#3E5E93]/15 transition-colors"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#3E5E93] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black uppercase text-sm">Finish setting up your venue</p>
                  <p className="text-zinc-400 text-xs">
                    Answer a few questions to build your knowledge base, brand the app, and go live in minutes.
                  </p>
                </div>
                <span className="px-4 py-2 rounded-xl bg-[#3E5E93] font-black uppercase text-xs shrink-0 flex items-center gap-1.5">
                  Start <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            )}
            {staffWorkspace === "overview" && (
              <div className="grid xl:grid-cols-2 gap-4">
                <div className="xl:col-span-2 rounded-3xl border-2 border-[#3E5E93] bg-gradient-to-r from-black via-[#1C1C1E] to-black p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#3E5E93] text-black flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[#3E5E93] text-[10px] font-mono font-black uppercase tracking-widest">First training session</p>
                      <h3 className="text-white font-black uppercase text-base mt-0.5">Staff & Admin Training Manual</h3>
                      <p className="text-zinc-400 text-xs mt-1 max-w-xl">
                        Branded PDF with guest journey, floor ops, remote claim passes, bills, and 50 live scenarios. Download and share with the crew.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { void handleDownloadTrainingManual(); }}
                    className="px-5 py-3 rounded-2xl bg-[#3E5E93] text-black font-black uppercase text-xs flex items-center justify-center gap-2 shrink-0 hover:brightness-110 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
                <div className="xl:col-span-2 bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
                  <h3 className="text-white font-black uppercase text-sm mb-4">Next actions</h3>
                  <div className="space-y-3">
                    {serviceRequests.filter(request => request.status !== "DONE").slice(0, 5).map(request => (
                      <div key={request.id} className="rounded-2xl bg-black/50 border border-zinc-800 p-4">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-bold uppercase text-sm">{formatTableLabel(request.tableId)} • {request.type === "BILL" ? "Bill requested" : "Waiter requested"}</p>
                            <p className="text-zinc-500 text-xs mt-1">{request.assignedStaffName ? `Assigned to ${request.assignedStaffName}` : "Awaiting assignment"}</p>
                            {request.type === "BILL" ? (
                              <BillRequestSummary note={request.note} billDetails={request.billDetails} variant="staff" />
                            ) : (
                              <p className="text-zinc-400 text-xs mt-2">{request.note || "Guest requested waiter assistance at the table."}</p>
                            )}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={async () => {
                                await updateDoc(doc(db, "service_requests", request.id), { status: "ACKNOWLEDGED" });
                                triggerToast(`Request at ${formatTableLabel(request.tableId)} acknowledged.`, "success");
                              }}
                              className="px-3 py-2 rounded-xl bg-[#3E5E93] text-black text-xs font-black uppercase"
                            >
                              Acknowledge
                            </button>
                            <button
                              onClick={async () => {
                                await updateDoc(doc(db, "service_requests", request.id), { status: "DONE" });
                                triggerToast(`Request at ${formatTableLabel(request.tableId)} marked done.`, "success");
                              }}
                              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-black uppercase"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {serviceRequests.filter(request => request.status !== "DONE").length === 0 && (
                      <div className="rounded-2xl bg-black/30 border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
                        No active floor requests right now.
                      </div>
                    )}
                  </div>
                </div>

                <div className="xl:col-span-2 bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-white font-black uppercase text-sm">Floor coverage</h3>
                      <p className="text-[10px] text-zinc-500 mt-1 max-w-xl">
                        Live floor plan — assigned waiters pulse green with initials. Red = waiter call, orange = open orders, purple = bill.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { void handleResetTableAssignments(); }}
                      className="px-4 py-2.5 rounded-xl bg-black border border-[#3E5E93] text-[#3E5E93] text-[10px] font-black uppercase flex items-center justify-center gap-2 shrink-0 hover:bg-[#3E5E93] hover:text-black transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset table assignments
                    </button>
                  </div>
                  <StaffFloorBlueprint
                    selectedTableId={selectedStaffTable}
                    tablesState={tablesState}
                    tableWaiterAssignments={tableWaiterAssignments}
                    tableServices={tableServices}
                    tableNotifications={Object.fromEntries(
                      LUTHO_TABLES.map((t) => {
                        const service = tableServices[t.id]?.active ? tableServices[t.id] : null;
                        const reqs = serviceRequests.filter(
                          (r) =>
                            r.status !== "DONE" &&
                            (r.tableId === t.id ||
                              (!!service &&
                                (r.partyId === service.partyId ||
                                  service.memberTableIds.includes(String(r.tableId)))))
                        );
                        return [
                          t.id,
                          {
                            openOrders: sharedStaffOrders.filter(
                              (o) =>
                                o.status !== "Completed" &&
                                (o.tableId === t.id ||
                                  (!!service &&
                                    (o.partyId === service.partyId ||
                                      service.memberTableIds.includes(String(o.tableId)))))
                            ).length,
                            waiterCalls: reqs.filter((r) => r.type === "WAITER").length,
                            billRequests: reqs.filter((r) => r.type === "BILL").length,
                            hasAlert: !!tableAlerts[t.id]
                          }
                        ];
                      })
                    )}
                    onTableSelect={handleOpenStaffTable}
                  />
                </div>
              </div>
            )}

            {staffWorkspace === "orders" && (
              <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-white font-black uppercase text-sm">Live orders</h3>
                    <p className="text-[10px] text-zinc-500 mt-1 max-w-xl">
                      Copy a Pilot summary, punch lines into Pilot POS manually, then keep this ticket moving: Sent → Preparing → Ready → Served.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#3E5E93] uppercase">{sharedStaffOrders.length} synced</span>
                </div>
                <div className="space-y-3">
                  {sharedStaffOrders.length === 0 && (
                    <div className="rounded-2xl bg-black/30 border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
                      No orders have been submitted yet.
                    </div>
                  )}
                  {sharedStaffOrders.map(order => {
                    const needsStatusUpdate = order.status === "Sent" || order.status === "Preparing" || order.status === "Ready";
                    return (
                    <div
                      key={order.id}
                      className={`rounded-3xl bg-black/40 border border-zinc-800 p-4 ${order.status === "Completed" ? "opacity-50" : ""}`}
                      style={{ borderLeftWidth: 4, borderLeftColor: getStaffOrderColor(order.assignedStaffName) }}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <p className="text-white font-black uppercase">
                            {formatTableLabel(order.tableId)}
                            {order.orderedBy ? ` • ${order.orderedBy}` : ""} • {order.id}
                          </p>
                          <p className="text-zinc-500 text-xs mt-1">
                            {(order.isRemoteGroupOrder || String(order.tableId) === REMOTE_TABLE_ID) && (
                              <span className="text-[#3E5E93] font-bold uppercase">
                                {order.isRemoteGroupOrder ? "Remote split guest" : "Remote solo"}
                                {order.orderedBy ? ` • ${order.orderedBy}` : ""} •{" "}
                              </span>
                            )}
                            <span style={{ color: getStaffOrderColor(order.assignedStaffName) }}>{order.assignedStaffName || "Unassigned"}</span>
                            {" • "}{order.status} •{" "}
                            {order.status === "Completed" || order.status === "Paid" ? "PAID" : (order.paymentStatus || "UNPAID")}
                          </p>
                          {order.notes && <p className="text-amber-400 text-xs mt-2">Note: {order.notes}</p>}
                          {needsStatusUpdate && (
                            <p className="text-[10px] text-[#3E5E93] font-mono uppercase mt-2 tracking-wider">
                              Reminder: update status after you enter this into Pilot
                            </p>
                          )}
                        </div>
                        <div className="text-white font-black">R{order.total}</div>
                      </div>
                      <div className="mt-3 rounded-2xl bg-[#121212] border border-zinc-900 p-3 space-y-1">
                        {order.items?.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-xs text-zinc-300">
                            <span>{item.quantity} × {item.menuItem?.name}</span>
                            <span>R{(item.menuItem?.price || 0) * (item.quantity || 0)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyPilotSummary(order)}
                          className="px-3 py-2 rounded-xl text-xs font-black uppercase border bg-[#3E5E93]/15 border-[#3E5E93]/50 text-[#3E5E93]"
                        >
                          Pilot summary
                        </button>
                        {(["Sent", "Preparing", "Ready", "Served", "Paid", "Completed"] as HistoricOrder["status"][]).map(status => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => updateSharedOrderStatus(order.id, status)}
                            className={`px-3 py-2 rounded-xl text-xs font-black uppercase border ${
                              order.status === status
                                ? "bg-[#3E5E93] text-black border-[#3E5E93]"
                                : "bg-black/40 text-zinc-300 border-zinc-800 hover:text-white"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                        {needsStatusUpdate && (
                          <button
                            type="button"
                            onClick={() => updateSharedOrderStatus(order.id, "Served")}
                            className="px-3 py-2 rounded-xl text-xs font-black uppercase bg-[#3E5E93] text-black border border-[#3E5E93]"
                          >
                            Mark served
                          </button>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {staffWorkspace === "tables" && (
              <div className="min-h-full h-full flex flex-col bg-[#0b0b0c]">
                <div className="shrink-0 px-3 sm:px-4 py-2 sm:py-3 border-b border-zinc-900 flex flex-wrap items-center justify-between gap-2 bg-[#121212]">
                  <div>
                    <h3 className="text-white font-black uppercase text-sm">Floor layout</h3>
                    <p className="text-zinc-500 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest mt-0.5">
                      Tap a table for orders, chat, QR & management
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playBeep(600, "sine", 0.06);
                        setIsClaimScannerOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-[#3E5E93]/10 border border-[#3E5E93]/50 text-[#3E5E93] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#3E5E93] hover:text-black transition-colors"
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      Scan claim
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playBeep(523, "sine", 0.06);
                        openQrPrintSheet(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-[#3E5E93] text-black text-[10px] font-black uppercase tracking-wider"
                    >
                      Customize QRs
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playBeep(523, "sine", 0.06);
                        openQrPrintSheet(false);
                      }}
                      className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-black uppercase"
                    >
                      Print sheet
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-h-0 overflow-auto p-2 sm:p-4 md:p-6 flex items-center justify-center">
                  <StaffFloorBlueprint
                    selectedTableId={selectedStaffTable}
                    tablesState={tablesState}
                    tableWaiterAssignments={tableWaiterAssignments}
                    tableServices={tableServices}
                    tableNotifications={Object.fromEntries(
                      LUTHO_TABLES.map((t) => {
                        const service = tableServices[t.id]?.active ? tableServices[t.id] : null;
                        const reqs = serviceRequests.filter(
                          (r) =>
                            r.status !== "DONE" &&
                            (r.tableId === t.id ||
                              (!!service &&
                                (r.partyId === service.partyId ||
                                  service.memberTableIds.includes(String(r.tableId)))))
                        );
                        return [
                          t.id,
                          {
                            openOrders: sharedStaffOrders.filter(
                              (o) =>
                                o.status !== "Completed" &&
                                (o.tableId === t.id ||
                                  (!!service &&
                                    (o.partyId === service.partyId ||
                                      service.memberTableIds.includes(String(o.tableId)))))
                            ).length,
                            waiterCalls: reqs.filter((r) => r.type === "WAITER").length,
                            billRequests: reqs.filter((r) => r.type === "BILL").length,
                            hasAlert: !!tableAlerts[t.id]
                          }
                        ];
                      })
                    )}
                    onTableSelect={handleOpenStaffTable}
                  />
                </div>
              </div>
            )}

            {staffWorkspace === "requests" && (
              <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
                <h3 className="text-white font-black uppercase text-sm mb-4">Service requests</h3>
                <div className="space-y-3">
                  {serviceRequests.map(request => (
                    <div key={request.id} className="rounded-2xl bg-black/40 border border-zinc-800 p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-black uppercase">{formatTableLabel(request.tableId)} • {request.type === "BILL" ? "Bill requested" : "Waiter requested"}</p>
                        <p className="text-zinc-500 text-xs mt-1">{request.assignedStaffName || "No waiter assigned"} • {request.status}</p>
                        {request.type === "BILL" ? (
                          <BillRequestSummary note={request.note} billDetails={request.billDetails} variant="staff" />
                        ) : (
                          <p className="text-zinc-400 text-xs mt-2">{request.note || "No extra note"}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(["OPEN", "ACKNOWLEDGED", "DONE"] as ServiceRequestStatus[]).map(status => (
                          <button
                            key={status}
                            onClick={async () => {
                              await updateDoc(doc(db, "service_requests", request.id), { status });
                              triggerToast(`Request ${request.id} set to ${status}.`, "success");
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-black uppercase border ${
                              request.status === status
                                ? "bg-[#3E5E93] text-black border-[#3E5E93]"
                                : "bg-black/40 text-zinc-300 border-zinc-800"
                            }`}
                          >
                            {request.type === "BILL" && status === "DONE" ? "Mark Paid" : status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {serviceRequests.length === 0 && (
                    <div className="rounded-2xl bg-black/30 border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
                      No service requests yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {staffWorkspace === "team" && (
              <div className="grid xl:grid-cols-[1fr_1fr] gap-4">
                <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-black uppercase text-sm">Staff profiles</h3>
                    <span className="text-zinc-500 text-xs">{staffProfiles.length} total</span>
                  </div>
                  <div className="space-y-3">
                    {staffProfiles.map(profile => (
                      <div key={profile.id} className="rounded-2xl bg-black/40 border border-zinc-800 p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-white font-black uppercase">{profile.name}</p>
                          <p className="text-zinc-500 text-xs">{profile.role} • {profile.onShift ? "on shift" : "off shift"}</p>
                          <p className="text-[10px] text-[#3E5E93] font-mono uppercase mt-1">
                            {sittingsForWaiter(tableSittings, profile.name).length} tables served on record
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStaffShift(profile)}
                            className={`px-3 py-2 rounded-xl text-xs font-black uppercase ${
                              profile.onShift
                                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/20"
                                : "bg-zinc-900 text-zinc-300 border border-zinc-700"
                            }`}
                          >
                            {profile.onShift ? "Clock out" : "Clock in"}
                          </button>
                          {activeStaffProfile?.role === "admin" && profile.id !== "admin-root" && (
                            <button
                              onClick={() => handleDeleteStaffProfile(profile)}
                              className="px-3 py-2 rounded-xl text-xs font-black uppercase bg-red-950/40 text-red-300 border border-red-500/30"
                              title="Delete staff profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800">
                    <h3 className="text-white font-black uppercase text-sm mb-2">Admin tools</h3>
                    {activeStaffProfile?.role === "admin" ? (
                      <div className="space-y-3">
                        <input value={staffCreateName} onChange={(e) => setStaffCreateName(e.target.value)} placeholder="Staff name" className="w-full bg-[#121212] border border-zinc-800 rounded-xl px-3 py-3 text-white" />
                        <input value={staffCreatePin} onChange={(e) => setStaffCreatePin(e.target.value)} placeholder={`PIN (blank = default ${DEFAULT_STAFF_PIN})`} className="w-full bg-[#121212] border border-zinc-800 rounded-xl px-3 py-3 text-white" />
                        <p className="text-[10px] text-zinc-500 -mt-1">Leave PIN blank to auto-assign the default staff PIN ({DEFAULT_STAFF_PIN}). New staff must change it on first login.</p>
                        <select value={staffCreateRole} onChange={(e) => setStaffCreateRole(e.target.value as StaffRole)} className="w-full bg-[#121212] border border-zinc-800 rounded-xl px-3 py-3 text-white">
                          <option value="general">Regular staff</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button onClick={handleCreateStaffProfile} className="w-full px-3 py-3 rounded-2xl bg-[#3E5E93] text-black font-black uppercase">Create profile</button>
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-black/30 border border-dashed border-zinc-800 p-5 text-center text-zinc-500">
                        Only admin profiles can create new staff accounts.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div>
                      <h3 className="text-white font-black uppercase text-sm">Waiter service history</h3>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        Every cleared table sitting — guest tickets and items — stays on the waiter&apos;s record.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#3E5E93] uppercase shrink-0">{tableSittings.length} sittings</span>
                  </div>
                  <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                    {tableSittings.length === 0 && (
                      <div className="rounded-2xl bg-black/30 border border-dashed border-zinc-800 p-8 text-center text-zinc-500 text-sm">
                        No cleared sittings yet. Use <span className="text-[#3E5E93] font-bold">Clear table</span> on a table inspector when the party leaves.
                      </div>
                    )}
                    {tableSittings.map((sitting) => {
                      const open = expandedSittingId === sitting.id;
                      return (
                        <div key={sitting.id} className="rounded-2xl bg-black/40 border border-zinc-800 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setExpandedSittingId(open ? null : sitting.id)}
                            className="w-full text-left p-4 flex items-start justify-between gap-3"
                          >
                            <div>
                              <p className="text-white font-black uppercase text-sm">
                                {formatTableLabel(sitting.tableId)} • {sitting.waiterName}
                              </p>
                              <p className="text-zinc-500 text-[10px] font-mono uppercase mt-1">
                                {new Date(sitting.clearedAt).toLocaleString()} • {sitting.orderCount} order{sitting.orderCount === 1 ? "" : "s"} • {sitting.itemCount} items
                              </p>
                              {sitting.guestNames.length > 0 && (
                                <p className="text-[#3E5E93] text-[10px] uppercase font-bold mt-1">
                                  Guests: {sitting.guestNames.join(", ")}
                                </p>
                              )}
                            </div>
                            <span className="text-white font-black shrink-0">R{sitting.total}</span>
                          </button>
                          {open && (
                            <div className="px-4 pb-4 space-y-2 border-t border-zinc-900 pt-3">
                              {sitting.orders.map((order) => (
                                <div key={order.orderId} className="rounded-xl bg-[#121212] border border-zinc-900 p-3">
                                  <div className="flex justify-between gap-2 text-[10px] font-mono uppercase text-zinc-400">
                                    <span>{order.orderedBy ? `${order.orderedBy} • ` : ""}{order.orderId}</span>
                                    <span>R{order.total}</span>
                                  </div>
                                  <ul className="mt-2 space-y-1">
                                    {order.items.map((item, idx) => (
                                      <li key={`${order.orderId}-${idx}`} className="flex justify-between text-xs text-zinc-300">
                                        <span>{item.quantity}× {item.name}</span>
                                        <span>R{item.price * item.quantity}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  {order.notes && <p className="text-amber-400 text-[10px] mt-2">Note: {order.notes}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {staffWorkspace === "onboarding" && (
              isAdminStaff ? (
                <div className="max-w-3xl">
                  <OnboardingWizard
                    onToast={(m, t) => triggerToast(m, t)}
                    onComplete={() => setOnboardingDone(true)}
                  />
                </div>
              ) : (
                <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
                  <h3 className="text-white font-black uppercase text-sm mb-2">Admin only</h3>
                  <p className="text-zinc-400 text-sm">Business onboarding is restricted to admin profiles.</p>
                </div>
              )
            )}

            {staffWorkspace === "theme" && (
              isAdminStaff ? (
                <div className="max-w-2xl">
                  <ThemeStudio
                    palette={luthoPalette}
                    onChange={setLuthoPalette}
                    onToast={(m, t) => triggerToast(m, t)}
                  />
                </div>
              ) : (
                <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
                  <h3 className="text-white font-black uppercase text-sm mb-2">Admin only</h3>
                  <p className="text-zinc-400 text-sm">Theming is restricted to admin profiles.</p>
                </div>
              )
            )}

            {staffWorkspace === "menu" && (
              isAdminStaff ? (
                <div className="grid gap-4 xl:grid-cols-2 items-start">
                  <div className="max-w-none">
                    <MenuImporter
                      onToast={(m, t) => triggerToast(m, t)}
                      onImported={(items) => {
                        setImportedMenu(items);
                        setMenuItems(items);
                        try { localStorage.setItem("lutho_menu_items_v4", JSON.stringify(items)); } catch {}
                      }}
                    />
                  </div>
                  <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5 space-y-4">
                    <h3 className="text-white font-black uppercase text-sm">Menu & QR management</h3>
                    <p className="text-zinc-400 text-sm">
                      {importedMenu.length > 0
                        ? `${importedMenu.length} custom items are live from your import.`
                        : `Currently serving ${menuItems.length} seed items. Import above to replace them.`}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openQrPrintSheet(true)}
                        className="px-4 py-3 rounded-2xl bg-[#3E5E93] font-black uppercase text-xs"
                      >
                        Customize table QRs
                      </button>
                      <button
                        type="button"
                        onClick={() => openQrPrintSheet(false)}
                        className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-black uppercase text-xs"
                      >
                        Printable QR sheet
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5">
                  <h3 className="text-white font-black uppercase text-sm mb-2">Admin only</h3>
                  <p className="text-zinc-400 text-sm">
                    Menu maintenance is restricted to admin profiles.
                  </p>
                </div>
              )
            )}

            {staffWorkspace === "settings" && (
              <div className="grid xl:grid-cols-2 gap-4">
                <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5 space-y-4">
                  <h3 className="text-white font-black uppercase text-sm">Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => openQrPrintSheet(true)} className="px-4 py-3 rounded-2xl bg-[#3E5E93] text-black font-black uppercase text-xs">
                      Customize table QRs
                    </button>
                    <button type="button" onClick={() => openQrPrintSheet(false)} className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-black uppercase text-xs">
                      Print QR cards
                    </button>
                    <button
                      type="button"
                      onClick={() => { void handleDownloadTrainingManual(); }}
                      className="px-4 py-3 rounded-2xl bg-black border border-[#3E5E93] text-[#3E5E93] font-black uppercase text-xs flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Download training PDF
                    </button>
                  </div>
                  <h3 className="text-white font-black uppercase text-sm pt-2">Reset my PIN</h3>
                  <input value={staffResetCurrentPin} onChange={(e) => setStaffResetCurrentPin(e.target.value)} placeholder="Current PIN" className="w-full bg-[#121212] border border-zinc-800 rounded-xl px-3 py-3 text-white" />
                  <input value={staffResetNewPin} onChange={(e) => setStaffResetNewPin(e.target.value)} placeholder="New PIN" className="w-full bg-[#121212] border border-zinc-800 rounded-xl px-3 py-3 text-white" />
                  <button onClick={handleResetOwnPin} className="px-4 py-3 rounded-2xl bg-[#3E5E93] text-black font-black uppercase">Update PIN</button>
                </div>

                <div className="bg-[#1C1C1E] border border-zinc-800 rounded-3xl p-5 space-y-4">
                  <h3 className="text-white font-black uppercase text-sm">Training pack</h3>
                  <p className="text-sm text-zinc-400">
                    Export the full branded manual for your first training session — cover stamp logo, guest journey, staff loop, admin tools, and all 50 scenarios.
                  </p>
                  <button
                    type="button"
                    onClick={() => { void handleDownloadTrainingManual(); }}
                    className="w-full px-4 py-4 rounded-2xl bg-[#3E5E93] text-black font-black uppercase text-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download training manual (PDF)
                  </button>
                  <h3 className="text-white font-black uppercase text-sm pt-2">Go-live notes</h3>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li>- Orders are processed manually by staff.</li>
                    <li>- Guests can request the bill from the app.</li>
                    <li>- Staff can mark orders through Preparing, Ready, Served, Paid, and Completed.</li>
                    <li>- Waiters are assigned by least tables while clocked in.</li>
                  </ul>
                </div>
              </div>
            )}
            </div>
          </main>
        </div>

        {/* TABLE INSPECTOR MODAL */}
        <AnimatePresence>
          {selectedStaffTable !== null && appMode === "STAFF" && (() => {
            const tableId = selectedStaffTable;
            const tableService = getActiveTableService(tableId);
            const serviceMemberIds = tableService?.memberTableIds || [tableId];
            const primaryTableId = tableService?.primaryTableId || tableId;
            const tableStaffOrders = sharedStaffOrders.filter(
              (order) =>
                String(order.tableId) === String(primaryTableId) ||
                (!!tableService &&
                  (order.partyId === tableService.partyId ||
                    serviceMemberIds.includes(String(order.tableId))))
            );
            const tableActiveOrders = tableStaffOrders.filter((order) => order.status !== "Completed");
            const tableSittingsForTable = tableSittings.filter((s) => String(s.tableId) === String(tableId));
            const tableRequests = serviceRequests.filter(
              (request) =>
                request.status !== "DONE" &&
                (serviceMemberIds.includes(String(request.tableId)) ||
                  request.partyId === tableService?.partyId)
            );
            const tableChat = chatMessages.filter(m => String(m.tableId) === String(tableId));
            const hasAlert = tableId === currentTableId ? waiterSummoned : tableAlerts[tableId];
            const hasActiveOrders = tableStaffOrders.some(o => o.status === "Sent" || o.status === "Preparing" || o.status === "Ready");
            const splitGuests = Array.from(
              new Set(
                tableStaffOrders
                  .map((o) => o.orderedBy)
                  .filter((name): name is string => !!name)
              )
            );
            const isRemoteStaffTable = String(tableId) === REMOTE_TABLE_ID;
            const manualMenuMatches = menuItems
              .filter((item) => {
                const query = staffManualOrderSearch.trim().toLowerCase();
                return (
                  !query ||
                  item.name.toLowerCase().includes(query) ||
                  (item.description || "").toLowerCase().includes(query)
                );
              })
              .slice(0, 24);

            return (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }} onClick={() => setSelectedStaffTable(null)} className="fixed inset-0 bg-black/85 z-[120]" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  className="fixed inset-x-3 top-[4%] bottom-[4%] sm:inset-x-6 max-w-2xl mx-auto bg-white border-2 border-[#3E5E93] rounded-3xl z-[125] overflow-hidden flex flex-col shadow-2xl"
                >
                  <div className="p-4 bg-black border-b border-[#3E5E93] flex justify-between items-center gap-3">
                    <div>
                      <h3 className="font-display font-black text-[#3E5E93] text-lg uppercase">{formatTableLabel(tableId)}</h3>
                      <p className="text-[10px] font-mono text-white uppercase">
                        {tablesState[tableId] || "Available"} • {tableService?.assignedStaffName || tableWaiterAssignments[tableId] || "Unassigned"}
                        {tableService ? ` • ${tableService.covers || "?"} covers` : ""}
                        {serviceMemberIds.length > 1 ? ` • ${serviceMemberIds.length} tables combined` : ""}
                      </p>
                    </div>
                    <button type="button" onClick={() => setSelectedStaffTable(null)} className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white text-black">
                    {hasAlert && (
                      <div className="rounded-xl border border-red-300 bg-red-50 p-3 flex items-center justify-between gap-2">
                        <span className="text-red-700 text-xs font-black uppercase">Waiter requested</span>
                        <button type="button" onClick={() => handleResolveAlertForTable(tableId)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase">Resolve</button>
                      </div>
                    )}

                    {isRemoteStaffTable && (
                      <div className="rounded-xl border border-[#3E5E93] bg-[#3E5E93]/10 p-3">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#3E5E93] font-black">Remote / split prep</p>
                        <p className="text-xs text-black mt-1">
                          Guests may order solo or as a group. Check guest names on each ticket before you fire Pilot lines.
                        </p>
                        {splitGuests.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {splitGuests.map((guest) => (
                              <span key={guest} className="px-2 py-1 rounded-full bg-black text-[#3E5E93] text-[10px] font-black uppercase">
                                {guest}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-zinc-600 mt-2 italic">No named remote guests on open tickets yet.</p>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(["Available", "Occupied", "Booked"] as const).map(state => (
                        <button
                          key={state}
                          type="button"
                          onClick={() => setTablesState(prev => ({ ...prev, [tableId]: state }))}
                          className={`py-2 rounded-xl text-[10px] font-black uppercase border ${tablesState[tableId] === state ? "bg-[#3E5E93] text-black border-[#3E5E93]" : "bg-zinc-100 text-zinc-700 border-zinc-300"}`}
                        >
                          {state}
                        </button>
                      ))}
                      <button type="button" onClick={() => { handleCopyUrl(tableId); }} className="py-2 rounded-xl text-[10px] font-black uppercase bg-zinc-900 text-white">Copy link</button>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-600 font-black">Assigned waiter</label>
                      <select
                        value={tableService?.assignedStaffName || tableWaiterAssignments[tableId] || ""}
                        onChange={(e) => {
                          void handleAssignTableWithCovers(tableId, e.target.value);
                        }}
                        className="w-full mt-1 bg-white border border-zinc-300 rounded-xl px-3 py-2.5 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {staffProfiles.filter(p => p.onShift).map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </select>
                    </div>

                    {!isRemoteStaffTable && (
                      <div className={`rounded-xl border p-3 ${tableService?.covers ? "border-[#3E5E93]/50 bg-[#3E5E93]/10" : "border-red-300 bg-red-50"}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-widest font-black">
                              Workload covers
                            </p>
                            <p className="text-sm font-black mt-0.5">
                              {tableService?.covers
                                ? `${tableService.covers} guest${tableService.covers === 1 ? "" : "s"}`
                                : "Guest count required"}
                            </p>
                            <p className="text-[10px] text-zinc-600 mt-1">
                              Cover count, open tickets and bill requests determine who is offered the next table.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              void handleUpdateTableCovers(tableId);
                            }}
                            className="shrink-0 px-3 py-2 rounded-lg bg-[#3E5E93] text-black text-[10px] font-black uppercase"
                          >
                            {tableService?.covers ? "Edit covers" : "Set covers"}
                          </button>
                        </div>
                      </div>
                    )}

                    {!isRemoteStaffTable && (
                      <div className="rounded-xl border-2 border-black overflow-hidden">
                        <div className="bg-black text-white px-3 py-2 flex items-center justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-black uppercase text-[#3E5E93]">Waiter order</h4>
                            <p className="text-[9px] font-mono uppercase">For guests who have not scanned</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStaffManualOrderOpen((open) => !open)}
                            className="px-3 py-1.5 rounded-lg bg-[#3E5E93] text-black text-[10px] font-black uppercase"
                          >
                            {staffManualOrderOpen ? "Close" : "Add order"}
                          </button>
                        </div>
                        {staffManualOrderOpen && (
                          <div className="p-3 space-y-3 bg-white">
                            <input
                              value={staffManualOrderSearch}
                              onChange={(event) => setStaffManualOrderSearch(event.target.value)}
                              placeholder="Search food or drinks..."
                              className="w-full bg-white border border-zinc-300 focus:border-[#3E5E93] focus:ring-2 focus:ring-[#3E5E93]/30 rounded-xl px-3 py-2.5 text-sm text-black"
                            />
                            <div className="max-h-52 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {manualMenuMatches.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => handleAddManualOrderItem(item)}
                                  className="text-left rounded-lg border border-zinc-200 p-2 hover:border-[#3E5E93] transition-colors"
                                >
                                  <span className="block text-xs font-black">{item.name}</span>
                                  <span className="text-[10px] font-mono text-zinc-600">R{item.price.toFixed(2)} • Tap to add</span>
                                </button>
                              ))}
                            </div>
                            {staffManualOrderCart.length > 0 && (
                              <div className="rounded-xl bg-zinc-100 p-3 space-y-2">
                                {staffManualOrderCart.map((entry) => (
                                  <div key={entry.menuItem.id} className="flex items-center justify-between gap-2 text-xs">
                                    <span className="font-bold">{entry.quantity}× {entry.menuItem.name}</span>
                                    <div className="flex items-center gap-1">
                                      <button type="button" onClick={() => setStaffManualOrderCart((prev) => prev.map((item) => item.menuItem.id === entry.menuItem.id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item).filter((item) => item.quantity > 0))} className="w-7 h-7 rounded bg-white border border-zinc-300 font-black">−</button>
                                      <button type="button" onClick={() => handleAddManualOrderItem(entry.menuItem)} className="w-7 h-7 rounded bg-[#3E5E93] text-black font-black">+</button>
                                    </div>
                                  </div>
                                ))}
                                <textarea
                                  value={staffManualOrderNotes}
                                  onChange={(event) => setStaffManualOrderNotes(event.target.value)}
                                  placeholder="Kitchen notes or allergies..."
                                  className="w-full min-h-16 bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    void handleSubmitStaffManualOrder(tableId);
                                  }}
                                  className="w-full py-3 rounded-xl bg-[#3E5E93] text-black font-black uppercase text-xs"
                                >
                                  Send {staffManualOrderCart.reduce((sum, entry) => sum + entry.quantity, 0)} item(s) • R{staffManualOrderCart.reduce((sum, entry) => sum + entry.menuItem.price * entry.quantity, 0).toFixed(2)}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {!isRemoteStaffTable && (
                      <div className="rounded-xl border border-zinc-300 p-3 space-y-3">
                        <div>
                          <h4 className="font-black uppercase text-xs">Move this party</h4>
                          <p className="text-[10px] text-zinc-600">Moves orders, bill requests and waiter ownership to an empty table.</p>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={staffMoveTarget}
                            onChange={(event) => setStaffMoveTarget(event.target.value)}
                            className="flex-1 bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs"
                          >
                            <option value="">Choose empty table…</option>
                            {LUTHO_TABLES.filter(
                              (table) =>
                                table.id !== REMOTE_TABLE_ID &&
                                !serviceMemberIds.includes(table.id) &&
                                !getActiveTableService(table.id)
                            ).map((table) => (
                              <option key={table.id} value={table.id}>{formatTableLabel(table.id)}</option>
                            ))}
                          </select>
                          <button type="button" onClick={() => { void handleMoveCurrentTable(tableId); }} className="px-3 py-2 rounded-lg bg-black text-[#3E5E93] border border-[#3E5E93] text-[10px] font-black uppercase">Move</button>
                        </div>

                        <div className="border-t border-zinc-200 pt-3">
                          <h4 className="font-black uppercase text-xs">Combine physical tables</h4>
                          <p className="text-[10px] text-zinc-600 mb-2">
                            Tap tables on the floor plan to add them. Lead stays {formatTableLabel(tableId)}. Remote Ordering is excluded.
                          </p>
                          <StaffFloorBlueprint
                            mode="combine"
                            compact
                            hideRemote
                            selectedTableId={tableId}
                            multiSelectedIds={[
                              ...serviceMemberIds.filter((id) => id !== tableId),
                              ...staffCombineTables,
                            ]}
                            disabledTableIds={LUTHO_TABLES.filter((table) => {
                              if (table.id === REMOTE_TABLE_ID) return true;
                              if (serviceMemberIds.includes(table.id)) return false;
                              const other = getActiveTableService(table.id);
                              return !!other && other.partyId !== tableService?.partyId;
                            }).map((table) => table.id)}
                            tablesState={tablesState}
                            tableWaiterAssignments={tableWaiterAssignments}
                            tableServices={tableServices}
                            tableNotifications={Object.fromEntries(
                              LUTHO_TABLES.map((t) => [
                                t.id,
                                {
                                  openOrders: 0,
                                  waiterCalls: 0,
                                  billRequests: 0,
                                  hasAlert: false,
                                },
                              ])
                            )}
                            onTableSelect={(pickedId) => {
                              if (pickedId === tableId || pickedId === REMOTE_TABLE_ID) return;
                              if (serviceMemberIds.includes(pickedId)) return;
                              setStaffCombineTables((prev) =>
                                prev.includes(pickedId)
                                  ? prev.filter((id) => id !== pickedId)
                                  : [...prev, pickedId]
                              );
                            }}
                          />
                          {staffCombineTables.length > 0 && (
                            <p className="text-[10px] font-mono text-zinc-600 mt-2">
                              Combining: {formatTableShort(tableId)} + {staffCombineTables.map(formatTableShort).join(" + ")}
                            </p>
                          )}
                          <button type="button" onClick={() => { void handleCombineCurrentTables(tableId); }} className="w-full mt-2 py-2.5 rounded-lg bg-[#3E5E93] text-black text-[10px] font-black uppercase">
                            Combine {staffCombineTables.length + 1} tables
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="rounded-xl border border-zinc-200 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black uppercase text-xs text-[#3E5E93]">
                          Table chat {tableChat.length > 0 && `(${tableChat.length})`}
                        </h4>
                        <button type="button" onClick={() => setStaffInspectorChatOpen(v => !v)} className="text-[10px] font-mono uppercase text-zinc-600">{staffInspectorChatOpen ? "Hide" : "Show"}</button>
                      </div>
                      {staffInspectorChatOpen && (
                        <>
                          <div className="max-h-40 overflow-y-auto space-y-2 mb-2">
                            {tableChat.length === 0 ? <p className="text-xs text-zinc-500 italic">No messages yet.</p> : tableChat.map((msg, i) => (
                              <div key={msg.id || i} className={`text-xs p-2 rounded-lg ${msg.sender === "Staff" ? "bg-zinc-100" : "bg-[#3E5E93]/15"}`}>
                                <span className="font-mono text-[9px] uppercase text-zinc-500">{msg.sender}</span>
                                <p>{msg.text}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input value={staffChatInput} onChange={e => setStaffChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendStaffTableChat()} placeholder="Reply to table..." className="flex-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
                            <button type="button" onClick={handleSendStaffTableChat} className="px-3 py-2 bg-[#3E5E93] text-black font-black uppercase text-[10px] rounded-lg">Send</button>
                          </div>
                        </>
                      )}
                    </div>

                    {tableRequests.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-black uppercase text-xs">Open requests</h4>
                        {tableRequests.map(req => (
                          <div key={req.id} className="rounded-xl border border-zinc-200 p-3 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-xs font-bold uppercase">{req.type === "BILL" ? "Bill request" : "Waiter call"}</span>
                                {req.type === "BILL" ? (
                                  <BillRequestSummary note={req.note} billDetails={req.billDetails} variant="guest" />
                                ) : (
                                  <p className="text-[10px] text-zinc-600 mt-1">{req.note || "Guest needs assistance"}</p>
                                )}
                              </div>
                              <button type="button" onClick={async () => { await updateDoc(doc(db, "service_requests", req.id), { status: "DONE" }); triggerToast("Request closed.", "success"); }} className="px-2 py-1 bg-[#3E5E93] text-black rounded text-[10px] font-black uppercase shrink-0">Done</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black uppercase text-xs">Orders</h4>
                        <button
                          type="button"
                          onClick={() => {
                            setTableHistoryTableId(tableId);
                            setIsTableHistoryOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-900 text-white text-[9px] font-black uppercase flex items-center gap-1"
                        >
                          <History className="w-3 h-3" />
                          Table history{tableSittingsForTable.length > 0 ? ` (${tableSittingsForTable.length})` : ""}
                        </button>
                      </div>
                      <p className="text-[10px] text-zinc-600 mb-2">
                        Enter each Pilot summary into Pilot POS, then tap Mark served when the ticket is delivered. When the party leaves, tap <span className="font-black text-black">Clear table</span> to archive the sitting on the waiter&apos;s record and free the table.
                      </p>
                      {tableActiveOrders.length === 0 ? <p className="text-xs text-zinc-500 italic">No active orders for this table.</p> : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {tableActiveOrders.map((ord) => {
                            const active = ord.status === "Sent" || ord.status === "Preparing" || ord.status === "Ready";
                            return (
                              <div key={ord.id} className="rounded-xl border border-zinc-200 p-3 text-xs space-y-2">
                                <div className="flex justify-between font-black uppercase gap-2">
                                  <span>{ord.orderedBy ? `${ord.orderedBy} • ` : ""}#{ord.id}</span>
                                  <span>{ord.status}</span>
                                </div>
                                <p className="text-zinc-600">{ord.items?.map((it) => `${it.quantity}x ${it.menuItem?.name}`).join(", ")}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  <button type="button" onClick={() => handleCopyPilotSummary(ord)} className="px-2 py-1 rounded-lg bg-zinc-900 text-white text-[9px] font-black uppercase">Pilot summary</button>
                                  {active && (
                                    <button type="button" onClick={() => updateSharedOrderStatus(ord.id, "Served")} className="px-2 py-1 rounded-lg bg-[#3E5E93] text-black text-[9px] font-black uppercase">Mark served</button>
                                  )}
                                  <button type="button" onClick={() => updateSharedOrderStatus(ord.id, "Preparing")} className="px-2 py-1 rounded-lg border border-zinc-300 text-[9px] font-black uppercase">Preparing</button>
                                  <button type="button" onClick={() => updateSharedOrderStatus(ord.id, "Ready")} className="px-2 py-1 rounded-lg border border-zinc-300 text-[9px] font-black uppercase">Ready</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center py-2">
                      <HalftoneQRCode
                        text={getSecureGuestUrl(tableId)}
                        size={120}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-wrap gap-2">
                    {hasActiveOrders && (
                      <button type="button" onClick={() => { void handleMarkAllServedForTable(tableId); }} className="flex-1 py-3 bg-[#3E5E93] text-black font-black uppercase text-xs rounded-xl">Mark all served</button>
                    )}
                    <button
                      type="button"
                      onClick={() => { void handleClearTableForNewParty(tableId); }}
                      className="flex-1 py-3 bg-black text-[#3E5E93] border border-[#3E5E93] font-black uppercase text-xs rounded-xl"
                    >
                      Clear table
                    </button>
                    <button type="button" onClick={() => { setCurrentTableId(tableId); setAppMode("CUSTOMER"); setSelectedStaffTable(null); }} className="flex-1 py-3 bg-zinc-900 text-white font-black uppercase text-xs rounded-xl">Guest view</button>
                    <button type="button" onClick={() => setSelectedStaffTable(null)} className="flex-1 py-3 border border-zinc-300 text-zinc-700 font-black uppercase text-xs rounded-xl">Close</button>
                  </div>
                </motion.div>
              </>
            );
          })()}
        </AnimatePresence>

        {/* TABLE HISTORY MODAL — cleared sittings for a specific table */}
        <AnimatePresence>
          {isTableHistoryOpen && tableHistoryTableId !== null && (() => {
            const tableId = tableHistoryTableId;
            const records = tableSittings
              .filter((s) => String(s.tableId) === String(tableId))
              .sort((a, b) => b.clearedAt - a.clearedAt);
            return (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsTableHistoryOpen(false)}
                  className="fixed inset-0 bg-black/85 z-[160]"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  className="fixed inset-x-3 top-[6%] bottom-[6%] sm:inset-x-6 max-w-2xl mx-auto bg-white border-2 border-[#3E5E93] rounded-3xl z-[165] overflow-hidden flex flex-col shadow-2xl"
                >
                  <div className="p-4 bg-black border-b border-[#3E5E93] flex justify-between items-center gap-3">
                    <div>
                      <h3 className="font-display font-black text-[#3E5E93] text-lg uppercase">
                        {formatTableLabel(tableId)} history
                      </h3>
                      <p className="text-[10px] font-mono text-white uppercase">{records.length} cleared sitting{records.length === 1 ? "" : "s"}</p>
                    </div>
                    <button type="button" onClick={() => setIsTableHistoryOpen(false)} className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white text-black">
                    {records.length === 0 && (
                      <p className="text-sm text-zinc-500 italic text-center py-8">No cleared sittings recorded for this table yet.</p>
                    )}
                    {records.map((record) => (
                      <div key={record.id} className="rounded-xl border border-zinc-200 p-3 space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-black uppercase text-xs">{record.waiterName}</p>
                            <p className="text-[10px] text-zinc-500 font-mono">
                              {new Date(record.clearedAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="font-black text-sm">R{record.total}</p>
                        </div>
                        {record.guestNames.length > 0 && (
                          <p className="text-[10px] text-zinc-600">Guests: {record.guestNames.join(", ")}</p>
                        )}
                        <p className="text-[10px] text-zinc-600">{record.orderCount} order(s) • {record.itemCount} item(s)</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            );
          })()}
        </AnimatePresence>

        {/* CLAIM CODE SCANNER MODAL */}
        <ClaimCodeScannerModal
          open={isClaimScannerOpen}
          onClose={() => setIsClaimScannerOpen(false)}
          onResolved={({ orderId, claimCode }) => {
            void (async () => {
              const code = String(claimCode || "").trim();
              const candidateOrders = sharedStaffOrders.filter(
                (order) =>
                  String(order.tableId) === REMOTE_TABLE_ID &&
                  order.status !== "Completed" &&
                  order.status !== "Paid"
              );

              const match = orderId
                ? candidateOrders.find((order) => order.id === orderId) ||
                  candidateOrders.find((order) => String(order.claimCode) === code)
                : candidateOrders.find((order) => String(order.claimCode) === code);

              if (!match) {
                playBeep(180, "sawtooth", 0.25);
                triggerToast(
                  code
                    ? `No open remote order for claim ${code}. Ask guest to re-open their pass.`
                    : "Invalid or expired claim code.",
                  "info"
                );
                setIsClaimScannerOpen(false);
                return;
              }

              const nextStatus: HistoricOrder["status"] =
                match.status === "Ready" || match.status === "Preparing" || match.status === "Sent"
                  ? "Served"
                  : match.status === "Served"
                    ? "Served"
                    : "Ready";

              try {
                await updateSharedOrderStatus(match.id, nextStatus);
                await updateDoc(doc(db, "staff_orders", match.id), {
                  claimVerifiedAt: Date.now(),
                  status: nextStatus,
                  updatedAt: Date.now(),
                });
                // Optimistic local sync so Orders / Floor update immediately on this device
                setSharedStaffOrders((prev) =>
                  prev.map((order) =>
                    order.id === match.id
                      ? { ...order, status: nextStatus, claimVerifiedAt: Date.now(), updatedAt: Date.now() }
                      : order
                  )
                );
                playBeep(660, "sine", 0.1);
                triggerToast(
                  `Claim ${match.claimCode || code} verified • ${match.orderedBy || "guest"} • ${nextStatus}`,
                  "success"
                );
                setIsClaimScannerOpen(false);
                setStaffWorkspace("orders");
                setHighlightKitchenOrders(true);
                setTimeout(() => setHighlightKitchenOrders(false), 4000);
              } catch (error) {
                console.error("[LUTHO] Claim verification failed:", error);
                triggerToast("Could not update order after claim scan. Try again.", "info");
                setIsClaimScannerOpen(false);
              }
            })();
          }}
        />

        {/* PASS FORMAT CHOICE MODAL — shown right after sending a remote order */}
        <AnimatePresence>
          {passDownloadPrompt && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                exit={{ opacity: 0 }}
                onClick={() => setPassDownloadPrompt(null)}
                className="fixed inset-0 bg-black/85 z-[9970]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-white border-2 border-[#3E5E93] rounded-3xl z-[9975] overflow-hidden shadow-2xl"
              >
                <div className="p-4 bg-black border-b border-[#3E5E93] flex justify-between items-center gap-3">
                  <div>
                    <h3 className="font-display font-black text-[#3E5E93] uppercase text-sm">Claim pass ready</h3>
                    {passDownloadPrompt.claimCode && (
                      <p className="text-[10px] font-mono text-white uppercase mt-1">Claim code {passDownloadPrompt.claimCode}</p>
                    )}
                  </div>
                  <button type="button" onClick={() => setPassDownloadPrompt(null)} className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-xs text-zinc-600">
                    Choose PDF or PNG. Your PDF pass is already downloading — find your passes again anytime under Active Kitchen Orders.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await downloadOrderPassPdf(passDownloadPrompt);
                        setPendingPassFormat("pdf");
                      }}
                      className="flex-1 py-3 rounded-xl bg-[#3E5E93] text-black font-black uppercase text-xs"
                    >
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await downloadOrderPassPng(passDownloadPrompt);
                        setPendingPassFormat("png");
                      }}
                      className="flex-1 py-3 rounded-xl bg-black text-white font-black uppercase text-xs"
                    >
                      Download PNG
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPassDownloadPrompt(null)}
                    className="w-full py-2.5 rounded-xl border border-zinc-300 text-zinc-600 font-black uppercase text-xs"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* CUSTOM QR MANAGEMENT MODAL — merged into printable QR sheet */}

    {showQrPrintSheet && createPortal(
    <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          id="lutho-print-sheet-root"
          className="fixed inset-0 bg-white text-black z-[99999] overflow-y-auto font-sans p-6 print-container"
        >
          {/* Print Control Bar - Hidden during window.print() */}
          <div className="no-print bg-zinc-950 p-4 rounded-2xl border border-zinc-900 text-white flex flex-col md:flex-row justify-between items-center gap-4 mb-8 max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-center gap-2.5">
              <Printer className="w-5 h-5 text-[#3E5E93]" />
              <div>
                <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#3E5E93]">
                  🖨️ Printable Table QR Code Cards Builder
                </h4>
                <p className="text-[9px] font-mono text-zinc-550 uppercase mt-0.5">
                  Prints standard Lutho Table Labels cleanly!
                </p>
              </div>
            </div>

            {/* High Fidelity Card Theme Toggles requested by user */}
            <div className="flex items-center gap-2 bg-black/45 border border-zinc-900 px-3 py-1.5 rounded-xl">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mr-1">Theme:</span>
              {(["ORANGE", "DARK", "MINIMAL"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setQrPrintTheme(t);
                    playBeep(450 + 40 * ["ORANGE", "DARK", "MINIMAL"].indexOf(t), "sine", 0.05);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[9px] font-mono uppercase font-black tracking-wider transition-all border ${
                    qrPrintTheme === t
                      ? "bg-[#3E5E93] text-black border-[#3E5E93] shadow"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setQrCustomizeOpen((open) => !open);
                  playBeep(480, "sine", 0.05);
                }}
                className={`px-4 py-2 font-mono text-xs font-black uppercase rounded-lg tracking-wider cursor-pointer border ${
                  qrCustomizeOpen
                    ? "bg-[#3E5E93] text-black border-[#3E5E93]"
                    : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
                }`}
              >
                Customize QRs
              </button>
              <button
                onClick={() => {
                  playBeep(523, "sine", 0.08);
                  window.setTimeout(() => window.print(), 400);
                }}
                className="px-4 py-2 bg-[#3E5E93] hover:bg-orange-400 text-black font-mono text-xs font-black uppercase rounded-lg tracking-wider cursor-pointer shadow-md"
              >
                Print Cards Sheet
              </button>
              <button
                onClick={() => {
                  playBeep(330, "triangle", 0.05);
                  setShowQrPrintSheet(false);
                  setQrCustomizeOpen(false);
                }}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs font-bold uppercase rounded-lg cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>

          {qrCustomizeOpen && (
            <div className="no-print max-w-4xl mx-auto mb-8 rounded-2xl border-2 border-[#3E5E93] bg-[#1C1C1E] text-white overflow-hidden">
              <div className="p-4 bg-black border-b border-[#3E5E93] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-[#3E5E93] font-black uppercase text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4" /> Upload printed QR images
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase mt-1">
                    Paste each table&apos;s slug into your QR maker, export the image, then upload it here so print cards use your finished code
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="px-3 py-2 bg-[#3E5E93] text-black text-[10px] font-black uppercase rounded-lg cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    Batch upload QR
                    <input type="file" accept="image/*" className="hidden" onChange={handleBatchQrUpload} />
                  </label>
                  <button type="button" onClick={handleRestoreAllQrs} className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-black uppercase rounded-lg">
                    Restore all defaults
                  </button>
                </div>
              </div>
              <div className="p-4 grid gap-3 sm:grid-cols-2">
                {LUTHO_TABLES.map((table) => {
                  const tableId = table.id;
                  const hasCustom = !!customQrs[tableId];
                  return (
                    <div key={tableId} className="rounded-xl border border-zinc-800 bg-black/50 p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-white font-black uppercase text-sm">{formatTableLabel(tableId)}</p>
                          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                            {hasCustom ? "Uploaded QR image" : "System QR (with center art)"}
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-lg border border-zinc-800 bg-white flex items-center justify-center overflow-hidden shrink-0">
                          {hasCustom ? (
                            <img src={customQrs[tableId]} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <HalftoneQRCode
                              text={getSecureGuestUrl(tableId)}
                              size={52}
                              colorDark="#3E5E93"
                              colorLight="#FFFFFF"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button type="button" onClick={() => handleCopySlug(tableId)} className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-black uppercase text-zinc-300 rounded-md">
                          Copy slug
                        </button>
                        <button type="button" onClick={() => handleCopyUrl(tableId)} className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-black uppercase text-zinc-300 rounded-md">
                          Copy link
                        </button>
                        <label className="px-2 py-1 bg-[#3E5E93] text-black text-[9px] font-black uppercase rounded-md cursor-pointer">
                          Upload QR
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleQrUpload(tableId, e)} />
                        </label>
                        {hasCustom && (
                          <button type="button" onClick={() => handleClearTableQr(tableId)} className="px-2 py-1 bg-red-950/40 border border-red-500/30 text-[9px] font-black uppercase text-red-300 rounded-md">
                            Reset
                          </button>
                        )}
                      </div>
                      <p className="text-[9px] text-zinc-600 font-mono break-all">slug: table={tableId}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Printable sheet container structure */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 print-grid">
            {LUTHO_TABLES.map((table) => {
              const tableId = table.id;
              const guestUrl = getSecureGuestUrl(tableId);
              const hasCustom = !!customQrs[tableId];
              const config = tableSecurityConfigs[tableId] || generateDefaultConfig(tableId);
              const tablePin = config.pin;

              const isDarkTheme = qrPrintTheme === "DARK";
              const isMinimalTheme = qrPrintTheme === "MINIMAL";
              const isOrangeTheme = qrPrintTheme === "ORANGE";

              return (
                <div 
                  key={tableId}
                  className={`p-6 rounded-3xl flex flex-col items-center justify-between text-center min-h-[360px] print-card shadow-lg relative overflow-hidden border-4 transition-all duration-300 ${
                    isDarkTheme 
                      ? "bg-zinc-950 text-white border-zinc-900 shadow-xl" 
                      : isMinimalTheme 
                        ? "bg-white text-black border-black/80" 
                        : "bg-white text-zinc-900 border-[#3E5E93] hover:shadow-xl"
                  }`}
                >
                  {/* Geometric Texture Layer Backdrop matching main page feel */}
                  <div 
                    className="absolute inset-0 pointer-events-none select-none transition-all duration-300"
                    style={{
                      opacity: isDarkTheme ? 0.08 : isOrangeTheme ? 0.12 : 0.05,
                      backgroundImage: isDarkTheme 
                        ? `repeating-linear-gradient(45deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 10px)`
                        : isOrangeTheme
                          ? `repeating-linear-gradient(45deg, #3E5E93 0px, #3E5E93 1.5px, transparent 1.5px, transparent 12px), repeating-linear-gradient(-45deg, #3E5E93 0px, #3E5E93 1.5px, transparent 1.5px, transparent 12px)`
                          : `repeating-linear-gradient(45deg, #000000 0px, #000000 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, #000000 0px, #000000 1px, transparent 1px, transparent 10px)`,
                      zIndex: 1
                    }}
                  />

                  {/* Decorative top strip */}
                  <div className={`absolute top-0 inset-x-0 h-3 z-10 ${isDarkTheme ? "bg-zinc-900" : isMinimalTheme ? "bg-black" : "bg-[#3E5E93]"}`} />
                  
                  {/* Lutho Combined Brand Logo - Larger and transparent background */}
                  <div className="flex flex-col items-center justify-center relative z-10 mb-3 mt-4">
                    <img 
                      src={LUTHO_BRAND_LOGO_URL}
                      alt="Lutho Brand Logo"
                      className="h-14 w-auto object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.2)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Header Branding */}
                  <div className="space-y-1 relative z-10">
                    <span className={`font-mono text-[8.5px] font-black uppercase tracking-widest block ${isDarkTheme ? "text-zinc-550" : "text-zinc-450"}`}>
                      LUTHO • DIGITAL ORDERING
                    </span>
                    
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <h2 className={`font-display font-extrabold text-3xl uppercase leading-none tracking-tighter ${
                        isDarkTheme ? "text-[#3E5E93]" : isMinimalTheme ? "text-black" : "text-[#3E5E93]"
                      }`}>
                        {tableId === REMOTE_TABLE_ID ? "REMOTE ORDERING" : `TABLE ${tableId.padStart(2, "0")}`}
                      </h2>
                    </div>

                    <span className={`font-mono text-[8.5px] uppercase font-black tracking-widest border px-3 py-1 rounded-full mt-2 inline-block ${
                      isDarkTheme 
                        ? "bg-zinc-900 border-zinc-805 text-zinc-400" 
                        : isMinimalTheme 
                          ? "bg-zinc-50 border-zinc-200 text-zinc-700" 
                          : "bg-orange-50/50 border-orange-100 text-[#3E5E93]"
                    }`}>
                      {tableId === REMOTE_TABLE_ID
                        ? "Scan • order • claim at the counter"
                        : `${table.type} surface • Max ${table.capacity} pax`}
                    </span>
                  </div>

                  {/* Large scan target */}
                  <div className={`w-[180px] h-[180px] border-4 flex items-center justify-center p-2.5 rounded-2xl shadow-inner my-4 transition-colors relative z-10 ${
                    isDarkTheme ? "bg-black border-zinc-900" : "bg-white border-zinc-900/10"
                  }`}>
                    {hasCustom ? (
                      <img 
                        src={customQrs[tableId]} 
                        alt={`Table ${tableId} QR`}
                        className="w-[160px] h-[160px] object-contain rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <HalftoneQRCode 
                        text={guestUrl}
                        size={160}
                        colorDark={isMinimalTheme ? "#000000" : "#3E5E93"}
                        colorLight={isDarkTheme ? "#050505" : "#FFFFFF"}
                      />
                    )}
                  </div>

                  <div className={`w-9 h-9 rounded-full flex items-center justify-center p-1.5 border-2 shadow-sm shrink-0 transition-all duration-300 relative z-10 mb-4 ${
                    isDarkTheme 
                      ? "bg-zinc-900 border-zinc-800" 
                      : isMinimalTheme 
                        ? "bg-white border-black" 
                        : "bg-white border-[#3E5E93]"
                  }`}>
                    <img 
                      src={LUTHO_BRAND_LOGO_URL}
                      alt="Lutho"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Instructions */}
                  <div className="space-y-1 relative z-10 flex flex-col items-center">
                    <h4 className={`font-bold text-xs uppercase tracking-wider ${isDarkTheme ? "text-zinc-200" : "text-black"}`}>
                      SCAN FOR LIVE BILL & DIGITAL ORDER
                    </h4>
                    <p className={`text-[10px] max-w-[280px] leading-relaxed font-sans ${isDarkTheme ? "text-zinc-450" : "text-zinc-650"} mb-1`}>
                      No waiter wait. Point your cell phone camera to order burgers, split your bill, and pay instantly!
                    </p>

                    {/* Visually prominent table PIN badge */}
                    <div className={`mt-2.5 px-3.5 py-1 rounded-xl border font-mono text-[10px] uppercase font-black tracking-wider inline-flex items-center gap-1.5 shadow-xs ${
                      isDarkTheme 
                        ? "bg-zinc-900 border-zinc-800 text-[#3E5E93]" 
                        : isMinimalTheme 
                          ? "bg-zinc-100 border-zinc-300 text-black" 
                          : "bg-orange-50/80 border-orange-200 text-[#3E5E93]"
                    }`}>
                      🔐 TABLE PIN: <span className="text-xs font-extrabold tracking-widest">{tablePin}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Print Mode CSS styles */}
          <style>{`
            .qr-canvas-print {
              display: none;
            }
            @media print {
              @page {
                size: auto;
                margin: 10mm !important;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              html, body, #root {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                width: 100% !important;
                height: auto !important;
                min-height: auto !important;
                overflow: visible !important;
              }
              body > *:not(#lutho-print-sheet-root) {
                display: none !important;
              }
              #lutho-print-sheet-root {
                display: block !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: auto !important;
                min-height: auto !important;
                padding: 0 !important;
                margin: 0 !important;
                background: white !important;
                overflow: visible !important;
                transform: none !important;
                opacity: 1 !important;
                z-index: 1 !important;
              }
              .no-print {
                display: none !important;
              }
              .qr-canvas-screen {
                display: none !important;
              }
              .qr-center-logo-screen {
                display: none !important;
              }
              .qr-canvas-print {
                display: block !important;
                position: relative !important;
              }
              .print-grid {
                display: grid !important;
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 20px !important;
                width: 100% !important;
              }
              .print-card {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                box-shadow: none !important;
                margin-bottom: 25px !important;
              }
              .print-card.bg-zinc-950 {
                background-color: #09090b !important;
                color: #ffffff !important;
                border-color: #27272a !important;
              }
              .print-card.bg-white {
                background-color: #ffffff !important;
                color: #18181b !important;
              }
            }
          `}</style>
        </motion.div>
    </AnimatePresence>,
    document.body
    )}
        </>
      )}
      </div>
    </>
  );
}
