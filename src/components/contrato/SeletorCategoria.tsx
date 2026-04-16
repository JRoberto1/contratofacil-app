"use client";

import { useState } from "react";

interface SeletorCategoriaProps {
  onSelect: (categoria: string, customText?: string) => void;
}

const categoriasExemplo = [
  { id: "designer-grafico", icon: "palette", title: "Designer / Freelancer Digital", desc: "Logos, UI/UX, Social Media" },
  { id: "desenvolvedor-web", icon: "code", title: "Desenvolvedor de Software", desc: "Sites, Apps, Sistemas" },
  { id: "fotografo", icon: "photo_camera", title: "Fotógrafo / Videomaker", desc: "Eventos, Ensaios, Edição" },
  { id: "consultor", icon: "school", title: "Consultor / Professor", desc: "Aulas, Mentorias, Estratégia" },
  { id: "servicos-gerais", icon: "construction", title: "Eletricista / Encanador", desc: "Reparos e Manutenção" },
  { id: "outros", icon: "more_horiz", title: "Outros", desc: "Personalizado" },
];

export default function SeletorCategoria({ onSelect }: SeletorCategoriaProps) {
  const [busca, setBusca] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [customRole, setCustomRole] = useState("");

  const handleSelect = (id: string) => {
    if (id === "outros") {
      setShowCustom(true);
    } else {
      onSelect(id);
    }
  };

  const handleCustomSubmit = () => {
    if (customRole.trim()) {
      onSelect("outros", customRole.trim());
    }
  };

  const filtered = categoriasExemplo.filter(c => 
    c.title.toLowerCase().includes(busca.toLowerCase()) || 
    c.desc.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      
      {/* Ribbon */}
      <div className="w-full mb-12">
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full w-1/4"></div>
        </div>
      </div>

      <div className="text-center w-full mb-10">
        <h1 className="text-3xl font-extrabold font-headline text-on-surface mb-3">Qual serviço você vai formalizar?</h1>
        <p className="text-on-surface-variant font-body">Selecione a categoria para que possamos gerar as cláusulas ideais para o seu contrato.</p>
      </div>

      {/* Search */}
      <div className="w-full relative mb-8">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant z-10 w-6 h-6 flex items-center justify-center">search</span>
        <input 
          type="text" 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar categoria de serviço..." 
          className="w-full bg-surface-container-highest rounded-xl py-4 pl-12 pr-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
        />
      </div>

      {/* Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {filtered.map(cat => (
          <button 
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className={`flex items-center text-left bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:bg-primary-fixed/30 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary ${showCustom && cat.id === 'outros' ? 'border-2 border-primary' : 'border-2 border-transparent'}`}
          >
            <div className="w-12 h-12 flex-shrink-0 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center mr-4">
              <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold font-headline text-on-surface leading-tight mb-1 truncate">{cat.title}</h3>
              <p className="text-xs text-on-surface-variant font-body truncate">{cat.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* SlideDown Outros */}
      {showCustom && (
        <div className="w-full bg-surface-container-low p-6 rounded-2xl mb-12 animate-in slide-in-from-top-4 fade-in duration-300">
          <label className="block text-sm font-bold font-headline text-on-surface mb-2">Qual é o seu tipo de serviço?</label>
          <div className="flex gap-3">
            <input 
              type="text" 
              autoFocus
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Ex: Adestrador de cães, Nutricionista..." 
              className="flex-1 bg-surface-container-highest rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body"
              onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
            />
            <button 
              onClick={handleCustomSubmit}
              disabled={!customRole.trim()}
              className="signature-gradient text-white px-6 font-bold font-headline rounded-xl shadow-md disabled:opacity-50 hover:shadow-lg transition-all"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Destaque */}
      {(!busca && !showCustom) && (
        <div className="w-full bg-surface-container-low rounded-[2rem] p-8 text-center flex flex-col items-center">
          <h3 className="text-xl font-bold font-headline text-primary mb-2">Crie seu contrato em menos de 2 minutos</h3>
          <p className="text-on-surface-variant font-body mb-6 text-sm">Responda um formulário simples e nós cuidamos do texto jurídico.</p>
          <button onClick={() => setBusca("t")} className="signature-gradient text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95">Começar Agora</button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-on-surface-variant opacity-60 text-xs font-body mb-8">
        Um produto FlowIQ © {new Date().getFullYear()}
      </div>

    </div>
  );
}
