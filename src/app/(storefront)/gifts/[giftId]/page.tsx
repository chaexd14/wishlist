import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  JournalButtonLink,
  JournalContainer,
  JournalHeading,
  JournalPageTransition,
  JournalSheet,
  JournalTag,
} from "@/components/journal";
import { GiftConfigurator } from "@/components/gifts/gift-configurator";
import { GiftGallery } from "@/components/gifts/gift-gallery";
import { availabilityLabel, availabilityTone, getSampleGift, sampleGifts } from "@/data/sample-gifts";

export function generateStaticParams() {
  return sampleGifts.map((gift) => ({ giftId: gift.id }));
}

export default function GiftDetailsPage({ params }: PageProps<"/gifts/[giftId]">) {
  return (
    <JournalPageTransition>
      <Suspense fallback={<GiftDetailsLoading />}>
        <GiftDetails params={params} />
      </Suspense>
    </JournalPageTransition>
  );
}

async function GiftDetails({ params }: { params: Promise<{ giftId: string }> }) {
  const gift = getSampleGift((await params).giftId);
  if (!gift) notFound();

  return (
    <main className="gift-preview-page">
      <JournalContainer width="full">
        <JournalButtonLink href="/gifts" transitionTypes={["page-turn-back"]} variant="plain" size="sm" seed="back-catalog">Back to gifts</JournalButtonLink>
        <div className="gift-detail-layout">
          <GiftGallery title={gift.title} slides={gift.gallery} />
          <JournalSheet tape="bubblegum" spacing="comfortable" className="gift-preview__copy gift-detail-choice">
            <div className="gift-card__tags">
              <JournalTag tone={availabilityTone[gift.availability]}>{availabilityLabel[gift.availability]}</JournalTag>
              {gift.customizable && <JournalTag tone="bubblegum">Customizable</JournalTag>}
            </div>
            <JournalHeading level={1} size="page">{gift.title}</JournalHeading>
            <p>{gift.description}</p>
            <dl className="gift-detail-meta"><div><dt>Category</dt><dd>{gift.category}</dd></div><div><dt>Maximum</dt><dd>{gift.maxQuantity}</dd></div></dl>
            <GiftConfigurator gift={gift} />
          </JournalSheet>
          <JournalSheet tape="mustard" spacing="comfortable" className="gift-about">
            <h2>About this gift</h2>
            <ul>{gift.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            <p>These are illustrative choices for now. The real item and photos can be swapped in later without changing her saved selections.</p>
          </JournalSheet>
        </div>
      </JournalContainer>
    </main>
  );
}

function GiftDetailsLoading() {
  return (
    <main className="gift-preview-page">
      <JournalContainer width="full">
        <JournalSheet tape="bubblegum" spacing="roomy" className="gift-preview">
          <p role="status">Opening this gift page…</p>
        </JournalSheet>
      </JournalContainer>
    </main>
  );
}
