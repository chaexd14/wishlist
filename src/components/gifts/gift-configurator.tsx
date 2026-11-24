"use client";

import { Callout, toast } from "@plop-ui/react";
import { useState } from "react";

import { JournalButton, JournalButtonLink, JournalNumberStepper, JournalRadio, JournalRadioGroup, JournalTextField } from "@/components/journal";
import type { SampleGift } from "@/data/sample-gifts";
import { addCartItem } from "@/features/cart/cart";
import { triggerLuckyDrawIfFirstTime } from "@/features/lucky-draw/lucky-draw";

const COLOR_SLOT_KEYS = ["color-1", "color-2", "color-3", "color-4"] as const;

export function GiftConfigurator({ gift }: { gift: SampleGift }) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [colorCombo, setColorCombo] = useState<string[]>([]);
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  if (gift.availability === "planned") return (
    <Callout tone="info" title="A little surprise in the works" buddy="preview">
      I&apos;m still putting the finishing touches on this one—you can take a peek for now, and it cannot be added to your list yet.
    </Callout>
  );

  const colorSlotGroups = gift.optionGroups.filter((group) => (COLOR_SLOT_KEYS as readonly string[]).includes(group.id));
  const hasColorCombo = colorSlotGroups.length > 1;
  const maxColors = colorSlotGroups.length;
  const colorOptions = colorSlotGroups[0]?.options ?? [];
  const regularOptionGroups = hasColorCombo
    ? gift.optionGroups.filter((group) => !(COLOR_SLOT_KEYS as readonly string[]).includes(group.id))
    : gift.optionGroups;

  function toggleColor(value: string) {
    setColorCombo((current) => {
      if (current.includes(value)) return current.filter((item) => item !== value);
      if (current.length >= maxColors) return current;
      return [...current, value];
    });
    setErrors((current) => ({ ...current, "color-1": "" }));
  }

  function removeColor(value: string) {
    setColorCombo((current) => current.filter((item) => item !== value));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    const finalSelections: Record<string, string> = {};
    if (hasColorCombo) {
      if (colorCombo.length === 0) {
        nextErrors["color-1"] = "Pick at least 1 color for your combo.";
      } else {
        colorCombo.forEach((value, index) => {
          const slotGroup = colorSlotGroups[index];
          if (slotGroup) finalSelections[slotGroup.id] = value;
        });
      }
    }

    regularOptionGroups.forEach((group) => {
      const value = selections[group.id];
      if (value) finalSelections[group.id] = value;
      else if (group.required !== false) nextErrors[group.id] = `Choose a ${group.label.toLowerCase()} to continue.`;
    });

    const finalCustomizations: Record<string, string> = {};
    gift.customizationFields.forEach((field) => {
      const isHiddenTheme = field.id === "theme" && selections.style === "surprise";
      const val = isHiddenTheme ? "" : (customizations[field.id] ?? "").trim();
      if (field.required && !val) nextErrors[field.id] = `Add the ${field.label.toLowerCase()} to continue.`;
      if (val) finalCustomizations[field.id] = val;
    });

    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-field-id="${firstError}"] button, [data-field-id="${firstError}"] input`)?.focus();
      });
      return;
    }

    const result = addCartItem({
      giftId: gift.id,
      title: gift.title,
      imageUrl: gift.gallery[0]?.imageUrl,
      quantity,
      maxQuantity: gift.maxQuantity,
      availability: gift.availability,
      selections: finalSelections,
      customizations: finalCustomizations,
    });
    if (!result.added) {
      toast.error(`You've already picked all the ${gift.title.toLowerCase()}s for your list!`, { buddy: "error", burst: "drops" });
      return;
    }
    setAdded(true);
    toast.success(`Yay! ${gift.title} is on your wishlist`, { buddy: "congrats", burst: "hearts" });
    triggerLuckyDrawIfFirstTime();
  }

  return (
    <form className="gift-configurator" onSubmit={submit} noValidate>
      {hasColorCombo && (
        <fieldset className="color-combo-picker" data-field-id="color-1">
          <div className="color-combo-picker__header">
            <legend>Color combination (pick 1 to {maxColors})</legend>
            <span className="color-combo-picker__count" aria-live="polite">
              {colorCombo.length}/{maxColors} picked
            </span>
          </div>
          <p className="color-combo-picker__hint">
            Pick just 1 favorite color or mix up to {maxColors} shades together!
          </p>

          {colorCombo.length > 0 && (
            <div className="color-combo-picker__selected" aria-label="Selected colors">
              {colorCombo.map((value, index) => {
                const option = colorOptions.find((item) => item.value === value);
                if (!option) return null;
                return (
                  <button
                    key={value}
                    type="button"
                    className="color-combo-chip"
                    onClick={() => removeColor(value)}
                    aria-label={`Remove ${option.label} (color ${index + 1})`}
                  >
                    <span className="color-combo-chip__num" aria-hidden="true">{index + 1}</span>
                    {option.swatch && <span className="color-combo-swatch-dot" style={{ backgroundColor: option.swatch }} aria-hidden="true" />}
                    <span>{option.label}</span>
                    <span className="color-combo-chip__x" aria-hidden="true">×</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="color-combo-picker__grid">
            {colorOptions.map((option) => {
              const selectedIndex = colorCombo.indexOf(option.value);
              const isSelected = selectedIndex !== -1;
              const isMaxed = !isSelected && colorCombo.length >= maxColors;
              return (
                <button
                  key={option.value}
                  type="button"
                  className="color-swatch-button"
                  data-selected={isSelected || undefined}
                  aria-pressed={isSelected}
                  disabled={isMaxed}
                  onClick={() => toggleColor(option.value)}
                >
                  <span
                    className="color-combo-swatch-dot"
                    style={{ backgroundColor: option.swatch ?? "var(--journal-paper)" }}
                    aria-hidden="true"
                  />
                  <span>{option.label}</span>
                  {isSelected && <span className="color-swatch-button__badge" aria-hidden="true">{selectedIndex + 1}</span>}
                </button>
              );
            })}
          </div>
          {errors["color-1"] && <p className="gift-configurator__error" role="alert">{errors["color-1"]}</p>}
        </fieldset>
      )}

      {regularOptionGroups.map((group) => (
        <div key={group.id} className="gift-configurator__field" data-field-id={group.id}>
          <JournalRadioGroup
            legend={group.label}
            name={group.id}
            value={selections[group.id] ?? ""}
            onValueChange={(value) => {
              setSelections((current) => ({ ...current, [group.id]: value }));
              setErrors((current) => ({ ...current, [group.id]: "" }));
            }}
            vertical={false}
          >
            {group.options.map((option) => (
              <JournalRadio key={option.value} value={option.value} dotColor={option.swatch}>{option.label}</JournalRadio>
            ))}
          </JournalRadioGroup>
          {errors[group.id] && <p className="gift-configurator__error" role="alert">{errors[group.id]}</p>}
        </div>
      ))}

      {gift.customizationFields.map((field) => {
        if (field.id === "theme" && selections.style === "surprise") return null;
        return (
          <div key={field.id} data-field-id={field.id}>
            <JournalTextField
              label={`${field.label}${field.required ? " (required)" : " (optional)"}`}
              hint={field.hint}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              value={customizations[field.id] ?? ""}
              error={errors[field.id]}
              onChange={(event) => {
                const value = event.target.value;
                setCustomizations((current) => ({ ...current, [field.id]: value }));
                setErrors((current) => ({ ...current, [field.id]: "" }));
              }}
            />
          </div>
        );
      })}

      <JournalNumberStepper label="Quantity" min={1} max={gift.maxQuantity} value={quantity} onValueChange={setQuantity} seed={`${gift.id}-quantity`} />
      <JournalButton type="submit" intent="romantic" buddy seed={`${gift.id}-add`}>Add to my list</JournalButton>
      {added && (
        <div className="gift-configurator__added" role="status">
          <span>Saved with your choices.</span>
          <JournalButtonLink href="/cart" transitionTypes={["page-turn-forward"]} variant="plain" size="sm">View my list</JournalButtonLink>
        </div>
      )}
    </form>
  );
}
