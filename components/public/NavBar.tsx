"use client";

import Link from 'next/link';
import { useInquiryCart } from '@/components/public/InquiryCartProvider';

const links = [
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export function NavBar() {
  const { count, openCart } = useInquiryCart();

  return (
    <header className="sticky top-0 z-40 border-b border-[#f0dfe8] bg-[rgba(255,248,252,0.86)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_#ffecf7,_#d9c0ff_60%,_#b091d8)] text-lg font-semibold text-[#4a2b5a] shadow-sm">
            N
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#8d6e9e]">Nevo</p>
            <p className="text-sm font-medium text-[#3f2d46]">Made slowly. Kept forever.</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#563d5f] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#9e5c96]">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={openCart}
          className="flex items-center gap-2 rounded-full bg-[#7b5ca8] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(123,92,168,0.25)] transition hover:bg-[#6e4e9b]"
        >
          <span>Cart</span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#f7d7ff] px-1.5 text-xs font-bold text-[#2f1d36]">
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
