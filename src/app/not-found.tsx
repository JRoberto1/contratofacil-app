import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center gap-6 animate-in fade-in duration-500">
      <div className="w-24 h-24 rounded-full bg-primary/8 flex items-center justify-center mb-2">
        <span className="material-symbols-outlined text-primary text-5xl">search_off</span>
      </div>

      <div className="space-y-3 max-w-sm">
        <h1 className="text-4xl font-extrabold font-headline text-primary">404</h1>
        <h2 className="text-xl font-bold font-headline text-on-surface">Página não encontrada</h2>
        <p className="text-on-surface-variant font-body leading-relaxed">
          O endereço que você acessou não existe ou foi removido.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link
          href="/"
          className="signature-gradient text-white font-bold px-8 py-3 rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
        >
          Ir para o início
        </Link>
        <Link
          href="/gerar"
          className="border-2 border-primary/30 text-primary font-bold px-8 py-3 rounded-full hover:border-primary/60 hover:bg-primary/5 transition-all font-headline"
        >
          Gerar contrato
        </Link>
      </div>

      <p className="text-xs text-outline font-body mt-4">ContratoFácil — Um produto FlowIQ</p>
    </div>
  );
}
