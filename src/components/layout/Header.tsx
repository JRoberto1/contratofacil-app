"use client";

import Link from "next/link";
import { Scale } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full flex justify-between items-center px-6 py-4 glass-header border-b border-[rgba(195,198,212,0.15)]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Scale className="text-primary w-5 h-5" strokeWidth={2.5} />
        <span
          className="text-xl font-extrabold text-primary tracking-tight"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          ContratoFácil
        </span>
      </Link>

      {/* Nav desktop */}
      <div className="hidden md:flex gap-8 items-center">
        <nav className="flex gap-1">
          <Link
            href="/"
            className="text-primary font-bold px-3 py-2 rounded-lg text-sm transition-all"
          >
            Início
          </Link>
          <Link
            href="/dashboard"
            className="text-on-surface-variant px-3 py-2 rounded-lg text-sm hover:bg-surface-container-high transition-colors"
          >
            Rascunhos
          </Link>
          <Link
            href="/dashboard"
            className="text-on-surface-variant px-3 py-2 rounded-lg text-sm hover:bg-surface-container-high transition-colors"
          >
            Contratos
          </Link>
        </nav>
        <Link
          href="/gerar"
          className="signature-gradient text-on-primary px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Criar contrato
        </Link>
      </div>

      {/* Botão mobile */}
      <Link
        href="/gerar"
        className="md:hidden signature-gradient text-on-primary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
      >
        Criar
      </Link>
    </header>
  );
}
