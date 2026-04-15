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
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-2 bg-[#ffffff]/80 backdrop-blur-2xl z-50 shadow-[0px_-4px_24px_rgba(25,28,30,0.04)] md:hidden">
      {navItems.map(({ href, label, icon }) => {
        const base = href.split("?")[0];
        const isActive = pathname === href || (base !== "/" && pathname?.startsWith(base));
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center transition-all active:scale-95 ${
              isActive
                ? "text-[#002b73]"
                : "text-[#74777f] opacity-70 hover:opacity-100"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="text-[11px] font-['Inter'] font-medium uppercase tracking-wider mt-0.5">
              {label}
            </span>
            {isActive && (
              <span className="w-1 h-1 bg-[#0040a1] rounded-full mt-1" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
