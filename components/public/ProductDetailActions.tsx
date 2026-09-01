"use client";

import Link from 'next/link';
import { useInquiryCart } from '@/components/public/InquiryCartProvider';
import type { Project } from '@/types';

export function ProductDetailActions({ project }: { project: Project }) {
  const { addItem } = useInquiryCart();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => addItem(project)}
        className="flex-1 rounded-full bg-[#7b5ca8] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(123,92,168,0.25)] transition hover:bg-[#6d4f9b]"
      >
        Add to cart
      </button>
      <Link
        href="#contact"
        className="flex-1 rounded-full border border-[#e4d0ea] bg-white px-5 py-3.5 text-center text-sm font-semibold text-[#4f3559] transition hover:bg-[#fff8fc]"
      >
        Ask a question
      </Link>
    </div>
  );
}
