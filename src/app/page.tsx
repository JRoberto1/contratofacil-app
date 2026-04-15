import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

export default function Home() {
  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-32">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-3/5 space-y-8">
            <div className="inline-flex items-center gap-2 bg-secondary-container/30 px-4 py-2 rounded-full border border-outline-variant/15">
              <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
              <span className="text-xs font-bold uppercase tracking-widest font-label text-on-secondary-container">2 contratos por mês grátis, sem cartão</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface tracking-tight leading-[1.1]">
              Pare de tomar calote — <span className="text-primary">formalize seu serviço</span> em 5 minutos.
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              A ferramenta indispensável para freelancers e MEIs que buscam segurança jurídica sem a complexidade da advocacia tradicional. Gere contratos personalizados instantaneamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/gerar" className="bg-gradient-primary text-white px-8 py-4 rounded-lg font-label font-bold uppercase tracking-wider text-sm shadow-[0px_12px_32px_rgba(0,43,115,0.15)] hover:brightness-110 active:scale-[0.98] transition-all text-center">
                Criar meu contrato grátis
              </Link>
              <Link href="/planos" className="bg-surface-container-high text-on-secondary-container px-8 py-4 rounded-lg font-label font-bold uppercase tracking-wider text-sm hover:bg-surface-container-highest active:scale-[0.98] transition-all text-center">
                Ver planos
              </Link>
            </div>
          </div>
          <div className="w-full md:w-2/5 relative">
            {/* Decorative Bento Elements */}
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_24px_48px_rgba(25,28,30,0.04)] border border-outline-variant/10">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 bg-primary-fixed rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">edit_document</span>
                  </div>
                  <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Rascunho</span>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-3/4 bg-surface-container rounded"></div>
                  <div className="h-4 w-full bg-surface-container rounded"></div>
                  <div className="h-4 w-1/2 bg-surface-container rounded"></div>
                </div>
              </div>
              <div className="bg-primary p-6 rounded-xl text-white flex flex-col justify-between aspect-square">
                <span className="material-symbols-outlined text-4xl">speed</span>
                <div>
                  <p className="text-2xl font-bold font-headline">5min</p>
                  <p className="text-xs opacity-70">Geração rápida</p>
                </div>
              </div>
              <div className="bg-tertiary-container p-6 rounded-xl text-white flex flex-col justify-between aspect-square">
                <span className="material-symbols-outlined text-4xl">shield</span>
                <div>
                  <p className="text-2xl font-bold font-headline">100%</p>
                  <p className="text-xs opacity-70">Segurança Jurídica</p>
                </div>
              </div>
            </div>
            {/* Background visual element */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary-container/20 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
        
        {/* Section: Benefits (Bento Style) */}
        <section className="mt-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface-container-low rounded-2xl p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-headline font-bold text-on-surface mb-4">Feito para quem não tem tempo a perder</h2>
              <p className="text-on-surface-variant max-w-md">Eliminamos o "juridiquês" e focamos no que importa: garantir que você receba pelo seu trabalho com documentos válidos em todo território nacional.</p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-10 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary text-5xl mb-4">bolt</span>
              <h3 className="text-xl font-headline font-bold">Assinatura Digital</h3>
              <p className="text-sm text-on-surface-variant mt-2">Envie para o cliente assinar direto do celular, sem papelada.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}
