"use client";

import { Callout, toast } from "@plop-ui/react";
import { useState } from "react";

import { JournalButton, JournalButtonLink, JournalNumberStepper, JournalRadio, JournalRadioGroup, JournalTextField } from "@/components/journal";
import type { SampleGift } from "@/data/sample-gifts";
import { addCartItem } from "@/features/cart/cart";

export function GiftConfigurator({ gift }: { gift: SampleGift }) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  if (gift.availability === "planned") return (
    <Callout tone="info" title="A page saved for later" buddy="preview">
      This gift is still being prepared. You can browse every view, but it cannot be added to your list yet.
    </Callout>
  );

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    gift.optionGroups.forEach((group) => { if (!selections[group.id]) nextErrors[group.id] = `Choose a ${group.label.toLowerCase()} to continue.`; });
    gift.customizationFields.forEach((field) => { if (field.required && !customizations[field.id]?.trim()) nextErrors[field.id] = `Add the ${field.label.toLowerCase()} to continue.`; });
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) { requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-field-id="${firstError}"] input`)?.focus()); return; }
    const result = addCartItem({ giftId: gift.id, title: gift.title, quantity, maxQuantity: gift.maxQuantity, availability: gift.availability, selections, customizations });
    if (!result.added) { toast.error(`${gift.title} is already at its maximum`, { buddy: "error", burst: "drops" }); return; }
    setAdded(true);
    toast.success(`${gift.title} is in your birthday list`, { buddy: "congrats", burst: "hearts" });
  }

  return (
    <form className="gift-configurator" onSubmit={submit} noValidate>
      {gift.optionGroups.map((group) => (
        <div key={group.id} className="gift-configurator__field" data-field-id={group.id}>
          <JournalRadioGroup legend={group.label} name={group.id} value={selections[group.id] ?? ""} onValueChange={(value) => { setSelections((current) => ({ ...current, [group.id]: value })); setErrors((current) => ({ ...current, [group.id]: "" })); }} vertical={false}>
            {group.options.map((option) => <JournalRadio key={option.value} value={option.value} dotColor={option.swatch}>{option.label}</JournalRadio>)}
          </JournalRadioGroup>
          {errors[group.id] && <p className="gift-configurator__error" role="alert">{errors[group.id]}</p>}
        </div>
      ))}
      {gift.customizationFields.map((field) => (
        <div key={field.id} data-field-id={field.id}>
          <JournalTextField label={`${field.label}${field.required ? " (required)" : " (optional)"}`} hint={field.hint} placeholder={field.placeholder} maxLength={field.maxLength} value={customizations[field.id] ?? ""} error={errors[field.id]} onChange={(event) => { const value = event.target.value; setCustomizations((current) => ({ ...current, [field.id]: value })); setErrors((current) => ({ ...current, [field.id]: "" })); }} />
        </div>
      ))}
      <JournalNumberStepper label="Quantity" min={1} max={gift.maxQuantity} value={quantity} onValueChange={setQuantity} seed={`${gift.id}-quantity`} />
      <JournalButton type="submit" intent="romantic" buddy seed={`${gift.id}-add`}>Add to my list</JournalButton>
      {added && <div className="gift-configurator__added" role="status"><span>Saved with your choices.</span><JournalButtonLink href="/cart" transitionTypes={["page-turn-forward"]} variant="plain" size="sm">View my list</JournalButtonLink></div>}
    </form>
  );
}
