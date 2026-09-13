# Nevo - Team Work Split & Timeline

## 📋 Project Overview

- **Timeline**: 8-10 weeks (2 developers)
- **Tech Stack**: Next.js 15 + React 19 + TypeScript + TailwindCSS + MySQL (managed database)
- **Deployment**: Vercel free tier (frontend) + MySQL hosting (free/low-cost external DB)
- **Work Mode**: Parallel development with clear separation of concerns
- **Important constraint**: Avoid Supabase free-tier inactivity pause by using a standard MySQL setup instead of Supabase for the live project

**Client decisions**:

- Gallery cart collects items before an inquiry
- No online payment or checkout in the current phase
- Slogan: "Made slowly. Kept forever."
- Pink and purple palette is confirmed in `Cozy_Loops_planning.txt`
- Order tracking is planned for a future phase

---

## 📅 Phase-by-Phase Timeline & Work Split

### **Phase 1: Foundation (Week 1-2)**

#### Developer A (Frontend):

- [X]  Set up Next.js 15 project with TypeScript
- [X]  Configure TailwindCSS and design tokens
- [X]  Create component structure and folder organization
- [X]  Build design system (buttons, cards, typography)
- [ ]  Set up Framer Motion basics
- [X]  Create layout components (Navbar, Footer)

#### Developer B (Backend):

- [ ]  Provision a MySQL database on a free/low-cost host (Railway, PlanetScale, or similar)
- [ ]  Design and create database schema (Projects, Gallery, Orders, Users, etc.)
- [ ]  Set up admin authentication and session flow in Next.js
- [ ]  Define API endpoints for public and admin data access
- [ ]  Create DB access layer and shared TypeScript models for frontend
- [ ]  Set up environment variables, including the database connection string

**Deliverable**: Basic project structure, design system, database ready
**Sync Point**: End of Week 2 - Ensure API client works with frontend

---

### **Phase 2: Public Website (Week 3-5)**

#### Developer A (Frontend):

- [ ]  Build Landing page (Hero section with 3D element)
- [ ]  Create Portfolio/Gallery listing page
- [ ]  Build Work detail page with image carousel
- [ ]  Create About page
- [ ]  Build Contact form UI
- [ ]  Add cart controls to gallery and work detail cards
- [ ]  Build cart review with quantity changes and item removal
- [ ]  Include selected cart items in contact form and WhatsApp inquiry messages
- [ ]  Implement Framer Motion animations for all pages
- [ ]  Create 3D hero component (Three.js/React Three Fiber)
- [ ]  Make everything mobile-responsive

#### Developer B (Backend):

- [ ]  Create MySQL queries and service functions for:
  - [ ]  Fetching projects/gallery items
  - [ ]  Fetching testimonials
  - [ ]  Saving contact form submissions
  - [ ]  Saving selected cart items with inquiries
  - [ ]  Fetching portfolio filters (categories, etc.)
- [ ]  Set up API endpoints in Next.js API routes
- [ ]  Seed database with sample data
- [ ]  Create TypeScript types for all data models
- [ ]  Implement error handling and validation

**Deliverable**: Fully functional public website connected to database
**Sync Point**: End of Week 5 - Test all API connections

---

### **Phase 3: Admin Dashboard (Week 6-7)**

#### Developer A (Frontend):

- [ ]  Build admin layout and sidebar navigation
- [ ]  Create project management page (list view)
- [ ]  Create project form (add/edit)
- [ ]  Build gallery uploader interface
- [ ]  Create inquiry management page with selected cart items
- [ ]  Build settings panel
- [ ]  Implement responsive design for admin

#### Developer B (Backend):

- [ ]  Create admin authentication system
- [ ]  Build API routes for:
  - [ ]  CRUD operations (projects, gallery, orders)
  - [ ]  File metadata and image URL handling
  - [ ]  Admin-only queries and permission checks
- [ ]  Set up image optimization and public asset hosting strategy
- [ ]  Implement data validation on backend
- [ ]  Create admin user management

**Current phase boundary:** Do not implement online payment, checkout, or customer order tracking.

**Deliverable**: Fully functional admin CMS
**Sync Point**: End of Week 7 - Admin can create/edit projects

---

### **Phase 4: Polish & Optimization (Week 8)**

#### Developer A (Frontend):

- [ ]  Fine-tune animations and transitions
- [ ]  Optimize images and lazy loading
- [ ]  Test across devices (mobile, tablet, desktop)
- [ ]  Fix any responsive design issues
- [ ]  Implement testimonials section
- [ ]  Build newsletter signup
- [ ]  SEO optimization (meta tags, structured data)

