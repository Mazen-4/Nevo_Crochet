import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nevo Studio',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-[#fffafc] text-[#2f1d36]">{children}</div>;
}
