import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { db, auth } from "./firebase";
import { doc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
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
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThuneeFullscreenApp } from "./components/ThuneeFullscreenApp";
import { HalftoneQRCode } from "./components/HalftoneQRCode";
import { MenuItem, CartItem, HistoricOrder, MasterBillItem } from "./types";
import { MENU_ITEMS, SPECIALS } from "./data";

export interface TableConfig {
  id: string;
  name: string;
  type: "booth" | "round" | "small";
  capacity: number;
  orientation?: "vertical" | "horizontal";
  row: number;
  col: number;
}

export const ROCO_TABLES: TableConfig[] = [
  // Top row of tables (Row 2): 3 booths (vertical)
  { id: "1", name: "Booth 1", type: "booth", capacity: 6, orientation: "vertical", row: 2, col: 2 },
  { id: "2", name: "Booth 2", type: "booth", capacity: 6, orientation: "vertical", row: 2, col: 3 },
  { id: "3", name: "Booth 3", type: "booth", capacity: 6, orientation: "vertical", row: 2, col: 4 }, // Entrance nearby

  // Second row of tables (Row 3): 3 small tables (type small, capacity 4 - renders as diamond)
  { id: "9", name: "Small Table 1", type: "small", capacity: 4, row: 3, col: 2 },
  { id: "10", name: "Small Table 2", type: "small", capacity: 4, row: 3, col: 3 },
  { id: "11", name: "Small Table 3", type: "small", capacity: 4, row: 3, col: 4 },

  // Third row of tables (Row 4):
  // Left of divider: Booth 4 (horizontal 6)
  { id: "4", name: "Booth 4", type: "booth", capacity: 6, orientation: "horizontal", row: 4, col: 1 },
  // Right of divider: Round Table 1 (round 6) at col 2, Small Table 4 (diamond 4) at col 3, Small Table 5 (diamond 4) at col 4
  { id: "8", name: "Round Table 1", type: "round", capacity: 6, row: 4, col: 2 },
  { id: "12", name: "Small Table 4", type: "small", capacity: 4, row: 4, col: 3 },
  { id: "13", name: "Small Table 5", type: "small", capacity: 4, row: 4, col: 4 },

  // Fourth row of tables (Row 5):
  // Left of divider: Booth 5 (horizontal 6)
  { id: "5", name: "Booth 5", type: "booth", capacity: 6, orientation: "horizontal", row: 5, col: 1 },
  // Right of divider: Booth 6 and Booth 7 (vertical 6)
  { id: "6", name: "Booth 6", type: "booth", capacity: 6, orientation: "vertical", row: 5, col: 2 },
  { id: "7", name: "Booth 7", type: "booth", capacity: 6, orientation: "vertical", row: 5, col: 3 },
];

