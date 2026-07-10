import { Minus, Plus } from "lucide-react";
import type { CartItem } from "../types";
import { formatPrepMinutes, getItemPrepMinutes } from "../prepTimes";

const CARD_BACKGROUNDS = [
  { bg: "#E78A3E", text: "#000000", badge: "#000000", badgeText: "#FFFFFF" },
  { bg: "#18181B", text: "#FFFFFF", badge: "#E78A3E", badgeText: "#000000" },
  { bg: "#F4F4F5", text: "#000000", badge: "#E78A3E", badgeText: "#000000" },
  { bg: "#C45A1A", text: "#000000", badge: "#000000", badgeText: "#FFFFFF" },
  { bg: "#000000", text: "#FFFFFF", badge: "#E78A3E", badgeText: "#000000" },
  { bg: "#FFD4A8", text: "#000000", badge: "#000000", badgeText: "#FFFFFF" }
];

type Props = {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  resolveImage?: (item: CartItem["menuItem"]) => string;
};

export function OrderMasonryGrid({ items, onUpdateQuantity, resolveImage }: Props) {
  return (
    <div className="columns-2 gap-3 [column-fill:balance]">
      {items.map((cartItem, index) => {
        const item = cartItem.menuItem;
        const palette = CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length];
        const prepMin = getItemPrepMinutes(item);
        const imageUrl = resolveImage?.(item) || item.image;
        const isTall = index % 3 === 0;

        return (
          <article
            key={item.id}
            className={`break-inside-avoid mb-3 rounded-3xl overflow-hidden shadow-lg border border-black/10 flex flex-col ${isTall ? "min-h-[220px]" : "min-h-[180px]"}`}
            style={{ backgroundColor: palette.bg, color: palette.text }}
          >
            <div className="px-3 pt-3 flex items-start justify-between gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider opacity-80 line-clamp-1">
                {item.sectionName || item.category}
              </span>
              <span
                className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border"
                style={{ backgroundColor: palette.badge, color: palette.badgeText, borderColor: palette.badge }}
              >
                {formatPrepMinutes(prepMin)}
              </span>
            </div>

            <div className={`mx-3 mt-2 rounded-2xl overflow-hidden bg-black/10 ${isTall ? "h-28" : "h-20"}`}>
              {imageUrl ? (
                <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">{item.emoji}</div>
              )}
            </div>

            <div className="px-3 pt-2 pb-3 mt-auto">
              <h4 className="font-black uppercase text-sm leading-tight tracking-wide line-clamp-2">
                {item.name}
              </h4>
              <p className="text-[11px] font-mono mt-1 opacity-80">R{item.price} each</p>

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center rounded-full border border-current/20 overflow-hidden bg-black/10">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="px-2.5 py-1.5 hover:bg-black/10 transition-colors"
                    aria-label={`Decrease ${item.name}`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-black text-sm tabular-nums">{cartItem.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="px-2.5 py-1.5 hover:bg-black/10 transition-colors"
                    aria-label={`Increase ${item.name}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="font-black text-sm">R{item.price * cartItem.quantity}</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
