import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactSettingsForm } from '@/components/admin/ContactSettingsForm';
import { routing } from '@/i18n/routing';
import { requireAdmin } from '@/lib/auth/session';
import { readContactSettings } from '@/lib/settings';
import { saveContactSettings } from './actions';

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  await requireAdmin(locale);

  const [settings, t] = await Promise.all([readContactSettings(), getTranslations('admin.settings')]);

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold tracking-[-0.05em]">{t('title')}</h1>
      <p className="mt-1 text-sm text-[#806d87]">{t('subtitle')}</p>
      <section className="mt-6 rounded-[1.5rem] border border-[#efdfef] bg-white p-5 shadow-[0_10px_24px_rgba(140,112,163,0.05)]">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#856895]">{t('contactHeading')}</h2>
        <ContactSettingsForm action={saveContactSettings.bind(null, locale)} initial={settings} />
      </section>
    </div>
  );
}
