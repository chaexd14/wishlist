import type { Metadata } from "next";
import "@plop-ui/react/styles.css";
import "./globals.css";

import { DEFAULT_JOURNAL_PALETTE, JournalProvider } from "@/components/journal";

import { sketchpop } from "./fonts";

export const metadata: Metadata = {
  title: "Birthday Wishlist",
  description: "Choose the birthday gifts you love most.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sketchpop.variable} h-full antialiased`}
      data-plop-surface="kraft"
      data-plop-theme="light"
      data-journal-palette={DEFAULT_JOURNAL_PALETTE}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;var m=document.cookie.match(/(?:^|; )journal-palette=(coffee|pink|purple|sky)(?:;|$)/);if(m)d.dataset.journalPalette=m[1];var p=location.pathname;d.dataset.plopSurface=p==='/'?'mat':(p.indexOf('/gifts')===0||p==='/cart'||p==='/checkout'||p.indexOf('/confirmation')===0)?'notebook':'kraft'})()`,
          }}
        />
      </head>
      <body className="plop-surface">
        <JournalProvider initialPalette={DEFAULT_JOURNAL_PALETTE}>{children}</JournalProvider>
      </body>
    </html>
  );
}
