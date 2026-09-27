# Agent Instructions — Nevo Crochet

Guidance for AI coding agents (and new developers) working in this repository. `CLAUDE.md` references this file, so these rules apply there too.

## Project at a glance

Bilingual (EN/AR) premium crochet storefront. Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind CSS 4 + next-intl. **Frontend is complete; the backend (MySQL/Prisma, API routes, admin CMS) does not exist yet** — see [README.md](README.md) for status and [NEXT_STEPS.md](NEXT_STEPS.md) for the ordered roadmap.

## Commands

```bash
npm run dev      # dev server (Turbopack) on http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
npm start        # serve production build
```

No test runner is configured yet. Do not add one without confirming the choice first.

## Hard rules

1. **Never break EN/AR parity.** Every new user-facing string goes into *both* `messages/en.json` and `messages/ar.json` with the same key path. Arabic must read as native Arabic, not machine translation.
2. **Respect RTL.** The app flips direction for `ar`. Use logical spacing already established in components; do not hardcode `left`/`right` positioning for UI that appears on both locales. Arabic typography helpers live in `app/[locale]/globals.css` (`.text-ar`, `.text-ar-title`, `.text-ar-body`, `.text-ar-small`).
3. **Locale-aware navigation only.** Use `Link`, `useRouter`, `usePathname` from `@/i18n/navigation` — never from `next/navigation` directly in components.
4. **Do not invent a backend.** There are no API routes, no database, and no auth yet. Forms intentionally simulate submission client-side. If asked to "wire up" data, follow the schema contract in `docs/UNCONFIRMED_database-schema.md` rather than inventing new shapes.
5. **Do not add payment, checkout, or order tracking.** These are explicitly out of scope for the current phase (client decision).
6. **Keep static data centralized.** Products and testimonials live only in `lib/data/site.ts` plus their translations in `messages/*.json`. When adding a sample product, update both files (and the `colorKeys` maps noted under Known pitfalls).

## Architecture map

| Concern | Location |
| --- | --- |
| Routes (home, gallery, product) | `app/[locale]/page.tsx`, `app/[locale]/gallery/page.tsx`, `app/[locale]/products/[slug]/page.tsx` |
| Locale layout (fonts, provider, nav, cart dock, footer) | `app/[locale]/layout.tsx` |
| Root layout (cart provider, locale detection) | `app/layout.tsx` |
| Storefront components | `components/public/` |
| Inquiry cart state (context + localStorage) | `components/public/InquiryCartProvider.tsx` |
| Locale config / navigation / message loading | `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts` |
| Translations (EN/AR) | `messages/en.json`, `messages/ar.json` |
| Sample catalog + testimonials | `lib/data/site.ts` |
| Shared types | `types/index.ts` |
| Global + RTL styles | `app/[locale]/globals.css` (Tailwind entry, `@config` → `tailwind.config.ts`) |
| Database schema contract | `docs/UNCONFIRMED_database-schema.md` |

## Conventions

- **Styling**: Tailwind utility classes inline. The palette is pink/purple — primary purple `#7b5ca8`, ink `#2f1d36`, background `#fffafc`. Prefer these tokens over new arbitrary colors.
- **Components**: named exports, `"use client"` only when state/browser APIs are required, keep sections server components where possible.
- **Types**: strict mode — no `any`. Shared types belong in `types/index.ts`.
- **Data**: never trust browser-sent prices/titles (per the schema doc's validation rules); cart data is a snapshot.
- **No new dependencies** without asking — especially heavy ones (3D, animation, form libraries are all still *planned*, not installed).
- **Docs**: if your change alters project status, roadmap, or stack, update `README.md` / `NEXT_STEPS.md` in the same change.

## Known pitfalls

- `FeaturedGallery.tsx` maps translated color keys using a positional index trick over hardcoded product IDs; `colorKeys` maps are duplicated in `GalleryExplorer.tsx` and `app/[locale]/products/[slug]/page.tsx`. Touch carefully — or consolidate before adding products.
- `middleware.ts` (next-intl locale routing) is deprecated in Next.js 16 in favor of the `proxy` convention; migration pending (see README "Known issues").
- `lib/supabase.ts` is a misleading leftover name — it only exposes a `DATABASE_URL` placeholder. It will be replaced by a Prisma client singleton.
- Product images are Unsplash placeholders.
- Root-level `mockup*.html` / `local-preview.html` are legacy design mockups, not part of the app.

## Before you finish

- `npm run lint` introduces no **new** errors (pre-existing `react-hooks` failures are listed in README "Known issues") and `npm run build` succeeds.
- EN and AR message files stay in sync.
- Status/roadmap docs reflect any real change you made.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
