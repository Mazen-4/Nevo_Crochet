import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { routing } from '@/i18n/routing';
import { countInquiriesByStatus } from '@/lib/admin/inquiries';
import { requireAdmin } from '@/lib/auth/session';

/**
 * Shell for signed-in admin pages. Layouts don't re-run on every client navigation,
 * so each page and server action still calls `requireAdmin` itself.
 */
export default async function ProtectedAdminLayout({ children, params }: Readonly<LayoutProps<'/[locale]/admin'>>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const admin = await requireAdmin(locale);
  const { NEW: newCount } = await countInquiriesByStatus();

  return (
    <>
      <AdminHeader email={admin.email} locale={locale} newCount={newCount} />
      <main className={`mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10 ${locale === 'ar' ? 'text-ar' : ''}`}>{children}</main>
    </>
  );
}
