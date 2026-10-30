import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';

/**
 * Stateless admin sessions: an HMAC-signed cookie holding the admin id and expiry.
 * Every request re-checks the admin row, so deactivating an account locks it out immediately.
 */
const COOKIE_NAME = 'nevo_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = { sub: string; exp: number };

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error('AUTH_SECRET must be set to a random string of at least 32 characters.');
  }
  return value;
}

function sign(data: string): string {
  return createHmac('sha256', secret()).update(data).digest('base64url');
}

function encode(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${data}.${sign(data)}`;
}

function decode(token: string | undefined): SessionPayload | null {
  const [data, signature] = token?.split('.') ?? [];
  if (!data || !signature) return null;

  const expected = Buffer.from(sign(data));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString()) as SessionPayload;
    return typeof payload.sub === 'string' && payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}

export async function createSession(adminId: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  (await cookies()).set(COOKIE_NAME, encode({ sub: adminId, exp }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export type SessionAdmin = { id: string; email: string; role: 'ADMIN' | 'EDITOR' };

/** The signed-in, active admin for this request, or `null`. Memoized per render pass. */
export const getAdmin = cache(async (): Promise<SessionAdmin | null> => {
  const session = decode((await cookies()).get(COOKIE_NAME)?.value);
  if (!session) return null;

  return prisma.adminUser.findFirst({
    where: { id: session.sub, active: true },
    select: { id: true, email: true, role: true },
  });
});

/** Use at the top of every admin page and server action. Redirects to login when signed out. */
export async function requireAdmin(locale: Locale): Promise<SessionAdmin> {
  const admin = await getAdmin();
  if (!admin) return redirect({ href: '/admin/login', locale });
  return admin;
}
