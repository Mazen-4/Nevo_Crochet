import { getTranslations } from 'next-intl/server';

/**
 * Admin pages query the database on every request, so show a skeleton while they load.
 * (The storefront deliberately has no loading.tsx: streaming would turn real 404s into 200s.)
 */
export default async function AdminLoading() {
  const t = await getTranslations('admin');

  return (
    <div role="status" aria-live="polite" className="animate-pulse space-y-4">
      <span className="sr-only">{t('loading')}</span>
      <div className="h-9 w-48 rounded-full bg-[#f4ebff]" />
      {[0, 1, 2].map((row) => (
        <div key={row} className="h-24 rounded-[1.5rem] border border-[#efdfef] bg-white" />
      ))}
    </div>
  );
}
