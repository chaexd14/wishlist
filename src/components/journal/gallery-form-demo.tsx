"use client";

import { useState } from "react";

import {
  JournalCheckbox,
  JournalNumberStepper,
  JournalRadio,
  JournalRadioGroup,
  JournalSelect,
  JournalTextArea,
  JournalTextField,
} from "@/components/journal";

const colorOptions = [
  { value: "rose", label: "Dusty rose", lead: { dot: "bubblegum" as const } },
  { value: "sage", label: "Garden sage", lead: { dot: "mint" as const } },
  { value: "honey", label: "Honey yellow", lead: { dot: "mustard" as const } },
];

export function GalleryFormDemo() {
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState<string | null>("rose");

  return (
    <div className="gallery-form-grid">
      <JournalTextField
        label="Name for the customization"
        placeholder="How it should be written"
        hint="We will copy this exactly when ordering."
      />
      <JournalSelect
        label="Favorite color"
        options={colorOptions}
        value={color}
        onValueChange={setColor}
        hint="Choose the color you would reach for first."
      />
      <JournalTextArea
        className="gallery-form-grid__wide"
        label="A note about your perfect version"
        placeholder="Size, engraving, fabric, or any detail that matters…"
        hint="You can be as specific as you like."
        rows={4}
      />
      <JournalRadioGroup legend="Preferred finish" defaultValue="matte" name="finish">
        <JournalRadio value="matte" dotColor="var(--plop-bubblegum)">Matte and soft</JournalRadio>
        <JournalRadio value="glossy" dotColor="var(--plop-mustard)">Glossy and bright</JournalRadio>
      </JournalRadioGroup>
      <div className="gallery-quantity">
        <JournalNumberStepper
          label="Quantity"
          min={1}
          max={3}
          value={quantity}
          onValueChange={setQuantity}
          seed="gallery-quantity"
        />
        <p>Maximum three for this gift.</p>
      </div>
      <div className="gallery-checks">
        <JournalCheckbox defaultChecked>Gift wrap this one</JournalCheckbox>
        <JournalCheckbox>Surprise me with the shade</JournalCheckbox>
      </div>
    </div>
  );
}
