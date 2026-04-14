"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, ShieldCheck, User } from "lucide-react";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/dashboard?tab=rascunhos", label: "Rascunhos", icon: FileText },
  { href: "/dashboard?tab=contratos", label: "Contratos", icon: ShieldCheck },
  { href: "/conta", label: "Conta", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full md:hidden z-50 flex justify-around items-center pt-2 pb-4 bg-surface-container-lowest/80 backdrop-blur-2xl shadow-[0px_-4px_24px_rgba(25,28,30,0.04)] border-t border-[rgba(195,198,212,0.15)]">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href.split("?")[0]));
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-all active:scale-95 ${
              isActive ? "text-primary" : "text-on-surface-variant opacity-60"
            }`}
          >
            <Icon
              className="w-5 h-5"
              strokeWidth={isActive ? 2.5 : 1.8}
              fill={isActive ? "currentColor" : "none"}
            />
            <span
              className="text-[10px] font-medium uppercase tracking-wider"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {label}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-primary-container mt-0.5" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
