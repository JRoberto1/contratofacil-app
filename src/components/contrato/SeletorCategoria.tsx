"use client";

import { useState } from "react";
import { gruposCategorias, categorias } from "@/lib/categorias";

interface SeletorCategoriaProps {
  onSelect: (categoria: string, customText?: string) => void;
}

export default function SeletorCategoria({ onSelect }: SeletorCategoriaProps) {
  const [busca, setBusca] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  
  const [showCustom, setShowCustom] = useState(false);
  const [customRole, setCustomRole] = useState("");

  const handleSelectSub = (id: string) => {
    if (id === "other" || id === "outros") {
      setShowCustom(true);
    } else {
      onSelect(id);
    }
  };

  const handleCustomSubmit = () => {
    if (customRole.trim()) {
      onSelect("other", customRole.trim());
    }
  };

  // If there's a search term, we flatten all categories for easy searching
  const isSearching = busca.trim().length > 0;
  
  const getDisplayItems = () => {
    if (isSearching) {
      const b = busca.toLowerCase();
      // search across all subcategories
      const allSubIds = gruposCategorias.flatMap(g => g.items);
      // to avoid duplicates if any
      const uniqueIds = Array.from(new Set(allSubIds));
      return uniqueIds
        .map(id => categorias[id])
        .filter(c => c && (c.title.toLowerCase().includes(b) || c.desc.toLowerCase().includes(b) || c.id.toLowerCase().includes(b)));
    }
    
    if (activeGroup) {
      const group = gruposCategorias.find(g => g.id === activeGroup);
      if (!group) return [];
      return group.items.map(id => categorias[id]).filter(Boolean);
    }
    
    // Default: show groups
    return gruposCategorias;
  };
  
  const displayItems = getDisplayItems();

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
        <p className="text-on-surface-variant font-body">Selecione a área para configurarmos as cláusulas ideais para o seu contrato.</p>
      </div>

      {/* Search */}
      <div className="w-full relative mb-8">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant z-10 w-6 h-6 flex items-center justify-center">search</span>
        <input 
          type="text" 
          value={busca}
          onChange={(e) => {
             setBusca(e.target.value);
             if (e.target.value) setShowCustom(false);
          }}
          placeholder="Buscar área ou profissão livremente..." 
          className="w-full bg-surface-container-highest rounded-xl py-4 pl-12 pr-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
        />
      </div>

      {/* Header controls (Back button) */}
      {!isSearching && activeGroup && (
        <div className="w-full flex mb-4">
          <button 
            onClick={() => { setActiveGroup(null); setShowCustom(false); }}
            className="flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <span className="material-symbols-outlined mr-1 text-base">arrow_back</span>
            Voltar para áreas principais
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {(!isSearching && !activeGroup) ? (
          // RENDER GROUPS
          displayItems.map((item: any) => (
            <button 
              key={item.id}
              onClick={() => {
                if (item.id === 'outros') {
                  handleSelectSub('other');
                } else {
                  setActiveGroup(item.id);
                }
              }}
              className="flex items-center text-left bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:bg-primary-fixed/30 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary border-2 border-transparent group"
            >
              <div className="w-12 h-12 flex-shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold font-headline text-on-surface leading-tight mb-1 truncate">{item.label}</h3>
                <p className="text-xs text-on-surface-variant font-body truncate">{item.id === 'outros' ? 'Personalizado' : `${item.items.length} opções relacionadas`}</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant opacity-50 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </button>
          ))
        ) : (
          // RENDER SUBCATEGORIES OR SEARCH RESULTS
          displayItems.map((cat: any) => (
            <button 
              key={cat.id}
              onClick={() => handleSelectSub(cat.id)}
              className={`flex items-center text-left bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:bg-primary-fixed/30 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary ${showCustom && cat.id === 'other' ? 'border-2 border-primary' : 'border-2 border-transparent'}`}
            >
              <div className="w-12 h-12 flex-shrink-0 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center mr-4">
                <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold font-headline text-on-surface leading-tight mb-1 truncate">{cat.title}</h3>
                <p className="text-xs text-on-surface-variant font-body truncate">{cat.desc}</p>
              </div>
            </button>
          ))
        )}
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
              placeholder="Ex: Tradutor, Programador de Games..." 
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
      {(!busca && !showCustom && !activeGroup) && (
        <div className="w-full bg-surface-container-low rounded-[2rem] p-8 text-center flex flex-col items-center mt-6 shadow-sm border border-outline-variant/10">
          <h3 className="text-xl font-bold font-headline text-primary mb-2">Sua profissão não está aqui?</h3>
          <p className="text-on-surface-variant font-body mb-6 text-sm">Pesquise livremente pela sua área ou crie um modelo 100% personalizado selecionando a aba "Outros Serviços".</p>
          <button onClick={() => setBusca(" ")} className="signature-gradient text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95">Ver a lista Completa</button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 text-center text-on-surface-variant opacity-60 text-xs font-body mb-8">
        Um produto FlowIQ © {new Date().getFullYear()}
      </div>

    </div>
  );
}
