import 'server-only';
import { SocialPostStatus } from '@prisma/client';
import { getAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { getLastSync } from '@/lib/social/sync';

/** Admin-only data access for the social inbox. Every function re-checks the session. */
async function assertAdmin() {
  if (!(await getAdmin())) throw new Error('Unauthorized');
}

export const SOCIAL_STATUSES = [SocialPostStatus.NEW, SocialPostStatus.IMPORTED, SocialPostStatus.IGNORED] as const;

export async function countSocialPostsByStatus(): Promise<Record<SocialPostStatus, number>> {
  await assertAdmin();
  const rows = await prisma.socialPost.groupBy({ by: ['status'], _count: true });
  const counts = { NEW: 0, IMPORTED: 0, IGNORED: 0 };
  for (const row of rows) counts[row.status] = row._count;
  return counts;
}

export async function listSocialPosts(status: SocialPostStatus) {
  await assertAdmin();
  return prisma.socialPost.findMany({
    where: { status },
    // Newest first in the inbox; oldest first would bury new pieces.
    orderBy: { postedAt: 'desc' },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      duplicateOf: { select: { platform: true, permalink: true } },
      project: { select: { id: true, translations: { select: { locale: true, title: true } } } },
    },
  });
}

export async function readLastSync() {
  await assertAdmin();
  return getLastSync();
}
