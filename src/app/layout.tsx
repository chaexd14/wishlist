import type { Metadata } from "next";
import "@plop-ui/react/styles.css";
import "./globals.css";

import { JournalProvider } from "@/components/journal";

import { sketchpop } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"),
  title: { default: "Your Wish Is My Command", template: "%s · Your Wish Is My Command" },
  description: "Your wish is my command—a little journal made with love to pick the gifts, colors, sizes, and sweet details that make you happiest.",
  applicationName: "Your Wish Is My Command",
  robots: { index: false, follow: false, nocache: true },
  openGraph: { title: "Your Wish Is My Command", description: "A personal wish journal, made with love.", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sketchpop.variable} h-full antialiased`}
      data-plop-surface="kraft"
      data-plop-theme="light"
      data-journal-palette="pink"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;d.dataset.journalPalette='pink';var p=location.pathname;d.dataset.plopSurface=p==='/'?'mat':(p.indexOf('/gifts')===0||p==='/cart'||p==='/checkout'||p.indexOf('/confirmation')===0)?'notebook':'kraft'})()`,
          }}
        />
      </head>
      <body className="plop-surface">
        <JournalProvider>{children}</JournalProvider>
      </body>
    </html>
  );
}
