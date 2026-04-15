'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Início', icon: 'home', href: '/' },
    { label: 'Contratos', icon: 'description', href: '/meus-contratos' },
    { label: 'Rascunhos', icon: 'edit_document', href: '/rascunhos' },
    { label: 'Conta', icon: 'person', href: '/login' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest/90 backdrop-blur-xl border-t z-50 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/meus-contratos' && pathname.startsWith('/gerar'));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors relative ${isActive ? 'text-primary' : 'text-outline hover:text-on-surface'}`}
            >
              {isActive && (
                <span className="absolute top-1 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
              <span className={`material-symbols-outlined text-2xl ${isActive ? 'font-medium' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
