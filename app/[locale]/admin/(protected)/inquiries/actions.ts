'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { inquiryUpdateSchema, localeSchema } from '@/lib/validation';

export type InquiryUpdateState = { result?: 'saved' | 'error' };

export async function updateInquiry(
  rawLocale: string,
  id: string,
  _previous: InquiryUpdateState,
  formData: FormData,
): Promise<InquiryUpdateState> {
  const locale = localeSchema.parse(rawLocale);
  await requireAdmin(locale);

  const parsed = inquiryUpdateSchema.safeParse({
    id,
    status: formData.get('status'),
    adminNotes: formData.get('adminNotes') ?? '',
  });
  if (!parsed.success) return { result: 'error' };

  const { count } = await prisma.inquiry.updateMany({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status, adminNotes: parsed.data.adminNotes ?? null },
  });
  if (count === 0) return { result: 'error' };

  // Refresh the list, the detail page and the "new" badge in the admin header.
  revalidatePath(`/${locale}/admin`, 'layout');
  return { result: 'saved' };
}
