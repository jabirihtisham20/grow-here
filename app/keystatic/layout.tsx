import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grow Here Admin | Keystatic CMS',
  description: 'Editorial Admin Content Management System for Grow Here',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-auto text-slate-900">
      {children}
    </div>
  );
}
