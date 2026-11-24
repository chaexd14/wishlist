"use client";

import { Callout, Doodle } from "@plop-ui/react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";

import { JournalButton, JournalButtonLink, JournalHeading, JournalSheet, JournalTag, JournalTextArea, JournalTextField } from "@/components/journal";
import { getLuckyDrawPrize } from "@/content/lucky-draw";
import { CART_KEY, clearCart, parseCart, subscribeToCart } from "@/features/cart/cart";
import { useLuckyDrawState } from "@/features/lucky-draw/lucky-draw";
import { getRecentSubmissionSnapshot, parseRecentSubmission, rememberSubmission, subscribeToRecentSubmission } from "@/features/submissions/recent";

function getSnapshot() { return localStorage.getItem(CART_KEY) ?? "[]"; }
function getServerRecentSnapshot() { return ""; }

export function CheckoutExperience() {
  const router = useRouter();
  const snapshot = useSyncExternalStore(subscribeToCart, getSnapshot, () => "[]");
  const items = useMemo(() => parseCart(snapshot), [snapshot]);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const recentSnapshot = useSyncExternalStore(subscribeToRecentSubmission, getRecentSubmissionSnapshot, getServerRecentSnapshot);
  const recent = useMemo(() => parseRecentSubmission(recentSnapshot), [recentSnapshot]);
  const luckyDraw = useLuckyDrawState();
  const wonPrize = luckyDraw.stage === "won" ? getLuckyDrawPrize(luckyDraw.prizeId) : undefined;
  const total = items.reduce((sum, item) => sum + item.quantity, 0);
  const submissionItems = useMemo(() => items.map(({ giftId, quantity, selections, customizations }) => ({ giftId, quantity, selections, customizations })), [items]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length || submitting) return;
    const trimmedNote = note.trim();
    const prizeTag = wonPrize ? `Lucky Draw Prize: ${wonPrize.title}` : "";
    const combinedNote = prizeTag
      ? (trimmedNote ? `${trimmedNote}\n\n${prizeTag}` : prizeTag).slice(0, 500)
      : trimmedNote;
    const currentFingerprint = JSON.stringify({ email: email.trim(), note: combinedNote, items: submissionItems });
    if (recent?.fingerprint === currentFingerprint) {
      router.push(`/confirmation/${recent.id}`);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          note: combinedNote,
          items: submissionItems,
        }),
      });
      const result = await response.json() as { id?: string; reference?: string; error?: string };
      if (!response.ok || !result.id) throw new Error(result.error || "Your wishlist could not be submitted.");
      rememberSubmission({ id: result.id, reference: result.reference ?? "Saved", fingerprint: currentFingerprint });
      clearCart();
      router.push(`/confirmation/${result.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your wishlist could not be submitted. Please try again.");
      setSubmitting(false);
    }
  }

  if (!items.length) return (
    <JournalSheet tape="bubblegum" spacing="roomy" className="checkout-empty">
      <Doodle kind="heart" tone="bubblegum" size={88} />
      <JournalHeading level={1} size="section">Your wishlist is still empty</JournalHeading>
      <p>Pick at least one gift you love first, then come back here to send your list to me.</p>
      {recent && <JournalButtonLink href={`/confirmation/${recent.id}`}>Open my saved confirmation</JournalButtonLink>}
      <JournalButtonLink href="/gifts" transitionTypes={["page-turn-back"]}>Browse gifts</JournalButtonLink>
    </JournalSheet>
  );

  return (
    <div className="checkout-shell">
      <div>
        <JournalButtonLink href="/cart" transitionTypes={["page-turn-back"]} variant="plain" size="sm" seed="back-cart">
          Back to my list
        </JournalButtonLink>
      </div>
      <form className="checkout-layout" onSubmit={submit} noValidate>
      <section className="checkout-review" aria-labelledby="checkout-title">
        <div className="checkout-review__heading">
          <JournalHeading id="checkout-title" level={1} size="section">Review my wishlist</JournalHeading>
          <JournalTag tone="bubblegum">{total} {total === 1 ? "gift" : "gifts"}</JournalTag>
        </div>
        <p>No payment, no prices—just send your favorite picks straight to me and I&apos;ll take care of the rest.</p>
        {items.map((item) => (
          <JournalSheet key={item.id} tape="mint" spacing="compact" className="checkout-item">
            <div><h2>{item.title}</h2><span>Quantity {item.quantity}</span></div>
            <dl>
              {Object.entries(item.selections).map(([key, value]) => <div key={key}><dt>{key.replaceAll("-", " ")}</dt><dd>{value.replaceAll("-", " ")}</dd></div>)}
            </dl>
            {Object.entries(item.customizations).filter(([, value]) => value.trim()).map(([key, value]) => <p key={key}><strong>{key.replaceAll("-", " ")}:</strong> {value}</p>)}
          </JournalSheet>
        ))}
      </section>

      <JournalSheet tape="mustard" spacing="comfortable" className="checkout-note">
        <JournalHeading level={2} size="card">Leave me a little note</JournalHeading>
        {wonPrize && (
          <div className="checkout-prize-banner" role="status">
            <JournalTag tone={wonPrize.tone} seed="checkout-prize-tag">Lucky Draw Prize</JournalTag>
            <strong>{wonPrize.title}</strong>
            <span>Included automatically when you send your wishlist!</span>
          </div>
        )}
        <JournalTextField label="Email (optional)" type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} hint="Optional—just in case you'd like little updates from me." />
        <JournalTextArea label="Note (optional)" value={note} maxLength={500} onChange={(event) => setNote(event.target.value)} hint={`${note.length}/500 characters`} placeholder="Anything else you want me to know—favorite colors, wrapping, or little hints?" />
        {error && <Callout tone="error" title="Oops—your list didn't go through yet" buddy="error">{error}</Callout>}
        <JournalButton type="submit" intent="romantic" size="lg" buddy="peek" disabled={submitting} seed="submit-wishlist">
          {submitting ? "Sending your wishes…" : "Send my wishlist"}
        </JournalButton>
        <small>Everything here is my treat—I&apos;ll save every single detail exactly as you picked it.</small>
      </JournalSheet>
      </form>
    </div>
  );
}
