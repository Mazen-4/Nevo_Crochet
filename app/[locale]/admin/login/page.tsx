import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LoginForm } from '@/components/admin/LoginForm';
import { redirect } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getAdmin } from '@/lib/auth/session';
import { login } from '../actions';

export default async function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  if (await getAdmin()) redirect({ href: '/admin/inquiries', locale });

  const t = await getTranslations('admin.login');
  const isArabic = locale === 'ar';

  return (
    <main className={`flex min-h-screen items-center justify-center px-5 py-16 ${isArabic ? 'text-ar' : ''}`}>
      <div className="w-full max-w-sm rounded-[2rem] border border-[#eedaf1] bg-white p-7 shadow-[0_24px_60px_rgba(140,111,160,0.1)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6e9e]">{t('eyebrow')}</p>
        <h1 className={`mt-3 text-3xl font-semibold tracking-[-0.05em] ${isArabic ? 'text-ar-title' : ''}`}>{t('title')}</h1>
        <p className={`mt-2 text-sm leading-6 text-[#5f4b67] ${isArabic ? 'text-ar-body' : ''}`}>{t('subtitle')}</p>
        <LoginForm action={login.bind(null, locale)} />
      </div>
    </main>
  );
}
