---
name: Birthday Wishlist Journal
description: A warm kraft-paper journal system for choosing and recording personal birthday wishes.
colors:
  espresso: "#4a3026"
  cocoa: "#34221c"
  kraft: "#b8895e"
  cream: "#fff8e8"
  paper: "#f3e1be"
  sheet: "#fffaf0"
  dusty-rose: "#d58b8b"
  garden-sage: "#91a17a"
  honey: "#d5a942"
  terracotta: "#b85c45"
  soft-ink: "#68493d"
  focus-oxblood: "#742f37"
typography:
  display:
    fontFamily: "Sketchpop, Segoe Print, Comic Sans MS, cursive"
    fontSize: "clamp(2.65rem, 8vw, 5.7rem)"
    fontWeight: 900
    lineHeight: 0.96
    letterSpacing: "-0.025em"
  section:
    fontFamily: "Sketchpop, Segoe Print, Comic Sans MS, cursive"
    fontSize: "clamp(2rem, 4.5vw, 3.35rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Sketchpop, Segoe Print, Comic Sans MS, cursive"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  sticker: "23.4px 18px 25.2px 16.2px / 18px 25.2px 16.2px 23.4px"
  face: "18px 12.6px 19.8px 11.7px / 12.6px 19.8px 11.7px 18px"
  box: "12.6px 9px 14.4px 9.9px / 9.9px 14.4px 9px 12.6px"
spacing:
  xs: "0.75rem"
  sm: "1rem"
  md: "1.25rem"
  lg: "1.5rem"
  xl: "2.25rem"
  section: "clamp(4rem, 10vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.cream}"
    typography: "{typography.body}"
    rounded: "{rounded.sticker}"
    padding: "12px 22px"
    height: "44px"
  button-romantic:
    backgroundColor: "{colors.dusty-rose}"
    textColor: "{colors.cocoa}"
    typography: "{typography.body}"
    rounded: "{rounded.sticker}"
    padding: "12px 22px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.honey}"
    textColor: "{colors.cocoa}"
    typography: "{typography.body}"
    rounded: "{rounded.sticker}"
    padding: "12px 22px"
    height: "44px"
  field:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.cocoa}"
    typography: "{typography.body}"
    rounded: "{rounded.box}"
    padding: "12px 16px"
    height: "44px"
  sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.cocoa}"
    rounded: "{rounded.box}"
    padding: "clamp(1.25rem, 3vw, 2.25rem)"
---

# Design System: Birthday Wishlist Journal

## Overview

**Creative North Star: "The Keepsake Wish Journal"**

The interface feels like a private journal assembled by hand for one person. Kraft paper is the continuous field; taped cream sheets are the calm working surfaces; espresso marks behave like ink; dusty rose, sage, honey, and terracotta arrive as restrained spot colors. The result is affectionate and tactile without compromising the clarity of familiar controls.

PlopUI supplies the hand-drawn edges, sticker silhouettes, paper textures, and short moments of response. The application wrapper keeps that personality disciplined: warm light is fixed, headings render as stable semantic text, controls remain conventional in meaning, and responsive layout tidies the scrapbook composition instead of shrinking it indiscriminately.

**Key Characteristics:**

- Fixed warm-light kraft environment with no dark-mode counterpart.
- Cream paper creates readable work zones within the textured field.
- Sketchpop is the single expressive voice across display, labels, and body copy.
- Important actions read as freshly pressed stickers with soft offset depth.
- Responsive wrappers preserve the material world from 320px phones through desktop.

## Colors

The palette is low-chroma, warm, and material-led: brown ink and kraft establish the journal, cream protects readability, and four printed spot colors carry meaning and emphasis.

### Primary

- **Espresso Ink:** The principal action fill, drawn border, and strong mark color.
- **Kraft Field:** The permanent page background and source of the scrapbook atmosphere.

### Secondary

- **Dusty Rose:** Romantic actions, selected details, and affectionate tape or sticker accents.
- **Garden Sage:** Success, availability, and calm positive feedback.
- **Honey Print:** Secondary actions, limits, warnings, and the default tape accent.
- **Terracotta Mark:** Destructive actions, attention states, doodles, and drawn underlines.

### Neutral

- **Cocoa Copy:** Primary reading text and text placed on pale spot colors.
- **Warm Cream:** Button outlines, light controls, and high-contrast text on dark fills.
- **Quiet Sheet:** The slightly cleaner cream used for taped working surfaces.
- **Soft Ink:** Supporting copy and lower-emphasis labels on the kraft field.

