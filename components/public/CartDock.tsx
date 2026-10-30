"use client";

import { FormEvent, useState, useSyncExternalStore } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useInquiryCart } from '@/components/public/InquiryCartProvider';
import type { CatalogEntry } from '@/types';

const emptySubscribe = () => () => {};

type Step = 'cart' | 'details' | 'sent';
type Status = 'idle' | 'sending' | 'error';

const inputClass = 'w-full rounded-2xl border border-[#decbe5] bg-white px-4 py-2.5 text-sm text-[#2f1d36] outline-none placeholder:text-[#927e9a] focus:border-[#7b5ca8] focus:ring-2 focus:ring-[#7b5ca8]/20';

export function CartDock({ catalog }: { catalog: CatalogEntry[] }) {
  const { items: savedItems, isOpen, openCart, closeCart, updateQuantity, removeItem, clearCart, lastAdded } = useInquiryCart();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [step, setStep] = useState<Step>('cart');
  const [status, setStatus] = useState<Status>('idle');
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations('common');
  const home = useTranslations('home');

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setStep('cart');
      setStatus('idle');
    }
  }

  if (!mounted) {
    return null;
  }

  const byId = new Map(catalog.map((entry) => [entry.id, entry]));
  // Hide lines for pieces that are no longer published.
  const items = savedItems.filter((item) => byId.has(item.id));
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const titleOf = (id: string) => byId.get(id)?.title ?? '';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus('sending');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'QUESTION',
          name: data.get('name'),
          email: data.get('email'),
          question: data.get('note'),
          locale,
          items: items.map((item) => ({ projectId: item.id, quantity: item.quantity })),
        }),
      });
      if (!response.ok) throw new Error(`Inquiry failed: ${response.status}`);
      clearCart();
      setStep('sent');
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {lastAdded && !isOpen && (
        <div className="rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-sm font-medium text-[#43314a] shadow-[0_18px_40px_rgba(109,79,143,0.18)] animate-[pulse_2s_ease-in-out_1]">
          {t('added', { name: titleOf(lastAdded) })}
        </div>
      )}

      <button
        type="button"
        onClick={() => (isOpen ? closeCart() : openCart())}
        className="group relative flex items-center gap-3 rounded-full bg-[#2f1d36] px-5 py-3 text-sm font-semibold text-white shadow-[0_24px_60px_rgba(43,25,53,0.28)] transition hover:-translate-y-0.5 hover:bg-[#3a2945]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base">🛒</span>
        <span>{t('cart')}</span>
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#f7d7ff] px-1.5 text-xs font-bold text-[#2f1d36]">
          {count}
        </span>
      </button>

      {isOpen && (
        <div className="w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] border border-[#eedaf1] bg-white shadow-[0_30px_80px_rgba(82,54,95,0.18)]">
          <div className="flex items-center justify-between border-b border-[#f3e7f2] bg-[#fffafc] px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6e9e]">{t('cart')}</p>
              <h3 className="mt-1 text-xl font-semibold text-[#2f1d36]">{count} {count === 1 ? t('item') : t('items')}</h3>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-full bg-[#f4ebff] px-3 py-1.5 text-xs font-semibold text-[#504061] transition hover:bg-[#e9dcff]"
            >
              {t('close')}
            </button>
          </div>

          {step === 'sent' ? (
            <p role="status" className="m-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">
              {t('cartSent')}
            </p>
          ) : (
            <div className="max-h-[min(24rem,40vh)] space-y-3 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="rounded-[1.25rem] border border-dashed border-[#e5d5ec] bg-[#fffafc] p-5 text-center">
                  <p className="text-base font-semibold text-[#4a2f58]">{t('cartEmpty')}</p>
                  <p className="mt-2 text-sm text-[#6f5877]">{t('cartEmptyHint')}</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="rounded-[1.25rem] border border-[#eedaf1] bg-[#fffafc] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#2f1d36]">{titleOf(item.id)}</p>
                        <p className="text-xs text-[#765d82]">{byId.get(item.id)?.priceLabel}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-semibold text-[#8d5f7d] hover:text-[#6d3f63]"
                      >
                        {t('remove')}
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center overflow-hidden rounded-full border border-[#ead8ef] bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-9 w-9 text-lg font-medium text-[#4f3559] transition hover:bg-[#faf3ff]"
                          aria-label={t('decreaseQuantity', { name: titleOf(item.id) })}
                        >
                          −
                        </button>
                        <span className="min-w-9 text-center text-sm font-semibold text-[#2f1d36]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-9 w-9 text-lg font-medium text-[#4f3559] transition hover:bg-[#faf3ff]"
                          aria-label={t('increaseQuantity', { name: titleOf(item.id) })}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-[#5d4765]">{t('quantity', { count: item.quantity })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {step === 'cart' && items.length > 0 && (
            <div className="border-t border-[#f2e7f4] bg-[#fffafc] p-4">
              <button
                type="button"
                onClick={() => {
                  openCart();
                  setStep('details');
                }}
                className="w-full rounded-full bg-[#7b5ca8] px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_18px_35px_rgba(123,92,168,0.25)] transition hover:bg-[#6d4f9b]"
              >
                {t('confirmCart')}
              </button>
            </div>
          )}

          {step === 'details' && items.length > 0 && (
            <form onSubmit={handleSubmit} className="space-y-3 border-t border-[#f2e7f4] bg-[#fffafc] p-4">
              <p className="text-sm font-medium text-[#4a2f58]">{t('cartReady')}</p>
              <label htmlFor="cart-name" className="sr-only">{home('name')}</label>
              <input id="cart-name" name="name" required maxLength={120} autoComplete="name" placeholder={home('namePlaceholder')} className={inputClass} />
              <label htmlFor="cart-email" className="sr-only">{home('emailAddress')}</label>
              <input id="cart-email" name="email" type="email" required maxLength={255} autoComplete="email" placeholder={home('emailPlaceholder')} className={inputClass} />
              <label htmlFor="cart-note" className="sr-only">{t('cartNote')}</label>
              <textarea id="cart-note" name="note" rows={2} maxLength={5000} placeholder={t('cartNote')} className={inputClass} />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-full bg-[#7b5ca8] px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_18px_35px_rgba(123,92,168,0.25)] transition hover:bg-[#6d4f9b] disabled:opacity-60"
              >
                {status === 'sending' ? t('sending') : t('sendCart')}
              </button>
              {status === 'error' && (
                <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-sm text-rose-700">
                  {t('submitError')}
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
