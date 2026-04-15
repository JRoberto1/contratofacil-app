"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Mail, Shield, Edit2, Download, ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { FormularioContrato, TipoContrato } from "@/types/contrato";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const tipos: { id: TipoContrato; label: string }[] = [
  { id: "completo-formal", label: "Completo Formal" },
  { id: "resumido-formal", label: "Resumido Formal" },
  { id: "completo-dia-a-dia", label: "Completo Dia a Dia" },
  { id: "resumido-dia-a-dia", label: "Resumido Dia a Dia" },
];

interface VisualizadorContratoProps {
  formulario: FormularioContrato;
  onBack?: () => void;
}

export default function VisualizadorContrato({ formulario, onBack }: VisualizadorContratoProps) {
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
      // triggers login guard in this new approach
      window.dispatchEvent(new CustomEvent("abrir-login", { detail: { acao: "baixar-pdf" } }));
      return;
    }

    if (!conteudo[tipoAtivo]) return;

    setProcessandoDownload(true);
    setErro(null);

    try {
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

      const resGerar = await fetch("/api/gerar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contratoId })
      });
      const dataGerar = await resGerar.json();
      if (!resGerar.ok) throw new Error(dataGerar.error || "Erro ao gerar PDF criptografado.");

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
      {/* ProgressBar managed inside parent, so we removed it from here */}

      {/* Cabeçalho de sucesso */}
      <section className="mb-8 text-center md:text-left animate-in slide-in-from-bottom-4 duration-500">
        <Badge variant="primary" className="mb-4">
          <Shield className="w-3 h-3 mr-1" strokeWidth={2.5} />
          Documento Gerado
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-on-surface tracking-tight mb-3 leading-tight">
          Seu contrato está pronto!
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">
          Revisamos os detalhes e seu documento está em conformidade. Escolha o estilo e baixe agora.
        </p>
      </section>

      {/* Toggle 4 tipos */}
      <div className="mb-8 animate-in slide-in-from-bottom-8 duration-500">
        <label className="block text-sm font-bold text-on-surface-variant mb-3 ml-1">
          Estilo do Documento:
        </label>
        <div className="relative">
          <div className="flex xl:grid lg:grid-cols-4 overflow-x-auto gap-1.5 bg-surface-container-high p-1.5 rounded-2xl no-scrollbar">
            {tipos.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => trocarTipo(id)}
                className={`whitespace-nowrap flex-shrink-0 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  tipoAtivo === id
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="xl:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface-container-high to-transparent rounded-r-2xl pointer-events-none flex items-center justify-end pr-1">
            <ChevronRight className="w-4 h-4 text-on-surface-variant opacity-50" />
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in zoom-in-95 duration-500 delay-150">
        {/* Preview do contrato */}
        <div className="lg:col-span-8 bg-surface-container-low rounded-[2rem] p-4 md:p-8 border border-surface-container-highest">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="font-bold text-lg font-heading text-on-surface">Pré-visualização</h3>
            {!carregando && conteudo[tipoAtivo] && !editando && (
              <Button onClick={iniciarEdicao} variant="outline" className="h-10 rounded-full px-4 text-xs font-bold border-transparent bg-primary/10 hover:bg-primary/20 hover:border-transparent">
                <Edit2 className="w-3.5 h-3.5" />
                Editar Contrato
              </Button>
            )}
            {editando && (
              <Button onClick={salvarEdicao} variant="primary" className="h-10 rounded-full px-4 text-xs font-bold">
                Salvar
              </Button>
            )}
          </div>

          {/* Papel do contrato */}
          <div className="bg-surface-container-lowest shadow-[0_24px_48px_rgba(25,28,30,0.04)] rounded-2xl mx-auto max-w-[640px] min-h-[500px] p-8 md:p-14 border border-surface-container-highest">
            {carregando && (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-on-surface-variant text-sm font-medium">Gerando seu contrato...</p>
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
                <p className="text-error font-semibold">{erro}</p>
                <button onClick={() => { setErro(null); gerarTipo(tipoAtivo); }} className="text-primary font-bold text-sm underline underline-offset-4">
                  Tentar novamente
                </button>
              </div>
            )}

            {!carregando && !erro && textoAtual && (
              editando ? (
                <textarea
                  value={textoEditado}
                  onChange={(e) => setTextoEditado(e.target.value)}
                  className="w-full h-[600px] bg-transparent text-on-surface text-sm leading-relaxed outline-none resize-none font-sans"
                />
              ) : (
                <div className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {textoAtual}
                </div>
              )
            )}
          </div>
        </div>

        {/* Sidebar de ações */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-surface-container-highest shadow-[0_8px_30px_rgb(0,0,0,0.04)] architectural-layer">
            <h4 className="font-bold font-heading text-xl text-on-surface mb-6">Próximo Passo</h4>

            <Button
              variant="primary"
              disabled={carregando || processandoDownload || !conteudo[tipoAtivo]}
              onClick={baixarPdf}
              fullWidth
              className="h-14 font-bold text-base mb-4 bg-cta-gradient shadow-[0_12px_32px_rgba(0,43,115,0.20)]"
            >
              {processandoDownload ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {processandoDownload ? "Processando..." : "Baixar PDF"}
            </Button>

            <Button
              disabled={carregando || !conteudo[tipoAtivo]}
              variant="tertiary"
              fullWidth
              className="h-14 bg-surface-container hover:bg-surface-container-highest mb-4"
            >
               <FileText className="w-5 h-5" strokeWidth={1.8} />
               Baixar Word (Docx)
            </Button>
            
            <Button
              disabled={carregando || !conteudo[tipoAtivo]}
              variant="tertiary"
              fullWidth
              className="h-14 bg-surface-container hover:bg-surface-container-highest flex items-center justify-between pl-6 pr-5"
            >
              <span className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" strokeWidth={1.8} />
                Enviar por E-mail
              </span>
            </Button>
            
             {user && (
              <button
                onClick={async () => {
                  const res = await fetch("/api/dev/liberar-perfil");
                  const data = await res.json();
                  alert(data.message || "Testes liberados!");
                }}
                className="w-full text-center text-[10px] font-bold text-primary underline underline-offset-4 opacity-50 mt-5 uppercase tracking-widest"
              >
                Modo Dev: Desbloquear Conta
              </button>
            )}
          </div>

          <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2.5 rounded-xl flex-shrink-0">
                <Shield className="w-5 h-5 text-primary-fixed-dim" strokeWidth={1.5} />
              </div>
              <div>
                <h5 className="font-bold font-heading text-sm mb-1">Criptografia Segura</h5>
                <p className="text-[11px] text-white/60 leading-relaxed font-sans">
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
