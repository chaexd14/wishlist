"use client";

import { Doodle, IconButton } from "@plop-ui/react";
import { useRef, useState } from "react";

import type { GiftGallerySlide } from "@/data/sample-gifts";

export function GiftGallery({ title, slides }: { title: string; slides: GiftGallerySlide[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function goTo(index: number) {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    railRef.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActive(next);
  }

  function updateActive() {
    const rail = railRef.current;
    if (!rail) return;
    const index = Math.round(rail.scrollLeft / Math.max(1, rail.clientWidth));
    setActive(Math.max(0, Math.min(slides.length - 1, index)));
  }

  return (
    <section className="gift-gallery" aria-label={`${title} views`}>
      <div className="gift-gallery__frame">
        <div ref={railRef} className="gift-gallery__rail" onScroll={updateActive} tabIndex={0} onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
        }}>
          {slides.map((slide, index) => (
            <figure key={slide.id} className={`gift-gallery__slide gift-card__art--${slide.tone}`} aria-label={`${slide.label}, image ${index + 1} of ${slides.length}`}>
              <div className="gift-gallery__illustration" aria-hidden="true">
                <span className="gift-gallery__view-label">{slide.label}</span>
                <Doodle kind={slide.doodle} tone={slide.tone} size={index === 0 ? 148 : 118} tilt={index % 2 ? 5 : -5} />
              </div>
              <figcaption>{slide.caption}</figcaption>
            </figure>
          ))}
        </div>
        <div className="gift-gallery__arrows" aria-label="Gallery controls">
          <IconButton icon={<Arrow direction="left" />} label="Previous gift view" size="sm" variant="plain" disabled={active === 0} onClick={() => goTo(active - 1)} />
          <IconButton icon={<Arrow direction="right" />} label="Next gift view" size="sm" variant="plain" disabled={active === slides.length - 1} onClick={() => goTo(active + 1)} />
        </div>
      </div>
      <p className="gift-gallery__status" aria-live="polite">View {active + 1} of {slides.length}: {slides[active].label}</p>
      <div className="gift-gallery__thumbs" aria-label="Choose a gift view">
        {slides.map((slide, index) => (
          <button key={slide.id} type="button" aria-label={`Show ${slide.label}`} aria-pressed={active === index} onClick={() => goTo(index)}>
            <Doodle kind={slide.doodle} tone={slide.tone} size={34} />
            <span>{slide.label}</span>
          </button>
        ))}
      </div>
      <div className="gift-gallery__dots" aria-hidden="true">{slides.map((slide, index) => <span key={slide.id} data-active={active === index || undefined} />)}</div>
    </section>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style={{ transform: direction === "right" ? "rotate(180deg)" : undefined }}><path d="M20 12H5m6-7-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
