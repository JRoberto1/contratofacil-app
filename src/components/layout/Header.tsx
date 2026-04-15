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
    <header className="fixed top-0 w-full z-50 glass-header border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-[28px] bg-cta-gradient bg-clip-text text-transparent group-hover:scale-110 transition-transform">
            gavel
          </span>
          <span className="font-heading font-extrabold text-xl tracking-tight bg-cta-gradient bg-clip-text text-transparent">
            ContratoFácil
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/gerar" className="text-sm font-medium hover:text-primary transition-colors text-on-surface">
            Gerar Contrato
          </Link>
          <Link href="/planos" className="text-sm font-medium hover:text-primary transition-colors text-on-surface">
            Planos
          </Link>
          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l">
              <Link href="/meus-contratos" className="text-sm font-medium hover:text-primary transition-colors">
                Meus contratos
              </Link>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="text-sm font-medium text-outline hover:text-error transition-colors"
              >
                Sair
              </button>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {initials}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l">
              <Link 
                href="/login" 
                className="text-sm font-semibold text-primary border border-primary px-5 py-2 rounded-full hover:bg-primary/5 transition-colors"
              >
                Entrar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
