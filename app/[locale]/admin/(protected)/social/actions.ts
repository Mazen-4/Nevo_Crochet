'use server';

import { Locale, ProjectStatus, SocialPostStatus } from '@prisma/client';
import { revalidatePath, updateTag } from 'next/cache';
import { redirect } from '@/i18n/navigation';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { PROJECTS_TAG } from '@/lib/projects';
import { syncSocialPosts } from '@/lib/social/sync';
import { localeSchema } from '@/lib/validation';

const refresh = (locale: string) => revalidatePath(`/${locale}/admin/social`);

/** "Sync now". The result is stored as the last sync and shown at the top of the inbox. */
export async function syncNow(rawLocale: string): Promise<void> {
  const locale = localeSchema.parse(rawLocale);
  await requireAdmin(locale);
  await syncSocialPosts();
  refresh(locale);
}

export async function setSocialPostStatus(rawLocale: string, id: string, status: 'NEW' | 'IGNORED'): Promise<void> {
  const locale = localeSchema.parse(rawLocale);
  await requireAdmin(locale);
  const next = status === 'IGNORED' ? SocialPostStatus.IGNORED : SocialPostStatus.NEW;
  // Imported posts stay linked to their piece; only inbox/ignored posts move between the two.
  await prisma.socialPost.updateMany({ where: { id, status: { not: SocialPostStatus.IMPORTED } }, data: { status: next } });
  refresh(locale);
}

/** First line of the caption, without leading/trailing emoji or symbols, as a starting title. */
function titleFrom(caption: string | null): string {
  const firstLine = (caption ?? '').split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? '';
  const trimmed = firstLine.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
  return trimmed.length > 90 ? `${trimmed.slice(0, 90).replace(/\s+\S*$/, '')}…` : trimmed;
}

/**
 * Creates a DRAFT piece from a post: the Arabic caption becomes the Arabic description, the photos
 * become the piece's images, and English is left empty. The project form won't save until both
 * languages, a category and so on are filled in, and drafts never appear on the storefront.
 */
export async function createPieceFromPost(rawLocale: string, id: string): Promise<void> {
  const locale = localeSchema.parse(rawLocale);
  await requireAdmin(locale);

  const post = await prisma.socialPost.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: 'asc' } } } });
  if (!post) return redirect({ href: '/admin/social', locale });
  if (post.projectId) return redirect({ href: `/admin/projects/${post.projectId}`, locale });

  const projectId = await prisma.$transaction(async (tx) => {
    const { _max } = await tx.project.aggregate({ _max: { sortOrder: true } });
    const project = await tx.project.create({
      data: {
        slug: `piece-${post.id.slice(-8).toLowerCase()}`,
        status: ProjectStatus.DRAFT,
        sortOrder: (_max.sortOrder ?? 0) + 1,
        translations: {
          create: [
            { locale: Locale.ar, title: titleFrom(post.caption), category: '', description: post.caption ?? '' },
            { locale: Locale.en, title: '', category: '', description: '' },
          ],
        },
        images: { create: post.images.slice(0, 12).map((image, index) => ({ url: image.url, sortOrder: index, isPrimary: index === 0 })) },
      },
      select: { id: true },
    });
    await tx.socialPost.update({ where: { id: post.id }, data: { status: SocialPostStatus.IMPORTED, projectId: project.id } });
    return project.id;
  });

  updateTag(PROJECTS_TAG);
  refresh(locale);
  return redirect({ href: `/admin/projects/${projectId}?fromSocial=1`, locale });
}
