---
name: Birthday Wishlist Journal
description: A light paper journal system with lively coordinated colors for choosing personal birthday wishes.
colors:
  espresso: "#35222e"
  cocoa: "#35222e"
  kraft: "#f7eedb"
  cream: "#fff9ec"
  paper: "#ebdcc5"
  sheet: "#fff9ec"
  dusty-rose: "#e9a7b8"
  garden-sage: "#a8d5b5"
  honey: "#f0c85e"
  terracotta: "#c8684a"
  soft-ink: "#624b55"
  focus-oxblood: "#7a3150"
  action-warm: "#a8472f"
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
    backgroundColor: "{colors.action-warm}"
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

- Fixed warm-light paper environment with no dark-mode counterpart.
- Cream paper creates readable work zones within the textured field.
- Sketchpop is the single expressive voice across display, labels, and body copy.
- Important actions read as freshly pressed stickers with soft offset depth.
- Responsive wrappers preserve the material world from 320px phones through desktop.

## Colors

The palette is paper-led and celebratory: plum-espresso ink establishes the journal, a light warm canvas protects readability, and six coordinated spot colors carry meaning and emphasis.

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
- **Soft Ink:** Supporting copy and lower-emphasis labels on the light paper field.

### Named Rules

**The Light-Journal Rule.** Every product surface stays on the same light warm-paper canvas with dark plum-espresso ink. Berry pink is the permanent action and focus palette while the complete spot-color collection remains available for accents; there is no theme switcher or dark mode.

### Palette

- **Shared foundation:** canvas `#F7EEDB`, sheet `#FFF9EC`, muted paper `#EBDCC5`, ink `#35222E`, secondary ink `#624B55`.
- **Shared spot colors:** rose `#E9A7B8`, lilac `#C5B3E6`, sky `#A9D8EA`, mint `#A8D5B5`, honey `#F0C85E`, terracotta `#C8684A`.
- **Permanent action:** berry pink `#A63B67`.
- **Permanent focus:** deep berry `#71304D`.

The recipient uses one permanent berry-pink journal palette; status colors retain their meaning throughout the experience.

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

The standard wrapper is centered at a maximum width of 74rem with 1rem gutters. Narrow reading surfaces may cap at 48rem; full working surfaces may grow to 90rem. The gallery uses a spacious vertical rhythm of `clamp(4rem, 10vw, 8rem)`, allowing the patterned paper field to remain visible between objects.

Sheets carry three spacing modes: compact (`clamp(1rem, 2vw, 1.5rem)`), comfortable (`clamp(1.25rem, 3vw, 2.25rem)`), and roomy (`clamp(1.5rem, 4vw, 3.5rem)`). Content groups use grid for alignment and flex-wrap for sticker rows.

Below 768px, horizontal gutters tighten to 0.625rem per side, two-column forms and feedback become a single column, the intro mark recedes behind the copy, and action buttons expand to nearly the full sheet width. From 768px through 1023px, the intro reserves a compact 9rem mark column while forms remain two-column. At 1024px and above, content uses the full centered composition. The verified captures at phone, iPad portrait, iPad landscape, and desktop preserve the same visual language without horizontal overflow.

**The Tidy-Scrapbook Rule.** Responsive changes rearrange and widen objects; they do not remove the patterned paper field, taped sheets, or sticker identity.

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
- **Background:** Quiet cream sheets over the light patterned field.
- **Shadow Strategy:** Short hard offset in soft brown ink.
- **Border:** Hand-drawn espresso stroke.
- **Internal Padding:** Compact, comfortable, or roomy wrapper spacing; mustard tape by default with semantic spot-color variants.

### Inputs / Fields

- **Style:** Warm cream paper, espresso hand-drawn border, cocoa text, visible external labels, and contextual hint text.
- **Focus:** Dashed deep-berry focus treatment remains visible against both the canvas and cream sheets.
- **Validation:** Recovery copy names the missing detail and the next action. Radios, checkboxes, select, textarea, and number stepper retain conventional semantics.

### Journal Wrapper

`JournalProvider` is the system boundary. It maps the active route to PlopUI's surface (`surface="mat"` cutting mat on `/`, `surface="notebook"` ruled notebook across `/gifts`, `/gifts/[giftId]`, `/cart`, `/checkout`, and `/confirmation/*`, and `surface="kraft"` on utility/lab routes), fixes `theme="light"`, soft sticker shadows, 0.9 roundness, dotted toast backdrops, no sound effects, and system-respecting reduced motion. Feature screens compose through `JournalContainer`, `JournalSheet`, `JournalHeading`, `JournalButton`, and the field wrappers rather than styling raw PlopUI primitives independently.

