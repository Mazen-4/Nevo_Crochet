# Next Steps — Nevo Roadmap

> **Status:** The storefront frontend is complete and running locally. Everything below covers the backend/data layer, admin, polish, and launch that are still to be built.
>
> See [README.md](README.md) for the current project status and [TEAM_WORK_PLAN.md](TEAM_WORK_PLAN.md) for the two-developer work split.

---

## Decisions Already Confirmed

- [X] Gallery cart collects items before an inquiry (client-side, `localStorage`)
- [X] No online payment or checkout in the current phase
- [X] Slogan: "Made slowly. Kept forever."
- [X] Pink and purple palette confirmed (`Cozy_Loops_planning.txt`)
- [X] Order tracking reserved for a future phase
- [X] Neon PostgreSQL (not Supabase/MySQL) for the live data model — free tier, no inactivity pause, 0.5 GB
- [X] Frontend on Vercel free tier
- [X] Full English/Arabic bilingual support with RTL

---

## Phase 1 — Data Layer (Next, Week 1–2)

The schema is designed in [`docs/UNCONFIRMED_database-schema.md`](docs/UNCONFIRMED_database-schema.md); it needs to become a real, connected database.

- [X] ~~Add Prisma and create the schema~~ (`prisma/schema.prisma` — PostgreSQL provider)
- [X] ~~Create a Prisma client singleton~~ (`lib/prisma.ts`) and deprecate `lib/supabase.ts`
- [X] ~~Create seed script~~ (`prisma/seed.ts` — 3 projects, EN+AR translations, colors, testimonials)
- [X] ~~Provision a Neon PostgreSQL database~~ (https://neon.tech — free tier, project `young-bird-10422240`)
- [X] ~~Save the connection string securely~~ (`.env` via `neon env pull`, git-ignored)
- [X] ~~Run the initial migration~~ (`npx prisma migrate dev --name init` — `20261030184010_init`)
- [X] ~~Run the seed~~ (`npx prisma db seed` — 3 projects EN+AR, 6 testimonials)
- [X] ~~Confirm local reads against the seeded data~~

**Sync point:** Frontend can pull a product list from the database.

---

## Phase 2 — API Layer (Week 2–3)

Public routes from the schema doc:

- [X] ~~`GET /api/projects?locale=en` — list projects~~
- [X] ~~`GET /api/projects/[slug]?locale=ar` — single project~~
- [X] ~~`POST /api/inquiries` — question + custom request, including cart items (transactional)~~ — image refs wait on image storage (Phase 3)
- [X] ~~`POST /api/newsletter` — subscriber upsert~~
- [X] ~~Add Zod validation~~ (`lib/validation.ts` — email normalization, length limits, quantity 1–99, published-project check, DB-side title/price snapshots)
- [X] ~~Replace `lib/data/site.ts` reads with database-backed fetches~~ (`lib/projects.ts`, cached with tags `projects` / `testimonials`; static file removed)
- [X] ~~Wire the contact form, custom request form, and newsletter form to the new endpoints~~
- [X] ~~Wire the floating cart's "Confirm cart" action to submit the cart as an inquiry~~ (name/email/note form in the cart dock)
- [X] ~~Spam protection for the public POST routes~~ (honeypot `website` field, per-IP in-memory limit 5/10 min, per-email DB limit 5 inquiries/hour)

**Sync point:** A visitor can submit an inquiry that is stored and visible in the database.

---

## Phase 3 — Admin CMS (Week 4–5)

- [X] ~~Admin authentication (credential + session flow) and protected admin routes~~ (`/[locale]/admin`, scrypt + HMAC-signed cookie, no new deps; `npm run admin:create`)
- [X] ~~Admin layout and navigation~~ (header with language switch and sign-out)
- [X] ~~Project management: list, add/edit/delete, featured toggle, ordering~~ (`/[locale]/admin/projects` — EN/AR side-by-side form, shared color labels, image URLs limited to `lib/image-hosts.ts`, writes call `updateTag('projects')`; pieces used by an inquiry can only be archived)
- [X] ~~Image upload + storage — Cloudinary free tier~~ (signed direct uploads from the piece form: `lib/cloudinary.ts` signs folder `nevo/products`, a 2400px size cap and allowed formats; the browser uploads straight to Cloudinary; only this cloud's URLs pass `lib/image-hosts.ts`. Removed photos stay in Cloudinary — clean up from its Media Library if storage ever matters)
- [ ] Attach custom-request reference images to inquiries (`InquiryImage`) once upload storage exists
- [X] ~~Inquiry management: view submissions with cart items, add notes, change status~~ (`/[locale]/admin/inquiries` — status tabs with counts, detail page, reply-by-email, private notes; new-count badge in the header)
- [X] ~~Contact settings (WhatsApp number, email) via `SiteSetting`~~ (`/[locale]/admin/settings`, cached in `lib/settings.ts` under tag `settings`; an empty value hides that line on the site — **real values still need to be entered**)

- [X] ~~Social import from the official Facebook Page and Instagram (one-way, social → site)~~ (`/[locale]/admin/social` inbox; `lib/social/` reads the Meta Graph API with a never-expiring Page token from `npm run meta:setup`, copies photos to Cloudinary `nevo/social`, hides Instagram cross-posts of Facebook posts; "Create draft piece" makes a DRAFT with the Arabic caption + photos for the admin to finish. Initial import done on the `dev` branch: 31 Facebook posts in the inbox, 10 Instagram cross-posts linked)
- [ ] Turn the imported posts into pieces (English text, category, price per piece) and replace the Unsplash samples

**Boundary:** Do not implement online payment, checkout, or customer order tracking in this phase.

---

## Phase 4 — Polish & SEO (Week 6)

- [X] ~~Add `loading.tsx`, `error.tsx`, and a custom `not-found.tsx`~~ (bilingual 404 via `(site)/[...rest]` catch-all, `[locale]/error.tsx` + `global-error.tsx`; `loading.tsx` only in the admin, because storefront streaming would turn real 404s into soft 404s)
- [X] ~~SEO: `sitemap.ts`, `robots.ts`, Open Graph metadata, structured data (Product/FAQ)~~ (canonical + EN/AR hreflang on every page, per-piece SEO fields from the admin, Organization + FAQPage + Product JSON-LD; base URL from `NEXT_PUBLIC_APP_URL` → Vercel production URL → localhost, see `lib/site.ts`)
- [ ] Replace Unsplash placeholders with real product photography
- [ ] Install and implement Framer Motion entrance/scroll animations — **approved**. Keep it light: transform/opacity only (no layout-triggering properties), stagger ≤ 60 ms, IntersectionObserver-triggered one-shot entrance instead of scroll-linked motion, respect `prefers-reduced-motion`. Use `motion/react` only where a CSS transition can't do the job; measure with Lighthouse before merging.
- [ ] Evaluate the planned 3D hero (Three.js / React Three Fiber) — decide scope or defer
- [ ] Responsive QA across mobile/tablet/desktop; verify RTL on every page
- [X] ~~Fix known issues in [README.md](README.md#known-issues) (middleware → proxy migration, Tailwind module warning)~~
- [X] ~~Accessibility pass (focus states, contrast, aria on cart/FAQ)~~ (site-wide `:focus-visible` ring; 3 text colors darkened to pass WCAG AA 4.5:1; cart: `aria-expanded`, announced "added" messages, Escape to close, named Remove buttons, RTL-aware position; FAQ: headings + `inert` collapsed answers; reduced-motion disables smooth scroll). Still worth a manual screen-reader pass on a real device.

---

## Phase 5 — Testing & Deployment (Week 7–8)

- [ ] Testing setup (unit + integration; E2E last) — **approved**. Vitest for unit/integration (Zod schemas, cache-tag logic, admin data helpers), Playwright for the small E2E loop already covered by the scratchpad scripts (`admin/projects`, `admin/settings`, SEO). No Jest, no snapshot tests of HTML.
- [ ] Lighthouse pass — target 90+, FCP < 1.5s on mobile
- [ ] Deploy frontend to Vercel; connect Neon PostgreSQL and set env vars
- [ ] Production migration (`npx prisma migrate deploy`)
- [ ] Social sync in production: add `META_PAGE_ID`, `META_PAGE_TOKEN`, `META_IG_USER_ID` and `CRON_SECRET` to Vercel (the daily cron in `vercel.json` calls `/api/cron/social-sync`), then press "Sync now" once on production
- [ ] Email notifications for new inquiries — **decided: Resend free tier** (3 000 emails / month, 100 / day; one transactional sender, template in both languages)
- [ ] Error tracking (Sentry, optional) and database backups
- [ ] If spam gets through, move the per-IP limit to a shared store (e.g. Upstash Redis free tier) or add Cloudflare Turnstile
- [ ] Launch checklist in [TEAM_WORK_PLAN.md](TEAM_WORK_PLAN.md#-launch-checklist)

---

## Deferred / Future Phase

- Order tracking (inquiry → approved order → status page)
- Blog (care guides, behind the scenes)
- Advanced 3D elements
- Analytics dashboard
- Multi-language expansion beyond EN/AR

---

## Open Questions

Answer before Phase 1 begins:

1. ~~**Database host**~~ — **Neon PostgreSQL** (confirmed)
2. **Domain name** for deployment?
3. **Admin credentials** — who is the admin user?
4. ~~**Image storage**~~ — **Cloudinary free tier** (confirmed)
5. **Deployment target date?**
6. **WhatsApp number and contact email** — real values to replace placeholders?
