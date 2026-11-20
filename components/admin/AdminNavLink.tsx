'use client';

import type { ReactNode } from 'react';
import { Link, usePathname } from '@/i18n/navigation';

/** Header tab that highlights itself on its own section, including nested pages. */
export function AdminNavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${active ? 'bg-[#f4ebff] text-[#504061]' : 'text-[#6d4e82] hover:bg-[#fff8fc]'}`}
    >
      {children}
    </Link>
  );
}
