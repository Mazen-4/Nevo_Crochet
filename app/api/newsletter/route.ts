import { parseJsonBody, rateLimitedResponse } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { newsletterSchema } from '@/lib/validation';

export async function POST(request: Request) {
  if (!rateLimit(`newsletter:${clientIp(request.headers)}`, 5, 10 * 60 * 1000)) return rateLimitedResponse();

  const parsed = await parseJsonBody(request, newsletterSchema);
  if ('response' in parsed) return parsed.response;

  const { email, locale, website } = parsed.data;
  // Spam trap filled in: pretend it worked so bots learn nothing.
  if (website) return Response.json({ ok: true });

  // Upsert so re-subscribing reactivates a past subscriber; the response never reveals
  // whether the address was already on the list.
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, locale },
    update: { locale, active: true, unsubscribedAt: null },
  });

  return Response.json({ ok: true });
}
