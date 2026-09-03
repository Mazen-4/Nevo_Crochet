# Nevo Database Schema

This schema is designed for the current Nevo Crochet website: a bilingual English/Arabic product gallery with inquiry cart, custom requests, newsletter signup, and a future admin CMS.

## Scope

Included:

- Products and gallery projects
- English and Arabic product content
- Product images and colors
- Testimonials
- Question inquiries
- Custom product inquiries
- Inquiry cart items
- Custom-request reference images
- Newsletter subscribers
- Admin users
- Site contact settings

Excluded from the current phase:

- Online payments
- Checkout orders
- Customer order tracking
- Shipping fulfillment workflows

## Recommended Stack

- Database: MySQL
- ORM: Prisma
- Image storage: object storage such as Cloudinary, S3-compatible storage, or Supabase Storage
- Application hosting: Vercel

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Locale {
  en
  ar
}

enum ProjectStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum InquiryType {
  QUESTION
  CUSTOM_REQUEST
}

enum InquiryStatus {
  NEW
  CONTACTED
  COMPLETED
  ARCHIVED
}

enum AdminRole {
  ADMIN
  EDITOR
}

model Project {
  id           String              @id @default(cuid())
  slug         String              @unique @db.VarChar(160)
  featured     Boolean             @default(false)
  status       ProjectStatus       @default(PUBLISHED)
  sortOrder    Int                 @default(0)
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt
  translations ProjectTranslation[]
  images       ProjectImage[]
  colors       ProjectColor[]
  inquiryItems InquiryItem[]

  @@index([status, featured])
  @@index([createdAt])
}

model ProjectTranslation {
  id            String   @id @default(cuid())
  projectId     String
  locale        Locale
  title         String   @db.VarChar(180)
  category      String   @db.VarChar(80)
  description   String   @db.Text
  materials     String?  @db.Text
  priceLabel    String?  @db.VarChar(100)
  seoTitle      String?  @db.VarChar(180)
  seoDescription String? @db.Text
  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, locale])
  @@index([locale, category])
}

model ProjectImage {
  id        String  @id @default(cuid())
  projectId String
  url       String  @db.Text
  altText   String? @db.VarChar(255)
  sortOrder Int     @default(0)
  isPrimary Boolean @default(false)
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId, sortOrder])
}

model ProjectColor {
  id        String  @id @default(cuid())
  projectId String
  colorKey  String  @db.VarChar(80)
  sortOrder Int     @default(0)
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, colorKey])
}

model ColorTranslation {
  id        String @id @default(cuid())
  colorKey  String @db.VarChar(80)
  locale    Locale
  label     String @db.VarChar(100)

  @@unique([colorKey, locale])
}

model Testimonial {
  id        String   @id @default(cuid())
  locale    Locale
  name      String   @db.VarChar(120)
  text      String   @db.Text
  featured  Boolean  @default(true)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  @@index([locale, featured, sortOrder])
}

model Inquiry {
  id          String        @id @default(cuid())
  type        InquiryType
  name        String        @db.VarChar(120)
  email       String        @db.VarChar(255)
  question    String?       @db.Text
  customName  String?       @db.VarChar(180)
  customSize  String?       @db.VarChar(180)
  details     String?       @db.Text
  locale      Locale
  status      InquiryStatus @default(NEW)
  adminNotes  String?       @db.Text
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  items       InquiryItem[]
  images      InquiryImage[]

  @@index([status, createdAt])
  @@index([email])
}

model InquiryItem {
  id            String  @id @default(cuid())
  inquiryId     String
  projectId     String
  quantity      Int     @default(1)
  titleSnapshot String  @db.VarChar(180)
  priceSnapshot String? @db.VarChar(100)
  inquiry       Inquiry @relation(fields: [inquiryId], references: [id], onDelete: Cascade)
  project       Project @relation(fields: [projectId], references: [id])

  @@index([inquiryId])
  @@index([projectId])
}

model InquiryImage {
  id        String   @id @default(cuid())
  inquiryId String
  url       String   @db.Text
  fileName  String?  @db.VarChar(255)
  mimeType  String?  @db.VarChar(100)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  inquiry   Inquiry  @relation(fields: [inquiryId], references: [id], onDelete: Cascade)

  @@index([inquiryId, sortOrder])
}

