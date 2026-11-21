# Birthday Wishlist Roadmap

Phase A established the responsive kraft-journal design system, shared PlopUI
wrappers, local fonts, and the internal `/design-system` gallery. The remaining
work will proceed in the following order.

## Phase B — Welcome and gift catalog

- Replace the storefront placeholder with a personal birthday welcome page.
- Add the responsive storefront header, navigation, cart counter, and gift grid.
- Build gift cards with imagery, availability, and clear selection actions.
- Use clearly illustrative sample gifts until the real catalog is supplied.

## Phase C — Gift selection and cart

- Build individual gift pages with data-driven color, size, style, and other variants.
- Add maximum quantities, optional customization, and validation feedback.
- Create a persistent local cart with add, edit, remove, and review interactions.
- Adapt gift details and the cart for phones, iPads, laptops, and desktops.

## Phase D — Supabase database and checkout

- Add migrations for gifts, option groups, option values, submissions, and submission items.
- Seed development gifts and variants without treating examples as real catalog data.
- Validate availability, variants, customization, and quantity limits on the server.
- Build the checkout review and submission endpoint without payment collection.
- Preserve an immutable snapshot of every selected gift and option at submission time.

## Phase E — Confirmation experience

- Present the submitted wishlist as a responsive birthday letter.
- Show the complete gift summary and a safe submission reference.
- Add clear success, recovery, and duplicate-submission handling.
- Optionally notify the creator by email when a wishlist is submitted.

## Phase F — Admin area

- Add Supabase authentication and protect all admin routes.
- Build gift creation, editing, archiving, ordering, and image management.
- Manage option groups, values, quantity limits, and customization instructions.
- Show submitted wishlists as practical purchase checklists.
- Track purchased and gifted status without changing the recipient's submitted snapshot.

## Phase G — Security and production hardening

- Add Supabase row-level security and restrict server-only credentials.
- Protect the recipient experience with a private invitation mechanism.
- Handle unavailable gifts, stale carts, invalid links, missing images, and long content.
- Complete keyboard, focus, contrast, reduced-motion, and error-state audits.

## Phase H — Final polish and deployment

- Run Impeccable critique, responsive audit, polish, and finish review.
- Verify phone, portrait and landscape iPad, laptop, and large-desktop layouts.
- Optimize images, fonts, loading behavior, metadata, and performance.
- Remove or protect `/design-system` after visual approval.
- Configure production Supabase and optional email variables in Vercel.
- Run the complete production workflow from invitation through purchase checklist.

## Phase completion rule

Each phase must pass lint, TypeScript, production build, relevant interaction tests,
and responsive visual verification before the next phase begins.
