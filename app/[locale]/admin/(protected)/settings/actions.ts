'use server';

import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { SETTING_KEYS, SETTINGS_TAG } from '@/lib/settings';
import { contactSettingsSchema, localeSchema } from '@/lib/validation';

export type SettingsState = {
  result?: 'saved' | 'error';
  errors?: { email?: boolean; whatsapp?: boolean };
};

export async function saveContactSettings(rawLocale: string, _previous: SettingsState, formData: FormData): Promise<SettingsState> {
  const locale = localeSchema.parse(rawLocale);
  await requireAdmin(locale);

  const parsed = contactSettingsSchema.safeParse({
    email: formData.get('email') ?? '',
    whatsapp: formData.get('whatsapp') ?? '',
  });
  if (!parsed.success) {
    const fields = new Set(parsed.error.issues.map((issue) => issue.path[0]));
    return { result: 'error', errors: { email: fields.has('email'), whatsapp: fields.has('whatsapp') } };
  }

  // An empty value removes the setting, which hides that contact line on the site.
  await prisma.$transaction(
    (Object.keys(SETTING_KEYS) as Array<keyof typeof SETTING_KEYS>).map((field) => {
      const settingKey = SETTING_KEYS[field];
      const settingValue = parsed.data[field];
      return settingValue
        ? prisma.siteSetting.upsert({ where: { settingKey }, create: { settingKey, settingValue }, update: { settingValue } })
        : prisma.siteSetting.deleteMany({ where: { settingKey } });
    }),
  );

  updateTag(SETTINGS_TAG);
  return { result: 'saved' };
}
