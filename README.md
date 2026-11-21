# Birthday Wishlist

A private birthday gift storefront where the recipient can choose gifts, variants,
quantities, and customizations. The admin area turns submitted choices into a
real-world purchase checklist.

## Local setup

1. Copy `.env.example` to `.env.local` if `.env.local` does not already exist.
2. In Supabase, open **Project Settings -> API**.
3. Add the project URL, publishable key, and service-role key to `.env.local`.
4. Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` to client code.
5. Start the app with `npm run dev`.

## Source layout

- `src/app/(storefront)` — public catalog, cart, checkout, and confirmation routes
- `src/app/admin` — private gift management and submitted wishlists
- `src/components` — reusable UI grouped by feature
- `src/features` — feature state, validation, queries, and mutations
- `src/lib/supabase` — browser, server, and server-only admin clients
- `src/lib/env` — validated public and server-only environment values
- `supabase/migrations` — versioned database migrations
- `supabase/seed.sql` — development seed data
- `tests` — unit and end-to-end tests

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