#### Developer B (Backend):

- [ ]  Performance optimization (database indexing, query optimization)
- [ ]  Set up Google Analytics
- [ ]  Configure email notifications (SendGrid/Resend)
- [ ]  Security review and testing
- [ ]  Database backup strategy
- [ ]  Monitor and log errors

**Deliverable**: Production-ready, optimized code
**Sync Point**: End of Week 8 - Full testing and QA

---

### **Phase 5: Deployment & Launch (Week 9-10)**

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
**Sync Point**: Launch day - Full team testing

---

### **Phase 5+: Enhancements (If time permits)**

**Developer A**:

- Blog functionality
- Advanced 3D elements
- Performance optimization

**Developer B**:

- Email notifications
- Multi-language support
- Analytics dashboard
- Customer-facing order tracking
- Order status notifications

---

## 🔄 Communication & Sync Points

### Weekly Syncs (Recommended):

1. **Monday 10:00 AM** - Week planning & blockers
2. **Wednesday 3:00 PM** - Mid-week check-in
3. **Friday 4:00 PM** - Week review & next week prep

### Daily Updates:

- Async updates in a shared doc (Google Docs/Notion)
- Track: What done yesterday, what doing today, any blockers

### Tools Setup:

- **Git**: GitHub repo with main/develop/feature branches
- **Issue Tracking**: GitHub Issues or Linear
- **Chat**: Slack or Discord for quick questions
- **Docs**: Shared folder for API docs, component docs, etc.

---

## 📊 Key Milestones


| Week    | Milestone                                               | Status |
| ------- | ------------------------------------------------------- | ------ |
| Week 2  | Project setup complete                                  | -      |
| Week 5  | Public website live with gallery cart (connected to DB) | -      |
| Week 7  | Admin dashboard complete                                | -      |
| Week 8  | Full optimization & testing                             | -      |
| Week 10 | Launch to production                                    | -      |

---

## 💡 Best Practices for Parallel Development

### 1. **Clear API Contracts**

- Define API endpoints early (Week 1)
- Use Swagger/OpenAPI docs
- Frontend mocks API responses while backend builds

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
- Integrate APIs only when both are ready
- Use Storybook for component documentation

### 4. **Database-First Approach**

- Dev B designs DB schema first (Week 1)
- Dev A builds components using mocked data matching schema
- Easy integration in Week 3

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
# Create Supabase project at supabase.com
# Get API keys and add to .env.local
npm install
# Database ready to use via Supabase dashboard
```

---

## 🎯 Next Steps (Immediate Actions)

### Week 1, Day 1:

**Both Developers Together (2 hours):**

1. [ ]  Create GitHub repo
2. [ ]  Set up Supabase project
3. [ ]  Create `.env.local` template
4. [ ]  Set up communication channels (Slack, meeting schedule)
5. [ ]  Review this plan together
6. [ ]  Confirm gallery cart inquiry flow and current no-payment boundary

**After Kickoff:**

**Developer A:**

1. [ ]  Clone repo and set up Node.js environment
2. [ ]  Initialize Next.js project with TypeScript
3. [ ]  Set up TailwindCSS and folder structure
4. [ ]  Apply confirmed pink and purple design tokens
5. [ ]  Start building design system

**Developer B:**

1. [ ]  Create Supabase project
2. [ ]  Design database schema
3. [ ]  Set up authentication
4. [ ]  Create TypeScript types file

**End of Day 1 Target:**

- Repo set up with both working independently
- Both can run `npm run dev` successfully

---

## 📝 Success Criteria

✅ **Code Quality**

- TypeScript strict mode enabled
- Consistent code style (Prettier/ESLint)
- Components fully typed
- Database queries optimized

✅ **Performance**

- Lighthouse score 90+
- First Contentful Paint < 1.5s (mobile)
- 3D elements optimized for mobile

✅ **User Experience**

- Mobile-first responsive design
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
- [ ]  Supabase in production mode
- [ ]  Environment variables set correctly
- [ ]  Email notifications working
- [ ]  Admin user created
- [ ]  Backup strategy in place
- [ ]  Analytics set up
- [ ]  Error tracking configured
- [ ]  Security headers configured
- [ ]  HTTPS enabled
- [ ]  Final QA testing complete
- [ ]  Demo ready for stakeholders

---

## 📞 Support & Questions

If you encounter any blockers:

1. Check GitHub Issues first
2. Post in Slack with details
3. Schedule 1:1 sync if needed

Good luck! 🎨🚀
