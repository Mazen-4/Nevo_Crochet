import type { ReactNode } from 'react';

/** Centered message card for 404 and error screens. No hooks, so both server and client boundaries can use it. */
export function StatePanel({ code, title, text, children }: { code: string; title: string; text: string; children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#fffafc] px-5 py-20 text-[#2f1d36]">
      <div className="w-full max-w-lg rounded-[2rem] border border-[#efdff2] bg-white p-8 text-center shadow-[0_24px_60px_rgba(140,111,160,0.08)] md:p-10">
        <p
          aria-hidden="true"
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_#ffecf7,_#d9c0ff_60%,_#b091d8)] text-lg font-semibold text-[#4a2b5a]"
        >
          {code}
        </p>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.05em]">{title}</h1>
        <p className="mt-3 leading-7 text-[#5f4b67]">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </main>
  );
}

export const primaryAction =
  'rounded-full bg-[#7b5ca8] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(123,92,168,0.2)] transition hover:bg-[#6d4f9b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7b5ca8]/40 focus-visible:ring-offset-2';
export const secondaryAction =
  'rounded-full border border-[#ead8ef] bg-white px-5 py-2.5 text-sm font-semibold text-[#4f3559] transition hover:bg-[#fff8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7b5ca8]/40 focus-visible:ring-offset-2';
