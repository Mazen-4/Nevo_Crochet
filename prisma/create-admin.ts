/**
 * Create an admin account, or reset an existing admin's password.
 *
 *   npm run admin:create
 *
 * Prompts for email and password. For non-interactive use, set ADMIN_EMAIL and ADMIN_PASSWORD.
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { AdminRole, PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth/password';

const MIN_PASSWORD_LENGTH = 12;
const prisma = new PrismaClient();

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? (await prompt('Admin email: '))).trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? (await prompt(`Password (min ${MIN_PASSWORD_LENGTH} characters): `));

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('That does not look like an email address.');
  if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  if (password.length > 200) throw new Error('Password must be at most 200 characters.');

  const passwordHash = await hashPassword(password);
  const admin = await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash, role: AdminRole.ADMIN },
    update: { passwordHash, active: true },
  });

  console.log(`Admin ready: ${admin.email} (${admin.role})`);
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
