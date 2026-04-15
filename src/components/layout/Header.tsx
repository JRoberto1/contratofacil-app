"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-[#f7f9fb]/80 dark:bg-[#191c1e]/80 backdrop-blur-xl docked full-width top-0 sticky z-50 flex justify-between items-center px-6 py-4 w-full">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#002b73] dark:text-[#d6e3ff]">gavel</span>
        <span className="text-xl font-extrabold text-[#002b73] dark:text-[#d6e3ff] font-['Manrope'] tracking-tight">ContratoFácil</span>
      </div>
      
      {/* Nav desktop */}
      <div className="hidden md:flex gap-8 items-center">
        <nav className="flex gap-6">
          <Link
            href="/"
            className={`${pathname === '/' ? 'text-[#002b73] dark:text-[#d6e3ff] font-bold active:scale-[0.98]' : 'text-[#44474e] dark:text-[#c3c6d4] hover:bg-[#e6e8ea] dark:hover:bg-[#44474e] rounded-lg px-2 py-1'} transition-all duration-200`}
          >
            Início
          </Link>
          <Link
            href="/planos"
            className={`${pathname === '/planos' ? 'text-[#002b73] dark:text-[#d6e3ff] font-bold active:scale-[0.98]' : 'text-[#44474e] dark:text-[#c3c6d4] hover:bg-[#e6e8ea] dark:hover:bg-[#44474e] rounded-lg px-2 py-1'} transition-all duration-200`}
          >
            Planos
          </Link>
          <Link
            href="/dashboard"
            className={`${pathname === '/dashboard' ? 'text-[#002b73] dark:text-[#d6e3ff] font-bold active:scale-[0.98]' : 'text-[#44474e] dark:text-[#c3c6d4] hover:bg-[#e6e8ea] dark:hover:bg-[#44474e] rounded-lg px-2 py-1'} transition-all duration-200`}
          >
            Rascunhos
          </Link>
        </nav>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
          <img alt="User profile photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzz3EN73LNuXnHxJyGE4wnsXny88sEmvocXwm_UDeBfs_4POCakh87WtGTCg8K3kdlOCqLcUXB57Cs2vQ4RFgfkv0CBu3VQSOdJhf2nUnP4qumsAv1Z-qmhN68ocF6zNeTF5-iW7U-4lHLTOVQApxx_raXeem_NxQY6X9g3ntKODJS0FVj43Ni1LEynrXMpDYVyjg9egKWjGlCAAySJ5N-hc4SLUciBUEx9tP3TFNHO1lm7-4zRJbbxHZ_ehbTP_HB1nnHJCyLsQPP" />
        </div>
      </div>
      
      {/* Mobile Avatar */}
      <div className="md:hidden w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
        <img alt="User profile photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzz3EN73LNuXnHxJyGE4wnsXny88sEmvocXwm_UDeBfs_4POCakh87WtGTCg8K3kdlOCqLcUXB57Cs2vQ4RFgfkv0CBu3VQSOdJhf2nUnP4qumsAv1Z-qmhN68ocF6zNeTF5-iW7U-4lHLTOVQApxx_raXeem_NxQY6X9g3ntKODJS0FVj43Ni1LEynrXMpDYVyjg9egKWjGlCAAySJ5N-hc4SLUciBUEx9tP3TFNHO1lm7-4zRJbbxHZ_ehbTP_HB1nnHJCyLsQPP" />
      </div>
    </header>
  );
}
