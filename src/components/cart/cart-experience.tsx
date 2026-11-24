"use client";

import { Doodle } from "@plop-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

import { JournalButton, JournalButtonLink, JournalHeading, JournalNumberStepper, JournalSheet, JournalTag } from "@/components/journal";
import { getSampleGift } from "@/data/sample-gifts";
import { CART_KEY, parseCart, removeCartItem, subscribeToCart, updateCartQuantity } from "@/features/cart/cart";

function getSnapshot() { return localStorage.getItem(CART_KEY) ?? "[]"; }

export function CartExperience() {
  const snapshot = useSyncExternalStore(subscribeToCart, getSnapshot, () => "[]");
  const items = useMemo(() => parseCart(snapshot), [snapshot]);
  const total = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!items.length) return (
    <JournalSheet tape="bubblegum" spacing="roomy" className="cart-empty">
      <Doodle kind="heart" tone="bubblegum" size={92} />
      <JournalHeading level={1} size="section">Your wishlist is waiting for your favorites</JournalHeading>
      <p>Pick anything that catches your eye and I&apos;ll keep it right here for you.</p>
      <JournalButtonLink href="/gifts" transitionTypes={["page-turn-back"]} variant="periwinkle">Explore gift ideas</JournalButtonLink>
    </JournalSheet>
  );

  return (
    <div className="cart-layout">
      <section className="cart-list" aria-labelledby="cart-title">
        <div className="cart-list__heading"><JournalHeading id="cart-title" level={1} size="section">My wishlist</JournalHeading><JournalTag tone="bubblegum">{total} selected</JournalTag></div>
        {items.map((item) => {
          const itemImage = item.imageUrl ?? getSampleGift(item.giftId)?.gallery[0]?.imageUrl;
          return (
          <JournalSheet key={item.id} spacing="compact" tape="mint" className="cart-item">
            <div className="cart-item__mark" aria-hidden="true">
              {itemImage ? (
                <Image className="cart-item__photo" src={itemImage} alt="" fill sizes="96px" unoptimized />
              ) : (
                <Doodle kind="heart" tone="bubblegum" size={54} />
              )}
            </div>
            <div className="cart-item__copy">
              <h2>{item.title}</h2>
              <dl>{Object.entries(item.selections).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value.replaceAll("-", " ")}</dd></div>)}</dl>
              {Object.entries(item.customizations).filter(([, value]) => value).map(([label, value]) => <p key={label}><strong>{label.replaceAll("-", " ")}:</strong> {value}</p>)}
              <Link href={`/gifts/${item.giftId}`} transitionTypes={["page-turn-back"]}>Change details</Link>
            </div>
            <div className="cart-item__actions">
              <JournalNumberStepper label={`Quantity for ${item.title}`} hideLabel min={1} max={item.maxQuantity} value={item.quantity} size="sm" onValueChange={(value) => updateCartQuantity(item.id, value)} onRemove={() => removeCartItem(item.id)} removeLabel={`Remove ${item.title}`} seed={`${item.id}-quantity`} />
              <JournalButton intent="quiet" size="sm" onClick={() => removeCartItem(item.id)}>Remove</JournalButton>
            </div>
          </JournalSheet>
          );
        })}
      </section>
      <JournalSheet tape="mustard" spacing="comfortable" className="cart-summary">
        <h2>Ready whenever you are</h2><p>{total} lovely {total === 1 ? "pick" : "picks"} waiting for a final look.</p>
        <JournalButtonLink href="/gifts" transitionTypes={["page-turn-back"]} variant="plain">Keep browsing</JournalButtonLink>
        <JournalButtonLink href="/checkout" transitionTypes={["page-turn-forward"]}>Review and send</JournalButtonLink>
        <small>No rush at all—you can tweak any color, size, or note anytime before sending.</small>
      </JournalSheet>
    </div>
  );
}
