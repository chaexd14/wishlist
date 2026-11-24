"use client";

import { Doodle, SearchField } from "@plop-ui/react";
import { useMemo, useState } from "react";

import { JournalButton } from "@/components/journal";
import type { SampleGift } from "@/data/sample-gifts";
import { GiftCard } from "./gift-card";

const categories = ["All", "Journaling", "Reading Accessories", "Bookmarks", "Keepsakes"] as const;

export function GiftCatalog({ gifts: catalogGifts }: { gifts: SampleGift[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const gifts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return catalogGifts.filter((gift) => {
      const matchesCategory = category === "All" || gift.category === category;
      const matchesQuery = !normalized || `${gift.title} ${gift.category} ${gift.description}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [catalogGifts, category, query]);

  return (
    <div className="gift-catalog">
      <div className="gift-catalog__tools">
        <SearchField label="Search the gift journal" placeholder="Find something you love…" value={query} onValueChange={setQuery} />
        <div className="gift-catalog__filters" aria-label="Filter gifts by category">
          {categories.map((item) => (
            <JournalButton key={item} size="sm" intent={category === item ? "primary" : "quiet"} aria-pressed={category === item} onClick={() => setCategory(item)} seed={`category-${item}`}>
              {item}
            </JournalButton>
          ))}
        </div>
      </div>
      <p className="gift-catalog__count" role="status">Showing {gifts.length} {gifts.length === 1 ? "gift" : "gifts"} for you</p>
      {gifts.length ? (
        <div className="gift-grid">{gifts.map((gift) => <GiftCard key={gift.id} gift={gift} />)}</div>
      ) : (
        <div className="gift-catalog__empty">
          <Doodle kind="sparkle" tone="mustard" size={62} />
          <h2>Nothing matched that just yet</h2>
          <p>Try a different word or peek at all the gifts again.</p>
          <JournalButton intent="secondary" onClick={() => { setQuery(""); setCategory("All"); }} seed="clear-catalog">See all gifts</JournalButton>
        </div>
      )}
    </div>
  );
}
