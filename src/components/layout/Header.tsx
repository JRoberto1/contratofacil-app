'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const initials = user?.email?.substring(0, 2).toUpperCase() || 'US';

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-[0_20px_40px_rgba(0,43,115,0.06)]">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform" data-icon="gavel">gavel</span>
          <span className="text-xl font-extrabold bg-gradient-to-r from-[#0040a1] to-[#0056d2] bg-clip-text text-transparent font-headline tracking-tight">ContratoFácil</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/gerar" className={`text-sm font-medium transition-colors duration-300 font-body ${pathname === '/gerar' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-slate-600 hover:text-[#0056d2]'}`}>
            Gerar Contrato
          </Link>
          <Link href="/planos" className={`text-sm font-medium transition-colors duration-300 font-body ${pathname === '/planos' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-slate-600 hover:text-[#0056d2]'}`}>
            Planos
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 md:ml-4 md:pl-4 md:border-l border-outline-variant/30">
              <Link href="/meus-contratos" className="hidden md:block text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                Meus contratos
              </Link>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="hidden md:block text-sm font-medium text-outline hover:text-error transition-colors"
              >
                Sair
              </button>
              <div className="w-10 h-10 rounded-full signature-gradient flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {initials}
              </div>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-6 py-2 rounded-full border border-outline-variant text-[#0040a1] font-bold hover:bg-surface-container-low transition-all scale-95 active:scale-90 font-label"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
