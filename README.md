# Nevo Crochet

Nevo is a boutique crochet storefront built with Next.js and designed for a premium, calm, handmade brand experience. The project currently focuses on the public storefront experience, product browsing, and a polished local cart flow before connecting to a real database and production order system.

## Current project status

The app is now aligned to the following direction:

- Frontend hosting on Vercel free tier
- MySQL instead of Supabase for the live data model
- Public storefront landing page and product detail flow
- Local cart interaction for selected products
- Floating cart UI with product confirmation feedback
- General contact form separated from the cart flow

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Vercel deployment
- MySQL for future production data layer

## Current app structure

- `app/page.tsx` — storefront homepage
- `app/products/[slug]/page.tsx` — dynamic product detail view
- `components/public/` — storefront UI sections, navbar, floating cart, contact form
- `lib/data/site.ts` — current sample product catalog and testimonials
- `types/index.ts` — shared storefront types
- `.env.example` and `.env.local` — environment placeholders for app config and MySQL usage

## Local development

Install dependencies:

```bash
npm install
```

Run the local app:

```bash
npm run dev
```

Open http://localhost:3000 in the browser.

## Production build

```bash
npm run build
```

## Deployment approach

The project is intended to deploy on Vercel as a frontend app while using a managed MySQL database for live product and order data.

Important constraints:

- Avoid Supabase free-tier inactivity pause behavior
- Keep the frontend simple and low-cost
- Use MySQL as the long-term production-ready model

## Environment variables

The app currently uses environment placeholders that are ready for future MySQL and app configuration:

```env
DATABASE_URL=mysql://username:password@host:3306/nevo
NEXTAUTH_SECRET=replace_with_a_secure_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For Vercel production, add the same variables in the Vercel project settings under Environment Variables.

## Planned next steps

The near-term roadmap is:

1. Add a real MySQL schema for products and orders
2. Create a small API layer for products and future inquiries
3. Replace static mock catalog data with database-backed content
4. Add invoice/order submission logic for confirmed cart selections
5. Add admin-side product management or CMS-like editing workflow
6. Deploy and validate the full frontend + database workflow on Vercel and a managed MySQL host

## Notes

This project is intentionally moving in stages. The current storefront is already visually polished and working locally, but the live data layer is still planned rather than connected. The architecture is designed to stay lightweight, low-cost, and scalable without depending on Supabase free-tier constraints.
