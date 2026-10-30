'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import type { InquiryStatus } from '@prisma/client';
import type { InquiryUpdateState } from '@/app/[locale]/admin/(protected)/inquiries/actions';

type Props = {
  action: (state: InquiryUpdateState, formData: FormData) => Promise<InquiryUpdateState>;
  status: InquiryStatus;
  statuses: Array<{ value: InquiryStatus; label: string }>;
  adminNotes: string;
};

export function InquiryUpdateForm({ action, status, statuses, adminNotes }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const t = useTranslations('admin.inquiries');

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-[#4f3559]">{t('status')}</legend>
        <div className="grid grid-cols-2 gap-2">
          {statuses.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input type="radio" name="status" value={option.value} defaultChecked={option.value === status} className="peer sr-only" />
              <span className="block rounded-2xl border border-[#ead8ef] px-3 py-2.5 text-center text-sm font-semibold text-[#563d5f] transition peer-checked:border-[#2f1d36] peer-checked:bg-[#2f1d36] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#7b5ca8]/40">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="admin-notes" className="mb-2 block text-sm font-medium text-[#4f3559]">{t('notes')}</label>
        <textarea
          id="admin-notes"
          name="adminNotes"
          rows={5}
          maxLength={5000}
          defaultValue={adminNotes}
          dir="auto"
          placeholder={t('notesPlaceholder')}
          className="w-full rounded-2xl border border-[#decbe5] bg-white px-4 py-3 text-sm text-[#2f1d36] outline-none placeholder:text-[#927e9a] focus:border-[#7b5ca8] focus:ring-2 focus:ring-[#7b5ca8]/20"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#2f1d36] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3a2945] disabled:opacity-60"
      >
        {pending ? t('saving') : t('save')}
      </button>

      {state.result && !pending && (
        <p
          role={state.result === 'error' ? 'alert' : 'status'}
          className={`rounded-2xl border px-4 py-2.5 text-sm ${state.result === 'saved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}
        >
          {state.result === 'saved' ? t('saved') : t('saveError')}
        </p>
      )}
    </form>
  );
}
