"use client";

import { useState } from "react";
import { BadgeCheck, User, FileText, ArrowRight, ChevronLeft } from "lucide-react";
import type { FormularioContrato, CategoriaContrato } from "@/types/contrato";
import { Button } from "@/components/ui/Button";

interface FormularioProps {
  categoria: CategoriaContrato;
  categoriaCustom?: string;
  onBack: () => void;
  onSubmit: (dados: FormularioContrato) => void;
  initialData?: Omit<FormularioContrato, "categoria" | "categoriaCustom">;
}

const labelCategoria: Record<string, string> = {
  fotografo: "Fotógrafo",
  videomaker: "Videomaker",
  "designer-grafico": "Designer Gráfico",
  "desenvolvedor-web": "Desenvolvedor Web",
  "social-media": "Social Media",
  redator: "Redator",
  ilustrador: "Ilustrador",
  "motion-designer": "Motion Designer",
  "editor-de-video": "Editor de Vídeo",
  outros: "Outros",
};

export default function Formulario({ categoria, categoriaCustom, onBack, onSubmit, initialData }: FormularioProps) {
  const [form, setForm] = useState<Omit<FormularioContrato, "categoria" | "categoriaCustom">>(
    initialData || {
      prestador: { nomeCompleto: "", cpfCnpj: "" },
      cliente: { nomeRazaoSocial: "", cpfCnpj: "" },
      servico: { descricao: "", valor: 0, prazoEntrega: "", formaPagamento: "" },
    }
  );

  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  function set(secao: "prestador" | "cliente" | "servico", campo: string, valor: string) {
    setForm((prev) => ({
      ...prev,
      [secao]: { ...prev[secao], [campo]: campo === "valor" ? Number(valor.replace(/\D/g, "")) / 100 : valor },
    }));
    if (erros[`${secao}.${campo}`]) {
      setErros((e) => { const n = { ...e }; delete n[`${secao}.${campo}`]; return n; });
    }
  }

  function validar() {
    const e: Record<string, string> = {};
    if (!form.prestador.nomeCompleto.trim()) e["prestador.nomeCompleto"] = "Obrigatório";
    if (!form.prestador.cpfCnpj.trim()) e["prestador.cpfCnpj"] = "Obrigatório";
    if (!form.cliente.nomeRazaoSocial.trim()) e["cliente.nomeRazaoSocial"] = "Obrigatório";
    if (!form.cliente.cpfCnpj.trim()) e["cliente.cpfCnpj"] = "Obrigatório";
    if (!form.servico.descricao.trim()) e["servico.descricao"] = "Obrigatório";
    if (!form.servico.prazoEntrega.trim()) e["servico.prazoEntrega"] = "Obrigatório";
    if (!form.servico.formaPagamento.trim()) e["servico.formaPagamento"] = "Obrigatório";
    return e;
  }

  async function handleSubmit() {
    const e = validar();
    if (Object.keys(e).length) { setErros(e); return; }
    setEnviando(true);
    onSubmit({ categoria, categoriaCustom, ...form });
    setEnviando(false);
  }

  const nomeCategoria = categoria === "outros" && categoriaCustom ? categoriaCustom : labelCategoria[categoria] ?? categoria;

  return (
    <div className="max-w-lg mx-auto w-full animate-in slide-in-from-right-4 duration-500">
      
      {/* Título */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <button onClick={onBack} className="text-on-surface-variant hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold tracking-widest text-primary uppercase font-sans">
            {nomeCategoria}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-on-surface">
          Dados do Contrato
        </h1>
      </div>

      <div className="space-y-10">
        {/* Seção 1: Prestador */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <BadgeCheck className="w-5 h-5" strokeWidth={2} />
            <h2 className="font-bold text-xs tracking-widest uppercase">
              Prestador (Autônomo)
            </h2>
          </div>
          <Campo label="Nome Completo" placeholder="Seu nome completo" value={form.prestador.nomeCompleto} onChange={(v) => set("prestador", "nomeCompleto", v)} erro={erros["prestador.nomeCompleto"]} />
          <Campo label="CPF ou CNPJ" placeholder="000.000.000-00" value={form.prestador.cpfCnpj} onChange={(v) => set("prestador", "cpfCnpj", v)} erro={erros["prestador.cpfCnpj"]} />
        </section>

        {/* Seção 2: Cliente */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <User className="w-5 h-5" strokeWidth={2} />
            <h2 className="font-bold text-xs tracking-widest uppercase">
              Cliente (Contratante)
            </h2>
          </div>
          <Campo label="Nome do Cliente" placeholder="Nome ou Razão Social" value={form.cliente.nomeRazaoSocial} onChange={(v) => set("cliente", "nomeRazaoSocial", v)} erro={erros["cliente.nomeRazaoSocial"]} />
          <Campo label="CPF ou CNPJ" placeholder="000.000.000-00" value={form.cliente.cpfCnpj} onChange={(v) => set("cliente", "cpfCnpj", v)} erro={erros["cliente.cpfCnpj"]} />
        </section>

        {/* Seção 3: Serviço */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <FileText className="w-5 h-5" strokeWidth={2} />
            <h2 className="font-bold text-xs tracking-widest uppercase">
              Detalhes do Serviço
            </h2>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5 ml-1">
              Descrição do Serviço
            </label>
            <textarea
              value={form.servico.descricao}
              onChange={(e) => set("servico", "descricao", e.target.value)}
              placeholder="O que será entregue?"
              rows={3}
              className={`w-full bg-surface-container-highest rounded-xl px-5 py-3.5 text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all font-sans resize-none border-transparent ${erros["servico.descricao"] ? "ring-2 ring-error bg-error-container text-error" : ""}`}
            />
            {erros["servico.descricao"] && <p className="text-error text-[10px] mt-1 ml-1 font-bold uppercase tracking-wider">{erros["servico.descricao"]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Valor (R$)" placeholder="1.500,00" value={form.servico.valor ? form.servico.valor.toFixed(2).replace(".", ",") : ""} onChange={(v) => set("servico", "valor", v)} erro={erros["servico.valor"]} />
            <Campo label="Prazo" placeholder="15 dias" value={form.servico.prazoEntrega} onChange={(v) => set("servico", "prazoEntrega", v)} erro={erros["servico.prazoEntrega"]} />
          </div>
          <Campo label="Forma de Pagamento Acordada" placeholder="Ex: PIX (50% entrada, 50% entrega)" value={form.servico.formaPagamento} onChange={(v) => set("servico", "formaPagamento", v)} erro={erros["servico.formaPagamento"]} />
        </section>

        {/* Ações */}
        <div className="pt-2 flex flex-col gap-3 pb-12">
          <Button variant="primary" disabled={enviando} onClick={handleSubmit} fullWidth className="h-14 text-base bg-cta-gradient shadow-[0_12px_32px_rgba(0,43,115,0.20)]">
             Próxima Etapa <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
          <Button variant="tertiary" onClick={onBack} fullWidth className="h-12 bg-transparent text-primary hover:bg-primary/5 border-none shadow-none">
            Salvar Rascunho
          </Button>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, placeholder, value, onChange, erro }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5 ml-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-surface-container-highest rounded-xl px-5 py-3.5 text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all font-sans border-transparent ${erro ? "ring-2 ring-error bg-error-container text-error" : ""}`}
      />
      {erro && <p className="text-error text-[10px] mt-1 ml-1 font-bold uppercase tracking-wider">{erro}</p>}
    </div>
  );
}
