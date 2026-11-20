import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

/** Cache tag for site settings — expire it after admin edits. */
export const SETTINGS_TAG = 'settings';

export const SETTING_KEYS = {
  email: 'contact.email',
  whatsapp: 'contact.whatsapp',
} as const;

export type ContactSettings = {
  email: string | null;
  /** As the admin typed it (shown to visitors), plus the digits-only form `wa.me` links need. */
  whatsapp: { display: string; digits: string } | null;
};

/** `"+962 7 9123-4567"` → `"962791234567"`. */
export const whatsappDigits = (value: string) => value.replace(/\D/g, '');

/** Raw stored values, for the admin form. */
export async function readContactSettings(): Promise<{ email: string; whatsapp: string }> {
  const rows = await prisma.siteSetting.findMany({ where: { settingKey: { in: Object.values(SETTING_KEYS) } } });
  const value = (key: string) => rows.find((row) => row.settingKey === key)?.settingValue ?? '';
  return { email: value(SETTING_KEYS.email), whatsapp: value(SETTING_KEYS.whatsapp) };
}

/** Public contact details. Unset values are `null` so the storefront hides them instead of showing placeholders. */
export const getContactSettings = unstable_cache(
  async (): Promise<ContactSettings> => {
    const { email, whatsapp } = await readContactSettings();
    return {
      email: email || null,
      whatsapp: whatsapp ? { display: whatsapp, digits: whatsappDigits(whatsapp) } : null,
    };
  },
  ['settings:contact'],
  { tags: [SETTINGS_TAG], revalidate: 3600 },
);
