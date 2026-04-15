import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low py-8 mt-auto border-t">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
        <div className="font-sans text-[10px] text-outline uppercase tracking-[0.2em] font-medium">
          Um produto FlowIQ
        </div>
        <div className="flex items-center gap-4 text-xs text-outline-variant font-medium">
          <Link href="#" className="hover:text-primary transition-colors">Termos</Link>
          <span>·</span>
          <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
