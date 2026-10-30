import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { logout } from '@/app/[locale]/admin/actions';

export async function AdminHeader({ email, locale, newCount }: { email: string; locale: Locale; newCount: number }) {
  const t = await getTranslations('admin.nav');

  return (
    <header className={`border-b border-[#ead8ef] bg-white ${locale === 'ar' ? 'text-ar' : ''}`}>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/inquiries" className="text-lg font-semibold tracking-[-0.03em] text-[#2f1d36]">{t('brand')}</Link>
          <nav className="flex items-center gap-1 text-sm font-semibold">
            <Link href="/admin/inquiries" className="flex items-center gap-1.5 rounded-full bg-[#f4ebff] px-3 py-1.5 text-[#504061]">
              {t('inquiries')}
              {newCount > 0 && (
                <span className="min-w-5 rounded-full bg-[#7b5ca8] px-1.5 text-center text-xs text-white" aria-label={t('newCount', { count: newCount })}>
                  {newCount}
                </span>
              )}
            </Link>
            <Link href="/" className="rounded-full px-3 py-1.5 text-[#6d4e82] hover:bg-[#fff8fc]">{t('viewSite')}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <form action={logout.bind(null, locale)}>
            <button type="submit" title={t('signedInAs', { email })} className="rounded-full border border-[#ead8ef] px-3 py-1.5 text-xs font-semibold text-[#504061] hover:bg-[#fff8fc]">
              {t('logout')}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
