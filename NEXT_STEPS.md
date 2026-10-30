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

- [ ] Admin authentication (credential + session flow) and protected admin routes
- [ ] Admin layout and sidebar navigation
- [ ] Project management: list, add/edit/delete, featured toggle, ordering — call `revalidateTag('projects')` after writes so the storefront cache refreshes
- [ ] Image upload + storage (Cloudinary or S3-compatible; see schema doc)
- [ ] Attach custom-request reference images to inquiries (`InquiryImage`) once upload storage exists
- [ ] Inquiry management: view submissions with cart items, add notes, change status (New → Contacted → Completed)
- [ ] Contact settings (WhatsApp number, email) via `SiteSetting`

**Boundary:** Do not implement online payment, checkout, or customer order tracking in this phase.

---

## Phase 4 — Polish & SEO (Week 6)

- [ ] Add `loading.tsx`, `error.tsx`, and a custom `not-found.tsx`
- [ ] SEO: `sitemap.ts`, `robots.ts`, Open Graph metadata, structured data (Product/FAQ)
- [ ] Replace Unsplash placeholders with real product photography
- [ ] Install and implement Framer Motion entrance/scroll animations
- [ ] Evaluate the planned 3D hero (Three.js / React Three Fiber) — decide scope or defer
- [ ] Responsive QA across mobile/tablet/desktop; verify RTL on every page
- [ ] Fix known issues in [README.md](README.md#known-issues) (middleware → proxy migration, Tailwind module warning)
- [ ] Accessibility pass (focus states, contrast, aria on cart/FAQ)

---

## Phase 5 — Testing & Deployment (Week 7–8)

- [ ] Testing setup (unit + integration; E2E last)
- [ ] Lighthouse pass — target 90+, FCP < 1.5s on mobile
- [ ] Deploy frontend to Vercel; connect Neon PostgreSQL and set env vars
- [ ] Production migration (`npx prisma migrate deploy`)
- [ ] Email notifications for new inquiries (Resend/SendGrid)
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
4. **Image storage** — Cloudinary or S3-compatible?
5. **Deployment target date?**
6. **WhatsApp number and contact email** — real values to replace placeholders?
