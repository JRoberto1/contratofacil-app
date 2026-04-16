"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GerarPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOther, setIsOther] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const categories = [
    { id: "designer", icon: "palette", title: "Designer / Freelancer Digital", desc: "Logos, UI/UX, Social Media" },
    { id: "dev", icon: "code", title: "Desenvolvedor de Software", desc: "Sites, Apps, Sistemas" },
    { id: "photo", icon: "photo_camera", title: "Fotógrafo / Videomaker", desc: "Eventos, Ensaios, Edição" },
    { id: "consultant", icon: "school", title: "Consultor / Professor", desc: "Aulas, Mentorias, Estratégia" },
    { id: "maintenance", icon: "construction", title: "Eletricista / Encanador", desc: "Reparos e Manutenção" },
    { id: "other", icon: "more_horiz", title: "Outros", desc: "Personalizado" },
  ];

  const handleCategoryClick = (id: string) => {
    setSelectedCategory(id);
    if (id === "other") {
      setIsOther(true);
    } else {
      setIsOther(false);
    }
  };

  const handleNextStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-4">
      {step === 0 && (
        <main className="flex-1 max-w-3xl mx-auto w-full px-6 pb-24">
          
          {/* Progress Ribbon */}
          <div className="w-full bg-surface-container-highest rounded-full h-1.5 mb-10 overflow-hidden">
            <div className="bg-[#002b73] h-full rounded-full" style={{ width: "25%" }}></div>
          </div>
          
          <h1 className="text-3xl font-extrabold font-headline mb-3 text-primary">Qual serviço você vai formalizar?</h1>
          <p className="text-on-surface-variant font-body mb-8 leading-relaxed">
            Selecione a categoria para que possamos gerar as cláusulas ideais para o seu contrato.
          </p>

          {/* Search Box */}
          <div className="relative mb-8">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Buscar categoria de serviço..." 
              className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#002b73] transition-all font-body text-on-surface placeholder:text-on-surface-variant"
            />
          </div>

          {/* Categories Grid */}
          <div className="flex flex-col gap-3 mb-10">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-4 p-5 rounded-2xl transition-all shadow-sm outline-none w-full text-left bg-surface-container-lowest hover:bg-primary-fixed/30 active:scale-95 ${selectedCategory === cat.id ? 'ring-2 ring-[#002b73] bg-primary-fixed/10' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <div>
                  <h3 className="font-extrabold font-headline text-on-surface text-base">{cat.title}</h3>
                  <p className="font-body text-xs text-on-surface-variant">{cat.desc}</p>
                </div>
              </button>
            ))}

            {/* Field for Others */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOther && selectedCategory === 'other' ? 'max-h-32 opacity-100 translate-y-0 mt-2' : 'max-h-0 opacity-0 -translate-y-2'}`}
            >
              <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/20">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#002b73] mb-2 font-body">Qual é o seu tipo de serviço?</label>
                <input 
                  type="text" 
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                  placeholder="Ex: Adestrador de cães, Nutricionista..." 
                  className="w-full bg-surface-container-highest border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#002b73] transition-all font-body text-on-surface"
                />
              </div>
            </div>
          </div>

          {/* Highlight Card CTA */}
          <div className="bg-surface-container-low rounded-[2rem] p-8 text-center flex flex-col items-center">
            <h3 className="font-extrabold font-headline text-xl text-primary mb-2">Crie seu contrato em menos de 2 minutos</h3>
            <p className="font-body text-sm text-on-surface-variant mb-6 max-w-sm">
              Nossa inteligência artificial cria as cláusulas perfeitas baseadas na sua área de atuação.
            </p>
            <button 
              onClick={handleNextStep}
              disabled={!selectedCategory || (selectedCategory === 'other' && !otherValue.trim())}
              className="signature-gradient text-white rounded-full px-8 py-3 font-bold font-headline w-full sm:w-auto shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Começar Agora
            </button>
          </div>

          <div className="mt-12 text-center">
            <span className="text-xs font-medium font-body text-on-surface-variant opacity-60">Um produto FlowIQ</span>
          </div>
        </main>
      )}

      {step === 1 && (
        <main className="flex-1 max-w-2xl mx-auto w-full px-6 pb-24">
          
          {/* Progress Ribbon */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#002b73] font-bold text-xs uppercase tracking-widest font-body">Passo 1 de 3</span>
            <span className="font-bold text-xs text-on-surface-variant font-body">33%</span>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-1.5 mb-8 overflow-hidden">
            <div className="bg-[#002b73] h-full rounded-full" style={{ width: "33%" }}></div>
          </div>
          
          <h1 className="text-3xl font-extrabold font-headline mb-10 text-primary">Dados do Contrato</h1>

          <form className="flex flex-col gap-8">
            
            {/* Prestador */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#002b73] mb-2">
                <span className="material-symbols-outlined text-lg">badge</span>
                <h2 className="text-xs font-bold uppercase tracking-widest font-body">Prestador (Autônomo)</h2>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline-variant font-body px-1">Nome Completo</label>
                <input type="text" placeholder="Seu nome completo" className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#002b73] font-body text-on-surface" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline-variant font-body px-1">CPF ou CNPJ</label>
                <input type="text" placeholder="000.000.000-00" className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#002b73] font-body text-on-surface" />
              </div>
            </section>

            <hr className="border-outline-variant/10" />

            {/* Cliente */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#002b73] mb-2">
                <span className="material-symbols-outlined text-lg">person</span>
                <h2 className="text-xs font-bold uppercase tracking-widest font-body">Cliente (Contratante)</h2>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline-variant font-body px-1">Nome do Cliente</label>
                <input type="text" placeholder="Nome ou Razão Social" className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#002b73] font-body text-on-surface" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline-variant font-body px-1">CPF ou CNPJ</label>
                <input type="text" placeholder="000.000.000-00" className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#002b73] font-body text-on-surface" />
              </div>
            </section>

            <hr className="border-outline-variant/10" />

            {/* Detalhes do Serviço */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#002b73] mb-2">
                <span className="material-symbols-outlined text-lg">description</span>
                <h2 className="text-xs font-bold uppercase tracking-widest font-body">Detalhes do Serviço</h2>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline-variant font-body px-1">Descrição do Serviço</label>
                <textarea rows={3} placeholder="O que será entregue?" className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#002b73] font-body text-on-surface resize-none"></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-outline-variant font-body px-1">Valor (R$)</label>
                  <input type="text" placeholder="0.000,00" className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#002b73] font-body text-on-surface" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-outline-variant font-body px-1">Prazo</label>
                  <input type="text" placeholder="Ex: 15 dias" className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#002b73] font-body text-on-surface" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1 mt-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline-variant font-body px-1">Forma de pagamento acordada</label>
                <input type="text" placeholder="Ex: PIX (50% entrada, 50% entrega)" className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#002b73] font-body text-on-surface" />
              </div>
              
              <div className="flex flex-col gap-1 mt-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline-variant font-body px-1">Cláusulas Especiais / Observações (Opcional)</label>
                <textarea rows={3} placeholder="Ex: Multa de 10% por atraso; Adicional de urgência; Entrega via Google Drive..." className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#002b73] font-body text-on-surface resize-none"></textarea>
              </div>
            </section>

            <div className="mt-8 flex flex-col gap-4">
              <button type="button" className="signature-gradient text-white rounded-full py-4 font-bold font-headline w-full shadow-md hover:shadow-lg transition-all active:scale-95 text-lg">
                Próxima Etapa →
              </button>
              <button type="button" className="text-[#002b73] bg-transparent font-bold font-headline py-3 w-full hover:bg-surface-container-lowest rounded-full transition-all text-sm">
                Salvar Rascunho
              </button>
            </div>
            
          </form>
          
          <div className="mt-12 text-center">
            <span className="text-xs font-medium font-body text-on-surface-variant opacity-60">Um produto FlowIQ</span>
          </div>
        </main>
      )}
    </div>
  );
}
