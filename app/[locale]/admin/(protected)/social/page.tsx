import { SocialPostStatus } from '@prisma/client';
import { hasLocale } from 'next-intl';
import { getFormatter, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PendingButton } from '@/components/admin/PendingButton';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { countSocialPostsByStatus, listSocialPosts, readLastSync, SOCIAL_STATUSES } from '@/lib/admin/social';
import { requireAdmin } from '@/lib/auth/session';
import { OFFICIAL_SOCIAL } from '@/lib/site';
import { createPieceFromPost, setSocialPostStatus, syncNow } from './actions';

/** "Sync now" runs inside this page's server action; the sync itself stops after ~45 s. */
export const maxDuration = 60;

const primaryButton =
  'rounded-full bg-[#7b5ca8] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(123,92,168,0.2)] transition hover:bg-[#6d4f9b]';
const secondaryButton = 'rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-sm font-semibold text-[#504061] transition hover:bg-[#fff8fc]';

function parseStatus(value: string | undefined): SocialPostStatus {
  return SOCIAL_STATUSES.find((status) => status === value?.toUpperCase()) ?? SocialPostStatus.NEW;
}

export default async function SocialInboxPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  await requireAdmin(locale);

  const status = parseStatus((await searchParams).status);
  const [counts, posts, lastSync, t, format] = await Promise.all([
    countSocialPostsByStatus(),
    listSocialPosts(status),
    readLastSync(),
    getTranslations('admin.social'),
    getFormatter(),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.05em]">{t('title')}</h1>
          <p className="mt-1 max-w-xl text-sm text-[#806d87]">
            {t.rich('subtitle', {
              facebook: (chunks) => <a href={OFFICIAL_SOCIAL.facebook} target="_blank" rel="noreferrer" className="font-semibold text-[#7b5ca8] underline-offset-2 hover:underline">{chunks}</a>,
              instagram: (chunks) => <a href={OFFICIAL_SOCIAL.instagram} target="_blank" rel="noreferrer" className="font-semibold text-[#7b5ca8] underline-offset-2 hover:underline">{chunks}</a>,
            })}
          </p>
        </div>
        <form action={syncNow.bind(null, locale)}>
          <PendingButton pendingLabel={t('syncing')} className={primaryButton}>{t('syncNow')}</PendingButton>
        </form>
      </div>

      <div role="status" className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${lastSync && !lastSync.ok ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-[#efdfef] bg-white text-[#6f5877]'}`}>
        {!lastSync ? (
          t('neverSynced')
        ) : (
          <>
            <p>
              {t('lastSync', { date: format.dateTime(new Date(lastSync.at), { dateStyle: 'medium', timeStyle: 'short' }) })}{' '}
              {lastSync.ok || lastSync.added > 0 ? t('added', { count: lastSync.added }) : null}{' '}
              {lastSync.remaining > 0 ? t('remaining', { count: lastSync.remaining }) : null}
            </p>
            {!lastSync.ok && (
              <p className="mt-1">
                {lastSync.tokenProblem ? t('tokenProblem') : t('syncError')}{' '}
                <span dir="ltr" className="text-xs opacity-80">({lastSync.error})</span>
              </p>
            )}
          </>
        )}
      </div>

      <nav className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2" aria-label={t('title')}>
        {SOCIAL_STATUSES.map((option) => (
          <Link
            key={option}
            href={{ pathname: '/admin/social', query: { status: option.toLowerCase() } }}
            aria-current={option === status ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${option === status ? 'border-[#2f1d36] bg-[#2f1d36] text-white' : 'border-[#ead8ef] bg-white text-[#563d5f] hover:bg-[#f4ebff]'}`}
          >
            {t(`statuses.${option}`)}
            <span className={`rounded-full px-1.5 text-xs ${option === status ? 'bg-white/20' : 'bg-[#f4ebff]'}`}>{format.number(counts[option])}</span>
          </Link>
        ))}
      </nav>
      <p className="mt-2 text-sm text-[#806d87]">{t(`hints.${status}`)}</p>

      {posts.length === 0 ? (
        <p className="mt-6 rounded-[1.5rem] border border-dashed border-[#e5d5ec] bg-white p-8 text-center text-[#6f5877]">{t(`empty.${status}`)}</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {posts.map((post) => {
            const platform = t(`platforms.${post.platform}`);
            const pieceTitle = post.project?.translations.find((tr) => tr.locale === locale)?.title || post.project?.translations.find((tr) => tr.title)?.title;
            return (
              <li key={post.id} className="flex flex-col overflow-hidden rounded-[1.5rem] border border-[#efdfef] bg-white shadow-[0_10px_24px_rgba(140,112,163,0.05)]">
                {post.images.length > 0 && (
                  <div className={`grid gap-0.5 bg-[#fdf3fb] ${post.images.length > 1 ? 'grid-cols-2' : ''}`}>
                    {post.images.slice(0, 4).map((image, index) => (
                      <div key={image.id} className="relative aspect-square">
                        <Image src={image.url} alt={t('photoAlt', { index: index + 1 })} fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover" />
                        {index === 3 && post.images.length > 4 && (
                          <span className="absolute inset-0 grid place-items-center bg-black/40 text-lg font-semibold text-white">+{post.images.length - 4}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#806d87]">
                    <span className="rounded-full bg-[#f4ebff] px-2.5 py-0.5 font-semibold text-[#504061]">{platform}</span>
                    <span>{format.dateTime(post.postedAt, { dateStyle: 'medium' })}</span>
                    <a href={post.permalink} target="_blank" rel="noreferrer" className="font-semibold text-[#7b5ca8] hover:underline">
                      {t('viewOriginal', { platform })}
                    </a>
                  </div>

                  {post.caption ? (
                    <p dir="auto" className="line-clamp-6 whitespace-pre-line text-sm leading-6 text-[#5e4b66]">{post.caption}</p>
                  ) : (
                    <p className="text-sm italic text-[#806d87]">{t('noCaption')}</p>
                  )}

                  {post.duplicateOf && (
                    <p className="text-xs text-[#806d87]">
                      {t('crossPost')}{' '}
                      <a href={post.duplicateOf.permalink} target="_blank" rel="noreferrer" className="font-semibold text-[#7b5ca8] hover:underline">
                        {t('viewOriginal', { platform: t(`platforms.${post.duplicateOf.platform}`) })}
                      </a>
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap gap-2 pt-1">
                    {post.status === SocialPostStatus.IMPORTED && post.project ? (
                      <Link href={`/admin/projects/${post.project.id}`} className={secondaryButton}>
                        <span dir="auto">{pieceTitle ? t('openPiece', { title: pieceTitle }) : t('openPieceUntitled')}</span>
                      </Link>
                    ) : (
                      <>
                        {post.status === SocialPostStatus.NEW && (
                          <form action={createPieceFromPost.bind(null, locale, post.id)}>
                            <PendingButton pendingLabel={t('creating')} className={primaryButton}>{t('createPiece')}</PendingButton>
                          </form>
                        )}
                        <form action={setSocialPostStatus.bind(null, locale, post.id, post.status === SocialPostStatus.IGNORED ? 'NEW' : 'IGNORED')}>
                          <PendingButton pendingLabel={t('saving')} className={secondaryButton}>
                            {post.status === SocialPostStatus.IGNORED ? t('restore') : t('ignore')}
                          </PendingButton>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
