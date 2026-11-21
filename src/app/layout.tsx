import type { Metadata } from "next";
import "@plop-ui/react/styles.css";
import "./globals.css";

import { JournalProvider } from "@/components/journal";

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
    >
      <body className="plop-surface">
        <JournalProvider>{children}</JournalProvider>
      </body>
    </html>
  );
}
