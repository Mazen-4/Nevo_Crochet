// This file is deprecated — use lib/prisma.ts instead.
// Kept temporarily to avoid breaking any stale imports.
export const databaseConfig = {
  connectionString: process.env.DATABASE_URL || '',
};
