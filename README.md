# Nevo — Premium Crochet Storefront

**Slogan:** *Made slowly. Kept forever.*

Nevo is a boutique crochet storefront built with Next.js, designed for a premium, calm, handmade brand experience. The site is bilingual (English/Arabic with full RTL support), showcases a product gallery, and lets visitors collect pieces in an inquiry cart before sending a request through the contact form or WhatsApp.

Online payment and checkout are intentionally out of scope for the current phase — the cart exists to prepare an inquiry, not to take an order.

---

## Current status

The public storefront frontend is complete and runs locally against a live Neon PostgreSQL database. Products and testimonials are read from the database, and the contact, custom request, newsletter, and cart forms persist through API routes. The admin CMS is next.

| Area | Status | Notes |
| --- | --- | --- |
| Storefront UI (home, gallery, product detail) | Done | 3 routes, 14 components |
| English/Arabic i18n + RTL | Done | `next-intl`, locale middleware, language switcher |
| Inquiry cart (add, quantity, remove, persistence) | Done | `localStorage`-backed, floating cart dock |
| Design system & responsive layout | Done | Pink/purple palette, Cairo/Almarai Arabic typography |
| Database schema (PostgreSQL + Prisma) | Done | Neon PostgreSQL provisioned, migrated, and seeded (3 projects, 6 testimonials) |
| API routes (inquiries, newsletter, products) | Done | `app/api/*`, Zod validation, pages read via cached `lib/projects.ts` |
| Admin CMS | Not started | |
| CSS animations (scroll reveal, hero, cards) | Done | Pure CSS + IntersectionObserver, no external deps |
| Framer Motion / 3D hero | Not started | No Framer Motion or Three.js installed yet |
| SEO (sitemap, robots, OG, structured data) | Not started | Basic page metadata only |
| Testing / CI | Not started | |
| Production deployment | Not started | Target: Vercel free tier + Neon PostgreSQL |

The near-term roadmap lives in [NEXT_STEPS.md](NEXT_STEPS.md), and the full phased work split in [TEAM_WORK_PLAN.md](TEAM_WORK_PLAN.md).

---

## Tech stack

- **Next.js 16** (App Router, Turbopack) with **React 19**
- **TypeScript** — strict mode enabled
- **Tailwind CSS 4** (CSS-first config via `@theme` + `tailwind.config.ts`)
- **next-intl 4** — locale routing, message loading, navigation helpers
- **PostgreSQL (Neon) + Prisma 6** — production data layer
- **Zod 4** — request validation for the API routes
- **Vercel** — planned frontend hosting

Deliberately excluded for now: Supabase (free-tier inactivity pause), MySQL (replaced by Neon PostgreSQL), online payments, checkout, order tracking.

---

## What works today

- **Home page** (`/[locale]`) — hero, featured gallery, about/values, process, FAQ, newsletter, contact
- **Gallery** (`/[locale]/gallery`) — filter by collection, sort by featured/latest/name, add to cart
- **Product detail** (`/[locale]/products/[slug]`) — localized product content, palette, add to cart
- **Inquiry cart** — floating dock, quantity controls, removal, `localStorage` persistence, add confirmation feedback
- **Bilingual UI** — full English and Arabic translations for every string, RTL layout, Arabic fonts and typography rules
- **Contact forms** — "Ask a question" and "Request a custom piece" tabs, newsletter signup (submission is client-side only; nothing is stored or emailed yet)

---

## Project structure

