"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { JournalButton } from "@/components/journal";
import { LUCKY_DRAW_PRIZES, type LuckyDrawPrize } from "@/content/lucky-draw";
import { playCupSwoosh, playMiss, playWinFanfare } from "@/features/lucky-draw/arcade-sound";

const W = 560;
const H = 345;
// 7 staggered slots: 4 in back row (0..3), 3 in front row (4..6)
const SLOTS: ReadonlyArray<{ x: number; y: number; scale: number }> = [
  { x: 100, y: 192, scale: 0.88 },
  { x: 220, y: 192, scale: 0.88 },
  { x: 340, y: 192, scale: 0.88 },
  { x: 460, y: 192, scale: 0.88 },
  { x: 160, y: 292, scale: 1.0 },
  { x: 280, y: 292, scale: 1.0 },
  { x: 400, y: 292, scale: 1.0 },
];
const CUP_COLOR = "#e9a7b8";

type CupObj = {
  id: number;
  slot: number;
  x: number;
  y: number;
  scale: number;
  lift: number;
  wobble: number;
  color: string;
  prize?: LuckyDrawPrize;
};

type SwapAnim = {
  cupA: number;
  cupB: number;
  fromSlotA: number;
  fromSlotB: number;
  toSlotA: number;
  toSlotB: number;
  progress: number;
  durationMs: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
};

type Phase = "ready" | "peeking" | "lowering" | "shuffling" | "picking" | "revealed";

