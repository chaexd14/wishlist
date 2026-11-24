"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { JournalButton } from "@/components/journal";
import { LUCKY_DRAW_PRIZES, type LuckyDrawPrize } from "@/content/lucky-draw";
import {
  playClawDrop,
  playClawGrab,
  playClawSlip,
  playMiss,
  playMoveTick,
  playWinFanfare,
} from "@/features/lucky-draw/arcade-sound";

const W = 560;
const H = 380;
const RAIL_Y = 56;
const MIN_X = 132;
const MAX_X = 516;
const CHUTE_X = 66;
const FLOOR_Y = 334;
const CAP_R = 22;

type Capsule = {
  id: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  rot: number;
  prize?: LuckyDrawPrize;
  color: string;
  topColor: string;
  face: string;
  falling: boolean;
  inChute: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  rot: number;
  vrot: number;
};

type FloatText = {
  text: string;
  x: number;
  y: number;
  life: number;
  color: string;
};

type Phase =
  | "idle"
  | "dropping"
  | "grabbing"
  | "lifting"
  | "shaking"
  | "carrying"
  | "releasing"
  | "returning";

function secureRandomFloat() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0xffffffff;
}

// 15 capsules total: 6 bottom + 5 middle + 4 top.
// The 3 prize orbs ONLY spawn in indices 0..10 (bottom/middle) so they are always buried beneath the 4 top decoys!
const PIT_SPOTS: Array<[number, number]> = [
  // Bottom row (6)
  [162, 332],
  [226, 333],
  [290, 332],
  [354, 333],
  [418, 332],
  [482, 333],
  // Middle row (5)
  [194, 294],
  [258, 293],
  [322, 295],
  [386, 293],
  [450, 294],
  // Top row (4) — ALWAYS decoys covering the buried prizes below!
  [226, 256],
  [290, 255],
  [354, 257],
  [418, 256],
];

const DECOY_FACES = ["?", "zZ", "o_o", "×", "?", "-_-", "o_o", "×", "?", "zZ", "-_-", "×"] as const;

function createCapsules(): Capsule[] {
  const decoys = DECOY_FACES.map((face, i) => ({
    color: i % 2 === 0 ? "#e2d2ba" : "#d7c3a6",
    topColor: "#f3e8d6",
    face,
  }));
  const topRowDecoys = decoys.slice(0, 4);
  const buriedPool: Array<{ prize?: LuckyDrawPrize; color: string; topColor: string; face: string }> = [
    ...LUCKY_DRAW_PRIZES.map((prize) => ({
      prize,
      color: prize.sliceColor,
      topColor: "#fff9ec",
      face: "★",
    })),
    ...decoys.slice(4),
  ];
  for (let i = buriedPool.length - 1; i > 0; i--) {
    const j = Math.floor(secureRandomFloat() * (i + 1));
    [buriedPool[i], buriedPool[j]] = [buriedPool[j], buriedPool[i]];
  }
  const ordered = [...buriedPool, ...topRowDecoys];
  return PIT_SPOTS.map(([x, y], i) => ({
    id: `cap-${i}`,
    x,
    y,
    baseX: x,
    baseY: y,
    vx: 0,
    vy: 0,
    rot: (secureRandomFloat() - 0.5) * 0.45,
    falling: false,
    inChute: false,
    ...ordered[i],
  }));
}

