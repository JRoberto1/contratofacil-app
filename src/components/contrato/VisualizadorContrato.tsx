"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Mail, Shield, Edit2, Download, ChevronRight, Loader2 } from "lucide-react";
import ProgressRibbon from "@/components/ui/ProgressRibbon";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { FormularioContrato, TipoContrato } from "@/types/contrato";

const tipos: { id: TipoContrato; label: string }[] = [
  { id: "completo-formal", label: "Completo Formal" },
  { id: "resumido-formal", label: "Resumido Formal" },
  { id: "completo-dia-a-dia", label: "Completo Dia a Dia" },
  { id: "resumido-dia-a-dia", label: "Resumido Dia a Dia" },
];

interface VisualizadorContratoProps {
  formulario: FormularioContrato;
}

export default function VisualizadorContrato({ formulario }: VisualizadorContratoProps) {
  const [tipoAtivo, setTipoAtivo] = useState<TipoContrato>("completo-formal");
  const [conteudo, setConteudo] = useState<Record<TipoContrato, string>>({} as Record<TipoContrato, string>);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [textoEditado, setTextoEditado] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [processandoDownload, setProcessandoDownload] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const gerarTipo = useCallback(async (tipo: TipoContrato) => {
    if (conteudo[tipo]) return;
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/gerar-contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formulario, tipo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao gerar");
      setConteudo((prev) => ({ ...prev, [tipo]: data.conteudo }));
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Não foi possível gerar o contrato.");
    } finally {
      setCarregando(false);
    }
  }, [formulario, conteudo]);

  useEffect(() => {
    gerarTipo("completo-formal");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function trocarTipo(tipo: TipoContrato) {
    setTipoAtivo(tipo);
    setEditando(false);
    await gerarTipo(tipo);
  }

  function iniciarEdicao() {
    setTextoEditado(conteudo[tipoAtivo] ?? "");
    setEditando(true);
  }

  function salvarEdicao() {
    setConteudo((prev) => ({ ...prev, [tipoAtivo]: textoEditado }));
    setEditando(false);
  }

  const baixarPdf = async () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent("abrir-login", { detail: { acao: "baixar-pdf" } }));
      return;
    }

    if (!conteudo[tipoAtivo]) return;

    setProcessandoDownload(true);
    setErro(null);

    try {
      // 1. Salvar contrato no BD RLS
      const resSalvar = await fetch("/api/salvar-contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formulario,
          tipo: tipoAtivo,
          conteudo: conteudo[tipoAtivo]
        })
      });
      const dataSalvar = await resSalvar.json();
      if (!resSalvar.ok) throw new Error(dataSalvar.error || "Erro ao salvar contrato.");

      const contratoId = dataSalvar.id;

      // 2. Gerar arquivo PDF protegido
      const resGerar = await fetch("/api/gerar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contratoId })
      });
      const dataGerar = await resGerar.json();
      if (!resGerar.ok) throw new Error(dataGerar.error || "Erro ao gerar PDF criptografado.");

      // 3. Efetuar download privativo usando proxy assinado
      window.location.href = `/api/baixar-pdf-salvo?id=${contratoId}`;
      
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setProcessandoDownload(false);
    }
  };

  const textoAtual = editando ? textoEditado : (conteudo[tipoAtivo] ?? "");

  return (
    <div className="w-full">
      <ProgressRibbon step={3} />

      {/* Cabeçalho de sucesso */}
      <section className="mb-8 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-widest mb-4"
          style={{ fontFamily: "var(--font-body)" }}>
          <Shield className="w-3 h-3" strokeWidth={2.5} />
          Documento Gerado
        </div>
        <h2
          className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-3 leading-tight"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Seu contrato está pronto!
        </h2>
        <p className="text-on-surface-variant text-lg max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
          Revisamos os detalhes e seu documento está em conformidade. Escolha o estilo e baixe agora.
        </p>
      </section>

      {/* Toggle 4 tipos */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-on-surface-variant mb-3 ml-1" style={{ fontFamily: "var(--font-body)" }}>
          Estilo do Documento:
        </label>
        {/* Mobile: scroll horizontal | Desktop: grid */}
        <div className="relative">
          <div className="flex md:grid md:grid-cols-4 overflow-x-auto gap-1.5 bg-surface-container-high p-1.5 rounded-2xl no-scrollbar">
            {tipos.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => trocarTipo(id)}
                className={`whitespace-nowrap flex-shrink-0 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  tipoAtivo === id
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-highest"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Indicador de scroll no mobile */}
          <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface-container-high to-transparent rounded-r-2xl pointer-events-none flex items-center justify-end pr-1">
            <ChevronRight className="w-4 h-4 text-on-surface-variant opacity-50" />
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Preview do contrato */}
        <div className="lg:col-span-8 bg-surface-container-low rounded-[2rem] p-4 md:p-8 border border-[rgba(195,198,212,0.20)]">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3
              className="font-bold text-lg text-on-surface"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Pré-visualização
            </h3>
            {!carregando && conteudo[tipoAtivo] && !editando && (
              <button
                onClick={iniciarEdicao}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full font-bold text-sm transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Edit2 className="w-4 h-4" />
                Editar Contrato
              </button>
            )}
            {editando && (
              <button
                onClick={salvarEdicao}
                className="flex items-center gap-2 px-4 py-2 signature-gradient text-on-primary rounded-full font-bold text-sm transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Salvar
              </button>
            )}
          </div>

          {/* Papel do contrato */}
          <div className="bg-surface-container-lowest shadow-xl rounded-2xl mx-auto max-w-[640px] min-h-[500px] p-8 md:p-14 border border-[rgba(195,198,212,0.15)]">
            {carregando && (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-on-surface-variant text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  Gerando seu contrato...
                </p>
                {/* Skeleton */}
                <div className="w-full space-y-3 mt-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`h-3 bg-surface-container rounded-full animate-pulse ${i % 3 === 0 ? "w-1/2" : i % 3 === 1 ? "w-full" : "w-4/5"}`} />
                  ))}
                </div>
              </div>
            )}

            {erro && !carregando && (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
                <div className="w-12 h-12 bg-error-container rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-error" />
                </div>
                <p className="text-error font-semibold" style={{ fontFamily: "var(--font-body)" }}>{erro}</p>
                <button
                  onClick={() => { setErro(null); gerarTipo(tipoAtivo); }}
                  className="text-primary font-bold text-sm underline underline-offset-4"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!carregando && !erro && textoAtual && (
              editando ? (
                <textarea
                  value={textoEditado}
                  onChange={(e) => setTextoEditado(e.target.value)}
                  className="w-full h-[600px] bg-transparent text-on-surface text-sm leading-relaxed outline-none resize-none"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              ) : (
                <div
                  className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {textoAtual}
                </div>
              )
            )}
          </div>
        </div>

        {/* Sidebar de ações */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card Próximo Passo */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 ambient-shadow border border-[rgba(195,198,212,0.10)]">
            <h4
              className="font-bold text-xl text-on-surface mb-6"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Próximo Passo
            </h4>

            {/* CTA principal — dispara login */}
            <button
              disabled={carregando || processandoDownload || !conteudo[tipoAtivo]}
              className="w-full signature-gradient text-on-primary rounded-2xl py-5 px-6 font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0px_12px_32px_rgba(0,43,115,0.20)] mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-body)" }}
              onClick={baixarPdf}
            >
              {processandoDownload ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {processandoDownload ? "Processando..." : "Baixar PDF"}
            </button>

            {/* Painel escondido p/ Testadores para evitar paywall */}
            {user && (
              <button
                onClick={async () => {
                  const res = await fetch("/api/dev/liberar-perfil");
                  const data = await res.json();
                  alert(data.message || "Testes liberados!");
                }}
                className="w-full text-center text-xs font-bold text-primary underline underline-offset-4 opacity-50 hover:opacity-100 transition-opacity mb-5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                🛠️ Modo Dev: Desbloquear Conta Grátis 🛠️
              </button>
            )}

            {/* Enviar por e-mail */}
            <button
              disabled={carregando || !conteudo[tipoAtivo]}
              className="w-full flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-surface-container-highest transition-colors group disabled:opacity-40"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" strokeWidth={1.8} />
                <span className="font-semibold text-on-surface text-sm">Enviar por E-mail</span>
              </div>
              <Download className="w-4 h-4 text-outline" />
            </button>
          </div>

          {/* Card segurança */}
          <div className="p-6 bg-inverse-surface rounded-[2rem] text-inverse-on-surface">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2.5 rounded-xl flex-shrink-0">
                <Shield className="w-5 h-5 text-primary-fixed-dim" strokeWidth={1.5} />
              </div>
              <div>
                <h5
                  className="font-bold text-sm mb-1"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  Criptografia Segura
                </h5>
                <p
                  className="text-[11px] text-inverse-on-surface/60 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Documento em conformidade com LGPD. Acesso restrito e dados protegidos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
