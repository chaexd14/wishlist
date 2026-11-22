"use client";

import { Doodle, SearchField } from "@plop-ui/react";
import { useMemo, useState } from "react";

import { JournalButton } from "@/components/journal";
import { sampleGifts } from "@/data/sample-gifts";
import { GiftCard } from "./gift-card";

const categories = ["All", "Accessories", "Keepsakes", "Cozy things", "Creative"] as const;

export function GiftCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const gifts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return sampleGifts.filter((gift) => {
      const matchesCategory = category === "All" || gift.category === category;
      const matchesQuery = !normalized || `${gift.title} ${gift.category} ${gift.description}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="gift-catalog">
      <div className="gift-catalog__tools">
        <SearchField label="Search the gift journal" placeholder="Search sample gifts" value={query} onValueChange={setQuery} />
        <div className="gift-catalog__filters" aria-label="Filter gifts by category">
          {categories.map((item) => (
            <JournalButton key={item} size="sm" intent={category === item ? "primary" : "quiet"} aria-pressed={category === item} onClick={() => setCategory(item)} seed={`category-${item}`}>
              {item}
            </JournalButton>
          ))}
        </div>
      </div>
      <p className="gift-catalog__count" role="status">Showing {gifts.length} illustrative {gifts.length === 1 ? "gift" : "gifts"}</p>
      {gifts.length ? (
        <div className="gift-grid">{gifts.map((gift) => <GiftCard key={gift.id} gift={gift} />)}</div>
      ) : (
        <div className="gift-catalog__empty">
          <Doodle kind="sparkle" tone="mustard" size={62} />
          <h2>No gifts match that note</h2>
          <p>Try another word or return to all categories.</p>
          <JournalButton intent="secondary" onClick={() => { setQuery(""); setCategory("All"); }} seed="clear-catalog">Show every gift</JournalButton>
        </div>
      )}
    </div>
  );
}
