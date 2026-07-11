'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/clients', label: 'Clients' },
    { href: '/projects', label: 'Projects' },
    { href: '/tasks', label: 'Tasks' },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-4 text-lg font-semibold tracking-tight text-gray-900">
          <span className="flex h-8 w-35 items-center justify-center rounded-lg bg-gray-600 text-base text-white" aria-hidden="true">🏢 Project Tracker</span>
          
        </Link>
        <div className="flex items-center gap-4 overflow-x-auto py-2" aria-label="Primary navigation">
          {links.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
