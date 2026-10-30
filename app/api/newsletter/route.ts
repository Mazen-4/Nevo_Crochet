import { parseJsonBody } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, newsletterSchema);
  if ('response' in parsed) return parsed.response;

  const { email, locale } = parsed.data;

  // Upsert so re-subscribing reactivates a past subscriber; the response never reveals
  // whether the address was already on the list.
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, locale },
    update: { locale, active: true, unsubscribedAt: null },
  });

  return Response.json({ ok: true });
}
