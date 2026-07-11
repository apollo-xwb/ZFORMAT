let audioCtx: AudioContext | null = null;
let listenersAttached = false;
let audioUnlocked = false;

function createAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  return new AudioCtx();
}

function getAudioContext(): AudioContext | null {
  if (!audioUnlocked || !audioCtx) return null;
  return audioCtx;
}

export async function unlockRocoAudio(): Promise<boolean> {
  if (!audioCtx) {
    audioCtx = createAudioContext();
  }
  const ctx = audioCtx;
  if (!ctx) return false;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return false;
    }
  }
  audioUnlocked = ctx.state === "running";
  return audioUnlocked;
}

export function setupRocoAudioUnlock(): void {
  if (listenersAttached || typeof window === "undefined") return;
  listenersAttached = true;

  const unlock = () => {
    void unlockRocoAudio();
  };

  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock);
  window.addEventListener("touchstart", unlock, { passive: true });
}

export function isRocoAudioReady(): boolean {
  return getAudioContext()?.state === "running";
}

export function playBeep(
  freq = 440,
  type: OscillatorType = "sine",
  duration = 0.08,
  enabled = true
): void {
  if (!enabled) return;

  const ctx = getAudioContext();
  if (!ctx || ctx.state !== "running") return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore synthesis errors in restrictive browser environments.
  }
}
