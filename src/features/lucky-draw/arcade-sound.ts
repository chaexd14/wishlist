// Zero-dependency Web Audio API synth for cute retro arcade feedback.

let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedContext) sharedContext = new Ctor();
  if (sharedContext.state === "suspended") {
    void sharedContext.resume();
  }
  return sharedContext;
}

function tone(
  freqStart: number,
  freqEnd: number,
  duration: number,
  type: OscillatorType = "triangle",
  gainPeak = 0.08,
  delay = 0,
) {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, now);
  if (freqEnd !== freqStart) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + duration);
  }
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(gainPeak, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playMoveTick(muted: boolean) {
  if (muted) return;
  tone(380, 440, 0.045, "triangle", 0.04);
}

export function playClawDrop(muted: boolean) {
  if (muted) return;
  tone(480, 210, 0.28, "sine", 0.07);
}

export function playClawGrab(muted: boolean) {
  if (muted) return;
  tone(260, 520, 0.09, "triangle", 0.09);
}

export function playClawSlip(muted: boolean) {
  if (muted) return;
  tone(520, 170, 0.26, "sawtooth", 0.055);
  tone(240, 140, 0.18, "triangle", 0.06, 0.16);
}

export function playCupSwoosh(muted: boolean) {
  if (muted) return;
  tone(280, 420, 0.09, "sine", 0.045);
}

export function playMiss(muted: boolean) {
  if (muted) return;
  tone(330, 290, 0.14, "triangle", 0.07);
  tone(260, 200, 0.22, "triangle", 0.07, 0.14);
}

export function playWinFanfare(muted: boolean) {
  if (muted) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((n, i) => {
    tone(n, n * 1.01, 0.28, "triangle", 0.09, i * 0.095);
  });
}
