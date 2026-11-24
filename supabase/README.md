# Supabase setup

Phase D is defined by the timestamped migration in `migrations/` and the illustrative development data in `seed.sql`.

1. Link the project with the Supabase CLI or open the project's SQL editor.
2. Apply `migrations/202611240001_phase_d_wishlist.sql`.
3. Apply `seed.sql` only in development or preview environments.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. The browser never calls the submission RPC directly.

The storefront falls back to the typed illustrative catalog when the database tables are unavailable. Wishlist submission deliberately has no fallback: the database must validate and atomically snapshot every submitted choice.

## Production access

- Set `ADMIN_EMAILS` to the comma-separated Supabase Auth accounts allowed into `/admin`. Do not enable public signup.
- Keep the service/secret key server-only.
