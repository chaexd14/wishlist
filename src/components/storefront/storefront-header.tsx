"use client";

import { Count, Doodle } from "@plop-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { LuckyDrawModal } from "@/components/storefront/lucky-draw-modal";
import { readCart, subscribeToCart } from "@/features/cart/cart";
import { openLuckyDrawModal, useLuckyDrawState } from "@/features/lucky-draw/lucky-draw";

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
  const luckyDraw = useLuckyDrawState();

  if (pathname === "/") return null;

  const giftsTransition =
    pathname === "/cart" || pathname.startsWith("/gifts/") ? "page-turn-back" : "page-turn-forward";

  const luckyLabel =
    luckyDraw.stage === "won"
      ? "My Prize"
      : luckyDraw.stage === "choose-game"
        ? "1 Ticket!"
        : luckyDraw.stage === "playing"
          ? `${luckyDraw.triesLeft ?? 0} ${(luckyDraw.triesLeft ?? 0) === 1 ? "Try" : "Tries"}`
          : luckyDraw.stage === "out-of-tries"
            ? "Rematch?"
            : "Lucky Draw";

  return (
    <>
      <div className="storefront-chrome">
        <header className="storefront-header">
          <Link className="storefront-brand" href="/" transitionTypes={["page-peel-back"]}>
            <Doodle kind="heart" tone="tomato" size={34} />
            <span>Your Wish Is My Command</span>
          </Link>
          <nav className="storefront-nav" aria-label="Wish journal">
            {luckyDraw.stage !== "locked" && (
              <button
                type="button"
                className="lucky-draw-pill"
                data-stage={luckyDraw.stage}
                onClick={openLuckyDrawModal}
              >
                <span aria-hidden="true">★</span>
                <span>{luckyLabel}</span>
              </button>
            )}
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
      </div>
      <LuckyDrawModal />
    </>
  );
}
