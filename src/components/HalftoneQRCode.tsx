import React, { useRef, useEffect } from "react";
import QRCode from "qrcode";

interface HalftoneQRCodeProps {
  text: string;
  src?: string;
  size?: number;
  colorDark?: string;
  colorLight?: string;
}

export const HalftoneQRCode: React.FC<HalftoneQRCodeProps> = ({
  text,
  src,
  size = 200,
  colorDark = "#FF5A00",
  colorLight = "#000000",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let active = true;

    const render = async () => {
      try {
        // Generate QR code data using error-correction level 'H' for logo central overlay leeway
        const qr = QRCode.create(text, { errorCorrectionLevel: "H" });
        const { size: mSize } = qr.modules;

        if (!active) return;

        // Set high-DPI scaling for sharp canvas drawing on Retina displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        ctx.scale(dpr, dpr);

        // Draw background
        ctx.fillStyle = colorLight;
        ctx.fillRect(0, 0, size, size);

        // Calculate dimensions
        const margin = 2; // Keep margin slim and proportional
        const effectiveGridSize = mSize + margin * 2;
        const cellSize = size / effectiveGridSize;

        // Load overlay image if provided
        let img: HTMLImageElement | null = null;
        if (src) {
          await new Promise<void>((resolve) => {
            const tempImg = new Image();
            tempImg.crossOrigin = "anonymous";
            tempImg.onload = () => {
              img = tempImg;
              resolve();
            };
            tempImg.onerror = () => {
              // Ignore image loading errors (such as CORS) and fallback safely
              resolve();
            };
            tempImg.src = src;
          });
        }

        if (!active) return;

        // Draw the QR code dots and blocks
        // Exclusion zone in central grid cells (ca. 25% area) to ensure the logo doesn't collide with dots
        const centerStart = Math.floor(mSize / 2) - Math.floor(mSize * 0.16);
        const centerEnd = Math.floor(mSize / 2) + Math.floor(mSize * 0.16);

        for (let r = 0; r < mSize; r++) {
          for (let c = 0; c < mSize; c++) {
            const isDark = qr.modules.get(r, c);
            if (!isDark) continue;

            // Coordinates in pixel space inside canvas
            const x = (c + margin) * cellSize;
            const y = (r + margin) * cellSize;

            // Exclusion zone: skip central QR dots
            if (
              src &&
              img &&
              r >= centerStart &&
              r <= centerEnd &&
              c >= centerStart &&
              c <= centerEnd
            ) {
              continue;
            }

            // check if part of finder patterns
            const isFinderPattern =
              (r < 7 && c < 7) ||
              (r < 7 && c >= mSize - 7) ||
              (r >= mSize - 7 && c < 7);

            ctx.fillStyle = colorDark;

            if (isFinderPattern) {
              // Draw solid square finder block for perfect scan reliability
              ctx.beginPath();
              ctx.fillRect(x + 0.25, y + 0.25, cellSize - 0.5, cellSize - 0.5);
            } else {
              // Halftone dots style
              ctx.beginPath();
              // Make standard dot diameter slightly custom for a gorgeous modern halter look
              const radius = (cellSize / 2) * 0.85;
              ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Draw the central high-re logo with polished border
        if (src && img) {
          const logoSize = size * 0.24; // clean balanced size
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          // Draw round backing disk - always white so the rich logo pops perfectly
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, logoSize / 2 + 3, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();

          // Orange rim border
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, logoSize / 2 + 1, 0, Math.PI * 2);
          ctx.strokeStyle = "#FF5A00";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Clip image to circular bounds
          ctx.save();
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, logoSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
          ctx.restore();
        }

      } catch (err) {
        console.error("Halftone QRCode drawing error:", err);
      }
    };

    render();

    return () => {
      active = false;
    };
  }, [text, src, size, colorDark, colorLight]);

  return (
    <div 
      className="relative flex items-center justify-center overflow-hidden rounded bg-black" 
      style={{ width: size, height: size }}
    >
      <canvas 
        ref={canvasRef} 
        className="max-w-full max-h-full object-contain block"
      />
      {/* Absolute artistic central logo frame */}
      <div 
        className="absolute rounded-full bg-white border border-[#FF5A00] flex items-center justify-center shadow-lg overflow-hidden p-[1.5px] z-10 hover:scale-110 duration-200 transition-all cursor-pointer"
        style={{ 
          width: `${size * 0.28}px`, 
          height: `${size * 0.28}px`,
        }}
      >
        <img 
          src={src || "https://static-prod.dineplan.com/restaurant/restaurants/logos/logo_4118.png?d=1714983479"} 
          alt="RocoMamas Central Logo"
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};
