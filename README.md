# Birthday Wishlist Journal

A private, responsive birthday journal where one recipient can choose gifts,
variants, quantities, and personalizations. A protected admin workspace turns the
submitted snapshot into a real-world purchase checklist.

## Local setup

1. Copy `.env.example` to `.env.local` and add the Supabase project URL, publishable key, and server-only secret key.
2. Apply `supabase/migrations/202611240001_phase_d_wishlist.sql` in the Supabase SQL Editor.
3. Run `npm run seed:supabase` for the illustrative development catalog.
4. Create a private Supabase Auth user, set `ADMIN_EMAILS`, and keep public signup disabled.
5. Run `npm run dev` and open `http://localhost:3001`.

Never commit `.env.local`, `.env.development.local`, or the Supabase secret key.

## Useful commands

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
npm run test:phase-g
```

The complete test collection lives in `tests/e2e`. Phase E uses temporary live
Supabase submissions and removes them after verification.

## Production deployment

Set these values in Vercel before deploying:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`

`/design-system` returns a not-found response in production unless an allowed
admin is signed in. Search indexing is disabled because this is a private
personal site.

## Source layout

- `src/app/(storefront)` — welcome, catalog, cart, checkout, and confirmation
- `src/app/admin` — authenticated catalog management and purchase checklists
- `src/components` — reusable journal, storefront, checkout, and admin UI
- `src/data` — server-only catalog, submission, and admin repositories
- `src/lib/auth` — admin allowlisting and authentication
- `supabase` — migration, seed data, and setup notes
- `tests/e2e` — responsive workflow and security regressions
