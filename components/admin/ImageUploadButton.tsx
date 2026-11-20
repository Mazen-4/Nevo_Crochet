'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { UploadSignature } from '@/types';

/** Cloudinary's free plan rejects images over 10 MB; checking first gives a clearer message. */
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif';

type Props = {
  signUpload: () => Promise<UploadSignature | null>;
  /** How many more images the piece can take. */
  remaining: number;
  onUploaded: (url: string) => void;
  onBusyChange: (busy: boolean) => void;
};

/** Uploads photos straight from the browser to Cloudinary with a server-made signature. */
export function ImageUploadButton({ signUpload, remaining, onUploaded, onBusyChange }: Props) {
  const t = useTranslations('admin.projects.upload');
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const upload = async (fileList: FileList) => {
    const files = [...fileList].slice(0, remaining);
    const problems: string[] = [];
    if (fileList.length > remaining) problems.push(t('tooMany', { count: remaining }));

    const valid = files.filter((file) => {
      if (file.size <= MAX_BYTES) return true;
      problems.push(t('tooLarge', { name: file.name }));
      return false;
    });
    if (valid.length === 0) {
      setErrors(problems);
      return;
    }

    onBusyChange(true);
    setProgress({ done: 0, total: valid.length });
    try {
      const signature = await signUpload();
      if (!signature) {
        setErrors([t('notConfigured')]);
        return;
      }
      // One at a time, so photos land in the order they were picked.
      for (const [index, file] of valid.entries()) {
        const body = new FormData();
        for (const [key, value] of Object.entries(signature.fields)) body.append(key, value);
        body.append('file', file);
        try {
          const response = await fetch(signature.uploadUrl, { method: 'POST', body });
          const result = (await response.json()) as { secure_url?: string };
          if (!response.ok || !result.secure_url) throw new Error(`Upload failed: ${response.status}`);
          onUploaded(result.secure_url);
        } catch {
          problems.push(t('failed', { name: file.name }));
        }
        setProgress({ done: index + 1, total: valid.length });
      }
    } catch {
      problems.push(t('notConfigured'));
    } finally {
      setErrors(problems);
      setProgress(null);
      onBusyChange(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* The real input sits inside the styled label, so focus and clicks work with keyboard and mouse. */}
      <label
        aria-disabled={Boolean(progress) || remaining <= 0}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#7b5ca8] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#6d4f9b] aria-disabled:pointer-events-none aria-disabled:opacity-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#7b5ca8]/40 has-[:focus-visible]:ring-offset-2"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          disabled={Boolean(progress) || remaining <= 0}
          onChange={(event) => event.target.files?.length && upload(event.target.files)}
        />
        <span aria-hidden="true">↑</span>
        {progress ? t('uploading', { done: progress.done, total: progress.total }) : t('button')}
      </label>
      <p className="text-xs text-[#806d87]">{t('hint')}</p>
      <div role="status" aria-live="polite" className="sr-only">
        {progress ? t('uploading', { done: progress.done, total: progress.total }) : ''}
      </div>
      {errors.length > 0 && (
        <ul role="alert" className="space-y-1 text-xs font-medium text-rose-600">
          {errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}
    </div>
  );
}
