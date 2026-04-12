"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Video,
  Palette,
  Code2,
  Share2,
  FileText,
  Brush,
  Play,
  Scissors,
  MoreHorizontal,
  Search,
} from "lucide-react";
import ProgressRibbon from "@/components/ui/ProgressRibbon";

const categorias = [
  {
    id: "fotografo",
    label: "Fotógrafo",
    sublabel: "Eventos, Ensaios, Edição",
    icon: Camera,
  },
  {
    id: "videomaker",
    label: "Videomaker",
    sublabel: "Vídeos, Reels, Edição",
    icon: Video,
  },
  {
    id: "designer-grafico",
    label: "Designer Gráfico",
    sublabel: "Logos, UI/UX, Social Media",
    icon: Palette,
  },
  {
    id: "desenvolvedor-web",
    label: "Desenvolvedor Web",
    sublabel: "Sites, Apps, Sistemas",
    icon: Code2,
  },
  {
    id: "social-media",
    label: "Social Media",
    sublabel: "Gestão, Conteúdo, Anúncios",
    icon: Share2,
  },
  {
    id: "redator",
    label: "Redator",
    sublabel: "Textos, Blogs, Copywriting",
    icon: FileText,
  },
  {
    id: "ilustrador",
    label: "Ilustrador",
    sublabel: "Ilustrações, Arte Digital",
    icon: Brush,
  },
  {
    id: "motion-designer",
    label: "Motion Designer",
    sublabel: "Animações, Motion Graphics",
    icon: Play,
  },
  {
    id: "editor-de-video",
    label: "Editor de Vídeo",
    sublabel: "Edição, Color Grade, VFX",
    icon: Scissors,
  },
  {
    id: "outros",
    label: "Outros",
    sublabel: "Personalizado",
    icon: MoreHorizontal,
  },
];

export default function SeletorCategoria() {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [categoriaCustom, setCategoriaCustom] = useState("");

  const categoriasFiltradas = categorias.filter(
    (c) =>
      c.label.toLowerCase().includes(busca.toLowerCase()) ||
      c.sublabel.toLowerCase().includes(busca.toLowerCase())
  );

  function selecionar(id: string) {
    setSelecionado(id);
    if (id !== "outros") {
      const params = new URLSearchParams({ categoria: id });
      router.push(`/gerar/formulario?${params.toString()}`);
    }
  }

  function confirmarOutros() {
    if (!categoriaCustom.trim()) return;
    const params = new URLSearchParams({
      categoria: "outros",
      categoriaCustom: categoriaCustom.trim(),
    });
    router.push(`/gerar/formulario?${params.toString()}`);
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <ProgressRibbon step={1} />

      {/* Título */}
      <section className="mb-8">
        <h1
          className="font-extrabold text-3xl tracking-tight text-on-surface mb-2 leading-tight"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Qual serviço você vai formalizar?
        </h1>
        <p
          className="text-on-surface-variant text-base"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Selecione a categoria para que possamos gerar as cláusulas jurídicas
          ideais para o seu contrato.
        </p>
      </section>

      {/* Busca */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline pointer-events-none" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar categoria de serviço..."
          className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-xl text-on-surface placeholder:text-outline outline-none focus:ring-2 focus:ring-primary transition-all"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>

      {/* Grid de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categoriasFiltradas.map(({ id, label, sublabel, icon: Icon }) => {
          const ativo = selecionado === id;
          return (
            <button
              key={id}
              onClick={() => selecionar(id)}
              className={`flex items-center p-5 rounded-2xl text-left transition-all active:scale-95 border ${
                ativo
                  ? "bg-primary-fixed/40 border-primary/30"
                  : "bg-surface-container-lowest border-[rgba(195,198,212,0.10)] hover:bg-primary-fixed/20 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]"
              }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl mr-4 flex-shrink-0 transition-colors ${
                  ativo
                    ? "bg-primary text-on-primary"
                    : "bg-secondary-container text-primary"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.8} />
              </div>
              <div>
                <span
                  className="block font-bold text-on-surface"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  {label}
                </span>
                <span
                  className="text-xs text-on-surface-variant"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Campo livre — Outros */}
      {selecionado === "outros" && (
        <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
          <label
            className="block text-sm font-semibold text-on-surface mb-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Qual é o seu tipo de serviço?
          </label>
          <input
            type="text"
            value={categoriaCustom}
            onChange={(e) => setCategoriaCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmarOutros()}
            placeholder="Ex: Adestrador de Cães, Nutricionista..."
            className="w-full px-4 py-4 bg-surface-container-lowest rounded-xl text-on-surface placeholder:text-outline outline-none focus:ring-2 focus:ring-primary transition-all border border-[rgba(195,198,212,0.15)]"
            style={{ fontFamily: "var(--font-body)" }}
            autoFocus
          />
          <button
            onClick={confirmarOutros}
            disabled={!categoriaCustom.trim()}
            className="mt-3 w-full signature-gradient text-on-primary py-4 rounded-lg font-bold uppercase tracking-wider text-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Continuar
          </button>
        </div>
      )}

      {/* Card destaque */}
      {!selecionado && (
        <div className="mt-12 p-8 rounded-3xl bg-surface-container-low border border-[rgba(195,198,212,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
          <div className="relative z-10">
            <span
              className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Destaque
            </span>
            <h3
              className="font-extrabold text-xl text-on-surface mb-3 leading-tight"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Crie seu contrato em menos de 2 minutos
            </h3>
            <p
              className="text-on-surface-variant text-sm mb-6 max-w-xs"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Nossa inteligência preenche as cláusulas mais importantes para
              sua segurança.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
