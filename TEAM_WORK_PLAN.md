# Nevo — Team Work Split & Timeline

## 📋 Project Overview

- **Tech Stack**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + next-intl (bilingual EN/AR) + MySQL/Prisma (planned)
- **Deployment**: Vercel free tier (frontend) + managed MySQL host (Railway / PlanetScale / similar)
- **Work Mode**: Parallel development with clear separation of concerns
- **Important constraint**: Avoid Supabase free-tier inactivity pause by using a standard MySQL setup for the live project

**Client decisions:**

- Gallery cart collects items before an inquiry
- No online payment or checkout in the current phase
- Slogan: "Made slowly. Kept forever."
- Pink and purple palette confirmed in `Cozy_Loops_planning.txt`
- Order tracking planned for a future phase
- Full English/Arabic bilingual support with RTL

**Current overall state:** the public storefront frontend is complete and polished (3 routes, 14 components, bilingual, working inquiry cart). The backend — database, API routes, admin CMS — has been designed but not built. Details in [README.md](README.md); actionable next work in [NEXT_STEPS.md](NEXT_STEPS.md).

---

## 📅 Phase-by-Phase Timeline & Work Split

### **Phase 1: Foundation (Week 1–2)** — ✅ Frontend complete, ⬜ Backend outstanding

#### Developer A (Frontend):

- [X]  Set up Next.js project with TypeScript
- [X]  Configure Tailwind CSS and design tokens
- [X]  Create component structure and folder organization
- [X]  Build design system (buttons, cards, typography)
- [ ]  Set up Framer Motion basics
- [X]  Create layout components (NavBar, Footer)
- [X]  Full EN/AR localization with RTL typography (added beyond original scope)

#### Developer B (Backend):

- [ ]  Provision a MySQL database on a free/low-cost host (Railway, PlanetScale, or similar)
- [ ]  Adopt the designed schema (`docs/UNCONFIRMED_database-schema.md`) via Prisma and run the initial migration
- [ ]  Set up admin authentication and session flow in Next.js
- [ ]  Define API endpoints for public and admin data access
- [ ]  Create DB access layer (Prisma client singleton) and shared TypeScript models
- [ ]  Set up environment variables, including the database connection string

**Deliverable**: Frontend structure and design system ✅ / database ready ⬜
**Sync Point**: Ensure the API client works with the frontend before Phase 2 integration

---

### **Phase 2: Public Website (Week 3–5)** — 🟡 Frontend done, ⬜ DB integration outstanding

#### Developer A (Frontend):

- [X]  Build landing page (hero section — static image; 3D element deferred)
- [X]  Create Portfolio/Gallery listing page with filters and sorting
- [X]  Build Work/Product detail page
- [X]  Create About content (in-page section)
- [X]  Build Contact form UI (question + custom request tabs)
- [X]  Add cart controls to gallery and product detail cards
- [X]  Build cart review with quantity changes and item removal
- [ ]  Send selected cart items with the contact form / WhatsApp inquiry (currently cart is only confirmed client-side)
- [ ]  Implement Framer Motion animations for all pages
- [ ]  Create 3D hero component (Three.js / React Three Fiber) — scope TBD
- [X]  Mobile-responsive layout (ongoing QA continues in Phase 4)

#### Developer B (Backend):

- [ ]  Create MySQL queries and service functions for:
  - [ ]  Fetching projects/gallery items
  - [ ]  Fetching testimonials
  - [ ]  Saving contact form submissions
  - [ ]  Saving selected cart items with inquiries
  - [ ]  Fetching portfolio filters (categories, etc.)
- [ ]  Set up API endpoints (Next.js route handlers)
- [ ]  Seed database with sample data (3 products, EN + AR translations)
- [x]  Create TypeScript types for all data models (static-data types exist in `types/index.ts`; DB models pending Prisma)
- [ ]  Implement error handling and validation (Zod)

