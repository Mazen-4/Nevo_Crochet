import { hasLocale } from 'next-intl';
import { getFormatter, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { countInquiriesByStatus, INQUIRY_STATUSES, listInquiries, PAGE_SIZE, type InquiryFilter } from '@/lib/admin/inquiries';
import { requireAdmin } from '@/lib/auth/session';

const FILTERS: InquiryFilter[] = [...INQUIRY_STATUSES, 'ALL'];

function parseFilter(value: string | undefined): InquiryFilter {
  return FILTERS.find((filter) => filter === value?.toUpperCase()) ?? 'NEW';
}

export default async function InquiriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  await requireAdmin(locale);

  const query = await searchParams;
  const filter = parseFilter(query.status);
  const counts = await countInquiriesByStatus();
  const totalPages = Math.max(1, Math.ceil(counts[filter] / PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1));
  const inquiries = await listInquiries(filter, page);

  const t = await getTranslations('admin.inquiries');
  const format = await getFormatter();
  const hrefFor = (status: InquiryFilter, pageNumber = 1) => ({
    pathname: '/admin/inquiries',
    query: pageNumber > 1 ? { status: status.toLowerCase(), page: pageNumber } : { status: status.toLowerCase() },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-[-0.05em]">{t('title')}</h1>

      <nav className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2" aria-label={t('title')}>
        {FILTERS.map((option) => (
          <Link
            key={option}
            href={hrefFor(option)}
            aria-current={option === filter ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${option === filter ? 'border-[#2f1d36] bg-[#2f1d36] text-white' : 'border-[#ead8ef] bg-white text-[#563d5f] hover:bg-[#f4ebff]'}`}
          >
            {t(`statuses.${option}`)}
            <span className={`rounded-full px-1.5 text-xs ${option === filter ? 'bg-white/20' : 'bg-[#f4ebff]'}`}>{format.number(counts[option])}</span>
          </Link>
        ))}
      </nav>

      {inquiries.length === 0 ? (
        <p className="mt-6 rounded-[1.5rem] border border-dashed border-[#e5d5ec] bg-white p-8 text-center text-[#6f5877]">{t('empty')}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {inquiries.map((inquiry) => {
            const preview = inquiry.question ?? inquiry.details ?? inquiry.customName;
            return (
              <li key={inquiry.id}>
                <Link
                  href={`/admin/inquiries/${inquiry.id}`}
                  className={`block rounded-[1.5rem] border bg-white p-4 shadow-[0_10px_24px_rgba(140,112,163,0.05)] transition hover:border-[#cdb4dc] ${inquiry.status === 'NEW' ? 'border-[#cdb4dc]' : 'border-[#efdfef]'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p dir="auto" className="truncate font-semibold text-[#2f1d36]">{inquiry.name}</p>
                      <p dir="ltr" className="truncate text-start text-sm text-[#765d82]">{inquiry.email}</p>
                    </div>
                    <StatusBadge status={inquiry.status} label={t(`statuses.${inquiry.status}`)} />
                  </div>
                  {preview && <p dir="auto" className="mt-2 line-clamp-2 text-sm leading-6 text-[#5e4b66]">{preview}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#806d87]">
                    <span className="font-semibold text-[#6d4e82]">{t(`types.${inquiry.type}`)}</span>
                    <span>{t('itemsCount', { count: inquiry._count.items })}</span>
                    <span>{format.dateTime(inquiry.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between gap-3 text-sm font-semibold">
          {page > 1 ? <Link href={hrefFor(filter, page - 1)} className="rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-[#504061]">{t('previous')}</Link> : <span />}
          <span className="text-[#806d87]">{t('page', { page, total: totalPages })}</span>
          {page < totalPages ? <Link href={hrefFor(filter, page + 1)} className="rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-[#504061]">{t('next')}</Link> : <span />}
        </div>
      )}
    </div>
  );
}