### Named Rules

**The Light-Journal Rule.** Every product surface stays in a light scrapbook presentation. Coffee Brown is the default; Light Pink, Light Purple, and Sky Blue reuse the same semantic ink, paper, accent, and status roles without introducing dark mode.

### Palette collection

- **Coffee Brown:** kraft `#B8895E`, cocoa `#34221C`, cream `#FFFAF0`, dusty rose `#D58B8B`, honey `#D5A942`.
- **Light Pink:** blush `#E8B8C3`, berry ink `#4A2834`, cream `#FFF8F8`, rose `#C86F8B`, pale rose `#E8A7B9`.
- **Light Purple:** lilac `#C9B8DD`, plum ink `#372A4A`, cream `#FCF8FF`, violet `#9A79C3`, pale violet `#D7B8E8`.
- **Sky Blue:** sky `#B8D9E8`, ocean ink `#243B4A`, cream `#F7FCFF`, blue `#659FBE`, pale blue `#A7D1E7`.

The recipient may change palettes. The choice is stored in a cookie and applied before paint; status colors retain their meaning in every palette.

**The Printed-Spot Rule.** Rose, sage, honey, and terracotta communicate purpose in concert with words and icons; color never carries status alone.

## Typography

**Display Font:** Sketchpop (with Segoe Print, Comic Sans MS, and cursive fallbacks)  
**Body Font:** Sketchpop (with Segoe Print, Comic Sans MS, and cursive fallbacks)

**Character:** One hand-drawn family makes the experience feel authored rather than merchandised. Weight, scale, case, spacing, and calm cream surfaces create hierarchy without introducing a contrasting corporate typeface.

### Hierarchy

- **Page Display** (900, fluid 2.65–5.7rem, 0.96 line-height): the first journal statement; keep to approximately 18 characters per line, balance wrapping, and never split it into animated character spans.
- **Section Heading** (900, fluid 2–3.35rem, 1 line-height): names major working groups and carries the terracotta scribble treatment.
- **Card Heading** (900, fluid 1.5–2rem, 1.05 line-height): concise empty-state and container titles.
- **Body** (400, 19px base, 1.55 line-height): instructions and help text; long reading lines stop near 65 characters.
- **Label** (700, 13–15px, uppercase where supplied by PlopUI): field names, tags, and compact actions.

### Named Rules

**The One-Hand Rule.** Sketchpop is the shipped voice for display and utility copy alike; hierarchy comes from weight and scale, not a second family.

**The Short-Headline Rule.** Heavy display lettering stays concise and balanced so its irregular forms remain legible on phones.

## Layout

The standard wrapper is centered at a maximum width of 74rem with 1rem gutters. Narrow reading surfaces may cap at 48rem; full working surfaces may grow to 90rem. The gallery uses a spacious vertical rhythm of `clamp(4rem, 10vw, 8rem)`, allowing the kraft field to remain visible between paper objects.

Sheets carry three spacing modes: compact (`clamp(1rem, 2vw, 1.5rem)`), comfortable (`clamp(1.25rem, 3vw, 2.25rem)`), and roomy (`clamp(1.5rem, 4vw, 3.5rem)`). Content groups use grid for alignment and flex-wrap for sticker rows.

Below 768px, horizontal gutters tighten to 0.625rem per side, two-column forms and feedback become a single column, the intro mark recedes behind the copy, and action buttons expand to nearly the full sheet width. From 768px through 1023px, the intro reserves a compact 9rem mark column while forms remain two-column. At 1024px and above, content uses the full centered composition. The verified captures at phone, iPad portrait, iPad landscape, and desktop preserve the same visual language without horizontal overflow.

**The Tidy-Scrapbook Rule.** Responsive changes rearrange and widen objects; they do not remove the kraft field, taped sheets, or sticker identity.

## Elevation & Depth

Depth is structural but deliberately shallow. Cream sheets and stickers use opaque paper fills, dark drawn outlines, and hard offset brown shadows rather than glass, blur, or photorealistic lighting. The provider's soft sticker shadow is the default, while pressed states reduce the offset to imply physical contact.

### Shadow Vocabulary

