'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import type { DeleteProjectState } from '@/app/[locale]/admin/(protected)/projects/actions';

export function DeleteProjectForm({ action }: { action: (state: DeleteProjectState, formData: FormData) => Promise<DeleteProjectState> }) {
  const t = useTranslations('admin.projects');
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(t('deleteConfirm'))) event.preventDefault();
      }}
      className="space-y-3"
    >
      <p className="text-sm leading-6 text-[#6f5877]">{t('deleteHint')}</p>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
      >
        {pending ? t('deleting') : t('delete')}
      </button>
      {state.error && !pending && (
        <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
          {t(state.error === 'inUse' ? 'deleteInUse' : 'deleteFailed')}
        </p>
      )}
    </form>
  );
}
