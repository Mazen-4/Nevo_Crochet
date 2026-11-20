'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { primaryAction, secondaryAction, StatePanel } from '@/components/public/StatePanel';
import { Link } from '@/i18n/navigation';

/** Catches rendering errors in any localized page (storefront and admin). Next.js 16 passes `retry`, not `reset`. */
export default function LocaleError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useTranslations('common.error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatePanel code="!" title={t('title')} text={t('text')}>
      <button type="button" onClick={() => retry()} className={primaryAction}>{t('retry')}</button>
      <Link href="/" className={secondaryAction}>{t('home')}</Link>
      {error.digest && <p className="w-full pt-2 text-xs text-[#7a6a81]">{t('reference', { digest: error.digest })}</p>}
    </StatePanel>
  );
}
