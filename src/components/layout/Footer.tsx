import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center justify-center py-8 px-4 pb-28 md:pb-8 bg-surface opacity-60">
      <div className="flex gap-6 mb-3">
        <Link
          href="/termos"
          className="text-[10px] text-on-surface-variant hover:text-primary transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Termos
        </Link>
        <Link
          href="/privacidade"
          className="text-[10px] text-on-surface-variant hover:text-primary transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Privacidade
        </Link>
      </div>
      <p
        className="text-[10px] text-on-surface-variant"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Um produto FlowIQ · © 2026 FlowIQ. Todos os direitos reservados.
      </p>
    </footer>
  );
}
