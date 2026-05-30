import type { Metadata } from "next";
import Link from "next/link";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Pagamento Confirmado | ContratoFácil",
  description: "Seu pagamento foi confirmado.",
};

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SucessoPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let plano: string | null = null;
  let contratoId: string | null = null;

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      plano = session.metadata?.plano ?? null;
      contratoId = session.metadata?.contratoId || null;
    } catch {
      // Sessão inválida ou expirada — fallback para conteúdo genérico
    }
  }

  const isAvulso = plano === "avulso" && !!contratoId;

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center gap-6 animate-in fade-in duration-500">
      <div className="w-24 h-24 rounded-full bg-[#e8f5e9] flex items-center justify-center">
        <span
          className="material-symbols-outlined text-[#2e7d32] text-5xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
      </div>

      <div className="space-y-3 max-w-sm">
        <h1 className="text-3xl font-extrabold font-headline text-on-surface">
          {isAvulso ? "Contrato liberado!" : "Pagamento confirmado!"}
        </h1>
        <p className="text-on-surface-variant font-body leading-relaxed">
          {isAvulso
            ? "Seu pagamento foi confirmado. O contrato está pronto para download."
            : "Sua conta foi atualizada. Você já pode gerar contratos ilimitados."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        {isAvulso ? (
          <>
            <Link
              href={`/contrato/${contratoId}`}
              className="signature-gradient text-white font-bold px-8 py-3 rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all font-headline flex items-center gap-2 justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              Baixar PDF agora
            </Link>
            <Link
              href="/meus-contratos"
              className="border-2 border-primary/30 text-primary font-bold px-8 py-3 rounded-full hover:border-primary/60 hover:bg-primary/5 transition-all font-headline"
            >
              Ver meus contratos
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/meus-contratos"
              className="signature-gradient text-white font-bold px-8 py-3 rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
            >
              Ir para meus contratos
            </Link>
            <Link
              href="/gerar"
              className="border-2 border-primary/30 text-primary font-bold px-8 py-3 rounded-full hover:border-primary/60 hover:bg-primary/5 transition-all font-headline"
            >
              Gerar novo contrato
            </Link>
          </>
        )}
      </div>

      <p className="text-xs text-outline font-body mt-4">
        ContratoFácil — Um produto FlowIQ
      </p>
    </div>
  );
}
