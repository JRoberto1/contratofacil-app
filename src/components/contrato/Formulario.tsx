"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, User, FileText, ArrowRight, ChevronLeft } from "lucide-react";
import ProgressRibbon from "@/components/ui/ProgressRibbon";
import type { FormularioContrato, CategoriaContrato } from "@/types/contrato";

interface FormularioProps {
  categoria: CategoriaContrato;
  categoriaCustom?: string;
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

export default function Formulario({ categoria, categoriaCustom }: FormularioProps) {
  const router = useRouter();

  const [form, setForm] = useState<Omit<FormularioContrato, "categoria" | "categoriaCustom">>({
    prestador: { nomeCompleto: "", cpfCnpj: "" },
    cliente: { nomeRazaoSocial: "", cpfCnpj: "" },
    servico: { descricao: "", valor: 0, prazoEntrega: "", formaPagamento: "" },
  });

  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  function set(
    secao: "prestador" | "cliente" | "servico",
    campo: string,
    valor: string
  ) {
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

    const dados: FormularioContrato = {
      categoria,
      categoriaCustom,
      ...form,
    };

    const params = new URLSearchParams({ dados: JSON.stringify(dados) });
    router.push(`/gerar/contrato?${params.toString()}`);
  }

  const nomeCategoria = categoria === "outros" && categoriaCustom
    ? categoriaCustom
    : labelCategoria[categoria] ?? categoria;

  return (
    <div className="max-w-lg mx-auto w-full">
      <ProgressRibbon step={2} />

      {/* Título */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => router.push("/gerar")}
            className="text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span
            className="text-[10px] font-bold tracking-widest text-primary uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {nomeCategoria}
          </span>
        </div>
        <h1
          className="text-2xl font-extrabold text-on-surface"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Dados do Contrato
        </h1>
      </div>

      <div className="space-y-10">
        {/* ── Seção 1: Prestador ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <BadgeCheck className="w-5 h-5" strokeWidth={2} />
            <h2
              className="font-bold text-xs tracking-widest uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Prestador (Autônomo)
            </h2>
          </div>

          <Campo
            label="Nome Completo"
            placeholder="Seu nome completo"
            value={form.prestador.nomeCompleto}
            onChange={(v) => set("prestador", "nomeCompleto", v)}
            erro={erros["prestador.nomeCompleto"]}
          />
          <Campo
            label="CPF ou CNPJ"
            placeholder="000.000.000-00"
            value={form.prestador.cpfCnpj}
            onChange={(v) => set("prestador", "cpfCnpj", v)}
            erro={erros["prestador.cpfCnpj"]}
          />
        </section>

        {/* ── Seção 2: Cliente ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <User className="w-5 h-5" strokeWidth={2} />
            <h2
              className="font-bold text-xs tracking-widest uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Cliente (Contratante)
            </h2>
          </div>

          <Campo
            label="Nome do Cliente"
            placeholder="Nome ou Razão Social"
            value={form.cliente.nomeRazaoSocial}
            onChange={(v) => set("cliente", "nomeRazaoSocial", v)}
            erro={erros["cliente.nomeRazaoSocial"]}
          />
          <Campo
            label="CPF ou CNPJ"
            placeholder="000.000.000-00"
            value={form.cliente.cpfCnpj}
            onChange={(v) => set("cliente", "cpfCnpj", v)}
            erro={erros["cliente.cpfCnpj"]}
          />
        </section>

        {/* ── Seção 3: Serviço ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <FileText className="w-5 h-5" strokeWidth={2} />
            <h2
              className="font-bold text-xs tracking-widest uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Detalhes do Serviço
            </h2>
          </div>

          {/* Textarea descrição */}
          <div>
            <label
              className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5 ml-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Descrição do Serviço
            </label>
            <textarea
              value={form.servico.descricao}
              onChange={(e) => set("servico", "descricao", e.target.value)}
              placeholder="O que será entregue?"
              rows={3}
              className={`w-full bg-surface-container-highest rounded-xl px-5 py-3.5 text-on-surface placeholder:text-outline/40 outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                erros["servico.descricao"] ? "ring-2 ring-error bg-error-container/20" : ""
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            />
            {erros["servico.descricao"] && (
              <p className="text-error text-xs mt-1 ml-1" style={{ fontFamily: "var(--font-body)" }}>
                {erros["servico.descricao"]}
              </p>
            )}
          </div>

          {/* Valor + Prazo lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <Campo
              label="Valor (R$)"
              placeholder="1.500,00"
              value={form.servico.valor ? form.servico.valor.toFixed(2).replace(".", ",") : ""}
              onChange={(v) => set("servico", "valor", v)}
              erro={erros["servico.valor"]}
            />
            <Campo
              label="Prazo"
              placeholder="15 dias"
              value={form.servico.prazoEntrega}
              onChange={(v) => set("servico", "prazoEntrega", v)}
              erro={erros["servico.prazoEntrega"]}
            />
          </div>

          <Campo
            label="Forma de Pagamento Acordada"
            placeholder="Ex: PIX (50% entrada, 50% entrega)"
            value={form.servico.formaPagamento}
            onChange={(v) => set("servico", "formaPagamento", v)}
            erro={erros["servico.formaPagamento"]}
          />
        </section>

        {/* ── Ações ── */}
        <div className="pt-2 flex flex-col gap-3 pb-12">
          <button
            onClick={handleSubmit}
            disabled={enviando}
            className="signature-gradient text-on-primary font-bold py-5 rounded-xl shadow-[0px_12px_32px_rgba(0,43,115,0.20)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {enviando ? "Gerando contrato..." : "Gerar Contrato"}
            {!enviando && <ArrowRight className="w-5 h-5" />}
          </button>
          <button
            onClick={() => router.push("/gerar")}
            className="text-primary font-semibold py-3 rounded-xl hover:bg-primary/5 active:scale-[0.98] transition-all text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Campo reutilizável ── */
interface CampoProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  erro?: string;
}

function Campo({ label, placeholder, value, onChange, erro }: CampoProps) {
  return (
    <div>
      <label
        className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5 ml-1"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-surface-container-highest rounded-xl px-5 py-3.5 text-on-surface placeholder:text-outline/40 outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all ${
          erro ? "ring-2 ring-error bg-error-container/20" : ""
        }`}
        style={{ fontFamily: "var(--font-body)" }}
      />
      {erro && (
        <p className="text-error text-xs mt-1 ml-1" style={{ fontFamily: "var(--font-body)" }}>
          {erro}
        </p>
      )}
    </div>
  );
}
