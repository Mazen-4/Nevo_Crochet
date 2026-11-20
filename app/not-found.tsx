import Link from 'next/link';
import { primaryAction, StatePanel } from '@/components/public/StatePanel';

/**
 * Last-resort 404 for requests that never reach a locale (no translations are loaded here),
 * so the copy is shown in both languages.
 */
export default function RootNotFound() {
  return (
    <StatePanel code="404" title="Page not found · الصفحة غير موجودة" text="This page doesn’t exist or has moved. · هذه الصفحة غير موجودة أو تم نقلها.">
      <Link href="/en" className={primaryAction}>Home</Link>
      <Link href="/ar" lang="ar" dir="rtl" className={`${primaryAction} font-cairo`}>الرئيسية</Link>
    </StatePanel>
  );
}
