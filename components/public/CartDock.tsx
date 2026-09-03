"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInquiryCart } from '@/components/public/InquiryCartProvider';
import { projects } from '@/lib/data/site';

export function CartDock() {
  const { items, count, isOpen, openCart, closeCart, updateQuantity, removeItem, lastAdded } = useInquiryCart();
  const [mounted, setMounted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const t = useTranslations('common');
  const product = useTranslations('products');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setConfirmed(false);
    }
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {lastAdded && !isOpen && (
        <div className="rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-sm font-medium text-[#43314a] shadow-[0_18px_40px_rgba(109,79,143,0.18)] animate-[pulse_2s_ease-in-out_1]">
          {t('added', { name: product(`${projects.find((project) => project.id === lastAdded)?.slug ?? ''}.title`) })}
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

          <div className="max-h-[24rem] space-y-3 overflow-y-auto p-4">
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
                      <p className="font-semibold text-[#2f1d36]">{item.slug ? product(`${item.slug}.title`) : product(`${projects.find((project) => project.id === item.id)?.slug ?? ''}.title`)}</p>
                      <p className="text-xs text-[#765d82]">{item.slug ? product(`${item.slug}.price`) : product(`${projects.find((project) => project.id === item.id)?.slug ?? ''}.price`)}</p>
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
                        aria-label={t('decreaseQuantity', { name: item.slug ? product(`${item.slug}.title`) : item.title })}
                      >
                        −
                      </button>
                      <span className="min-w-9 text-center text-sm font-semibold text-[#2f1d36]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-9 w-9 text-lg font-medium text-[#4f3559] transition hover:bg-[#faf3ff]"
                        aria-label={t('increaseQuantity', { name: item.slug ? product(`${item.slug}.title`) : item.title })}
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

          {items.length > 0 && (
            <div className="border-t border-[#f2e7f4] bg-[#fffafc] p-4">
              <button
                type="button"
                onClick={() => setConfirmed(true)}
                className="w-full rounded-full bg-[#7b5ca8] px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_18px_35px_rgba(123,92,168,0.25)] transition hover:bg-[#6d4f9b]"
              >
                {confirmed ? t('cartConfirmed') : t('confirmCart')}
              </button>

              {confirmed && (
                <p className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700">
                  {t('cartReady')}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
