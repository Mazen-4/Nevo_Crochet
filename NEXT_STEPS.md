# 🚀 Next Steps - Nevo Project Kickoff

## This Week (Immediate Actions)

### Day 1: Team Setup (2-3 hours together)

**1. Repository Setup**

- [X]  Create GitHub repo (private)
- [X]  Initialize with README.md
- [X]  Add .gitignore for Node.js

**2. Supabase Setup**

- [X]  Create Supabase project at https://supabase.com
- [X]  Copy API keys and project URL
- [X]  Save to shared secure location
- [X]  Create `.env.local` template with keys

**3. Project Management**

- [ ]  Create GitHub Issues template
- [ ]  Set up GitHub Projects board (Kanban)
- [ ]  Create Slack workspace or Discord server
- [ ]  Schedule weekly syncs (Mon, Wed, Fri)

**4. Documentation**

- [ ]  Create `/docs` folder
- [ ]  Add API specification template
- [ ]  Add component guidelines
- [ ]  Add database schema documentation

**5. Initial Decisions**

- [ ]  Decide on commit message convention
- [ ]  Agree on TypeScript strict mode
- [ ]  Set up code formatter (Prettier)
- [ ]  Set up linter (ESLint)

**6. Client Decisions Confirmed**

- [X]  Gallery cart for collecting items before an inquiry
- [X]  No online payment or checkout in the current phase
- [X]  Slogan: "Made slowly. Kept forever."
- [X]  Girly pink and purple color palette confirmed in `Cozy_Loops_planning.txt`
- [X]  Order tracking reserved for a future phase

---

### Day 2-3: Individual Setup & Phase 1 Start

**Developer A (Frontend):**

```bash
# Initialize project
npm create next-app@latest nevo -- --typescript --tailwind --app
cd nevo
npm install framer-motion three @react-three/fiber @react-three/drei react-hook-form

# Folder structure
mkdir -p app/{public,admin,contact}
mkdir -p components/{public,admin,common,3d}
mkdir -p lib
mkdir -p styles
mkdir -p types

# Start building
npm run dev
```

**Client-facing features to include:**

- [ ]  Add cart controls to gallery and work detail cards
- [ ]  Build cart review with quantity changes and item removal
- [ ]  Include selected cart items in contact form and WhatsApp inquiry messages
- [ ]  Apply the confirmed pink and purple design tokens

**Developer B (Backend):**

```bash
# Set up local Supabase (optional, can use cloud)
# Or use cloud.supabase.com

# Tasks:
- [ ] Create database schema
- [ ] Create Projects table
- [ ] Create Gallery table
- [ ] Create Orders/Inquiries table
- [ ] Create Users table for admin
- [ ] Set up RLS policies
- [ ] Create TypeScript types file for Dev A
- [ ] Store selected cart items with each inquiry
- [ ] Keep payment and checkout out of the current schema
```

---

## Phase 1 Deliverables (End of Week 2)

### Frontend:

- ✅ Next.js project initialized
- ✅ TailwindCSS configured
- ✅ Folder structure set up
- ✅ Design system components (Button, Card, Typography)
- ✅ Layout components (Navbar, Footer)
- ✅ Component documentation

### Backend:

- ✅ Supabase project configured
- ✅ Database schema complete
- ✅ Authentication set up
- ✅ RLS policies implemented
- ✅ TypeScript types created and shared
- ✅ API client library created (`lib/supabase.ts`)

### Sync:

- ✅ API documentation finalized
- ✅ Frontend can mock API responses
- ✅ Both teams can work independently

---

## Key Resources to Create Now

### 1. Database Schema Document

```typescript
// types/database.ts
export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  thumbnail: string;
  materials: string;
  colors: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  notes: string;
  created_at: string;
}

export interface CartItem {
  project_id: string;
  title: string;
  quantity: number;
}

// ... more types
```

### 2. API Endpoints Contract

```
GET  /api/projects              → List all projects
GET  /api/projects/[slug]       → Get single project
POST /api/projects              → Create project (admin)
PUT  /api/projects/[id]         → Update project (admin)
DEL  /api/projects/[id]         → Delete project (admin)

GET  /api/gallery               → List gallery items
POST /api/gallery               → Upload image (admin)
POST /api/inquiries             → Create inquiry with selected cart items

GET  /api/orders                → List inquiries (admin)
POST /api/orders                → Create inquiry
PATCH /api/orders/[id]          → Update order status (admin)

POST /api/auth/login            → Admin login
POST /api/auth/logout           → Admin logout
```

### 3. Component Structure

```
components/
├── public/
│   ├── Hero.tsx
│   ├── HeroCanvas.tsx (3D)
│   ├── GalleryGrid.tsx
│   ├── GalleryCard.tsx
│   ├── CartButton.tsx
│   ├── CartDrawer.tsx
│   ├── ContactForm.tsx
│   └── ...
├── admin/
│   ├── AdminLayout.tsx
│   ├── ProjectForm.tsx
│   ├── GalleryUploader.tsx
│   ├── OrderList.tsx
│   └── ...
└── common/
    ├── Navbar.tsx
    ├── Footer.tsx
    ├── Button.tsx
    └── ...
```

---

## Coding Standards (Agree on These Now)

### TypeScript

```typescript
// ✅ Strict mode enabled
"strict": true

// ✅ Always type function parameters and returns
const fetchProject = async (id: string): Promise<Project> => {
  // ...
}

// ✅ Use interfaces, not `any`
export interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}
```

### Styling

```typescript
// ✅ Use TailwindCSS classes
<div className="flex items-center gap-4 p-6">

// ✅ Create reusable component variants with clsx
import clsx from 'clsx';
className={clsx(
  'px-4 py-2 rounded',
  variant === 'primary' && 'bg-rose-500 text-white'
)}
```

### Component Organization

```typescript
// ✅ Always export components as named exports
export const HeroCanvas = ({ ... }) => { ... }

// ✅ Use prop interfaces
interface HeroCanvasProps {
  autoplay?: boolean;
  scale?: number;
}

// ✅ Components in separate files
src/components/Hero/Hero.tsx
src/components/Hero/HeroCanvas.tsx
src/components/Hero/index.ts (export both)
```

---

## Timeline Summary


| Week | Focus       | Dev A           | Dev B          | Sync             |
| ---- | ----------- | --------------- | -------------- | ---------------- |
| 1-2  | Foundation  | Design System   | DB Schema      | API Contract     |
| 3-5  | Public Site | Frontend Pages  | API Routes     | Connect & Test   |
| 6-7  | Admin Panel | Admin UI        | Admin APIs     | Full Integration |
| 8    | Polish      | Animations, SEO | Performance    | Testing          |
| 9-10 | Launch      | Deploy Frontend | Deploy Backend | Go Live          |

---

## Questions to Answer Before Starting

1. **Who is the admin user?** (email/password)
2. **What's the domain name?** (for deployment)
3. **Brand colors & fonts confirmed?** (from planning)
4. **First few projects to add?** (sample data)
5. **Deployment timeline?** (exact date target)
6. **Any API integrations needed now?** (WhatsApp, email, etc.)

---

## Get Started Checklist

- [ ]  GitHub repo created
- [ ]  Supabase project created
- [ ]  Discord/Slack channel set up
- [ ]  Weekly meeting scheduled
- [ ]  This plan reviewed and agreed upon
- [ ]  Coding standards documented
- [ ]  Dev A and Dev B environments ready
- [ ]  First sync meeting scheduled (Day 3)

**Ready to build! 🚀**
