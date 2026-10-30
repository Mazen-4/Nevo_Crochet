import { hasLocale } from 'next-intl';
import { getFormatter, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { InquiryUpdateForm } from '@/components/admin/InquiryUpdateForm';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getInquiry, INQUIRY_STATUSES } from '@/lib/admin/inquiries';
import { requireAdmin } from '@/lib/auth/session';
import { updateInquiry } from '../actions';

const card = 'rounded-[1.5rem] border border-[#efdfef] bg-white p-5 shadow-[0_10px_24px_rgba(140,112,163,0.05)]';
const label = 'text-xs font-semibold uppercase tracking-[0.18em] text-[#8d6e9e]';

export default async function InquiryDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  await requireAdmin(locale);

  const inquiry = await getInquiry(id);
  if (!inquiry) notFound();

  const t = await getTranslations('admin.inquiries');
  // The reply subject is written in the customer's language, not the admin's.
  const customerT = await getTranslations({ locale: inquiry.locale, namespace: 'admin.inquiries' });
  const format = await getFormatter();
  const mailto = `mailto:${inquiry.email}?subject=${encodeURIComponent(customerT('replySubject'))}`;

  const message: Array<[string, string | null]> =
    inquiry.type === 'QUESTION'
      ? [[t('message'), inquiry.question]]
      : [[t('customName'), inquiry.customName], [t('customSize'), inquiry.customSize], [t('details'), inquiry.details]];

  return (
    <div className="space-y-4">
      <Link href="/admin/inquiries" className="inline-flex rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-sm font-medium text-[#4f3559] hover:bg-[#fff8fc]">
        {t('back')}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={label}>{t(`types.${inquiry.type}`)}</p>
          <h1 dir="auto" className="mt-2 break-words text-3xl font-semibold tracking-[-0.05em]">{inquiry.name}</h1>
          <p className="mt-1 text-sm text-[#806d87]">{t('received', { date: format.dateTime(inquiry.createdAt, { dateStyle: 'long', timeStyle: 'short' }) })}</p>
        </div>
        <StatusBadge status={inquiry.status} label={t(`statuses.${inquiry.status}`)} />
      </div>

      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <section className={card}>
            <p className={label}>{t('contact')}</p>
            <a href={`mailto:${inquiry.email}`} dir="ltr" className="mt-2 block break-all text-start text-lg font-medium text-[#2f1d36]">{inquiry.email}</a>
            <p className="mt-1 text-sm text-[#806d87]">{t('language')}: {t(`languages.${inquiry.locale}`)}</p>
            <a href={mailto} className="mt-4 inline-flex rounded-full bg-[#7b5ca8] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(123,92,168,0.2)] transition hover:bg-[#6d4f9b]">
              {t('replyByEmail')}
            </a>
          </section>

          <section className={`${card} space-y-4`}>
            {message.some(([, value]) => value) ? (
              message.map(([title, value]) =>
                value ? (
                  <div key={title}>
                    <p className={label}>{title}</p>
                    <p dir="auto" className="mt-2 whitespace-pre-wrap break-words leading-7 text-[#4f3c5c]">{value}</p>
                  </div>
                ) : null,
              )
            ) : (
              <p className="text-sm text-[#806d87]">{t('noMessage')}</p>
            )}
          </section>

          {inquiry.items.length > 0 && (
            <section className={card}>
              <p className={label}>{t('cartItems')}</p>
              <ul className="mt-3 divide-y divide-[#f3e7f2]">
                {inquiry.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <Link href={`/products/${item.project.slug}`} dir="auto" className="font-semibold text-[#2f1d36] hover:text-[#7b5ca8]">{item.titleSnapshot}</Link>
                      {item.priceSnapshot && <p dir="auto" className="text-xs text-[#765d82]">{item.priceSnapshot}</p>}
                    </div>
                    <span className="shrink-0 rounded-full bg-[#fdf3fb] px-3 py-1 text-sm font-semibold text-[#5d4765]">{t('quantity', { count: item.quantity })}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {inquiry.images.length > 0 && (
            <section className={card}>
              <p className={label}>{t('images')}</p>
              <ul className="mt-3 space-y-2">
                {inquiry.images.map((image) => (
                  <li key={image.id}>
                    <a href={image.url} target="_blank" rel="noreferrer" dir="auto" className="break-all text-sm font-medium text-[#6d4e82] underline">{image.fileName ?? image.url}</a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <section className={`${card} h-fit`}>
          <p className={label}>{t('manage')}</p>
          <InquiryUpdateForm
            action={updateInquiry.bind(null, locale, inquiry.id)}
            status={inquiry.status}
            statuses={INQUIRY_STATUSES.map((value) => ({ value, label: t(`statuses.${value}`) }))}
            adminNotes={inquiry.adminNotes ?? ''}
          />
        </section>
      </div>
    </div>
  );
}
