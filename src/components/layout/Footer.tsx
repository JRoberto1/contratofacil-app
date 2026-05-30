"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  return (
    <footer className="bg-surface-container-low w-full py-12 pb-24 md:pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto border-t border-outline-variant/15 pt-8">
        <div className="mb-4 md:mb-0">
          <p className="text-xs font-medium font-body text-slate-500 opacity-70">
            ContratoFácil — Um produto FlowIQ © {new Date().getFullYear()}
          </p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-xs font-medium font-body text-slate-500 hover:text-primary transition-opacity">Termos</a>
          <Link href="/politica-de-privacidade" className="text-xs font-medium font-body text-slate-500 hover:text-primary transition-opacity">Privacidade</Link>
          <a href="#" className="text-xs font-medium font-body text-slate-500 hover:text-primary transition-opacity">Ajuda</a>
        </div>
      </div>
    </footer>
  );
}
