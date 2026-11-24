import { Doodle } from "@plop-ui/react";
import Image from "next/image";

import { JournalButtonLink, JournalTag } from "@/components/journal";
import { availabilityLabel, availabilityTone, type SampleGift } from "@/data/sample-gifts";

export function GiftCard({ gift }: { gift: SampleGift }) {
  const coverImage = gift.gallery[0]?.imageUrl;
  return (
    <article className="gift-card">
      <div className={`gift-card__art gift-card__art--${gift.tone}${coverImage ? " gift-card__art--photo" : ""}`} aria-hidden="true">
        {coverImage ? (
          <Image
            className="gift-card__photo"
            src={coverImage}
            alt=""
            fill
            sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 30vw"
            unoptimized
          />
        ) : (
          <Doodle kind={gift.doodle} tone={gift.tone} size={86} tilt={-6} />
        )}
      </div>
      <div className="gift-card__body">
        <div className="gift-card__tags">
          <JournalTag tone={availabilityTone[gift.availability]} seed={`${gift.id}-availability`}>{availabilityLabel[gift.availability]}</JournalTag>
          {gift.customizable && <JournalTag tone="bubblegum" seed={`${gift.id}-custom`}>Personalize it</JournalTag>}
        </div>
        <div>
          <h2>{gift.title}</h2>
          <p>{gift.description}</p>
        </div>
        <dl className="gift-card__meta">
          <div><dt>Category</dt><dd>{gift.category}</dd></div>
          <div><dt>Up to</dt><dd>{gift.maxQuantity}</dd></div>
        </dl>
        <JournalButtonLink
          href={`/gifts/${gift.id}`}
          transitionTypes={["page-turn-forward"]}
          variant={gift.availability === "planned" ? "plain" : "periwinkle"}
          seed={`${gift.id}-open`}
        >
          {gift.availability === "planned" ? "Take a peek" : "Pick your details"}
        </JournalButtonLink>
      </div>
    </article>
  );
}
