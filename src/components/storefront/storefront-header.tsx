"use client";

import { Count, Doodle } from "@plop-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { JournalThemeSwitcher } from "@/components/journal";
import { readCart, subscribeToCart } from "@/features/cart/cart";

function getCartCount() {
  try {
    return readCart().reduce((total, item) => total + item.quantity, 0);
  } catch {
    return 0;
  }
}

export function StorefrontHeader() {
  const pathname = usePathname();
  const cartCount = useSyncExternalStore(subscribeToCart, getCartCount, () => 0);

  if (pathname === "/") return null;

  const giftsTransition =
    pathname === "/cart" || pathname.startsWith("/gifts/") ? "page-turn-back" : "page-turn-forward";

  return (
    <div className="storefront-chrome">
      <header className="storefront-header">
        <Link className="storefront-brand" href="/" transitionTypes={["page-peel-back"]}>
          <Doodle kind="heart" tone="tomato" size={34} />
          <span>Birthday journal</span>
        </Link>
        <nav className="storefront-nav" aria-label="Storefront">
          <Link
            aria-current={pathname.startsWith("/gifts") ? "page" : undefined}
            href="/gifts"
            transitionTypes={[giftsTransition]}
          >
            Gifts
          </Link>
          <Link
            aria-current={pathname === "/cart" ? "page" : undefined}
            href="/cart"
            transitionTypes={["page-turn-forward"]}
          >
            My list <Count size="sm" tone={cartCount ? "tomato" : "ink"} label={`${cartCount} gifts selected`}>{cartCount}</Count>
          </Link>
        </nav>
      </header>
      <JournalThemeSwitcher compact />
    </div>
  );
}