```
app/
  layout.tsx                 # Root layout (fonts, cart provider, locale detection)
  [locale]/
    layout.tsx               # Locale layout (next-intl provider, nav, cart dock, footer)
    page.tsx                 # Storefront homepage
    gallery/page.tsx         # Gallery listing page
    products/[slug]/page.tsx # Dynamic product detail page
  api/
    projects/route.ts        # GET  /api/projects?locale=en
    projects/[slug]/route.ts # GET  /api/projects/:slug?locale=ar
    inquiries/route.ts       # POST /api/inquiries (question, custom request, cart)
    newsletter/route.ts      # POST /api/newsletter (subscriber upsert)
    globals.css              # Tailwind entry + global/RTL typography styles
components/
  LanguageSwitcher.tsx       # EN/AR switch with RTL handoff
  public/                    # Storefront sections (NavBar, Hero, Gallery, CartDock, ...)
i18n/
  routing.ts                 # Locales: en (default), ar
  navigation.ts              # Locale-aware Link/useRouter/usePathname
  request.ts                 # next-intl request config (loads messages/<locale>.json)
lib/
  prisma.ts                  # Prisma client singleton (PostgreSQL via Neon)
  projects.ts                # Cached, localized project/testimonial queries (tags: projects, testimonials)
  validation.ts              # Zod schemas for inquiries and newsletter
  api.ts                     # Route handler helpers (JSON body parsing, error responses)
  supabase.ts                # Deprecated — use prisma.ts instead
messages/
  en.json, ar.json           # UI translations (product/testimonial copy lives in the DB)
types/index.ts               # Shared Project / Testimonial / CartItem types
docs/                        # Database schema and project documents
middleware.ts                # next-intl locale routing (see Known issues)
```

Root-level `mockup.html`, `mockup01.html`, and `local-preview.html` are early design mockups kept for visual reference only — they are not part of the app.

---

## Getting started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000 (redirects to `/en` or `/ar`).

Other scripts:

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # ESLint
```

---

## Environment variables

Copy the placeholder file, then fill in real values once a database exists:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL=postgresql://username:password@host/nevo?sslmode=require
NEXTAUTH_SECRET=replace_with_a_secure_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`DATABASE_URL` is required — every page reads from Neon (pull it with `neon env pull`). `.env.local` is git-ignored; never commit real credentials. For Vercel, set the same variables in the project settings.

---

## Documentation

| Document | Purpose |
| --- | --- |
| [NEXT_STEPS.md](NEXT_STEPS.md) | Actionable roadmap — what to build next, in order |
| [TEAM_WORK_PLAN.md](TEAM_WORK_PLAN.md) | Two-developer work split, phases, and current progress |
| [Cozy_Loops_planning.txt](Cozy_Loops_planning.txt) | Original creative brief: brand, palette, pages, animation direction |
| [docs/UNCONFIRMED_database-schema.md](docs/UNCONFIRMED_database-schema.md) | Prisma/PostgreSQL schema, API contract, validation rules |
| [AGENTS.md](AGENTS.md) | Development conventions for AI coding agents (also read via CLAUDE.md) |

---

## Roadmap

1. **~~Data layer~~** — Neon PostgreSQL provisioned, Prisma migrated and seeded (3 projects, 6 testimonials)
2. **~~API layer~~** — product read APIs, inquiry/newsletter write endpoints with Zod validation; forms wired
3. **Admin CMS** — authenticated admin for products, images, and inquiry management
4. **Polish** — loading/error/not-found states, SEO files, Framer Motion animations, responsive QA, testing
5. **Deploy** — Vercel frontend + Neon PostgreSQL, environment variables, monitoring

Deferred: 3D hero elements, blog, payments/checkout, customer order tracking.

---

## Known issues

- **~~Lint failures~~** — Resolved. `npm run lint` passes with 0 errors and 0 warnings.
- **Middleware deprecation** — Next.js 16 flags `middleware.ts` as deprecated in favor of the `proxy` convention. Migrate with `npx @next/codemod@canary middleware-to-proxy .` (update `i18n` references accordingly).
- **Tailwind config warning** — dev server warns about module type detection for `tailwind.config.ts`; adding `"type": "module"` to `package.json` resolves it.
- **Custom request images are not uploaded** — the file picker works, but files are not sent until image storage lands in Phase 3.
- **No spam protection on public forms** — no rate limiting or honeypot on `/api/inquiries` and `/api/newsletter` yet.
- **Sample imagery** — product images are Unsplash placeholders pending real product photography.

---

## Notes

The project moves in stages on purpose: a polished, low-cost frontend first, then a lightweight PostgreSQL-backed data layer (Neon free tier), then the admin workflow. The architecture is designed to stay small and affordable without depending on Supabase free-tier constraints.