**Deliverable**: Fully functional public website connected to database
**Sync Point**: End of integration — test all API connections

---

### **Phase 3: Admin Dashboard (Week 6–7)** — ⬜ Not started

#### Developer A (Frontend):

- [ ]  Build admin layout and sidebar navigation
- [ ]  Create product management page (list view)
- [ ]  Create product form (add/edit)
- [ ]  Build gallery uploader interface
- [ ]  Create inquiry management page with selected cart items
- [ ]  Build settings panel (WhatsApp number, contact info)
- [ ]  Implement responsive design for admin

#### Developer B (Backend):

- [ ]  Create admin authentication system
- [ ]  Build API routes for:
  - [ ]  CRUD operations (projects, gallery, inquiries)
  - [ ]  File metadata and image URL handling
  - [ ]  Admin-only queries and permission checks
- [ ]  Set up image optimization and asset hosting strategy (Cloudinary/S3)
- [ ]  Implement data validation on backend
- [ ]  Create admin user management

**Current phase boundary:** Do not implement online payment, checkout, or customer order tracking.

**Deliverable**: Fully functional admin CMS
**Sync Point**: Admin can create/edit projects and see inquiries

---

### **Phase 4: Polish & Optimization (Week 8)** — ⬜ Not started

#### Developer A (Frontend):

- [ ]  Fine-tune animations and transitions
- [X]  Implement testimonials section
- [X]  Build newsletter signup (UI; needs backend wiring)
- [ ]  Add loading, error, and not-found states
- [ ]  Optimize images and lazy loading
- [ ]  Test across devices (mobile, tablet, desktop) incl. RTL
- [ ]  Fix responsive design issues
- [ ]  SEO optimization (meta tags, sitemap, robots, structured data)

#### Developer B (Backend):

- [ ]  Performance optimization (database indexing, query optimization)
- [ ]  Set up Google Analytics
- [ ]  Configure email notifications (SendGrid/Resend)
- [ ]  Security review and testing
- [ ]  Database backup strategy
- [ ]  Monitor and log errors

**Deliverable**: Production-ready, optimized code
**Sync Point**: Full testing and QA

---

### **Phase 5: Deployment & Launch (Week 9–10)** — ⬜ Not started

#### Developer A (Frontend):

- [ ]  Build optimization
- [ ]  Deploy to Vercel
- [ ]  Set up staging environment
- [ ]  Monitor performance (Lighthouse)
- [ ]  Fix any bugs found in production

#### Developer B (Backend):

- [ ]  Deploy MySQL database to production hosting
- [ ]  Set up automated backups
- [ ]  Configure production environment variables
- [ ]  Monitor database performance
- [ ]  Set up error tracking (Sentry optional)

**Deliverable**: Live website and fully functional admin panel
**Sync Point**: Launch day — full team testing

---

### **Phase 5+: Enhancements (If time permits)**

**Developer A**:

- Blog functionality
- Advanced 3D elements
- Performance optimization

**Developer B**:

- Email notifications
- Additional languages beyond EN/AR
- Analytics dashboard
- Customer-facing order tracking
- Order status notifications

---

## 🔄 Communication & Sync Points

### Weekly Syncs (Recommended):

1. **Monday 10:00 AM** — Week planning & blockers
2. **Wednesday 3:00 PM** — Mid-week check-in
3. **Friday 4:00 PM** — Week review & next week prep

### Daily Updates:

- Async updates in a shared doc (Google Docs/Notion)
- Track: what was done yesterday, what is being done today, any blockers

### Tools Setup:

- **Git**: GitHub repo with main/develop/feature branches
- **Issue Tracking**: GitHub Issues or Linear
- **Chat**: Slack or Discord for quick questions
- **Docs**: This repo — [README.md](README.md), [NEXT_STEPS.md](NEXT_STEPS.md), `docs/`

---

## 📊 Key Milestones

