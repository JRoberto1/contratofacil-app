"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Início", icon: "home" },
  { href: "/dashboard?tab=rascunhos", label: "Rascunhos", icon: "edit_document" },
  { href: "/dashboard?tab=contratos", label: "Contratos", icon: "verified" },
  { href: "/conta", label: "Conta", icon: "person" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 bg-[#ffffff]/80 dark:bg-[#191c1e]/80 backdrop-blur-2xl docked z-50 shadow-[0px_-4px_24px_rgba(25,28,30,0.04)] md:hidden">
      {navItems.map(({ href, label, icon }) => {
        const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href.split("?")[0]));
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive 
                ? "text-[#002b73] dark:text-[#d6e3ff] after:content-[''] after:w-1 after:h-1 after:bg-[#0040a1] after:rounded-full after:mt-1 active:scale-95" 
                : "text-[#74777f] dark:text-[#8e9199] opacity-70 hover:opacity-100"
            }`}
          >
            <span className="material-symbols-outlined" style={isActive ? {fontVariationSettings: "'FILL' 1"} : undefined}>{icon}</span>
            <span className="text-[11px] font-['Inter'] font-medium uppercase tracking-wider">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
