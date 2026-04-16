'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  const navItems = [
    { label: 'Início', icon: 'home', href: '/' },
    { label: 'Rascunhos', icon: 'description', href: '/rascunhos' },
    { label: 'Contratos', icon: 'history_edu', href: '/meus-contratos' },
    { label: 'Conta', icon: 'person', href: '/login' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-[#f8f9fb]/80 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,43,115,0.04)] rounded-t-3xl z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/meus-contratos' && pathname.startsWith('/gerar'));
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive 
                ? "text-[#0040a1] after:content-[''] after:w-1 after:h-1 after:bg-[#0040a1] after:rounded-full after:mt-1" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 font-label`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
