import { Locale, ProjectStatus } from '@prisma/client';
import { errorResponse, parseJsonBody, rateLimitedResponse } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { inquirySchema } from '@/lib/validation';

const EMAIL_LIMIT = 5;
const EMAIL_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  if (!rateLimit(`inquiries:${clientIp(request)}`, 5, 10 * 60 * 1000)) return rateLimitedResponse();

  const parsed = await parseJsonBody(request, inquirySchema);
  if ('response' in parsed) return parsed.response;

  const input = parsed.data;

  // Spam trap filled in: pretend it worked so bots learn nothing.
  if (input.website) return Response.json({ ok: true }, { status: 201 });

  // Durable per-email limit, shared across server instances.
  const recentFromEmail = await prisma.inquiry.count({
    where: { email: input.email, createdAt: { gt: new Date(Date.now() - EMAIL_WINDOW_MS) } },
  });
  if (recentFromEmail >= EMAIL_LIMIT) return rateLimitedResponse();

  // Merge duplicate cart lines so each project appears once.
  const quantities = new Map<string, number>();
  for (const item of input.items) {
    quantities.set(item.projectId, Math.min(99, (quantities.get(item.projectId) ?? 0) + item.quantity));
  }

  // Only published projects can be inquired about. Titles and prices are snapshotted from
  // the database, never from the browser.
  const projects = quantities.size
    ? await prisma.project.findMany({
        where: { id: { in: [...quantities.keys()] }, status: ProjectStatus.PUBLISHED },
        select: {
          id: true,
          translations: {
            where: { locale: { in: [input.locale, Locale.en] } },
            select: { locale: true, title: true, priceLabel: true },
          },
        },
      })
    : [];

  if (projects.length !== quantities.size) {
    return errorResponse(400, 'invalid_items');
  }

  const items = projects.map((project) => {
    const translation =
      project.translations.find((t) => t.locale === input.locale) ??
      project.translations.find((t) => t.locale === Locale.en);
    return {
      projectId: project.id,
      quantity: quantities.get(project.id) ?? 1,
      titleSnapshot: translation?.title ?? project.id,
      priceSnapshot: translation?.priceLabel ?? null,
    };
  });

  // A nested create runs as a single transaction: the inquiry and its items land together or not at all.
  await prisma.inquiry.create({
    data: {
      type: input.type,
      name: input.name,
      email: input.email,
      locale: input.locale,
      ...(input.type === 'QUESTION'
        ? { question: input.question }
        : { customName: input.customName, customSize: input.customSize, details: input.details }),
      items: { create: items },
    },
  });

  return Response.json({ ok: true }, { status: 201 });
}
