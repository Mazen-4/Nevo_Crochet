'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import type { LoginState } from '@/app/[locale]/admin/actions';

const inputClass = 'w-full rounded-2xl border border-[#decbe5] bg-white px-4 py-3 text-sm text-[#2f1d36] outline-none focus:border-[#7b5ca8] focus:ring-2 focus:ring-[#7b5ca8]/20';

export function LoginForm({ action }: { action: (state: LoginState, formData: FormData) => Promise<LoginState> }) {
  const [state, formAction, pending] = useActionState(action, {});
  const t = useTranslations('admin.login');

  return (
    <form action={formAction} className="mt-7 space-y-4">
      <div>
        <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-[#4f3559]">{t('email')}</label>
        <input id="admin-email" name="email" type="email" required autoComplete="username" dir="ltr" className={inputClass} />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-[#4f3559]">{t('password')}</label>
        <input id="admin-password" name="password" type="password" required maxLength={200} autoComplete="current-password" dir="ltr" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#7b5ca8] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(123,92,168,0.25)] transition hover:bg-[#6d4f9b] disabled:opacity-60"
      >
        {pending ? t('submitting') : t('submit')}
      </button>
      {state.error && (
        <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {t(state.error)}
        </p>
      )}
    </form>
  );
}
