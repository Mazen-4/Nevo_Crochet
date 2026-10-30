import { InquiryStatus } from '@prisma/client';
import { z } from 'zod';
import { routing } from '@/i18n/routing';

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