model NewsletterSubscriber {
  id             String    @id @default(cuid())
  email          String    @unique @db.VarChar(255)
  locale         Locale
  active         Boolean   @default(true)
  unsubscribedAt DateTime?
  createdAt      DateTime  @default(now())

  @@index([active, createdAt])
}

model AdminUser {
  id           String    @id @default(cuid())
  email        String    @unique @db.VarChar(255)
  passwordHash String    @db.VarChar(255)
  role         AdminRole @default(EDITOR)
  active       Boolean   @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model SiteSetting {
  id           String   @id @default(cuid())
  settingKey   String   @unique @db.VarChar(120)
  settingValue String   @db.Text
  updatedAt    DateTime @updatedAt
}
```

## Website Input Mapping

### Question form

Required:

- `name`
- `email`
- `question`

Database mapping:

```text
Inquiry.type = QUESTION
Inquiry.name = name
Inquiry.email = email
Inquiry.question = question
Inquiry.locale = active locale
```

### Custom product form

Required:

- `name`
- `email`
- `customName`
- `details`

Optional:

- `customSize`
- `customImages[]`
- Current cart items

Database mapping:

```text
Inquiry.type = CUSTOM_REQUEST
Inquiry.name = name
Inquiry.email = email
Inquiry.customName = customName
Inquiry.customSize = customSize
Inquiry.details = details
InquiryImage = one row per uploaded image
InquiryItem = one row per selected cart item
```

### Newsletter form

```text
NewsletterSubscriber.email = submitted email
NewsletterSubscriber.locale = active locale
NewsletterSubscriber.active = true
```

### Cart

The browser cart is temporary. Only save it when the visitor submits an inquiry.

```text
InquiryItem.projectId
InquiryItem.quantity
InquiryItem.titleSnapshot
InquiryItem.priceSnapshot
```

Snapshots preserve the original inquiry details if a product is renamed later.

## Current Seed Data

Seed these projects from `lib/data/site.ts`:

1. `luna-cushion-set`
2. `rose-loop-throw`
3. `petal-market-basket`

Each project should have:

- One English translation
- One Arabic translation
- One primary image
- Additional gallery images
- Its color records and color translations

## API Routes

Public routes:

```text
GET  /api/projects?locale=en
GET  /api/projects/[slug]?locale=ar
POST /api/inquiries
POST /api/newsletter
```

Admin routes:

```text
POST   /api/admin/projects
PUT    /api/admin/projects/[id]
DELETE /api/admin/projects/[id]
GET    /api/admin/inquiries
PATCH  /api/admin/inquiries/[id]
POST   /api/admin/images
```

Every admin route must verify the authenticated admin session.

## Validation Rules

- Normalize email addresses to lowercase
- Validate emails with a schema validator such as Zod
- Limit inquiry text lengths
- Limit image count and file size
- Accept only approved image MIME types
- Require inquiry items to reference existing published projects
- Reject quantities below `1`
- Never trust prices or titles sent by the browser
- Use database transactions when creating an inquiry with items and images

## Migration Commands

```bash
npm install prisma @prisma/client
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio
```

For production deployment:

```bash
npx prisma migrate deploy
```

## Environment Variables

`.env.local`:

```env
DATABASE_URL="mysql://username:password@host:3306/nevo"
NEXTAUTH_SECRET="long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Never commit `.env.local` or real database credentials.

## Implementation Order

1. Provision managed MySQL
2. Add Prisma and this schema
3. Run the initial migration
4. Seed the three projects and translations
5. Add the Prisma client singleton
6. Implement project read APIs
7. Implement inquiry creation
8. Implement newsletter subscription
9. Connect the existing forms
10. Add image storage uploads
11. Add admin authentication
12. Build the admin project and inquiry screens

## Future Tables

Only add these when their features are approved:

- `Order` for approved inquiries and fulfillment
- `OrderStatusHistory` for tracking changes
- `Notification` for email or WhatsApp delivery logs
- `BlogPost` for the optional blog
- `AnalyticsEvent` for internal metrics
