"use client";

import { useState } from "react";
import { Camera, Video, Palette, Code2, Share2, FileText, Brush, Play, Scissors, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

const categorias = [
  { id: "fotografo", label: "Fotógrafo", sublabel: "Eventos, Ensaios, Edição", icon: Camera },
  { id: "videomaker", label: "Videomaker", sublabel: "Vídeos, Reels, Edição", icon: Video },
  { id: "designer-grafico", label: "Designer Gráfico", sublabel: "Logos, UI/UX, Social Media", icon: Palette },
  { id: "desenvolvedor-web", label: "Desenvolvedor Web", sublabel: "Sites, Apps, Sistemas", icon: Code2 },
  { id: "social-media", label: "Social Media", sublabel: "Gestão, Conteúdo, Anúncios", icon: Share2 },
  { id: "redator", label: "Redator", sublabel: "Textos, Blogs, Copywriting", icon: FileText },
  { id: "ilustrador", label: "Ilustrador", sublabel: "Ilustrações, Arte Digital", icon: Brush },
  { id: "motion-designer", label: "Motion Designer", sublabel: "Animações, Motion Graphics", icon: Play },
  { id: "editor-de-video", label: "Editor de Vídeo", sublabel: "Edição, Color Grade, VFX", icon: Scissors },
  { id: "outros", label: "Outros", sublabel: "Personalizado", icon: MoreHorizontal },
];

export default function SeletorCategoria({ onSelect }: { onSelect: (id: string, custom?: string) => void }) {
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [categoriaCustom, setCategoriaCustom] = useState("");

  const categoriasFiltradas = categorias.filter(
    (c) => c.label.toLowerCase().includes(busca.toLowerCase()) || c.sublabel.toLowerCase().includes(busca.toLowerCase())
  );

  function selecionar(id: string) {
    setSelecionado(id);
    if (id !== "outros") {
      onSelect(id);
    }
  }

  function confirmarOutros() {
    if (!categoriaCustom.trim()) return;
    onSelect("outros", categoriaCustom.trim());
  }

  return (
    <div className="max-w-2xl mx-auto w-full animate-in fade-in duration-500">
      <section className="mb-8">
        <h1 className="font-extrabold font-heading text-3xl md:text-4xl tracking-tight text-on-surface mb-3 leading-tight">
          Qual serviço você vai formalizar?
        </h1>
        <p className="text-on-surface-variant text-base">
          Selecione a categoria para que possamos gerar as cláusulas jurídicas ideais para o seu contrato.
        </p>
      </section>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline pointer-events-none" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar categoria de serviço..."
          className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-2xl text-on-surface placeholder:text-outline outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest border-transparent transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categoriasFiltradas.map(({ id, label, sublabel, icon: Icon }) => {
          const ativo = selecionado === id;
          return (
            <button
              key={id}
              onClick={() => selecionar(id)}
              className={`flex items-center p-4 rounded-2xl text-left transition-all group architectural-layer border ${
                ativo
                  ? "bg-primary-fixed/40 border-primary/30"
                  : "bg-surface-container-lowest border-surface-container-highest hover:bg-primary/5 hover:border-primary/20 shadow-[0_4px_12px_rgba(25,28,30,0.02)]"
              }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl mr-4 flex-shrink-0 transition-colors ${
                  ativo
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-highest text-on-surface-variant group-hover:bg-primary group-hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.8} />
              </div>
              <div>
                <span className="block font-bold font-heading text-on-surface">{label}</span>
                <span className="text-xs text-on-surface-variant">{sublabel}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selecionado === "outros" && (
        <div className="mt-8 p-6 bg-surface-container-low rounded-2xl border border-surface-container-highest animate-in slide-in-from-top-2 duration-300">
          <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-2 ml-1">
            Qual é o seu tipo de serviço?
          </label>
          <input
            type="text"
            value={categoriaCustom}
            onChange={(e) => setCategoriaCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmarOutros()}
            placeholder="Ex: Adestrador de Cães, Nutricionista..."
            className="w-full px-4 py-4 bg-surface-container-lowest rounded-xl text-on-surface placeholder:text-outline outline-none focus:ring-2 focus:ring-primary border-transparent transition-all shadow-sm"
            autoFocus
          />
          <Button
            onClick={confirmarOutros}
            disabled={!categoriaCustom.trim()}
            variant="primary"
            fullWidth
            className="mt-4 h-12 bg-cta-gradient shadow-[0_8px_16px_rgba(0,43,115,0.15)] disabled:opacity-40"
          >
            Continuar
          </Button>
        </div>
      )}

      {!selecionado && (
        <div className="mt-12 p-8 rounded-3xl bg-secondary-container/30 border border-secondary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 block">
              Destaque
            </span>
            <h3 className="font-extrabold font-heading text-xl md:text-2xl text-on-surface mb-2 leading-tight">
              Crie seu contrato em menos de 2 minutos
            </h3>
            <p className="text-on-surface-variant text-sm max-w-sm">
              A inteligência artificial preenche as cláusulas necessárias para sua segurança jurídica, poupando seu tempo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
