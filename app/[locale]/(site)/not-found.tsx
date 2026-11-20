import { getTranslations } from 'next-intl/server';
import { NavBar } from '@/components/public/NavBar';
import { primaryAction, secondaryAction, StatePanel } from '@/components/public/StatePanel';
import { Link } from '@/i18n/navigation';

/** Storefront 404: unknown URLs (via the `[...rest]` catch-all) and missing or unpublished pieces. */
export default async function SiteNotFound() {
  const t = await getTranslations('common.notFound');

  return (
    <>
      <NavBar />
      <StatePanel code="404" title={t('title')} text={t('text')}>
        <Link href="/gallery" className={primaryAction}>{t('gallery')}</Link>
        <Link href="/" className={secondaryAction}>{t('home')}</Link>
      </StatePanel>
    </>
  );
}
