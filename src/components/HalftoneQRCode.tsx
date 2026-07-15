import React, { useRef, useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  ROCO_STAMP_LOGO_LOCAL_URL,
  ROCO_STAMP_LOGO_URL,
  loadCanvasLogoImage,
} from "../qrConfig";

interface HalftoneQRCodeProps {
  text: string;
  src?: string;
  size?: number;
  colorDark?: string;
  colorLight?: string;
  className?: string;
  onDataUrl?: (dataUrl: string) => void;
}

export const HalftoneQRCode: React.FC<HalftoneQRCodeProps> = ({
  text,
  src,
  size = 200,
  colorDark = "#FF5A00",
  colorLight = "#000000",
  className = "",
  onDataUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [printDataUrl, setPrintDataUrl] = useState<string | null>(null);
  const [logoOnCanvas, setLogoOnCanvas] = useState(false);
  const centerLogoSrc = src || ROCO_STAMP_LOGO_URL;
  const screenLogoSrc = src || ROCO_STAMP_LOGO_LOCAL_URL;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let active = true;

    const render = async () => {
      try {
        const qr = QRCode.create(text, { errorCorrectionLevel: "H" });
        const { size: mSize } = qr.modules;

        if (!active) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        ctx.fillStyle = colorLight;
        ctx.fillRect(0, 0, size, size);

        const margin = 2;
        const effectiveGridSize = mSize + margin * 2;
        const cellSize = size / effectiveGridSize;

        const img = await loadCanvasLogoImage(centerLogoSrc);
        if (!active) return;

        const hasCanvasLogo = !!img;
        setLogoOnCanvas(hasCanvasLogo);
        const centerStart = Math.floor(mSize / 2) - Math.floor(mSize * 0.16);
        const centerEnd = Math.floor(mSize / 2) + Math.floor(mSize * 0.16);

        for (let r = 0; r < mSize; r++) {
          for (let c = 0; c < mSize; c++) {
            const isDark = qr.modules.get(r, c);
            if (!isDark) continue;

            const x = (c + margin) * cellSize;
            const y = (r + margin) * cellSize;

            if (
              hasCanvasLogo &&
              r >= centerStart &&
              r <= centerEnd &&
              c >= centerStart &&
              c <= centerEnd
            ) {
              continue;
            }

            const isFinderPattern =
              (r < 7 && c < 7) ||
              (r < 7 && c >= mSize - 7) ||
              (r >= mSize - 7 && c < 7);

            ctx.fillStyle = colorDark;

            if (isFinderPattern) {
              ctx.fillRect(x + 0.25, y + 0.25, cellSize - 0.5, cellSize - 0.5);
            } else {
              ctx.beginPath();
              const radius = (cellSize / 2) * 0.85;
              ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        if (hasCanvasLogo && img) {
          const logoSize = size * 0.24;
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          ctx.beginPath();
          ctx.arc(size / 2, size / 2, logoSize / 2 + 3, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(size / 2, size / 2, logoSize / 2 + 1, 0, Math.PI * 2);
          ctx.strokeStyle = colorDark;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.save();
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, logoSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
          ctx.restore();
        }

        const dataUrl = canvas.toDataURL("image/png");
        if (active) {
          setPrintDataUrl(dataUrl);
          onDataUrl?.(dataUrl);
        }
      } catch (err) {
        console.error("Halftone QRCode drawing error:", err);
      }
    };

    render();

    return () => {
      active = false;
    };
  }, [text, centerLogoSrc, size, colorDark, colorLight, onDataUrl]);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded bg-white ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain block qr-canvas-screen"
      />
      {printDataUrl && (
        <img
          src={printDataUrl}
          alt=""
          className="qr-canvas-print absolute inset-0 w-full h-full object-contain"
          aria-hidden
        />
      )}
      {/* Fallback screen overlay when canvas logo could not be embedded */}
      {!logoOnCanvas && (
        <div
          className="absolute rounded-full bg-white border border-[#FF5A00] flex items-center justify-center shadow-lg overflow-hidden p-[1.5px] z-10 pointer-events-none qr-center-logo-screen"
          style={{
            width: `${size * 0.28}px`,
            height: `${size * 0.28}px`,
          }}
        >
          <img
            src={screenLogoSrc}
            alt="ROCO center art"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};