function SplashKeywords({ playBeep, onComplete }: { playBeep: any, onComplete: () => void }) {
  const words = [
    "INITIALIZING SYSTEM... ⏳",
    "ESTABLISHING TABLE WIRELESS IP 🌐",
    "SYNCING THABO ON-DUTY FEEDS 👨‍🍳",
    "BREWING COLD SAVANNAS & CASTLES 🍺",
    "ENTERING INTENSE MULTIPLAYER LOBBY 🎮",
    "SYNCING DINER REWARDS CARD 🎫",
    "ACTIVATING SECURE BILL SPLITTER 🧮",
    "ROCOMAMAS GUEST OS ONLINE 🔥"
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
          // Play a rapid diagnostic tiny beep
          playBeep(440 + prev * 65, "sine", 0.03);
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
  const [theme, setTheme] = useState<"DARK" | "LIGHT" | "ORANGE">(() => {
    try {
      const saved = localStorage.getItem("roco_theme");
      return (saved === "DARK" || saved === "LIGHT" || saved === "ORANGE") ? saved : "DARK";
    } catch {
      return "DARK";
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("roco_cart");
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
      const saved = localStorage.getItem("roco_specials_v4");
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
    return localStorage.getItem("roco_applied_coupon_code") || null;
  });
  const [couponApplied, setCouponApplied] = useState(() => {
    return localStorage.getItem("roco_coupon_applied") === "true";
  });

  // QR modal state
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Custom QR override states
  const [isCustomQrPanelOpen, setIsCustomQrPanelOpen] = useState(false);
  const [customQrs, setCustomQrs] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("roco_custom_qrs");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Automatically persist custom QR codes when updated
  useEffect(() => {
    localStorage.setItem("roco_custom_qrs", JSON.stringify(customQrs));
  }, [customQrs]);

  const [showQrPrintSheet, setShowQrPrintSheet] = useState(false);
  const [pastedUrls, setPastedUrls] = useState<Record<string, string>>({});
  const [qrPrintTheme, setQrPrintTheme] = useState<"ORANGE" | "DARK" | "MINIMAL" | "LIGHT">("ORANGE");

  // Synchronize pasted URL inputs when customQrs loads
  useEffect(() => {
    const urls: Record<string, string> = {};
    Object.keys(customQrs).forEach((key) => {
      if (customQrs[key] && !customQrs[key].startsWith("data:")) {
        urls[key] = customQrs[key];
      }
    });
    setPastedUrls(urls);
  }, [customQrs]);

  // Helper: Copy dynamic full URL for a table
  const handleCopyUrl = (tableId: string) => {
    let secureToken = "";
    try {
      const saved = localStorage.getItem("roco_tables_security_configs");
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
      secureToken = `roco-sec-t${tableId.padStart(2, "0")}-${pin}f8c2b5`;
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

  // Helper: Handle file upload for custom QR code
  const handleQrUpload = (tableId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        if (base64Data) {
          setCustomQrs((prev) => ({
            ...prev,
            [tableId]: base64Data,
          }));
          triggerToast(`Custom QR for Table ${tableId} saved! 🎨`, "success");
          playBeep(600, "sine", 0.08);
        }
      };
      reader.readAsDataURL(file);
    }
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
    return "12";
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
      return !isNaN(idNum) && idNum >= 1 && idNum <= 13;
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
      return localStorage.getItem("roco_admin_unlocked") === "true";
    } catch {
      return false;
    }
  });

  const [adminPinInput, setAdminPinInput] = useState<string>("");

  // --- Waiter Dashboard / Staff View States ---
  const [appMode, setAppMode] = useState<"CUSTOMER" | "STAFF">(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("table")) {
        return "CUSTOMER";
      }
      const saved = localStorage.getItem("roco_app_mode");
      const unlocked = localStorage.getItem("roco_admin_unlocked") === "true";
      if (saved === "STAFF" && unlocked) {
        return "STAFF";
      }
      return "CUSTOMER";
    } catch {
      return "CUSTOMER";
    }
  });

  // Track URL change to dynamically synchronize table mapping
  useEffect(() => {
    const syncTableId = () => {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get("table");
      if (tableParam) {
        const cleanId = tableParam.replace(/\D/g, "");
        setCurrentTableId(cleanId || tableParam);
        // Scanning a table QR code should always return Customer View, never staff view
        setAppMode("CUSTOMER");
      } else {
        // Raw domain
        const unlocked = localStorage.getItem("roco_admin_unlocked") === "true";
        if (unlocked) {
          setAppMode("STAFF");
          setIsAdminUnlocked(true);
        } else {
          setAppMode("CUSTOMER");
          setIsAdminUnlocked(false);
        }
      }
    };
    window.addEventListener("popstate", syncTableId);
    
    // Also periodically poll for URL search parameter change (if changed in simulation)
    const interval = setInterval(syncTableId, 1000);
    return () => {
      window.removeEventListener("popstate", syncTableId);
      clearInterval(interval);
    };
  }, []);

  // Automatically mark table as Occupied when scanned/accessed in Customer View
  useEffect(() => {
    if (appMode === "CUSTOMER" && currentTableId) {
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

  // --- Ultimate RocoMamas Booking, Games, Table Occupancy, Chat States ---
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
  const [bookingTime, setBookingTime] = useState("18:30");
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingTableId, setBookingTableId] = useState<string | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingOccasion, setBookingOccasion] = useState("Just Vibes");
  const [bookingSpecialRequests, setBookingSpecialRequests] = useState("");
  const [bookingStep, setBookingStep] = useState(1);

  // Booking list
  const [bookings, setBookings] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("roco_bookings");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 1-15 tables state: "Available" | "Occupied" | "Booked" | "Pending Cleanup"
  const [tablesState, setTablesState] = useState<Record<string, "Available" | "Occupied" | "Booked" | "Pending Cleanup">>(() => {
    try {
      const saved = localStorage.getItem("roco_tables_occupancy");
      if (saved) return JSON.parse(saved);
    } catch {}
    const defaults: Record<string, "Available" | "Occupied" | "Booked" | "Pending Cleanup"> = {};
    for (let i = 1; i <= 13; i++) {
      defaults[String(i)] = "Available";
    }
    return defaults;
  });

  // Table chat messages lobby
  const [chatMessages, setChatMessages] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("roco_chat_messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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
  const [selectedPosSystem, setSelectedPosSystem] = useState<string>(() => {
    return localStorage.getItem("roco_pos_selected") || "PILOT";
  });
  const [posSettings, setPosSettings] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem("roco_pos_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      PILOT: {
        apiUrl: "https://api.pilotpos.co.za/v1",
        storeCode: "PIL-7281-RM",
        apiKey: "pk_plt_8271a8f96b281bf011",
        channelId: "ROCO-GUEST-APP-SWG",
        tableMappingType: "DYNAMIC_NUMERIC",
        bufferTimeout: "3000"
      },
      GAAP: {
        gatewayUrl: "https://gaapcloud.net/integrator/api/v2",
        siteId: "GAAP-ROCO-DURBAN-SOUTH",
        clientSecret: "sc_gp_91823eb21a",
        webhookUrl: "https://api.rocomamas.com/webhooks/gaap",
        diningOptionCode: "10"
      },
      TOAST: {
        clientId: "toast_client_roco_app",
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
        simphonyUrl: "https://simphony.rocomamas.co.za:8080/api",
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
        customUrl: "https://api.rocomamas-franchise.net/orders/v1",
        bearerToken: "Bearer roco_franchise_9921_sec",
        signingSecret: "wh_sign_9821aa8716cc"
      }
    };
  });
  const [isPosConnecting, setIsPosConnecting] = useState(false);
  const [isPosConnected, setIsPosConnected] = useState(() => {
    return localStorage.getItem("roco_pos_connected") === "true";
  });
  const [posConnectionLogs, setPosConnectionLogs] = useState<string[]>([]);

  // Track known booking IDs to detect and popup newly booked ones
  const [knownBookingIds, setKnownBookingIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("roco_bookings");
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

  // Lock body scroll when modals/control center is active
  useEffect(() => {
    const isModalOpen = isControlMenuOpen || isCustomQrPanelOpen || isBookingModalOpen || isGamesModalOpen || !!selectedDetailItem || showQrPrintSheet || isQrModalOpen || isPosConfigOpen;
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isControlMenuOpen, isCustomQrPanelOpen, isBookingModalOpen, isGamesModalOpen, selectedDetailItem, showQrPrintSheet, isQrModalOpen, isPosConfigOpen]);

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
      const saved = localStorage.getItem("roco_stamps");
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Track the history of submitted orders to mimic real "connected" RocoMamas OS
  const [historicOrders, setHistoricOrders] = useState<HistoricOrder[]>(() => {
    try {
      const saved = localStorage.getItem("roco_orders");
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

  // Dynamic state-based Menu Items list for the Live Menu manager & favorites
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem("roco_menu_items_v4");
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
      const saved = localStorage.getItem("roco_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic game selection tabs & multi-game states
  const [activeGameTab, setActiveGameTab] = useState<"DRINKING" | "ARCADE" | "CHALLENGES">("DRINKING");
  
  // Roco Burger Catcher Game states
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
      const saved = localStorage.getItem("roco_user_profile");
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
    return Number(localStorage.getItem("roco_defuser_highscore") || "120");
  });
  const [defuserLeaderboard, setDefuserLeaderboard] = useState<{ name: string; score: number; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem("roco_defuser_leaderboard");
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

  // --- ROCO CREW ACADEMY, SHIFT ROSTERING & TIMERS STATES ---
  const [waitersList, setWaitersList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("roco_waiters_list");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { name: "Roco Crew (Grill Champion)", onShift: true, progress: 100, completedModules: ["efficiency", "timers", "thunee"], history: [
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
    return localStorage.getItem("roco_active_waiter_profile") || "Zoe (Shake Master)";
  });

  const [staffRegistrationName, setStaffRegistrationName] = useState("");

  const [tableWaiterAssignments, setTableWaiterAssignments] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("roco_table_assignments");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      "10": "Roco Crew (Grill Champion)",
      "11": "Lerato (Floor Lead)",
      "14": "Roco Crew (Grill Champion)"
    };
  });

  const [academyActiveModule, setAcademyActiveModule] = useState<string>("efficiency");
  const [academyQuizSelectedAns, setAcademyQuizSelectedAns] = useState<number | null>(null);
  const [academyQuizResult, setAcademyQuizResult] = useState<"pass" | "fail" | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("roco_waiters_list", JSON.stringify(waitersList));
  }, [waitersList]);

  useEffect(() => {
    localStorage.setItem("roco_table_assignments", JSON.stringify(tableWaiterAssignments));
  }, [tableWaiterAssignments]);

  useEffect(() => {
    localStorage.setItem("roco_active_waiter_profile", activeWaiterProfileName);
  }, [activeWaiterProfileName]);

  const [currentPlayerName, setCurrentPlayerName] = useState<string>(() => {
    const cached = localStorage.getItem("roco_current_player_name") || sessionStorage.getItem("roco_my_session_name");
    if (cached) return cached;
    const rNum = Math.floor(100 + Math.random() * 900);
    const names = ["ROCKER", "BURGER", "CHIP", "THUNEE", "SPARK", "GRILL", "SHAKER", "SUNDAE", "WINGER"];
    const randomName = `GUEST_${names[Math.floor(Math.random() * names.length)]}_${rNum}`;
    localStorage.setItem("roco_current_player_name", randomName);
    sessionStorage.setItem("roco_my_session_name", randomName);
    return randomName;
  });

  // Challenges stopwatch states
  const [activeStopwatchChallenge, setActiveStopwatchChallenge] = useState<string | null>(null);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [challengesLeaderboard, setChallengesLeaderboard] = useState<{ name: string; table: string; challenge: string; duration: string; rank: number }[]>(() => {
    try {
      const saved = localStorage.getItem("roco_leaderboard");
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
    localStorage.setItem("roco_menu_items_v4", JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem("roco_favorites", JSON.stringify(favoritedIds));
  }, [favoritedIds]);

  useEffect(() => {
    localStorage.setItem("roco_leaderboard", JSON.stringify(challengesLeaderboard));
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
                  triggerToast("💀 Capsized! Smashed by Bad Vibes. Game Over!", "info");
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
        { emoji: "🥩", isBad: false },
        { emoji: "🧀", isBad: false },
        { emoji: "🥓", isBad: false },
        { emoji: "🥬", isBad: false },
        { emoji: "💀", isBad: true },
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
                  localStorage.setItem("roco_defuser_highscore", defuserScore.toString());
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
      localStorage.setItem("roco_thunee_room_" + currentTableId, JSON.stringify(stateObj));
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
    localStorage.setItem("roco_current_player_name", newName);
    sessionStorage.setItem("roco_my_session_name", newName);

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
        statusText: "💀 MATCH OVER! Opponent team swept the board. Retake the griddle next time!"
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
      thuneeSeats[thuneeCurrentTurnIndex].startsWith("🧑‍🍳") ||
      thuneeSeats[thuneeCurrentTurnIndex].startsWith("⚔️") ||
      thuneeSeats[thuneeCurrentTurnIndex].startsWith("🍗")
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
    const hasVisited = localStorage.getItem("roco_has_visited");
    if (!hasVisited) {
      // Delay so it triggers elegantly right as the splash screen completes
      const timer = setTimeout(() => {
        setIsHelpOpen(true);
        localStorage.setItem("roco_has_visited", "true");
      }, 3400);
      return () => clearTimeout(timer);
    }
  }, []);

  // --- Sync storage ---
  useEffect(() => {
    localStorage.setItem("roco_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("roco_stamps", stamps.toString());
  }, [stamps]);

  useEffect(() => {
    localStorage.setItem("roco_orders", JSON.stringify(historicOrders));
  }, [historicOrders]);

  useEffect(() => {
    localStorage.setItem("roco_specials_v4", JSON.stringify(specials));
  }, [specials]);

  useEffect(() => {
    localStorage.setItem("roco_coupon_applied", couponApplied.toString());
  }, [couponApplied]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem("roco_applied_coupon_code", couponCode);
    } else {
      localStorage.removeItem("roco_applied_coupon_code");
    }
  }, [couponCode]);

  // Table overall active bill (master bill items, containing what's ordered on table so far)
  const [masterBillItems, setMasterBillItems] = useState<MasterBillItem[]>(() => {
    try {
      const saved = localStorage.getItem("roco_master_bill");
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
  const [sessionMembers, setSessionMembers] = useState<string[]>(["You"]);

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
  
  // Payment progress tracking
  const [paymentScreenStep, setPaymentScreenStep] = useState<"SELECT" | "PAYING" | "SUCCESS">("SELECT");
  const [activePaymentProgressTotal, setActivePaymentProgressTotal] = useState<number>(0);
  const [activePaymentProgressTip, setActivePaymentProgressTip] = useState<number>(0);
  const [processingMessage, setProcessingMessage] = useState<string>("");

  const [tableAlerts, setTableAlerts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("roco_table_alerts");
      return saved ? JSON.parse(saved) : { "10": false, "11": false, "12": false, "14": true };
    } catch {
      return { "10": false, "11": false, "12": false, "14": true };
    }
  });

  const [incomingOrders, setIncomingOrders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("roco_incoming_orders");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Keep records of orders for other tables
  const [otherTablesOrders, setOtherTablesOrders] = useState<Record<string, any[]>>(() => {
    try {
      const saved = localStorage.getItem("roco_other_tables_orders");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [selectedStaffTable, setSelectedStaffTable] = useState<string | null>(null);
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
    const secureToken = `roco-sec-t${tableId.padStart(2, "0")}-${pin}f8c2b5`;
    return {
      tableId,
      pin,
      secureToken,
      rotatedAt: Date.now()
    };
  };

  const [tableSecurityConfigs, setTableSecurityConfigs] = useState<Record<string, { tableId: string; pin: string; secureToken: string; rotatedAt: number }>>(() => {
    try {
      const saved = localStorage.getItem("roco_tables_security_configs");
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

      const activeTable = localStorage.getItem("roco_active_customer_table");
      const urlToken = params.get("token");
      const urlPin = params.get("pin");

      // Get table security configuration synchronously
      let configsSaved: Record<string, any> = {};
      try {
        const saved = localStorage.getItem("roco_tables_security_configs");
        if (saved) configsSaved = JSON.parse(saved);
      } catch {}

      const pins: Record<string, string> = {
        "1": "1394", "2": "2485", "3": "3571", "4": "4619", "5": "5728",
        "6": "6837", "7": "7942", "8": "8051", "9": "9163", "10": "5084",
        "11": "2195", "12": "1294", "13": "3141", "14": "4529", "15": "5670"
      };
      const pin = pins[tableId] || "1294";
      const defaultToken = `roco-sec-t${tableId.padStart(2, "0")}-${pin}f8c2b5`;
      const config = configsSaved[tableId] || {
        tableId,
        pin,
        secureToken: defaultToken
      };

      // Direct URL Token/Pin scans update the active customer table and bypass lock
      if (urlToken && urlToken === config.secureToken) {
        localStorage.setItem("roco_active_customer_table", tableId);
        return true;
      }
      if (urlPin && urlPin === config.pin) {
        localStorage.setItem("roco_active_customer_table", tableId);
        return true;
      }

      // Guest can only access this table if it matches their currently active unlocked table
      if (activeTable === tableId) {
        let unlockedRegistry: Record<string, string> = {};
        try {
          const saved = localStorage.getItem("roco_unlocked_table_tokens");
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
      const saved = localStorage.getItem("roco_security_audit_logs");
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
      localStorage.setItem("roco_security_audit_logs", JSON.stringify(updated));
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

    let unlockedRegistry: Record<string, string> = {};
    try {
      const saved = localStorage.getItem("roco_unlocked_table_tokens");
      if (saved) unlockedRegistry = JSON.parse(saved);
    } catch {}

    const savedToken = unlockedRegistry[currentTableId];
    const activeTable = localStorage.getItem("roco_active_customer_table");

    if (urlToken && urlToken === config.secureToken) {
      unlockedRegistry[currentTableId] = config.secureToken;
      localStorage.setItem("roco_unlocked_table_tokens", JSON.stringify(unlockedRegistry));
      localStorage.setItem("roco_active_customer_table", currentTableId);
      document.cookie = `roco_session_${currentTableId}=${config.secureToken}; max-age=86400; path=/; SameSite=Strict; Secure`;
      setIsTableUnlocked(true);
      setSecurityAttempts(0);
    } else if (urlPin && urlPin === config.pin) {
      unlockedRegistry[currentTableId] = config.secureToken;
      localStorage.setItem("roco_unlocked_table_tokens", JSON.stringify(unlockedRegistry));
      localStorage.setItem("roco_active_customer_table", currentTableId);
      document.cookie = `roco_session_${currentTableId}=${config.secureToken}; max-age=86400; path=/; SameSite=Strict; Secure`;
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

    const config = tableSecurityConfigs[currentTableId] || generateDefaultConfig(currentTableId);
    if (enteredPin === config.pin) {
      playBeep(750, "sine", 0.08);
      
      const updatedRegistry: Record<string, string> = {};
      try {
        const saved = localStorage.getItem("roco_unlocked_table_tokens");
        if (saved) Object.assign(updatedRegistry, JSON.parse(saved));
      } catch {}
      
      updatedRegistry[currentTableId] = config.secureToken;
      localStorage.setItem("roco_unlocked_table_tokens", JSON.stringify(updatedRegistry));
      localStorage.setItem("roco_active_customer_table", currentTableId);
      document.cookie = `roco_session_${currentTableId}=${config.secureToken}; max-age=86400; path=/; SameSite=Strict; Secure`;
      
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
    const newSecureToken = `roco-sec-t${tableId.padStart(2, "0")}-${randomHex}`;
    
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
      localStorage.setItem("roco_tables_security_configs", JSON.stringify(updated));
      return updated;
    });

    logSecurityEvent("ROTATED", `Rotated credentials for Table ${tableId}. Old session keys invalidated.`, tableId);
    
    try {
      const saved = localStorage.getItem("roco_unlocked_table_tokens");
      if (saved) {
        const registry = JSON.parse(saved);
        delete registry[tableId];
        localStorage.setItem("roco_unlocked_table_tokens", JSON.stringify(registry));
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
      
      // Haptics play alert chime
      playBeep(587.33, "sine", 0.12);
      setTimeout(() => playBeep(698.46, "sine", 0.12), 150);

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
    localStorage.setItem("roco_app_mode", appMode);
  }, [appMode]);

  useEffect(() => {
    localStorage.setItem("roco_table_alerts", JSON.stringify(tableAlerts));
  }, [tableAlerts]);

  useEffect(() => {
    localStorage.setItem("roco_incoming_orders", JSON.stringify(incomingOrders));
  }, [incomingOrders]);

  useEffect(() => {
    localStorage.setItem("roco_other_tables_orders", JSON.stringify(otherTablesOrders));
  }, [otherTablesOrders]);

  // --- AUTOMATED ROTATING TABLE WAITER ASSIGNMENT ON QR SCAN ---
  useEffect(() => {
    if (currentTableId) {
      setTableWaiterAssignments(prev => {
        if (!prev[currentTableId]) {
          const onShiftWaiters = waitersList.filter(w => w.onShift).map(w => w.name);
          if (onShiftWaiters.length > 0) {
            const counts = onShiftWaiters.reduce((acc, name) => {
              acc[name] = Object.values(prev).filter(v => v === name).length;
              return acc;
            }, {} as Record<string, number>);
            const sorted = onShiftWaiters.sort((a, b) => counts[a] - counts[b]);
            const assigned = sorted[0];

            setTimeout(() => {
              triggerToast(`🛎️ Table ${currentTableId} Scanned! Waiter assigned: ${assigned} ⚡`, "success");
              playBeep(659.25, "sine", 0.1);
            }, 1000);

            return {
              ...prev,
              [currentTableId]: assigned
            };
          }
        }
        return prev;
      });
    }
  }, [currentTableId, waitersList]);

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
    localStorage.setItem("roco_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem("roco_user_profile", JSON.stringify(userProfile));
    } else {
      localStorage.removeItem("roco_user_profile");
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("roco_tables_occupancy", JSON.stringify(tablesState));
  }, [tablesState]);

  useEffect(() => {
    localStorage.setItem("roco_chat_messages", JSON.stringify(chatMessages));
  }, [chatMessages]);

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
              new Notification("Roco OS: Booking Alert!", {
                body: warningMsg,
                icon: "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Roco-ALERT"
              });
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    }
  }, [appMode, bookings, tablesState]);

  // Dynamic table-scoped master bill initialization and synchronization
  useEffect(() => {
    // Generate an authentic Roco nickname for this browser tab session if not exists
    if (!sessionStorage.getItem("roco_my_session_name")) {
      const rockPrefixes = ["Smash", "Roco", "Burger", "Supa", "Wing", "Chilli", "Cheeze", "Waffle", "Grill", "Spice"];
      const rockSuffixes = ["Rocker", "Crew", "Wizard", "Boss", "Beast", "Star", "Bandit", "Ninja", "Champs", "Rider"];
      const randPref = rockPrefixes[Math.floor(Math.random() * rockPrefixes.length)];
      const randSuff = rockSuffixes[Math.floor(Math.random() * rockSuffixes.length)];
      const randNum = Math.floor(10 + Math.random() * 90);
      const generatedName = `${randPref}${randSuff}_${randNum}`;
      sessionStorage.setItem("roco_my_session_name", generatedName);
    }

    const myName = sessionStorage.getItem("roco_my_session_name") || "You";

    // 1. Sync master bill from table storage
    try {
      const savedBill = localStorage.getItem("roco_master_bill_" + currentTableId);
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

    // 2. Sync sessionMembers from table storage & ensure current tab user is in it
    try {
      const savedMembersStr = localStorage.getItem("roco_session_members_" + currentTableId);
      let currentMembers: string[] = [];
      if (savedMembersStr) {
        currentMembers = JSON.parse(savedMembersStr);
      }
      
      let nextMembers = currentMembers.map(m => m === "You" ? myName : m);
      if (!nextMembers.includes(myName)) {
        nextMembers.push(myName);
      }
      // Remove any initial raw "You" handles to keep names highly literal
      nextMembers = nextMembers.filter(m => m !== "You" || m === myName);
      
      setSessionMembers(nextMembers);
      localStorage.setItem("roco_session_members_" + currentTableId, JSON.stringify(nextMembers));
    } catch {
      setSessionMembers([myName]);
    }
  }, [currentTableId]);

  // Persist master bill when modified
  useEffect(() => {
    if (currentTableId) {
      localStorage.setItem("roco_master_bill_" + currentTableId, JSON.stringify(masterBillItems));
    }
  }, [masterBillItems, currentTableId]);

  // Persist session members when modified
  useEffect(() => {
    if (currentTableId) {
      localStorage.setItem("roco_session_members_" + currentTableId, JSON.stringify(sessionMembers));
    }
  }, [sessionMembers, currentTableId]);

  // Listen for storage events to synchronize master bill/sessions live across all tabs!
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "roco_master_bill_" + currentTableId) {
        try {
          if (e.newValue) {
            setMasterBillItems(JSON.parse(e.newValue));
          }
        } catch {}
      }
      if (e.key === "roco_session_members_" + currentTableId) {
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
        const saved = localStorage.getItem("roco_thunee_room_" + currentTableId);
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
  const playBeep = (freq = 440, type: OscillatorType = "sine", duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext blocks without initial interaction, ignore
    }
  };

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

  // --- Call Waiter ---
  const handleCallWaiter = () => {
    setWaiterSummoned(true);
    setTableAlerts(prev => ({ ...prev, [currentTableId]: true }));
    triggerToast("Roco Crew has been notified. He'll be right there.", "info");
    // Pulse animation of waiter icon can stay highlighted.
    setTimeout(() => {
      setWaiterSummoned(false);
      setTableAlerts(prev => ({ ...prev, [currentTableId]: false }));
    }, 45000); // kept at 45 seconds for convenient testing
  };

  // --- Staff View Handler methods ---
  const handleMarkAllServedForTable = (tableId: string) => {
    playBeep(587.33, "sine", 0.08); // D5
    setTimeout(() => playBeep(698.46, "sine", 0.12), 65); // F5

    if (tableId === currentTableId) {
      setHistoricOrders(prev => {
        const next = prev.map(o => {
          if (o.status === "Sent" || o.status === "Preparing") {
            return { ...o, status: "Served" as const };
          }
          return o;
        });
        return next;
      });
    } else {
      setOtherTablesOrders(prev => {
        const currentOrders = prev[tableId] || [];
        const nextOrders = currentOrders.map(o => {
          if (o.status === "Sent" || o.status === "Preparing") {
            return { ...o, status: "Served" };
          }
          return o;
        });
        return {
          ...prev,
          [tableId]: nextOrders
        };
      });
    }

    triggerToast(`Served all pending orders to Table ${tableId}! 🍔🍻`, "success");
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
    const assignedWaiter = tableWaiterAssignments[order.tableId] || "Zoe (Shake Master)";
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
    setTableAlerts(prev => ({
      ...prev,
      [tableId]: false
    }));
    if (tableId === currentTableId) {
      setWaiterSummoned(false);
    }
    triggerToast(`Table ${tableId} alert has been marked as resolved!`, "success");
  };

  const handleEndShift = () => {
    playBeep(220, "sawtooth", 0.15);
    setTimeout(() => playBeep(180, "sawtooth", 0.2), 120);

    setAppMode("CUSTOMER");
    setIsAdminUnlocked(false);
    localStorage.removeItem("roco_admin_unlocked");
    triggerToast("Shift successfully ended. Stand down, Roco Crew!", "info");
  };

  // --- Add to Cart ---
  const handleAddToCart = (item: MenuItem) => {
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

  // --- Send Order To Kitchen ---
  const handleSendOrder = () => {
    if (cart.length === 0) {
      triggerToast("Your basket is empty!", "info");
      return;
    }

    // Complexity-based Timer Calculation in seconds
    let maxPrepSeconds = 30; // default base prep
    cart.forEach(it => {
      const name = (it.menuItem?.name || "").toLowerCase();
      const cat = (it.menuItem?.category || "").toLowerCase();
      if (name.includes("combo") || name.includes("wings") || name.includes("ribs") || (it.menuItem?.price || 0) >= 100) {
        maxPrepSeconds = Math.max(maxPrepSeconds, 60);
      } else if (name.includes("burger") || cat === "eat") {
        maxPrepSeconds = Math.max(maxPrepSeconds, 45);
      } else {
        maxPrepSeconds = Math.max(maxPrepSeconds, 30);
      }
    });

    // Add historic orders
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

    // Push order into Waiter's Dashboard Live Queue in real-time
    const liveIncomingOrderForStaff = {
      id: newOrder.id,
      timestamp: newOrder.timestamp,
      createdAt: newOrder.createdAt,
      items: newOrder.items.map(item => ({
        menuItem: item.menuItem,
        quantity: item.quantity
      })),
      total: newOrder.total,
      status: "Sent",
      tableId: currentTableId || "12",
      notes: newOrder.notes,
      timerDuration: maxPrepSeconds,
      timerRemaining: maxPrepSeconds,
      timerExpired: false
    };
    setIncomingOrders(prev => [liveIncomingOrderForStaff, ...prev]);

    // Update Stamps: user earns stamp for each item ordered (maximum capped at 10)
    let addedStampsCount = cartTotalItems;
    let oldStamps = stamps;
    let newStampsVal = oldStamps + addedStampsCount;
    
    // Check for free drink reward activation
    if (newStampsVal >= 10) {
      newStampsVal = newStampsVal % 10;
      setTimeout(() => {
        triggerToast("🎉 LOYALTY UNLOCKED: Free Savanna or Windhoek Draft! Tell Roco Crew!", "stamp");
      }, 1500);
    } else {
      setTimeout(() => {
        triggerToast(`Earned ${addedStampsCount} gold stamps on this order!`, "stamp");
      }, 1500);
    }
    
    setStamps(newStampsVal);
    
    // Roll the ordered items directly to Table 12 Master Bill
    setMasterBillItems(prev => {
      const updated = [...prev];
      cart.forEach(c => {
        // Try to find a matching named item in the master bill where paid count is not yet fully met
        const index = updated.findIndex(m => m.name === c.menuItem.name && m.paidCount < m.quantity);
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            quantity: updated[index].quantity + c.quantity
          };
        } else {
          updated.push({
            id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            name: c.menuItem.name,
            price: c.menuItem.price,
            emoji: c.menuItem.emoji,
            quantity: c.quantity,
            paidCount: 0
          });
        }
      });
      return updated;
    });

    setCart([]);
    setOrderNotes("");
    setIsCartOpen(false);
    setHighlightKitchenOrders(true);
    setTimeout(() => {
      setHighlightKitchenOrders(false);
    }, 4500);

    triggerToast("Order sent! Roco Crew will bring your drinks/food shortly.", "success");

    // Fast-mock status upgrade timers
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

  // Simulate another table member joining the session in active state
  const handleSimulateJoin = () => {
    const defaultPool = ["Sarah", "Liam", "Mandla", "Sophia", "Zola", "Nico", "Chloe"];
    // find a name from pool not currently in sessionMembers
    const availableName = defaultPool.find(name => !sessionMembers.includes(name));
    if (!availableName) {
      triggerToast("Your whole table group has already joined!", "info");
      return;
    }
    
    // Play double high happy chime
    playBeep(523.25, "sine", 0.08); // C5
    setTimeout(() => playBeep(659.25, "sine", 0.1), 60); // E5
    setTimeout(() => playBeep(783.99, "sine", 0.12), 120); // G5

    setSessionMembers(prev => {
      const next = [...prev, availableName];
      setSplitCount(next.length); // auto-apply equal split count 
      return next;
    });

    triggerToast(`🎉 ${availableName} joined split session for Table ${currentTableId}!`, "success");
  };

  // Reset/Clear master bill items of any dummy elements to ensure strictly live order splits
  const handleResetBillToDemo = () => {
    playBeep(330, "sine", 0.1);
    setMasterBillItems([]);
    setItemSharesToPay({});
    setCustomAmountInput("");
    setSessionMembers(["You"]);
    setSplitCount(1);
    triggerToast(`Table ${currentTableId} live bill and group members resettled to start fresh!`, "info");
  };

  // Export full table tab outstanding receipt
  const handleExportFullReceipt = () => {
    playBeep(480, "sine", 0.08);
    const divider = "------------------------------------------\n";
    const header = `🍻 RocoMamas (TABLE ${currentTableId}) 🍻\n` +
                   "      INDUSTRIAL TABLE ORDERING\n" +
                   `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n` +
                   "Server Staff: Roco Crew (Live OS)\n" +
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
                   "   Powered by RocoMamas Guest OS\n";

    const fullText = header + itemsBody + footer;

    try {
      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Roco_Table12_MasterReceipt_${Date.now().toString().slice(-6)}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      
      navigator.clipboard.writeText(fullText);
      triggerToast("📄 Master Receipt downloaded & copied to clipboard!", "success");
    } catch (e) {
      triggerToast("Failed to download receipt.", "info");
    }
  };

  // Export payment success receipt
  const handleExportPaymentReceipt = () => {
    playBeep(520, "sine", 0.08);
    const divider = "------------------------------------------\n";
    const header = "🍻 RocoMamas (TABLE 12) 🍻\n" +
                   "      SECURE PAYMENT RECEIPT\n" +
                   `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n` +
                   "Ref: #STFY-" + Date.now().toString().slice(-6) + "\n" +
                   divider;

    const body = `Paid Amount:                R${activePaymentProgressTotal.toFixed(2)}\n` +
                 `Gratuity to Roco Crew:          R${activePaymentProgressTip.toFixed(2)}\n`;
    const finalTotal = activePaymentProgressTotal + activePaymentProgressTip;
    const footer = divider +
                   `TOTAL CHARGED AMOUNT:       R${finalTotal.toFixed(2)}\n` +
                   "==========================================\n" +
                   "   Payment Authorized & Settled! 🚀\n" +
                   "  Keep rockin' Roco Crew sends high-fives!\n";

    const fullText = header + body + footer;

    try {
      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Roco_Table12_PaymentReceipt_${Date.now().toString().slice(-6)}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      
      navigator.clipboard.writeText(fullText);
      triggerToast("📄 Payment receipt downloaded & copied!", "success");
    } catch (e) {
      triggerToast("Failed to download payment receipt.", "info");
    }
  };

  // Click handler to open bill screen
  const handleRequestBill = () => {
    playBeep(440, "sine", 0.08);
    setItemSharesToPay({});
    setCustomAmountInput("");
    setPaymentScreenStep("SELECT");
    setIsBillOpen(true);
  };

  // Start payment processing steps
  const handleBeginPayment = () => {
    if (currentPaySubtotal <= 0) {
      triggerToast("Payment amount must be greater than R0!", "info");
      return;
    }
    
    playBeep(440, "sine", 0.1);
    setPaymentScreenStep("PAYING");
    setActivePaymentProgressTotal(currentPaySubtotal);
    setActivePaymentProgressTip(currentPayTipAmount);
    
    setProcessingMessage("Initiating RocoMamas secure transaction terminal...");
    
    setTimeout(() => {
      setProcessingMessage("Awaiting contactless NFC sensor scan (Tap card/phone)...");
    }, 1500);
  };

  // Successful simulated Tap of Visa/Master/ApplePay
  const handleSimulateTapPayment = () => {
    playBeep(1200, "sine", 0.25); // Classic checkout high-pitched beep
    
    // Distribute paid quantity based on split mode
    setMasterBillItems(prevItems => {
      let remainingCreditToApply = activePaymentProgressTotal;
      
      return prevItems.map(item => {
        // Mode 1: If split by items, apply directly to chosen item matching records!
        if (billSplitMode === "ITEMS") {
          const selectedPaidCount = itemSharesToPay[item.id] || 0;
          if (selectedPaidCount > 0) {
            return {
              ...item,
              paidCount: Math.min(item.quantity, item.paidCount + selectedPaidCount)
            };
          }
          return item;
        } 
        
        // Mode 2: Equal/Custom proportioned payments - subtract value starting from first unpaid block
        const itemUnpaidCount = item.quantity - item.paidCount;
        let newlyPaidCount = 0;
        
        for (let i = 0; i < itemUnpaidCount; i++) {
          if (remainingCreditToApply >= item.price) {
            newlyPaidCount++;
            remainingCreditToApply -= item.price;
          }
        }
        
        if (newlyPaidCount > 0) {
          return {
            ...item,
            paidCount: item.paidCount + newlyPaidCount
          };
        }
        
        return item;
      });
    });

    // Award stamps (Earn 1 stamp for each R80 paid, stored as pending until they choose to claim)
    const earnedStamps = Math.max(1, Math.floor(activePaymentProgressTotal / 80));
    setEarnedStampsPending(earnedStamps);
    setHasPromptedLoyaltyForThisTx(false);

    // Tip thank you toast
    if (activePaymentProgressTip > 0) {
      setTimeout(() => {
        triggerToast(`Roco Crew sends a heavy high-five! R${activePaymentProgressTip} tip registered.`, "success");
      }, 2500);
    }

    // Mark table as empty again (Available) after they pay!
    setTablesState(prev => ({
      ...prev,
      [currentTableId]: "Available"
    }));

    // Reset selection cart representation
    setItemSharesToPay({});
    setCustomAmountInput("");
    setPaymentScreenStep("SUCCESS");
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
        {showSplash && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 text-center select-none font-sans bg-cover bg-center"
            style={{ backgroundImage: "url('https://i.pinimg.com/736x/d1/7d/31/d17d3138e7946042bd5180af48250c35.jpg')" }}
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
                <div className="absolute inset-0 rounded-full bg-[#FF5A00]/25 blur-3xl animate-pulse" />
                <img
                  src="https://www.rocomamas.co.ke/images//logo-combined.png"
                  alt="RocoMamas Logo"
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
                  "WE'RE NOT FAST FOOD, WE'RE ROCOMAMAS. SMASH. GRAB. REPENT."
                </p>
              </motion.div>

              {/* Keyword flasher component */}
              <SplashKeywords playBeep={playBeep} onComplete={() => {
                setShowSplash(false);
                playBeep(880, "sine", 0.08); // high chime on completion
              }} />

              {/* Quick skip trigger */}
              <button
                type="button"
                onClick={() => {
                  playBeep(700, "sine", 0.05);
                  setShowSplash(false);
                }}
                className="mt-4 px-5 py-2 bg-black/85 hover:bg-neutral-950 border border-neutral-800 text-white text-[9px] font-mono uppercase tracking-widest rounded-xl transition-all cursor-pointer transform active:scale-95 shadow-md font-bold hover:border-[#FF5A00]/40"
              >
                Skip Intro ⚡
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        id="rocomamas-os-container" 
        className={`w-full ${isStaff ? 'max-w-[1100px]' : 'max-w-[500px]'} mx-auto min-h-screen bg-[#121212] text-white flex flex-col relative shadow-2xl border-x border-[#2C2C2E]/50 md:rounded-3xl overflow-hidden grunge-pattern select-none font-sans ${isStaff ? 'pb-12' : 'pb-32'} transition-all duration-350 theme-${theme}`}
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
                  ? "bg-[#1C1C1E] text-[#FF5A00] border-l-4 border-l-[#FF5A00]"
                  : toast.type === "stamp"
                  ? "bg-[#2C2C2E] text-white border-l-4 border-l-orange-400 border-orange-400/30"
                  : "bg-black text-[#A0A0A0] border-l-4 border-l-zinc-500"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === "success" ? <Check className="w-5 h-5 text-[#FF5A00] shrink-0" /> : 
                  toast.type === "stamp" ? (
                    <img 
                      src="https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479" 
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

      {appMode === "CUSTOMER" ? (
        <>
          {!hasTableSlug ? (
            <div 
              className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 relative z-55 text-white font-sans overflow-y-auto select-none w-full max-w-[500px] mx-auto border-x border-[#1F1F22] shadow-[0_0_80px_rgba(0,0,0,0.85)]"
              style={{ backgroundImage: "url('https://i.pinimg.com/736x/d1/7d/31/d17d3138e7946042bd5180af48250c35.jpg')" }}
            >
              {/* Warm gradient and blur overlay for high contrast and beautiful branding overlay */}
              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

              {/* RocoMamas Brand Header */}
              <div className="w-full max-w-sm text-center mb-5 mt-4 animate-fade-in relative z-10 flex flex-col items-center">
                {/* Large brand logo */}
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative cursor-pointer mb-1"
                  onClick={() => playBeep(880, "sine", 0.05)}
                >
                  <img
                    src="https://www.rocomamas.co.ke/images//logo-combined.png"
                    alt="RocoMamas Logo"
                    className="w-40 h-40 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-950/50 border border-red-500/30 rounded-full text-[10px] font-sans font-black tracking-widest text-[#FF5A00] uppercase mb-3.5">
                  🚨 STAFF TERMINAL GATEWAY
                </div>

                <h2 className="font-display font-black text-white text-xl tracking-tight uppercase">
                  ADMIN AUTHENTICATION REQUIRED
                </h2>
                <p className="text-[11.5px] text-zinc-350 mt-2 leading-relaxed font-sans max-w-xs mx-auto bg-black/80 border border-zinc-800/80 px-4 py-2.5 rounded-xl backdrop-blur-md shadow-lg">
                  🔑 Floor console is currently locked. Enter the 5-digit master admin passcode to access.
                </p>
              </div>

              {/* Password entry display */}
              <div className="w-full max-w-sm bg-black/60 backdrop-blur-lg border border-zinc-800/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden mb-5 flex flex-col items-center gap-4 z-10">
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#FF5A00] to-transparent" />
                
                <div className="flex gap-2.5 justify-center my-1.5">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const char = adminPinInput[idx];
                    return (
                      <div
                        key={idx}
                        className={`w-10 h-12 rounded-xl border border-zinc-800 shadow-md flex items-center justify-center transition-all bg-black font-display font-black text-lg ${
                          char 
                            ? "border-[#FF5A00] text-[#FF5A00] shadow-[0_0_12px_rgba(255,90,0,0.25)]" 
                            : "text-zinc-750"
                        }`}
                      >
                        {char ? "●" : "○"}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Touch keypad */}
              <div className="w-full max-w-sm grid grid-cols-3 gap-2.5 px-2 relative z-10">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      playBeep(440 + num * 20, "sine", 0.05);
                      if (adminPinInput.length < 5) {
                        setAdminPinInput(prev => prev + num);
                      }
                    }}
                    className="h-12 bg-zinc-950/80 hover:bg-[#18181B] active:bg-zinc-900 border border-zinc-850 text-white font-display font-black text-lg rounded-xl transition-all active:scale-95 flex items-center justify-center select-none cursor-pointer hover:border-[#FF5A00]/30 backdrop-blur-xs"
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    playBeep(320, "sine", 0.05);
                    setAdminPinInput("");
                  }}
                  className="h-12 bg-zinc-950/55 hover:bg-[#18181B] border border-zinc-855 text-zinc-450 hover:text-white font-mono text-xs font-black uppercase rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer backdrop-blur-xs"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playBeep(440, "sine", 0.05);
                    if (adminPinInput.length < 5) {
                      setAdminPinInput(prev => prev + "0");
                    }
                  }}
                  className="h-12 bg-zinc-950/80 hover:bg-[#18181B] border border-zinc-850 text-white font-display font-black text-lg rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer hover:border-[#FF5A00]/30 backdrop-blur-xs"
                >
                  0
                </button>

                <button
                  type="button"
                  disabled={adminPinInput.length < 5}
                  onClick={() => {
                    if (adminPinInput === "80349") {
                      playBeep(880, "sine", 0.1);
                      setIsAdminUnlocked(true);
                      setAppMode("STAFF");
                      localStorage.setItem("roco_admin_unlocked", "true");
                      localStorage.setItem("roco_app_mode", "STAFF");
                      triggerToast("ADMIN ACCESS GRANTED: WELCOME TO ROCO OS", "success");
                      setAdminPinInput("");
                    } else {
                      playBeep(180, "sawtooth", 0.3);
                      triggerToast("INVALID MASTER PASSCODE: ACCESS DENIED", "info");
                      setAdminPinInput("");
                    }
                  }}
                  className="h-12 bg-[#FF5A00] hover:bg-orange-500 font-sans text-[#121214] font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-[0_4px_15px_rgba(255,90,0,0.3)] disabled:opacity-30 disabled:pointer-events-none"
                >
                  LOGIN
                </button>
              </div>

              {/* Secure banner */}
              <div className="w-full max-w-sm text-center mt-6 text-[10px] text-[#A1A1AA] relative z-10">
                <p className="font-sans uppercase tracking-widest font-black text-zinc-500 text-[9px]">
                  🔒 ENTERPRISE SECURITY SHIELD ACTIVE
                </p>
              </div>
            </div>
          ) : !isValidTable ? (
            <div 
              className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6 relative z-55 text-white font-sans overflow-y-auto select-none w-full max-w-[500px] mx-auto border-x border-[#1F1F22] shadow-[0_0_80px_rgba(0,0,0,0.85)]"
              style={{ backgroundImage: "url('https://i.pinimg.com/736x/d1/7d/31/d17d3138e7946042bd5180af48250c35.jpg')" }}
            >
              {/* Warm gradient and blur overlay for high contrast and beautiful branding overlay */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xs pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />

              {/* RocoMamas Brand Header */}
              <div className="w-full max-w-sm text-center mb-6 animate-fade-in relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.82, opacity: 0, rotate: -5 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  className="mb-2"
                  onClick={() => playBeep(220, "sawtooth", 0.15)}
                >
                  <img
                    src="https://www.rocomamas.co.ke/images//logo-combined.png"
                    alt="RocoMamas Logo"
                    className="w-36 h-36 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/60 border border-red-500/40 rounded-full text-[9px] font-mono font-black tracking-widest text-[#FF5A00] uppercase mb-4 shadow-[0_0_12px_rgba(239,68,68,0.2)] animate-pulse">
                  ⚠️ 404 TABLE NOT FOUND
                </div>
                
                <h2 className="font-display font-black text-white text-2xl tracking-wide uppercase">
                  LOST IN THE SMASH!
                </h2>
                
                {/* Error Frame Box */}
                <div className="w-full max-w-sm bg-black/75 border border-zinc-800/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden mt-4 text-center">
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-red-500 via-[#FF5A00] to-red-500" />
                  
                  <div className="flex justify-center mb-2.5">
                    <ShieldAlert className="w-12 h-12 text-[#FF5A00] animate-bounce" />
                  </div>
                  
                  <h3 className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2">
                    ERROR CONSOLE CODE: ROCO-404-COORDINATES-VOID
                  </h3>
                  
                  <p className="text-[11.5px] text-zinc-300 leading-relaxed font-sans font-medium px-1">
                    Whoops! Looks like this tabletop coordinate does not exist on our restaurant floor plan. RocoMamas dine-in tables range from <strong className="text-[#FF5A00]">Table 1</strong> to <strong className="text-[#FF5A00]">Table 13</strong>.
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
                  className="w-full h-12 bg-[#FF5A00] hover:bg-orange-500 hover:scale-[1.02] font-sans text-[#121214] font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-[0_4px_15px_rgba(255,90,0,0.3)] flex items-center justify-center gap-1.5 active:scale-95"
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
                🔒 ROCOMAMAS OS SECURITY SUITE V1.0
              </div>
            </div>
          ) : !isTableUnlocked ? (
            <div 
              className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 relative z-55 text-white font-sans overflow-y-auto select-none w-full max-w-[500px] mx-auto border-x border-[#1F1F22] shadow-[0_0_80px_rgba(0,0,0,0.85)]"
              style={{ backgroundImage: "url('https://i.pinimg.com/736x/d1/7d/31/d17d3138e7946042bd5180af48250c35.jpg')" }}
            >
              {/* Warm gradient and blur overlay for high contrast and beautiful branding overlay */}
              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

              {/* RocoMamas Brand Header */}
              <div className="w-full max-w-sm text-center mb-5 mt-4 animate-fade-in relative z-10 flex flex-col items-center">
                {/* Large brand logo */}
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative cursor-pointer mb-1"
                  onClick={() => playBeep(880, "sine", 0.05)}
                >
                  <img
                    src="https://www.rocomamas.co.ke/images//logo-combined.png"
                    alt="RocoMamas Logo"
                    className="w-40 h-40 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FF5A00]/25 border border-[#FF5A00]/40 rounded-full text-[10px] font-sans font-black tracking-widest text-[#FF5A00] uppercase mb-3.5">
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
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#FF5A00] to-transparent" />
                
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
                            ? "border-[#FF5A00] text-[#FF5A00] shadow-[0_0_12px_rgba(255,90,0,0.25)]" 
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
                    <ShieldAlert className="w-8 h-8 text-[#FF5A00] animate-bounce mb-2" />
                    <span className="text-xs font-sans font-black text-[#FF5A00] uppercase tracking-widest">
                      RATE LIMIT ENFORCED
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-1 max-w-[220px] leading-relaxed">
                      Please try again in a few moments, or ask a friendly flight captain / waiter for assistance.
                    </p>
                    <div className="mt-4 px-4 py-2 bg-orange-950/40 border border-orange-500/20 rounded-lg text-xs font-mono font-black text-[#FF5A00] tracking-wider animate-pulse">
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
                    className="h-14 bg-zinc-950/80 hover:bg-[#18181B] active:bg-zinc-900 border border-zinc-850 text-white font-display font-black text-lg rounded-xl transition-all active:scale-95 flex items-center justify-center select-none cursor-pointer hover:border-[#FF5A00]/30 disabled:opacity-40 disabled:pointer-events-none backdrop-blur-xs"
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
                  className="h-14 bg-zinc-950/80 hover:bg-[#18181B] border border-zinc-850 text-white font-display font-black text-lg rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer hover:border-[#FF5A00]/30 disabled:opacity-40 backdrop-blur-xs"
                >
                  0
                </button>

                {/* OK Submit button */}
                <button
                  type="button"
                  disabled={securityLockoutSecs > 0 || pinInput.length < 4}
                  onClick={() => handlePinSubmit(pinInput)}
                  className="h-14 bg-[#FF5A00] hover:bg-orange-500 font-sans text-[#121214] font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-[0_4px_15px_rgba(255,90,0,0.3)] disabled:opacity-30 disabled:pointer-events-none"
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
            src="https://www.rocomamas.co.ke/images//logo-combined.png"
            alt="RocoMamas Logo"
            className="h-14 md:h-16 object-contain cursor-pointer hover:rotate-3 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onClick={() => {
              playBeep(600, "sine", 0.08);
              setIsHelpOpen(true);
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
              className="px-3 py-1.5 bg-[#FF5A00] hover:bg-orange-400 text-black font-sub font-black text-[9px] uppercase rounded-xl tracking-wider transition-all transform active:scale-95 cursor-pointer flex items-center gap-1 shadow-md border border-[#FF5A00] font-bold shrink-0"
            >
              <Sliders className="w-3 h-3" />
              <span>CONTROL ⚡</span>
            </button>
          )}
        </div>

        {/* Right segment: Smaller compact waiter section */}
        <div className="bg-[#121212]/90 px-3 py-1.5 rounded-xl border border-zinc-900 flex items-center justify-between gap-3 shadow-inner sm:max-w-xs flex-1 sm:flex-initial flex-wrap pb-2 sm:pb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2C2C2E] border border-[#FF5A00]/25 flex items-center justify-center font-display text-xs text-[#FF5A00] font-bold">
              T{currentTableId || "12"}
            </div>
            <div>
              <p className="text-[8px] uppercase font-mono tracking-wider text-zinc-500">
                Staff: <span className="text-white font-sans font-bold">Roco Crew</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playBeep(440, "sine", 0.05);
                setIsCustomerChatOpen(true);
              }}
              className="cursor-pointer px-2.5 py-1 border border-zinc-800 bg-zinc-900 rounded-md font-sub font-black text-[10px] uppercase tracking-wider flex items-center gap-1 text-zinc-400 hover:text-[#FF5A00] hover:border-[#FF5A00]/40 transition-all duration-300 transform active:scale-95 font-bold"
            >
              <MessageSquare className="w-2.5 h-2.5" />
              <span>Chat</span>
            </button>

            <button
              onClick={handleCallWaiter}
              className={`cursor-pointer px-2.5 py-1 border rounded-md font-sub font-black text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all duration-300 transform active:scale-95 ${
                waiterSummoned
                  ? "bg-red-950 border-red-500 text-red-500 animate-pulse font-bold"
                  : "border-[#FF5A00]/70 text-[#FF5A00] hover:bg-[#FF5A00] hover:text-black hover:shadow-md"
              }`}
            >
              <Bell className={`w-2.5 h-2.5 ${waiterSummoned ? "animate-bounce" : ""}`} />
              {waiterSummoned ? "Summon" : "Call"}
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC TOP KITCHEN LIVE TRACKER */}
      {(() => {
        const activeKitchenOrders = historicOrders.filter(o => o.status === "Sent" || o.status === "Preparing");
        if (activeKitchenOrders.length === 0) return null;

        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              borderColor: highlightKitchenOrders ? "#FF5A00" : "rgba(44, 44, 46, 0.4)",
              boxShadow: highlightKitchenOrders 
                ? "0 0 20px rgba(231, 138, 62, 0.45)" 
                : "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
            }}
            transition={{ type: "spring", damping: 18, stiffness: 155 }}
            className={`mx-4 mt-4 bg-[#1C1C1E] border-2 rounded-xl p-3 flex flex-col gap-2.5 relative overflow-hidden transition-all duration-300 shadow-xl`}
          >
            {/* Pulsing indicator line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-600 to-[#FF5A00]" />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF5A00] font-bold">
                  Live Kitchen Feed
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold bg-black/40 px-2 py-0.5 rounded">
                ● Connected to Table {currentTableId}
              </span>
            </div>

            <div className="flex gap-2.5 items-center">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-600/10 to-[#FF5A00]/10 flex items-center justify-center font-display text-xl border border-[#FF5A00]/20 shrink-0">
                🍔
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sub font-black text-xs text-white uppercase truncate">
                  {activeKitchenOrders[0].items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  <span className="text-[9px] text-[#A0A0A0] uppercase font-mono">Status:</span>
                  <span className="text-[9.5px] text-[#FF5A00] uppercase font-mono font-black tracking-widest animate-pulse">
                    {activeKitchenOrders[0].status === "Sent" ? "KITCHEN RECEIVED" : "CHEF PREPARING..."}
                  </span>
                  <span className="text-zinc-500 font-mono text-[9.5px] font-bold">
                    ({getElapsedMinutesAgo(activeKitchenOrders[0].createdAt, activeKitchenOrders[0].timestamp)})
                  </span>
                </div>
                
                {/* Designated Server Info */}
                <p className="text-[9.5px] text-zinc-400 font-mono mt-1">
                  Designated Server: <strong className="text-emerald-400 font-black">{tableWaiterAssignments[currentTableId] || "Zoe (Shake Master)"} ⚡</strong>
                </p>

                {/* VISUAL TIMER COUNTDOWN AND COMPENSATION TRIGGER */}
                {activeKitchenOrders[0].timerRemaining !== undefined && (
                  <div className="mt-2 bg-black/60 border border-zinc-900 rounded-xl p-2 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px] font-mono leading-none">
                      <span className="text-zinc-500 uppercase tracking-wider">ROCO SPEED STANDARD:</span>
                      {activeKitchenOrders[0].timerRemaining > 0 ? (
                        <span className="text-orange-400 font-black animate-pulse font-bold">{activeKitchenOrders[0].timerRemaining}s remaining</span>
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
                        🎁 TIMER DEFEATED! Claim your free Apology Ice Cream Sundae from {tableWaiterAssignments[currentTableId]?.split(" ")[0] || "Zoe"}! 🍦
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
                className="px-3 py-1.5 bg-zinc-900 hover:bg-[#FF5A00] hover:text-black border border-zinc-800 hover:border-transparent rounded-lg text-[9px] font-mono font-bold text-[#FF5A00] uppercase tracking-wider transition-all transform active:scale-95 cursor-pointer shrink-0"
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
            return "https://cms.rocomamas.com/uploads/29033_RM_Double_Points_Web_800x600_FA_0904278a09.jpg";
          }
          if (spec.id === "promo-2" || titleLower.includes("treat yoself") || titleLower.includes("treat yourself")) {
            return "https://cms.rocomamas.com/uploads/BA_034_000040_02_Roco_Mamas_Treat_Yoself_VAC_3_Chaselist_800x600_000aac9572.png";
          }
          if (spec.id === "promo-3" || titleLower.includes("chicken smash") || titleLower.includes("southern fried chicken")) {
            return "https://cms.rocomamas.com/uploads/26020_RM_Chicken_Smash_Drive_Web_Banners_800x600_V2_f1bd35f5d9.jpg";
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
                  triggerToast(`Special Promo: ${currentSpec.title} ⚡ Ask Roco Crew to redeem!`, "info");
                }
              }}
              className={`rounded-2xl border-2 border-dashed border-black overflow-hidden relative shadow-lg transition-all duration-300 ${
                hasBgImage 
                  ? "bg-zinc-900 bg-cover bg-center w-full aspect-[4/3] cursor-pointer hover:border-[#FF5A00]/60 active:scale-[0.99] select-none" 
                  : "bg-[#FF5A00] w-full min-h-[185px] flex flex-col justify-between"
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
                    className="flex-1 py-1.5 px-2 bg-black/95 hover:bg-[#FF5A00] text-white hover:text-black hover:border-transparent border border-zinc-850 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer text-center group font-sans shadow-lg"
                  >
                    <span className="font-display font-extrabold text-[9px] uppercase tracking-wider">Solo Burger</span>
                    <span className="font-mono text-xs font-black text-[#FF5A00] group-hover:text-black">R69</span>
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
                        image: "https://cms.rocomamas.com/uploads/26020_RM_Chicken_Smash_Drive_Web_Banners_800x600_V2_f1bd35f5d9.jpg"
                      });
                    }}
                    className="flex-1 py-1.5 px-2 bg-[#FF5A00] hover:bg-orange-400 text-black rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer text-center font-sans shadow-lg font-bold"
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
                    className="p-1 rounded bg-black/80 border border-black/30 text-white hover:text-[#FF5A00] transition-colors cursor-pointer"
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
                    className="p-1 rounded bg-black/80 border border-black/30 text-white hover:text-[#FF5A00] transition-colors cursor-pointer"
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
                            const item = menuItems.find(m => m.id === "drink-5");
                            if (item) {
                              handleAddToCart(item);
                              triggerToast("Sunrise Mimosa added!", "success");
                            }
                          } else if (currentSpec.id === "spec-2") {
                            const item = menuItems.find(m => m.id === "eat-2");
                            if (item) {
                              handleAddToCart(item);
                              triggerToast("Roco Beef Burger added!", "success");
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
                      className="bg-[#121212] border border-[#FF5A00]/50 hover:border-[#FF5A00] text-xs font-sub font-bold tracking-wider text-[#FF5A00] hover:bg-[#FF5A00] hover:text-black px-3.5 py-1.5 rounded transition-all flex items-center gap-1.5 uppercase cursor-pointer active:scale-95"
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
          className="bg-[#1C1C1E] hover:bg-zinc-855 border-2 border-dashed border-[#FF5A00]/30 hover:border-[#FF5A00] text-white p-3.5 rounded-xl flex flex-col items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer text-center relative overflow-hidden group shadow-heavy diagonal-stripes"
        >
          <div className="absolute -top-1 right-2 bg-[#FF5A00]/10 text-[#FF5A00] text-[8px] font-mono font-bold px-1.5 py-1 rounded-b border border-t-0 border-[#FF5A00]/20 uppercase tracking-widest">
            RESERVE
          </div>
          <div className="w-10 h-10 rounded-full bg-[#121212] border border-[#FF5A00]/15 flex items-center justify-center text-xl text-[#FF5A00] group-hover:scale-110 transition-transform">
            📆
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xs uppercase tracking-wider text-white">
              Book a Table
            </span>
            <span className="text-[9px] text-zinc-500 uppercase font-mono mt-0.5">
              Tables 1-15 Map Grid
            </span>
          </div>
        </button>

        {/* 🎮 PLAY AT TABLE BUTTON */}
        <button
          onClick={() => {
            playBeep(520, "sine", 0.08);
            setIsGamesModalOpen(true);
          }}
          className="bg-[#1C1C1E] hover:bg-zinc-855 border-2 border-dashed border-[#FF5A00]/30 hover:border-[#FF5A00] text-white p-3.5 rounded-xl flex flex-col items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer text-center relative overflow-hidden group shadow-heavy diagonal-stripes-orange"
        >
          <div className="absolute -top-1 right-2 bg-red-650 text-red-100 text-[8px] font-mono font-bold px-1.5 py-1 rounded-b uppercase tracking-widest animate-pulse">
            ARCADE
          </div>
          <div className="w-10 h-10 rounded-full bg-[#121212] border border-[#FF5A00]/15 flex items-center justify-center text-xl text-orange-500 group-hover:scale-110 transition-transform">
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
                  <p className="text-[9px] font-mono text-[#FF5A00] uppercase tracking-widest mt-0.5 font-bold">
                    WE'RE NOT NORMAL 🤘
                  </p>
                </div>
              </div>
              <span className="bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/20 text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase font-black">
                {bookings.length} Confirmed
              </span>
            </div>

            <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
              {bookings.map((b) => {
                const table = ROCO_TABLES.find(t => t.id === b.tableId);
                return (
                  <div key={b.id} className="bg-black/40 p-3 rounded-xl border border-[#FF5A00]/15 flex items-center justify-between text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[#FF5A00] font-bold uppercase text-xs">
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
                        <p className="text-[9.5px] text-[#FF5A00] italic font-black">
                          Occasion: {b.occasion}
                        </p>
                      )}
                      {b.specialRequests && (
                        <p className="text-[9.5px] text-zinc-400 truncate max-w-[200px] border-l border-[#FF5A00]/30 pl-1.5 mt-1">
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
                  <Award className="w-4.5 h-4.5 text-[#FF5A00] animate-pulse" />
                  <div>
                    <h4 className="font-sub font-black tracking-wider text-xs uppercase text-[#FF5A00] leading-none">
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
                        active ? "active text-[#FF5A00]" : "text-zinc-700 bg-black/20"
                      }`}
                      title={active ? `Loyalty stamp earned!` : `Stamp Spot ${i + 1}`}
                    >
                      {active ? (
                        <img 
                          src="https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479" 
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
                          src="https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479" 
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
                ? "bg-[#FF5A00] text-white shadow-md scale-[1.02] border border-orange-600 font-bold"
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
                ? "bg-[#FF5A00] text-white shadow-md scale-[1.02] border border-orange-600 font-bold"
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
              className="w-full bg-[#1C1C1E] text-zinc-100 placeholder-zinc-650 text-xs rounded-lg pl-9 pr-8 py-2.5 border border-zinc-850/80 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00]/20 font-sans transition-all shadow-inner"
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
                  { id: "Roco Drop", label: "Roco Drop 🔥", icon: Flame },
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
                      ? "bg-[#FF5A00] text-black border border-[#FF5A00] shadow-[0_2px_8px_rgba(231, 138, 62,0.25)] scale-[1.03]"
                      : "bg-[#1C1C1E] text-zinc-400 hover:text-zinc-200 border border-zinc-850"
                  }`}
                >
                  <SubIcon className={`w-3 h-3 ${isSelected ? "text-black" : "text-[#FF5A00]/70"}`} />
                  <span>{sub.label}</span>
                </button>
              );
            })}
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
                      ? "border-[#FF5A00] ring-1 ring-[#FF5A00]/25 scale-[1.01]" 
                      : "border-zinc-900 bg-[#1C1C1E] hover:border-zinc-800 hover:scale-[1.01] hover:shadow-xl"
                  }`}
                >
                  {/* Top Image block */}
                  <div className="h-44 w-full bg-[#121212]/50 flex items-center justify-center relative overflow-hidden shrink-0 group p-2.5">
                    {(() => {
                      const resolvedImage = getProductResolvedImage(item);
                      return resolvedImage ? (
                        <img 
                          src={resolvedImage} 
                          alt={item.name} 
                          className="w-full h-full object-contain rounded-xl transition-transform duration-505 group-hover:scale-102"
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
                      className="absolute inset-0 bg-gradient-to-br from-[#FF5A00]/10 to-zinc-950 flex items-center justify-center"
                      style={{ display: getProductResolvedImage(item) ? 'none' : 'flex' }}
                    >
                      <span className="text-4xl filter drop-shadow-md">{item.emoji}</span>
                    </div>

                    {/* Popularity / Special Indicator overlay */}
                    {item.popularityBadge && (
                      <div className="absolute bottom-2 left-2 z-10">
                        <span className="bg-black/85 backdrop-blur-sm text-[#FF5A00] text-[7.5px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded border border-[#FF5A00]/30 shadow">
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
                        {item.description.length > 55 ? (
                          <>
                            {item.description.slice(0, 50)}...{" "}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDetailItem(item);
                                playBeep(450, "sine", 0.05);
                              }}
                              className="text-[#FF5A00] hover:text-orange-400 font-bold ml-1 hover:underline cursor-pointer inline bg-transparent border-none p-0 uppercase text-[9px]"
                            >
                              read more
                            </button>
                          </>
                        ) : (
                          item.description
                        )}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-zinc-900/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">PRICE</span>
                        <span className="font-mono text-sm font-black text-[#FF5A00]">
                          R{item.price}
                        </span>
                      </div>

                      {/* Add button or Quantity Controller */}
                      {hasSelected ? (
                        <div className="flex items-center w-full bg-[#121212] border border-[#FF5A00]/50 rounded-xl overflow-hidden shadow-inner shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQuantity(item.id, -1);
                            }}
                            className="flex-1 py-1.5 text-[#FF5A00] hover:bg-[#FF5A00] hover:text-black transition-colors flex items-center justify-center cursor-pointer"
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
                            className="flex-1 py-1.5 text-[#FF5A00] hover:bg-[#FF5A00] hover:text-black transition-colors flex items-center justify-center cursor-pointer"
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
                          className="w-full bg-[#FF5A00] hover:bg-orange-400 active:scale-95 text-[#121212] font-sub font-black text-[10px] py-1.5 rounded-xl tracking-wider transition-all uppercase flex items-center justify-center gap-1 font-bold cursor-pointer"
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
                <div className="w-14 h-14 rounded-full bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-[#FF5A00]">
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
                  className="bg-[#121212] border border-[#FF5A00]/50 hover:border-[#FF5A00] text-[10.5px] font-sub font-black uppercase tracking-wider text-[#FF5A00] px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Reset Active Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* TRACKING PRECENT ORDERS (Active Kitchen Orders Simulator) */}
      {historicOrders.length > 0 && (
        <section 
          id="active-kitchen-orders-section" 
          className={`px-4 py-4 border-t border-zinc-900 mt-6 md:pb-8 rounded-xl transition-all duration-500 ${
            highlightKitchenOrders 
              ? "bg-amber-950/20 ring-2 ring-[#FF5A00] shadow-[0_0_25px_rgba(231, 138, 62,0.45)]" 
              : ""
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A00] animate-pulse" />
            <h3 className="font-sub font-black text-xs uppercase tracking-widest text-[#FF5A00]">
              Active Kitchen Orders
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {historicOrders.map((order) => (
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
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 text-[#FF5A00] text-[10px] font-mono font-bold rounded border border-amber-500/20">
                      <Clock className="w-2.5 h-2.5 text-[#FF5A00] animate-pulse" />
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
              className="py-3 px-3.5 rounded-lg border-2 border-zinc-800 hover:border-[#FF5A00] text-zinc-300 hover:text-[#FF5A00] bg-black/30 font-sub font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" /> Bill
            </button>

            <button
              onClick={() => {
                playBeep(450, "sine", 0.08);
                setIsCartOpen(true);
              }}
              className="py-3 px-6 rounded-lg bg-[#FF5A00] hover:bg-orange-400 active:scale-95 text-[#121212] font-sub font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 select-none shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              View Order
            </button>
          </div>

        </div>

        {/* Small RocoMamas OS Footer Credit */}
        <div className="mt-4 pt-2 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-650 font-mono">
          <span>TABLE {currentTableId} SYSTEM</span>
          {!hasTableSlug && (
            <button
              onClick={() => {
                playBeep(440, "sine", 0.08);
                setAppMode("STAFF");
                triggerToast("Logged in as Roco Crew (Staff View active)", "success");
              }}
              className="tracking-widest uppercase font-bold text-[#FF5A00]/80 hover:text-[#FF5A00] transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#FF5A00]/5 hover:bg-[#FF5A00]/15 px-2.5 py-1.5 rounded-lg border border-[#FF5A00]/20 font-mono text-[9px] hover:shadow-[0_0_10px_rgba(231, 138, 62,0.15)]"
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
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-[#1C1C1E] border-t-4 border-[#FF5A00] rounded-t-3xl z-55 overflow-hidden flex flex-col max-h-[85vh] shadow-2xl pb-6"
            >
              {/* Header drawer controls */}
              <div className="p-4 bg-[#121212] border-b border-zinc-900 flex justify-between items-center relative">
                <div>
                  <h3 className="font-display font-black text-[#FF5A00] tracking-widest text-lg uppercase">
                    Your Order
                  </h3>
                  <p className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                    Table {currentTableId} • Roco Rockstar Smash-Box
                  </p>
                </div>
                
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 bg-[#1C1C1E] border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-[150px]">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-[#121212] rounded-full border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 mb-3 text-2xl">
                      🥩
                    </div>
                    <h4 className="font-sub font-black text-white text-sm uppercase tracking-wider">
                      Your Order is Empty
                    </h4>
                    <p className="text-xs text-zinc-500 font-sans mt-1 max-w-[250px] leading-relaxed">
                      Don't starve. Go grab "The Wrap Daddy" or a ice-cold Windhoek Lager right away!
                    </p>
                  </div>
                ) : (
                  cart.map((cartItem) => {
                    const item = cartItem.menuItem;
                    return (
                      <div 
                        key={item.id} 
                        className="bg-[#121212] p-3.5 rounded-xl border border-zinc-900 flex items-center justify-between"
                      >
                        {/* Title, description & Price */}
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.emoji}</span>
                          <div>
                            <h4 className="font-sub font-black text-xs text-white uppercase tracking-wider">
                              {item.name}
                            </h4>
                            <p className="font-mono text-11px text-[#FF5A00] mt-0.5">
                              R{item.price} each
                            </p>
                          </div>
                        </div>

                        {/* Adjust qty panel */}
                        <div className="flex items-center bg-[#1C1C1E] border border-zinc-800 rounded-lg overflow-hidden shrink-0 ml-4">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="px-2.5 py-1 text-zinc-400 hover:text-[#FF5A00] hover:bg-[#121212] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-mono font-bold text-xs text-white">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="px-2.5 py-1 text-zinc-400 hover:text-[#FF5A00] hover:bg-[#121212] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* --- INTELLIGENT CONTEXTUAL UP-SELLING ENGINE --- */}
                {cart.length > 0 && (() => {
                  const hasEatItems = cart.some(c => c.menuItem.category === "EAT");
                  const hasDrinkOnly = !hasEatItems;

                  // Define pairing targets
                  const upsellItem = hasDrinkOnly
                    ? { id: "eat-brekkie-1", name: "Bang for Buck Brekkie", price: 45, emoji: "🍳", category: "EAT" as const, description: "2 eggs, 2 bacon rashers chips & toast package deal." }
                    : { id: "drink-5", name: "Sunrise Mimosa", price: 45, emoji: "🥂", category: "DRINK" as const, description: "Bubbling dry sparkling wine & sweet cold-pressed orange juice." };

                  // If they already have this upsell item in the cart, don't show it to prevent clutter
                  const alreadyInCart = cart.some(c => c.menuItem.id === upsellItem.id);
                  if (alreadyInCart) return null;

                  return (
                    <div className="mt-2.5 p-3 rounded-xl border border-dashed border-[#FF5A00]/40 bg-gradient-to-br from-[#FF5A00]/5 to-transparent flex flex-col gap-2.5 relative overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF5A00] animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5A00] font-black">
                          Chef's Recommended Pairing
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{upsellItem.emoji}</span>
                          <div>
                            <h5 className="font-sub font-black text-white text-11px uppercase leading-none tracking-wide">
                              {upsellItem.name}
                            </h5>
                            <p className="text-[10px] text-zinc-500 leading-tight mt-0.5 line-clamp-1 max-w-[190px]">
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
                          className="px-3 py-1.5 bg-[#FF5A00] hover:bg-[#FF5A00]/95 text-black hover:text-[#121212] font-sub font-black text-[9px] uppercase rounded-lg transition-colors flex items-center justify-center gap-1 shrink-0 cursor-pointer shadow-md transform active:scale-95"
                        >
                          <Plus className="w-2.5 h-2.5" /> add R{upsellItem.price}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Custom Order Notes input section */}
                {cart.length > 0 && (
                  <div className="mt-4 p-3.5 bg-zinc-950/45 rounded-xl border border-zinc-850/60 flex flex-col gap-2 shadow-inner">
                    <label htmlFor="order-notes-textarea" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400 select-none">
                      <span>📝 Kitchen Notes & Instructions</span>
                    </label>
                    <textarea
                      id="order-notes-textarea"
                      rows={2}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Medium burger, no onions, extra ice on beer please..."
                      className="w-full bg-[#121212] text-zinc-100 placeholder-zinc-700 text-xs rounded-lg p-3 border border-zinc-850/80 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00]/20 font-sans transition-all resize-none shadow-inner"
                    />
                  </div>
                )}
              </div>

              {/* Price break-down / calculations footer */}
              {cart.length > 0 && (
                <div className="px-4 py-4 bg-[#121212]/90 border-t border-zinc-900 flex flex-col gap-3">
                  {/* Detail pricing list */}
                  <div className="flex flex-col gap-1.5 text-xs text-zinc-400 font-mono">
                    <div className="flex justify-between">
                      <span>Order Subtotal</span>
                      <span className="font-sans text-white">R{(cartTotal * 0.85).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (15% Included)</span>
                      <span className="font-sans text-white font-bold text-[#FF5A00]">R{(cartTotal * 0.15).toFixed(2)}</span>
                    </div>

                    {/* Google Coupons Applied Row */}
                    {couponApplied && (
                      <div className="flex justify-between text-emerald-400 border-t border-zinc-900/50 pt-1.5 text-11px">
                        <span>⭐️ Google Review Code applied</span>
                        <span className="font-sub font-black font-sans text-emerald-400">-R50.00</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm text-white font-sub font-black border-t border-zinc-800/50 pt-2 uppercase">
                      <span>Total Price</span>
                      <span className="font-mono text-base text-[#FF5A00]">
                        R{Math.max(0, cartTotal - (couponApplied ? 50 : 0))}
                      </span>
                    </div>
                  </div>

                  {/* Stamp warning notification */}
                  <div className="p-3 bg-zinc-950/45 rounded-lg border border-[#FF5A00]/10 flex items-center gap-2.5 text-[11px] font-mono text-[#A0A0A0]">
                    <Award className="w-4 h-4 text-orange-400 shrink-0" />
                    <p className="leading-relaxed text-[10.5px]">
                      Sending this order wins you <span className="text-white font-bold">{cartTotalItems} gold stamp(s)</span> on your card!
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
                      className="w-full mt-0.5 py-2.5 px-3 bg-[#1C1C1E] hover:bg-zinc-850 border border-dashed border-[#FF5A00]/35 text-[#FF5A00] hover:text-white rounded-xl text-[10.5px] font-sub font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-black/20"
                    >
                      <Star className="w-3.5 h-3.5 fill-[#FF5A00] text-transparent" />
                      Review Us on Google for dynamic R50 Voucher!
                    </button>
                  )}

                  {/* Call CTAs */}
                  <div className="flex gap-2.5 mt-1">
                    <button
                      onClick={handleRequestBill}
                      className="flex-1 py-3.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#FF5A00] hover:border-[#FF5A00] uppercase font-sub font-black text-xs tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Request Bill
                    </button>

                    <button
                      onClick={handleSendOrder}
                      className="flex-[2] py-4 bg-[#FF5A00] hover:bg-orange-400 text-[#121212] font-sub font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-lg"
                    >
                      <Plus className="w-4 h-4 shrink-0" /> Send Order to Kitchen
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
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-[#1C1C1E] border-t-4 border-[#FF5A00] rounded-t-3xl z-55 overflow-hidden flex flex-col max-h-[85vh] shadow-2xl pb-6"
            >
              {/* Header drawer controls */}
              <div className="p-4 bg-[#121212] border-b border-zinc-900 flex justify-between items-center relative">
                <div>
                  <h3 className="font-display font-black text-[#FF5A00] tracking-widest text-lg uppercase flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#FF5A00]" />
                    <span>Lounge Chat</span>
                  </h3>
                  <p className="text-[10px] font-mono tracking-wider text-zinc-550 uppercase">
                    Direct live line to Table {currentTableId || "12"} crew
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
                  const tableKey = currentTableId || "12";
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
                          <span>{isStaffMsg ? "Roco Crew (Staff)" : "You (Guest)"}</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div
                          className={`p-3 rounded-xl text-xs leading-relaxed ${
                            isStaffMsg
                              ? "bg-[#1C1C1E] border border-zinc-850 text-white rounded-tl-none font-sans"
                              : "bg-[#FF5A00] text-black font-medium font-sans rounded-tr-none"
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
                  className="flex-1 bg-black border border-zinc-800 p-3 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5A00]"
                />
                <button
                  id="cust-chat-send-btn"
                  onClick={() => {
                    if (!customerChatInput.trim()) return;
                    playBeep(650, "sine", 0.05);

                    const newMsg = {
                      id: "c-guest-" + Date.now().toString(36),
                      tableId: currentTableId || "12",
                      sender: "Customer",
                      text: customerChatInput.trim(),
                      timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    };

                    setChatMessages((prev) => [...prev, newMsg]);
                    setCustomerChatInput("");
                    triggerToast("Message dispatched to Roco Crew dashboard! 💬", "success");
                  }}
                  className="bg-[#FF5A00] hover:bg-orange-400 text-black px-4.5 rounded-xl font-sub font-black text-xs uppercase tracking-wider flex items-center justify-center cursor-pointer font-bold shrink-0 transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* INTERACTIVE BILL SPLITTER CENTRAL MODAL */}
      <AnimatePresence>
        {isBillOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (paymentScreenStep !== "PAYING") {
                  setIsBillOpen(false);
                }
              }}
              className="fixed inset-0 bg-black/95 z-[9930] backdrop-blur-sm cursor-pointer"
            />

            {/* Central Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-x-4 top-[6%] bottom-[6%] max-w-[480px] mx-auto bg-[#1C1C1E] border-2 border-[#FF5A00] rounded-3xl z-[9935] overflow-hidden flex flex-col shadow-[0_0_40px_rgba(231, 138, 62,0.3)]"
            >
              
              {/* STAGE 1: PAYMENTS METHOD SETUP & SELECT */}
              {paymentScreenStep === "SELECT" && (
                <>
                  {/* Header */}
                  <div className="p-4 bg-[#121212] border-b border-zinc-900 flex justify-between items-center relative">
                    <div>
                      <h3 className="font-display font-black text-[#FF5A00] tracking-widest text-lg uppercase flex items-center gap-1.5">
                        <Receipt className="w-5 h-5" /> BILL SPLITTER
                      </h3>
                      <p className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                        Master Table {currentTableId} Accounts Control
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Reset Sandbox trigger */}
                      <button
                        onClick={handleResetBillToDemo}
                        title="Clear Live Table Bill to start fresh"
                        className="p-2 bg-zinc-900 hover:bg-[#FF5A00] hover:text-black border border-zinc-850 rounded-lg text-zinc-400 transition-colors cursor-pointer flex items-center gap-1 text-[10px] uppercase font-mono font-bold"
                      >
                        <RotateCcw className="w-3 h-3" /> Clear Bill
                      </button>

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
                      {/* background pattern */}
                      <div className="absolute top-2.5 right-2.5 w-12 h-12 pointer-events-none opacity-[0.03]">
                        <QrCode className="w-12 h-12 text-[#FF5A00]" />
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-mono tracking-widest text-[#FF5A00] uppercase font-black bg-[#FF5A00]/10 px-2.5 py-0.5 rounded">
                            LIVE SPLITTING CONNECT
                          </span>
                          <h4 className="font-sub font-black text-sm text-white uppercase mt-1 px-0.5 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#FF5A00]" /> Active Table ({sessionMembers.length})
                          </h4>
                        </div>

                        <button 
                          onClick={() => {
                            playBeep(450, "sine", 0.05);
                            setIsQrModalOpen(true);
                          }}
                          className="px-3.5 py-2 bg-[#FF5A00] hover:bg-orange-400 text-[#121212] rounded-lg text-[10.5px] font-sub font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 text-center"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Scan QR Code
                        </button>
                      </div>

                      {/* Display current active table table split members */}
                      <div className="flex flex-wrap gap-1.5 items-center bg-black/40 p-2.5 rounded-lg border border-zinc-900">
                        <span className="text-[9.5px] font-mono text-zinc-500 uppercase font-black">Joined:</span>
                        {sessionMembers.map((member) => (
                          <motion.span
                            key={member}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold font-sub uppercase flex items-center gap-1 border border-zinc-800 shrink-0 ${
                              member === "You" 
                                ? "bg-zinc-800 text-white" 
                                : "bg-zinc-900/80 text-[#FF5A00]"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            {member}
                          </motion.span>
                        ))}
                      </div>

                      {/* Shortcut Panel */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const url = getSecureGuestUrl(currentTableId || "12");
                            navigator.clipboard.writeText(url);
                            playBeep(600, "sine", 0.08);
                            setCopiedLink(true);
                            triggerToast("Table splitting link copied to clipboard!", "success");
                            setTimeout(() => setCopiedLink(false), 2000);
                          }}
                          className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-850 hover:border-zinc-800 uppercase rounded text-[9.5px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                          {copiedLink ? "Link Copied!" : "Copy Link"}
                        </button>

                        <button
                          onClick={handleSimulateJoin}
                          className="flex-1 py-2 bg-zinc-950 hover:bg-zinc-900 text-[#FF5A00]/90 border border-[#FF5A00]/15 hover:border-[#FF5A00]/40 rounded text-[9.5px] font-sub font-black uppercase tracking-wider transition-all transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Simulate Join 👥
                        </button>
                      </div>
                    </div>

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
                          <p className="text-[10px] font-mono uppercase tracking-wider text-[#FF5A00]">
                            Remaining Unpaid
                          </p>
                          <h4 className="font-mono text-xl font-black text-[#FF5A00]">
                            R{billRemainingTotal}
                          </h4>
                        </div>
                      </div>

                      {/* Custom Progress Bar */}
                      <div className="w-full bg-[#1C1C1E] h-3 rounded-full overflow-hidden border border-zinc-850 p-0.5 flex relative">
                        <div 
                          className="bg-gradient-to-r from-orange-600 to-[#FF5A00] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(231, 138, 62,0.5)]"
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
                            <span className="text-[10px] font-mono uppercase text-[#FF5A00] font-bold block leading-none">Receipt Export Center</span>
                            <span className="text-[11px] font-sans text-zinc-400">Save full Table {currentTableId} bill</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleExportFullReceipt}
                          className="px-3.5 py-2 bg-zinc-900 hover:bg-[#FF5A00] hover:text-black border border-zinc-800 hover:border-transparent rounded-lg text-[10px] uppercase font-mono font-black tracking-wide flex items-center gap-1.5 text-zinc-300 transition-all cursor-pointer active:scale-95 shadow-md"
                        >
                          <Download className="w-3.5 h-3.5 text-[#FF5A00] group-hover:text-black" /> Export Receipt
                        </button>
                      </div>
                    </div>

                    {billRemainingTotal <= 0 ? (
                      /* Fully settled receipt block */
                      <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-900/30 rounded-xl border border-emerald-500/10 p-4">
                        <div className="w-14 h-14 bg-emerald-950/40 rounded-full border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 text-2xl">
                          🍻
                        </div>
                        <h4 className="font-sub font-black text-white text-base uppercase tracking-wider">
                          Fully Settled!
                        </h4>
                        <p className="text-xs text-zinc-500 max-w-[280px] mt-1 italic">
                          This bill is fully sorted. Roco Crew is happy, the kitchen is ready. You're set!
                        </p>
                        <button
                          onClick={handleResetBillToDemo}
                          className="mt-4 px-4 py-2 bg-emerald-950 hover:bg-[#FF5A00] text-emerald-400 hover:text-black border border-emerald-800 hover:border-transparent rounded-lg text-xs font-sub font-black uppercase tracking-wider transition-all"
                        >
                          Refresh Sample Bill to Splitting Simulator
                        </button>
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
                                ? "bg-[#FF5A00] text-black shadow-md font-black"
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
                                ? "bg-[#FF5A00] text-black shadow-md font-black"
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
                                ? "bg-[#FF5A00] text-black shadow-md font-black"
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
                                  className="px-3.5 py-1.5 text-zinc-400 hover:text-[#FF5A00] transitions-all"
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
                                  className="px-3.5 py-1.5 text-zinc-400 hover:text-[#FF5A00] transition-all"
                                  disabled={splitCount >= 12}
                                  aria-label="Increase split share count"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="border-t border-zinc-850/50 mt-2 pt-2.5 flex items-center justify-between">
                              <span className="text-xs text-zinc-400">YOUR SHARE TO PAY:</span>
                              <span className="font-mono text-lg font-black text-[#FF5A00]">
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
                                          ? "bg-[#1C1C1E] border-[#FF5A00]/50" 
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
                                        <span className={`px-2.5 font-mono text-xs font-bold ${shareSelected > 0 ? "text-[#FF5A00] font-black" : "text-zinc-600"}`}>
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
                              <span className="font-mono text-base font-black text-[#FF5A00]">
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
                                className="w-full bg-black border border-zinc-800 focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] rounded-xl pl-8 pr-4 py-3 font-mono text-sm text-white focus:outline-none placeholder-zinc-700"
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
                                        : "text-[#FF5A00] hover:bg-[#FF5A00] hover:text-black hover:border-transparent cursor-pointer"
                                    }`}
                                  >
                                    {preset.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* GRATUITY SELECTOR (Roco Crew Tip Panel) */}
                        <div className="bg-[#121212]/30 p-2.5 rounded-xl border border-zinc-900 flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                            Support Roco Crew (Tip Option)
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
                                    ? "bg-[#FF5A00]/10 border-[#FF5A00] text-[#FF5A00] font-black"
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
                              <span className="text-[#FF5A00]">R{currentPayTipAmount.toFixed(2)}</span>
                            </div>
                          )}

                          <div className="flex justify-between border-t border-zinc-850 pt-2 text-sm text-white font-sub font-black uppercase">
                            <span>Final Charge Amount</span>
                            <span className="font-mono text-[#FF5A00] text-base font-black">
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
                            onClick={handleBeginPayment}
                            disabled={currentPaySubtotal <= 0}
                            className={`flex-[2] py-4 rounded-xl flex items-center justify-center gap-2 font-sub font-black text-xs uppercase tracking-wider transition-all transform active:scale-95 cursor-pointer ${
                              currentPaySubtotal > 0
                                ? "bg-[#FF5A00] hover:bg-orange-400 text-black shadow-lg"
                                : "bg-zinc-800 border-zinc-850 text-zinc-500 cursor-not-allowed opacity-50"
                            }`}
                          >
                            <CreditCard className="w-4 h-4" /> SECURE CHECKOUT (R{currentPayFinalAmount.toFixed(0)})
                          </button>
                        </div>
                      </>
                    )}

                  </div>
                </>
              )}


              {/* STAGE 2: NFC TERMINAL TAP EMULATOR */}
              {paymentScreenStep === "PAYING" && (
                <div className="p-5.5 bg-[#121212] flex flex-col gap-6 items-center text-center">
                  
                  {/* Status header line */}
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[10px] font-mono tracking-widest text-[#FF5A00] uppercase animate-pulse">
                      ● EMULATING VISA/MASTERCARD TERMINAL 12
                    </span>
                    <span className="text-[10px] font-mono text-zinc-650 uppercase">
                      ID: Roco-POS-0X
                    </span>
                  </div>

                  {/* Terminal simulation screen */}
                  <div className="w-full bg-black/90 p-5 rounded-2xl border border-zinc-800 flex flex-col gap-4 items-center shadow-inner pt-6 relative min-h-[190px] justify-center">
                    
                    {/* Ring animated circles to simulate NFC Waves */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="min-w-[120px] aspect-square rounded-full border border-[#FF5A00]/10 animate-ping absolute" />
                      <span className="min-w-[180px] aspect-square rounded-full border border-[#FF5A00]/5 animate-ping absolute" />
                    </div>

                    <p className="text-zinc-500 font-mono text-[11px] leading-relaxed uppercase max-w-[320px]">
                      {processingMessage}
                    </p>

                    <div className="my-1 text-2xl font-mono font-black text-white tracking-widest bg-[#1C1C1E] px-4 py-2 border border-zinc-800 rounded uppercase text-center leading-none">
                      CHARGE: R{currentPayFinalAmount.toFixed(2)}
                    </div>

                    <div className="text-[10px] font-mono text-[#FF5A00] uppercase bg-[#FF5A00]/10 px-3 py-1 rounded border border-[#FF5A00]/20 tracking-wider">
                      CONTACTLESS PAY ENABLED
                    </div>
                  </div>

                  {/* AESTHETIC TAP TRIGGER CIRCLE */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={handleSimulateTapPayment}
                      className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-600 to-[#FF5A00] hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center text-black border-4 border-black font-sub font-black text-xs uppercase tracking-wider relative cursor-pointer shadow-[0_0_20px_rgba(231, 138, 62,0.35)] hover:shadow-[0_0_30px_rgba(231, 138, 62,0.65)]"
                    >
                      <Sparkles className="w-6 h-6 mb-1 animate-bounce" />
                      <p className="leading-tight text-[10px]">TAP</p>
                      <p className="leading-none text-[9px] uppercase font-mono tracking-tighter">PHONE HERE</p>
                    </button>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest animate-pulse">
                      Tap the gold sensor to process
                    </p>
                  </div>

                  {/* Cancel button */}
                  <button
                    onClick={() => {
                      playBeep(200, "sine", 0.08);
                      setPaymentScreenStep("SELECT");
                    }}
                    className="w-full py-3 border border-zinc-850 rounded-xl font-sub font-bold text-xs uppercase text-zinc-400 hover:text-white bg-black/20 cursor-pointer"
                  >
                    Cancel Payment
                  </button>
                </div>
              )}


              {/* STAGE 3: PAYMENT SUCCESS SHEET SCREEN */}
              {paymentScreenStep === "SUCCESS" && (
                <div className="p-6 bg-[#121212] flex flex-col gap-6 text-center items-center">
                  
                  {/* Huge success checkmark */}
                  <div className="w-16 h-16 rounded-full bg-[#FF5A00]/10 border-2 border-[#FF5A00] flex items-center justify-center text-[#FF5A00] text-3xl shadow-lg shadow-[#FF5A00]/15 animate-bounce mt-4">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div>
                    <h2 className="font-display font-black text-white text-2xl uppercase tracking-widest leading-none">
                      PAYMENT APPROVED
                    </h2>
                    <p className="text-[10px] font-mono text-[#FF5A00] uppercase font-black uppercase italic tracking-widest mt-1">
                      RocoMamas OS AUTHORIZED
                    </p>
                  </div>

                  {/* Transaction breakdown receipt design mockup */}
                  <div className="w-full bg-[#1C1C1E] p-4 rounded-xl border border-dashed border-zinc-800 flex flex-col gap-2 font-mono text-xs text-left max-w-[340px] shadow-inner relative overflow-hidden">
                    
                    {/* Stamp overlay */}
                    <div className="absolute top-2.5 right-2 -rotate-12 border-2 border-[#FF5A00]/55 px-2 py-0.5 rounded text-[#FF5A00]/85 text-[10px] font-black tracking-widest select-none bg-[#1C1C1E]/95">
                      APPROVED
                    </div>

                    <div className="text-[10px] text-zinc-500 pb-1.5 border-b border-zinc-800 flex justify-between">
                      <span>Ref: #STFY-{Date.now().toString().slice(-6)}</span>
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-zinc-500">Table:</span>
                      <span className="text-white font-bold">TABLE {currentTableId}</span>
                    </div>

                    <div className="flex justify-between py-0.5">
                      <span className="text-zinc-500">Paid amount:</span>
                      <span className="text-[#FF5A00] font-bold">R{activePaymentProgressTotal.toFixed(2)}</span>
                    </div>

                    {activePaymentProgressTip > 0 && (
                      <div className="flex justify-between py-0.5">
                        <span className="text-zinc-500">Tip for Roco Crew:</span>
                        <span className="text-white">R{activePaymentProgressTip.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between pt-1 pb-1.5 border-t border-zinc-800 font-sub font-black text-sm text-white uppercase tracking-wider mt-1.5">
                      <span>Charged total</span>
                      <span className="font-mono text-[#FF5A00]">R{(activePaymentProgressTotal + activePaymentProgressTip).toFixed(2)}</span>
                    </div>

                    <p className="text-[9px] text-zinc-600 text-center leading-normal mt-1 italic uppercase font-bold">
                      Customer self-pacing split. Table {currentTableId} balance updated in real-time.
                    </p>
                  </div>

                  {/* Dynamic Loyalty Prompt & Profile Creation */}
                  {!hasPromptedLoyaltyForThisTx ? (
                    <div className="w-full bg-[#1C1C1E] p-4 rounded-xl border-2 border-dashed border-[#FF5A00] flex flex-col gap-3 font-mono text-xs text-left max-w-[340px] shadow-lg">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-zinc-800">
                        <Award className="w-5 h-5 text-[#FF5A00] animate-bounce shrink-0" />
                        <div>
                          <h4 className="font-display font-black text-white text-xs uppercase tracking-wider">
                            CLAIM LOYALTY POINTS? 🎁
                          </h4>
                          <p className="text-[8.5px] text-zinc-500 uppercase font-black tracking-wide leading-none mt-0.5">
                            You earned +{earnedStampsPending} stamps!
                          </p>
                        </div>
                      </div>

                      {userProfile ? (
                        /* Existing profile scenario */
                        <div className="space-y-3">
                          <p className="text-[10px] text-zinc-300 leading-normal">
                            Rockstar <span className="text-[#FF5A00]">@{userProfile.username}</span>, would you like to claim these <span className="text-white font-bold">{earnedStampsPending} stamps</span> to your profile <span className="text-zinc-400">({userProfile.email})</span>?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                playBeep(880, "sine", 0.1);
                                setHasPromptedLoyaltyForThisTx(true);
                                const nextStamps = stamps + earnedStampsPending;
                                setStamps(nextStamps % 10);
                                if (nextStamps >= 10) {
                                  triggerToast("🎉 LOYALTY UNLOCKED: Free drink earned! Tell Roco Crew!", "stamp");
                                } else {
                                  triggerToast(`Collected +${earnedStampsPending} stamps to @${userProfile.username}!`, "stamp");
                                }
                              }}
                              className="flex-1 py-2.5 bg-[#FF5A00] hover:bg-orange-400 text-black font-black uppercase text-[10px] rounded-lg tracking-wider cursor-pointer font-bold"
                            >
                              Claim Now
                            </button>
                            <button
                              onClick={() => {
                                playBeep(330, "sine", 0.05);
                                setHasPromptedLoyaltyForThisTx(true);
                                triggerToast("Loyalty stamps skipped.", "info");
                              }}
                              className="py-2.5 px-3 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 uppercase text-[10px] rounded-lg tracking-wider cursor-pointer"
                            >
                              Skip
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Anonymous profile sign up scenario */
                        <div className="space-y-3">
                          <p className="text-[10px] text-zinc-400 leading-normal">
                            Stamps are reserved for registered rockers. Create your profile below to claim them!
                          </p>

                          <div className="space-y-2.5 bg-black/60 p-2.5 rounded-lg border border-zinc-900">
                            <div>
                              <label className="text-[8.5px] uppercase tracking-wider text-zinc-500 block">Email Address</label>
                              <input
                                type="email"
                                value={loyaltyEmailInput}
                                onChange={(e) => setLoyaltyEmailInput(e.target.value)}
                                placeholder="name@domain.com"
                                className="w-full bg-black border border-zinc-800 text-[11px] font-mono mt-0.5 p-1.5 rounded text-white focus:outline-none focus:border-[#FF5A00]"
                              />
                            </div>
                            <div>
                              <label className="text-[8.5px] uppercase tracking-wider text-zinc-500 block">Choose Rockstar Username</label>
                              <input
                                type="text"
                                value={loyaltyUsernameInput}
                                onChange={(e) => setLoyaltyUsernameInput(e.target.value)}
                                placeholder="e.g. RocoLegend"
                                className="w-full bg-black border border-zinc-800 text-[11px] font-mono mt-0.5 p-1.5 rounded text-white focus:outline-none focus:border-[#FF5A00]"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (!loyaltyEmailInput.trim() || !loyaltyUsernameInput.trim()) {
                                  triggerToast("Please enter an email and username!", "info");
                                  return;
                                }
                                playBeep(880, "sine", 0.1);
                                setUserProfile({
                                  email: loyaltyEmailInput.trim(),
                                  username: loyaltyUsernameInput.trim()
                                });
                                setHasPromptedLoyaltyForThisTx(true);
                                const nextStamps = stamps + earnedStampsPending;
                                setStamps(nextStamps % 10);
                                if (nextStamps >= 10) {
                                  triggerToast("🎉 LOYALTY UNLOCKED: Free drink earned! Tell Roco Crew!", "stamp");
                                } else {
                                  triggerToast(`Registered! +${earnedStampsPending} stamps collected to @${loyaltyUsernameInput.trim()}!`, "stamp");
                                }
                              }}
                              className="flex-1 py-2 bg-[#FF5A00] hover:bg-orange-400 text-black font-black uppercase text-[10px] rounded-lg tracking-wider cursor-pointer font-bold"
                            >
                              Claim & Create Profile
                            </button>
                            <button
                              onClick={() => {
                                playBeep(330, "sine", 0.05);
                                setHasPromptedLoyaltyForThisTx(true);
                                triggerToast("Anonymous payment completed.", "info");
                              }}
                              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 uppercase text-[10px] rounded-lg tracking-wider cursor-pointer"
                            >
                              Skip
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-[#1C1C1E] rounded-lg border border-dashed border-emerald-500/20 text-[10px] font-mono leading-relaxed text-emerald-400 flex items-center gap-1.5 max-w-[340px] text-left">
                      <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" /> 
                      <span>Loyalty stamps checked (Current session finalized). Keep rockin'!</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleExportPaymentReceipt}
                    className="w-full py-3.5 bg-zinc-900 hover:bg-[#FF5A00] text-white hover:text-black border border-zinc-800 hover:border-transparent rounded-xl flex items-center justify-center gap-1.5 font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow active:scale-95"
                  >
                    <Download className="w-4 h-4 text-[#FF5A00]" /> Export Payment Receipt
                  </button>

                  <button
                    onClick={() => {
                      playBeep(450, "sine", 0.08);
                      setIsBillOpen(false);
                      setPaymentScreenStep("SELECT");
                    }}
                    className="w-full py-4 bg-[#FF5A00] hover:bg-orange-400 text-[#121212] font-sub font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer transform active:scale-95 shadow-md flex items-center justify-center gap-1.5"
                  >
                    CONTINUE DINING <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
            </>
          )}
        </>
      ) : (
        <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 min-h-[calc(100vh-80px)] select-text">
                      {/* Staff View Header Area */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1C1C1E] border border-zinc-800/80 p-5 rounded-3xl shadow-2xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 font-sans">
              <img
                src="https://www.rocomamas.co.ke/images//logo-combined.png"
                alt="RocoMamas Logo"
                className="h-16 w-auto object-contain hover:scale-105 hover:rotate-3 transition-transform duration-300 pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-[#FF5A00] text-black font-mono text-[9px] font-black uppercase rounded tracking-widest flex items-center gap-1">
                    Staff View Active
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h1 className="font-display tracking-[0.1em] text-3xl font-black text-white uppercase mt-1 drop-shadow-md">
                  <span className="text-[#FF5A00]">OS</span>
                </h1>
                <p className="text-[10px] font-mono tracking-wider text-zinc-550 uppercase mt-1">
                  ON DUTY: ROCO CREW • LOGGED IN SINCE {shiftStartTime} • TABLE {currentTableId} ATTACHED
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto self-stretch sm:self-center">
              {/* BELL NOTIFICATIONS TRIGGER */}
              <button
                onClick={() => {
                  playBeep(440, "sine", 0.08);
                  setIsAlertsModalOpen(true);
                }}
                className={`relative p-3.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  activeAlertsCount > 0 
                    ? "bg-red-950/40 border-red-500/50 text-red-500 hover:bg-red-950/60 shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse" 
                    : "bg-black border-zinc-800 text-zinc-400 hover:text-white"
                }`}
                title="Active Waiter Calls Feed"
              >
                <Bell className={`w-5 h-5 ${activeAlertsCount > 0 ? "animate-bounce" : ""}`} />
                {activeAlertsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-mono text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-black shadow-md">
                    {activeAlertsCount}
                  </span>
                )}
              </button>

              {/* RECONNECT TO TABLE VIEW */}
              <button
                onClick={() => {
                  playBeep(523.25, "sine", 0.1);
                  setAppMode("CUSTOMER");
                  triggerToast(`Reconnected to Table ${currentTableId} self-ordering UI`, "info");
                }}
                className="flex-1 sm:flex-initial px-4.5 py-3.5 bg-[#FF5A00] hover:bg-orange-400 active:scale-95 text-[#121212] font-sub font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-400/20 font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> ➔ CUSTOMER VIEW
              </button>
            </div>
          </div>

          {/* ROCOMAMAS OS TEAM MANUAL & OPERATING HANDBOOK */}
          <div className="bg-[#1C1C1E] rounded-3xl border border-zinc-800/80 p-5 shadow-2xl flex flex-col gap-4 animate-fadeIn transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/25 flex items-center justify-center text-base shadow-inner text-[#FF5A00]">
                  📖
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-[#FF5A00] uppercase text-xs tracking-wider">
                    📖 ROCOMAMAS OS OPERATIONAL HANDBOOK
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5 animate-pulse">
                    MASTER CONTROL & STAFF SYSTEM DIRECTIVES • SECURE CONSOLE
                  </p>
                </div>
              </div>

              {/* Handbook tab selectors */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["seating", "orders", "chat", "menu", "summons", "blueprint", "security"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      playBeep(450, "triangle", 0.05);
                      setManualActiveTab(tab);
                    }}
                    className={`px-3 py-1 font-mono text-[9px] font-extrabold rounded-md uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      manualActiveTab === tab
                        ? "bg-[#FF5A00] text-[#121212] font-black shadow-md shadow-orange-500/10"
                        : "bg-black/60 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-850"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content per active handbook page tab */}
            <div className="p-4 bg-black/65 rounded-2xl border border-zinc-900 min-h-[140px] flex items-center">
              {manualActiveTab === "seating" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-black tracking-widest">01 / Blueprint Map Control</span>
                    <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                      The seating blueprint lets you manage the Roco pub tables' active states: <span className="text-zinc-100 font-semibold">Available</span>, <span className="text-emerald-400 font-semibold">Occupied</span>, <span className="text-orange-400 font-semibold">Booked</span>, or <span className="text-red-400 font-semibold">Cleanup</span>. 
                    </p>
                    <p className="text-[10.5px] text-zinc-400 leading-normal font-sans">
                      Flip these statuses in real-time to organize queue flow. A high-contrast orange halo highlights table cards matching the scanned URL parameter.
                    </p>
                  </div>
                  <div className="border-l border-zinc-900 pl-4 space-y-2">
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">CREW PROTOCOLS:</span>
                    <ul className="text-xs space-y-1 font-mono text-zinc-400">
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#FF5A00]">•</span>
                        <span>Use table QR code links for instant digital billing access.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#FF5A00]">•</span>
                        <span>Seating map automatically alerts overlapping table reservation times.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {manualActiveTab === "orders" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-black tracking-widest">02 / Live Orders Pipeline</span>
                    <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                      When a guest submits a food request from their device, it registers instantly inside the <span className="text-white font-semibold">New Incoming Queue</span> with audio telemetry checks.
                    </p>
                    <p className="text-[10.5px] text-zinc-400 leading-normal font-sans">
                      Verify client-entered custom instructions (e.g. <span className="italic text-amber-500">"No onions, extra ice"</span>) before clicking <span className="text-[#FF5A00] font-bold">Accept & Deliver</span> to dispatch ingredients to the grill.
                    </p>
                  </div>
                  <div className="border-l border-zinc-900 pl-4 space-y-2">
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">PIPELINE STANDARDS:</span>
                    <ul className="text-xs space-y-1 font-mono text-zinc-400">
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#FF5A00]">•</span>
                        <span>Ask Kitchen allows quick, zero-contact cooking inquiries.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#FF5A00]">•</span>
                        <span>Delivered orders instantly increment live Table Master Bills.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {manualActiveTab === "chat" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-black tracking-widest">03 / Patrons Communication Terminal</span>
                    <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                      Avoid walking across the lounge just for water! RocoMamas OS supports a direct, real-time <span className="text-white font-semibold">Interactive Lounge Chat Lobby</span> linking Table Tablets and Roco Crewhouse.
                    </p>
                    <p className="text-[10.5px] text-zinc-400 leading-normal font-sans">
                      Change the Table select filter to inspect private feedback, answer queries, or confirm drink deliveries instantly from the sidebar console.
                    </p>
                  </div>
                  <div className="border-l border-zinc-900 pl-4 space-y-2">
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">TELEMETRY GUIDELINES:</span>
                    <ul className="text-xs space-y-1 font-mono text-zinc-400">
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#FF5A00]">•</span>
                        <span>Messages utilize springy sliders on patrons' mobile view.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#FF5A00]">•</span>
                        <span>Dispatched replies execute acoustic haptic buzzes on the guest's browser.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {manualActiveTab === "menu" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-black tracking-widest">04 / Stock Inventory Manager</span>
                    <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                      The <span className="text-white font-semibold">Live Stock & Menu Manager</span> gives full-stack capability to edit and customize available stock or menu specials without stopping Web servers.
                    </p>
                    <p className="text-[10.5px] text-zinc-400 leading-normal font-sans">
                      Specify prices, input Unsplash URLs, or toggle popularity tags. Press the trash button or toggle status checkbox to hide out-of-stock items dynamically.
                    </p>
                  </div>
                  <div className="border-l border-zinc-900 pl-4 space-y-2">
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">INVENTORY RULES:</span>
                    <ul className="text-xs space-y-1 font-mono text-zinc-400">
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#FF5A00]">•</span>
                        <span>Ensure Specials tag is ticked for promo listings to render on feed.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#FF5A00]">•</span>
                        <span>Edits persist across Customer & Staff views instantly inside the DOM.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {manualActiveTab === "summons" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-black tracking-widest">05 / Distress Summoning Protocols</span>
                    <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                      When physical assist is demanded (napkins, ice, clean cutlery), guests send a direct <span className="text-red-500 font-semibold animate-pulse">Call Waiter Summons</span>.
                    </p>
                    <p className="text-[10.5px] text-zinc-400 leading-normal font-sans">
                      The affected Table blueprint will instantly glow in deep red with acoustic buzzer. Serve the client, then click <span className="text-[#FF5A00] font-bold">Dismiss Code Red</span> on that table card to silence the alarm.
                    </p>
                  </div>
                  <div className="border-l border-zinc-900 pl-4 space-y-2">
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">SUMMONS STANDARDS:</span>
                    <ul className="text-xs space-y-1 font-mono text-zinc-400">
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#FF5A00]">•</span>
                        <span>Table card alarms beat independently for multithreading.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-[#FF5A00]">•</span>
                        <span>Top alarm bell counter indicates total pending crew call requests.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {manualActiveTab === "blueprint" && (
                <div className="flex flex-col gap-4 w-full text-left">
                  {/* Blueprint Control Panel Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/50">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-black tracking-widest">LUTHO CORE BLUEPRINT SPECIFICATION</span>
                      <p className="text-[11px] text-zinc-300">
                        Map of requirements, schemas, and technical guidelines for the Lutho platform blueprint.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto">
                      <button
                        onClick={() => {
                          playBeep(450, "sine", 0.05);
                          setBlueprintDocMode("PRD");
                        }}
                        className={`flex-1 sm:flex-initial px-3 py-1.5 font-mono text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                          blueprintDocMode === "PRD"
                            ? "bg-[#FF5A00]/15 text-[#FF5A00] border border-[#FF5A00]/30 font-black"
                            : "bg-black text-zinc-400 hover:text-white border border-zinc-805"
                        }`}
                      >
                        📄 PRD DOCUMENT
                      </button>
                      <button
                        onClick={() => {
                          playBeep(550, "sine", 0.05);
                          setBlueprintDocMode("TRD");
                        }}
                        className={`flex-1 sm:flex-initial px-3 py-1.5 font-mono text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                          blueprintDocMode === "TRD"
                            ? "bg-[#FF5A00]/15 text-[#FF5A00] border border-[#FF5A00]/30 font-black"
                            : "bg-black text-zinc-400 hover:text-white border border-zinc-805"
                        }`}
                      >
                        ⚙️ TRD DOCUMENT
                      </button>
                    </div>
                  </div>

                  {/* Document View & Text Box */}
                  <div className="bg-black/90 rounded-2xl border border-zinc-900 p-5 mt-1 relative font-sans leading-relaxed text-zinc-350 text-xs">
                    {/* Floating Export Controls */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button
                        onClick={() => {
                          const content = blueprintDocMode === "PRD" ? LUTHO_PRD_CONTENT : LUTHO_TRD_CONTENT;
                          navigator.clipboard.writeText(content);
                          triggerToast(`${blueprintDocMode} copied to clipboard! 📋`, "success");
                        }}
                        className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[8.5px] font-mono uppercase tracking-wider font-bold"
                        title="Copy to Clipboard"
                      >
                        📋 Copy text
                      </button>
                      <button
                        onClick={() => {
                          const content = blueprintDocMode === "PRD" ? LUTHO_PRD_CONTENT : LUTHO_TRD_CONTENT;
                          const filename = blueprintDocMode === "PRD" ? "lutho_prd.md" : "lutho_trd.md";
                          const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.setAttribute("href", url);
                          link.setAttribute("download", filename);
                          link.style.visibility = "hidden";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          triggerToast(`Successfully exported ${filename}! 📥`, "success");
                        }}
                        className="p-1.5 bg-zinc-900 hover:bg-[#FF5A00]/20 text-zinc-400 hover:text-[#FF5A00] border border-zinc-800 hover:border-[#FF5A00]/30 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[8.5px] font-mono uppercase tracking-wider font-bold"
                        title="Download Markdown File"
                      >
                        📥 Export .MD
                      </button>
                    </div>

                    {/* Styled Markdown Viewport */}
                    <div className="max-h-[380px] overflow-y-auto pr-3 space-y-4 font-normal scrollbar-thin select-text">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 pb-2 border-b border-zinc-900 mb-4 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A00]/40 animate-pulse" />
                        <span>ACTIVE BLUEPRINT BLUEPRINT FRAMEPLATE:</span>
                        <span className="text-zinc-200 px-1.5 py-0.5 bg-zinc-900 rounded font-bold">{blueprintDocMode} VIEW</span>
                      </div>
                      
                      {blueprintDocMode === "PRD" ? (
                        <div className="space-y-4 text-xs font-sans text-zinc-300">
                          <h4 className="text-base font-black text-white font-display tracking-wide uppercase border-l-2 border-[#FF5A00] pl-2">Product Requirements Document (PRD)</h4>
                          <h5 className="text-xs font-bold text-[#FF5A05] font-mono">VISION STATEMENT</h5>
                          <p className="text-zinc-400 leading-relaxed text-left">
                            Lutho represents the "North Star" digital dining ecosystem. It is designed to modernize and streamline the dining experience by bridging the gap between sit-down patrons and active restaurant staff. It maps physical table locations into live-syncing customer interfaces.
                          </p>
                          
                          <h5 className="text-xs font-bold text-[#FF5A05] font-mono">FUNCTIONAL REQUIREMENT SCOPE</h5>
                          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 font-mono text-[10.5px] text-zinc-300 space-y-2 text-left">
                            <p className="text-[#FF5A00] font-semibold">1. Table Coordinates Mapping (CRITICAL):</p>
                            <p className="text-zinc-400 pl-3">Scans URL parameter strings to anchor device sockets seamlessly.</p>
                            
                            <p className="text-[#FF5A00] font-semibold">2. Live Group Split Checkout (HIGH):</p>
                            <p className="text-zinc-400 pl-3">Resolves bills natively in parallel for peer guests at shared dining tables.</p>
                            
                            <p className="text-[#FF5A00] font-semibold">3. Multi-Device Acoustic Telemetry (HIGH):</p>
                            <p className="text-zinc-400 pl-3">Delivers responsive Web Audio oscillator notifications instantly across devices.</p>
                            
                            <p className="text-[#FF5A00] font-semibold">4. Live Stock Override Console (HIGH):</p>
                            <p className="text-zinc-400 pl-3">Allows editing specials, stock availability status, and items description without severing sessions.</p>
                          </div>
                          
                          <h5 className="text-xs font-bold text-[#FF5A05] font-mono">NON-FUNCTIONAL STABILITY MANDATES</h5>
                          <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-1 text-left">
                            <li><strong className="text-zinc-200">State Synced:</strong> Action changes propagate across views in under 250ms.</li>
                            <li><strong className="text-zinc-200">Acoustics:</strong> Oscillator wave models bypass slow MP3 asset streaming.</li>
                            <li><strong className="text-zinc-200">Optimized Night-Theme:</strong> Vermillion vermin tones on safe dark palettes.</li>
                          </ul>
                        </div>
                      ) : (
                        <div className="space-y-4 text-xs font-sans text-zinc-300">
                          <h4 className="text-base font-black text-white font-display tracking-wide uppercase border-l-2 border-[#FF5A00] pl-2">Technical Requirements Document (TRD)</h4>
                          <h5 className="text-xs font-bold text-[#FF5A05] font-mono">BLUEPRINT STACK & INTERFACES</h5>
                          <p className="text-zinc-400 leading-relaxed text-left">
                            Calculated for low-latency, friction-free sit-down lounge networks using lightweight server endpoints.
                          </p>
                          <h5 className="text-xs font-bold text-[#FF5A05] font-mono">DATABASE DOCUMENT PATTERN COLLECTION</h5>
                          <pre className="p-4 bg-zinc-950 rounded-xl text-[9.5px] font-mono border border-zinc-900 text-[#FF5A00] overflow-x-auto text-left leading-normal">
{`{
  "title": "LuthoTableRoom",
  "$schema": "https://json-schema.org/draft-07/schema#",
  "properties": {
    "tableId": { "type": "string" },
    "sessionActive": { "type": "boolean" },
    "waiterAssigned": { "type": "string" },
    "membersList": [ { "id": "string", "nickname": "string" } ],
    "orderItems": [ { "orderId": "string", "price": "number", "status": "PENDING" } ]
  }
}`}
                          </pre>

                          <h5 className="text-xs font-bold text-[#FF5A05] font-mono">SYNTHESIZED OSCILLATOR ALGORITHM</h5>
                          <pre className="p-4 bg-zinc-950 rounded-xl text-[9.5px] font-mono border border-zinc-900 text-zinc-400 overflow-x-auto text-left leading-normal">
{`function playBeep(frequency, type, duration) {
  const audioCtx = new AudioContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}`}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {manualActiveTab === "security" && (
                <div className="flex flex-col gap-4 w-full text-left font-sans animate-fade-in">
                  {/* Security Center Header Banner */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-red-950/20 border border-red-500/20 rounded-xl gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-ping" />
                        <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-black tracking-widest flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" /> LUTHO SHIELD SECURITY GATEWAY CONTROL ACTIVE
                        </span>
                      </div>
                      <p className="text-xs text-zinc-350 leading-relaxed max-w-xl">
                        This panel manages table-level security tokens, rotatable PIN passcodes, brute-force rate-limiting locks, and audit logs. Sequential "?table=" URL tampering is actively mitigated.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        ROCO_TABLES.forEach(table => {
                          rotateTableSecurity(table.id);
                        });
                        triggerToast("ROCO-SHIELD: Rotated credentials for ALL active tables!", "success");
                      }}
                      className="px-3.5 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-500 hover:text-white font-mono text-[9px] font-black uppercase rounded-lg tracking-wider transition-all cursor-pointer self-stretch sm:self-auto text-center"
                    >
                      🔄 Purge & Rotate All Tables
                    </button>
                  </div>

                  {/* Two-Column split panel */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                    
                    {/* Left Column: Tables secure configurations grid (8 cols) */}
                    <div className="xl:col-span-8 space-y-3">
                      <span className="text-[9.5px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">
                        🛡️ ACTIVE TABLE KEYPLATES & ENCRYPTION STATUS
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ROCO_TABLES.map((table) => {
                          const tableId = table.id;
                          const config = tableSecurityConfigs[tableId] || generateDefaultConfig(tableId);
                          let unlockedRegistry: Record<string, string> = {};
                          try {
                            const saved = localStorage.getItem("roco_unlocked_table_tokens");
                            if (saved) unlockedRegistry = JSON.parse(saved);
                          } catch {}
                          const isCurrentlyUnlocked = unlockedRegistry[tableId] === config.secureToken;

                          return (
                            <div 
                              key={tableId}
                              className="bg-black/40 border border-zinc-90 w-full p-3 rounded-xl hover:border-zinc-800 transition-all space-y-2.5 relative overflow-hidden"
                            >
                              {/* Top segment */}
                              <div className="flex justify-between items-center bg-zinc-950/50 p-1.5 rounded-lg border border-zinc-900/60">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-[#FF5A00]/10 border border-[#FF5A00]/25 rounded flex items-center justify-center font-display text-xs text-[#FF5A00] font-black">
                                    T{tableId}
                                  </div>
                                  <span className="text-[10px] font-mono text-zinc-200 uppercase font-bold">
                                    {table.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrentlyUnlocked ? "bg-emerald-500 animate-pulse" : "bg-zinc-750"}`} />
                                  <span className="text-[8px] font-mono text-zinc-550 uppercase">
                                    {isCurrentlyUnlocked ? "UNLOCKED" : "LOCKED"}
                                  </span>
                                </div>
                              </div>

                              {/* Keys Info */}
                              <div className="space-y-1 font-mono text-[9px] text-zinc-400">
                                <div className="flex justify-between items-center bg-zinc-950 p-1 px-1.5 rounded border border-zinc-90 w-full">
                                  <span className="text-zinc-550">PASSCODE PIN:</span>
                                  <span className="text-white font-bold select-all bg-black/50 px-1 py-0.5 rounded border border-zinc-900">{config.pin}</span>
                                </div>
                                <div className="flex justify-between items-center bg-zinc-950 p-1 px-1.5 rounded border border-zinc-90 w-full overflow-hidden font-sans">
                                  <span className="text-zinc-550 shrink-0 font-mono text-[9px]">SECURE TOKEN:</span>
                                  <span className="text-zinc-450 truncate max-w-[124px] select-all bg-black/50 px-1 py-0.5 rounded border border-zinc-950" title={config.secureToken}>
                                    {config.secureToken}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-0.5 px-1 w-full text-[8px] text-zinc-550">
                                  <span>LAST ROTATED:</span>
                                  <span>{new Date(config.rotatedAt).toLocaleTimeString()}</span>
                                </div>
                              </div>

                              {/* Actions footer */}
                              <div className="flex gap-2.5 pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    playBeep(450, "sine", 0.05);
                                    rotateTableSecurity(tableId);
                                  }}
                                  className="flex-1 py-1 bg-black hover:bg-[#1C1C1E] border border-zinc-850 hover:border-zinc-800 text-zinc-400 font-mono text-[8.5px] font-black uppercase rounded cursor-pointer transition-all hover:text-[#FF5A00]"
                                >
                                  🔄 Rotate Key
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    playBeep(450, "sine", 0.05);
                                    const updatedRegistry: Record<string, string> = { ...unlockedRegistry };
                                    if (isCurrentlyUnlocked) {
                                      delete updatedRegistry[tableId];
                                      triggerToast(`Table ${tableId} manually LOCKED!`, "info");
                                      logSecurityEvent("ROTATED", `Table ${tableId} session manually closed & locked by crew directive.`, tableId);
                                    } else {
                                      updatedRegistry[tableId] = config.secureToken;
                                      triggerToast(`Table ${tableId} manually UNLOCKED!`, "success");
                                      logSecurityEvent("SUCCESS", `Table ${tableId} manually bypass-unlocked by crew command.`, tableId);
                                    }
                                    localStorage.setItem("roco_unlocked_table_tokens", JSON.stringify(updatedRegistry));
                                    setTableSecurityConfigs(prev => ({ ...prev, [tableId]: config }));
                                  }}
                                  className={`px-2 py-1 border font-mono text-[8.5px] font-[#121212] font-black uppercase rounded cursor-pointer transition-all ${
                                    isCurrentlyUnlocked 
                                      ? "bg-red-950/20 hover:bg-red-950 border-red-500/20 text-red-500" 
                                      : "bg-emerald-950/20 hover:bg-emerald-950 border-emerald-500/20 text-emerald-500"
                                  }`}
                                >
                                  {isCurrentlyUnlocked ? "Lock" : "Bypass PIN"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Real-Time Security Auditing (4 cols) */}
                    <div className="xl:col-span-4 space-y-4 animate-fade-in">
                      
                      {/* Sub-Panel 1: Real-time Telemetry state statistics */}
                      <div className="bg-black/80 border border-zinc-900 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">
                          ⚡ LUTHO SHIELD ACTIVE FIREWALL TELEMETRY
                        </span>
                        
                        <div className="space-y-1.5 text-[10.5px]">
                          <div className="flex justify-between items-center py-1 border-b border-zinc-900/40">
                            <span className="text-zinc-400 font-sans">Brute-Force Rate Limiter:</span>
                            <span className="text-[#FF5A00] font-mono font-bold">5 REQS / 30s</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-zinc-900/40">
                            <span className="text-zinc-400 font-sans">Encryption Protocol:</span>
                            <span className="text-zinc-400 font-mono font-bold">SHA-256 Mock Sign</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-zinc-900/40">
                            <span className="text-zinc-400 font-sans">Anti-Tamper Lock:</span>
                            <span className="text-emerald-500 font-mono font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SECURE TOKENS ON
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-zinc-400 font-sans">Active Sessions Key:</span>
                            <span className="text-zinc-300 font-mono font-bold select-all">
                              {Object.keys(localStorage.getItem("roco_unlocked_table_tokens") ? JSON.parse(localStorage.getItem("roco_unlocked_table_tokens") || "{}") : {}).length} Active Sessions
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sub-Panel 2: Security Real-Time Audit Log Console */}
                      <div className="bg-[#050505] border border-zinc-900 p-4 rounded-xl space-y-3 font-sans">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                          <span className="text-[9px] font-mono text-[#FF5A00] uppercase tracking-widest block font-bold">
                            👁️ LUTHO-SHIELD REAL-TIME AUDIT LOG
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => {
                              playBeep(320, "sine", 0.05);
                              setSecurityAuditLogs([]);
                              localStorage.removeItem("roco_security_audit_logs");
                              triggerToast("Security Audit logs purged!", "info");
                            }}
                            className="text-[8px] font-mono text-zinc-550 hover:text-white uppercase leading-none cursor-pointer underline"
                          >
                            Purge
                          </button>
                        </div>

                        {/* Scrolling Log console content */}
                        <div className="max-h-[224px] overflow-y-auto space-y-2 pr-1 font-mono text-[9px] scrollbar-thin">
                          {securityAuditLogs.length === 0 ? (
                            <p className="text-zinc-500 italic text-center py-4">
                              -- Security Audit Log Console Idle --<br />
                              Table access attempts appear here live.
                            </p>
                          ) : (
                            securityAuditLogs.map((log) => {
                              const badgeColors = {
                                SUCCESS: "text-emerald-500 bg-emerald-950/25 border-emerald-500/10",
                                FAILED: "text-red-500 bg-red-950/25 border-red-500/10",
                                ROTATED: "text-amber-500 bg-amber-950/25 border-amber-550/10",
                                BLOCK: "text-red-400 bg-red-950 border-red-500/20 animate-pulse"
                              };
                              return (
                                <div 
                                  key={log.id}
                                  className="p-2 bg-black border border-zinc-900 rounded space-y-1"
                                >
                                  <div className="flex justify-between items-center flex-wrap gap-1 leading-none">
                                    <span className={`px-1.5 py-0.5 rounded uppercase font-black text-[7.5px] border ${badgeColors[log.type]}`}>
                                      {log.type}
                                    </span>
                                    <span className="text-[7.5px] text-zinc-500">
                                      {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <p className="text-[8.5px] text-zinc-400 leading-normal">
                                    {log.message}
                                  </p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MAIN PORTAL SPLIT: Tables Grid Left & New Orders Live Queue Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SECTION 1: ASSIGNED TABLES CONTROL & LOBBY (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              
              {/* LIVE SEATING PLAN CONTROL PANEL */}
              <div className="bg-[#1C1C1E] p-4.5 rounded-2xl border border-zinc-900 shadow-xl flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
                  <div>
                    <h2 className="font-display font-black text-[#FF5A00] uppercase text-sm tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#FF5A00]" /> SEATING MAP CONTROL (BLUEPRINT)
                    </h2>
                    <p className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest mt-0.5">
                      SEAT CUSTOMERS AND SCAN AUTOMATIC QR BILL CODES
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        setIsCustomQrPanelOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-[#FF5A00]/15 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-black border border-[#FF5A00]/30 hover:border-transparent font-mono text-[9.5px] font-black uppercase rounded-lg tracking-wider transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" /> 🎫 QR CUSTOMIZER & EXPORTER
                    </button>
                    <button
                      onClick={() => {
                        playBeep(550, "sine", 0.05);
                        setIsPosConfigOpen(true);
                      }}
                      className={`px-2.5 py-1.5 font-mono text-[9.5px] font-black uppercase rounded-lg tracking-wider transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer border ${
                        isPosConnected 
                          ? "bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]" 
                          : "bg-zinc-900/60 hover:bg-zinc-850 text-zinc-400 border-zinc-800"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isPosConnected ? "bg-emerald-400 animate-ping" : "bg-zinc-600"}`} />
                      🔌 {isPosConnected ? `${selectedPosSystem} POS: LIVE` : "POS SYNC"}
                    </button>
                    <span className="hidden xl:inline-block text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                      • 13 SURFACES
                    </span>
                  </div>
                </div>

                {/* Grid for Table list of exactly 13 blueprint surfaces */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ROCO_TABLES.map((table) => {
                    const tableId = table.id;
                    const tableBookings = bookings.filter(b => b.tableId === tableId);
                    const currentStatus = tablesState[tableId] || "Available";
                    const hasAlert = tableId === currentTableId ? waiterSummoned : tableAlerts[tableId];

                    let borderStyle = "border-zinc-850 bg-[#121212]/40";
                    let statusLabelColor = "text-zinc-500";
                    
                    if (currentStatus === "Occupied") {
                      borderStyle = "border-emerald-550/40 bg-emerald-950/10 shadow-[0_0_12px_rgba(16,185,129,0.12)]";
                      statusLabelColor = "text-emerald-400 font-extrabold";
                    } else if (currentStatus === "Booked") {
                      borderStyle = "border-dashed border-orange-500/50 bg-orange-950/10 shadow-[0_0_12px_rgba(249,115,22,0.12)]";
                      statusLabelColor = "text-orange-400";
                    } else if (currentStatus === "Pending Cleanup") {
                      borderStyle = "border-red-500 bg-red-955/10 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-pulse-slow";
                      statusLabelColor = "text-red-400";
                    }

                    if (hasAlert) {
                      borderStyle = "border-2 border-red-550 bg-red-905/20 shadow-[0_0_20px_rgba(239,68,68,0.35)] animate-pulse";
                    }

                    // QR Code generator URL pointing to simulated table order URL
                    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getSecureGuestUrl(tableId))}`;

                    return (
                      <div
                        key={tableId}
                        className={`p-3.5 rounded-xl border flex flex-row items-center gap-4 relative transition-all hover:scale-[1.01] ${borderStyle}`}
                      >
                        {/* Assistance call banner */}
                        {hasAlert && (
                          <div className="absolute -top-1.5 left-4 bg-red-650 text-white font-mono text-[7px] font-black tracking-widest px-2 py-0.5 rounded flex items-center gap-1 uppercase select-none shadow z-10">
                            <span className="w-1 h-1 rounded-full bg-white animate-ping" /> SUMMONS
                          </div>
                        )}

                        {/* LEFT: Info & Controls */}
                        <div className="flex-1 flex flex-col justify-between h-full gap-2.5">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block leading-none">Table Selection</span>
                              <h4 className="font-display font-black text-white text-sm leading-none mt-1 uppercase flex items-center gap-1.5">
                                T-{tableId.padStart(2, "0")}
                                <span className="text-[8.5px] tracking-wider font-extrabold text-[#FF5A00]">
                                  ({table.type})
                                </span>
                              </h4>
                            </div>

                            {tableId === currentTableId && (
                              <span className="text-[7.5px] font-mono text-[#FF5A00] bg-[#FF5A00]/10 border border-[#FF5A00]/20 px-1 py-0.5 rounded font-black uppercase">
                                SCANNED
                              </span>
                            )}
                          </div>

                          {/* Direct display table shape preview */}
                          <div className="flex items-center gap-2 py-1 px-2 bg-black/45 rounded-lg border border-zinc-900 w-fit">
                            <span className="text-[9px] font-mono text-zinc-400 uppercase leading-none">Shape:</span>
                            {table.type === "booth" && (
                              <span className="text-[8.5px] font-mono text-zinc-350 flex items-center gap-1">
                                <span className="w-2.5 h-2 bg-[#FF5A00]/30 border border-[#FF5A00]/50 rounded-sm inline-block" /> 
                                {table.orientation === "vertical" ? "VERT BOOTH" : "HORIZ BOOTH"}
                              </span>
                            )}
                            {table.type === "round" && (
                              <span className="text-[8.5px] font-mono text-zinc-350 flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A00]/30 border border-[#FF5A00]/50 inline-block" /> 
                                ROUND TABLE
                              </span>
                            )}
                            {table.type === "small" && (
                              <span className="text-[8.5px] font-mono text-zinc-350 flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rotate-45 bg-[#FF5A00]/30 border border-[#FF5A00]/50 inline-block" /> 
                                SMALL DIAMOND
                              </span>
                            )}
                            <span className="text-[8.5px] font-mono text-zinc-500">• {table.capacity} PAX</span>
                          </div>

                          {/* Interactive Status dropdown switch inside card */}
                          <div className="space-y-1">
                            <label className="text-[8px] font-mono uppercase tracking-wider text-zinc-550 block">Status Selection</label>
                            <select
                              value={currentStatus}
                              onChange={(e) => {
                                const newVal = e.target.value as any;
                                playBeep(450, "sine", 0.05);
                                setTablesState(prev => ({ ...prev, [tableId]: newVal }));
                                triggerToast(`Table ${tableId} seating plan updated to ${newVal}!`, "success");
                              }}
                              className="w-full bg-black border border-zinc-850 text-[10.5px] font-mono p-1.5 rounded-lg text-white font-bold tracking-wider focus:outline-none focus:border-[#FF5A00] cursor-pointer uppercase"
                            >
                              <option value="Available" className="bg-[#1C1C1E] text-zinc-500">Available</option>
                              <option value="Occupied" className="bg-[#1C1C1E] text-emerald-400 font-bold">Occupied</option>
                              <option value="Booked" className="bg-[#1C1C1E] text-orange-400">Booked</option>
                              <option value="Pending Cleanup" className="bg-[#1C1C1E] text-red-400">Cleanup</option>
                            </select>
                          </div>

                          {/* Booked Slots List for Staff */}
                          {tableBookings.length > 0 && (
                            <div className="bg-orange-950/20 border border-orange-500/25 p-2 rounded-lg flex flex-col gap-1.5 text-[9px] w-full">
                              <p className="font-mono font-black text-orange-400 uppercase tracking-wider flex items-center gap-1">
                                <span>📅 BOOKED SLOTS ({tableBookings.length}):</span>
                              </p>
                              <div className="space-y-1.5 max-h-[75px] overflow-y-auto font-mono scrollbar-thin">
                                {tableBookings.map((b) => (
                                  <div key={b.id} className="text-zinc-300 border-b border-zinc-900/80 last:border-0 pb-1 last:pb-0 text-left">
                                    <p className="font-extrabold text-[#FF5A00] flex justify-between">
                                      <span>@{b.name}</span>
                                      <span className="text-zinc-500 font-normal">{b.guests} PAX</span>
                                    </p>
                                    <p className="text-zinc-400 text-[8px] mt-0.5 leading-none">
                                      {b.date} &bull; <span className="text-white font-bold">{b.time}</span>
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Direct Resolve button or inspect details */}
                          <div className="flex flex-col gap-1.5 pt-1 border-t border-zinc-900/60">
                            {hasAlert ? (
                              <button
                                onClick={() => {
                                  playBeep(523, "sine", 0.08);
                                  handleResolveAlertForTable(tableId);
                                }}
                                className="w-full py-1 bg-red-650 hover:bg-red-500 text-white font-mono text-[9px] font-black uppercase rounded-lg tracking-wider animate-pulse transition-colors cursor-pointer"
                              >
                                ✅ Dismiss Code Red
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  playBeep(400, "sine", 0.05);
                                  setSelectedStaffTable(tableId);
                                }}
                                className="w-full py-1 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-850 font-mono text-[9px] font-bold uppercase rounded-lg tracking-wider transition-colors cursor-pointer"
                              >
                                Inspect Ticket
                              </button>
                            )}
                          </div>
                        </div>

                        {/* RIGHT: Unique Halftone or Custom Uploaded QR Code display */}
                        <div className="flex flex-col items-center justify-center bg-black p-1 rounded-xl border border-orange-500/30 shrink-0 w-22 h-22 relative group/qr shadow-[0_2px_8px_rgba(0,0,0,0.8)] overflow-hidden">
                          <div className="w-[80px] h-[80px] overflow-hidden rounded-lg flex items-center justify-center bg-black">
                            {customQrs[tableId] ? (
                              <img 
                                src={customQrs[tableId]} 
                                alt={`T-${tableId} Custom QR`}
                                className="w-[80px] h-[80px] object-contain rounded"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <HalftoneQRCode 
                                text={getSecureGuestUrl(tableId)}
                                src="https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479"
                                size={80}
                                colorDark="#FF5A00"
                                colorLight="#000000"
                              />
                            )}
                          </div>
                          <a 
                            href={getSecureGuestUrl(tableId)} 
                            target="_blank" 
                            rel="noreferrer"
                            className="absolute inset-0 bg-black/85 text-white flex flex-col items-center justify-center rounded-xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-200"
                          >
                            <QrCode className="w-5 h-5 text-[#FF5A00]" />
                            <span className="text-[7.5px] font-mono font-bold mt-1 text-zinc-300 uppercase leading-none text-center px-1">GUEST LINK</span>
                          </a>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 2: LIVE NEW INCOMING ORDERS (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              {/* WAITER-TABLE CHAT LOBBY ("🔥 LIVE TABLE REQUESTS") */}
              <div className="bg-[#1C1C1E] p-4.5 rounded-2xl border border-zinc-900 shadow-xl flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#FF5A00]" />
                    <div>
                      <h3 className="font-display font-black text-white text-sm uppercase tracking-wider">
                        🔥 Roco Crew Table Chat Lobby
                      </h3>
                      <p className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest mt-0.5">
                        DIRECT COMMUNICATION FEED TO TABLE TABLETS
                      </p>
                    </div>
                  </div>

                  {/* Filter chat conversation table selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono uppercase text-zinc-500 leading-none">Table:</span>
                    <select
                      value={activeChatTableId}
                      onChange={(e) => {
                        playBeep(400, "triangle", 0.05);
                        setActiveChatTableId(e.target.value);
                      }}
                      className="bg-black border border-zinc-855 text-xs font-mono p-1 rounded font-bold text-[#FF5A00] focus:outline-none cursor-pointer"
                    >
                      {Array.from({ length: 15 }, (_, i) => String(i + 1)).map(tId => (
                        <option key={tId} value={tId} className="bg-[#1C1C1E]">T-{tId.padStart(2, "0")}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message Threads wrapper */}
                <div className="p-3 bg-black border border-zinc-850 rounded-2xl flex flex-col gap-3 min-h-[160px] max-h-[220px] overflow-y-auto shadow-inner">
                  {(() => {
                    const filteredMessages = chatMessages.filter(m => String(m.tableId) === activeChatTableId);
                    if (filteredMessages.length === 0) {
                      return (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                          <span className="text-2xl opacity-60">🦗</span>
                          <p className="text-[9.5px] font-mono text-zinc-550 uppercase tracking-wider mt-2.5">
                            No active chats with Table {activeChatTableId}.
                          </p>
                        </div>
                      );
                    }
                    return filteredMessages.map((msg, i) => {
                      const isStaffMsg = msg.sender === "Staff";
                      return (
                        <div
                          key={msg.id || i}
                          className={`flex flex-col max-w-[85%] ${isStaffMsg ? "self-end items-end" : "self-start items-start"}`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5 text-[8.5px] font-mono uppercase text-zinc-500">
                            <span>{msg.sender === "Staff" ? "THABO (Staff)" : `TABLE ${msg.tableId}`}</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                            isStaffMsg
                              ? "bg-[#FF5A00] text-black font-medium rounded-tr-none"
                              : "bg-[#1C1C1E] border border-zinc-800 text-white rounded-tl-none"
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Reply bar interface */}
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && chatInputText.trim()) {
                        e.preventDefault();
                        // Click submit
                        const sendBtn = document.getElementById("staff-chat-send-btn");
                        if (sendBtn) sendBtn.click();
                      }
                    }}
                    placeholder={`TYPE ANSWER TO TABLE ${activeChatTableId}...`}
                    className="flex-1 bg-black border border-zinc-850 p-3 rounded-xl text-xs text-white uppercase placeholder-zinc-700 tracking-wider focus:outline-none focus:border-[#FF5A00]"
                  />
                  <button
                    id="staff-chat-send-btn"
                    onClick={() => {
                      if (!chatInputText.trim()) return;
                      playBeep(650, "sine", 0.05);

                      const newMsg = {
                        id: "c-" + Date.now().toString(36),
                        tableId: activeChatTableId,
                        sender: "Staff",
                        text: chatInputText.trim(),
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };

                      setChatMessages(prev => [...prev, newMsg]);
                      setChatInputText("");
                      triggerToast(`Dispatched message to Table ${activeChatTableId}! 💬`, "success");
                    }}
                    className="bg-[#FF5A00] hover:bg-orange-400 text-black px-4.5 rounded-xl font-sub font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 font-bold"
                  >
                    <Send className="w-3.5 h-3.5 stroke-[2.5]" /> Reply
                  </button>
                </div>
              </div>

              {/* LIVE RESERVATIONS DESK */}
              <div className="bg-[#1C1C1E] p-4.5 rounded-2xl border border-zinc-900 shadow-xl flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#FF5A00]" />
                    <div>
                      <h3 className="font-display font-black text-white text-xs uppercase tracking-wider">
                        🎫 Live Reservation Desk
                      </h3>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
                        Track customer bookings and seat tables
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-[#FF5A00] font-black uppercase bg-[#FF5A00]/10 px-2.5 py-0.5 rounded border border-[#FF5A00]/20">
                    {bookings.length} Booked
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 max-h-[190px] overflow-y-auto pr-1">
                  {bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <span className="text-xl">🎫</span>
                      <p className="text-[9.5px] font-mono text-zinc-500 uppercase mt-2">
                        No upcoming bookings recorded.
                      </p>
                    </div>
                  ) : (
                    bookings.map((booking) => {
                      const isToday = booking.date === new Date().toISOString().split('T')[0];
                      const tableStatus = tablesState[booking.tableId];
                      return (
                        <div
                          key={booking.id}
                          className="bg-black/60 border border-zinc-850 p-3 rounded-xl flex flex-col gap-2 relative"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-mono font-black text-white text-[11px] uppercase">
                                {booking.name} ({booking.guests} Guests)
                              </h4>
                              <p className="text-[9.5px] font-mono text-zinc-400 uppercase mt-0.5">
                                Date: {booking.date} • Time: {booking.time} • T{booking.tableId}
                              </p>
                            </div>
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              isToday ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-zinc-800 text-zinc-400"
                            }`}>
                              {isToday ? "Today" : "Future"}
                            </span>
                          </div>

                          {booking.specialRequests && (
                            <p className="text-[9px] font-mono text-amber-500/80 italic leading-snug">
                              "Request: {booking.specialRequests}"
                            </p>
                          )}

                          <div className="flex gap-2 pt-1 border-t border-zinc-900/60">
                            {/* Seat action */}
                            <button
                              onClick={() => {
                                playBeep(523, "sine", 0.08);
                                setTablesState(prev => ({ ...prev, [booking.tableId]: "Occupied" }));
                                setBookings(prev => prev.filter(b => b.id !== booking.id));
                                triggerToast(`Seated ${booking.name} at Table ${booking.tableId}! 🎫`, "success");
                              }}
                              className="flex-1 py-1 bg-[#FF5A00] hover:bg-orange-400 text-black font-mono text-[9px] font-black uppercase rounded-md tracking-wider transition-all transform active:scale-95"
                            >
                              🚀 Seat Party
                            </button>
                            {/* Cancel/Release booking */}
                            <button
                              onClick={() => {
                                playBeep(330, "triangle", 0.05);
                                setBookings(prev => prev.filter(b => b.id !== booking.id));
                                if (tableStatus === "Booked") {
                                  setTablesState(prev => ({ ...prev, [booking.tableId]: "Available" }));
                                }
                                triggerToast(`Cancelled booking for ${booking.name}`, "info");
                              }}
                              className="py-1 px-2.5 bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-zinc-850 hover:border-red-500/30 font-mono text-[9px] font-black uppercase rounded-md tracking-wider transition-colors"
                            >
                              Release
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              
              <div className="bg-[#1C1C1E] p-3 rounded-xl border border-zinc-900 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                  <h2 className="font-display font-black text-white uppercase text-xs tracking-widest">
                    NEW INCOMING QUEUE
                  </h2>
                </div>
                <span className="font-mono text-[9px] text-[#FF5A00] font-black uppercase bg-[#FF5A00]/10 px-2.5 py-0.5 rounded border border-[#FF5A00]/20">
                  {incomingOrders.length} New Orders
                </span>
              </div>

              {/* Scrollable list area */}
              <div className="flex flex-col gap-3.5 max-h-[440px] overflow-y-auto pr-1">
                {incomingOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-900/10 rounded-xl border border-dashed border-zinc-850 p-4">
                    <span className="text-3xl">🎉</span>
                    <h4 className="font-sub font-black text-white text-xs uppercase tracking-wider mt-3">
                      Orders Inboxes Settled
                    </h4>
                    <p className="text-[10px] text-zinc-500 max-w-[210px] mt-1 italic leading-relaxed font-sans">
                      All table ordering queues have been successfully dispatched. Ready for drinks.
                    </p>
                  </div>
                ) : (
                  incomingOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#1C1C1E] border border-zinc-850 p-4 rounded-xl flex flex-col gap-3 relative"
                    >
                      {/* Left accent color separator */}
                      <div className="absolute top-0 left-0 w-[4px] h-full bg-[#FF5A00]" />

                      {/* Header details */}
                      <div className="flex justify-between items-start pl-1">
                        <div>
                          <h4 className="font-display font-black text-white text-sm uppercase">
                            TABLE {order.tableId} ORDER
                          </h4>
                          <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-tight mt-0.5">
                            REF: {order.id} • Submitted {order.timestamp}
                          </p>
                        </div>
                        <span className="font-mono text-xs font-black text-[#FF5A00]">
                          R{order.total}
                        </span>
                      </div>

                      {/* Items breakdown list */}
                      <div className="bg-[#121212] p-2.5 rounded-lg border border-zinc-900 pl-3">
                        <ul className="flex flex-col gap-1 text-[11px] font-mono text-zinc-400">
                          {order.items.map((it: any, i: number) => (
                            <li key={i} className="flex justify-between uppercase">
                              <span>{it.quantity}x {it.menuItem.name} {it.menuItem.emoji}</span>
                              <span className="text-zinc-650">R{it.menuItem.price * it.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {order.notes && (
                        <div className="p-2 bg-amber-950/20 border border-amber-500/10 rounded-lg text-[10.5px] font-mono text-amber-500 pl-3">
                          <span className="font-bold text-amber-600">📝 NOTE:</span> "{order.notes}"
                        </div>
                      )}

                      {/* Triggers */}
                      <div className="flex gap-2 pl-1">
                        <button
                          onClick={() => handleAskKitchen(order.id)}
                          className="flex-1 py-2 bg-black hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-white font-bold text-[9.5px] uppercase rounded-lg transition-colors cursor-pointer"
                        >
                          Ask Kitchen
                        </button>

                        <button
                          onClick={() => handleAcceptIncomingOrder(order)}
                          className="flex-[2] py-2 bg-[#FF5A00] hover:bg-orange-400 text-black font-sub font-black text-[10px] uppercase tracking-wider rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer font-bold"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" /> Accept & Deliver
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
            
          </div>

          {/* STAFF LIVE PUB MENU MANAGER PANEL */}
          <div className="bg-[#1C1C1E] rounded-2xl border-2 border-zinc-900 overflow-hidden mt-6 flex flex-col font-sans shadow-xl">
            <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#FF5A00] animate-pulse" />
                <div>
                  <h3 className="font-display font-black text-white text-xs uppercase tracking-widest leading-none">
                    🍔 Live Pub Menu & Stock Manager
                  </h3>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5 font-bold">
                    Add, edit, or remove menu dishes, change images, alter prices, and control active listings in real time
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-black bg-zinc-900 border border-zinc-850 px-2.5 py-0.5 rounded">
                {menuItems.length} Total Dishes
              </span>
            </div>

            <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#121212]/30">
              
              {/* Left Column: Form (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-black/40 border border-zinc-900 p-4 rounded-xl flex flex-col gap-3 shadow-inner">
                <h4 className="font-sub font-black text-xs text-[#FF5A00] uppercase tracking-wider flex items-center gap-1 border-b border-zinc-900 pb-2">
                  <span>{editingMenuItemId ? "✏️ Edit Product Details" : "➕ Add New Pub Dish"}</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {/* Name */}
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase font-black">Dish Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Bacon Cheese Bomb Burger"
                      value={staffMenuAddName}
                      onChange={e => setStaffMenuAddName(e.target.value)}
                      className="border border-zinc-800 bg-neutral-950 p-2 text-xs text-white rounded-lg focus:border-[#FF5A00] outline-none"
                    />
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase font-black">Price (R)</label>
                    <input
                      type="number"
                      placeholder="145"
                      value={staffMenuAddPrice}
                      onChange={e => setStaffMenuAddPrice(e.target.value)}
                      className="border border-zinc-800 bg-neutral-950 p-2 text-xs text-white rounded-lg focus:border-[#FF5A00] outline-none font-mono"
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase font-black">Category</label>
                    <select
                      value={staffMenuAddCategory}
                      onChange={e => setStaffMenuAddCategory(e.target.value as "EAT" | "DRINK")}
                      className="border border-zinc-800 bg-neutral-950 p-2 text-xs text-white rounded-lg focus:border-[#FF5A00] outline-none font-bold"
                    >
                      <option value="EAT">🍔 EAT</option>
                      <option value="DRINK">🍻 DRINK</option>
                    </select>
                  </div>

                  {/* Emoji */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase font-black">Fallback Emoji</label>
                    <input
                      type="text"
                      placeholder="🍔"
                      value={staffMenuAddEmoji}
                      onChange={e => setStaffMenuAddEmoji(e.target.value)}
                      className="border border-zinc-800 bg-neutral-950 p-2 text-xs text-center text-white rounded-lg focus:border-[#FF5A00] outline-none"
                    />
                  </div>

                  {/* Popularity / Special Badge */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase font-black">Popularity Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. Popular 85%"
                      value={staffMenuAddBadge}
                      onChange={e => setStaffMenuAddBadge(e.target.value)}
                      className="border border-zinc-800 bg-neutral-950 p-2 text-xs text-white rounded-lg focus:border-[#FF5A00] outline-none"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase font-black">Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={staffMenuAddImage}
                      onChange={e => setStaffMenuAddImage(e.target.value)}
                      className="border border-zinc-800 bg-neutral-950 p-2 text-xs text-white rounded-lg focus:border-[#FF5A00] outline-none font-mono"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase font-black">Description</label>
                    <textarea
                      placeholder="Specify premium ingredients or details..."
                      rows={2}
                      value={staffMenuAddDesc}
                      onChange={e => setStaffMenuAddDesc(e.target.value)}
                      className="border border-zinc-800 bg-neutral-950 p-2 text-xs text-white rounded-lg focus:border-[#FF5A00] outline-none leading-relaxed"
                    />
                  </div>

                  {/* Special Badge Checkbox */}
                  <div className="flex items-center gap-2 mt-1 col-span-2">
                    <input
                      id="staff-special-check"
                      type="checkbox"
                      checked={staffMenuAddIsSpecial}
                      onChange={e => setStaffMenuAddIsSpecial(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-800 bg-neutral-950 text-[#FF5A00] focus:ring-[#FF5A00]/50"
                    />
                    <label htmlFor="staff-special-check" className="text-[10px] font-mono text-zinc-400 uppercase font-black select-none cursor-pointer">
                      💥 Mark as active Special promo
                    </label>
                  </div>
                </div>

                {/* Submissions */}
                <div className="flex gap-2 mt-2">
                  {editingMenuItemId && (
                    <button
                      type="button"
                      onClick={() => {
                        playBeep(400, "sine", 0.05);
                        setEditingMenuItemId(null);
                        setStaffMenuAddName("");
                        setStaffMenuAddPrice("");
                        setStaffMenuAddEmoji("🍔");
                        setStaffMenuAddImage("");
                        setStaffMenuAddDesc("");
                        setStaffMenuAddBadge("");
                        setStaffMenuAddIsSpecial(false);
                      }}
                      className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-450 font-mono text-[9px] uppercase rounded-xl transition-all font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!staffMenuAddName.trim()) {
                        triggerToast("Dish name is required!", "info");
                        return;
                      }
                      const pr = parseFloat(staffMenuAddPrice);
                      if (isNaN(pr) || pr <= 0) {
                        triggerToast("A valid price is required!", "info");
                        return;
                      }

                      playBeep(600, "sine", 0.08);

                      if (editingMenuItemId) {
                        // edit
                        setMenuItems(prev => prev.map(m => m.id === editingMenuItemId ? {
                          ...m,
                          name: staffMenuAddName.trim(),
                          price: pr,
                          category: staffMenuAddCategory,
                          emoji: staffMenuAddEmoji.trim() || "🍔",
                          image: staffMenuAddImage.trim() || undefined,
                          description: staffMenuAddDesc.trim(),
                          popularityBadge: staffMenuAddBadge.trim() || undefined,
                          isSpecial: staffMenuAddIsSpecial
                        } : m));
                        triggerToast(`Modified ${staffMenuAddName}!`, "success");
                        setEditingMenuItemId(null);
                      } else {
                        // create new
                        const generatedId = `${staffMenuAddCategory.toLowerCase()}-${Date.now()}`;
                        const newDish: MenuItem = {
                          id: generatedId,
                          name: staffMenuAddName.trim(),
                          price: pr,
                          category: staffMenuAddCategory,
                          emoji: staffMenuAddEmoji.trim() || "🍔",
                          image: staffMenuAddImage.trim() || undefined,
                          description: staffMenuAddDesc.trim(),
                          popularityBadge: staffMenuAddBadge.trim() || undefined,
                          isSpecial: staffMenuAddIsSpecial
                        };
                        setMenuItems(prev => [newDish, ...prev]);
                        triggerToast(`Added ${staffMenuAddName} to the menu! 🍔`, "success");
                      }

                      // Reset form
                      setStaffMenuAddName("");
                      setStaffMenuAddPrice("");
                      setStaffMenuAddEmoji("🍔");
                      setStaffMenuAddImage("");
                      setStaffMenuAddDesc("");
                      setStaffMenuAddBadge("");
                      setStaffMenuAddIsSpecial(false);
                    }}
                    className="flex-[2] py-2 bg-[#FF5A00] hover:bg-orange-400 text-black font-sub font-black text-xs uppercase tracking-wider rounded-xl transition-all font-bold shadow-md transform active:scale-95 text-center cursor-pointer"
                  >
                    {editingMenuItemId ? "💾 Save Changes" : "⚡ Release to Menu"}
                  </button>
                </div>
              </div>

              {/* Right Column: Dynamic Table/List Viewer (lg:col-span-7) */}
              <div className="lg:col-span-7 bg-black/40 border border-zinc-900 rounded-xl p-4 flex flex-col gap-3 shadow-inner">
                {/* Header list search bar */}
                <div className="flex justify-between items-center gap-3 border-b border-zinc-900 pb-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-black">Stock Inventory</span>
                  <div className="relative w-44">
                    <Search className="absolute left-2.5 top-1.5 w-3 h-3 text-zinc-600" />
                    <input
                      type="text"
                      placeholder="Search stock..."
                      value={staffMenuSearchQuery}
                      onChange={e => setStaffMenuSearchQuery(e.target.value)}
                      className="border border-zinc-850 bg-neutral-950 pl-7 pr-2 py-0.5 text-[10px] text-white rounded-lg focus:border-[#FF5A00] outline-none w-full placeholder:text-zinc-650 font-mono"
                    />
                  </div>
                </div>

                {/* Grid Container list items inventory index */}
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {(() => {
                    const searchedList = menuItems.filter(m => {
                      if (!staffMenuSearchQuery.trim()) return true;
                      const q = staffMenuSearchQuery.toLowerCase();
                      return m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q);
                    });

                    if (searchedList.length === 0) {
                      return (
                        <div className="text-center py-10 font-mono text-[10px] text-zinc-600">
                          No matching stock dishes found.
                        </div>
                      );
                    }

                    return searchedList.map((m) => {
                      const isProductSpecial = m.isSpecial;
                      return (
                        <div key={m.id} className="bg-[#121212]/90 border border-zinc-900 p-2 rounded-xl flex items-center justify-between gap-3 hover:border-zinc-800 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center shrink-0 border border-zinc-850 overflow-hidden relative">
                              {m.image ? (
                                <img src={m.image} alt={m.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <span className="text-lg">{m.emoji}</span>
                              )}
                              {isProductSpecial && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-black animate-pulse" />
                              )}
                            </div>
                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <span className="font-sans font-extrabold text-xs text-white uppercase truncate">{m.name}</span>
                                <span className="text-[7px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-850 px-1 rounded uppercase font-black shrink-0">{m.category}</span>
                              </div>
                              <p className="text-[9px] font-mono text-zinc-500 mt-0.5 truncate max-w-[170px]">
                                {m.description || "No description."}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-xs font-black text-emerald-400 mr-1">R{m.price}</span>
                            
                            {/* Toggle Special */}
                            <button
                              onClick={() => {
                                playBeep(500, "triangle", 0.05);
                                setMenuItems(prev => prev.map(item => item.id === m.id ? { ...item, isSpecial: !item.isSpecial } : item));
                                triggerToast(`${m.name} special state toggled!`, "success");
                              }}
                              className={`p-1 border rounded-lg transition-colors cursor-pointer text-xs ${isProductSpecial ? "bg-red-950/40 border-red-800 text-red-500 hover:text-red-400" : "bg-zinc-900 border-zinc-805 text-zinc-500 hover:text-[#FF5A00]"}`}
                              title="Toggle Special Offer"
                            >
                              ⭐
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => {
                                playBeep(520, "sine", 0.05);
                                setEditingMenuItemId(m.id);
                                setStaffMenuAddName(m.name);
                                setStaffMenuAddPrice(m.price.toString());
                                setStaffMenuAddCategory(m.category);
                                setStaffMenuAddEmoji(m.emoji);
                                setStaffMenuAddImage(m.image || "");
                                setStaffMenuAddDesc(m.description || "");
                                setStaffMenuAddBadge(m.popularityBadge || "");
                                setStaffMenuAddIsSpecial(!!m.isSpecial);
                                triggerToast(`Sent details for ${m.name} to editor!`, "info");
                              }}
                              className="p-1 px-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-450 hover:text-white rounded-lg transition-colors cursor-pointer text-[10px]"
                              title="Edit"
                            >
                              ✏️
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove ${m.name} from the active menu?`)) {
                                  playBeep(330, "sawtooth", 0.1);
                                  setMenuItems(prev => prev.filter(item => item.id !== m.id));
                                  triggerToast(`Removed ${m.name} from menu!`, "info");
                                }
                              }}
                              className="p-1 px-1.5 bg-red-950/40 hover:bg-red-950 border border-red-500/10 text-red-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer text-[10px]"
                              title="Delete"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

            </div>
          </div>

          {/* STAFF LIVE PROMOTIONS & SPECIALS DEALS MANAGER PANEL */}
          <div className="bg-[#1C1C1E] rounded-2xl border-2 border-zinc-900 overflow-hidden mt-6 flex flex-col font-sans shadow-xl">
            <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#FF5A00] animate-bounce-slow" />
                <div>
                  <h3 className="font-display font-black text-white text-xs uppercase tracking-widest leading-none">
                    Live Specials & Promotions Manager
                  </h3>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5 font-bold">
                    Drop dynamic meal/drink deal packages which instantly broadcast to all table clients
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-black bg-zinc-900 border border-zinc-850 px-2.5 py-0.5 rounded">
                {specials.length} Active Specials
              </span>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#121212]/30">
              
              {/* Form panel to create / modify a special */}
              <div className="bg-black/40 border border-zinc-900 p-4.5 rounded-xl flex flex-col gap-3.5 shadow-inner">
                <h4 className="font-sub font-black text-xs text-[#FF5A00] uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                  <span>🚀 Drop live deal pack</span>
                </h4>

                {/* Dropdown to SELECT an existing product from menu */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="staff-product-select" className="text-[9px] font-mono text-zinc-500 uppercase font-black">
                    Preset: Copy from Pub Menu
                  </label>
                  <select
                    id="staff-product-select"
                    value={staffSpecialSelectId}
                    onChange={(e) => {
                      const selId = e.target.value;
                      setStaffSpecialSelectId(selId);
                      if (selId) {
                        const product = MENU_ITEMS.find(m => m.id === selId);
                        if (product) {
                          setStaffSpecialTitle(`PREMIUM ${product.name.toUpperCase()} DEAL`);
                          setStaffSpecialDeal(`ONLY R${Math.round(product.price * 0.8)} TODAY`);
                          setStaffSpecialDescription(`Conquer absolute thirst & style with our ice-cold custom ${product.name} ${product.emoji}.`);
                          setStaffSpecialBadge(product.category === "DRINK" ? "DRINK DEAL" : "FOOD DEAL");
                        }
                      } else {
                        setStaffSpecialTitle("");
                        setStaffSpecialDeal("");
                        setStaffSpecialDescription("");
                        setStaffSpecialBadge("");
                      }
                      playBeep(450, "sine", 0.05);
                    }}
                    className="w-full bg-[#121212] border border-zinc-850/80 text-zinc-300 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A00] font-mono uppercase cursor-pointer"
                  >
                    <option value="">-- [Custom/No Preset] --</option>
                    {MENU_ITEMS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.emoji} {m.name} (R{m.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Title */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="special-title-input" className="text-[9px] font-mono text-zinc-500 uppercase font-black">Title</label>
                    <input
                      id="special-title-input"
                      type="text"
                      placeholder="e.g. SUNDAY CHILLER"
                      value={staffSpecialTitle}
                      onChange={(e) => setStaffSpecialTitle(e.target.value)}
                      className="bg-[#121212] border border-zinc-850 text-zinc-100 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A00]"
                    />
                  </div>

                  {/* Badge Tag */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="special-badge-input" className="text-[9px] font-mono text-zinc-500 uppercase font-black">Tag/Badge</label>
                    <input
                      id="special-badge-input"
                      type="text"
                      placeholder="e.g. HAPPY HOUR"
                      value={staffSpecialBadge}
                      onChange={(e) => setStaffSpecialBadge(e.target.value)}
                      className="bg-[#121212] border border-zinc-850 text-zinc-100 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A00]"
                    />
                  </div>
                </div>

                {/* Deal Description Line */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="special-deal-input" className="text-[9px] font-mono text-zinc-500 uppercase font-black">Promo Deal text</label>
                  <input
                    id="special-deal-input"
                    type="text"
                    placeholder="e.g. R45 FOR SUNRISE MIMOSAS"
                    value={staffSpecialDeal}
                    onChange={(e) => setStaffSpecialDeal(e.target.value)}
                    className="bg-[#121212] border border-zinc-850 text-zinc-100 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A00] font-bold"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="special-desc-input" className="text-[9px] font-mono text-zinc-500 uppercase font-black">Description</label>
                  <textarea
                    id="special-desc-input"
                    rows={2}
                    placeholder="Describe what's in this promo package..."
                    value={staffSpecialDescription}
                    onChange={(e) => setStaffSpecialDescription(e.target.value)}
                    className="bg-[#121212] border border-zinc-850 text-zinc-100 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A00]"
                  />
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => {
                      setStaffSpecialSelectId("");
                      setStaffSpecialTitle("");
                      setStaffSpecialDeal("");
                      setStaffSpecialDescription("");
                      setStaffSpecialBadge("");
                      playBeep(400, "sine", 0.05);
                    }}
                    className="flex-1 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-550 hover:text-white uppercase font-sub text-[9.5px] rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Form
                  </button>

                  <button
                    onClick={() => {
                      if (!staffSpecialTitle || !staffSpecialDeal) {
                        triggerToast("Please enter at least a title and deal description text!", "info");
                        return;
                      }

                      playBeep(440, "sine", 0.08);
                      setTimeout(() => playBeep(659.25, "sine", 0.1), 100);

                      const newSpecial = {
                        id: "spec-" + Date.now(),
                        title: staffSpecialTitle.toUpperCase(),
                        deal: staffSpecialDeal.toUpperCase(),
                        description: staffSpecialDescription || "Ice-cold pub enjoyment from RocoMamas special reserves.",
                        badge: staffSpecialBadge || "LIVE OFFER",
                        menuItemId: staffSpecialSelectId || undefined
                      };

                      // Update state (triggers local storage auto sync via existing useEffect)
                      const updatedSpecials = [newSpecial, ...specials.filter(s => s.title !== newSpecial.title)];
                      setSpecials(updatedSpecials);

                      // Set broadcast notification overlay so ALL client panels trigger immediately!
                      setDroppedSpecialNotification(newSpecial);

                      // Reset inputs
                      setStaffSpecialSelectId("");
                      setStaffSpecialTitle("");
                      setStaffSpecialDeal("");
                      setStaffSpecialDescription("");
                      setStaffSpecialBadge("");

                      triggerToast("🎉 New live Special Dropped! Clients notified!", "success");
                    }}
                    className="flex-2 py-1.5 bg-[#FF5A00] hover:bg-orange-400 text-black font-sub font-black text-[9.5px] uppercase rounded-lg tracking-wider transition-all transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                  >
                    <Megaphone className="w-3.5 h-3.5" /> Drop Deal Pack Now!
                  </button>
                </div>
              </div>

              {/* Active list column */}
              <div className="flex flex-col gap-3">
                <h4 className="font-sub font-black text-xs text-white uppercase tracking-wider border-b border-zinc-900 pb-2 flex justify-between items-center">
                  <span>Current Broadcasted specials</span>
                  <span className="text-[9px] font-mono text-zinc-500 font-normal">SCROLL TO MANAGE</span>
                </h4>

                <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {specials.map((spec, idx) => (
                    <div 
                      key={spec.id}
                      className="bg-black/20 border border-zinc-900 rounded-xl p-3.5 relative flex justify-between items-start gap-3 shadow-inner"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[8px] font-mono text-[#FF5A00] bg-[#FF5A00]/10 px-2 py-0.5 rounded font-black max-w-max uppercase">
                            {spec.badge}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-550 uppercase">
                            Index: {idx + 1}
                          </span>
                        </div>
                        <h5 className="font-sub font-black text-white text-xs uppercase mt-1">
                          {spec.title}
                        </h5>
                        <p className="font-mono text-11px text-emerald-400 font-bold mt-0.5">
                          {spec.deal}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                          {spec.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            playBeep(480, "sine", 0.05);
                            setStaffSpecialSelectId(spec.menuItemId || "");
                            setStaffSpecialTitle(spec.title);
                            setStaffSpecialDeal(spec.deal);
                            setStaffSpecialDescription(spec.description);
                            setStaffSpecialBadge(spec.badge);
                            triggerToast("Specials values copied to left panel form! Edit and re-submit.", "info");
                          }}
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-450 hover:text-white font-mono text-[9px] uppercase rounded transition-colors cursor-pointer"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => {
                            playBeep(320, "sine", 0.06);
                            const updated = specials.filter(s => s.id !== spec.id);
                            setSpecials(updated);
                            triggerToast("Special and client-side broadcast removed", "info");
                          }}
                          className="px-2.5 py-1 bg-red-950/25 hover:bg-red-900 border border-red-900/40 hover:border-transparent text-red-500 hover:text-white font-mono text-[9px] uppercase rounded transition-colors cursor-pointer font-bold"
                        >
                          ✕ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* 🎓 CREW ACADEMY, SHIFT DISPATCH & PERFORMANCE HISTORIC STATS */}
          <div className="mt-8 border-t border-zinc-900 pt-8 flex flex-col gap-8 font-sans">
            <div>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 font-mono text-[9px] font-black uppercase rounded tracking-widest">
                ROCO SQUAD COMMAND CENTER
              </span>
              <h2 className="font-display tracking-wider text-xl font-black text-white uppercase mt-1">
                STUDY, ROTATE & MEASURE: ROCO CREW ACADEMY
              </h2>
              <p className="text-zinc-500 text-[11px] font-sans">
                Elevate table delivery rates, study official client engagement guidelines, and monitor speed metrics.
              </p>
            </div>

            {/* Profile Login & Shift Sign-In Selector */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Profile card Selector block */}
              <div className="md:col-span-4 bg-gradient-to-br from-[#1C1C1E] to-black border border-zinc-850/80 rounded-2xl p-4 flex flex-col justify-between gap-5 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">Active Waiter Seat</span>
                  
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="staff-profile-select-academy" className="sr-only">Choose Server profile</label>
                    <select
                      id="staff-profile-select-academy"
                      value={activeWaiterProfileName}
                      onChange={(e) => {
                        setActiveWaiterProfileName(e.target.value);
                        playBeep(480, "sine", 0.05);
                        triggerToast(`Switched active profile to ${e.target.value}!`, "success");
                      }}
                      className="w-full bg-[#121212] border border-zinc-800 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[#FF5A00] font-mono"
                    >
                      {waitersList.map((w, idx) => (
                        <option key={idx} value={w.name}>
                          {w.name} {w.onShift ? "🟢 (ON SHIFT)" : "🔴 (OFF)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-black/40 border border-zinc-900 rounded-xl p-3 space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Academy Level:</span>
                      <span className="text-amber-500 font-extrabold">
                        {(() => {
                          const currentWObj = waitersList.find(w => w.name === activeWaiterProfileName);
                          const progressVal = currentWObj ? currentWObj.progress : 0;
                          return progressVal === 100 
                            ? "🎓 CHIEF SCHOLAR (100%)" 
                            : progressVal > 0
                              ? `📖 ROCO APPRENTICE (${progressVal}%)`
                              : "🌱 GREEN HORN (0%)";
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Completed Courses:</span>
                      <span className="text-emerald-400 font-extrabold">
                        {waitersList.find(w => w.name === activeWaiterProfileName)?.completedModules?.length || 0} / 3
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-900 pt-3">
                  <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">Sign In New Crew member</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Sipho (Strips Master)"
                      value={staffRegistrationName}
                      onChange={(e) => setStaffRegistrationName(e.target.value)}
                      className="flex-1 bg-black border border-zinc-850 px-3 py-1.5 text-xs text-white rounded-xl focus:border-[#FF5A00] outline-none placeholder:text-zinc-650"
                    />
                    <button
                      onClick={() => {
                        if (!staffRegistrationName.trim()) return;
                        playBeep(600, "sine", 0.05);
                        const isExist = waitersList.some(w => w.name.toLowerCase() === staffRegistrationName.trim().toLowerCase());
                        if (isExist) {
                          triggerToast("Name already exists on our databases!", "info");
                          return;
                        }
                        const newRoster = {
                          name: staffRegistrationName.trim(),
                          onShift: true,
                          progress: 0,
                          completedModules: [],
                          history: []
                        };
                        setWaitersList(prev => [...prev, newRoster]);
                        setActiveWaiterProfileName(newRoster.name);
                        setStaffRegistrationName("");
                        triggerToast(`Signed-in ${newRoster.name} to rotation!`, "success");
                      }}
                      className="px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-black text-xs uppercase rounded-xl transition-colors shrink-0"
                    >
                      + ADD
                    </button>
                  </div>
                </div>
              </div>

              {/* Roco Academy Training tab selection panel */}
              <div className="md:col-span-8 bg-[#1C1C1E] border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500 text-sm">🎓</span>
                    <span className="text-xs uppercase tracking-widest font-mono text-white font-black">
                      ACTIVE TRAINING SYLLABUS
                    </span>
                  </div>
                  
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { id: "efficiency", label: "01. EFFICIENCY" },
                      { id: "timers", label: "02. TIMERS & COMPS" },
                      { id: "thunee", label: "03. THUNEE GAME" }
                    ].map(mod => (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => {
                          playBeep(400, "sine", 0.05);
                          setAcademyActiveModule(mod.id);
                          setAcademyQuizSelectedAns(null);
                          setAcademyQuizResult(null);
                        }}
                        className={`px-3 py-1 text-[9.5px] font-mono rounded-lg border transition-all cursor-pointer ${
                          academyActiveModule === mod.id 
                            ? "bg-amber-500 border-amber-600 text-black font-black" 
                            : "bg-black/60 border-zinc-850 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {mod.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub Module Lesson details */}
                <div className="flex-1 bg-black/40 border border-zinc-900 p-4 rounded-xl flex flex-col justify-between gap-4">
                  {academyActiveModule === "efficiency" && (
                    <div className="space-y-2">
                      <span className="text-[#FF5A00] font-mono text-[9px] uppercase tracking-widest font-black block">LECTURE 01: ROTATING TABLE ASSIGNMENT EFFICIENCY</span>
                      <p className="text-xs text-zinc-350 leading-relaxed">
                        To guarantee we deliver under 45 seconds, table allocations cannot be manual. As soon as a guest <strong className="text-white">scans their table's QR Code</strong>, our round-robin dispatch engine immediately assigns that table to the available on-shift server. 
                      </p>
                      <ul className="text-[10px] space-y-1 font-mono text-zinc-400 list-disc list-inside">
                        <li>Each tabletop scan rings the corresponding waiter automatically.</li>
                        <li>Equitable load balancing shields individual crew from order fatigue.</li>
                      </ul>
                    </div>
                  )}

                  {academyActiveModule === "timers" && (
                    <div className="space-y-2">
                      <span className="text-[#FF5A00] font-mono text-[9px] uppercase tracking-widest font-black block">LECTURE 02: COMPLEXITY TIMERS & CUSTOMER COMPENSATIONS</span>
                      <p className="text-xs text-zinc-350 leading-relaxed">
                        Precision counts! Orders are assigned a dynamic countdown according to dish complexity: <strong className="text-white">drinks get 30s, basic burgers get 45s, combos and wings get 60s</strong>. If your timer runs out, the guest receives an absolute <strong className="text-emerald-400">R0 Speed Apology Ice Cream Sundae</strong> on their final bill, and the restaurant absorbs the cost.
                      </p>
                      <ul className="text-[10px] space-y-1 font-mono text-zinc-400 list-disc list-inside">
                        <li>Customers monitor the live visual bar timer on their phone interface.</li>
                        <li>The system penalizes staff scores on shift handovers if they trigger compilations.</li>
                      </ul>
                    </div>
                  )}

                  {academyActiveModule === "thunee" && (
                    <div className="space-y-2">
                      <span className="text-[#FF5A00] font-mono text-[9px] uppercase tracking-widest font-black block">LECTURE 03: DURBAN THUNEE RULES & CUSTOMER HOSPITALITY</span>
                      <p className="text-xs text-zinc-350 leading-relaxed">
                        Thunee is Durban's ultimate card trick playground. Guest entertainment is our superpower! If a guest table has empty space, start or help them play a game of Thunee. Memorize the crucial scoring hierarchy: <strong className="text-amber-500 font-bold">Jack = 30 points, Nine = 20 points, Ace = 11 points, Ten = 10 points</strong>. King, Queen, etc. carry 0 card points.
                      </p>
                      <ul className="text-[10px] space-y-1 font-mono text-zinc-400 list-disc list-inside">
                        <li>The trump card selection occurs after dealing initial packets.</li>
                        <li>Call "THUNEE" if you can sweep all tricks to assert local dominance!</li>
                      </ul>
                    </div>
                  )}

                  {/* MINI QUIZ SECTION TO LOCK PROGRESS */}
                  <div className="border-t border-zinc-900 pt-3 space-y-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.5 bg-neutral-900 border border-zinc-800 text-[8.5px] font-mono text-amber-500 font-bold uppercase rounded">
                        MINI-QUIZ KNOWLEDGE CHECK
                      </span>
                      {waitersList.find(w => w.name === activeWaiterProfileName)?.completedModules?.includes(academyActiveModule) ? (
                        <span className="text-[9px] text-[#22C55E] uppercase font-mono font-black flex items-center gap-1">
                          🟢 COMPLETED & VERIFIED
                        </span>
                      ) : (
                        <span className="text-[9px] text-zinc-500 uppercase font-mono">PENDING COMPLIANCE...</span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-white">
                      {academyActiveModule === "efficiency" && "Q: How is a professional waiter mapped to a table dynamic rotation?"}
                      {academyActiveModule === "timers" && "Q: What is the exact operational consequence if your active complexity countdown runs code red?"}
                      {academyActiveModule === "thunee" && "Q: What is the numerical valuation of a played 'Jack' and 'Nine' in Durban Thunee?"}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {academyActiveModule === "efficiency" && [
                        "A. By manual Excel spreadsheets in the back-office.",
                        "B. Automated round-robin rotation as soon as a table details is scanned."
                      ].map((item, id) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            playBeep(450, "sine", 0.05);
                            setAcademyQuizSelectedAns(id);
                          }}
                          className={`p-2.5 rounded-xl border text-left font-mono transition-all text-[11px] leading-tight ${
                            academyQuizSelectedAns === id 
                              ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold" 
                              : "bg-black border-zinc-850 text-zinc-450 hover:bg-zinc-950 hover:border-zinc-800"
                          }`}
                        >
                          {item}
                        </button>
                      ))}

                      {academyActiveModule === "timers" && [
                        "A. Customer gets a free apology ice cream Sundae added automatically to their bill.",
                        "B. The order is automatically cancelled."
                      ].map((item, id) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            playBeep(450, "sine", 0.05);
                            setAcademyQuizSelectedAns(id);
                          }}
                          className={`p-2.5 rounded-xl border text-left font-mono transition-all text-[11px] leading-tight ${
                            academyQuizSelectedAns === id 
                              ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold" 
                              : "bg-black border-zinc-850 text-zinc-450 hover:bg-zinc-950 hover:border-zinc-800"
                          }`}
                        >
                          {item}
                        </button>
                      ))}

                      {academyActiveModule === "thunee" && [
                        "A. Jack is 30 points, Nine is 20 points.",
                        "B. Jack is 11 points, Nine is 10 points."
                      ].map((item, id) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            playBeep(450, "sine", 0.05);
                            setAcademyQuizSelectedAns(id);
                          }}
                          className={`p-2.5 rounded-xl border text-left font-mono transition-all text-[11px] leading-tight ${
                            academyQuizSelectedAns === id 
                              ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold" 
                              : "bg-black border-zinc-850 text-zinc-450 hover:bg-zinc-950 hover:border-zinc-800"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    {academyQuizSelectedAns !== null && (
                      <div className="flex items-center justify-between gap-4 mt-2 bg-zinc-950 border border-zinc-900 rounded-xl p-3">
                        <p className="text-[11px] font-mono text-zinc-400">
                          Selected Answer: <strong className="text-white bg-zinc-900 px-1.5 py-0.5 rounded">{academyQuizSelectedAns === 0 ? "Option A" : "Option B"}</strong>
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const isCorrect = academyQuizSelectedAns === 0; // Both are Option A!
                            if (isCorrect) {
                              playBeep(659.25, "sine", 0.08); // Success
                              setAcademyQuizResult("pass");
                              
                              // Update completed modules list & progress
                              setWaitersList(prev => prev.map(w => {
                                if (w.name === activeWaiterProfileName) {
                                  const alreadyHas = w.completedModules?.includes(academyActiveModule);
                                  const list = alreadyHas ? w.completedModules : [...(w.completedModules || []), academyActiveModule];
                                  const progVal = Math.round((list.length / 3) * 100);
                                  return {
                                    ...w,
                                    completedModules: list,
                                    progress: progVal
                                  };
                                }
                                return w;
                              }));
                              triggerToast("🎉 CORRECT! Roco Academy Module Passed!", "success");
                            } else {
                              playBeep(220, "sawtooth", 0.15); // Failure
                              setAcademyQuizResult("fail");
                              triggerToast("❌ INCORRECT! Read the lecture notes and try again.", "info");
                            }
                          }}
                          className="px-4 py-1.5 bg-[#FF5A00] hover:bg-orange-400 text-black font-sub font-black text-[10px] uppercase rounded-xl transition-all cursor-pointer font-bold"
                        >
                          VERIFY RESPONSE
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Waiters historic performance table log area */}
            <div className="bg-[#1C1C1E] border border-zinc-805/80 rounded-2xl p-5 shadow-xl space-y-4">
              <div>
                <span className="text-[9px] font-mono text-[#FF5A00] uppercase font-black tracking-widest block">SHIFT METRICS LOG</span>
                <h3 className="font-display tracking-[0.05em] text-sm font-black text-white uppercase mt-0.5">
                  DELIVERY SPEED PERFORMANCE JOURNAL ({activeWaiterProfileName.split(" ")[0]}'s Log)
                </h3>
              </div>

              {(() => {
                const currentWaiter = waitersList.find(w => w.name === activeWaiterProfileName);
                const listHistory = currentWaiter ? (currentWaiter.history || []) : [];
                const totalSpeedOrders = listHistory.length;
                const onTimeCount = listHistory.filter((h: any) => h.onTime).length;
                const scorePercentage = totalSpeedOrders > 0 ? Math.round((onTimeCount / totalSpeedOrders) * 100) : 100;
                const avgSpeedTime = totalSpeedOrders > 0 ? Math.round(listHistory.reduce((s: number, h: any) => s + h.deliveryTimeSeconds, 0) / totalSpeedOrders) : 0;

                return (
                  <div className="space-y-4">
                    {/* Visual statistical badges row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-black/40 border border-zinc-900 rounded-xl p-3.5 flex flex-col font-mono text-center">
                        <span className="text-zinc-650 text-[8.5px] uppercase tracking-wider font-extrabold">Roster Status</span>
                        <span className="text-emerald-400 text-xs font-black uppercase mt-1">🟢 active shift</span>
                      </div>
                      <div className="bg-black/40 border border-zinc-900 rounded-xl p-3.5 flex flex-col font-mono text-center">
                        <span className="text-zinc-650 text-[8.5px] uppercase tracking-wider font-extrabold">Total Dispatches</span>
                        <span className="text-white text-base font-black mt-0.5">{totalSpeedOrders} / orders</span>
                      </div>
                      <div className="bg-black/40 border border-zinc-900 rounded-xl p-3.5 flex flex-col font-mono text-center">
                        <span className="text-zinc-650 text-[8.5px] uppercase tracking-wider font-extrabold">On-Time Standard</span>
                        <span className={`text-base font-black mt-0.5 ${scorePercentage >= 80 ? "text-emerald-400" : "text-amber-500"}`}>{scorePercentage}%</span>
                      </div>
                      <div className="bg-black/40 border border-zinc-900 rounded-xl p-3.5 flex flex-col font-mono text-center">
                        <span className="text-zinc-650 text-[8.5px] uppercase tracking-wider font-extrabold">Avg Delivery Time</span>
                        <span className="text-white text-base font-black mt-0.5">{avgSpeedTime}s</span>
                      </div>
                    </div>

                    {/* Table View */}
                    <div className="border border-zinc-900 rounded-xl overflow-hidden bg-black/20">
                      <table className="w-full text-left font-mono text-[10.5px]">
                        <thead>
                          <tr className="bg-neutral-950 text-zinc-500 uppercase text-[9px] border-b border-zinc-900">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Table</th>
                            <th className="p-3">Dish Vol</th>
                            <th className="p-3">Prep Limit</th>
                            <th className="p-3">Serv Time</th>
                            <th className="p-3 text-right">Standard</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {listHistory.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-6 text-center text-zinc-600 italic">
                                No historic standard dispatches recorded on this shift for {activeWaiterProfileName.split(" ")[0]} yet.
                              </td>
                            </tr>
                          ) : (
                            listHistory.map((h: any, idx: number) => (
                              <tr key={idx} className="hover:bg-black/40 transition-colors uppercase">
                                <td className="p-3 text-[#FF5A00] font-black">#{h.orderId}</td>
                                <td className="p-3 text-white">Table {h.tableId}</td>
                                <td className="p-3 text-zinc-400">{h.itemsCount} dishes</td>
                                <td className="p-3 text-zinc-400">{h.prepTimeSeconds}s max</td>
                                <td className="p-3 font-semibold text-white">{h.deliveryTimeSeconds}s</td>
                                <td className="p-3 text-right">
                                  {h.onTime ? (
                                    <span className="bg-emerald-950/40 text-emerald-400 font-extrabold px-2 py-0.5 rounded border border-emerald-950 text-[8.5px]">
                                      ⚡ EXTREME ON-TIME
                                    </span>
                                  ) : (
                                    <span className="bg-red-950/40 text-red-500 font-extrabold px-2 py-0.5 rounded border border-red-950 text-[8.5px]">
                                      🍦 EXPIRED (+🍦 APOLOGY SUNDAE)
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* STAFF COZY FOOTER STATUS */}
          <div className="mt-auto pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A00]" />
              <span className="uppercase">RocoMamas OS Floor Admin Terminal • v2.8</span>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  playBeep(440, "sine", 0.05);
                  triggerToast("Switching View logs: Floor services synchronized.", "info");
                }}
                className="hover:text-white transition-colors"
              >
                Dump Logs
              </button>
              
              <button
                onClick={() => handleEndShift()}
                className="hover:text-red-500 text-red-600 font-black tracking-widest uppercase cursor-pointer"
              >
                [ End Shift ]
              </button>
            </div>
          </div>

          {/* TABLE DETAILS INSPECTOR MODAL */}
          <AnimatePresence>
            {selectedStaffTable !== null && (() => {
              const tableId = selectedStaffTable;
              const hasAlert = tableId === currentTableId ? waiterSummoned : tableAlerts[tableId];
              const orders = tableId === currentTableId ? historicOrders : otherTablesOrders[tableId] || [];
              const hasActiveOrders = orders.some(o => o.status === "Sent" || o.status === "Preparing");

              return (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedStaffTable(null)}
                    className="fixed inset-0 bg-black/85 z-[110] backdrop-blur-xs"
                  />

                  {/* Modal container */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 15 }}
                    className="fixed inset-x-4 top-[10%] max-w-lg mx-auto bg-[#1C1C1E] border-2 border-zinc-800 rounded-2xl shadow-2xl z-[120] overflow-hidden flex flex-col max-h-[80vh] font-sans"
                  >
                    <div className="p-4 bg-black border-b border-zinc-850 flex justify-between items-center">
                      <div>
                        <h3 className="font-display font-black text-white text-lg uppercase">
                          Table {tableId} Inspector
                        </h3>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-550">
                          Zone operational report
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedStaffTable(null)}
                        className="p-2 bg-[#1C1C1E] border border-zinc-800 hover:text-[#FF5A00] text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5 overflow-y-auto flex flex-col gap-4">
                      {/* Attention clear if requested */}
                      {hasAlert && (
                        <div className="bg-red-950/40 text-red-500 p-3 rounded-xl border border-red-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping shrink-0" />
                            <span className="font-sub font-black text-xs uppercase">
                              Waiter Requested
                            </span>
                          </div>
                          <button
                            onClick={() => handleResolveAlertForTable(tableId)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-mono uppercase tracking-wider transition-colors font-bold cursor-pointer"
                          >
                            Resolve Alert
                          </button>
                        </div>
                      )}

                      {/* Orders lists */}
                      <div className="flex flex-col gap-3">
                        <h4 className="font-sub font-black text-xs text-[#FF5A00] uppercase tracking-wider">
                          Order list details
                        </h4>

                        {orders.length === 0 ? (
                          <div className="bg-black/30 p-6 rounded-xl border border-zinc-850 text-center py-8">
                            <p className="text-zinc-500 font-mono text-xs italic">
                              No active or historic orders registered for Table {tableId} yet.
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {orders.map((ord: any) => (
                              <div key={ord.id} className="bg-black/40 border border-zinc-850 rounded-xl p-3.5 flex flex-col gap-2">
                                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                                  <span className="flex items-center gap-1.5 font-bold uppercase">
                                    <Clock className="w-3 h-3 text-[#FF5A00] animate-pulse" />
                                    <span>#{ord.id}</span>
                                    <span className="text-zinc-600 font-normal">({getElapsedMinutesAgo(ord.createdAt, ord.timestamp)})</span>
                                  </span>
                                  <span className="uppercase font-bold text-[#FF5A00]">
                                    {ord.status === "Sent" ? "KITCHEN RECEIVED" : ord.status === "Preparing" ? "CHEF PREPARING" : "DELIVERED"}
                                  </span>
                                </div>

                                <div className="flex flex-col gap-1 border-t border-zinc-900 pt-2 mt-1">
                                  {ord.items.map((it: any, i: number) => (
                                    <div key={i} className="flex justify-between text-xs font-mono uppercase text-zinc-350">
                                      <span>{it.quantity}x {it.menuItem.name} {it.menuItem.emoji}</span>
                                      <span className="text-zinc-500">R{it.menuItem.price * it.quantity}</span>
                                    </div>
                                  ))}
                                </div>

                                {ord.notes && (
                                  <div className="p-2.5 bg-amber-950/20 border border-amber-500/10 rounded-lg text-[11px] font-mono text-amber-500">
                                    <span className="font-bold text-amber-600">📝 KITCHEN NOTE:</span> "{ord.notes}"
                                  </div>
                                )}

                                <div className="flex justify-between items-center pt-2 border-t border-dashed border-zinc-850 text-xs font-bold font-mono text-white mt-1">
                                  <span className="text-zinc-500 font-sans font-normal">Subtotal Charge</span>
                                  <span className="text-[#FF5A00]">R{ord.total}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-black border-t border-zinc-850 flex gap-2">
                      {hasActiveOrders && (
                        <button
                          onClick={() => {
                            handleMarkAllServedForTable(tableId);
                            setSelectedStaffTable(null);
                          }}
                          className="flex-1 py-3 bg-[#FF5A00] hover:bg-orange-400 text-black font-sub font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 font-bold"
                        >
                          <Check className="w-4 h-4 stroke-[3]" /> Mark Served
                        </button>
                      )}
                      
                      <button
                        onClick={() => setSelectedStaffTable(null)}
                        className="flex-1 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-sub font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                </>
              );
            })()}
          </AnimatePresence>

          {/* ACTIVE ALERTS MODAL */}
          <AnimatePresence>
            {isAlertsModalOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsAlertsModalOpen(false)}
                  className="fixed inset-0 bg-black/85 z-[110] backdrop-blur-xs"
                />

                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 15 }}
                  className="fixed inset-x-4 top-[15%] max-w-sm mx-auto bg-[#1C1C1E] border-2 border-zinc-800 rounded-2xl shadow-2xl z-[120] overflow-hidden font-sans"
                >
                  <div className="p-4 bg-black border-b border-zinc-850 flex justify-between items-center">
                    <div>
                      <h3 className="font-display font-black text-white text-base uppercase flex items-center gap-2">
                        <Bell className="w-4 h-4 text-red-500 animate-pulse" /> Assistance Calls
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-550 uppercase tracking-wider mt-0.5">
                        Floor alert request logs
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAlertsModalOpen(false)}
                      className="p-2 bg-[#1C1C1E] border border-zinc-800 hover:text-[#FF5A00] text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col gap-3 min-h-[170px] max-h-[45vh] overflow-y-auto">
                    {activeAlertsCount === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center shadow-inner rounded-xl bg-black/20 border border-zinc-850/50 p-4">
                        <span className="text-3xl animate-pulse">🤙</span>
                        <h4 className="font-sub font-black text-white text-xs uppercase tracking-wide mt-3">
                          All tables satisfied
                        </h4>
                        <p className="text-[10px] text-zinc-500 max-w-[200px] mt-1 italic font-sans leading-normal">
                          Zero pending customer dispatcher notifications on Roco Crew's active grid.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {Array.from(new Set(["10", "11", currentTableId, "14"])).map((tableId) => {
                          const active = tableId === currentTableId ? waiterSummoned : tableAlerts[tableId];
                          if (!active) return null;

                          return (
                            <div 
                              key={tableId} 
                              className="bg-[#211617] border border-red-500/25 rounded-xl p-3 flex justify-between items-center"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded bg-red-950/20 border border-red-500/30 flex items-center justify-center font-display font-black text-red-500">
                                  {tableId}
                                </div>
                                <div>
                                  <h5 className="font-sub font-black text-xs text-white uppercase leading-none">
                                    TABLE {tableId}
                                  </h5>
                                  <p className="font-mono text-[9px] text-zinc-550 uppercase mt-1">
                                    SUMMONING WAITER
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => handleResolveAlertForTable(tableId)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-[9px] font-black uppercase rounded transition-colors cursor-pointer border border-transparent font-bold tracking-wider"
                              >
                                Clear ✅
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-black border-t border-zinc-850">
                    <button
                      onClick={() => setIsAlertsModalOpen(false)}
                      className="w-full py-2 bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-300 font-sub font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
                    >
                      Close Alert Board
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* CONTROL CENTER SICK INTERACTIVE MENU MODAL */}
      <AnimatePresence>
        {isControlMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsControlMenuOpen(false)}
              className="fixed inset-0 bg-black/95 z-[99990] backdrop-blur-md cursor-pointer"
            />

            {/* Modal box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 22, stiffness: 240 }}
              className="fixed inset-x-4 top-[8%] bottom-[8%] max-w-[420px] mx-auto bg-[#1C1C1E] border-2 border-[#FF5A00] rounded-3xl shadow-[0_0_40px_rgba(231, 138, 62,0.3)] z-[99995] overflow-hidden flex flex-col font-sans"
            >
              {/* Header */}
              <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center relative shrink-0">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#FF5A00]" />
                  <div>
                    <h4 className="font-sub font-black text-white text-xs uppercase tracking-widest leading-none">
                      Roco Control Center
                    </h4>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">
                      SYSTEM OS CONTROLLER INTERACTION
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playBeep(450, "sine", 0.05);
                    setIsControlMenuOpen(false);
                  }}
                  className="p-2 bg-[#121212] border border-zinc-805 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body Scrollable Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
                
                {/* Brand Banner */}
                <div className="flex flex-col items-center justify-center py-4 bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-zinc-855 p-4 text-center shrink-0">
                  <img 
                    src="https://www.rocomamas.co.ke/images//logo-combined.png" 
                    alt="RocoMamas" 
                    className="w-14 h-14 object-contain mb-2 hover:scale-105 transition-transform duration-300 pointer-events-none" 
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="font-display font-black text-[#FF5A00] text-base tracking-widest uppercase mb-0.5">ROCOMAMAS OS</h3>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase">Table {currentTableId} Interactive Platform</p>
                </div>

                {/* App Mode Switch Row */}
                <div className="bg-zinc-900/60 border border-zinc-850 p-3.5 rounded-2xl flex flex-col gap-2.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-bold tracking-wider">
                      👤 USER PROFILE MODE
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-450/10 text-[#FF5A00] font-bold">
                      {appMode === "STAFF" ? "LOGGED AS THABO" : "GUEST INTERFACE"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-zinc-950">
                    <button
                      onClick={() => {
                        playBeep(523.25, "sine", 0.05);
                        setAppMode("CUSTOMER");
                        triggerToast(`Connected to Table ${currentTableId} self-ordering UI`, "success");
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-mono uppercase font-black tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        appMode === "CUSTOMER"
                          ? "bg-[#FF5A00] text-black font-bold font-black"
                          : "text-zinc-500 hover:text-zinc-300 bg-transparent hover:bg-zinc-900/30"
                      }`}
                    >
                      GUEST
                    </button>
                    <button
                      onClick={() => {
                        playBeep(587.33, "sine", 0.05);
                        setAppMode("STAFF");
                        triggerToast("Logged in as Roco Crew (Staff View active)", "success");
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-mono uppercase font-black tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        appMode === "STAFF"
                          ? "bg-[#FF5A00] text-black font-bold font-black"
                          : "text-zinc-500 hover:text-zinc-300 bg-transparent hover:bg-zinc-900/30"
                      }`}
                    >
                      STAFF VIEW
                    </button>
                  </div>
                </div>

                {/* Brand Theme Switcher Row */}
                <div className="bg-zinc-900/60 border border-zinc-850 p-3.5 rounded-2xl flex flex-col gap-2.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-bold tracking-wider">
                      🎨 ROCO INTERACTIVE THEME
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-[#FF5A00] font-black uppercase">
                      {theme} MODE ACTIVE
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-1 rounded-xl border border-zinc-950">
                    <button
                      onClick={() => {
                        playBeep(400, "sine", 0.05);
                        setTheme("DARK");
                        localStorage.setItem("roco_theme", "DARK");
                        triggerToast("Switched to Industrial Dark mode 🕶️", "success");
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-sub font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        theme === "DARK"
                          ? "bg-zinc-800 text-white font-black border border-zinc-700/60 shadow"
                          : "text-zinc-400 hover:text-zinc-200 bg-transparent"
                      }`}
                    >
                      ⚫ DARK
                    </button>
                    <button
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        setTheme("LIGHT");
                        localStorage.setItem("roco_theme", "LIGHT");
                        triggerToast("Switched to Clean White mode ☀️", "success");
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-sub font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        theme === "LIGHT"
                          ? "bg-white text-zinc-950 font-black border border-zinc-200 shadow"
                          : "text-zinc-400 hover:text-zinc-200 bg-transparent"
                      }`}
                    >
                      ⚪ LIGHT
                    </button>
                    <button
                      onClick={() => {
                        playBeep(500, "sine", 0.05);
                        setTheme("ORANGE");
                        localStorage.setItem("roco_theme", "ORANGE");
                        triggerToast("Switched to High-Energy Roco Orange mode 🔥", "success");
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-sub font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        theme === "ORANGE"
                          ? "bg-[#FF5A00] text-white font-black border border-orange-600 shadow"
                          : "text-zinc-400 hover:text-zinc-200 bg-transparent"
                      }`}
                    >
                      🔥 ORANGE
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    playBeep(440, "sine", 0.05);
                    triggerToast(soundEnabled ? "Audio alerts disabled" : "Audio sound effects enabled", "info");
                  }}
                  className="w-full bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-850 p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-98 cursor-pointer group"
                >
                  <div className="flex gap-3 items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${soundEnabled ? "bg-[#FF5A00]/15 text-[#FF5A00]" : "bg-black text-zinc-650"}`}>
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-display font-black text-white text-xs uppercase tracking-wider block">
                        System Audio Sounds
                      </span>
                      <span className="text-[10px] text-zinc-500 font-sans mt-0.5 block leading-none">
                        Alerts, game sounds, and button tones
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-black tracking-wider ${soundEnabled ? "bg-emerald-950/40 text-emerald-400" : "bg-red-950/40 text-red-500"}`}>
                    {soundEnabled ? "ENABLED" : "MUTED"}
                  </span>
                </button>

                {/* Help Action Row */}
                <button
                  onClick={() => {
                    playBeep(520, "sine", 0.05);
                    setIsHelpOpen(!isHelpOpen);
                    setIsControlMenuOpen(false);
                    triggerToast("Loaded onboarding assistant guide", "success");
                  }}
                  className="w-full bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-850 p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-98 cursor-pointer group"
                >
                  <div className="flex gap-3 items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isHelpOpen ? "bg-[#FF5A00] text-black" : "bg-black text-[#FF5A00]"}`}>
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-display font-black text-white text-xs uppercase tracking-wider block">
                        Onboarding Assistant
                      </span>
                      <span className="text-[10px] text-zinc-500 font-sans mt-0.5 block leading-none">
                        Interactive guided walkthrough & FAQs
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-bold">
                    {isHelpOpen ? "ACTIVE" : "LAUNCH"}
                  </span>
                </button>

                {/* Book a Table Action Row */}
                <button
                  onClick={() => {
                    playBeep(480, "sine", 0.08);
                    setIsBookingModalOpen(true);
                    setIsControlMenuOpen(false);
                  }}
                  className="w-full bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-850 p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-98 cursor-pointer group"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-black text-[#FF5A00] flex items-center justify-center text-sm">
                      📆
                    </div>
                    <div>
                      <span className="font-display font-black text-white text-xs uppercase tracking-wider block">
                        Book a Table
                      </span>
                      <span className="text-[10px] text-zinc-500 font-sans mt-0.5 block leading-none">
                        Interactive pub map grid reservations
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-bold">RESERVE</span>
                </button>

                {/* POS Sync Integration Action Row */}
                <button
                  onClick={() => {
                    playBeep(650, "sine", 0.08);
                    setIsPosConfigOpen(true);
                    setIsControlMenuOpen(false);
                  }}
                  className="w-full bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-850 p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-98 cursor-pointer group"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-black text-[#FF5A00] flex items-center justify-center text-sm">
                      🔌
                    </div>
                    <div>
                      <span className="font-display font-black text-white text-xs uppercase tracking-wider block">
                        POS Link Integration
                      </span>
                      <span className="text-[10px] text-[#FF5A00] font-sans mt-0.5 block leading-none font-bold">
                        Pilot, GAAP, & Cloud POS Sync
                      </span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-black tracking-wider ${isPosConnected ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/10" : "bg-zinc-950/40 text-zinc-500 border border-zinc-800"}`}>
                    {isPosConnected ? "ACTIVE" : "CONFIGURE"}
                  </span>
                </button>

                {/* Play Games Action Row */}
                <button
                  onClick={() => {
                    playBeep(520, "sine", 0.08);
                    setIsGamesModalOpen(true);
                    setIsControlMenuOpen(false);
                  }}
                  className="w-full bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-850 p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-98 cursor-pointer group"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-black text-[#FF5A00] flex items-center justify-center text-sm">
                      🎮
                    </div>
                    <div>
                      <span className="font-display font-black text-white text-xs uppercase tracking-wider block">
                        Play Games Arena
                      </span>
                      <span className="text-[10px] text-zinc-500 font-sans mt-0.5 block leading-none">
                        Retro Asteroids, Darts, and Drinking games
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-bold">PLAY GUEST 🎮</span>
                </button>

              </div>

              {/* Footer */}
              <div className="p-3 bg-black border-t border-zinc-900 text-center font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest shrink-0">
                System Control Centre • Responsive Integration
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

          {/* LARGE-SCAN SHARE QR MODAL */}
          <AnimatePresence>
            {isQrModalOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsQrModalOpen(false)}
                  className="fixed inset-0 bg-black/95 z-[99990] backdrop-blur-md cursor-pointer"
                />

                {/* Modal box */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  transition={{ type: "spring", damping: 22, stiffness: 240 }}
                  className="fixed inset-x-4 top-[8%] max-w-[420px] mx-auto bg-[#1C1C1E] border-2 border-[#FF5A00]/50 rounded-3xl shadow-[0_0_40px_rgba(231, 138, 62,0.25)] z-[99995] overflow-hidden flex flex-col font-sans"
                >
                  {/* Header */}
                  <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center relative">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-[#FF5A00]" />
                      <div>
                        <h4 className="font-sub font-black text-white text-xs uppercase tracking-widest leading-none">
                          Large Bill Split Scanner
                        </h4>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">
                          EASY MOBILE CAMERA SCANNING
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        setIsQrModalOpen(false);
                      }}
                      className="p-2 bg-[#121212] border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* QR Image Frame */}
                  <div className="p-6 flex flex-col items-center justify-center text-center gap-4 bg-[#121212]/30">
                    <div 
                      id="premium-table-share-qr-container-massive" 
                      className="w-[245px] h-[245px] bg-black rounded-3xl border-4 border-[#FF5A00] flex items-center justify-center p-3 shrink-0 shadow-[0_0_25px_rgba(255,90,0,0.25)] relative overflow-hidden"
                    >
                      {customQrs[currentTableId || "12"] ? (
                        <img
                          src={customQrs[currentTableId || "12"]}
                          alt={`Table ${currentTableId || "12"} QR`}
                          className="w-[215px] h-[215px] object-contain rounded-2xl"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <HalftoneQRCode
                          text={getSecureGuestUrl(currentTableId || "12")}
                          src="https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479"
                          size={215}
                          colorDark="#FF5A00"
                          colorLight="#000000"
                        />
                      )}
                      <div className="absolute inset-0 bg-orange-400/2 pointer-events-none rounded-2xl" />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-zinc-850">
                        TABLE: {currentTableId || "12"} • SESSION: SF-{currentTableId || "12"}
                      </span>
                      <h5 className="font-sub font-black text-white text-xs uppercase tracking-wider mt-3 leading-snug">
                        Point companion camera here!
                      </h5>
                      <p className="text-[11px] text-zinc-500 max-w-[280px] mt-1 leading-normal italic font-sans animate-pulse-slow">
                        Any camera can scan this code to link directly to this live table session. They can order, split, and pay for items independently.
                      </p>
                    </div>
                  </div>

                  {/* Operational Controls Footer */}
                  <div className="p-4 bg-black border-t border-zinc-900 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const url = getSecureGuestUrl(currentTableId || "12");
                        navigator.clipboard.writeText(url);
                        playBeep(600, "sine", 0.08);
                        setCopiedLink(true);
                        triggerToast("Session URL Copied to clipboard!", "success");
                        setTimeout(() => setCopiedLink(false), 2005);
                      }}
                      className="w-full py-3 bg-[#FF5A00] hover:bg-orange-400 text-black font-sub font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg tracking-wider active:scale-95"
                    >
                      <Share2 className="w-4 h-4 shrink-0" />
                      {copiedLink ? "Link Copied!" : "Copy Table URL link"}
                    </button>

                    <button
                      onClick={() => {
                        handleSimulateJoin();
                        playBeep(520, "sine", 0.05);
                      }}
                      className="w-full py-2.5 bg-[#1C1C1E] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-sub font-bold text-[10.5px] uppercase rounded-xl transition-colors cursor-pointer"
                    >
                      Simulate direct join 👥
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* CUSTOM QR CODES MANAGEMENT & BULK EXPORT MODAL */}
          <AnimatePresence>
            {isCustomQrPanelOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsCustomQrPanelOpen(false)}
                  className="fixed inset-0 bg-black/95 z-[99990] backdrop-blur-md cursor-pointer"
                />

                {/* Modal box container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  transition={{ type: "spring", damping: 22, stiffness: 245 }}
                  className="fixed inset-x-4 top-[5%] bottom-[5%] max-w-[680px] mx-auto bg-[#1C1C1E] border-2 border-[#FF5A00]/50 rounded-3xl shadow-[0_0_50px_rgba(255,90,0,0.3)] z-[99995] overflow-hidden flex flex-col font-sans"
                >
                  {/* Header */}
                  <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center relative">
                    <div className="flex items-center gap-2.5">
                      <QrCode className="w-6 h-6 text-[#FF5A00]" />
                      <div>
                        <h4 className="font-display font-black text-white text-[11px] sm:text-xs uppercase tracking-widest leading-none">
                          🎫 Table QR Customization & Exporter Base
                        </h4>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase mt-1">
                          EXPORT BULK CARD LABELS OR UPLOAD CUSTOM DESIGNED TARGETS
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        setIsCustomQrPanelOpen(false);
                      }}
                      className="p-2 bg-[#121212] border border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body: list of tables + export hub */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Top Alert Instruction */}
                    <div className="bg-orange-500/10 border border-orange-500/20 p-3.5 rounded-xl text-xs flex flex-col gap-1.5 font-mono text-zinc-300">
                      <p className="text-[#FF5A00] font-black uppercase tracking-wider text-[11px] flex items-center gap-1">
                        🚀 HIGH FIDELITY TABLE LINKING INTERACTION
                      </p>
                      <p className="leading-relaxed text-[10px]">
                        Copy a table's digital link or parameter slug to generate your own custom branded QR codes using any generator tool, then upload the custom QR files here! Customized QR targets replace the default on-screen code instantly across all orders, split bills, and crew dashboards.
                      </p>
                    </div>

                    {/* Bulk Action Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          playBeep(523, "sine", 0.08);
                          setShowQrPrintSheet(true);
                        }}
                        className="flex-1 py-3 bg-[#FF5A00] hover:bg-[#FF5A00]/90 text-black font-mono text-xs font-black uppercase rounded-xl tracking-wider transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <Printer className="w-4 h-4" /> Display Printable QR Sheet Grid
                      </button>

                      <button
                        onClick={() => {
                          playBeep(330, "triangle", 0.05);
                          setCustomQrs({});
                          triggerToast("Restored all table QR codes to defaults!", "info");
                        }}
                        className="py-3 px-4 bg-zinc-900 hover:bg-red-950/20 text-zinc-400 hover:text-red-400 border border-zinc-850 hover:border-red-500/20 font-mono text-[10.5px] font-bold uppercase rounded-xl tracking-wider transition-all cursor-pointer"
                      >
                        Restore Defaults
                      </button>
                    </div>

                    <div className="border-t border-zinc-900 pt-4 space-y-4">
                      <h5 className="font-display font-black text-white text-xs uppercase tracking-wider">
                        📋 Dynamic Table Surfaces (13 Systems)
                      </h5>

                      <div className="grid grid-cols-1 gap-3.5">
                        {ROCO_TABLES.map((table) => {
                          const tableId = table.id;
                          const guestUrl = getSecureGuestUrl(tableId);
                          const hasCustom = !!customQrs[tableId];

                          return (
                            <div 
                              key={tableId}
                              className="bg-black/40 border border-zinc-900/80 p-3.5 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between"
                            >
                              {/* Left Info */}
                              <div className="flex items-center gap-3.5 w-full md:w-auto">
                                <div className="p-2 bg-[#FF5A00]/10 border border-[#FF5A00]/25 rounded-lg text-center min-w-[50px]">
                                  <span className="block text-[7px] font-mono text-zinc-550 uppercase leading-none">TABLE</span>
                                  <span className="font-display font-black text-[#FF5A00] text-sm block mt-0.5 leading-none">
                                    {tableId.padStart(2, "0")}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <h6 className="font-display font-black text-white text-[12px] uppercase flex items-center gap-1.5 leading-none">
                                    {table.name}
                                    <span className="text-[9px] text-[#FF5A00] font-mono font-bold leading-none">({table.type})</span>
                                  </h6>
                                  <p className="text-[9.5px] font-mono text-zinc-500 leading-none">
                                    Capacity: {table.capacity} guests • Location: Row {table.row}, Col {table.col}
                                  </p>
                                  {/* Badges */}
                                  <div className="flex gap-1.5 mt-1">
                                    {hasCustom ? (
                                      <span className="text-[7.5px] font-mono text-emerald-400 font-extrabold bg-emerald-950/45 border border-emerald-500/25 px-1.5 py-0.5 rounded uppercase leading-none">
                                        🟢 Overridden Custom QR
                                      </span>
                                    ) : (
                                      <span className="text-[7.5px] font-mono text-orange-400/80 font-bold bg-orange-950/20 border border-orange-500/15 px-1.5 py-0.5 rounded uppercase leading-none">
                                        🟠 System Halftone QR
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Clipboard Actions */}
                              <div className="flex flex-col gap-1.5 w-full md:w-[150px]">
                                <button
                                  type="button"
                                  onClick={() => handleCopyUrl(tableId)}
                                  className="w-full py-1.5 px-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-mono text-[9px] font-black uppercase rounded-md tracking-wider flex items-center justify-center gap-1.5 border border-zinc-850 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3 text-[#FF5A00]" /> Copy Guest Link
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopySlug(tableId)}
                                  className="w-full py-1 px-2 bg-zinc-900/50 hover:bg-[#121212] text-zinc-500 font-mono text-[8px] font-bold uppercase rounded-md tracking-wider flex items-center justify-center gap-1.5 border border-zinc-900 cursor-pointer"
                                  title="Copy ?table=X parameter"
                                >
                                  Copy Table Slug
                                </button>
                              </div>

                              {/* Upload custom input & controls */}
                              <div className="flex flex-col gap-2 w-full md:w-[220px] bg-zinc-950/45 p-2.5 border border-zinc-900 rounded-lg">
                                <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest text-center leading-none">
                                  Upload / Assign Custom QR
                                </span>
                                
                                <div className="flex flex-col gap-1 pt-1">
                                  {/* Custom file uploader */}
                                  <label className="w-full py-1.5 bg-[#FF5A00]/10 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-black border border-[#FF5A00]/25 rounded-md font-mono text-[8.5px] font-black uppercase text-center cursor-pointer transition-all flex items-center justify-center gap-1">
                                    <Upload className="w-2.5 h-2.5 shrink-0" />
                                    Choose image file
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleQrUpload(tableId, e)}
                                      className="hidden"
                                    />
                                  </label>

                                  {/* Pasted Image URL input */}
                                  <div className="flex gap-1 mt-1">
                                    <input
                                      type="text"
                                      placeholder="Pasted image URL..."
                                      value={pastedUrls[tableId] || ""}
                                      onChange={(e) => {
                                        const urlVal = e.target.value;
                                        setPastedUrls(prev => ({ ...prev, [tableId]: urlVal }));
                                        // Save immediately if valid URL
                                        if (urlVal.trim()) {
                                          setCustomQrs(prev => ({ ...prev, [tableId]: urlVal.trim() }));
                                        }
                                      }}
                                      className="flex-1 bg-black text-white text-[8px] font-mono px-2 py-1 rounded border border-zinc-850 placeholder:text-zinc-650 focus:outline-none focus:border-orange-500 min-w-0"
                                    />
                                    {hasCustom && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          playBeep(330, "triangle", 0.05);
                                          setCustomQrs(prev => {
                                            const next = { ...prev };
                                            delete next[tableId];
                                            return next;
                                          });
                                          setPastedUrls(prev => {
                                            const next = { ...prev };
                                            delete next[tableId];
                                            return next;
                                          });
                                          triggerToast(`Reset QR Code for Table ${tableId}!`, "info");
                                        }}
                                        className="py-1 px-2 bg-red-950/40 hover:bg-red-900 border border-red-500/20 text-red-400 font-mono text-[8px] font-bold uppercase rounded cursor-pointer shrink-0"
                                        title="Reset to default halftone generator"
                                      >
                                        Reset
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Mini visual preview */}
                              <div className="w-12 h-12 bg-black border border-zinc-900 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                {hasCustom ? (
                                  <img 
                                    src={customQrs[tableId]} 
                                    alt="Custom target"
                                    className="w-11 h-11 object-contain rounded"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="opacity-45 hover:opacity-100 transition-opacity">
                                    <HalftoneQRCode 
                                      text={guestUrl}
                                      src="https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479"
                                      size={40}
                                      colorDark="#FF5A00"
                                      colorLight="#000000"
                                    />
                                  </div>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>



          {/* POS INTEGRATION & SYNC CONTROL CENTER MODAL */}
          <AnimatePresence>
            {isPosConfigOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsPosConfigOpen(false)}
                  className="fixed inset-0 bg-black/95 z-[99990] backdrop-blur-md cursor-pointer"
                />

                {/* Modal box */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  transition={{ type: "spring", damping: 22, stiffness: 240 }}
                  className="fixed inset-x-4 top-[6%] bottom-[6%] max-w-[500px] mx-auto bg-[#1C1C1E] border-2 border-[#FF5A00] rounded-3xl shadow-[0_0_50px_rgba(255,90,0,0.3)] z-[99995] overflow-hidden flex flex-col font-sans"
                >
                  {/* Header */}
                  <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FF5A00]/10 flex items-center justify-center border border-[#FF5A00]/20">
                        <Zap className="w-4 h-4 text-[#FF5A00] fill-[#FF5A00]/20 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-sub font-black text-white text-xs uppercase tracking-widest leading-none">
                          POS Sync Gateway
                        </h4>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">
                          Enterprise Stack Integration
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        setIsPosConfigOpen(false);
                      }}
                      className="p-2 bg-[#121212] border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body area (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    
                    {/* Intro info box */}
                    <div className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-[#FF5A00] uppercase font-bold tracking-wider">
                          🌐 INTEGRATION BRIDGE
                        </span>
                        <span className={`text-[8.5px] font-mono uppercase px-2 py-0.5 rounded font-black tracking-wider ${isPosConnected ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" : "bg-red-950/40 text-red-400 border border-red-500/10"}`}>
                          {isPosConnected ? "🟢 STACK CONNECTED" : "🔴 LINK OFFLINE"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                        Bridge your active table guest orders, split payments, and summons alerts into your existing store infrastructure. Ensure smooth, hands-free ticket printing for chef lines.
                      </p>
                    </div>

                    {/* Choose POS Dropdown selector */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-black block">
                        Select POS Platform:
                      </label>
                      <select
                        value={selectedPosSystem}
                        onChange={(e) => {
                          const newPos = e.target.value;
                          setSelectedPosSystem(newPos);
                          localStorage.setItem("roco_pos_selected", newPos);
                          playBeep(480, "sine", 0.05);
                          setPosConnectionLogs([]);
                          setIsPosConnected(false);
                          localStorage.removeItem("roco_pos_connected");
                          triggerToast(`Switched terminal layout to ${newPos}`, "info");
                        }}
                        className="w-full bg-[#121212] border border-zinc-800 hover:border-zinc-700 text-white font-mono text-xs uppercase p-3 rounded-xl focus:outline-none focus:border-[#FF5A00] transition-colors cursor-pointer"
                      >
                        <option value="PILOT">Pilot Software (Hospitality Mainstay)</option>
                        <option value="GAAP">GAAP Cloud POS (SA Enterprise)</option>
                        <option value="TOAST">Toast POS (Cloud REST Webhook)</option>
                        <option value="LIGHTSPEED">Lightspeed Restaurant (Global Cloud)</option>
                        <option value="MICROS">Micros Simphony (Oracle Enterprise)</option>
                        <option value="CLOVER">Clover POS Node</option>
                        <option value="REST">Custom REST Webhooks (JSON Relay)</option>
                      </select>
                    </div>

                    {/* Dynamically Prompt Required Information fields */}
                    <div className="bg-black/40 border border-zinc-900 rounded-2xl p-4.5 space-y-3">
                      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2.5">
                        <Server className="w-3.5 h-3.5 text-[#FF5A00]" />
                        <span className="text-[10px] font-mono text-zinc-100 uppercase tracking-wide font-black">
                          {selectedPosSystem} Integration Requirements:
                        </span>
                      </div>

                      {/* Render fields according to choices */}
                      {selectedPosSystem === "PILOT" && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-zinc-400 italic">
                            Used by high-volume franchises. Communicates directly with the Pilot Web Services local daemon or cloud hub.
                          </p>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Pilot API Gateway URL:</label>
                            <input 
                              type="text" 
                              value={posSettings.PILOT?.apiUrl || ""} 
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, PILOT: { ...prev.PILOT, apiUrl: val } }));
                              }}
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                              <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Store Merchant ID:</label>
                              <input 
                                type="text" 
                                value={posSettings.PILOT?.storeCode || ""} 
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPosSettings(prev => ({ ...prev, PILOT: { ...prev.PILOT, storeCode: val } }));
                                }}
                                className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Order Channel ID:</label>
                              <input 
                                type="text" 
                                value={posSettings.PILOT?.channelId || ""} 
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPosSettings(prev => ({ ...prev, PILOT: { ...prev.PILOT, channelId: val } }));
                                }}
                                className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Pilot SDK Web Service Secret Key:</label>
                            <input 
                              type="password" 
                              value={posSettings.PILOT?.apiKey || ""} 
                              placeholder="••••••••••••••••••••••••"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, PILOT: { ...prev.PILOT, apiKey: val } }));
                              }}
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Table ID Mapping Protocol:</label>
                            <select
                              value={posSettings.PILOT?.tableMappingType || "DYNAMIC_NUMERIC"}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, PILOT: { ...prev.PILOT, tableMappingType: val } }));
                              }}
                              className="w-full bg-[#121212] border border-zinc-850 text-zinc-300 font-mono text-xs p-2 rounded-lg focus:outline-none"
                            >
                              <option value="DYNAMIC_NUMERIC">Dynamic Numeric Table (Default)</option>
                              <option value="FIXED_BOOTH">Fixed Prefix ("ROCO-T-[NUM]")</option>
                              <option value="ZONE_MAPPED">Seating Blueprint Floor Plan Match</option>
                            </select>
                          </div>

                          {/* Credentials Helper Guide Box */}
                          <div className="mt-3 bg-orange-950/20 border border-orange-500/20 rounded-xl p-3 space-y-1.5 text-left">
                            <h5 className="text-[9px] font-mono font-black text-[#FF5A00] uppercase tracking-wider flex items-center gap-1">
                              <span>ℹ️</span> HOW TO RETRIEVE PILOT POS CREDENTIALS
                            </h5>
                            <ul className="text-[10px] text-zinc-400 space-y-1.5 list-disc list-inside leading-relaxed font-sans">
                              <li>
                                <strong className="text-zinc-200">Pilot API Gateway URL:</strong> Locate inside Pilot Web Services Configuration module at <code className="text-[9px] px-1 bg-black/40 text-orange-400 rounded">C:\PilotSoftware\POS\WebServices\config.json</code> (typically <code className="text-[9px] text-[#FF5A00]">https://api.pilotpos.co.za/v1</code> or internal LAN gateway).
                              </li>
                              <li>
                                <strong className="text-zinc-200">Store Merchant ID:</strong> Look at the top-right-hand header of your Pilot Office back-office dashboard or at the bottom-most segment of standard cash-up summaries.
                              </li>
                              <li>
                                <strong className="text-zinc-200">Order Channel ID:</strong> Set up under <code className="text-[9px] text-zinc-300 bg-zinc-900 px-1 rounded">Pilot Office → Integration Partners Hub</code>. The default identifier code is <code className="text-[9px] text-zinc-300 font-mono">ROCO-GUEST-APP-SWG</code>.
                              </li>
                              <li>
                                <strong className="text-zinc-200">Secret Key:</strong> Generate as a Master franchise administrator in the Pilot Cloud Portal under <code className="text-[9px] text-zinc-300">Tenant Settings → Developers → Third-party Apps → API tokens</code>.
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {selectedPosSystem === "GAAP" && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-zinc-400 italic">
                            SA's robust point-of-sale option. Links through security credentials to GAAP Cloud API services.
                          </p>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">GAAP Gateway URL Address:</label>
                            <input 
                              type="text" 
                              value={posSettings.GAAP?.gatewayUrl || ""} 
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, GAAP: { ...prev.GAAP, gatewayUrl: val } }));
                              }}
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                              <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">GAAP Branch Site ID:</label>
                              <input 
                                type="text" 
                                value={posSettings.GAAP?.siteId || ""} 
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPosSettings(prev => ({ ...prev, GAAP: { ...prev.GAAP, siteId: val } }));
                                }}
                                className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Dining Option Code:</label>
                              <input 
                                type="text" 
                                value={posSettings.GAAP?.diningOptionCode || ""} 
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPosSettings(prev => ({ ...prev, GAAP: { ...prev.GAAP, diningOptionCode: val } }));
                                }}
                                className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Integrator App Token Secret:</label>
                            <input 
                              type="password" 
                              value={posSettings.GAAP?.clientSecret || ""} 
                              placeholder="••••••••••••••••••••••••"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, GAAP: { ...prev.GAAP, clientSecret: val } }));
                              }}
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Dynamic Status Update Webhook:</label>
                            <input 
                              type="text" 
                              value={posSettings.GAAP?.webhookUrl || ""} 
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, GAAP: { ...prev.GAAP, webhookUrl: val } }));
                              }}
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                            />
                          </div>

                          {/* Credentials Helper Guide Box */}
                          <div className="mt-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 space-y-1.5 text-left">
                            <h5 className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                              <span>ℹ️</span> HOW TO RETRIEVE GAAP POS CREDENTIALS
                            </h5>
                            <ul className="text-[10px] text-zinc-400 space-y-1.5 list-disc list-inside leading-relaxed font-sans">
                              <li>
                                <strong className="text-zinc-200">GAAP Gateway URL Address:</strong> Found inside the GAAP Partner Integration specifications sheet. Use the cloud relay address <code className="text-[9px] px-1 bg-black/40 text-emerald-400 rounded">https://gaapcloud.net/integrator/api/v2</code>.
                              </li>
                              <li>
                                <strong className="text-zinc-200">GAAP Branch Site ID:</strong> Standard identifier on your franchise invoice/license. Labeled under <code className="text-[9px] text-zinc-300 bg-zinc-900 px-1 rounded">GAAP Back Office → Setup → Site ID Parameter</code> (looks like <code className="text-[9px] text-zinc-300">GAAP-ROCO-DURBAN-SOUTH</code>).
                              </li>
                              <li>
                                <strong className="text-zinc-200">Dining Option Code:</strong> Designates automatic table posting in GAAP. Standard is usually <code className="text-[9px] text-zinc-300 font-mono">10</code> (Dine-in Tablet scan category) configured in GAAP Configurator.
                              </li>
                              <li>
                                <strong className="text-zinc-200">Integrator App Token Secret:</strong> Log in to the GAAP Cloud portal (gaapcloud.net) and navigate to <code className="text-[9px] text-zinc-300">Integrator Tokens → Generate App Secret</code>.
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {selectedPosSystem === "TOAST" && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-zinc-400 italic">
                            Universal Cloud POS. Connects natively with Toast APIs. Injection flows into the local Toast KDS (Kitchen Display System).
                          </p>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Toast Client ID Key:</label>
                            <input 
                              type="text" 
                              value={posSettings.TOAST?.clientId || ""} 
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, TOAST: { ...prev.TOAST, clientId: val } }));
                              }}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Toast Client Secret (OAuth):</label>
                            <input 
                              type="password" 
                              value={posSettings.TOAST?.clientSecret || ""} 
                              placeholder="••••••••••••••••••••••••"
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, TOAST: { ...prev.TOAST, clientSecret: val } }));
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                              <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Toast Group ID GUID:</label>
                              <input 
                                type="text" 
                                value={posSettings.TOAST?.groupId || ""} 
                                className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-[10px] p-2 rounded-lg"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPosSettings(prev => ({ ...prev, TOAST: { ...prev.TOAST, groupId: val } }));
                                }}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Sandbox Environment:</label>
                              <select
                                value={posSettings.TOAST?.envMode || "SANDBOX"}
                                className="w-full bg-[#121212] border border-zinc-850 text-zinc-350 font-mono text-[10px] p-2 rounded-lg select-arrow"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPosSettings(prev => ({ ...prev, TOAST: { ...prev.TOAST, envMode: val } }));
                                }}
                              >
                                <option value="SANDBOX">Sandbox Mode</option>
                                <option value="PRODUCTION">Live Production</option>
                              </select>
                            </div>
                          </div>

                          {/* Credentials Helper Guide Box */}
                          <div className="mt-3 bg-orange-950/20 border border-orange-500/20 rounded-xl p-3 space-y-1.5 text-left">
                            <h5 className="text-[9px] font-mono font-black text-[#FF5A00] uppercase tracking-wider flex items-center gap-1">
                              <span>ℹ️</span> HOW TO RETRIEVE TOAST POS CREDENTIALS
                            </h5>
                            <ul className="text-[10px] text-zinc-400 space-y-1.5 list-disc list-inside leading-relaxed font-sans">
                              <li>
                                <strong className="text-zinc-200">Toast Client ID & Client Secret:</strong> Found in the <code className="text-[9px] text-[#FF5A00]">Toast Developer Portal</code> (integration.toasttab.com). Log in with your Toast credentials, select <strong className="text-zinc-300">My Integrations</strong>, and select <strong className="text-zinc-300">Create New Web API Credential</strong>.
                              </li>
                              <li>
                                <strong className="text-zinc-200">Toast Group ID GUID:</strong> Copy the unique organization ID directly from your browser's address bar when logged into the Toast Back-Office dashboard (the alphanumeric string right after <code className="text-[9px] text-zinc-400">/restaurants/group/[ID]</code>).
                              </li>
                              <li>
                                <strong className="text-zinc-200">Sandbox Code:</strong> For development or proof-of-concept testing, ensure you use the Sandbox Mode with test credentials before promoting to live restaurant production.
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {selectedPosSystem === "LIGHTSPEED" && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-zinc-400 italic">
                            Cloud POS used global. Connects with Lightspeed accounts. Includes local receipt layouts.
                          </p>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Lightspeed Tenant ID Mapping:</label>
                            <input 
                              type="text" 
                              value={posSettings.LIGHTSPEED?.tenantId || ""} 
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, LIGHTSPEED: { ...prev.LIGHTSPEED, tenantId: val } }));
                              }}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Target Register Node ID:</label>
                            <input 
                              type="text" 
                              value={posSettings.LIGHTSPEED?.registerId || ""} 
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, LIGHTSPEED: { ...prev.LIGHTSPEED, registerId: val } }));
                              }}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">JSON API Access Token Key:</label>
                            <input 
                              type="password" 
                              value={posSettings.LIGHTSPEED?.accessToken || ""} 
                              placeholder="••••••••••••••••••••••••"
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, LIGHTSPEED: { ...prev.LIGHTSPEED, accessToken: val } }));
                              }}
                            />
                          </div>

                          {/* Credentials Helper Guide Box */}
                          <div className="mt-3 bg-zinc-950 border border-zinc-900 rounded-xl p-3 space-y-1.5 text-left">
                            <h5 className="text-[9px] font-mono font-black text-[#FF5A00] uppercase tracking-wider flex items-center gap-1">
                              <span>ℹ️</span> HOW TO RETRIEVE LIGHTSPEED POS CREDENTIALS
                            </h5>
                            <ul className="text-[10px] text-zinc-400 space-y-1.5 list-disc list-inside leading-relaxed font-sans">
                              <li>
                                <strong className="text-zinc-200">Tenant ID Mapping:</strong> Open your <code className="text-[9px] text-[#FF5A00]">Lightspeed Back Office</code>. Under <strong className="text-zinc-300">Settings → Company</strong>, look for your account numeric Tenant ID or copy the sub-domain prefix of your Lightspeed URL dashboard.
                              </li>
                              <li>
                                <strong className="text-zinc-200">Target Register Node ID:</strong> Go to <strong className="text-zinc-300">Devices → Registers</strong>. Select your main kitchen receipt-printing workstation tablet and copy the Register ID listed on the secondary detail summary.
                              </li>
                              <li>
                                <strong className="text-zinc-200">API Access Token:</strong> Navigate to <strong className="text-zinc-300">Integrations → API Keys & Access Tokens</strong>. Click <strong className="text-zinc-300">New Token</strong>, ensure write access is enabled for order injection, and save the generated bearer token string.
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {selectedPosSystem === "MICROS" && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-zinc-400 italic">
                            Oracle Enterprise hospitality stack. Sends secure payloads to Micros Simphony Server Transaction services.
                          </p>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Micros Simphony Webservice URL:</label>
                            <input 
                              type="text" 
                              value={posSettings.MICROS?.simphonyUrl || ""} 
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, MICROS: { ...prev.MICROS, simphonyUrl: val } }));
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                              <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Workstation Node:</label>
                              <input 
                                type="text" 
                                value={posSettings.MICROS?.workstationId || ""} 
                                className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPosSettings(prev => ({ ...prev, MICROS: { ...prev.MICROS, workstationId: val } }));
                                }}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Revenue Center ID:</label>
                              <input 
                                type="text" 
                                value={posSettings.MICROS?.revenueCenterId || ""} 
                                className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPosSettings(prev => ({ ...prev, MICROS: { ...prev.MICROS, revenueCenterId: val } }));
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Micros Host Employee ID:</label>
                            <input 
                              type="text" 
                              value={posSettings.MICROS?.employeeId || ""} 
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, MICROS: { ...prev.MICROS, employeeId: val } }));
                              }}
                            />
                          </div>

                          {/* Credentials Helper Guide Box */}
                          <div className="mt-3 bg-orange-950/20 border border-orange-500/20 rounded-xl p-3 space-y-1.5 text-left">
                            <h5 className="text-[9px] font-mono font-black text-[#FF5A00] uppercase tracking-wider flex items-center gap-1">
                              <span>ℹ️</span> HOW TO RETRIEVE MICROS Simphony CREDENTIALS
                            </h5>
                            <ul className="text-[10px] text-zinc-400 space-y-1.5 list-disc list-inside leading-relaxed font-sans">
                              <li>
                                <strong className="text-zinc-200">Simphony Webservice URL:</strong> Distributed under your Oracle Enterprise license agreement. Generally hosted on local property servers as <code className="text-[9px] text-[#FF5A00]">https://[server-ip]:8080/api</code> or Simphony Cloud Enterprise endpoints.
                              </li>
                              <li>
                                <strong className="text-zinc-200">Workstation Node ID:</strong> Go to the <strong className="text-zinc-300">Enterprise Management Console (EMC) → Setup → Workstations</strong>. Select the terminal designated for mobile orders and copy the numeric ID.
                              </li>
                              <li>
                                <strong className="text-zinc-200">Revenue Center ID:</strong> Located in <strong className="text-zinc-300">EMC → Enterprise → Revenue Centers</strong>. Ensure this matches the specific zone handling digital/bar ticket routing.
                              </li>
                              <li>
                                <strong className="text-zinc-200">Host Employee ID:</strong> Enter an active Simphony operator employee code who possesses permission keys to open dynamic checks on guest tables.
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {selectedPosSystem === "CLOVER" && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-zinc-400 italic">
                            Links fast-casual orders through the Clover Web Service endpoints directly.
                          </p>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Clover Merchant UUID:</label>
                            <input 
                              type="text" 
                              value={posSettings.CLOVER?.merchantId || ""} 
                              className="w-full bg-[#121212] border border-[#121212] text-zinc-100 font-mono text-xs p-2 rounded-lg"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, CLOVER: { ...prev.CLOVER, merchantId: val } }));
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                              <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Auth Target Env:</label>
                              <select
                                value={posSettings.CLOVER?.env || "PRODUCTION"}
                                className="w-full bg-[#121212] border border-zinc-850 text-zinc-300 font-mono text-xs p-2 rounded-lg"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPosSettings(prev => ({ ...prev, CLOVER: { ...prev.CLOVER, env: val } }));
                                }}
                              >
                                <option value="PRODUCTION">Clover Live Account</option>
                                <option value="SANDBOX">Clover Sandbox Dev</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">API Access Token:</label>
                              <input 
                                type="password" 
                                value={posSettings.CLOVER?.accessToken || ""} 
                                placeholder="••••••••••••••••••••••••"
                                className="w-full bg-[#121212] border border-zinc-850 text-zinc-100 font-mono text-xs p-2 rounded-lg"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPosSettings(prev => ({ ...prev, CLOVER: { ...prev.CLOVER, accessToken: val } }));
                                }}
                              />
                            </div>
                          </div>

                          {/* Credentials Helper Guide Box */}
                          <div className="mt-3 bg-zinc-950 border border-zinc-900 rounded-xl p-3 space-y-1.5 text-left">
                            <h5 className="text-[9px] font-mono font-black text-[#FF5A00] uppercase tracking-wider flex items-center gap-1">
                              <span>ℹ️</span> HOW TO RETRIEVE CLOVER POS CREDENTIALS
                            </h5>
                            <ul className="text-[10px] text-zinc-400 space-y-1.5 list-disc list-inside leading-relaxed font-sans">
                              <li>
                                <strong className="text-zinc-200">Merchant UUID Address:</strong> Log in to your <code className="text-[9px] text-[#FF5A00]">Clover Web Dashboard</code>. Inspect your browser's address bar. Your Merchant ID is the 13-character alpha-numeric string located immediately after the <code className="text-[9px] text-zinc-400">/r/</code> or <code className="text-[9px] text-zinc-400">/m/</code> route directory.
                              </li>
                              <li>
                                <strong className="text-zinc-200">API Access Token:</strong> Go to the <strong className="text-zinc-300">Clover App Market</strong> and search for the <strong className="text-zinc-300">Custom Developer Applications</strong> tool (or go to <strong className="text-zinc-300">Setup → Web Integrations → API Tokens</strong>) and generate a secure token with write permissions for Orders and Tables.
                              </li>
                              <li>
                                <strong className="text-zinc-200">Environment Target:</strong> Direct your requests correctly; use Sandbox Dev accounts for trial testing and Live Production for premium ready installations.
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {selectedPosSystem === "REST" && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-zinc-400 italic">
                            Fully customizable and highly robust JSON payload pusher. Relays direct requests to any REST API endpoint.
                          </p>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Custom POST URL Target Address:</label>
                            <input 
                              type="text" 
                              value={posSettings.REST?.customUrl || ""} 
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, REST: { ...prev.REST, customUrl: val } }));
                              }}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Standard Request Authorization Header:</label>
                            <input 
                              type="text" 
                              value={posSettings.REST?.bearerToken || ""} 
                              placeholder="Bearer secret_token_api_here"
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, REST: { ...prev.REST, bearerToken: val } }));
                              }}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold">Webhook Integrity Hashing Key (HMAC):</label>
                            <input 
                              type="password" 
                              placeholder="••••••••••••••••••••••••"
                              value={posSettings.REST?.signingSecret || ""} 
                              className="w-full bg-[#121212] border border-zinc-850 focus:border-[#FF5A00] text-zinc-100 font-mono text-xs p-2 rounded-lg focus:outline-none"
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosSettings(prev => ({ ...prev, REST: { ...prev.REST, signingSecret: val } }));
                              }}
                            />
                          </div>

                          {/* Credentials Helper Guide Box */}
                          <div className="mt-3 bg-zinc-950 border border-zinc-900 rounded-xl p-3 space-y-1.5 text-left">
                            <h5 className="text-[9px] font-mono font-black text-[#FF5A00] uppercase tracking-wider flex items-center gap-1">
                              <span>ℹ️</span> DESIGNING YOUR CUSTOM HTTP POST INTEGRATION
                            </h5>
                            <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                              When a customer scans a table QR and places an order, RocoMamas OS transmits a structured <code className="text-[9.5px] text-zinc-300">HTTP POST</code> request containing a JSON payload with:
                            </p>
                            <ul className="text-[10px] text-zinc-400 space-y-1.5 list-disc list-inside leading-relaxed font-sans pl-1">
                              <li>
                                <strong className="text-zinc-200">Table & Seat Identifiers:</strong> Labeled <code className="text-[9px] text-orange-400 bg-black/40 px-1 rounded">tableIndex</code> and <code className="text-[9px] text-orange-400 bg-black/40 px-1 rounded">seatNumber</code>.
                              </li>
                              <li>
                                <strong className="text-zinc-200">Cart Items Array:</strong> Custom ingredients, smashburger choices, and milkshakes specified clearly.
                              </li>
                              <li>
                                <strong className="text-zinc-200">Security HMAC Checksum:</strong> Formulates an <code className="text-[9px] text-zinc-300">x-roco-signature-sha256</code> header computed on the raw body payload utilizing your specified HMAC key to guarantee absolute integrity.
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Highly Polished Interactive Flow Map / Diagram */}
                    <div className="bg-[#121212] border border-zinc-900 rounded-2xl p-4 flex flex-col gap-1.5 text-center relative overflow-hidden">
                      <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest font-black block">SYSTEM ORDER INJECTION TOPO:</span>
                      
                      <div className="flex items-center justify-between gap-1 py-1 text-zinc-400">
                        <div className="flex-1 bg-zinc-950 p-2 rounded-lg border border-zinc-900 text-center">
                          <span className="block text-[8px] font-mono text-[#FF5A00] uppercase font-black">1. Customer View</span>
                          <span className="text-[10px] text-zinc-100 font-semibold font-sans">Self-Order</span>
                        </div>
                        <div className="text-zinc-650 animate-pulse font-mono text-xs">➔</div>
                        <div className="flex-1 bg-zinc-950 p-2 rounded-lg border border-[#FF5A00]/20 text-center">
                          <span className="block text-[8px] font-mono text-[#FF5A00] uppercase font-black">2. RocoMamas OS</span>
                          <span className="text-[10px] text-zinc-100 font-semibold font-sans">Sync Node</span>
                        </div>
                        <div className="text-zinc-650 animate-pulse font-mono text-xs">➔</div>
                        <div className="flex-1 bg-zinc-950 p-2 rounded-lg border border-zinc-900 text-center">
                          <span className="block text-[8px] font-mono text-[#FF5A00] uppercase font-black">3. {selectedPosSystem} POS</span>
                          <span className="text-[10px] text-zinc-100 font-semibold font-sans">Kitchen KDS</span>
                        </div>
                      </div>
                    </div>

                    {/* LIVE DIAGNOSTICS LOG TERMINAL */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-black block">
                          🛰️ Live Integration Diagnostics:
                        </label>
                        {isPosConnected && (
                          <span className="text-[8.5px] font-mono text-emerald-400 font-semibold uppercase animate-pulse">● Live Handshake Established</span>
                        )}
                      </div>

                      <div className="bg-black text-[#FF5A00] font-mono text-[9.5px] p-3 rounded-2xl border border-zinc-900/60 h-32 overflow-y-auto space-y-1 relative">
                        {posConnectionLogs.length === 0 ? (
                          <div className="text-zinc-600 italic h-full flex items-center justify-center text-center">
                            Console idle. Press "Test Tunnel & Establish Connection" above to run diagnostics.
                          </div>
                        ) : (
                          posConnectionLogs.map((log, lIdx) => (
                            <div key={lIdx} className="leading-relaxed select-text flex gap-1 items-start">
                              <span className="text-zinc-500 font-bold shrink-0">&gt;</span>
                              <span className="text-zinc-200">{log}</span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Diagnostic trigger button */}
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                        <button
                          type="button"
                          disabled={isPosConnecting}
                          onClick={() => {
                            playBeep(420, "sine", 0.05);
                            setIsPosConnecting(true);
                            setPosConnectionLogs([]);
                            
                            const logsToStream = [
                              `[${new Date().toLocaleTimeString()}] Handshake initialized via Secure TLS 1.3...`,
                              `[${new Date().toLocaleTimeString()}] Linking outbound API Node to gateway: ${posSettings[selectedPosSystem]?.apiUrl || posSettings[selectedPosSystem]?.gatewayUrl || posSettings[selectedPosSystem]?.customUrl || "https://api.gateway.net"}`,
                              `[${new Date().toLocaleTimeString()}] Authenticating client ID credentials...`,
                              `[${new Date().toLocaleTimeString()}] POS verified successfully. Received [HTTP 200 OK] handshake response.`,
                              `[${new Date().toLocaleTimeString()}] Instantly mapped 13 seating blueprint tables (No.01 to No.13)...`,
                              `[${new Date().toLocaleTimeString()}] Register health checked. Connection ESTABLISHED! Integration status is now LIVE.`
                            ];

                            let currentIdx = 0;
                            const interval = setInterval(() => {
                              if (currentIdx < logsToStream.length) {
                                playBeep(550 + currentIdx * 45, "sine", 0.03);
                                setPosConnectionLogs(p => [...p, logsToStream[currentIdx]]);
                                currentIdx++;
                              } else {
                                clearInterval(interval);
                                setIsPosConnecting(false);
                                setIsPosConnected(true);
                                localStorage.setItem("roco_pos_connected", "true");
                                triggerToast(`${selectedPosSystem} POS successfully bridged of digital orders! 🔌`, "success");
                                playBeep(680, "sine", 0.12);
                              }
                            }, 650);
                          }}
                          className={`py-2 px-3 bg-zinc-950 hover:bg-zinc-950 border border-zinc-800 text-zinc-350 hover:text-white rounded-xl text-[9px] uppercase font-black tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${isPosConnecting ? "opacity-50 cursor-not-allowed" : "active:scale-98"}`}
                        >
                          {isPosConnecting ? (
                            <span className="animate-spin text-[#FF5A00]">⚡</span>
                          ) : (
                            <span>🔌 TEST TUNNEL LINK</span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            playBeep(220, "sawtooth", 0.08);
                            setIsPosConnected(false);
                            localStorage.removeItem("roco_pos_connected");
                            setPosConnectionLogs([`[${new Date().toLocaleTimeString()}] Connection terminated by user. POS link status disconnected.`]);
                            triggerToast("Disconnected POS Sync Channel", "info");
                          }}
                          className="py-2 px-3 bg-red-950/20 hover:bg-red-950 border border-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 rounded-xl text-[9px] uppercase font-black tracking-wide transition-all active:scale-98 cursor-pointer"
                        >
                          ❌ HALT DISCONNECT
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-black border-t border-zinc-900 flex justify-between items-center gap-4 shrink-0 font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        setIsPosConfigOpen(false);
                      }}
                      className="py-2 px-4 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-xl text-[10.5px] uppercase font-bold tracking-wide transition-all active:scale-97 cursor-pointer"
                    >
                      Close Setup
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playBeep(520, "sine", 0.08);
                        // Save current values to localStorage
                        localStorage.setItem("roco_pos_settings", JSON.stringify(posSettings));
                        localStorage.setItem("roco_pos_selected", selectedPosSystem);
                        triggerToast("POS Settings successfully saved! 🎨", "success");
                      }}
                      className="py-2 px-5 bg-[#FF5A00] hover:bg-orange-600 text-black rounded-xl text-[10.5px] uppercase font-black tracking-widest transition-all active:scale-97 cursor-pointer shadow-[0_4px_12px_rgba(255,90,0,0.3)]"
                    >
                      Save Parameters
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>


          {/* GOOGLE REVIEW MACHINE MODAL */}
          <AnimatePresence>
            {isReviewModalOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsReviewModalOpen(false)}
                  className="fixed inset-0 bg-black/95 z-[99990] backdrop-blur-xs cursor-pointer"
                />

                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="fixed inset-x-4 top-[10%] max-w-[420px] mx-auto bg-[#1C1C1E] border-2 border-[#FF5A00]/40 rounded-3xl shadow-[0_0_35px_rgba(231, 138, 62,0.18)] z-[99995] overflow-hidden flex flex-col font-sans"
                >
                  <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-orange-400 fill-orange-400 animate-bounce-slow" />
                      <div>
                        <h4 className="font-sub font-black text-white text-xs uppercase tracking-widest leading-none">
                          Google Review Machine
                        </h4>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">
                          RATE US & GET R50 COUPON DEAL
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        setIsReviewModalOpen(false);
                      }}
                      className="p-2 bg-[#121212] border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Form review selectors */}
                  <div className="p-6 flex flex-col gap-4">
                    <div className="text-center">
                      <h5 className="font-sub font-black text-white text-sm uppercase">Love the RocoMamas OS experience?</h5>
                      <p className="text-xs text-zinc-400 mt-1 max-w-[280px] mx-auto leading-normal">
                        Submit a quick stellar Google Review to claim an exclusive R50 gift voucher code off your current table ticket immediately!
                      </p>
                    </div>

                    {/* Interactive ratings scale */}
                    <div className="flex justify-center items-center gap-2 py-2">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const active = val <= userReviewRating;
                        return (
                          <button
                            key={val}
                            onClick={() => {
                              playBeep(300 + val * 55, "sine", 0.06);
                              setUserReviewRating(val);
                            }}
                            className="p-1 transition-all transform hover:scale-125 cursor-pointer active:scale-90"
                            aria-label={`Rate ${val} Stars`}
                          >
                            <Star 
                              className={`w-8 h-8 ${
                                active 
                                  ? "text-[#FF5A00] fill-[#FF5A00] filter drop-shadow-[0_0_8px_rgba(231, 138, 62,0.3)]" 
                                  : "text-zinc-700 fill-transparent"
                              } transition-colors`} 
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Input Field commentary */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="googleReviewTextarea" className="text-[9px] font-mono text-zinc-500 uppercase font-black">
                        Review commentary (Optional)
                      </label>
                      <textarea
                        id="googleReviewTextarea"
                        rows={3}
                        value={userReviewText}
                        onChange={(e) => setUserReviewText(e.target.value)}
                        placeholder="e.g. Incredible food, love how easy billing is! Roco Crew gave perfect service tonight..."
                        className="w-full bg-black/40 text-zinc-200 placeholder-zinc-700 text-xs rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00]/20 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Action Button Footer */}
                  <div className="p-4 bg-black border-t border-zinc-900">
                    <button
                      onClick={() => {
                        playBeep(550, "sine", 0.08);
                        // Save Google review code variables
                        const discountCode = "Roco-LOVE-50";
                        setCouponCode(discountCode);
                        setCouponApplied(true);
                        setIsReviewModalOpen(false);
                        triggerToast("⭐ Thank you! Google Review submitted and R50 applied!", "success");
                        // Confetti triggers!
                        playBeep(650, "sine", 0.1);
                        setTimeout(() => playBeep(850, "sine", 0.1), 150);
                      }}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-sub font-black text-xs uppercase rounded-xl transition-all shadow-lg text-center tracking-wider active:scale-95 cursor-pointer"
                    >
                      🚀 Submit Google Review & Apply R50 Code
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* NEW LIVE SPECIAL PROMOTION ALERTS OVERLAY */}
          <AnimatePresence>
            {droppedSpecialNotification && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDroppedSpecialNotification(null)}
                  className="fixed inset-0 bg-black z-[99910] cursor-pointer"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: -40, x: "-50%" }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, scale: 0.88, y: -40, x: "-50%" }}
                  className="fixed top-[5%] left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] bg-[#1C1C1E] border-2 border-dashed border-[#FF5A00] rounded-2xl shadow-[0_0_30px_rgba(231, 138, 62,0.35)] p-4.5 z-[99915] flex flex-col gap-3 font-sans overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.03]">
                    <Megaphone className="w-24 h-24 text-orange-500" />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-650/10 border border-red-500/20 flex items-center justify-center font-display text-xs text-red-500 shrink-0">
                      🔥
                    </div>
                    <span className="text-[9px] font-mono font-black text-[#FF5A00] tracking-widest uppercase">
                      JUST DROPPED SPECIAL OFFER
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase leading-none">NEW MEAL DEAL DEAL PACK:</span>
                    <h4 className="font-sub font-black text-white text-base uppercase leading-tight mt-1">
                      {droppedSpecialNotification.title}
                    </h4>
                    <span className="font-mono text-sm text-orange-500 font-bold block mt-1 tracking-wider">
                      {droppedSpecialNotification.deal}
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-2 italic max-w-[310px] leading-relaxed">
                      {droppedSpecialNotification.description}
                    </p>
                  </div>

                  <div className="flex gap-2 border-t border-zinc-900 pt-3 mt-1 justify-end">
                    <button
                      onClick={() => setDroppedSpecialNotification(null)}
                      className="px-3.5 py-1.5 bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white uppercase font-sub font-black text-[9px] tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>

                    <button
                      onClick={() => {
                        playBeep(520, "sine", 0.08);
                        // Synthesize add special to cart
                        const tempPriceStr = droppedSpecialNotification.deal.replace(/[^0-9]/g, "");
                        const tempPrice = parseInt(tempPriceStr, 10) || 95;
                        const tempItem = {
                          id: "custom-dropped-" + Date.now(),
                          name: droppedSpecialNotification.title,
                          price: tempPrice,
                          category: "EAT" as const,
                          emoji: "✨",
                          description: droppedSpecialNotification.description
                        };
                        handleAddToCart(tempItem);
                        setDroppedSpecialNotification(null);
                        setIsCartOpen(true);
                        triggerToast(`Excellent choice! ${droppedSpecialNotification.title} added!`, "success");
                      }}
                      className="px-4 py-2 bg-[#FF5A00] hover:bg-orange-400 text-black font-sub font-black text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md active:scale-95 flex items-center gap-1"
                    >
                      <Plus className="w-2.5 h-2.5" /> Grab Deal Now
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* --- DETAILED MENU ITEM CARD MODAL --- */}
          <AnimatePresence>
            {selectedDetailItem && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedDetailItem(null)}
                  className="fixed inset-0 bg-black/90 z-[9930] backdrop-blur-sm cursor-pointer"
                />

                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                  className="fixed inset-x-4 top-[10%] bottom-[10%] md:top-[12%] md:bottom-[12%] max-w-[420px] mx-auto bg-[#1C1C1E] border-2 border-[#FF5A00] rounded-3xl shadow-[0_0_50px_rgba(255,90,0,0.25)] z-[9935] overflow-hidden flex flex-col font-sans diagonal-stripes shadow-heavy"
                >
                  {/* Header */}
                  <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479" 
                        alt="RocoMamas Logo" 
                        className="w-5 h-5 object-contain rounded-full shadow border border-orange-500/20"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-base">{selectedDetailItem.emoji}</span>
                    </div>
                    <h4 className="font-display font-black text-[#FF5A00] text-xs uppercase tracking-widest leading-none">
                      {selectedDetailItem.category} DETAILED VIEW
                    </h4>
                    <button
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        setSelectedDetailItem(null);
                      }}
                      className="p-1.5 bg-[#121212] border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Body Scrollable Area */}
                  <div className="flex-1 overflow-y-auto p-5 pb-8 flex flex-col gap-5 select-none bg-zinc-950/80">
                    {/* Centered Large Rectangular Image block */}
                    <div className="w-full h-64 sm:h-84 md:h-96 bg-black rounded-2xl overflow-hidden border border-zinc-900 flex items-center justify-center relative shadow-2xl">
                      {/* Logo Badge Overlay watermark */}
                      <div className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 flex items-center gap-1.5 shadow-md">
                        <img 
                          src="https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479" 
                          alt="RocoMamas" 
                          className="w-4 h-4 object-contain rounded-full animate-spin-slow"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[8.5px] font-mono text-zinc-300 font-extrabold uppercase tracking-widest">
                          ROCOMAMAS
                        </span>
                      </div>

                      {getProductResolvedImage(selectedDetailItem) ? (
                        <div className="w-full h-full relative flex items-center justify-center bg-zinc-950/50">
                          <img 
                            src={getProductResolvedImage(selectedDetailItem)} 
                            alt={selectedDetailItem.name} 
                            className="w-full h-full object-contain transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <span className="text-6xl filter drop-shadow-lg">{selectedDetailItem.emoji}</span>
                      )}
                      
                      {selectedDetailItem.isSpecial && (
                        <span className="absolute top-3 right-3 bg-red-650 text-white text-[8px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded border border-red-500/30 shadow animate-pulse">
                          SPECIAL DEAL
                        </span>
                      )}
                    </div>

                    {/* Metadata Content */}
                    <div className="flex flex-col gap-2 bg-black/60 p-4 rounded-2xl border border-zinc-900 shadow-md">
                      <div className="flex justify-between items-start gap-2">
                        <h2 className="font-display font-black text-white text-lg tracking-wide uppercase leading-tight">
                          {selectedDetailItem.name}
                        </h2>
                        <span className="font-mono text-xl font-black text-[#FF5A00] whitespace-nowrap bg-[#FF5A00]/10 px-3 py-1 rounded-xl border border-[#FF5A00]/20">
                          R{selectedDetailItem.price}
                        </span>
                      </div>

                      {selectedDetailItem.popularityBadge && (
                        <div className="mt-1">
                          <span className="bg-orange-500/10 text-[#FF5A00] text-[9px] font-mono tracking-widest font-extrabold uppercase px-2 py-0.5 rounded border border-[#FF5A00]/25 shadow-sm">
                            🔥 {selectedDetailItem.popularityBadge}
                          </span>
                        </div>
                      )}

                      {/* Description Text block */}
                      <p className="text-xs text-zinc-350 font-sans tracking-normal mt-3 leading-relaxed font-semibold">
                        {selectedDetailItem.description}
                      </p>
                    </div>

                    {/* Premium Level-Up Custom Options (Bacon & Aged Cheddar Upsells) requested by user for promo-3 */}
                    {(selectedDetailItem.id === "promo-3" || selectedDetailItem.id === "chicken-burger-solo") && (
                      <div className="bg-black/70 border border-[#FF5A00]/30 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
                        <h4 className="font-sub font-black text-[#FF5A00] text-[10px] uppercase tracking-wider">
                          🍔 Level up southern fried chicken burger
                        </h4>
                        
                        <div className="flex flex-col gap-2">
                          {/* Option 1: Add Bacon (R18) */}
                          <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-[#FF5A00]/35 transition-all cursor-pointer">
                            <div className="flex items-center gap-2.5">
                              <input 
                                type="checkbox"
                                checked={detailModifiers.bacon}
                                onChange={(e) => {
                                  setDetailModifiers(prev => ({ ...prev, bacon: e.target.checked }));
                                  playBeep(e.target.checked ? 580 : 440, "sine", 0.05);
                                }}
                                className="w-4.5 h-4.5 accent-[#FF5A00] cursor-pointer rounded"
                              />
                              <span className="text-xs text-zinc-250 font-bold font-sans">
                                Add Bacon 🥓
                              </span>
                            </div>
                            <span className="font-mono text-xs font-black text-[#FF5A00]">+R18</span>
                          </label>

                          {/* Option 2: Add Aged Cheddar (R15) */}
                          <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-[#FF5A00]/35 transition-all cursor-pointer">
                            <div className="flex items-center gap-2.5">
                              <input 
                                type="checkbox"
                                checked={detailModifiers.cheddar}
                                onChange={(e) => {
                                  setDetailModifiers(prev => ({ ...prev, cheddar: e.target.checked }));
                                  playBeep(e.target.checked ? 580 : 440, "sine", 0.05);
                                }}
                                className="w-4.5 h-4.5 accent-[#FF5A00] cursor-pointer rounded"
                              />
                              <span className="text-xs text-zinc-250 font-bold font-sans">
                                Add Aged Cheddar 🧀
                              </span>
                            </div>
                            <span className="font-mono text-xs font-black text-[#FF5A00]">+R15</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Nutritional tip or Fun tagline */}
                    <div className="bg-[#FF5A00]/5 border border-dashed border-[#FF5A00]/20 p-3.5 rounded-2xl flex items-start gap-2.5">
                      <span className="text-base select-none mt-0.5">🤘</span>
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-[#FF5A00] font-bold">Roco Vibe Pledge</p>
                        <p className="text-[9px] font-sans text-zinc-400 leading-normal mt-0.5">
                          Freshly grilled to order, we never normal! Our ingredients are prepared with top tier craft love & fire.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action bottom area */}
                  <div className="p-4 bg-black border-t border-zinc-900 flex items-center justify-between gap-3 shrink-0">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono uppercase text-zinc-550">Order dynamic price</span>
                      {(() => {
                        let calcPrice = selectedDetailItem.price;
                        if (selectedDetailItem.id === "promo-3" || selectedDetailItem.id === "chicken-burger-solo") {
                          if (detailModifiers.bacon) calcPrice += 18;
                          if (detailModifiers.cheddar) calcPrice += 15;
                        }
                        return (
                          <span className="font-mono text-[13px] font-black text-white mt-0.5">R{calcPrice} each</span>
                        );
                      })()}
                    </div>

                    <button
                      onClick={() => {
                        playBeep(600, "sine", 0.08);
                        
                        let finalItem = { ...selectedDetailItem };
                        let extraTitle = [];
                        let extraPrice = 0;
                        if (selectedDetailItem.id === "promo-3" || selectedDetailItem.id === "chicken-burger-solo") {
                          if (detailModifiers.bacon) {
                            extraTitle.push("Bacon");
                            extraPrice += 18;
                          }
                          if (detailModifiers.cheddar) {
                            extraTitle.push("Aged Cheddar");
                            extraPrice += 15;
                          }
                          if (extraTitle.length > 0) {
                            finalItem = {
                              ...selectedDetailItem,
                              id: `${selectedDetailItem.id}-${extraTitle.join("-")}`,
                              name: `${selectedDetailItem.name} + ${extraTitle.join(" & ")}`,
                              price: selectedDetailItem.price + extraPrice
                            };
                          }
                        }

                        handleAddToCart(finalItem);
                        setSelectedDetailItem(null);
                      }}
                      className="flex-1 max-w-[200px] py-2.5 bg-[#FF5A00] hover:bg-orange-400 active:scale-95 text-black font-sans font-black text-xs uppercase rounded-xl tracking-wider cursor-pointer font-bold text-center flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 animate-bounce-slow" /> ADD TO BASKET
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* --- THE ULTIMATE "TYPEFORM STYLE" RocoMamas BOOKING ENGINE MODAL --- */}
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
                      className="w-full max-w-[460px] h-[88vh] max-h-[92%] sm:max-h-[580px] bg-[#FF5A00] text-zinc-950 rounded-3xl shadow-[0_0_50px_rgba(231,138,62,0.4)] overflow-hidden flex flex-col font-sans pointer-events-auto"
                    >
                  {/* Title Bar (Typeform minimalist layout) */}
                  <div className="p-4 bg-zinc-950 text-white flex justify-between items-center shrink-0 border-b border-[#FF5A00]/20">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src="https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479" 
                        alt="RocoMamas Logo" 
                        className="w-8 h-8 object-contain rounded-full border border-[#FF5A00]/30 shadow-inner p-0.5 bg-[#121212]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-display font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                          ROCO TABLE WIZARD
                        </h4>
                        <p className="text-[8px] font-mono text-[#FF5A00] uppercase tracking-widest mt-0.5 font-bold">
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
                                    ? "bg-zinc-950 text-[#FF5A00] border-zinc-950 shadow-md scale-[1.03]"
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
                            Pick an open date on our dispatch register, and select your preferred hour-block for heavy burger snacking.
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
                              <div className="grid grid-cols-3 gap-2">
                                {["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"].map((t) => (
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
                          <div className="bg-zinc-950 text-zinc-300 p-3.5 rounded-2xl border border-[#FF5A00]/30 shadow-inner">
                            <div className="flex justify-between items-center mb-2 flex-wrap gap-1">
                              <span className="text-[7.5px] font-mono text-zinc-550 uppercase tracking-wider font-extrabold">
                                📍 INTUITIVE FLOOR MATRIX
                              </span>
                              {bookingTableId ? (
                                <span className="text-[8.5px] bg-[#FF5A00] text-black px-1.5 py-0.5 rounded font-mono font-black uppercase">
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
                                <div className="w-2.5 h-2 bg-[#5a3a22] border border-[#FF5A00]/20 rounded-sm" />
                                <span>Booth (6 max)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#5a3a22] border border-[#FF5A00]/20" />
                                <span>Round (6 max)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rotate-45 bg-[#5a3a22] border border-[#FF5A00]/20" />
                                <span>Small (4 max)</span>
                              </div>
                            </div>

                            {/* Blueprint grid rendering with custom diagonal texture */}
                            <div 
                              className="grid grid-cols-5 gap-1.5 p-2 rounded-xl border border-zinc-950 shadow-2xl max-w-sm mx-auto relative overflow-hidden"
                              style={{
                                backgroundColor: "#0b0b0c",
                                backgroundImage: "repeating-linear-gradient(45deg, rgba(255, 90, 0, 0.035) 0px, rgba(255, 90, 0, 0.035) 2px, transparent 2px, transparent 14px), repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.5) 0px, rgba(0, 0, 0, 0.5) 4px, transparent 4px, transparent 8px)"
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
                                          className="col-span-4 rounded-lg border border-dashed border-[#FF5A00]/25 bg-[#FF5A00]/5 flex flex-col items-center justify-center text-center p-1 min-h-[46px]"
                                        >
                                          <span className="text-[7px] font-mono uppercase font-black leading-none tracking-widest text-[#FF5A00]">
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
                                        className="rounded-lg border border-dashed border-[#FF5A00]/25 bg-[#FF5A00]/5 flex flex-col items-center justify-center text-center p-1 min-h-[46px]"
                                      >
                                        <span className="text-[6px] font-mono uppercase font-black leading-none tracking-wider text-[#FF5A00]/80">
                                          🍳 KITCHEN
                                        </span>
                                      </div>
                                    );
                                  }

                                  const table = ROCO_TABLES.find(t => t.row === r && t.col === c);

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
                                            ? "bg-[#FF5A00]/15 border-[#FF5A00] text-[#FF5A00] shadow-[0_0_8px_rgba(231,138,62,0.3)] scale-[1.03]"
                                            : "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                                        }`}
                                        title={`${table.name} (Max ${table.capacity} guests)`}
                                      >
                                        {table.type === "booth" && (
                                          table.orientation === "vertical" ? (
                                            <div className="flex items-center gap-0.5 w-full h-[36px] p-0.5">
                                              <div className={`w-1 h-full rounded-l shrink-0 ${isSelected ? "bg-[#FF5A00]" : isBooked ? "bg-red-950/70" : "bg-[#2f190a]"}`} />
                                              <div className={`flex-1 h-full rounded flex flex-col items-center justify-center font-mono text-[8px] font-black leading-none ${isSelected ? "bg-[#5a3a22] border border-[#FF5A00]" : "bg-[#4a2f1b] border border-[#3e2413]"}`}>
                                                <span>T{tableId}</span>
                                                <span className="text-[4.5px] opacity-75 font-sans leading-none mt-0.5 font-bold">BTH</span>
                                              </div>
                                              <div className={`w-1 h-full rounded-r shrink-0 ${isSelected ? "bg-[#FF5A00]" : isBooked ? "bg-red-950/70" : "bg-[#2f190a]"}`} />
                                            </div>
                                          ) : (
                                            <div className="flex flex-col items-center gap-0.5 w-full h-[36px] p-0.5">
                                              <div className={`h-1 w-full rounded-t shrink-0 ${isSelected ? "bg-[#FF5A00]" : isBooked ? "bg-red-950/70" : "bg-[#2f190a]"}`} />
                                              <div className={`w-full flex-1 rounded flex flex-col items-center justify-center font-mono text-[8px] font-black leading-none ${isSelected ? "bg-[#5a3a22] border border-[#FF5A00]" : "bg-[#4a2f1b] border border-[#3e2413]"}`}>
                                                <span>T{tableId}</span>
                                                <span className="text-[4.5px] opacity-75 font-sans leading-none mt-0.5 font-bold">BTH</span>
                                              </div>
                                              <div className={`h-1 w-full rounded-b shrink-0 ${isSelected ? "bg-[#FF5A00]" : isBooked ? "bg-red-950/70" : "bg-[#2f190a]"}`} />
                                            </div>
                                          )
                                        )}

                                        {table.type === "round" && (
                                          <div className="relative w-full h-[36px] flex items-center justify-center">
                                            {[0, 60, 120, 180, 240, 300].map((angle, k) => (
                                              <div 
                                                key={k}
                                                className={`absolute w-1 h-1 rounded-full border ${k % 2 === 0 ? "bg-[#FF5A00] border-[#2f190a]" : "bg-black border-zinc-800"}`}
                                                style={{ transform: `rotate(${angle}deg) translateY(-11px)` }}
                                              />
                                            ))}
                                            <div className={`w-6.5 h-6.5 rounded-full border flex flex-col items-center justify-center font-mono text-[8px] font-black leading-none z-10 ${isSelected ? "border-[#FF5A00] bg-[#5a3a22]" : "border-[#3e2413] bg-[#4a2f1b]"}`}>
                                              <span>T{tableId}</span>
                                            </div>
                                          </div>
                                        )}

                                        {table.type === "small" && (
                                          <div className="relative w-full h-[36px] flex items-center justify-center">
                                            {[0, 90, 180, 270].map((angle, k) => (
                                              <div 
                                                key={k}
                                                className={`absolute w-1 h-1 rounded-sm border ${k % 2 === 0 ? "bg-[#FF5A00] border-[#2f190a]" : "bg-black border-zinc-800"}`}
                                                style={{ transform: `rotate(${angle}deg) translateY(-10px)` }}
                                              />
                                            ))}
                                            <div className={`w-5.5 h-5.5 rotate-45 border rounded flex items-center justify-center relative ${isSelected ? "border-[#FF5A00] bg-[#5a3a22]" : "border-[#3e2413] bg-[#4a2f1b]"}`}>
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
                                          isEnt ? "border-[#FF5A00]/40 bg-[#FF5A00]/5" : "border-zinc-900/60 bg-zinc-950/20"
                                        }`}
                                      >
                                        {label ? (
                                          <span className={`text-[5px] font-mono uppercase font-black leading-none tracking-widest ${
                                            isEnt ? "text-[#FF5A00]" : "text-zinc-650"
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
                          <div className="bg-zinc-950 text-[#FF5A00] p-4 rounded-2xl border-2 border-dashed border-[#FF5A00] font-mono relative overflow-hidden shadow-2xl space-y-3">
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FF5A00]" />
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FF5A00]" />

                            <div className="text-center pb-2 border-b-2 border-dashed border-[#FF5A00]/30">
                              <h6 className="text-[12px] font-black text-white tracking-widest uppercase">
                                ROCOMAMAS CRUSADE TICKET
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
                                <span className="font-bold text-[#FF5A00]">{bookingGuests} GUESTS</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">DATE & HOUR:</span>
                                <span className="font-bold text-white">{bookingDate} • {bookingTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">TABLE CHOSEN:</span>
                                <span className="font-bold text-[#FF5A00] uppercase">
                                  {bookingTableId ? `TABLE ${bookingTableId}` : "NOT CHOSEN ❌"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">OCCASION:</span>
                                <span className="font-bold text-white uppercase">{bookingOccasion}</span>
                              </div>
                              {bookingSpecialRequests && (
                                <div className="border-t border-[#FF5A00]/20 pt-1.5 mt-2">
                                  <span className="text-zinc-500 text-[10px]">CRAZY GUESTS REQUESTS:</span>
                                  <p className="text-zinc-300 italic text-[10.5px] mt-0.5">"{bookingSpecialRequests}"</p>
                                </div>
                              )}
                            </div>

                            <div className="text-center pt-2 border-t-2 border-dashed border-[#FF5A00]/30 text-[9px] text-[#FF5A00]/80">
                              <p className="font-extrabold tracking-widest uppercase">
                                🤘 WE'RE NOT NORMAL 🤘
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Slogan & Wizard Controls Footer section (Sticky Bottom Bar) */}
                    <div className="p-4 sm:p-5 border-t border-black/10 bg-[#FF5A00] shrink-0 mt-auto flex flex-col gap-3">
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
                          : "max-w-[440px] border-[#FF5A00] shadow-[0_0_40px_rgba(231,138,62,0.3)]"
                      }`}
                    >
                  {/* Header Bar */}
                  <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl animate-bounce">{isThuneePlaying ? "🃏" : "🍺"}</span>
                      <div>
                        <h4 className={`font-display font-black text-xs uppercase tracking-widest leading-none ${isThuneePlaying ? 'text-emerald-400' : 'text-[#FF5A00]'}`}>
                          {isThuneePlaying ? "DURBANITE THUNEE CARD COCKPIT" : "ROCOMAMAS OS GAMES"}
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
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF5A00]/40 to-transparent pointer-events-none" />
                    
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
                                ? "bg-[#1C1C1E] text-[#FF5A00] border-b-[#FF5A00] font-bold"
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
                                src="https://www.rocomamas.co.ke/images//logo-combined.png" 
                                alt="RocoMamas" 
                                className="w-16 h-16 object-contain hover:scale-105 transition-transform duration-300 pointer-events-none" 
                                referrerPolicy="no-referrer"
                              />
                              <h2 className="text-[#FF5A00] font-display font-black text-xl tracking-[0.14em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1 leading-none">
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
                                  localStorage.removeItem("roco_thunee_room_" + currentTableId);
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
                                  <div className="w-9 h-9 rounded-full bg-black/60 border border-[#FF5A00]/20 flex items-center justify-center text-base text-orange-500 shadow-inner group-hover:scale-110 transition-transform">
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
                                    <p className="text-sm font-sub font-black text-[#FF5A00]">{burgerCatcherScore} PTS</p>
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
                                    className="flex-1 py-3.5 bg-[#1C1C1E] active:bg-[#FF5A00] active:text-black hover:border-zinc-700 border border-zinc-800 text-zinc-300 font-sans font-black text-xs uppercase tracking-wide rounded-xl transition-all cursor-pointer text-center select-none touch-none"
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
                                    className="flex-1 py-3.5 bg-[#1C1C1E] active:bg-[#FF5A00] active:text-black hover:border-zinc-700 border border-zinc-800 text-zinc-300 font-sans font-black text-xs uppercase tracking-wide rounded-xl transition-all cursor-pointer text-center select-none touch-none"
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
                                    <p className="text-xs font-bold text-[#FF5A00]">{defuserScore} PTS</p>
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
                                      You scored <span className="text-[#FF5A00] font-black">{defuserScore} PTS</span>! Input your rocker name to record your place on the local griddle charts!
                                    </p>
                                    <div className="w-full space-y-1.5">
                                      <input
                                        type="text"
                                        maxLength={10}
                                        placeholder="E.G. SLASH"
                                        value={leaderboardNameInput}
                                        onChange={(e) => setLeaderboardNameInput(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                                        className="w-full p-2 bg-zinc-900 border border-zinc-800 text-center uppercase font-mono text-xs rounded-lg text-[#FF5A00] focus:outline-none focus:border-[#FF5A00] font-bold"
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
                                            localStorage.setItem("roco_defuser_leaderboard", JSON.stringify(updated));
                                            return updated;
                                          });
                                          setShowLeaderboardSubmit(false);
                                          triggerToast("Record saved to leaderboard! 🤘", "success");
                                        }}
                                        className="w-full py-2 bg-[#FF5A00] hover:bg-orange-400 text-black font-sans font-black text-xs uppercase rounded-lg tracking-wide cursor-pointer font-bold"
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
                                                        localStorage.setItem("roco_defuser_highscore", defuserScore.toString());
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
                                                  : "bg-orange-950/70 border-[#FF5A00] shadow-[0_0_12px_rgba(255,90,0,0.5)]"
                                                : "bg-[#1C1C1E]/40 border-zinc-900/60 opacity-60 hover:bg-[#1C1C1E]/70"
                                            }`}
                                          >
                                            {cell.active ? (
                                              <div className="flex flex-col items-center gap-1 w-full px-1">
                                                <span className="text-lg select-none leading-none">
                                                  {cell.type === "CHILI" ? "🌶️" : cell.type === "GOLD" ? "🍟" : "💥"}
                                                </span>
                                                <span className={`text-[7.5px] font-bold uppercase tracking-wider ${cell.type === "CHILI" ? "text-red-400" : cell.type === "GOLD" ? "text-amber-400" : "text-[#FF5A00]"} select-none leading-none`}>
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
                                    className="px-4 py-2 bg-[#FF5A00] text-black hover:bg-orange-400 font-sans font-black text-[10px] uppercase tracking-wide rounded-xl transition-all cursor-pointer"
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
                                          localStorage.setItem("roco_thunee_room_" + currentTableId, JSON.stringify(stateObj));
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
                                          ROCOMAMAS felt
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
                                            className="w-full py-3 bg-[#FF5A00] hover:bg-orange-400 text-black font-sans font-black text-xs uppercase rounded-xl tracking-wider cursor-pointer font-bold transition-all duration-200 text-center"
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
                                                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-[#FF5A00] hover:from-red-500 hover:to-orange-500 text-black font-sans font-black text-xs uppercase tracking-widest rounded-xl cursor-pointer shadow-[0_4px_12px_rgba(239,68,68,0.3)] text-center transition-all active:scale-95 font-bold"
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
                                    <p className="text-xs font-bold text-[#FF5A00]">{memoryScore} PTS / {memoryMoves} MOVES</p>
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
                                    className="flex-1 py-2.5 bg-[#FF5A00] text-black font-sub font-black text-xs uppercase tracking-wider rounded-xl hover:bg-orange-400 transition-all font-bold cursor-pointer text-center"
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
                                        Roco Burger Catcher
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
                                    className="w-full py-2.5 bg-[#FF5A00] hover:bg-orange-400 text-black font-sans font-black text-xs uppercase rounded-xl tracking-wider cursor-pointer font-bold text-center"
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
                                    className="w-full py-2.5 bg-zinc-900 border border-zinc-800 hover:border-[#FF5A00]/50 text-[#FF5A00] font-sans font-black text-xs uppercase rounded-xl tracking-wider cursor-pointer font-bold text-center"
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
                                    className="w-full py-2.5 bg-[#FF5A00] hover:bg-orange-400 text-black font-sans font-black text-xs uppercase rounded-xl tracking-wider cursor-pointer font-bold text-center"
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
                                          <span className={`text-[10px] font-bold ${idx === 0 ? 'text-[#FF5A00]' : idx === 1 ? 'text-zinc-300' : 'text-zinc-650'}`}>
                                            #{idx + 1}
                                          </span>
                                          <span className="text-zinc-300 font-bold uppercase">{e.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className="text-[#FF5A00] font-black">{e.score} PTS</span>
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
                                        className="px-3.5 py-2 bg-[#FF5A00] text-black font-sub font-black text-[10px] uppercase rounded-lg cursor-pointer shrink-0"
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
                                      className="w-full bg-[#1C1C1E] hover:border-[#FF5A00]/40 border border-zinc-850 p-2.5 rounded-xl text-left flex gap-3 transition-all hover:scale-[1.01] active:scale-99 cursor-pointer"
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
                                          entry.table === "T-12" ? "bg-orange-950/20 text-[#FF5A00] border border-orange-500/20" : "bg-[#1C1C1E] text-zinc-300"
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
                        <div className="py-2.5 mt-8 border-t border-zinc-900 text-center font-mono text-[9px] text-[#FF5A00]/45 tracking-widest uppercase flex items-center justify-center gap-2 shrink-0">
                          <span>ROCO ARENA STATIONS ACTIVE</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00] animate-ping" />
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
                          className="self-start px-3.5 py-1.5 bg-zinc-950 border border-zinc-850 hover:text-[#FF5A00] hover:border-zinc-800 text-zinc-400 font-sub font-black text-[9px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 mb-4"
                        >
                          ← BACK TO LOBBY
                        </button>

                        <div className="flex-1 flex flex-col justify-center py-2">
                          
                          {/* 1) KINGS CUP BOARD */}
                          {selectedDrinkingGame === "KINGS_CUP" && (
                            <div className="flex flex-col items-center text-center gap-5">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF5A00] font-bold">👑 KINGS CUP CLASSIC DECK</span>
                              
                              {kingsCupCard ? (
                                <motion.div 
                                  initial={{ rotateY: 90, scale: 0.8 }}
                                  animate={{ rotateY: 0, scale: 1 }}
                                  className="w-[190px] h-[260px] bg-white text-zinc-950 rounded-2xl p-5 border-4 border-[#FF5A00] flex flex-col justify-between relative shadow-[0_15px_30px_rgba(0,0,0,0.8)] select-none"
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
                                    <span className="text-sm font-sub font-black tracking-wider uppercase text-zinc-900 bg-[#FF5A00]/10 px-2 py-0.5 rounded border border-[#FF5A00]/20">{kingsCupCard.title}</span>
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
                                  className="w-[190px] h-[260px] bg-gradient-to-br from-zinc-900 to-[#121212] rounded-2xl p-5 border-4 border-dashed border-[#FF5A00]/50 flex flex-col items-center justify-center text-center gap-4 shadow-[#FF5A00]/10 shadow-[0_10px_35px] cursor-pointer hover:border-[#FF5A00] transition-all group scale-98 active:scale-95 animate-pulse"
                                >
                                  <div className="w-12 h-12 rounded-full bg-black border border-[#FF5A00]/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
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
                                  className="px-6 py-2.5 bg-[#FF5A00] hover:bg-orange-400 text-black uppercase font-sub font-black text-xs tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-bold"
                                >
                                  🃏 DRAW NEW CARD
                                </button>
                              )}
                            </div>
                          )}

                          {/* 2) TRUTH OR DARE BOARD */}
                          {selectedDrinkingGame === "TRUTH_DARE" && (
                            <div className="flex flex-col items-center text-center gap-5">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF5A00] font-bold">❓ TRUTH OR DARE CHALLENGE</span>
                              
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
                                      "Gently ask Roco Crew the waiter for his autograph as if he's an international rockstar.",
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
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF5A00] font-bold">🚫 NEVER HAVE I EVER</span>
                              
                              <div className="w-full max-w-[320px] bg-zinc-950 border border-zinc-850 rounded-2xl p-6 min-h-[140px] flex items-center justify-center select-text">
                                <p className="text-white text-base font-sans font-bold italic leading-relaxed text-center px-1">
                                  "{neverEverPrompt}"
                                </p>
                              </div>

                              <div className="text-[10px] uppercase tracking-widest font-mono text-zinc-500">
                                📢 <span className="text-[#FF5A00] font-bold">CONFESS OR DRINK UP!</span> IF YOU ARE GUILTY.
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
                                className="w-full max-w-[320px] py-3.5 bg-[#FF5A00] hover:bg-orange-400 text-black font-sub font-black text-xs uppercase rounded-xl transition-all cursor-pointer tracking-wider active:scale-95 font-bold shadow-md"
                              >
                                🃏 NEXT STATEMENT
                              </button>
                            </div>
                          )}

                          {/* 4) MOST LIKELY TO */}
                          {selectedDrinkingGame === "MOST_LIKELY" && (
                            <div className="flex flex-col items-center text-center gap-5">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF5A00] font-bold">👥 MOST LIKELY TO</span>
                              
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
                                    "Most likely to challenge Roco Crew the waiter to an impromptu arm wrestling contest",
                                    "Most likely to shed tears during a sad country song in the background",
                                    "Most likely to suggest ordering another round of fries before the current drinks are even finished",
                                    "Most likely to order chips for the table and eat exactly 90% of them alone",
                                    "Most likely to start singing karaoke with zero encouragement or preparation"
                                  ];
                                  const s = scenarios[Math.floor(Math.random() * scenarios.length)];
                                  setMostLikelyPrompt(s);
                                  triggerToast("Drawn next voting scenario!", "success");
                                }}
                                className="w-full max-w-[320px] py-3.5 bg-[#FF5A00] hover:bg-orange-400 text-black font-sub font-black text-xs uppercase rounded-xl transition-all cursor-pointer tracking-wider active:scale-95 font-bold shadow-md"
                              >
                                🎲 NEXT SCENARIO
                              </button>
                            </div>
                          )}

                          {/* 5) SPIN THE BOTTLE */}
                          {selectedDrinkingGame === "SPIN_BOTTLE" && (
                            <div className="flex flex-col items-center text-center gap-5">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF5A00] font-black">🔄 SPIN THE BOTTLE WHEEL</span>
                              
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
                                  <div className="w-2.5 h-16 bg-gradient-to-t from-emerald-800 to-orange-400 rounded-full border border-[#FF5A00]/40 shadow-xl relative">
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
                                    "THE ASSIGNED CHOSEN MASTER: Roco Crew chooses who gets a free cheese bomb! 👨‍🍳",
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
                                className={`w-full max-w-[320px] py-3.5 ${isBottleSpinning ? "bg-zinc-805 text-zinc-500" : "bg-[#FF5A00] hover:bg-orange-400 text-black cursor-pointer"} font-sub font-black text-xs uppercase rounded-xl transition-all font-bold tracking-wider active:scale-95 shadow-md`}
                              >
                                {isBottleSpinning ? "🚨 DISK SPINNING REELS..." : "⚡ SPIN BOTTLE 🍟"}
                              </button>
                            </div>
                          )}

                          {/* 6) WOULD YOU RATHER */}
                          {selectedDrinkingGame === "WOULD_RATHER" && (
                            <div className="flex flex-col items-center text-center gap-5">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF5A00] font-bold">⚖️ WOULD YOU RATHER</span>
                              
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
                                        : "border-zinc-800 bg-[#121212]/90 hover:border-[#FF5A00]/50 text-[#FF5A00] hover:text-white cursor-pointer active:scale-98"
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
                                        : "border-zinc-800 bg-[#121212]/90 hover:border-[#FF5A00]/50 text-[#FF5A00] hover:text-white cursor-pointer active:scale-98"
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
                                      ["Sing the opening verse of a song karaoke starter", "Give Roco Crew waiter a generous R100 direct tip"],
                                      ["Eat standard pub fries for 48 hours straight", "Never eat South African biltong again for rest of life"],
                                      ["Dance on top of your chair for exactly 30 seconds", "Do 15 quick pushups right next to Table 12"],
                                      ["Let people draw a face tattoo using erasable marker", "Eat the hottest wings on the table with no blue cheese sauce"]
                                    ];
                                    const index = Math.floor(Math.random() * dilemmas.length);
                                    setWouldRatherPrompt(dilemmas[index]);
                                    setWouldRatherVotes(null);
                                    triggerToast("New dilemma loaded!", "success");
                                  }}
                                  className="w-full max-w-[320px] py-3.5 bg-neutral-900 border border-zinc-800 text-white font-sub font-black text-xs uppercase rounded-xl transition-all cursor-pointer tracking-wider font-bold shadow-md active:scale-95 group-hover:border-[#FF5A00]"
                                >
                                  ⚖️ NEXT DILEMMA
                                </button>
                              )}
                            </div>
                          )}

                        </div>

                        {/* Quick switch inside active game to return to select screen */}
                        <div className="pt-3 mt-4 border-t border-[#FF5A00]/20 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                          <span>TABLE: 12 • OUTCOME SAVED</span>
                          <span className="text-[#FF5A00]">ROCOMAMAS OS ENGINE</span>
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

          {/* --- INTERACTIVE ONBOARDING & HELP COMPANION MODAL --- */}
          <AnimatePresence>
            {isHelpOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    playBeep(450, "sine", 0.05);
                    setIsHelpOpen(false);
                  }}
                  className="fixed inset-0 bg-black/95 z-[9920] backdrop-blur-sm cursor-pointer"
                />

                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="fixed inset-x-4 top-[8%] bottom-[8%] max-w-[440px] mx-auto bg-[#1C1C1E] border-2 border-[#FF5A00] rounded-3xl shadow-[0_0_35px_rgba(231, 138, 62,0.25)] z-[9925] overflow-hidden flex flex-col font-sans text-left"
                >
                  {/* Header */}
                  <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://www.rocomamas.co.ke/images//logo-combined.png"
                        alt="RocoMamas Logo"
                        className="w-8 h-8 object-contain bg-zinc-900 p-1 border border-zinc-805 rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-display font-black text-[#FF5A00] text-xs uppercase tracking-wider">
                          RocoMamas Guest OS Companion
                        </h4>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
                          Interactive Table Manual
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        setIsHelpOpen(false);
                      }}
                      className="p-1.5 bg-[#121212] border border-zinc-805 text-zinc-450 hover:text-white rounded-lg transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Scrollable Manual Content */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-5 select-text">
                    <div className="text-center pb-2 border-b border-zinc-900">
                      <span className="text-3xl">🍻</span>
                      <h5 className="font-display text-white text-base font-black uppercase tracking-wide mt-2">
                        Welcome to RocoMamas!
                      </h5>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        This system controls Table 12 ordering, rewards system & server-link. Learn how to master the OS below.
                      </p>
                    </div>

                    {/* Step Cards with Micro Icons */}
                    <div className="space-y-3.5">
                      <div className="bg-black/60 p-3.5 rounded-2xl border border-zinc-900 flex gap-3">
                        <span className="text-2xl pt-1">🍔</span>
                        <div>
                          <h6 className="text-[11px] font-mono uppercase font-black tracking-wider text-orange-400">
                            1. Order Drinks / Food
                          </h6>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Browse draft beers, spirits, grills, & woodfire pizzas. Adjust quantities, add item prep-notes for Roco Crew & place orders on tap.
                          </p>
                        </div>
                      </div>

                      <div className="bg-black/60 p-3.5 rounded-2xl border border-zinc-900 flex gap-3">
                        <span className="text-2xl pt-1">🎫</span>
                        <div>
                          <h6 className="text-[11px] font-mono uppercase font-black tracking-wider text-[#FF5A00]">
                            2. Virtual Loyalty Stampcard
                          </h6>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Collect stamp loyalty credits! Every time you order drafts or meals, your virtual stamp count rises. Clear a fully punched card to claim an ice-cold draft on the house!
                          </p>
                        </div>
                      </div>

                      <div className="bg-black/60 p-3.5 rounded-2xl border border-zinc-900 flex gap-3">
                        <span className="text-2xl pt-1">🎮</span>
                        <div>
                          <h6 className="text-[11px] font-mono uppercase font-black tracking-wider text-emerald-400">
                            3. Table Arena & Chat Lobby
                          </h6>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Waiting for food? Open the Darts & retro game engine directly inside Table 12's terminal, or type real-time lounge chat replies to Roco Crew & fellow patrons.
                          </p>
                        </div>
                      </div>

                      <div className="bg-black/60 p-3.5 rounded-2xl border border-zinc-900 flex gap-3">
                        <span className="text-2xl pt-1">🧮</span>
                        <div>
                          <h6 className="text-[11px] font-mono uppercase font-black tracking-wider text-purple-400">
                            4. Dynamic Split & Tip Bill
                          </h6>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Splitting the bill with table mates? Use our built-in slider engine. Calculate exact splits, add custom tips for Roco Crew, & sort your tab instantly.
                          </p>
                        </div>
                      </div>

                      <div className="bg-black/60 p-3.5 rounded-2xl border border-zinc-900 flex gap-3">
                        <span className="text-2xl pt-1">🚨</span>
                        <div>
                          <h6 className="text-[11px] font-mono uppercase font-black tracking-wider text-red-400">
                            5. Summon Waiter Signal
                          </h6>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Need physical assistance like ice or hot sauce? Tap the "SUMMON WAITER" distress signal. It emits interactive telemetry feedback directly to Roco Crew's device!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pro tip banner */}
                    <div className="p-3 bg-[#FF5A00]/10 border border-[#FF5A00]/30 rounded-xl text-center text-[10px] font-mono text-[#FF5A00] uppercase tracking-wider">
                      💡 Pro Tip: Toggle this interactive manual anytime by clicking the yellow manual icon in the header bar.
                    </div>
                  </div>

                  {/* Footer Action buttons */}
                  <div className="p-4 bg-black border-t border-zinc-900 flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        // Play double affirmative beeps
                        playBeep(523.25, "sine", 0.08);
                        setTimeout(() => playBeep(659.25, "sine", 0.08), 85);
                        setIsHelpOpen(false);
                      }}
                      className="w-full py-3 bg-[#FF5A00] hover:bg-orange-400 text-black font-sub font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center font-bold shadow-md transform active:scale-95 text-center"
                    >
                      Got It, Let's Order! 🍺
                    </button>
                  </div>

                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* BOOKING CONFLICT WARNING GRITTY DIALOG OVERLAY */}
          <AnimatePresence>
            {activeBookingWarning && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-[#121212]/90 z-[9940] backdrop-blur-xs"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="fixed top-[15%] inset-x-4 max-w-sm mx-auto bg-black border-2 border-orange-500 rounded-3xl p-5 shadow-[0_0_30px_rgba(231, 138, 62,0.25)] z-[9945] flex flex-col gap-4 font-sans text-center"
                >
                  <div className="w-14 h-14 bg-orange-500/10 rounded-full border border-orange-500/30 flex items-center justify-center text-2xl mx-auto shadow-inner animate-pulse">
                    📯
                  </div>
                  <div>
                    <h4 className="font-display font-black text-orange-500 text-sm uppercase tracking-widest leading-none">
                      Dynamic Seating Warning!
                    </h4>
                    <p className="text-xs text-zinc-350 mt-2.5 leading-relaxed font-mono">
                      {activeBookingWarning}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      playBeep(450, "sine", 0.05);
                      setActiveBookingWarning(null);
                    }}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-black font-sub font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer font-bold"
                  >
                    Clear Signal Alert
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

    </div>

    {/* FULL SCREEN DYNAMIC PRINTABLE QR COVER SHEET */}
    <AnimatePresence>
      {showQrPrintSheet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white text-black z-[99999] overflow-y-auto font-sans p-6 print-container"
        >
          {/* Print Control Bar - Hidden during window.print() */}
          <div className="no-print bg-zinc-950 p-4 rounded-2xl border border-zinc-900 text-white flex flex-col md:flex-row justify-between items-center gap-4 mb-8 max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-center gap-2.5">
              <Printer className="w-5 h-5 text-[#FF5A00]" />
              <div>
                <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#FF5A00]">
                  🖨️ Printable Table QR Code Cards Builder
                </h4>
                <p className="text-[9px] font-mono text-zinc-550 uppercase mt-0.5">
                  Prints standard RocoMamas Table Labels cleanly!
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
                      ? "bg-[#FF5A00] text-black border-[#FF5A00] shadow"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  playBeep(523, "sine", 0.08);
                  window.print();
                }}
                className="px-4 py-2 bg-[#FF5A00] hover:bg-orange-400 text-black font-mono text-xs font-black uppercase rounded-lg tracking-wider cursor-pointer shadow-md"
              >
                Print Cards Sheet
              </button>
              <button
                onClick={() => {
                  playBeep(330, "triangle", 0.05);
                  setShowQrPrintSheet(false);
                }}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs font-bold uppercase rounded-lg cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>

          {/* Printable sheet container structure */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 print-grid">
            {ROCO_TABLES.map((table) => {
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
                        : "bg-white text-zinc-900 border-[#FF5A00] hover:shadow-xl"
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
                          ? `repeating-linear-gradient(45deg, #FF5A00 0px, #FF5A00 1.5px, transparent 1.5px, transparent 12px), repeating-linear-gradient(-45deg, #FF5A00 0px, #FF5A00 1.5px, transparent 1.5px, transparent 12px)`
                          : `repeating-linear-gradient(45deg, #000000 0px, #000000 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, #000000 0px, #000000 1px, transparent 1px, transparent 10px)`,
                      zIndex: 1
                    }}
                  />

                  {/* Decorative top strip */}
                  <div className={`absolute top-0 inset-x-0 h-3 z-10 ${isDarkTheme ? "bg-zinc-900" : isMinimalTheme ? "bg-black" : "bg-[#FF5A00]"}`} />
                  
                  {/* RocoMamas Combined Brand Logo - Larger and transparent background */}
                  <div className="flex flex-col items-center justify-center relative z-10 mb-3 mt-4">
                    <img 
                      src="https://www.rocomamas.co.ke/images//logo-combined.png"
                      alt="RocoMamas Brand Logo"
                      className="h-14 w-auto object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.2)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Header Branding */}
                  <div className="space-y-1 relative z-10">
                    <span className={`font-mono text-[8.5px] font-black uppercase tracking-widest block ${isDarkTheme ? "text-zinc-550" : "text-zinc-450"}`}>
                      ROCOMAMAS • DIGITAL ORDERING
                    </span>
                    
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <h2 className={`font-display font-extrabold text-3xl uppercase leading-none tracking-tighter ${
                        isDarkTheme ? "text-[#FF5A00]" : isMinimalTheme ? "text-black" : "text-[#FF5A00]"
                      }`}>
                        TABLE {tableId.padStart(2, "0")}
                      </h2>
                    </div>

                    <span className={`font-mono text-[8.5px] uppercase font-black tracking-widest border px-3 py-1 rounded-full mt-2 inline-block ${
                      isDarkTheme 
                        ? "bg-zinc-900 border-zinc-805 text-zinc-400" 
                        : isMinimalTheme 
                          ? "bg-zinc-50 border-zinc-200 text-zinc-700" 
                          : "bg-orange-50/50 border-orange-100 text-[#FF5A00]"
                    }`}>
                      {table.type} surface • Max {table.capacity} pax
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
                        src="https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479"
                        size={160}
                        colorDark={isMinimalTheme ? "#000000" : "#FF5A00"}
                        colorLight={isDarkTheme ? "#050505" : "#FFFFFF"}
                      />
                    )}
                  </div>

                  {/* RocoMamas skull logo emblem - now underneath the QR code */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center p-1.5 border-2 shadow-sm shrink-0 transition-all duration-300 relative z-10 mb-4 ${
                    isDarkTheme 
                      ? "bg-zinc-900 border-zinc-800" 
                      : isMinimalTheme 
                        ? "bg-white border-black" 
                        : "bg-white border-[#FF5A00]"
                  }`}>
                    <img 
                      src="https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479"
                      alt="RocoMamas Skull"
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
                        ? "bg-zinc-900 border-zinc-800 text-[#FF5A00]" 
                        : isMinimalTheme 
                          ? "bg-zinc-100 border-zinc-300 text-black" 
                          : "bg-orange-50/80 border-orange-200 text-[#FF5A00]"
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
            @media print {
              @page {
                size: auto;
                margin: 10mm !important;
              }
              /* Enforce exact background colors, images, and border colors for printing */
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
              /* Hide the entire main layout container and everything else except the print container */
              #rocomamas-os-container,
              .no-print,
              div[class*="z-[9920]"],
              div[class*="z-[9940]"],
              div[class*="z-[9945]"],
              div[class*="backdrop-blur"] {
                display: none !important;
              }
              .print-container {
                display: block !important;
                position: relative !important;
                left: auto !important;
                top: auto !important;
                right: auto !important;
                bottom: auto !important;
                width: 100% !important;
                height: auto !important;
                min-height: auto !important;
                padding: 0 !important;
                margin: 0 !important;
                background: white !important;
                overflow: visible !important;
                transform: none !important;
                opacity: 1 !important;
                z-index: auto !important;
              }
              .no-print {
                display: none !important;
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
              /* Theme specifs for printing to ensure high contrast & background accuracy */
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
      )}
    </AnimatePresence>
    </>
  );
}
