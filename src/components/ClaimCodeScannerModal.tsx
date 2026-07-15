import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { parseClaimPayload } from "../orderPass";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onResolved: (value: { orderId: string; claimCode: string; raw: string }) => void;
};

export function ClaimCodeScannerModal({ open, onClose, onResolved }: Props) {
  const [manualCode, setManualCode] = useState("");
  const [error, setError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "roco-claim-scanner";

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const scanner = new Html5Qrcode(regionId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          const parsed = parseClaimPayload(decoded);
          if (!parsed) {
            setError("QR not recognized. Use a ROCO claim pass QR.");
            return;
          }
          onResolved({ ...parsed, raw: decoded });
        },
        () => undefined
      )
      .then(() => {
        if (!cancelled) setCameraReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setCameraReady(false);
          setError("Camera unavailable — enter the 4-digit claim code manually.");
        }
      });

    return () => {
      cancelled = true;
      scanner
        .stop()
        .catch(() => undefined)
        .finally(() => {
          try { scanner.clear(); } catch { /* ignore */ }
        });
      scannerRef.current = null;
      setCameraReady(false);
    };
  }, [open, onResolved]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9960] flex items-end sm:items-center justify-center p-4">
      <button type="button" aria-label="Close scanner" className="absolute inset-0 bg-black/85" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white border-2 border-[#E78A3E] rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-black border-b border-[#E78A3E] flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-[#E78A3E] uppercase text-sm">Verify remote claim</h3>
            <p className="text-[10px] font-mono text-white uppercase mt-1">
              {cameraReady ? "Scan pass QR" : "Manual code entry"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div id={regionId} className="w-full overflow-hidden rounded-2xl bg-black min-h-[220px]" />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div>
            <label className="text-[10px] font-mono uppercase text-zinc-600 font-black">Or enter 4-digit claim code</label>
            <div className="mt-1 flex gap-2">
              <input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                className="flex-1 border border-zinc-300 rounded-xl px-3 py-3 text-center text-xl font-black tracking-[0.4em] text-black"
              />
              <button
                type="button"
                onClick={() => {
                  if (manualCode.length !== 4) {
                    setError("Enter all 4 digits.");
                    return;
                  }
                  onResolved({ orderId: "", claimCode: manualCode, raw: manualCode });
                }}
                className="px-4 py-3 bg-[#E78A3E] text-black font-black uppercase text-xs rounded-xl"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
