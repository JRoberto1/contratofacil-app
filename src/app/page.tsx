import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-24 pb-32">
      
      {/* ── Hero ── */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        
        {/* Espaço do Copy */}
        <div className="w-full lg:w-3/5 space-y-8">
          <div className="inline-flex items-center gap-2 bg-secondary-container/30 px-4 py-2 rounded-full border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-on-secondary-container">
              2 contratos por mês grátis, sem cartão
            </span>
          </div>

          <h1 className="text-5xl lg:text-[64px] font-heading font-extrabold text-on-surface tracking-tight leading-[1.1]">
            Pare de tomar calote — <br className="hidden lg:block" />
            <span className="text-primary">formalize seu serviço</span> em 5 minutos.
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            A ferramenta indispensável para freelancers e MEIs que buscam segurança jurídica sem a complexidade da advocacia tradicional. Gere contratos personalizados instantaneamente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/gerar" className="w-full sm:w-auto">
              <Button variant="primary" className="h-14 px-8 text-base">
                Criar meu contrato grátis
              </Button>
            </Link>
            <Link href="/planos" className="w-full sm:w-auto">
              <Button variant="tertiary" className="h-14 px-8 text-base">
                Ver planos
              </Button>
            </Link>
          </div>
        </div>

        {/* Espaço Bento Decorativo */}
        <div className="w-full lg:w-2/5 relative">
          <div className="relative z-10 grid grid-cols-2 gap-4">
            
            {/* Card Documento Rascunho */}
            <div className="col-span-2 bg-surface-container-lowest p-8 rounded-2xl border border-surface-container-highest shadow-[0_8px_30px_rgb(0,0,0,0.04)] architectural-layer">
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 bg-primary-fixed rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">edit_document</span>
                </div>
                <Badge variant="primary" className="bg-secondary-container text-on-secondary-container font-bold px-3 py-1 uppercase tracking-tighter text-[10px]">
                  Rascunho
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-3/4 bg-surface-container rounded-md" />
                <div className="h-4 w-full bg-surface-container rounded-md" />
                <div className="h-4 w-1/2 bg-surface-container rounded-md" />
              </div>
            </div>

            {/* Card 5min */}
            <div className="bg-primary p-6 rounded-2xl text-on-primary flex flex-col justify-between aspect-square shadow-[0_8px_30px_rgb(0,0,0,0.04)] architectural-layer">
              <span className="material-symbols-outlined text-4xl opacity-90">speed</span>
              <div>
                <p className="text-3xl font-extrabold font-heading">5min</p>
                <p className="text-sm opacity-80 font-medium tracking-tight mt-1">Geração rápida</p>
              </div>
            </div>

            {/* Card 100% */}
            <div className="bg-tertiary-container p-6 rounded-2xl text-on-tertiary flex flex-col justify-between aspect-square shadow-[0_8px_30px_rgb(0,0,0,0.04)] architectural-layer">
              <span className="material-symbols-outlined text-4xl opacity-90">shield</span>
              <div>
                <p className="text-3xl font-extrabold font-heading">100%</p>
                <p className="text-sm opacity-80 font-medium tracking-tight mt-1">Segurança Jurídica</p>
              </div>
            </div>
            
          </div>
          
          {/* Ambient effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[100px] -z-10" />
        </div>
      </div>

      {/* ── Benefícios ── */}
      <section className="mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-surface-container-low rounded-3xl p-10 md:p-12 flex flex-col justify-center border border-surface-container-highest/50">
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-on-surface mb-4">
              Feito para quem não tem tempo a perder
            </h2>
            <p className="text-on-surface-variant text-lg max-w-xl">
              Eliminamos o &ldquo;juridiquês&rdquo; e focamos no que importa:
              garantir que você receba pelo seu trabalho com documentos válidos
              em todo território nacional.
            </p>
          </div>
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-3xl p-10 flex flex-col justify-center text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <div className="h-16 w-16 mx-auto bg-tertiary-fixed rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-on-tertiary-fixed text-3xl">bolt</span>
            </div>
            <h3 className="text-xl font-heading font-extrabold text-on-surface">Assinatura Digital</h3>
            <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
              Envie para o cliente assinar direto do celular, sem papelada.
            </p>
          </div>
        </div>
      </section>

      {/* ── Planos ── */}
      <section className="mt-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-[40px] font-heading font-extrabold text-on-surface">
            Escolha a segurança ideal para seus negócios
          </h2>
          <p className="text-on-surface-variant text-lg mt-4 max-w-2xl mx-auto">
            Planos flexíveis pensados para freelancers e pequenos empreendedores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          {/* Card Grátis */}
          <PlanCard 
            title="Grátis" 
            price="R$0" 
            description="2 contratos grátis por mês para conhecer"
          />

          {/* Card Avulso */}
          <PlanCard 
            title="Avulso" 
            price="R$4,90" 
            description="Pague apenas quando precisar usar"
          />

          {/* Card Mensal (Destaque) */}
          <div className="bg-primary text-on-primary rounded-3xl p-8 flex flex-col relative shadow-[0_20px_40px_rgba(0,43,115,0.15)] ring-2 ring-primary xl:scale-105 z-10 transition-transform">
            <div className="absolute -top-4 inset-x-0 flex justify-center">
              <Badge className="bg-secondary-container text-on-secondary-container uppercase tracking-wider text-[10px] px-4 py-1">
                Mais popular
              </Badge>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-heading font-extrabold text-primary-fixed">Mensal</h3>
              <div className="flex items-baseline mt-4 mb-2">
                <span className="text-4xl font-extrabold font-heading">R$19</span>
                <span className="text-primary-fixed-dim text-sm ml-1">/mês</span>
              </div>
              <p className="text-primary-fixed-dim text-sm leading-relaxed">Contratos ilimitados. Cancele quando quiser.</p>
            </div>
            <div className="mt-auto pt-8">
               <Button variant="secondary" fullWidth className="h-12 bg-white text-primary hover:bg-surface active:scale-[0.98]">
                 Começar agora
               </Button>
            </div>
          </div>

          {/* Card Semestral */}
          <PlanCard 
            title="Semestral" 
            price="R$89" 
            description="Economize para focar nos projetos"
            badge="-22%"
          />

          {/* Card Anual */}
          <PlanCard 
            title="Anual" 
            price="R$159" 
            description="Um ano de tranquilidade"
            badge="Melhor preço"
          />

        </div>
      </section>

    </div>
  );
}

{/* Helper component for simple plans */}
function PlanCard({ title, price, description, badge }: { title: string, price: string, description: string, badge?: string }) {
  return (
    <div className="bg-surface-container-lowest border border-surface-container-highest rounded-3xl p-8 flex flex-col relative architectural-layer shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
      {badge && (
        <div className="absolute -top-3 inset-x-0 flex justify-center">
          <Badge variant="info" className="uppercase tracking-wider text-[10px] px-3">
            {badge}
          </Badge>
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-heading font-extrabold text-on-surface">{title}</h3>
        <div className="flex items-baseline mt-4 mb-2">
          <span className="text-4xl font-extrabold font-heading">{price}</span>
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto pt-8">
        <Button variant="tertiary" fullWidth className="h-12 border border-surface-container-highest bg-surface hover:bg-surface-container-low">
          Começar agora
        </Button>
      </div>
    </div>
  );
}
