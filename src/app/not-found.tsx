import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-surface animate-in fade-in duration-500">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4 font-headline">
        Página não encontrada
      </p>
      <h1 className="text-3xl md:text-5xl font-headline font-extrabold mb-4 text-on-surface text-center">
        Ops, essa página não existe
      </h1>
      <p className="text-on-surface-variant font-body mb-8 text-center max-w-md leading-relaxed">
        O link pode estar errado, ou o contrato que você está procurando não existe ou foi removido.
      </p>
      <Link href="/meus-contratos" className="signature-gradient text-white px-8 py-4 rounded-full font-bold font-headline shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
        Voltar para a Segurança
      </Link>
    </main>
  );
}
