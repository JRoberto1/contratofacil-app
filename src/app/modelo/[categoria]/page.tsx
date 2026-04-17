import { categorias, CategoriaSlug } from "@/lib/categorias";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CategoriaPageProps {
  params: { categoria: string };
}

// Gera páginas estáticas (SSG) no build para SEO
export function generateStaticParams() {
  return Object.keys(categorias)
    .filter(cat => cat !== 'other')
    .map(categoria => ({
      categoria,
    }));
}

export function generateMetadata({ params }: CategoriaPageProps): Metadata {
  const info = categorias[params.categoria as CategoriaSlug];
  if (!info) return { title: 'Modelo não encontrado' };

  return {
    title: `Gerador de Contrato para ${info.title} | ContratoFácil`,
    description: `Gere um contrato de prestação de serviços completo e seguro para ${info.title} em apenas 2 minutos usando inteligência artificial. Personalizado e juridicamente válido.`,
    openGraph: {
      title: `Contrato de ${info.title} | ContratoFácil`,
      description: `Proteja seus serviços de ${info.title} com um contrato profissional, gerado em minutos.`,
    }
  };
}

export default function ModeloCategoriaPage({ params }: CategoriaPageProps) {
  const cat = categorias[params.categoria as CategoriaSlug];
  
  if (!cat || params.categoria === 'other') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto w-full">
         <div className="mb-12">
           <Link href="/gerar" className="text-primary font-bold text-sm mb-4 inline-block hover:underline">
             &larr; Voltar para Todas as Categorias
           </Link>
           <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6">
             <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4 font-headline">Contrato para {cat.title}</h1>
           <p className="text-on-surface-variant text-lg font-body max-w-2xl leading-relaxed">
             Gere um contrato jurídico seguro para serviços de {cat.desc.toLowerCase()}. Nossa inteligência artificial cria cláusulas específicas para proteger o seu negócio contra inadimplência, disputas de direitos autorais e escopo indefinido.
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
           <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-sm">
             <h3 className="font-headline font-bold text-xl mb-4 text-on-surface">O que este contrato cobre?</h3>
             <ul className="space-y-4">
               {cat.clausulasBase.map((c, i) => (
                 <li key={i} className="flex gap-3">
                   <span className="material-symbols-outlined text-primary flex-shrink-0">check_circle</span>
                   <span className="text-on-surface-variant text-sm font-body">{c}</span>
                 </li>
               ))}
               <li className="flex gap-3">
                 <span className="material-symbols-outlined text-primary flex-shrink-0">check_circle</span>
                 <span className="text-on-surface-variant text-sm font-body">Multas por rescisão imotivada e atraso</span>
               </li>
               <li className="flex gap-3">
                 <span className="material-symbols-outlined text-primary flex-shrink-0">check_circle</span>
                 <span className="text-on-surface-variant text-sm font-body">Assinatura eletrônica com validade jurídica (MP 2.200-2/2001)</span>
               </li>
             </ul>
           </div>

           <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col justify-center items-center text-center">
             <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Pronto para começar?</h2>
             <p className="text-sm text-on-surface-variant mb-6 font-body">
               Leva menos de 2 minutos. Preencha apenas os dados principais e nós montamos o texto oficial.
             </p>
             <Link
               href={`/gerar?passo=1&categoria=${cat.id}`}
               className="signature-gradient text-white rounded-full px-8 py-4 font-bold font-headline shadow-md hover:shadow-lg transition-all w-full md:w-auto"
             >
               Gerar Meu Contrato Agora
             </Link>
           </div>
         </div>
      </div>
    </div>
  );
}
