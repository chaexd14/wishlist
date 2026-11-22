import { JournalContainer, JournalHeading, JournalPageTransition, JournalTag } from "@/components/journal";
import { GiftCatalog } from "@/components/gifts/gift-catalog";

export default function GiftsPage() {
  return (
    <JournalPageTransition>
      <main className="catalog-page">
        <JournalContainer>
          <header className="catalog-intro">
            <div>
              <JournalTag tone="mustard" seed="sample-catalog">Illustrative catalog</JournalTag>
              <JournalHeading level={1} size="page">Pick what you truly love</JournalHeading>
            </div>
            <p>Browse this sample gift journal for now. Real gifts and photos will replace these examples before the birthday link is shared.</p>
          </header>
          <GiftCatalog />
        </JournalContainer>
      </main>
    </JournalPageTransition>
  );
}
