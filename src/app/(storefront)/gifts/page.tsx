import { Suspense } from "react";

import { JournalContainer, JournalHeading, JournalPageTransition, JournalTag } from "@/components/journal";
import { GiftCatalog } from "@/components/gifts/gift-catalog";
import { GiftCatalogSkeleton } from "@/components/gifts/gift-catalog-skeleton";
import { HandmadeNoticeModal } from "@/components/gifts/handmade-notice-modal";
import { getCatalogGifts } from "@/data/gift-repository";

export default function GiftsPage() {
  return (
    <JournalPageTransition>
      <Suspense fallback={<GiftCatalogSkeleton />}>
        <GiftsContent />
      </Suspense>
    </JournalPageTransition>
  );
}

async function GiftsContent() {
  const gifts = await getCatalogGifts();
  return (
    <main className="catalog-page">
      <JournalContainer>
        <header className="catalog-intro">
          <div>
            <JournalTag tone="mustard" seed="sample-catalog">Your wish is my command</JournalTag>
            <JournalHeading level={1} size="page">Pick what you truly love</JournalHeading>
          </div>
          <p>Take your time exploring everything here and pick all the colors, sizes, and little details that make you smile.</p>
        </header>
        <GiftCatalog gifts={gifts} />
        <HandmadeNoticeModal />
      </JournalContainer>
    </main>
  );
}
