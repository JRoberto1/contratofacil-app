import Link from "next/link";
import { ShieldCheck, Zap, Shield, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-12 md:pt-24 pb-32">
        {/* ── Hero ── */}
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Texto */}
          <div className="w-full md:w-3/5 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary-container/30 px-4 py-2 rounded-full border border-[rgba(195,198,212,0.15)]">
              <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={2.5} />
              <span
                className="text-xs font-bold uppercase tracking-widest text-on-secondary-container"
                style={{ fontFamily: "var(--font-body)" }}
              >
                2 contratos por mês grátis, sem cartão
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tight leading-[1.1]"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Pare de tomar calote —{" "}
              <span className="text-primary">formalize seu serviço</span> em 5
              minutos.
            </h1>

            {/* Subtítulo */}
            <p
              className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              A ferramenta indispensável para freelancers e MEIs que buscam
              segurança jurídica sem a complexidade da advocacia tradicional.
              Gere contratos personalizados instantaneamente.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/gerar"
                className="signature-gradient text-on-primary px-8 py-4 rounded-lg font-bold uppercase tracking-wider text-sm shadow-[0px_12px_32px_rgba(0,43,115,0.15)] hover:brightness-110 active:scale-[0.98] transition-all text-center"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Criar meu contrato grátis
              </Link>
              <Link
                href="/planos"
                className="bg-surface-container-high text-on-secondary-container px-8 py-4 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-surface-container-highest active:scale-[0.98] transition-all text-center"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Ver planos
              </Link>
            </div>
          </div>

          {/* Bento decorativo */}
          <div className="w-full md:w-2/5 relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {/* Card rascunho */}
              <div className="col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_24px_48px_rgba(25,28,30,0.04)] border border-[rgba(195,198,212,0.10)]">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 bg-primary-fixed rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <span
                    className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Rascunho
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-3/4 bg-surface-container rounded-full" />
                  <div className="h-3 w-full bg-surface-container rounded-full" />
                  <div className="h-3 w-1/2 bg-surface-container rounded-full" />
                </div>
              </div>

              {/* Card 5min */}
              <div className="signature-gradient p-6 rounded-xl text-on-primary flex flex-col justify-between aspect-square">
                <Zap className="w-8 h-8" strokeWidth={1.5} />
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-headline)" }}
                  >
                    5min
                  </p>
                  <p className="text-xs opacity-70">Geração rápida</p>
                </div>
              </div>

              {/* Card 100% */}
              <div className="bg-primary p-6 rounded-xl text-on-primary flex flex-col justify-between aspect-square">
                <Shield className="w-8 h-8" strokeWidth={1.5} />
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-headline)" }}
                  >
                    100%
                  </p>
                  <p className="text-xs opacity-70">Segurança Jurídica</p>
                </div>
              </div>
            </div>

            {/* Blobs decorativos */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary-container/20 rounded-full blur-3xl -z-10 pointer-events-none" />
          </div>
        </div>

        {/* ── Benefícios ── */}
        <section className="mt-24 md:mt-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card texto grande */}
            <div className="md:col-span-2 bg-surface-container-low rounded-2xl p-10 flex flex-col justify-center">
              <h2
                className="text-3xl font-bold text-on-surface mb-4"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                Feito para quem não tem tempo a perder
              </h2>
              <p
                className="text-on-surface-variant max-w-md leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Eliminamos o "juridiquês" e focamos no que importa: garantir
                que você receba pelo seu trabalho com documentos válidos em todo
                território nacional.
              </p>
            </div>

            {/* Card assinatura digital */}
            <div className="bg-surface-container-lowest border border-[rgba(195,198,212,0.10)] rounded-2xl p-10 flex flex-col items-center text-center">
              <Zap className="w-10 h-10 text-primary mb-4" strokeWidth={1.5} />
              <h3
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                Assinatura Digital
              </h3>
              <p
                className="text-sm text-on-surface-variant mt-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Envie para o cliente assinar direto do celular, sem papelada.
              </p>
            </div>
          </div>
        </section>

        {/* ── Planos resumidos ── */}
        <section className="mt-16 md:mt-24">
          <h2
            className="text-2xl font-bold text-on-surface mb-8 text-center"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Escolha como usar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { nome: "Grátis", preco: "R$ 0", detalhe: "2 contratos/mês" },
              {
                nome: "Avulso",
                preco: "R$ 4,90",
                detalhe: "por contrato",
                destaque: true,
                badge: "★ Popular",
              },
              { nome: "Mensal", preco: "R$ 19", detalhe: "por mês" },
              { nome: "Semestral", preco: "R$ 89", detalhe: "6 meses · -22%" },
              { nome: "Anual", preco: "R$ 159", detalhe: "por ano" },
            ].map((plano) => (
              <div
                key={plano.nome}
                className={`relative rounded-xl p-6 flex flex-col gap-2 transition-all ${
                  plano.destaque
                    ? "signature-gradient text-on-primary shadow-[0px_12px_32px_rgba(0,43,115,0.20)]"
                    : "bg-surface-container-low text-on-surface"
                }`}
              >
                {plano.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {plano.badge}
                  </span>
                )}
                <p
                  className={`text-sm font-bold uppercase tracking-wider ${plano.destaque ? "text-on-primary/70" : "text-on-surface-variant"}`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {plano.nome}
                </p>
                <p
                  className="text-2xl font-extrabold"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  {plano.preco}
                </p>
                <p
                  className={`text-xs ${plano.destaque ? "text-on-primary/70" : "text-on-surface-variant"}`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {plano.detalhe}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Link
              href="/planos"
              className="text-primary font-bold text-sm underline underline-offset-4 hover:opacity-70 transition-opacity"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Ver detalhes de todos os planos
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
