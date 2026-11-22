"use client";

import type { ChangeEvent } from "react";

import { JOURNAL_PALETTES, type JournalPalette } from "./journal-palette";
import { useJournalPalette } from "./journal-provider";

export function JournalThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { palette, setPalette } = useJournalPalette();

  function handleSelect(nextPalette: JournalPalette, event: ChangeEvent<HTMLInputElement>) {
    const option = event.currentTarget.closest("label");
    const swatch = option?.querySelector<HTMLElement>(".palette-option__swatch") ?? option;
    const rect = swatch?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
    setPalette(nextPalette, origin);
  }

  return (
    <fieldset className={`palette-switcher${compact ? " palette-switcher--compact" : ""}`}>
      <legend>{compact ? "Journal mood" : "Try another journal mood"}</legend>
      <div className="palette-switcher__options">
        {JOURNAL_PALETTES.map((option) => (
          <label className="palette-option" key={option.value}>
            <input
              type="radio"
              name={compact ? "storefront-palette" : "lab-palette"}
              value={option.value}
              checked={palette === option.value}
              onChange={(event) => handleSelect(option.value, event)}
            />
            <span className={`palette-option__swatch palette-option__swatch--${option.value}`} aria-hidden="true" />
            <span>
              <strong>{option.label}</strong>
              {!compact && <small>{option.description}</small>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
