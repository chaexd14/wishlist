"use client";

import { useMemo, useState } from "react";

import { JournalButton } from "@/components/journal";

import { saveGift } from "@/app/admin/actions";

type Option = { value: string; label: string; swatch: string | null };
type Group = { key: string; label: string; required: boolean; options: Option[] };
type Customization = { key: string; label: string; hint: string; placeholder: string; required: boolean; maxLength: number };
type GallerySlide = { id: string; label: string; caption: string; doodle: string; tone: string; imageUrl?: string };
export type GiftAdminValue = { id: string; title: string; category: string; description: string; availability: string; maxQuantity: number; sortOrder: number; doodle: string; tone: string; details: string[]; gallery: GallerySlide[]; optionGroups: Group[]; customizations: Customization[] };

const emptyGift: GiftAdminValue = { id: "", title: "", category: "Accessories", description: "", availability: "available", maxQuantity: 1, sortOrder: 0, doodle: "heart", tone: "bubblegum", details: [""], gallery: [], optionGroups: [], customizations: [] };

export function GiftAdminForm({ initialValue }: { initialValue?: GiftAdminValue }) {
  const [gift, setGift] = useState(initialValue ?? emptyGift);
  const payload = useMemo(() => JSON.stringify({ ...gift, details: gift.details.map((value) => value.trim()).filter(Boolean), optionGroups: gift.optionGroups.filter((group) => group.key && group.label).map((group) => ({ ...group, options: group.options.filter((option) => option.value && option.label) })), customizations: gift.customizations.filter((field) => field.key && field.label), gallery: gift.gallery.filter((slide) => slide.id && slide.label) }), [gift]);
  const set = <K extends keyof GiftAdminValue>(key: K, value: GiftAdminValue[K]) => setGift((current) => ({ ...current, [key]: value }));

  return <form action={saveGift} className="admin-editor">
    <input type="hidden" name="payload" value={payload} />
    <section className="admin-editor__section">
      <h2>Gift details</h2>
      <div className="admin-form-grid">
        <label>Slug<input className="admin-input" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" disabled={Boolean(initialValue)} value={gift.id} onChange={(e) => set("id", e.target.value)} /></label>
        <label>Title<input className="admin-input" required value={gift.title} onChange={(e) => set("title", e.target.value)} /></label>
        <label>Category<select className="admin-input" value={gift.category} onChange={(e) => set("category", e.target.value)}>{["Accessories", "Keepsakes", "Cozy things", "Creative"].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Availability<select className="admin-input" value={gift.availability} onChange={(e) => set("availability", e.target.value)}><option value="available">Available</option><option value="limited">Limited</option><option value="planned">Planned</option></select></label>
        <label>Maximum quantity<input className="admin-input" type="number" min="1" max="99" value={gift.maxQuantity} onChange={(e) => set("maxQuantity", Number(e.target.value))} /></label>
        <label>Sort order<input className="admin-input" type="number" min="0" value={gift.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} /></label>
        <label>Doodle<input className="admin-input" value={gift.doodle} onChange={(e) => set("doodle", e.target.value)} /></label>
        <label>Tone<input className="admin-input" value={gift.tone} onChange={(e) => set("tone", e.target.value)} /></label>
        <label className="admin-form-grid__wide">Description<textarea className="admin-input" rows={3} required value={gift.description} onChange={(e) => set("description", e.target.value)} /></label>
        <label className="admin-form-grid__wide">Detail bullets<textarea className="admin-input" rows={4} value={gift.details.join("\n")} onChange={(e) => set("details", e.target.value.split("\n"))} /><small>One detail per line.</small></label>
      </div>
    </section>

    <section className="admin-editor__section"><div className="admin-section-heading"><div><h2>Variants</h2><p>Colors, sizes, finishes, and their available values.</p></div><JournalButton intent="secondary" onClick={() => set("optionGroups", [...gift.optionGroups, { key: "", label: "", required: true, options: [] }])}>Add variant</JournalButton></div>
      {gift.optionGroups.map((group, groupIndex) => <div className="admin-repeat-card" key={groupIndex}>
        <div className="admin-form-grid"><label>Key<input className="admin-input" value={group.key} onChange={(e) => { const next = [...gift.optionGroups]; next[groupIndex] = { ...group, key: e.target.value }; set("optionGroups", next); }} /></label><label>Label<input className="admin-input" value={group.label} onChange={(e) => { const next = [...gift.optionGroups]; next[groupIndex] = { ...group, label: e.target.value }; set("optionGroups", next); }} /></label></div>
        <label className="admin-check"><input type="checkbox" checked={group.required} onChange={(e) => { const next = [...gift.optionGroups]; next[groupIndex] = { ...group, required: e.target.checked }; set("optionGroups", next); }} /> Required choice</label>
        {group.options.map((option, optionIndex) => <div className="admin-option-row" key={optionIndex}>{(["value", "label", "swatch"] as const).map((key) => <label key={key}>{key}<input className="admin-input" value={option[key] ?? ""} onChange={(e) => { const next = [...gift.optionGroups]; const options = [...group.options]; options[optionIndex] = { ...option, [key]: e.target.value || (key === "swatch" ? null : "") }; next[groupIndex] = { ...group, options }; set("optionGroups", next); }} /></label>)}<JournalButton intent="quiet" onClick={() => { const next = [...gift.optionGroups]; next[groupIndex] = { ...group, options: group.options.filter((_, i) => i !== optionIndex) }; set("optionGroups", next); }}>Remove</JournalButton></div>)}
        <div className="admin-row-actions"><JournalButton intent="quiet" onClick={() => { const next = [...gift.optionGroups]; next[groupIndex] = { ...group, options: [...group.options, { value: "", label: "", swatch: null }] }; set("optionGroups", next); }}>Add value</JournalButton><JournalButton intent="danger" onClick={() => set("optionGroups", gift.optionGroups.filter((_, i) => i !== groupIndex))}>Remove variant</JournalButton></div>
      </div>)}
    </section>

    <section className="admin-editor__section"><div className="admin-section-heading"><div><h2>Customization fields</h2><p>Names, initials, inscriptions, and other personal details.</p></div><JournalButton intent="secondary" onClick={() => set("customizations", [...gift.customizations, { key: "", label: "", hint: "", placeholder: "", required: false, maxLength: 60 }])}>Add field</JournalButton></div>
      {gift.customizations.map((field, index) => <div className="admin-repeat-card" key={index}><div className="admin-form-grid">{(["key", "label", "hint", "placeholder"] as const).map((key) => <label key={key}>{key}<input className="admin-input" value={field[key]} onChange={(e) => { const next = [...gift.customizations]; next[index] = { ...field, [key]: e.target.value }; set("customizations", next); }} /></label>)}<label>Maximum length<input className="admin-input" type="number" min="1" max="500" value={field.maxLength} onChange={(e) => { const next = [...gift.customizations]; next[index] = { ...field, maxLength: Number(e.target.value) }; set("customizations", next); }} /></label></div><label className="admin-check"><input type="checkbox" checked={field.required} onChange={(e) => { const next = [...gift.customizations]; next[index] = { ...field, required: e.target.checked }; set("customizations", next); }} /> Required</label><JournalButton intent="danger" onClick={() => set("customizations", gift.customizations.filter((_, i) => i !== index))}>Remove field</JournalButton></div>)}
    </section>

    <section className="admin-editor__section"><div className="admin-section-heading"><div><h2>Gallery panels</h2><p>Control the swipeable collage. Add a public image URL or keep the doodle fallback.</p></div><JournalButton intent="secondary" onClick={() => set("gallery", [...gift.gallery, { id: `view-${gift.gallery.length + 1}`, label: "", caption: "", doodle: gift.doodle, tone: gift.tone, imageUrl: "" }])}>Add panel</JournalButton></div>
      {gift.gallery.map((slide, index) => <div className="admin-repeat-card admin-form-grid" key={index}>{(["id", "label", "caption", "imageUrl", "doodle", "tone"] as const).map((key) => <label key={key}>{key === "imageUrl" ? "Image URL (optional)" : key}<input className="admin-input" type={key === "imageUrl" ? "url" : "text"} value={slide[key] ?? ""} onChange={(e) => { const next = [...gift.gallery]; next[index] = { ...slide, [key]: e.target.value }; set("gallery", next); }} /></label>)}<JournalButton intent="danger" onClick={() => set("gallery", gift.gallery.filter((_, i) => i !== index))}>Remove panel</JournalButton></div>)}
    </section>
    <div className="admin-savebar"><JournalButton type="submit" intent="romantic" size="lg">Save gift</JournalButton></div>
  </form>;
}
