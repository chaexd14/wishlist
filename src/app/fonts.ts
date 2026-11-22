import localFont from "next/font/local";

export const sketchpop = localFont({
  variable: "--plop-sketchpop",
  display: "swap",
  preload: true,
  src: [
    { path: "../../node_modules/@plop-ui/fonts/files/sketchpop-regular.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@plop-ui/fonts/files/sketchpop-bold.woff2", weight: "700", style: "normal" },
    { path: "../../node_modules/@plop-ui/fonts/files/sketchpop-black-italic.woff2", weight: "900", style: "italic" },
  ],
});
