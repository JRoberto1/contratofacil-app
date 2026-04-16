"use client";

import { useState } from "react";
import type { FormularioContrato, CategoriaContrato } from "@/types/contrato";

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
      servico: { descricao: "", valor: 0, prazoEntrega: "", formaPagamento: "PIX (À vista)" },
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validar();
    if (Object.keys(err).length) { setErros(err); return; }
    setEnviando(true);
    onSubmit({ categoria, categoriaCustom, ...form });
    setEnviando(false);
  }

  const nomeCategoria = categoria === "outros" && categoriaCustom ? categoriaCustom : labelCategoria[categoria] ?? categoria;

  return (
    <div className="w-full animate-in slide-in-from-right-4 duration-500 pb-16">
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Seção 1: Prestador */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">badge</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight font-headline text-on-surface">Prestador ({nomeCategoria})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Campo label="Nome Completo" placeholder="Ex: João da Silva" value={form.prestador.nomeCompleto} onChange={(v: string) => set("prestador", "nomeCompleto", v)} erro={erros["prestador.nomeCompleto"]} />
            <Campo label="CPF ou CNPJ" placeholder="000.000.000-00" value={form.prestador.cpfCnpj} onChange={(v: string) => set("prestador", "cpfCnpj", v)} erro={erros["prestador.cpfCnpj"]} />
          </div>
        </section>

        {/* Seção 2: Cliente */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight font-headline text-on-surface">Cliente</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Campo label="Nome ou Razão Social" placeholder="Ex: Empresa Ltda" value={form.cliente.nomeRazaoSocial} onChange={(v: string) => set("cliente", "nomeRazaoSocial", v)} erro={erros["cliente.nomeRazaoSocial"]} />
            <Campo label="CPF ou CNPJ" placeholder="00.000.000/0001-00" value={form.cliente.cpfCnpj} onChange={(v: string) => set("cliente", "cpfCnpj", v)} erro={erros["cliente.cpfCnpj"]} />
          </div>
        </section>

        {/* Seção 3: Serviço */}
        <section className="space-y-6 p-8 bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(0,43,115,0.03)] border-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">description</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight font-headline text-on-surface">Detalhes do Serviço</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label ml-2">Descrição dos Serviços</label>
              <textarea
                value={form.servico.descricao}
                onChange={(e) => set("servico", "descricao", e.target.value)}
                placeholder="Descreva detalhadamente o que será entregue..."
                rows={4}
                className={`w-full bg-surface-container-highest border-0 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-300 outline-none resize-none font-body ${erros["servico.descricao"] ? "ring-2 ring-error bg-error-container text-error" : ""}`}
              />
              {erros["servico.descricao"] && <p className="text-error text-[10px] mt-1 ml-1 font-bold uppercase tracking-wider">{erros["servico.descricao"]}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label ml-2">Valor</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">R$</span>
                  <input
                    type="text"
                    value={form.servico.valor ? form.servico.valor.toFixed(2).replace(".", ",") : ""}
                    onChange={(e) => set("servico", "valor", e.target.value)}
                    placeholder="0,00"
                    className={`w-full bg-surface-container-highest border-0 rounded-xl pl-12 pr-4 py-4 text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-300 outline-none font-body ${erros["servico.valor"] ? "ring-2 ring-error bg-error-container text-error" : ""}`}
                  />
                </div>
              </div>
              <Campo label="Prazo" placeholder="Ex: 30 dias" value={form.servico.prazoEntrega} onChange={(v: string) => set("servico", "prazoEntrega", v)} erro={erros["servico.prazoEntrega"]} />
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label ml-2">Forma de Pagamento</label>
                <select
                  value={form.servico.formaPagamento}
                  onChange={(e) => set("servico", "formaPagamento", e.target.value)}
                  className={`w-full bg-surface-container-highest border-0 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-300 outline-none appearance-none font-body ${erros["servico.formaPagamento"] ? "ring-2 ring-error bg-error-container text-error" : ""}`}
                >
                  <option>PIX (À vista)</option>
                  <option>Cartão de Crédito</option>
                  <option>Boleto Bancário</option>
                  <option>Transferência</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Ações */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
          <button type="button" onClick={onBack} className="text-[#0040a1] font-bold text-sm tracking-wide font-label hover:opacity-80 transition-opacity">
            Voltar
          </button>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button disabled={enviando} className="signature-gradient text-white px-10 py-5 rounded-full font-bold shadow-[0_10px_20px_rgba(0,64,161,0.2)] flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto justify-center font-body" type="submit">
              Próxima Etapa
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Campo({ label, placeholder, value, onChange, erro }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label ml-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-surface-container-highest border-0 rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-300 outline-none font-body ${erro ? "ring-2 ring-error bg-error-container text-error" : ""}`}
      />
      {erro && <p className="text-error text-[10px] mt-1 ml-1 font-bold uppercase tracking-wider font-label">{erro}</p>}
    </div>
  );
}
