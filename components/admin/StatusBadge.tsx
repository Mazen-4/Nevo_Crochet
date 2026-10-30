import type { InquiryStatus } from '@prisma/client';

const styles: Record<InquiryStatus, string> = {
  NEW: 'bg-[#7b5ca8] text-white',
  CONTACTED: 'bg-[#f4ebff] text-[#504061]',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  ARCHIVED: 'bg-[#f3eef4] text-[#806d87]',
};

export function StatusBadge({ status, label }: { status: InquiryStatus; label: string }) {
  return <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}>{label}</span>;
}