| Week | Milestone | Status |
| --- | --- | --- |
| Week 2 | Project setup + design system complete | ✅ Complete |
| Week 3 | Public storefront (home, gallery, product) + bilingual cart complete | ✅ Complete |
| Week 5 | Public website live with gallery cart (connected to DB) | ⬜ Pending — Phase 1/2 backend |
| Week 7 | Admin dashboard complete | ⬜ Not started |
| Week 8 | Full optimization & testing | ⬜ Not started |
| Week 10 | Launch to production | ⬜ Not started |

> The frontend ran ahead of the original plan while the backend phase has not begun. Week numbers above are relative to the backend track starting now — see [NEXT_STEPS.md](NEXT_STEPS.md) for the ordered task list.

---

## 💡 Best Practices for Parallel Development

### 1. **Clear API Contracts**

- API endpoints are pre-defined in `docs/UNCONFIRMED_database-schema.md` — treat them as the contract
- Frontend should mock API responses while the backend is built

### 2. **Git Workflow**

```
main (production)
  ↑
develop (staging)
  ↑
feature/frontend-* (Dev A)
feature/backend-* (Dev B)
```

### 3. **Component Isolation**

- Develop components independently with mocked data
- Integrate APIs only when both sides are ready

### 4. **Database-First Approach**

- Schema is already designed — adopt it in Prisma first
- Frontend types in `types/index.ts` should be aligned to Prisma models when the client is generated
- Easy integration follows from matching shapes

### 5. **Testing Strategy**

- Unit tests as you build
- Integration tests after Phase 2
- E2E tests in Phase 4

---

## ⚡ Quick Start Instructions

### Developer A (Frontend Setup):

```bash
git clone [repo]
npm install
npm run dev
# Open http://localhost:3000
```

### Developer B (Backend Setup):

```bash
# Provision a managed MySQL database (Railway / PlanetScale / similar)
cp .env.example .env.local   # add the real DATABASE_URL
npm install
# Then follow Phase 1 in NEXT_STEPS.md (Prisma init, migrate, seed)
```

---

## 🎯 Next Steps (Immediate Actions)

**Both Developers Together:**

1. [ ]  Answer the open questions in [NEXT_STEPS.md](NEXT_STEPS.md#open-questions) (DB host, domain, admin user, image storage)
2. [ ]  Review this plan together
3. [ ]  Confirm the Phase 1 backend kickoff date

**Developer A:**

1. [ ]  Pick up Phase 4 frontend items available before the backend lands (loading/error states, SEO files, Framer Motion)

**Developer B:**

1. [ ]  Provision MySQL and complete Phase 1 (Prisma + migration + seed)

---

## 📝 Success Criteria

✅ **Code Quality**

- TypeScript strict mode enabled (already on)
- Consistent code style (ESLint configured)
- Components fully typed
- Database queries optimized

✅ **Performance**

- Lighthouse score 90+
- First Contentful Paint < 1.5s (mobile)

✅ **User Experience**

- Mobile-first responsive design (verify for RTL)
- Touch-friendly interactions
- Fast load times
- Smooth animations

✅ **Deliverables**

- Live public website
- Functional admin CMS
- Documentation for maintenance

---

## 🚀 Launch Checklist

- [ ]  Domain registered and DNS configured
- [ ]  Vercel connected and deployed
- [ ]  MySQL production instance provisioned (not Supabase)
- [ ]  Environment variables set correctly
- [ ]  Email notifications working
- [ ]  Admin user created
- [ ]  Backup strategy in place
- [ ]  Analytics set up
- [ ]  Error tracking configured
- [ ]  Security headers configured
- [ ]  HTTPS enabled
- [ ]  Final QA testing complete (EN + AR)
- [ ]  Demo ready for stakeholders

---

## 📞 Support & Questions

If you encounter any blockers:

1. Check GitHub Issues first
2. Post in Slack with details
3. Schedule a 1:1 sync if needed

Good luck! 🎨🚀
