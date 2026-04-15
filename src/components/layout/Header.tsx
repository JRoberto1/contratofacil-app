"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-[#f7f9fb]/80 backdrop-blur-xl top-0 sticky z-50 flex justify-between items-center px-6 py-4 w-full shadow-[0px_1px_0px_rgba(25,28,30,0.05)]">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#002b73]">gavel</span>
        <span className="text-xl font-extrabold text-[#002b73] font-['Manrope'] tracking-tight">ContratoFácil</span>
      </div>

      {/* Nav desktop */}
      <div className="hidden md:flex gap-8 items-center">
        <nav className="flex gap-6">
          <Link
            href="/"
            className={`transition-all duration-200 ${
              pathname === "/"
                ? "text-[#002b73] font-bold"
                : "text-[#44474e] hover:bg-[#e6e8ea] rounded-lg px-2 py-1"
            }`}
          >
            Início
          </Link>
          <Link
            href="/planos"
            className={`transition-all duration-200 ${
              pathname === "/planos"
                ? "text-[#002b73] font-bold"
                : "text-[#44474e] hover:bg-[#e6e8ea] rounded-lg px-2 py-1"
            }`}
          >
            Planos
          </Link>
          <Link
            href="/dashboard"
            className={`transition-all duration-200 ${
              pathname?.startsWith("/dashboard")
                ? "text-[#002b73] font-bold"
                : "text-[#44474e] hover:bg-[#e6e8ea] rounded-lg px-2 py-1"
            }`}
          >
            Rascunhos
          </Link>
        </nav>
        <div className="w-8 h-8 rounded-full bg-[#e0e3e5] overflow-hidden flex items-center justify-center">
          <span className="material-symbols-outlined text-[#747784] text-base">person</span>
        </div>
      </div>

      {/* Mobile: só ícone de perfil */}
      <div className="md:hidden w-8 h-8 rounded-full bg-[#e0e3e5] overflow-hidden flex items-center justify-center">
        <span className="material-symbols-outlined text-[#747784] text-base">person</span>
      </div>
    </header>
  );
}
