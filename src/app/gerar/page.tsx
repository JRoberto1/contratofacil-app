"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Formulario from "@/components/contrato/Formulario";
import VisualizadorContrato from "@/components/contrato/VisualizadorContrato";

export default function GerarPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOther, setIsOther] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const [formData, setFormData] = useState<any>(null);

  const handleFormSubmit = async (dados: any, tipoAtivo: import("@/types/contrato").TipoContrato) => {
    try {
      const res = await fetch("/api/salvar-contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formulario: dados,
          tipo: tipoAtivo,
          conteudo: ""
        })
      });
      
      if (!res.ok) throw new Error("Falha ao preparar geração");
      
      const { id } = await res.json();
      router.push(`/contrato/${id}`);
    } catch (e) {
      console.error(e);
      // Fallback para fluxo local antigo se der erro
      localStorage.setItem("contratofacil_rascunho_completo", JSON.stringify({
        formulario: dados,
        tipo: tipoAtivo,
        timestamp: new Date().toISOString()
      }));
      router.push("/contrato/rascunho");
    }
  };

  // Se vier com o query param ?passo=1, inicia na etapa 1 (Formulário)
  if (typeof window !== "undefined" && step === 0 && window.location.search.includes("passo=1")) {
    setStep(1);
    // Remove query param sem dar reload
    window.history.replaceState(null, "", "/gerar");
  }

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
        <main className="flex-1 w-full px-4 md:px-6 pb-24">
          <Formulario
            categoria={selectedCategory as any}
            categoriaCustom={isOther ? otherValue : undefined}
            onBack={() => setStep(0)}
            onSubmit={handleFormSubmit}
          />
        </main>
      )}
    </div>
  );
}
