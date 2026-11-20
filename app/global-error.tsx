'use client';

import './[locale]/globals.css';

/**
 * Shown only if the root layout itself fails, so it renders its own <html>/<body>
 * and has no translations — the copy is in both languages.
 */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#fffafc] px-5 font-sans text-[#2f1d36]">
        <main className="max-w-lg text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.05em]">Something went wrong</h1>
          <p lang="ar" dir="rtl" className="mt-2 text-2xl font-semibold">حدث خطأ ما</p>
          <p className="mt-4 leading-7 text-[#5f4b67]">Please try again in a moment. · يُرجى المحاولة مرة أخرى بعد قليل.</p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-8 rounded-full bg-[#7b5ca8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6d4f9b]"
          >
            Try again · حاول مجدداً
          </button>
        </main>
      </body>
    </html>
  );
}
