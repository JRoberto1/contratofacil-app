import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

export default function Home() {
  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-32">

        {/* ── Hero ── */}
        <div className="flex flex-col md:flex-row gap-12 items-center">

          {/* Lado esquerdo: copy */}
          <div className="w-full md:w-3/5 space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#adc3fe]/30 px-4 py-2 rounded-full border border-[#c3c6d4]/15">
              <span
                className="material-symbols-outlined text-[#002b73] text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span className="text-xs font-bold uppercase tracking-widest font-label text-[#394f83]">
                2 contratos por mês grátis, sem cartão
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-[#191c1e] tracking-tight leading-[1.1]">
              Pare de tomar calote —{" "}
              <span className="text-[#002b73]">formalize seu serviço</span>{" "}
              em 5 minutos.
            </h1>

            <p className="text-lg md:text-xl text-[#434652] max-w-2xl leading-relaxed">
              A ferramenta indispensável para freelancers e MEIs que buscam
              segurança jurídica sem a complexidade da advocacia tradicional.
              Gere contratos personalizados instantaneamente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/gerar"
                className="bg-gradient-primary text-white px-8 py-4 rounded-lg font-label font-bold uppercase tracking-wider text-sm shadow-[0px_12px_32px_rgba(0,43,115,0.15)] hover:brightness-110 active:scale-[0.98] transition-all text-center"
              >
                Criar meu contrato grátis
              </Link>
              <Link
                href="/planos"
                className="bg-[#e6e8ea] text-[#394f83] px-8 py-4 rounded-lg font-label font-bold uppercase tracking-wider text-sm hover:bg-[#e0e3e5] active:scale-[0.98] transition-all text-center"
              >
                Ver planos
              </Link>
            </div>
          </div>

          {/* Lado direito: bento decorativo */}
          <div className="w-full md:w-2/5 relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">

              {/* Card documento */}
              <div className="col-span-2 bg-white p-8 rounded-xl shadow-[0px_24px_48px_rgba(25,28,30,0.04)] border border-[#c3c6d4]/10">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 bg-[#dae2ff] rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#002b73]">edit_document</span>
                  </div>
                  <span className="bg-[#adc3fe] text-[#394f83] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                    Rascunho
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-3/4 bg-[#eceef0] rounded" />
                  <div className="h-4 w-full bg-[#eceef0] rounded" />
                  <div className="h-4 w-1/2 bg-[#eceef0] rounded" />
                </div>
              </div>

              {/* Card 5min */}
              <div className="bg-[#002b73] p-6 rounded-xl text-white flex flex-col justify-between aspect-square">
                <span className="material-symbols-outlined text-4xl">speed</span>
                <div>
                  <p className="text-2xl font-bold font-headline">5min</p>
                  <p className="text-xs opacity-70">Geração rápida</p>
                </div>
              </div>

              {/* Card 100% — tertiary-container (#004e5f) */}
              <div className="bg-[#004e5f] p-6 rounded-xl text-white flex flex-col justify-between aspect-square">
                <span className="material-symbols-outlined text-4xl">shield</span>
                <div>
                  <p className="text-2xl font-bold font-headline">100%</p>
                  <p className="text-xs opacity-70">Segurança Jurídica</p>
                </div>
              </div>
            </div>

            {/* Blobs decorativos */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#0040a1]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#adc3fe]/20 rounded-full blur-3xl -z-10 pointer-events-none" />
          </div>
        </div>

        {/* ── Seção benefícios ── */}
        <section className="mt-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#f2f4f6] rounded-2xl p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-headline font-bold text-[#191c1e] mb-4">
                Feito para quem não tem tempo a perder
              </h2>
              <p className="text-[#434652] max-w-md">
                Eliminamos o &ldquo;juridiquês&rdquo; e focamos no que importa:
                garantir que você receba pelo seu trabalho com documentos válidos
                em todo território nacional.
              </p>
            </div>
            <div className="bg-white border border-[#c3c6d4]/10 rounded-2xl p-10 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-[#002b73] text-5xl mb-4">bolt</span>
              <h3 className="text-xl font-headline font-bold">Assinatura Digital</h3>
              <p className="text-sm text-[#434652] mt-2">
                Envie para o cliente assinar direto do celular, sem papelada.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <BottomNav />
    </>
  );
}
