import 'server-only';
import { InquiryStatus, type Prisma } from '@prisma/client';
import { getAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

/** Admin-only data access. Every function re-checks the session, independent of the calling page. */
async function assertAdmin() {
  if (!(await getAdmin())) throw new Error('Unauthorized');
}

export const INQUIRY_STATUSES = Object.values(InquiryStatus);
export type InquiryFilter = InquiryStatus | 'ALL';
export const PAGE_SIZE = 20;

export async function countInquiriesByStatus(): Promise<Record<InquiryFilter, number>> {
  await assertAdmin();
  const groups = await prisma.inquiry.groupBy({ by: ['status'], _count: { _all: true } });
  const counts = Object.fromEntries(INQUIRY_STATUSES.map((status) => [status, 0])) as Record<InquiryStatus, number>;
  for (const group of groups) counts[group.status] = group._count._all;
  return { ...counts, ALL: groups.reduce((total, group) => total + group._count._all, 0) };
}

export async function listInquiries(filter: InquiryFilter, page: number) {
  await assertAdmin();
  const where: Prisma.InquiryWhereInput = filter === 'ALL' ? {} : { status: filter };
  return prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      type: true,
      status: true,
      name: true,
      email: true,
      question: true,
      customName: true,
      details: true,
      createdAt: true,
      _count: { select: { items: true } },
    },
  });
}

export async function getInquiry(id: string) {
  await assertAdmin();
  return prisma.inquiry.findUnique({
    where: { id },
    include: {
      items: { include: { project: { select: { slug: true } } } },
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });
}
