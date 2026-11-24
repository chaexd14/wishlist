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
import { GiftDetailsSkeleton } from "@/components/gifts/gift-details-skeleton";
import { GiftGallery } from "@/components/gifts/gift-gallery";
import { getCatalogGift } from "@/data/gift-repository";
import { availabilityLabel, availabilityTone, sampleGifts } from "@/data/sample-gifts";

export function generateStaticParams() {
  return sampleGifts.map((gift) => ({ giftId: gift.id }));
}

export default function GiftDetailsPage({ params }: PageProps<"/gifts/[giftId]">) {
  return (
    <JournalPageTransition>
      <Suspense fallback={<GiftDetailsSkeleton />}>
        <GiftDetails params={params} />
      </Suspense>
    </JournalPageTransition>
  );
}

async function GiftDetails({ params }: { params: Promise<{ giftId: string }> }) {
  const gift = await getCatalogGift((await params).giftId);
  if (!gift) notFound();

  return (
    <main className="gift-preview-page">
      <JournalContainer width="full">
        <JournalButtonLink href="/gifts" transitionTypes={["page-turn-back"]} variant="plain" size="sm" seed="back-catalog">Back to all gifts</JournalButtonLink>
        <div className="gift-detail-layout">
          <GiftGallery title={gift.title} slides={gift.gallery} />
          <JournalSheet tape="bubblegum" spacing="comfortable" className="gift-preview__copy gift-detail-choice">
            <div className="gift-card__tags">
              <JournalTag tone={availabilityTone[gift.availability]}>{availabilityLabel[gift.availability]}</JournalTag>
              {gift.customizable && <JournalTag tone="bubblegum">Personalize it</JournalTag>}
            </div>
            <JournalHeading level={1} size="page">{gift.title}</JournalHeading>
            <p>{gift.description}</p>
            <dl className="gift-detail-meta"><div><dt>Category</dt><dd>{gift.category}</dd></div><div><dt>Up to</dt><dd>{gift.maxQuantity}</dd></div></dl>
            <GiftConfigurator gift={gift} />
          </JournalSheet>
          <JournalSheet tape="mustard" spacing="comfortable" className="gift-about">
            <h2>About this gift</h2>
            <ul>{gift.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            <p>Every color, size, and little note you pick here will be saved just the way you chose it.</p>
          </JournalSheet>
        </div>
      </JournalContainer>
    </main>
  );
}
