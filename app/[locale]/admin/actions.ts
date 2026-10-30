'use server';

import { headers } from 'next/headers';
import { redirect } from '@/i18n/navigation';
import { DUMMY_HASH, verifyPassword } from '@/lib/auth/password';
import { createSession, deleteSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { localeSchema, loginSchema } from '@/lib/validation';

export type LoginState = { error?: 'invalid' | 'rateLimited' };

export async function login(rawLocale: string, _previous: LoginState, formData: FormData): Promise<LoginState> {
  const locale = localeSchema.parse(rawLocale);

  if (!rateLimit(`login:${clientIp(await headers())}`, 10, 15 * 60 * 1000)) {
    return { error: 'rateLimited' };
  }

  const parsed = loginSchema.safeParse({ email: formData.get('email'), password: formData.get('password') });
  if (!parsed.success) return { error: 'invalid' };

  const admin = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  // Always run scrypt, even for unknown emails, so response time doesn't reveal which accounts exist.
  const passwordOk = await verifyPassword(parsed.data.password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !admin.active || !passwordOk) return { error: 'invalid' };

  await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
  await createSession(admin.id);
  return redirect({ href: '/admin/inquiries', locale });
}

export async function logout(rawLocale: string) {
  const locale = localeSchema.parse(rawLocale);
  await deleteSession();
  redirect({ href: '/admin/login', locale });
}
