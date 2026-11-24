# Birthday Wishlist Roadmap

Phase A established the responsive journal design system, shared PlopUI wrappers,
stable local typography, the permanent berry-pink palette, and the internal
`/design-system` UI Lab with curated components and interaction effects. Phase B
then completed the interactive welcome ritual, responsive illustrative catalog,
swipeable gift details, variant selection, and persistent local cart. The remaining
implementation work begins with the database-backed wishlist submission.

## Phase B1 — Interactive welcome

**Status: complete.**

- Present a heart-sealed envelope, readable birthday letter, optional local email,
  and accessible sticker-peel ritual before entering the catalog.
- Keep personal copy in one typed content module and clearly mark sample wording.
- Preserve welcome progress locally and give returning visitors a catalog shortcut.

## Phase B2 — Storefront shell and gift catalog

**Status: complete.**

- Add the responsive storefront header, navigation, cart counter, and gift grid.
- Build gift cards with imagery, availability, and clear selection actions.
- Use clearly illustrative sample gifts until the real catalog is supplied.

## Phase C — Gift selection and cart

**Status: complete.**

- Build individual gift pages with data-driven color, size, style, and other variants.
- Add maximum quantities, optional customization, and validation feedback.
- Create a persistent local cart with add, edit, remove, and review interactions.
- Adapt gift details and the cart for phones, iPads, laptops, and desktops.

## Phase D — Supabase database and checkout

**Status: complete.**

- Add migrations for gifts, option groups, option values, submissions, and submission items.
- Seed development gifts and variants without treating examples as real catalog data.
- Validate availability, variants, customization, and quantity limits on the server.
- Build the checkout review and submission endpoint without payment collection.
- Preserve an immutable snapshot of every selected gift and option at submission time.
- Apply the Phase D migration and illustrative seed to the connected Supabase project before marking this phase complete.

## Phase E — Confirmation experience

**Status: complete.**

- Present the submitted wishlist as a responsive birthday letter.
- Show the complete gift summary and a safe submission reference.
- Add clear success, recovery, and duplicate-submission handling.
- Keep creator email notification as an optional future integration.

## Phase F — Admin area

**Status: implemented locally; pending first Supabase Auth admin account and live sign-in verification.**

- Add Supabase authentication and protect all admin routes.
- Build gift creation, editing, archiving, ordering, and image management.
- Manage option groups, values, quantity limits, and customization instructions.
- Show submitted wishlists as practical purchase checklists.
- Track purchased and gifted status without changing the recipient's submitted snapshot.

## Phase G — Security and production hardening

**Status: complete locally.**

- Add Supabase row-level security and restrict server-only credentials.
- Protect the recipient experience with a private invitation mechanism.
- Handle unavailable gifts, stale carts, invalid links, missing images, and long content.
- Complete keyboard, focus, contrast, reduced-motion, and error-state audits.

## Phase H — Final polish and deployment

**Status: release candidate complete locally; pending personalized content and Vercel deployment.**

- Run Impeccable critique, responsive audit, polish, and finish review.
- Verify phone, portrait and landscape iPad, laptop, and large-desktop layouts.
- Optimize images, fonts, loading behavior, metadata, and performance.
- Remove or protect `/design-system` after visual approval.
- Configure production Supabase and optional email variables in Vercel.
- Run the complete production workflow from invitation through purchase checklist.

## Phase completion rule

Each phase must pass lint, TypeScript, production build, relevant interaction tests,
and responsive visual verification before the next phase begins.