- **Soft Sticker Ink** (`rgb(70 42 28 / 20%)`): default offset shadows under controls and sheets.
- **Strong Sticker Ink** (`rgb(70 42 28 / 32%)`): higher-emphasis separation where the PlopUI primitive calls for it.
- **Field Shadow** (`3px 4px 0` to `5px 7px 0` in soft sticker ink): the characteristic hard-edged lift for paper objects.

### Named Rules

**The Paper-Stack Rule.** Create depth with fill, outline, tape, and a short opaque offset; never use glassmorphism or diffuse floating-card shadows.

## Shapes

Shapes are intentionally imperfect but controlled. PlopUI's sticker, face, and box radii use different corner values on each side, scaled globally to 90% roundness. Controls use 2.5–3px ink strokes; tags have clipped tape ends; feedback blocks use torn-paper edges; sheets use subtly uneven box corners. Stable seeded tilts make stickers feel placed by hand without causing visual jitter. Static irregularity carries the handmade character; SVG-filter boiling is not used as ambient motion.

**The Useful-Wobble Rule.** Irregularity belongs to silhouettes, strokes, and fixed tilts; alignment, reading order, and hit areas remain stable.

## Components

### Buttons

- **Shape:** Asymmetric sticker silhouette with a cream keyline and short brown offset shadow; minimum height is 44px.
- **Primary:** Espresso fill with cream lettering for the default committed action.
- **Romantic:** Dusty rose with cocoa lettering for affectionate, recipient-facing moments.
- **Secondary:** Honey with cocoa lettering for editing and supportive actions.
- **Quiet / Danger:** Cream and terracotta respectively; quiet preserves the sticker outline, danger remains explicit in its label.
- **Hover / Focus / Active:** Hover uses a short 160ms lift without filter boiling; active compresses the shadow; keyboard focus is a 3px dashed oxblood outline offset by 4px. Loading and disabled states keep their footprint and readable label.

### Tags

- **Style:** Compact tape labels with clipped ends, uppercase lettering, and spot-color fills.
- **State:** Rose, sage, honey, pale rose, and terracotta map to picked, available, limited, customizable, and attention examples, always paired with text.

### Cards / Containers

- **Corner Style:** Gently uneven box silhouette at 90% PlopUI roundness.
- **Background:** Quiet cream sheets over the kraft field.
- **Shadow Strategy:** Short hard offset in soft brown ink.
- **Border:** Hand-drawn espresso stroke.
- **Internal Padding:** Compact, comfortable, or roomy wrapper spacing; mustard tape by default with semantic spot-color variants.

### Inputs / Fields

- **Style:** Warm cream paper, espresso hand-drawn border, cocoa text, visible external labels, and contextual hint text.
- **Focus:** Dashed oxblood focus treatment remains visible against both kraft and cream.
- **Validation:** Recovery copy names the missing detail and the next action. Radios, checkboxes, select, textarea, and number stepper retain conventional semantics.

### Journal Wrapper

`JournalProvider` is the system boundary. It fixes `surface="kraft"`, `theme="light"`, soft sticker shadows, 0.9 roundness, dotted toast backdrops, no paint or sound effects, and system-respecting reduced motion. Feature screens compose through `JournalContainer`, `JournalSheet`, `JournalHeading`, `JournalButton`, and the field wrappers rather than styling raw PlopUI primitives independently.

### UI Lab

`/design-system` is the product's UI Lab. It documents the approved palette collection, PlopUI button variants, opt-in burst effects, form controls, navigation, feedback, progress, and journal content pieces. Interactive demonstrations are isolated client components; the surrounding catalog stays server rendered.

## Do's and Don'ts

### Do:

- **Do** begin every feature inside the shared journal provider and responsive container wrappers.
- **Do** reserve cream sheets for dense choice-making and form work while letting kraft remain visible between sections.
- **Do** use clear labels, hints, and recovery messages even when the control is playful.
- **Do** keep interactive targets at least 44px and preserve the dashed visible focus treatment.
- **Do** honor system reduced-motion preferences and keep seeded decorative tilts stable.

### Don't:

- **Don't** introduce dark mode, cool white ecommerce cards, glass panels, or neutral gray dashboard chrome.
- **Don't** turn every object into a loud sticker; calm paper surfaces make the active stickers legible.
- **Don't** use spot color as the only status cue or hide form labels inside placeholders.
- **Don't** bypass the journal wrappers with one-off radii, shadows, fonts, or responsive rules.
- **Don't** shrink desktop compositions onto phones; stack fields and widen actions at the established breakpoint.
