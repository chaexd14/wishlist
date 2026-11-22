import type { Transition, Variants } from "motion/react";

export const keepsakeEase = [0.16, 1, 0.3, 1] as const;

export const sceneTransition: Transition = {
  duration: 0.46,
  ease: keepsakeEase,
};

export const deskPropVariants: Variants = {
  hidden: { opacity: 0, y: 18, rotate: 0, scale: 0.96 },
  visible: (custom: { delay: number; rotate: number }) => ({
    opacity: 1,
    y: 0,
    rotate: custom.rotate,
    scale: 1,
    transition: { duration: 0.62, delay: custom.delay, ease: keepsakeEase },
  }),
};

export const sceneVariants: Variants = {
  future: { x: "18%", rotate: 1.1, scale: 0.975, opacity: 0 },
  current: {
    x: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: { ...sceneTransition, opacity: { duration: 0 } },
  },
  past: { x: "-18%", rotate: -1.1, scale: 0.975, opacity: 0 },
};

export const letterVariants: Variants = {
  sealed: { x: "-50%", y: "52%", scale: 0.74, rotate: -0.35, opacity: 0 },
  extracting: {
    x: "-50%",
    y: "-28%",
    scale: 0.79,
    rotate: -0.35,
    opacity: 1,
    transition: { duration: 0.5, ease: keepsakeEase, opacity: { duration: 0.12 } },
  },
  open: {
    x: "-50%",
    y: ["52%", "-28%", "-6%"],
    scale: [0.74, 0.79, 1],
    rotate: -0.35,
    opacity: [0, 1, 1],
    transition: { duration: 1.08, times: [0, 0.44, 1], ease: keepsakeEase },
  },
};

export const foldTopVariants: Variants = {
  folded: { y: "100%", rotate: 0 },
  open: { y: ["100%", "100%", "0%"], rotate: 0, transition: { duration: 1.02, times: [0, 0.45, 1], ease: keepsakeEase } },
};

export const foldBottomVariants: Variants = {
  folded: { y: "-100%", rotate: 0 },
  open: { y: ["-100%", "-100%", "0%"], rotate: 0, transition: { duration: 1.02, times: [0, 0.45, 1], ease: keepsakeEase } },
};

export const copyVariants: Variants = {
  hidden: { opacity: 0, y: 7, filter: "blur(2px)" },
  visible: (delay: number) => ({
    opacity: delay < 0 ? 1 : [0, 0, 1],
    y: delay < 0 ? 0 : [7, 7, 0],
    filter: delay < 0 ? "blur(0px)" : ["blur(2px)", "blur(2px)", "blur(0px)"],
    transition: delay < 0
      ? { duration: 0 }
      : { duration: Math.max(1.08, delay + 0.34), times: [0, delay / Math.max(1.08, delay + 0.34), 1], ease: keepsakeEase },
  }),
};

export const burstPieces = [
  { x: -132, y: -82, rotate: -32, tone: "rose" },
  { x: -78, y: -118, rotate: 22, tone: "honey" },
  { x: -24, y: -96, rotate: -18, tone: "sage" },
  { x: 38, y: -124, rotate: 38, tone: "rose" },
  { x: 92, y: -88, rotate: -28, tone: "terracotta" },
  { x: 138, y: -52, rotate: 44, tone: "honey" },
  { x: -112, y: -34, rotate: 18, tone: "terracotta" },
  { x: 118, y: -18, rotate: -14, tone: "sage" },
] as const;
