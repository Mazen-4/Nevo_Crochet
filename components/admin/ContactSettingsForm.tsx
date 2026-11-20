'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { SettingsState } from '@/app/[locale]/admin/(protected)/settings/actions';

type Props = {
  action: (state: SettingsState, formData: FormData) => Promise<SettingsState>;
  initial: { email: string; whatsapp: string };
};

const input =
  'w-full rounded-2xl border border-[#decbe5] bg-white px-4 py-2.5 text-start text-sm text-[#2f1d36] outline-none placeholder:text-[#806f88] focus:border-[#7b5ca8] focus:ring-2 focus:ring-[#7b5ca8]/20 aria-[invalid=true]:border-rose-400';

export function ContactSettingsForm({ action, initial }: Props) {
  const t = useTranslations('admin.settings');
  const [state, formAction, pending] = useActionState(action, {});
  const [email, setEmail] = useState(initial.email);
  const [whatsapp, setWhatsapp] = useState(initial.whatsapp);
  const digits = whatsapp.replace(/\D/g, '');

  const fields = [
    { name: 'email', type: 'email', value: email, set: setEmail, placeholder: 'hello@example.com', invalid: state.errors?.email },
    { name: 'whatsapp', type: 'tel', value: whatsapp, set: setWhatsapp, placeholder: '+962 7 9123 4567', invalid: state.errors?.whatsapp },
  ] as const;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={`setting-${field.name}`} className="mb-1.5 block text-sm font-medium text-[#4f3559]">{t(`${field.name}.label`)}</label>
          <input
            id={`setting-${field.name}`}
            name={field.name}
            type={field.type}
            dir="ltr"
            value={field.value}
            onChange={(event) => field.set(event.target.value)}
            placeholder={field.placeholder}
            aria-invalid={Boolean(field.invalid)}
            aria-describedby={`setting-${field.name}-hint`}
            className={input}
          />
          <p id={`setting-${field.name}-hint`} className={`mt-1.5 text-xs leading-5 ${field.invalid ? 'font-medium text-rose-600' : 'text-[#806d87]'}`}>
            {field.invalid ? t(`${field.name}.error`) : t(`${field.name}.hint`)}
          </p>
        </div>
      ))}

      {digits.length >= 8 && (
        <p className="text-xs text-[#806d87]">
          {t('whatsapp.test')}{' '}
          <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" dir="ltr" className="font-semibold text-[#6d4e82] underline">wa.me/{digits}</a>
        </p>
      )}

      <button type="submit" disabled={pending} className="w-full rounded-full bg-[#2f1d36] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3a2945] disabled:opacity-60 sm:w-auto">
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
