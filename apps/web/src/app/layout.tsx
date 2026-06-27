import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

const nav = [
  { href: '/extract', label: 'Extract' },
  { href: '/nourish', label: 'Nourish' },
  { href: '/settings', label: 'Settings' }
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="grid min-h-screen grid-cols-[220px_1fr]">
          <aside className="border-r border-neutral-200 bg-neutral-50">
            <div className="border-b border-neutral-200 px-4 py-4">
              <Link href="/" className="text-sm font-semibold tracking-tight">
                customerly
              </Link>
            </div>
            <nav className="flex flex-col gap-1 p-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