function secureRandomInt(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function createCups(): CupObj[] {
  const prizes: Array<LuckyDrawPrize | undefined> = [
    LUCKY_DRAW_PRIZES[0],
    LUCKY_DRAW_PRIZES[1],
    LUCKY_DRAW_PRIZES[2],
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  for (let i = prizes.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [prizes[i], prizes[j]] = [prizes[j], prizes[i]];
  }
  return SLOTS.map((slotPos, id) => ({
    id,
    slot: id,
    x: slotPos.x,
    y: slotPos.y,
    scale: slotPos.scale,
    lift: 0,
    wobble: 0,
    color: CUP_COLOR,
    prize: prizes[id],
  }));
}

export function CupShuffleGame({
  triesLeft,
  muted,
  onWin,
  onMiss,
  onBusyChange,
}: {
  triesLeft: number;
  muted: boolean;
  onWin: (prize: LuckyDrawPrize) => void;
  onMiss: () => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [status, setStatus] = useState("Tap \"Start Shuffle!\" to peek under the 7 cups, then track the 3 prizes!");
  const [pickedWon, setPickedWon] = useState(false);

  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const triesRef = useRef(triesLeft);
  useEffect(() => {
    triesRef.current = triesLeft;
  }, [triesLeft]);

  const onWinRef = useRef(onWin);
  const onMissRef = useRef(onMiss);
  const onBusyRef = useRef(onBusyChange);
  useEffect(() => {
    onWinRef.current = onWin;
    onMissRef.current = onMiss;
    onBusyRef.current = onBusyChange;
  }, [onWin, onMiss, onBusyChange]);

  const simRef = useRef({
    cups: createCups(),
    phase: "ready" as Phase,
    phaseElapsed: 0,
    swapsLeft: 0,
    activeSwap: null as SwapAnim | null,
    hoveredCupId: null as number | null,
    pickedCupId: null as number | null,
    sparks: [] as Spark[],
    images: new Map<string, HTMLImageElement>(),
  });

  // Preload optional prize images
  useEffect(() => {
    const map = simRef.current.images;
    LUCKY_DRAW_PRIZES.forEach((p) => {
      if (!p.imageUrl || map.has(p.id)) return;
      const img = new window.Image();
      img.src = p.imageUrl;
      img.onload = () => {
        map.set(p.id, img);
      };
    });
  }, []);

  const syncPhase = useCallback((next: Phase) => {
    simRef.current.phase = next;
    simRef.current.phaseElapsed = 0;
    setPhase(next);
    onBusyRef.current?.(next === "peeking" || next === "lowering" || next === "shuffling");
  }, []);

  const startRound = useCallback(() => {
    const sim = simRef.current;
    if (sim.phase !== "ready" && sim.phase !== "revealed") return;
    if (triesRef.current <= 0) return;
    sim.cups = createCups();
    sim.pickedCupId = null;
    sim.hoveredCupId = null;
    sim.activeSwap = null;
    setPickedWon(false);
    syncPhase("peeking");
    setStatus("Quick peek—spot the 3 prizes before the 7 cups blur!");
  }, [syncPhase]);

  const pickBySlot = useCallback(
    (slotIndex: number) => {
      const sim = simRef.current;
      if (sim.phase !== "picking") return;
      const cup = sim.cups.find((c) => c.slot === slotIndex);
      if (!cup) return;
      sim.pickedCupId = cup.id;
      syncPhase("revealed");

      if (cup.prize) {
        setPickedWon(true);
        playWinFanfare(mutedRef.current);
        setStatus(`YAY!! You found ${cup.prize.title}!`);
        const colors = ["#e9a7b8", "#f0c85e", "#a8d5b5", "#c8684a", "#c5b3e6"];
        for (let i = 0; i < 36; i++) {
          const ang = (Math.PI * 2 * i) / 36;
          const spd = 2 + Math.random() * 4.5;
          sim.sparks.push({
            x: cup.x,
            y: cup.y - 12,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 2.4,
            size: 5 + Math.random() * 4,
            color: colors[i % colors.length],
            life: 0,
            maxLife: 65,
          });
        }
        const prize = cup.prize;
        window.setTimeout(() => onWinRef.current(prize), 1050);
      } else {
        setPickedWon(false);
        cup.wobble = 1;
        playMiss(mutedRef.current);
        setStatus("Aw, empty cup! Keep your eyes sharp and try again!");
        window.setTimeout(() => onMissRef.current(), 950);
      }
    },
    [syncPhase],
  );

  // Main 60fps canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;

    let rafId = 0;
    let lastTime = performance.now();

    function beginNextSwap() {
      const sim = simRef.current;
      if (sim.swapsLeft <= 0) {
        sim.activeSwap = null;
        syncPhase("picking");
        setStatus("Tap any cup on the desk to lift it!");
        return;
      }
      const slotA = secureRandomInt(SLOTS.length);
      let slotB = secureRandomInt(SLOTS.length - 1);
      if (slotB >= slotA) slotB += 1;
      const cupA = sim.cups.find((c) => c.slot === slotA)!;
      const cupB = sim.cups.find((c) => c.slot === slotB)!;
      const speedRamp = Math.max(135, 245 - (14 - sim.swapsLeft) * 9);
      sim.activeSwap = {
        cupA: cupA.id,
        cupB: cupB.id,
        fromSlotA: slotA,
        fromSlotB: slotB,
        toSlotA: slotB,
        toSlotB: slotA,
        progress: 0,
        durationMs: speedRamp,
      };
      cupA.slot = slotB;
      cupB.slot = slotA;
      sim.swapsLeft -= 1;
      playCupSwoosh(mutedRef.current);
    }

    function step(now: number) {
      const dtMs = Math.min(now - lastTime, 40);
      const dt = dtMs / 16.6667;
      lastTime = now;
      const sim = simRef.current;
      sim.phaseElapsed += dtMs;

      if (sim.phase === "peeking") {
        for (const c of sim.cups) {
          c.lift += (72 - c.lift) * 0.2 * dt;
        }
        if (sim.phaseElapsed >= 950) {
          syncPhase("lowering");
          setStatus("Get ready… fast 2-row shuffle!");
        }
      } else if (sim.phase === "lowering") {
        for (const c of sim.cups) {
          c.lift += (0 - c.lift) * 0.28 * dt;
        }
        if (sim.phaseElapsed >= 240) {
          for (const c of sim.cups) c.lift = 0;
          sim.swapsLeft = 14;
          syncPhase("shuffling");
          setStatus("Don't blink—track the prizes!");
          beginNextSwap();
        }
      } else if (sim.phase === "shuffling") {
        const sw = sim.activeSwap;
        if (sw) {
          sw.progress = Math.min(1, sw.progress + dtMs / sw.durationMs);
          const t = sw.progress < 0.5 ? 2 * sw.progress * sw.progress : 1 - Math.pow(-2 * sw.progress + 2, 2) / 2;
          const arc = Math.sin(sw.progress * Math.PI);
          const pFromA = SLOTS[sw.fromSlotA];
          const pToA = SLOTS[sw.toSlotA];
          const pFromB = SLOTS[sw.fromSlotB];
          const pToB = SLOTS[sw.toSlotB];

          // Perpendicular arc vector so both horizontal & diagonal swaps curve cleanly around each other
          const dx = pToA.x - pFromA.x;
          const dy = pToA.y - pFromA.y;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const perpX = (-dy / dist) * 26;
          const perpY = (dx / dist) * 26;

          const cupA = sim.cups.find((c) => c.id === sw.cupA)!;
          const cupB = sim.cups.find((c) => c.id === sw.cupB)!;

          cupA.x = pFromA.x + (pToA.x - pFromA.x) * t + perpX * arc;
          cupA.y = pFromA.y + (pToA.y - pFromA.y) * t + perpY * arc;
          cupA.scale = pFromA.scale + (pToA.scale - pFromA.scale) * t + arc * 0.08;

          cupB.x = pFromB.x + (pToB.x - pFromB.x) * t - perpX * arc;
          cupB.y = pFromB.y + (pToB.y - pFromB.y) * t - perpY * arc;
          cupB.scale = pFromB.scale + (pToB.scale - pFromB.scale) * t - arc * 0.06;

          if (sw.progress >= 1) {
            cupA.x = pToA.x;
            cupA.y = pToA.y;
            cupA.scale = pToA.scale;
            cupB.x = pToB.x;
            cupB.y = pToB.y;
            cupB.scale = pToB.scale;
            beginNextSwap();
          }
        }
      } else if (sim.phase === "picking") {
        for (const c of sim.cups) {
          const targetLift = sim.hoveredCupId === c.id ? 10 : 0;
          c.lift += (targetLift - c.lift) * 0.22 * dt;
        }
      } else if (sim.phase === "revealed") {
        for (const c of sim.cups) {
          const targetLift = sim.pickedCupId === c.id ? 76 : 0;
          c.lift += (targetLift - c.lift) * 0.16 * dt;
          if (c.wobble > 0) c.wobble = Math.max(0, c.wobble - 0.04 * dt);
        }
      }

      for (let i = sim.sparks.length - 1; i >= 0; i--) {
        const s = sim.sparks[i];
        s.life += dt;
        s.vy += 0.14 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (s.life >= s.maxLife) sim.sparks.splice(i, 1);
      }

      if (!ctx) return;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      // Wall backdrop
      ctx.fillStyle = "#fff9ec";
      ctx.fillRect(0, 0, W, 134);
      ctx.strokeStyle = "rgba(166, 59, 103, 0.1)";
      ctx.lineWidth = 1;
      for (let ly = 24; ly < 134; ly += 22) {
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(W, ly);
        ctx.stroke();
      }

      // Craft desk surface
      ctx.fillStyle = "#e8d5b8";
      ctx.fillRect(0, 134, W, H - 134);
      ctx.strokeStyle = "#35222e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 134);
      ctx.lineTo(W, 134);
      ctx.stroke();

      // Header banner
      ctx.fillStyle = "#35222e";
      ctx.font = "900 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("★  7-CUP SHUFFLE · 3 PRIZES, 4 EMPTY  ★", W / 2, 22);

      // Depth-sorted rendering (back row first, front row on top!)
      const ordered = [...sim.cups].sort((a, b) => a.y - b.y);
      for (const c of ordered) {
        // Prize or empty coaster beneath lifted cup
        if (c.lift >= 10) {
          const alpha = Math.min(1, (c.lift - 8) / 32);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(c.x, c.y - 10);
          ctx.scale(c.scale, c.scale);
          if (c.prize) {
            ctx.fillStyle = c.prize.sliceColor;
            ctx.strokeStyle = "#35222e";
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.arc(0, 0, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            const img = sim.images.get(c.prize.id);
            if (img) {
              ctx.save();
              ctx.beginPath();
              ctx.arc(0, 0, 19, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(img, -19, -19, 38, 38);
              ctx.restore();
            } else {
              ctx.fillStyle = "#35222e";
              ctx.font = "900 17px sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("★", 0, 0);
            }

            ctx.fillStyle = "#35222e";
            ctx.font = "800 9.5px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(c.prize.shortLabel.toUpperCase(), 0, 32);
          } else {
            ctx.fillStyle = "#624b55";
            ctx.font = "800 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("EMPTY", 0, 4);
          }
          ctx.restore();
        }

        // Cup shadow + vessel
        ctx.save();
        const shadowScale = Math.max(0.45, 1 - c.lift / 120) * c.scale;
        ctx.fillStyle = "rgba(53, 34, 46, 0.2)";
        ctx.beginPath();
        ctx.ellipse(c.x, c.y + 7, 34 * shadowScale, 9 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        const wobbleRot = c.wobble > 0 ? Math.sin(c.wobble * 24) * 0.18 : c.lift > 20 ? -0.06 : 0;
        ctx.translate(c.x, c.y - c.lift);
        ctx.rotate(wobbleRot);
        ctx.scale(c.scale, c.scale);

        ctx.fillStyle = c.color;
        ctx.strokeStyle = "#35222e";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-24, -68);
        ctx.lineTo(24, -68);
        ctx.lineTo(33, 0);
        ctx.lineTo(-33, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
        ctx.beginPath();
        ctx.ellipse(0, -68, 24, 6.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.beginPath();
        ctx.moveTo(-16, -58);
        ctx.lineTo(-9, -58);
        ctx.lineTo(-14, -10);
        ctx.lineTo(-22, -10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fff9ec";
        ctx.beginPath();
        ctx.roundRect(-36, -6, 72, 12, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#35222e";
        ctx.font = "900 17px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("♥", 0, -33);

        ctx.restore();
      }

      // Sparks
      for (const s of sim.sparks) {
        const alpha = Math.max(0, 1 - s.life / s.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.strokeStyle = "#35222e";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
      rafId = window.requestAnimationFrame(step);
    }

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [syncPhase]);

  const slotAtPointer = (clientX: number, clientY: number): number | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / Math.max(1, rect.width)) * W;
    const y = ((clientY - rect.top) / Math.max(1, rect.height)) * H;
    let bestSlot = 0;
    let bestDist = Infinity;
    SLOTS.forEach((s, idx) => {
      // Cup body visual center is ~34px above s.y
      const d = Math.hypot(s.x - x, s.y - 34 - y);
      if (d < bestDist) {
        bestDist = d;
        bestSlot = idx;
      }
    });
    return bestDist <= 56 ? bestSlot : null;
  };

  return (
    <div className="arcade-wrap">
      <div className="arcade-canvas-frame">
        <canvas
          ref={canvasRef}
          className="arcade-canvas"
          width={W}
          height={H}
          role="img"
          aria-label="Interactive 7-cup staggered shuffle desk game"
          onPointerMove={(e) => {
            const sim = simRef.current;
            if (sim.phase !== "picking") {
              sim.hoveredCupId = null;
              return;
            }
            const slot = slotAtPointer(e.clientX, e.clientY);
            sim.hoveredCupId = slot !== null ? (sim.cups.find((c) => c.slot === slot)?.id ?? null) : null;
          }}
          onPointerLeave={() => {
            simRef.current.hoveredCupId = null;
          }}
          onClick={(e) => {
            if (simRef.current.phase === "ready") {
              startRound();
              return;
            }
            if (simRef.current.phase !== "picking") return;
            const slot = slotAtPointer(e.clientX, e.clientY);
            if (slot !== null) pickBySlot(slot);
          }}
        />
      </div>

      <p className="arcade-status-bar" role="status" aria-live="polite">{status}</p>

      {(phase === "ready" || (phase === "revealed" && !pickedWon && triesLeft > 0)) && (
        <div className="arcade-controls-single">
          <JournalButton
            type="button"
            intent="romantic"
            size="md"
            onClick={startRound}
            seed="cup-shuffle-start"
          >
            {phase === "ready" ? "Start Shuffle!" : "Shuffle Again!"}
          </JournalButton>
        </div>
      )}
    </div>
  );
}
