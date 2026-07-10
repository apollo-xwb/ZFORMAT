export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "EAT" | "DRINK";
  emoji: string;
  popularityBadge?: string;
  isSpecial?: boolean;
  image?: string;
  sectionName?: string;
  subsectionName?: string;
  priceText?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface HistoricOrder {
  id: string;
  timestamp: string;
  createdAt?: number;
  items: CartItem[];
  total: number;
  status: "Sent" | "Preparing" | "Ready" | "Served" | "Paid" | "Completed";
  notes?: string;
  timerDuration?: number;
  timerRemaining?: number;
  timerExpired?: boolean;
}

export interface MasterBillItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
  paidCount: number;
}
