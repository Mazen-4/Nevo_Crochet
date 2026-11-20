import { getTranslations } from 'next-intl/server';
import { primaryAction, StatePanel } from '@/components/public/StatePanel';
import { Link } from '@/i18n/navigation';

/** 404 outside the storefront group, e.g. an admin link to a deleted inquiry or piece. */
export default async function LocaleNotFound() {
  const t = await getTranslations('common.notFound');

  return (
    <StatePanel code="404" title={t('title')} text={t('text')}>
      <Link href="/" className={primaryAction}>{t('home')}</Link>
    </StatePanel>
  );
}
