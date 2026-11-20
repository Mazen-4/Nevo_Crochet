import { InquiryStatus, ProjectStatus } from '@prisma/client';
import { z } from 'zod';
import { routing } from '@/i18n/routing';
import { isAllowedImageUrl } from '@/lib/image-hosts';

export const localeSchema = z.enum(routing.locales);

const email = z.string().trim().toLowerCase().max(255).pipe(z.email());
const requiredText = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined);

/** Spam-trap field; real visitors never see it, so any value marks the request as a bot. */
const honeypot = z.string().max(500).optional();

export const newsletterSchema = z.object({
  email,
  locale: localeSchema,
  website: honeypot,
});

/** Cart lines carry only an id and quantity — titles/prices are re-read from the database. */
const inquiryItemSchema = z.object({
  projectId: requiredText(40),
  quantity: z.int().min(1).max(99),
});

const inquiryBase = {
  name: requiredText(120),
  email,
  locale: localeSchema,
  items: z.array(inquiryItemSchema).max(50).default([]),
  website: honeypot,
};

export const inquirySchema = z
  .discriminatedUnion('type', [
    z.object({
      ...inquiryBase,
      type: z.literal('QUESTION'),
      question: optionalText(5000),
    }),
    z.object({
      ...inquiryBase,
      type: z.literal('CUSTOM_REQUEST'),
      customName: requiredText(180),
      customSize: optionalText(180),
      details: requiredText(5000),
    }),
  ])
  .refine((data) => data.type !== 'QUESTION' || data.question || data.items.length > 0, {
    message: 'A question needs a message or at least one cart item.',
    path: ['question'],
  });

export type InquiryInput = z.infer<typeof inquirySchema>;

export const loginSchema = z.object({
  email,
  // Capped so an oversized password can't make scrypt burn CPU.
  password: z.string().min(1).max(200),
});

export const inquiryUpdateSchema = z.object({
  id: requiredText(40),
  status: z.enum(InquiryStatus),
  adminNotes: optionalText(5000),
});

/** URL-safe lowercase slug: `luna-cushion-set`. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const projectTranslationSchema = z.object({
  title: requiredText(180),
  category: requiredText(80),
  description: requiredText(5000),
  materials: optionalText(2000),
  priceLabel: optionalText(100),
  seoTitle: optionalText(180),
  seoDescription: optionalText(300),
});

/** Admin project form. Colors are keyed by a stable slug; their labels are shared across projects. */
export const projectSchema = z.object({
  slug: z.string().trim().toLowerCase().min(1).max(160).regex(SLUG_PATTERN),
  status: z.enum(ProjectStatus),
  featured: z.boolean(),
  en: projectTranslationSchema,
  ar: projectTranslationSchema,
  colors: z
    .array(
      z.object({
        key: z.string().trim().toLowerCase().max(80).regex(SLUG_PATTERN),
        en: requiredText(100),
        ar: requiredText(100),
      }),
    )
    .max(20)
    .refine((colors) => new Set(colors.map((c) => c.key)).size === colors.length, { message: 'duplicate' }),
  images: z
    .array(
      z.object({
        url: z.string().trim().max(2000).refine(isAllowedImageUrl, { message: 'host' }),
        altText: optionalText(255),
      }),
    )
    .max(12),
}).refine((project) => project.status !== ProjectStatus.PUBLISHED || project.images.length > 0, {
  // Storefront cards and the product page always render a cover image.
  message: 'imageRequired',
  path: ['images'],
});

export type ProjectInput = z.infer<typeof projectSchema>;

/** Empty strings clear a setting. WhatsApp numbers need a country code: 8–15 digits (E.164). */
export const contactSettingsSchema = z.object({
  email: z.string().trim().pipe(z.union([z.literal(''), email])),
  whatsapp: z
    .string()
    .trim()
    .max(30)
    .refine((value) => value === '' || (/^\+?[\d\s()-]+$/.test(value) && /^\d{8,15}$/.test(value.replace(/\D/g, ''))), {
      message: 'phone',
    }),
});
