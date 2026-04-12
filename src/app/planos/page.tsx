import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Infinity,
  History,
  FileText,
  PiggyBank,
  Sparkles,
  Star,
  Crown,
  LayoutGrid,
  Search,
  Layers,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

const planos = [
  {
    id: "gratis",
    nome: "Grátis",
    preco: "R$ 0",
    periodo: null,
    subtitulo: null,
    destaque: false,
    badge: null,
    features: [
      { icon: FileText, texto: "2 contratos/mês" },
      { icon: CreditCard, texto: "Sem cartão" },
    ],
  },
  {
    id: "avulso",
    nome: "Avulso",
    preco: "R$ 4,90",
    periodo: "/contrato",
    subtitulo: "Pague só quando precisar",
    destaque: false,
    badge: null,
    features: [
      { icon: ShieldCheck, texto: "Categorias ilimitadas" },
      { icon: FileText, texto: "PDF Profissional" },
    ],
  },
  {
    id: "mensal",
    nome: "Mensal",
    preco: "R$ 19",
    periodo: "/mês",
    subtitulo: "Contratos ilimitados",
    destaque: true,
    badge: "MAIS POPULAR",
    features: [
      { icon: Infinity, texto: "Contratos ilimitados" },
      { icon: History, texto: "Histórico completo" },
      { icon: Layers, texto: "4 formatos de exportação" },
    ],
  },
  {
    id: "semestral",
    nome: "Semestral",
    preco: "R$ 89",
    periodo: "/6 meses",
    subtitulo: null,
    destaque: false,
    badge: "-22%",
    badgeTipo: "economia",
    features: [
      { icon: PiggyBank, texto: "Economia real" },
      { icon: Sparkles, texto: "Todos os recursos Pro" },
    ],
  },
  {
    id: "anual",
    nome: "Anual",
    preco: "R$ 159",
    periodo: "/ano",
    subtitulo: "Melhor custo-benefício",
    destaque: false,
    badge: null,
    features: [
      { icon: Star, texto: "Prioridade no suporte" },
      { icon: Crown, texto: "Acesso Premium total" },
    ],
  },
];

const includedFeatures = [
  { icon: LayoutGrid, texto: "Todas as categorias" },
  { icon: Search, texto: "Histórico de contratos" },
  { icon: Layers, texto: "4 formatos de contrato" },
  { icon: FileText, texto: "PDF Profissional" },
];

export default function PlanosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 pb-32">
        {/* ── Headline ── */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Escolha a segurança ideal para seus negócios
          </h1>
          <p
            className="text-on-surface-variant text-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Planos flexíveis para quem busca agilidade jurídica sem burocracia.
          </p>
        </div>

        {/* ── Cards de planos ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-end">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className={`relative flex flex-col justify-between rounded-xl p-8 transition-all active:scale-[0.98] ${
                plano.destaque
                  ? "signature-gradient text-on-primary shadow-[0px_24px_48px_rgba(0,43,115,0.25)] md:scale-105 z-10"
                  : "bg-surface-container-low text-on-surface"
              }`}
            >
              {/* Badge topo */}
              {plano.badge && plano.badgeTipo === "economia" && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-bold bg-error-container text-error px-2 py-0.5 rounded"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {plano.badge}
                </span>
              )}
              {plano.badge && !plano.badgeTipo && (
                <span
                  className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {plano.badge}
                </span>
              )}

              <div>
                {/* Nome */}
                <h3
                  className={`text-xl font-bold mb-2 ${plano.destaque ? "text-on-primary" : "text-on-surface"}`}
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  {plano.nome}
                </h3>

                {/* Preço */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className={`font-extrabold ${plano.destaque ? "text-4xl text-on-primary" : "text-3xl text-primary"}`}
                    style={{ fontFamily: "var(--font-headline)" }}
                  >
                    {plano.preco}
                  </span>
                  {plano.periodo && (
                    <span
                      className={`text-sm ${plano.destaque ? "text-on-primary/70" : "text-on-surface-variant"}`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {plano.periodo}
                    </span>
                  )}
                </div>

                {/* Subtítulo */}
                {plano.subtitulo && (
                  <p
                    className={`text-sm mb-6 ${plano.destaque ? "text-on-primary/80" : "text-secondary font-semibold"}`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {plano.subtitulo}
                  </p>
                )}

                {/* Features */}
                <ul className="space-y-3 mt-6 mb-8">
                  {plano.features.map(({ icon: Icon, texto }) => (
                    <li key={texto} className="flex items-center gap-3 text-sm">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${plano.destaque ? "text-primary-fixed" : "text-primary"}`}
                        strokeWidth={2}
                      />
                      <span
                        className={plano.destaque ? "text-on-primary/90" : "text-on-surface"}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {texto}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Link
                href="/gerar"
                className={`block w-full py-3 px-4 text-center text-sm font-bold uppercase tracking-wider rounded-lg transition-all active:scale-[0.98] ${
                  plano.destaque
                    ? "bg-on-primary text-primary hover:bg-surface-bright"
                    : "bg-surface-container-high text-on-secondary-container hover:bg-surface-container-highest"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                Começar agora
              </Link>
            </div>
          ))}
        </div>

        {/* ── Incluso em todos os planos pagos ── */}
        <div className="mt-20 p-8 bg-surface-container-lowest rounded-xl border border-[rgba(195,198,212,0.10)] text-center">
          <h4
            className="font-bold text-primary mb-6"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Incluso em todos os planos pagos:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {includedFeatures.map(({ icon: Icon, texto }) => (
              <div
                key={texto}
                className="flex items-center justify-center gap-2 text-sm text-on-surface-variant"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Icon className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={2} />
                {texto}
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA de retorno ao fluxo ── */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/gerar"
            className="signature-gradient text-on-primary px-10 py-4 rounded-lg font-bold uppercase tracking-wider text-sm shadow-[0px_12px_32px_rgba(0,43,115,0.15)] hover:brightness-110 active:scale-[0.98] transition-all"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Criar meu contrato grátis
          </Link>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