### UI Lab

`/design-system` is the product's UI Lab. It documents the approved pink-led palette, PlopUI button variants, opt-in burst effects, form controls, navigation, feedback, progress, and journal content pieces. Interactive demonstrations are isolated client components; the surrounding catalog stays server rendered.

### Welcome ritual

The storefront opens on PlopUI's cutting mat surface (`mat`) with no header chrome or theme switcher, focusing attention on a heart-sealed paper envelope rather than a conventional hero. Opening it reveals a stable cream letter, followed by an optional locally saved email and a peelable sticker that reveals the catalog action. The envelope and peel mechanics may use custom paper geometry, while headings, actions, fields, tags, colors, focus, and feedback must come from the shared journal system. Keyboard activation always provides the same outcome as pointer gestures, and reduced motion resolves each state immediately.

### Storefront catalog

Entering `/gifts` transitions the surface to PlopUI's ruled notebook (`notebook`) with a compact journal header, persistent palette switcher, searchable gift index, category stickers, and a responsive collection of paper gift cards. Cards use the shared PlopUI actions, doodles, tags, status language, outlines, and shadows; only the product-art field supplies illustrative spot-color variation. Until the real catalog is provided, every example is explicitly labeled illustrative and remains centralized in typed sample data. The grid presents one column on phones, two on iPad-sized screens, and three on desktop without changing card meaning or interaction order.

### Gift details and list

Each gift opens as a swipeable four-view paper collage paired with a taped configuration sheet. Touch scrolling and position dots lead on phones; thumbnails and previous/next stickers support larger screens. The phone sequence is gallery, choices, then supporting details, while desktop keeps the choice sheet visible beside the collage. Variant groups, customization, quantity, validation, confirmation, and cart editing reuse the journal wrappers and PlopUI controls. Illustrative media remains clearly labeled and may later be replaced by real image URLs without changing the gallery contract.

### Checkout and submission

Checkout is a review-and-send step, never a payment surface. The client sends only gift identifiers, quantities, option keys, and customization values to the server endpoint. Supabase validates those values against the active catalog and writes the submission plus every item snapshot atomically through `submit_wishlist`. Submitted titles, option labels, customization labels, quantities, and descriptions are immutable; later purchase tracking is stored separately from the recipient's snapshot. When Supabase catalog reads are unavailable, storefront browsing may fall back to the explicitly illustrative typed catalog, but submission never falls back to local-only success.

### Page & theme transitions

Route and palette changes use the browser's View Transitions API via React `<ViewTransition>` and `transitionTypes`, with all spatial motion stepping down to a calm `150ms` opacity crossfade under `prefers-reduced-motion`:

- **Cutting mat ↔ Notebook (`page-peel-forward` / `page-peel-back`):** Navigating between `/` and `/gifts` runs a diagonal corner sheet peel (`480ms` enter, `420ms` reverse) so the ruled notebook turns cleanly over the cutting mat.
- **Notebook pages (`page-turn-forward` / `page-turn-back`):** Moving between `/gifts`, `/gifts/[giftId]`, and `/cart` keeps `.storefront-chrome` anchored while turning the notebook sheet underneath (`180ms` exit, `380ms` enter).

## Do's and Don'ts

### Do:

- **Do** begin every feature inside the shared journal provider and responsive container wrappers.
- **Do** reserve cream sheets for dense choice-making and form work while letting the light patterned canvas remain visible between sections.
- **Do** use clear labels, hints, and recovery messages even when the control is playful.
- **Do** keep interactive targets at least 44px and preserve the dashed visible focus treatment.
- **Do** honor system reduced-motion preferences and keep seeded decorative tilts stable.

### Don't:

- **Don't** introduce dark mode, cool white ecommerce cards, glass panels, or neutral gray dashboard chrome.
- **Don't** turn every object into a loud sticker; calm paper surfaces make the active stickers legible.
- **Don't** use spot color as the only status cue or hide form labels inside placeholders.
- **Don't** bypass the journal wrappers with one-off radii, shadows, fonts, or responsive rules.
- **Don't** shrink desktop compositions onto phones; stack fields and widen actions at the established breakpoint.