export function ClawMachineGame({
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
  const [status, setStatus] = useState("Aim with ◀ / ▶ (or drag on the window), then hit DROP CLAW!");
  const [busy, setBusy] = useState(false);

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

  // Mutable 60fps simulation state
  const simRef = useRef({
    capsules: createCapsules(),
    clawX: 310,
    clawVx: 0,
    clawY: 108,
    targetDropY: 300,
    jawOpen: 0.35,
    swingAngle: 0,
    swingVel: 0,
    moveDir: 0, // -1, 0, +1
    phase: "idle" as Phase,
    phaseTimer: 0,
    caughtId: null as string | null,
    willSlip: false,
    wonPrize: null as LuckyDrawPrize | null,
    particles: [] as Particle[],
    floats: [] as FloatText[],
    tickAccum: 0,
    images: new Map<string, HTMLImageElement>(),
  });

  // Preload optional prize images onto canvas
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

  const setBusyState = useCallback((next: boolean) => {
    setBusy(next);
    onBusyRef.current?.(next);
  }, []);

  const triggerDrop = useCallback(() => {
    const sim = simRef.current;
    if (sim.phase !== "idle" || triesRef.current <= 0) return;
    sim.moveDir = 0;
    sim.phase = "dropping";
    sim.phaseTimer = 0;
    sim.caughtId = null;
    sim.willSlip = false;
    sim.wonPrize = null;

    // Pick closest capsule vertically below claw
    let targetY = FLOOR_Y - 12;
    for (const c of sim.capsules) {
      if (c.inChute) continue;
      if (Math.abs(c.x - sim.clawX) < 34 && c.y - 16 < targetY) {
        targetY = c.y - 14;
      }
    }
    sim.targetDropY = targetY;
    setBusyState(true);
    setStatus("Dropping the claw…");
    playClawDrop(mutedRef.current);
  }, [setBusyState]);

  // Keyboard controls
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const sim = simRef.current;
      if (sim.phase !== "idle") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        sim.moveDir = -1;
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        sim.moveDir = 1;
      } else if (e.key === " " || e.key === "Enter") {
        if ((e.target as HTMLElement)?.tagName !== "BUTTON") {
          e.preventDefault();
          triggerDrop();
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      const sim = simRef.current;
      if ((e.key === "ArrowLeft" && sim.moveDir === -1) || (e.key === "ArrowRight" && sim.moveDir === 1)) {
        sim.moveDir = 0;
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [triggerDrop]);

  // Main 60fps canvas animation & physics loop
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

    function spawnConfetti(cx: number, cy: number) {
      const colors = ["#e9a7b8", "#f0c85e", "#a8d5b5", "#c8684a", "#c5b3e6"];
      for (let i = 0; i < 42; i++) {
        const ang = (Math.PI * 2 * i) / 42 + (Math.random() - 0.5) * 0.4;
        const spd = 2.4 + Math.random() * 4.8;
        simRef.current.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 2.6,
          size: 5 + Math.random() * 5,
          color: colors[i % colors.length],
          life: 0,
          maxLife: 65 + Math.random() * 35,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.25,
        });
      }
    }

    function addFloat(text: string, x: number, y: number, color = "#35222e") {
      simRef.current.floats.push({ text, x, y, life: 75, color });
    }

    function step(now: number) {
      const dt = Math.min((now - lastTime) / 16.6667, 2.2);
      lastTime = now;
      const sim = simRef.current;

      // 1. Horizontal idle movement
      if (sim.phase === "idle") {
        const targetVx = sim.moveDir * 4.4;
        sim.clawVx += (targetVx - sim.clawVx) * 0.25 * dt;
        const nextX = Math.max(MIN_X, Math.min(MAX_X, sim.clawX + sim.clawVx * dt));
        if (Math.abs(nextX - sim.clawX) > 0.3) {
          sim.tickAccum += Math.abs(nextX - sim.clawX);
          if (sim.tickAccum > 24) {
            sim.tickAccum = 0;
            playMoveTick(mutedRef.current);
          }
        }
        sim.clawX = nextX;
        if (nextX === MIN_X || nextX === MAX_X) sim.clawVx = 0;
        sim.jawOpen += (0.35 - sim.jawOpen) * 0.14 * dt;
      } else {
        sim.clawVx *= 0.8;
      }

      // Pronounced wobbly pendulum physics (sways noticeably when moving & dropping!)
      const ambientWobble = sim.phase === "dropping" ? Math.sin(now * 0.014) * 0.009 : 0;
      const swayForce = -sim.clawVx * 0.028 - sim.swingAngle * 0.095 - sim.swingVel * 0.065 + ambientWobble;
      sim.swingVel += swayForce * dt;
      sim.swingAngle = Math.max(-0.48, Math.min(0.48, sim.swingAngle + sim.swingVel * dt));

      // 2. Phase state machine
      sim.phaseTimer += dt;

      if (sim.phase === "dropping") {
        sim.jawOpen += (1 - sim.jawOpen) * 0.2 * dt;
        sim.clawY += 5.4 * dt;
        if (sim.clawY >= sim.targetDropY) {
          sim.clawY = sim.targetDropY;
          sim.phase = "grabbing";
          sim.phaseTimer = 0;
          playClawGrab(mutedRef.current);

          // Check grab hit using the actual swaying claw tip position!
          const cableLenNow = Math.max(12, sim.clawY - (RAIL_Y + 8));
          const tipX = sim.clawX + Math.sin(sim.swingAngle) * cableLenNow;
          let best: Capsule | null = null;
          let bestDist = Infinity;
          for (const c of sim.capsules) {
            if (c.inChute) continue;
            const d = Math.hypot(c.x - tipX, c.y - (sim.clawY + 14));
            if (d < bestDist) {
              bestDist = d;
              best = c;
            }
          }
          if (best && bestDist <= 24) {
            sim.caughtId = best.id;
            if (best.prize) {
              sim.willSlip = secureRandomFloat() < 0.65;
              setStatus("Ooh! Grabbed a prize capsule… hold tight!");
            } else {
              sim.willSlip = false;
              setStatus("Grabbed a capsule… let's see what's inside!");
            }
          } else {
            addFloat("MISSED!", tipX, sim.clawY - 12, "#a63b67");
            setStatus("Missed! Steady the wobbly claw right over a glowing prize orb!");
          }
        }
      } else if (sim.phase === "grabbing") {
        sim.jawOpen += (0.08 - sim.jawOpen) * 0.25 * dt;
        if (sim.phaseTimer > 20) {
          sim.phase = "lifting";
          sim.phaseTimer = 0;
        }
      } else if (sim.phase === "lifting") {
        sim.clawY -= 3.2 * dt;
        const caught = sim.capsules.find((c) => c.id === sim.caughtId);
        if (caught) {
          caught.x = sim.clawX + Math.sin(sim.swingAngle) * 18;
          caught.y = sim.clawY + 26;
        }
        // Dramatic mid-lift random slip!
        if (caught && sim.willSlip && sim.clawY <= 198) {
          sim.phase = "shaking";
          sim.phaseTimer = 0;
          setStatus("Uh oh… the claw is loosening!");
        } else if (sim.clawY <= 108) {
          sim.clawY = 108;
          if (caught) {
            sim.phase = "carrying";
            sim.phaseTimer = 0;
          } else {
            sim.phase = "idle";
            setBusyState(false);
            playMiss(mutedRef.current);
            onMissRef.current();
          }
        }
      } else if (sim.phase === "shaking") {
        sim.swingAngle = Math.sin(sim.phaseTimer * 1.4) * 0.28;
        const caught = sim.capsules.find((c) => c.id === sim.caughtId);
        if (caught) {
          caught.x = sim.clawX + Math.sin(sim.swingAngle) * 20;
          caught.y = sim.clawY + 28 + Math.sin(sim.phaseTimer * 1.8) * 3;
        }
        if (sim.phaseTimer > 26) {
          // Slip out!
          sim.jawOpen = 0.95;
          if (caught) {
            caught.falling = true;
            caught.vx = (Math.random() - 0.5) * 1.8;
            caught.vy = 1.2;
          }
          sim.caughtId = null;
          playClawSlip(mutedRef.current);
          addFloat("SLIPPED!", sim.clawX, sim.clawY - 8, "#c8684a");
          setStatus("Oh no! The claw loosened and it slipped right back down!");
          sim.phase = "returning";
          sim.phaseTimer = 0;
        }
      } else if (sim.phase === "carrying") {
        const dx = CHUTE_X - sim.clawX;
        const stepX = Math.sign(dx) * Math.min(Math.abs(dx), 4.2 * dt);
        sim.clawVx = stepX;
        sim.clawX += stepX;
        const caught = sim.capsules.find((c) => c.id === sim.caughtId);
        if (caught) {
          caught.x = sim.clawX + Math.sin(sim.swingAngle) * 16;
          caught.y = sim.clawY + 26;
        }
        if (Math.abs(CHUTE_X - sim.clawX) < 2) {
          sim.clawX = CHUTE_X;
          sim.phase = "releasing";
          sim.phaseTimer = 0;
          sim.jawOpen = 1;
          if (caught) {
            caught.falling = true;
            caught.inChute = true;
            caught.vx = 0;
            caught.vy = 2;
            if (caught.prize) {
              sim.wonPrize = caught.prize;
              spawnConfetti(CHUTE_X + 20, 220);
              playWinFanfare(mutedRef.current);
              addFloat("WINNER!", 280, 140, "#a63b67");
              setStatus(`YAY!! You caught ${caught.prize.title}!`);
            } else {
              playMiss(mutedRef.current);
              addFloat("NO PRIZE!", CHUTE_X + 35, 195, "#624b55");
              setStatus("Aw, empty decoy capsule—no prize inside!");
            }
          }
          sim.caughtId = null;
        }
      } else if (sim.phase === "releasing") {
        if (sim.phaseTimer > 52) {
          if (sim.wonPrize) {
            const prize = sim.wonPrize;
            sim.wonPrize = null;
            sim.phase = "idle";
            setBusyState(false);
            onWinRef.current(prize);
          } else {
            sim.phase = "returning";
            sim.phaseTimer = 0;
          }
        }
      } else if (sim.phase === "returning") {
        sim.clawY += (108 - sim.clawY) * 0.14 * dt;
        const returnX = sim.clawX < MIN_X ? MIN_X + 30 : sim.clawX;
        sim.clawX += (returnX - sim.clawX) * 0.14 * dt;
        if (sim.phaseTimer > 38) {
          sim.clawY = 108;
          sim.clawX = Math.max(MIN_X, Math.min(MAX_X, sim.clawX));
          sim.phase = "idle";
          setBusyState(false);
          onMissRef.current();
        }
      }

      // 3. Falling / bouncing capsule physics
      for (const c of sim.capsules) {
        if (!c.falling) continue;
        c.vy += 0.65 * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.rot += c.vx * 0.04 * dt;
        const floor = c.inChute ? H + 40 : c.baseY;
        if (c.y >= floor) {
          c.y = floor;
          if (!c.inChute && Math.abs(c.vy) > 2.4) {
            c.vy = -c.vy * 0.42;
            c.vx *= 0.65;
          } else {
            c.vy = 0;
            c.vx = 0;
            c.falling = false;
            if (!c.inChute) {
              c.x = Math.max(145, Math.min(505, c.x));
            }
          }
        }
      }

      // 4. Particles & floating callouts
      for (let i = sim.particles.length - 1; i >= 0; i--) {
        const p = sim.particles[i];
        p.life += dt;
        p.vy += 0.14 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vrot * dt;
        if (p.life >= p.maxLife) sim.particles.splice(i, 1);
      }
      for (let i = sim.floats.length - 1; i >= 0; i--) {
        const f = sim.floats[i];
        f.y -= 0.7 * dt;
        f.life -= dt;
        if (f.life <= 0) sim.floats.splice(i, 1);
      }

      // 5. Render everything crisp at DPR
      if (!ctx) return;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      // Cabinet wallpaper stripes
      ctx.fillStyle = "#fff9ec";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#f4e6cf";
      for (let sx = 0; sx < W; sx += 36) {
        ctx.fillRect(sx, 42, 18, H - 42);
      }

      // Floor deck
      ctx.fillStyle = "#e6d2b5";
      ctx.fillRect(0, 344, W, H - 344);
      ctx.strokeStyle = "#35222e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 344);
      ctx.lineTo(W, 344);
      ctx.stroke();

      // Prize Chute (left wall)
      ctx.fillStyle = "#ebdcc5";
      ctx.strokeStyle = "#35222e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(14, 240, 98, 126, [12, 12, 0, 0]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#35222e";
      ctx.fillRect(24, 250, 78, 16);
      ctx.fillStyle = "#fff9ec";
      ctx.font = "900 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PRIZE CHUTE", 63, 286);

      // Steel rail
      ctx.fillStyle = "#35222e";
      ctx.beginPath();
      ctx.roundRect(24, RAIL_Y - 4, W - 48, 8, 4);
      ctx.fill();

      // Draw capsules (back row first, then front, then caught)
      const sorted = [...sim.capsules].sort((a, b) => {
        if (a.id === sim.caughtId) return 1;
        if (b.id === sim.caughtId) return -1;
        return a.y - b.y;
      });
      for (const c of sorted) {
        if (c.inChute && c.y > H + 20) continue;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);

        // Ground shadow
        if (!c.falling && c.id !== sim.caughtId) {
          ctx.fillStyle = "rgba(53, 34, 46, 0.16)";
          ctx.beginPath();
          ctx.ellipse(0, CAP_R - 2, CAP_R * 0.85, 6, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bottom half
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(0, 0, CAP_R, 0, Math.PI * 2);
        ctx.fill();

        // Top half dome
        ctx.fillStyle = c.topColor;
        ctx.beginPath();
        ctx.arc(0, 0, CAP_R, Math.PI, 0);
        ctx.closePath();
        ctx.fill();

        // Optional prize photo clipped inside orb
        const loadedImg = c.prize ? sim.images.get(c.prize.id) : undefined;
        if (loadedImg) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, CAP_R - 3, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(loadedImg, -CAP_R + 3, -CAP_R + 3, (CAP_R - 3) * 2, (CAP_R - 3) * 2);
          ctx.restore();
        } else {
          // Seam line
          ctx.strokeStyle = "#35222e";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-CAP_R, 0);
          ctx.lineTo(CAP_R, 0);
          ctx.stroke();

          // Symbol / face
          ctx.fillStyle = c.prize ? "#a63b67" : "#624b55";
          ctx.font = c.prize ? "900 18px sans-serif" : "800 13px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(c.face, 0, c.prize ? -2 : 2);
        }

        // Gloss highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
        ctx.beginPath();
        ctx.ellipse(-9, -11, 7, 4, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // Outer cocoa outline (bright cream halo on prize orbs!)
        if (c.prize) {
          ctx.strokeStyle = "#fff9ec";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(0, 0, CAP_R + 1, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.strokeStyle = "#35222e";
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.arc(0, 0, CAP_R, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // Draw Claw carriage, cable & articulated prongs
      ctx.save();
      // Trolley block
      ctx.fillStyle = "#c8684a";
      ctx.strokeStyle = "#35222e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(sim.clawX - 18, RAIL_Y - 10, 36, 18, 6);
      ctx.fill();
      ctx.stroke();

      // Cable + swaying claw head
      ctx.translate(sim.clawX, RAIL_Y + 8);
      ctx.rotate(sim.swingAngle);
      const cableLen = Math.max(12, sim.clawY - (RAIL_Y + 8));
      ctx.strokeStyle = "#35222e";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, cableLen);
      ctx.stroke();

      // Claw pivot hub
      ctx.translate(0, cableLen);
      const spread = 12 + sim.jawOpen * 16;
      const tipSpread = 6 + sim.jawOpen * 22;

      ctx.strokeStyle = "#35222e";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // Left prong
      ctx.beginPath();
      ctx.moveTo(-4, 2);
      ctx.lineTo(-spread, 18);
      ctx.lineTo(-tipSpread, 36);
      ctx.stroke();
      // Right prong
      ctx.beginPath();
      ctx.moveTo(4, 2);
      ctx.lineTo(spread, 18);
      ctx.lineTo(tipSpread, 36);
      ctx.stroke();

      // Hub cap
      ctx.fillStyle = "#fff9ec";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Top Arcade Marquee with chasing bulbs
      ctx.fillStyle = "#c8684a";
      ctx.fillRect(0, 0, W, 42);
      ctx.strokeStyle = "#35222e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 42);
      ctx.lineTo(W, 42);
      ctx.stroke();

      const bulbPhase = Math.floor(now / 260) % 2;
      for (let i = 0; i < 13; i++) {
        const bx = 24 + i * 42.5;
        const lit = i % 2 === bulbPhase;
        ctx.fillStyle = lit ? "#fff4b8" : "#e9a7b8";
        ctx.beginPath();
        ctx.arc(bx, 10, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#35222e";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.fillStyle = "#fff9ec";
      ctx.font = "900 17px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("★  LUCKY CLAW ARCADE  ★", W / 2, 28);

      // Diagonal glass glare sheen
      ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
      ctx.beginPath();
      ctx.moveTo(40, 44);
      ctx.lineTo(120, 44);
      ctx.lineTo(40, 220);
      ctx.closePath();
      ctx.fill();

      // Confetti particles
      for (const p of sim.particles) {
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = "#35222e";
        ctx.lineWidth = 1.2;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }

      // Floating comic callouts
      for (const f of sim.floats) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, f.life / 25);
        ctx.font = "900 22px sans-serif";
        ctx.textAlign = "center";
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#fff9ec";
        ctx.strokeText(f.text, f.x, f.y);
        ctx.fillStyle = f.color;
        ctx.fillText(f.text, f.x, f.y);
        ctx.restore();
      }

      ctx.restore();
      rafId = window.requestAnimationFrame(step);
    }

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [setBusyState]);

  // Direct pointer/touch aiming on canvas
  const aimFromPointer = (clientX: number) => {
    const sim = simRef.current;
    if (sim.phase !== "idle" || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ratio = (clientX - rect.left) / Math.max(1, rect.width);
    const targetX = Math.max(MIN_X, Math.min(MAX_X, ratio * W));
    sim.clawVx = (targetX - sim.clawX) * 0.35;
    sim.clawX = targetX;
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
          aria-label="Interactive Claw Machine arcade cabinet"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            aimFromPointer(e.clientX);
          }}
          onPointerMove={(e) => {
            if (e.buttons > 0 || e.pointerType === "touch") aimFromPointer(e.clientX);
          }}
        />
      </div>

      <p className="sr-only" role="status" aria-live="polite">{status}</p>

      <div className="arcade-controls-row">
        <JournalButton
          type="button"
          intent="secondary"
          size="sm"
          disabled={busy}
          aria-label="Move claw left"
          seed="claw-move-left"
          onPointerDown={() => {
            simRef.current.moveDir = -1;
          }}
          onPointerUp={() => {
            if (simRef.current.moveDir === -1) simRef.current.moveDir = 0;
          }}
          onPointerLeave={() => {
            if (simRef.current.moveDir === -1) simRef.current.moveDir = 0;
          }}
          onPointerCancel={() => {
            simRef.current.moveDir = 0;
          }}
        >
          ◀ Left
        </JournalButton>

        <JournalButton
          type="button"
          intent="romantic"
          size="sm"
          disabled={busy || triesLeft <= 0}
          onClick={triggerDrop}
          seed="claw-drop-action"
        >
          {busy ? "Grabbing…" : "Drop Claw!"}
        </JournalButton>

        <JournalButton
          type="button"
          intent="secondary"
          size="sm"
          disabled={busy}
          aria-label="Move claw right"
          seed="claw-move-right"
          onPointerDown={() => {
            simRef.current.moveDir = 1;
          }}
          onPointerUp={() => {
            if (simRef.current.moveDir === 1) simRef.current.moveDir = 0;
          }}
          onPointerLeave={() => {
            if (simRef.current.moveDir === 1) simRef.current.moveDir = 0;
          }}
          onPointerCancel={() => {
            simRef.current.moveDir = 0;
          }}
        >
          Right ▶
        </JournalButton>
      </div>
    </div>
  );
}
