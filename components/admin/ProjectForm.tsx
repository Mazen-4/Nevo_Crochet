'use client';

import { useActionState, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { IMAGE_HOSTS, isAllowedImageUrl } from '@/lib/image-hosts';
import { slugify } from '@/lib/slug';
import type { ProjectFormState, ProjectFormValues, ProjectTranslationValues } from '@/types';

type ColorOption = { key: string; en: string; ar: string };
type ColorRow = ColorOption & { uid: string; isNew: boolean };
type ImageRow = { uid: string; url: string; altText: string };

type Props = {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  initial: ProjectFormValues;
  isNew: boolean;
  colorOptions: ColorOption[];
  categories: { en: string[]; ar: string[] };
};

const STATUSES = ['PUBLISHED', 'DRAFT', 'ARCHIVED'] as const;

const uid = () => Math.random().toString(36).slice(2, 10);
const card = 'rounded-[1.5rem] border border-[#efdfef] bg-white p-5 shadow-[0_10px_24px_rgba(140,112,163,0.05)]';
const heading = 'text-xs font-semibold uppercase tracking-[0.18em] text-[#856895]';
const input =
  'w-full rounded-2xl border bg-white px-4 py-2.5 text-sm text-[#2f1d36] outline-none placeholder:text-[#806f88] focus:border-[#7b5ca8] focus:ring-2 focus:ring-[#7b5ca8]/20 aria-[invalid=true]:border-rose-400';
const smallButton = 'rounded-full border border-[#ead8ef] bg-white px-3 py-1.5 text-xs font-semibold text-[#504061] transition hover:bg-[#f4ebff] disabled:opacity-30';

/** Label, hint and error wired to one input via ids, so screen readers announce all three. */
function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#4f3559]">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs leading-5 text-[#806d87]">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

export function ProjectForm({ action, initial, isNew, colorOptions, categories }: Props) {
  const t = useTranslations('admin.projects');
  const [state, formAction, pending] = useActionState(action, {});

  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [status, setStatus] = useState(initial.status);
  const [featured, setFeatured] = useState(initial.featured);
  const [translations, setTranslations] = useState({ en: initial.en, ar: initial.ar });
  const [colors, setColors] = useState<ColorRow[]>(() => initial.colors.map((c) => ({ ...c, uid: uid(), isNew: false })));
  const [images, setImages] = useState<ImageRow[]>(() => initial.images.map((image) => ({ ...image, uid: uid() })));

  const errors = state.errors ?? {};
  const errorText = (path: string) => (errors[path] ? t(`errors.${errors[path]}`) : undefined);

  const setTranslation = (locale: 'en' | 'ar', field: keyof ProjectTranslationValues, value: string) => {
    setTranslations((current) => ({ ...current, [locale]: { ...current[locale], [field]: value } }));
    if (locale === 'en' && field === 'title' && !slugTouched) setSlug(slugify(value));
  };

  // New colors get a key from their English name; existing keys never change, so other pieces keep their link.
  const payload: ProjectFormValues = {
    slug,
    status,
    featured,
    ...translations,
    colors: colors.map((c) => ({ key: c.isNew ? slugify(c.en) || `color-${c.uid}` : c.key, en: c.en, ar: c.ar })),
    images: images.map(({ url, altText }) => ({ url, altText })),
  };

  const usedKeys = new Set(colors.map((c) => c.key));
  const unusedColors = colorOptions.filter((option) => !usedKeys.has(option.key));

  const move = <T,>(list: T[], from: number, to: number) => {
    const next = [...list];
    [next[from], next[to]] = [next[to], next[from]];
    return next;
  };

  const translationBlock = (locale: 'en' | 'ar') => {
    const values = translations[locale];
    const id = (field: string) => `${locale}-${field}`;
    const err = (field: string) => errorText(`${locale}.${field}`);
    const text = (field: keyof ProjectTranslationValues, options: { required?: boolean; hint?: string; multiline?: number; list?: string; max: number }) => (
      <Field id={id(field)} label={t(`fields.${field}`)} hint={options.hint} error={err(field)}>
        {options.multiline ? (
          <textarea
            id={id(field)}
            rows={options.multiline}
            required={options.required}
            maxLength={options.max}
            value={values[field]}
            onChange={(event) => setTranslation(locale, field, event.target.value)}
            aria-invalid={Boolean(err(field))}
            aria-describedby={describedBy(id(field), err(field), options.hint)}
            className={`${input} border-[#decbe5] leading-6`}
          />
        ) : (
          <input
            id={id(field)}
            required={options.required}
            maxLength={options.max}
            list={options.list}
            value={values[field]}
            onChange={(event) => setTranslation(locale, field, event.target.value)}
            aria-invalid={Boolean(err(field))}
            aria-describedby={describedBy(id(field), err(field), options.hint)}
            className={`${input} border-[#decbe5]`}
          />
        )}
      </Field>
    );

    return (
      <section lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${card} space-y-4 ${locale === 'ar' ? 'text-ar' : ''}`}>
        <h2 className={heading}>{t(`sections.${locale === 'en' ? 'english' : 'arabic'}`)}</h2>
        {text('title', { required: true, max: 180 })}
        {text('category', { required: true, max: 80, list: `${locale}-categories`, hint: t('fields.categoryHint') })}
        <datalist id={`${locale}-categories`}>
          {categories[locale].map((category) => <option key={category} value={category} />)}
        </datalist>
        {text('description', { required: true, max: 5000, multiline: 5 })}
        {text('materials', { max: 2000, multiline: 2 })}
        {text('priceLabel', { max: 100, hint: t('fields.priceLabelHint') })}
        <details className="group rounded-2xl border border-[#f3e7f2] px-4 py-3" open={Boolean(err('seoTitle') || err('seoDescription'))}>
          <summary className="cursor-pointer text-sm font-medium text-[#6d4e82]">{t('sections.seo')}</summary>
          <div className="mt-3 space-y-4">
            {text('seoTitle', { max: 180 })}
            {text('seoDescription', { max: 300, multiline: 2 })}
          </div>
        </details>
      </section>
    );
  };

  const formError = errorText('form');

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />

      {state.result === 'error' && !pending && (
        <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {formError ?? t('errors.summary')}
        </p>
      )}

      <section className={`${card} grid gap-5 md:grid-cols-2`}>
        <h2 className={`${heading} md:col-span-2`}>{t('sections.basics')}</h2>
        <Field id="slug" label={t('fields.slug')} hint={t('fields.slugHint')} error={errorText('slug')}>
          <div dir="ltr" className="flex items-center rounded-2xl border border-[#decbe5] bg-[#fdf8fc] ps-4 text-sm text-[#806d87] focus-within:border-[#7b5ca8] focus-within:ring-2 focus-within:ring-[#7b5ca8]/20">
            <span aria-hidden="true">/products/</span>
            <input
              id="slug"
              required
              maxLength={160}
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
              aria-invalid={Boolean(errorText('slug'))}
              aria-describedby={describedBy('slug', errorText('slug'), t('fields.slugHint'))}
              className="min-w-0 flex-1 rounded-e-2xl bg-white px-2 py-2.5 text-[#2f1d36] outline-none"
            />
          </div>
        </Field>

        <div className="space-y-4">
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-[#4f3559]">{t('fields.status')}</legend>
            <div className="grid grid-cols-3 gap-2">
              {STATUSES.map((option) => (
                <label key={option} className="cursor-pointer">
                  <input type="radio" name="status-choice" value={option} checked={status === option} onChange={() => setStatus(option)} className="peer sr-only" />
                  <span className="block rounded-2xl border border-[#ead8ef] px-2 py-2.5 text-center text-sm font-semibold text-[#563d5f] transition peer-checked:border-[#2f1d36] peer-checked:bg-[#2f1d36] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#7b5ca8]/40">
                    {t(`statuses.${option}`)}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-[#806d87]">{t('fields.statusHint')}</p>
          </fieldset>
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-[#4f3559]">
            <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="size-4 accent-[#7b5ca8]" />
            {t('fields.featured')}
          </label>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {translationBlock('en')}
        {translationBlock('ar')}
      </div>

      <section className={`${card} space-y-4`}>
        <div>
          <h2 className={heading}>{t('sections.colors')}</h2>
          <p className="mt-1 text-xs text-[#806d87]">{t('colorsHint')}</p>
        </div>
        {errorText('colors') && <p className="text-xs font-medium text-rose-600">{errorText('colors')}</p>}
        {colors.length === 0 && <p className="text-sm text-[#806d87]">{t('noColors')}</p>}
        <ul className="space-y-3">
          {colors.map((color, index) => (
            <li key={color.uid} className="grid gap-3 rounded-2xl border border-[#f3e7f2] p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              {(['en', 'ar'] as const).map((locale) => {
                const id = `color-${index}-${locale}`;
                const error = errorText(`colors.${index}.${locale}`);
                return (
                  <Field key={locale} id={id} label={t(locale === 'en' ? 'fields.colorEn' : 'fields.colorAr')} error={error}>
                    <input
                      id={id}
                      required
                      maxLength={100}
                      lang={locale}
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                      value={color[locale]}
                      onChange={(event) => setColors((rows) => rows.map((row) => (row.uid === color.uid ? { ...row, [locale]: event.target.value } : row)))}
                      aria-invalid={Boolean(error)}
                      aria-describedby={describedBy(id, error)}
                      className={`${input} border-[#decbe5] ${locale === 'ar' ? 'text-ar' : ''}`}
                    />
                  </Field>
                );
              })}
              <button type="button" onClick={() => setColors((rows) => rows.filter((row) => row.uid !== color.uid))} className={`${smallButton} h-10`}>
                {t('removeColor')}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setColors((rows) => [...rows, { key: '', en: '', ar: '', uid: uid(), isNew: true }])} className={smallButton}>
            + {t('addColor')}
          </button>
          {unusedColors.length > 0 && (
            <select
              aria-label={t('addExistingColor')}
              value=""
              onChange={(event) => {
                const option = colorOptions.find((c) => c.key === event.target.value);
                if (option) setColors((rows) => [...rows, { ...option, uid: uid(), isNew: false }]);
              }}
              className="rounded-full border border-[#ead8ef] bg-white px-3 py-1.5 text-xs font-semibold text-[#504061]"
            >
              <option value="">{t('addExistingColor')}</option>
              {unusedColors.map((option) => (
                <option key={option.key} value={option.key}>{option.en} · {option.ar}</option>
              ))}
            </select>
          )}
        </div>
      </section>

      <section className={`${card} space-y-4`}>
        <div>
          <h2 className={heading}>{t('sections.images')}</h2>
          <p className="mt-1 text-xs text-[#806d87]">{t('imagesHint', { hosts: IMAGE_HOSTS.join(', ') })}</p>
        </div>
        {errorText('images') && <p className="text-xs font-medium text-rose-600">{errorText('images')}</p>}
        {images.length === 0 && <p className="text-sm text-[#806d87]">{t('noImages')}</p>}
        <ol className="space-y-3">
          {images.map((image, index) => {
            const urlId = `image-${index}-url`;
            const altId = `image-${index}-alt`;
            const urlError = errorText(`images.${index}.url`);
            const altError = errorText(`images.${index}.altText`);
            const update = (field: 'url' | 'altText', value: string) =>
              setImages((rows) => rows.map((row) => (row.uid === image.uid ? { ...row, [field]: value } : row)));

            return (
              <li key={image.uid} className="flex flex-col gap-3 rounded-2xl border border-[#f3e7f2] p-3 sm:flex-row">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-[#fdf3fb]">
                  {isAllowedImageUrl(image.url) ? (
                    <Image src={image.url} alt="" fill sizes="96px" className="object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center text-[10px] text-[#7a6a81]">{t('noImage')}</span>
                  )}
                  {index === 0 && <span className="absolute inset-x-1 bottom-1 rounded-full bg-[#2f1d36]/80 py-0.5 text-center text-[10px] font-semibold text-white">{t('cover')}</span>}
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <Field id={urlId} label={t('fields.imageUrl')} error={urlError}>
                    <input
                      id={urlId}
                      type="url"
                      dir="ltr"
                      required
                      maxLength={2000}
                      value={image.url}
                      onChange={(event) => update('url', event.target.value)}
                      aria-invalid={Boolean(urlError)}
                      aria-describedby={describedBy(urlId, urlError)}
                      placeholder="https://images.unsplash.com/…"
                      className={`${input} border-[#decbe5] text-start`}
                    />
                  </Field>
                  <Field id={altId} label={t('fields.altText')} hint={t('fields.altTextHint')} error={altError}>
                    <input
                      id={altId}
                      dir="auto"
                      maxLength={255}
                      value={image.altText}
                      onChange={(event) => update('altText', event.target.value)}
                      aria-invalid={Boolean(altError)}
                      aria-describedby={describedBy(altId, altError, t('fields.altTextHint'))}
                      className={`${input} border-[#decbe5]`}
                    />
                  </Field>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <button type="button" disabled={index === 0} onClick={() => setImages((rows) => move(rows, index, index - 1))} aria-label={t('moveUp')} title={t('moveUp')} className={smallButton}>↑</button>
                  <button type="button" disabled={index === images.length - 1} onClick={() => setImages((rows) => move(rows, index, index + 1))} aria-label={t('moveDown')} title={t('moveDown')} className={smallButton}>↓</button>
                  <button type="button" onClick={() => setImages((rows) => rows.filter((row) => row.uid !== image.uid))} className={smallButton}>{t('removeImage')}</button>
                </div>
              </li>
            );
          })}
        </ol>
        <button type="button" disabled={images.length >= 12} onClick={() => setImages((rows) => [...rows, { uid: uid(), url: '', altText: '' }])} className={smallButton}>
          + {t('addImage')}
        </button>
      </section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-3 rounded-full border border-[#ead8ef] bg-white/90 p-2 shadow-[0_12px_30px_rgba(47,29,54,0.12)] backdrop-blur">
        {state.result === 'error' && !pending && (
          <p className="px-3 text-sm font-medium text-rose-700">{formError ?? t('errors.summary')}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#2f1d36] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3a2945] disabled:opacity-60"
        >
          {pending ? t('saving') : isNew ? t('create') : t('save')}
        </button>
      </div>
    </form>
  );
}
