"use client";

import { useState } from "react";

const categorias = [
  { id: "designer-grafico", label: "Designer", sublabel: "UX/UI, Graphic Design, Branding e ilustrações digitais.", icon: "palette" },
  { id: "desenvolvedor-web", label: "Desenvolvedor", sublabel: "Software, Apps, Web e manutenção de sistemas complexos.", icon: "code" },
  { id: "fotografo", label: "Fotógrafo", sublabel: "Ensaios, Eventos, Edição e licenciamento de imagem.", icon: "photo_camera" },
  { id: "consultor", label: "Consultor", sublabel: "Gestão, Marketing, Financeiro e estratégia de negócios.", icon: "insights" },
  { id: "eletricista", label: "Eletricista", sublabel: "Manutenção, Instalação predial e reparos especializados.", icon: "bolt" },
  { id: "outros", label: "Outros", sublabel: "Não encontrou sua área? Personalize seu contrato do zero.", icon: "more_horiz" },
];

export default function SeletorCategoria({ onSelect }: { onSelect: (id: string, custom?: string) => void }) {
  const [busca, setBusca] = useState("");
  const [selecionandoOutros, setSelecionandoOutros] = useState(false);
  const [categoriaCustom, setCategoriaCustom] = useState("");

  const categoriasFiltradas = categorias.filter(
    (c) => c.label.toLowerCase().includes(busca.toLowerCase()) || c.sublabel.toLowerCase().includes(busca.toLowerCase())
  );

  function selecionar(id: string) {
    if (id === "outros") {
      setSelecionandoOutros(true);
    } else {
      onSelect(id);
    }
  }

  function confirmarOutros() {
    if (!categoriaCustom.trim()) return;
    onSelect("outros", categoriaCustom.trim());
  }

  return (
    <div className="w-full animate-in fade-in duration-500 pb-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-background mb-4 font-headline">Qual serviço você vai formalizar?</h1>
        <p className="text-on-surface-variant font-body text-lg max-w-2xl">Selecione a categoria que melhor descreve o seu trabalho para que possamos adaptar as cláusulas ideais para você.</p>
      </header>

      <section className="mb-16">
        <div className="relative max-w-xl group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 outline-none text-on-surface placeholder:text-outline font-body" 
            placeholder="Busque por profissão ou serviço..." 
          />
        </div>
      </section>

      {!selecionandoOutros ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categoriasFiltradas.map(({ id, label, sublabel, icon }) => (
            <div 
              key={id}
              onClick={() => selecionar(id)}
              className="bg-surface-container-lowest p-8 rounded-2xl group hover:bg-white hover:shadow-[0_20px_40px_rgba(0,43,115,0.04)] transition-all duration-300 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center mb-6 group-hover:bg-primary-container/10 transition-colors">
                <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-headline">{label}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">{sublabel}</p>
            </div>
          ))}
        </section>
      ) : (
        <section className="mb-16 animate-in slide-in-from-top-2">
          <div className="bg-surface-container-lowest p-8 rounded-2xl max-w-xl">
            <label className="text-[10px] font-bold uppercase tracking-wider text-primary font-label mb-2 block ml-2">Qual é o seu serviço?</label>
            <input
              type="text"
              value={categoriaCustom}
              onChange={(e) => setCategoriaCustom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmarOutros()}
              placeholder="Ex: Nutricionista, Adestrador..."
              className="w-full bg-surface-container-high border-0 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none font-body mb-4"
              autoFocus
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setSelecionandoOutros(false)}
                className="px-6 py-4 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors font-bold font-body"
              >
                Voltar
              </button>
              <button 
                onClick={confirmarOutros}
                disabled={!categoriaCustom.trim()}
                className="signature-gradient text-white px-8 py-4 rounded-full font-bold shadow-xl flex-1 disabled:opacity-50 font-body"
              >
                Continuar
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Highlight Card */}
      <section className="relative overflow-hidden rounded-3xl p-1 md:p-px bg-gradient-to-r from-outline-variant/30 to-transparent mt-12">
        <div className="bg-surface-container-lowest rounded-[1.85rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold mb-4 text-on-background font-headline">Crie seu contrato em menos de 2 minutos</h2>
            <p className="text-on-surface-variant max-w-md font-body">Nossa inteligência artificial organiza todos os termos jurídicos enquanto você foca no seu trabalho.</p>
          </div>
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}
