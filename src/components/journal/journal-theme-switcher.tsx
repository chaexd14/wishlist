"use client";

import { JOURNAL_PALETTES } from "./journal-palette";
import { useJournalPalette } from "./journal-provider";

export function JournalThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { palette, setPalette } = useJournalPalette();

  return (
    <fieldset className={`palette-switcher${compact ? " palette-switcher--compact" : ""}`}>
      <legend>{compact ? "Journal color" : "Try another journal palette"}</legend>
      <div className="palette-switcher__options">
        {JOURNAL_PALETTES.map((option) => (
          <label className="palette-option" key={option.value}>
            <input
              type="radio"
              name={compact ? "storefront-palette" : "lab-palette"}
              value={option.value}
              checked={palette === option.value}
              onChange={() => setPalette(option.value)}
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
