import Link from "next/link";
import { ShieldCheck, Zap, Shield, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f7f9fb" }}>
      <Header />

      <main className="flex-1 w-full px-6 pt-12 md:pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* ── Hero ── */}
          <div className="flex flex-col md:flex-row gap-12 items-center">

            {/* Texto esquerdo */}
            <div className="w-full md:w-3/5 space-y-8">

              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: "rgba(173,195,254,0.25)",
                  border: "1px solid rgba(195,198,212,0.20)",
                }}
              >
                <ShieldCheck className="w-4 h-4" style={{ color: "#002b73" }} strokeWidth={2.5} />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-body)", color: "#394f83" }}
                >
                  2 contratos por mês grátis, sem cartão
                </span>
              </div>

              {/* Headline */}
              <h1
                className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
                style={{ fontFamily: "var(--font-headline)", color: "#191c1e" }}
              >
                Pare de tomar calote —{" "}
                <span style={{ color: "#002b73" }}>formalize seu serviço</span> em 5 minutos.
              </h1>

              {/* Subtítulo */}
              <p
                className="text-lg md:text-xl max-w-2xl leading-relaxed"
                style={{ fontFamily: "var(--font-body)", color: "#434652" }}
              >
                A ferramenta indispensável para freelancers e MEIs que buscam
                segurança jurídica sem a complexidade da advocacia tradicional.
                Gere contratos personalizados instantaneamente.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/gerar"
                  className="signature-gradient px-8 py-4 rounded-lg font-bold uppercase tracking-wider text-sm hover:brightness-110 active:scale-[0.98] transition-all text-center"
                  style={{ fontFamily: "var(--font-body)", color: "#ffffff", boxShadow: "0px 12px 32px rgba(0,43,115,0.15)" }}
                >
                  Criar meu contrato grátis
                </Link>
                <Link
                  href="/planos"
                  className="px-8 py-4 rounded-lg font-bold uppercase tracking-wider text-sm active:scale-[0.98] transition-all text-center"
                  style={{ fontFamily: "var(--font-body)", backgroundColor: "#e6e8ea", color: "#394f83" }}
                >
                  Ver planos
                </Link>
              </div>
            </div>

            {/* Bento decorativo direito */}
            <div className="w-full md:w-2/5 relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-2 gap-4">

                {/* Card rascunho */}
                <div
                  className="col-span-2 p-8 rounded-xl"
                  style={{ backgroundColor: "#ffffff", boxShadow: "0px 24px 48px rgba(25,28,30,0.04)", border: "1px solid rgba(195,198,212,0.10)" }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#dae2ff" }}
                    >
                      <FileText className="w-5 h-5" style={{ color: "#002b73" }} />
                    </div>
                    <span
                      className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter"
                      style={{ fontFamily: "var(--font-body)", backgroundColor: "#adc3fe", color: "#394f83" }}
                    >
                      Rascunho
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-3/4 rounded-full" style={{ backgroundColor: "#eceef0" }} />
                    <div className="h-3 w-full rounded-full" style={{ backgroundColor: "#eceef0" }} />
                    <div className="h-3 w-1/2 rounded-full" style={{ backgroundColor: "#eceef0" }} />
                  </div>
                </div>

                {/* Card 5min — gradiente com texto branco explícito */}
                <div
                  className="signature-gradient p-6 rounded-xl flex flex-col justify-between aspect-square"
                  style={{ color: "#ffffff" }}
                >
                  <Zap className="w-8 h-8" strokeWidth={1.5} style={{ color: "#ffffff" }} />
                  <div>
                    <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-headline)", color: "#ffffff" }}>
                      5min
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.70)" }}>Geração rápida</p>
                  </div>
                </div>

                {/* Card 100% — bg-primary com texto branco explícito */}
                <div
                  className="p-6 rounded-xl flex flex-col justify-between aspect-square"
                  style={{ backgroundColor: "#002b73", color: "#ffffff" }}
                >
                  <Shield className="w-8 h-8" strokeWidth={1.5} style={{ color: "#ffffff" }} />
                  <div>
                    <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-headline)", color: "#ffffff" }}>
                      100%
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.70)" }}>Segurança Jurídica</p>
                  </div>
                </div>
              </div>

              {/* Blobs contidos dentro do overflow-hidden */}
              <div
                className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl -z-10 pointer-events-none"
                style={{ backgroundColor: "rgba(0,64,161,0.08)" }}
              />
            </div>
          </div>

          {/* ── Benefícios ── */}
          <section className="mt-24 md:mt-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div
                className="md:col-span-2 rounded-2xl p-10 flex flex-col justify-center"
                style={{ backgroundColor: "#f2f4f6" }}
              >
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-headline)", color: "#191c1e" }}
                >
                  Feito para quem não tem tempo a perder
                </h2>
                <p
                  className="max-w-md leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", color: "#434652" }}
                >
                  Eliminamos o "juridiquês" e focamos no que importa: garantir
                  que você receba pelo seu trabalho com documentos válidos em todo
                  território nacional.
                </p>
              </div>

              <div
                className="rounded-2xl p-10 flex flex-col items-center text-center"
                style={{ backgroundColor: "#ffffff", border: "1px solid rgba(195,198,212,0.10)" }}
              >
                <Zap className="w-10 h-10 mb-4" strokeWidth={1.5} style={{ color: "#002b73" }} />
                <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-headline)", color: "#191c1e" }}>
                  Assinatura Digital
                </h3>
                <p className="text-sm mt-2" style={{ fontFamily: "var(--font-body)", color: "#434652" }}>
                  Envie para o cliente assinar direto do celular, sem papelada.
                </p>
              </div>
            </div>
          </section>

          {/* ── Planos resumidos ── */}
          <section className="mt-16 md:mt-24">
            <h2
              className="text-2xl font-bold mb-8 text-center"
              style={{ fontFamily: "var(--font-headline)", color: "#191c1e" }}
            >
              Escolha como usar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { nome: "Grátis", preco: "R$ 0", detalhe: "2 contratos/mês", destaque: false },
                { nome: "Avulso", preco: "R$ 4,90", detalhe: "por contrato", destaque: true, badge: "★ Popular" },
                { nome: "Mensal", preco: "R$ 19", detalhe: "por mês", destaque: false },
                { nome: "Semestral", preco: "R$ 89", detalhe: "6 meses · -22%", destaque: false },
                { nome: "Anual", preco: "R$ 159", detalhe: "por ano", destaque: false },
              ].map((plano) => (
                <div
                  key={plano.nome}
                  className="relative rounded-xl p-6 flex flex-col gap-2 transition-all"
                  style={
                    plano.destaque
                      ? { background: "linear-gradient(135deg, #0040a1 0%, #002b73 100%)", boxShadow: "0px 12px 32px rgba(0,43,115,0.20)" }
                      : { backgroundColor: "#f2f4f6" }
                  }
                >
                  {plano.badge && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap"
                      style={{ fontFamily: "var(--font-body)", backgroundColor: "#adc3fe", color: "#394f83" }}
                    >
                      {plano.badge}
                    </span>
                  )}
                  <p
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-body)", color: plano.destaque ? "rgba(255,255,255,0.70)" : "#434652" }}
                  >
                    {plano.nome}
                  </p>
                  <p
                    className="text-2xl font-extrabold"
                    style={{ fontFamily: "var(--font-headline)", color: plano.destaque ? "#ffffff" : "#002b73" }}
                  >
                    {plano.preco}
                  </p>
                  <p
                    className="text-xs"
                    style={{ fontFamily: "var(--font-body)", color: plano.destaque ? "rgba(255,255,255,0.70)" : "#434652" }}
                  >
                    {plano.detalhe}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Link
                href="/planos"
                className="font-bold text-sm underline underline-offset-4 hover:opacity-70 transition-opacity"
                style={{ fontFamily: "var(--font-body)", color: "#002b73" }}
              >
                Ver detalhes de todos os planos
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
