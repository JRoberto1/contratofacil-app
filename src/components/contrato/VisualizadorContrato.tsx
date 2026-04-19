"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { FormularioContrato, TipoContrato } from "@/types/contrato";
import { ContratoPreview } from "./ContratoPreview";

const tipos: { id: TipoContrato; label: string }[] = [
  { id: "completo-formal", label: "Completo Formal" },
  { id: "simplificado", label: "Simplificado" },
  { id: "executivo", label: "Executivo" },
  { id: "minimalista", label: "Minimalista" },
];

interface VisualizadorContratoProps {
  formulario: FormularioContrato | null;
  tipoInicial?: TipoContrato;
  onBack?: () => void;
  contratoId?: string;
  conteudoDB?: string | null;
}

export default function VisualizadorContrato({ formulario, tipoInicial = "completo-formal", onBack, contratoId, conteudoDB }: VisualizadorContratoProps) {
  const router = useRouter();
  const [tipoAtivo, setTipoAtivo] = useState<TipoContrato>(tipoInicial);
  const [conteudo, setConteudo] = useState<Record<TipoContrato, string>>(() => {
    if (conteudoDB) {
      return { [tipoInicial]: conteudoDB } as any;
    }
    return {} as Record<TipoContrato, string>;
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [editando, setEditando] = useState(false);
  const [textoEditado, setTextoEditado] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [processandoDownload, setProcessandoDownload] = useState(false);
  // true quando o usuário editou o texto ou trocou de tipo — gera novo contrato no download
  const [fezModificacoes, setFezModificacoes] = useState(false);
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
    if (conteudo[tipo] || conteudoDB) return;
    setCarregando(true);
    setErro(null);
    try {
      if (!formulario) throw new Error("Faltando formulário para geração.");
      
      const res = await fetch("/api/gerar-contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formulario, tipo, contratoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Erro ao gerar");
      setConteudo((prev) => ({ ...prev, [tipo]: data.data?.conteudo ?? data.conteudo }));
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Não foi possível gerar o contrato.");
    } finally {
      setCarregando(false);
    }
  }, [formulario, conteudo]);

  useEffect(() => {
    gerarTipo(tipoInicial);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function trocarTipo(tipo: TipoContrato) {
    setTipoAtivo(tipo);
    setEditando(false);
    // Trocar de tipo = conteúdo diferente do original → conta como modificação
    if (tipo !== tipoInicial) setFezModificacoes(true);
    await gerarTipo(tipo);
  }

  function markdownParaTexto(md: string): string {
    return md
      .replace(/^#{1,3}\s+/gm, "")        // remove ## títulos
      .replace(/\*\*(.+?)\*\*/g, "$1")     // remove **negrito**
      .replace(/\*(.+?)\*/g, "$1")         // remove *itálico*
      .replace(/^[-*]\s+/gm, "• ")         // bullet points legíveis
      .replace(/\n{3,}/g, "\n\n")          // máximo 2 quebras de linha
      .trim();
  }

  function iniciarEdicao() {
    setTextoEditado(markdownParaTexto(conteudo[tipoAtivo] ?? ""));
    setEditando(true);
  }

  function salvarEdicao() {
    setConteudo((prev) => ({ ...prev, [tipoAtivo]: textoEditado }));
    setEditando(false);
    // Edição manual do texto → conta como modificação
    setFezModificacoes(true);
  }

  const baixarPdf = async () => {
    if (!conteudo[tipoAtivo]) return;

    setProcessandoDownload(true);
    setErro(null);

    try {
      // 1. Registra no banco conforme regra de negócio:
      //    - contratoId existe + sem modificações → só incrementa downloads (sem cobrança)
      //    - contratoId existe + fez modificações → cria NOVO contrato (cobrança)
      //    - sem contratoId → cria novo contrato (primeiro download)
      let dbContratoId = contratoId ?? null;
      if (user) {
        try {
          const deveApenasIncrementar = !!contratoId && !fezModificacoes;

          if (deveApenasIncrementar) {
            // Mesmo contrato, sem edição → só contabiliza o download
            const res = await fetch("/api/atualizar-contrato", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contratoId })
            });
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(`Erro ao registrar download: ${err.error?.message || err.error || "Desconhecido"}`);
            }
          } else {
            // Novo contrato: primeiro download ou conteúdo foi modificado
            const resSalvar = await fetch("/api/salvar-contrato", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ formulario, tipo: tipoAtivo, conteudo: conteudo[tipoAtivo] })
            });
            const dataSalvar = await resSalvar.json();
            if (!resSalvar.ok) {
              throw new Error(`Erro ao salvar no seu histórico: ${dataSalvar.error?.message || dataSalvar.error || "Desconhecido"}`);
            }
            dbContratoId = dataSalvar?.data?.id ?? dataSalvar?.id;
            // Conta o download no contrato recém-criado
            await fetch("/api/atualizar-contrato", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contratoId: dbContratoId })
            });
          }
        } catch (e: any) {
          throw new Error(e.message || "Não foi possível registrar o contrato na sua conta.");
        }
      }

      // 2. Transforma em PDF diretamente via API de renderização 
      const resGerar = await fetch("/api/gerar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conteudo: conteudo[tipoAtivo], contratoId }), // contratoId opcional
      });
      
      if (!resGerar.ok) {
        const errorData = await resGerar.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao gerar arquivo PDF.");
      }

      // 3. Renderiza o Blob para Download NATIVO no Navegador
      const blob = await resGerar.blob();      
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `contrato-${tipoAtivo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      setMostrarToast(true);
      setTimeout(() => {
        setMostrarToast(false);
        router.push("/meus-contratos");
      }, 3000);
      
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setProcessandoDownload(false);
    }
  };

  const textoAtual = editando ? textoEditado : (conteudo[tipoAtivo] ?? "");

  return (
    <div className="w-full pb-12 animate-in fade-in duration-500 relative">
      {/* Toast Notification */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#e6f4ea] text-[#137333] px-6 py-4 rounded-xl shadow-[0_10px_40px_rgba(19,115,51,0.2)] transition-all duration-300 border border-[#137333]/20 ${mostrarToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <span className="font-bold font-body text-sm">Contrato baixado com sucesso!</span>
      </div>

      <header className="mb-12">
        <div className="inline-flex items-center gap-2 bg-secondary-container/20 text-primary px-4 py-1.5 rounded-full mb-6">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          <span className="text-[12px] font-bold uppercase tracking-wider font-label">Documento Gerado</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4 font-headline">Seu contrato está pronto!</h1>
        <p className="text-on-surface-variant max-w-2xl text-lg font-body">Revisamos os detalhes e estruturamos as cláusulas conforme suas necessidades. Agora você pode personalizar o estilo ou prosseguir para o download.</p>
      </header>

      <section className="mb-12">
        <div className="bg-surface-container-high p-1.5 rounded-full inline-flex flex-wrap gap-1 md:gap-2">
          {tipos.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => trocarTipo(id)}
              className={`px-6 py-2.5 rounded-full text-sm transition-all font-body ${
                tipoAtivo === id
                  ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                  : "text-slate-600 font-medium hover:bg-surface-container"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface-container-lowest rounded-2xl p-10 md:p-16 shadow-[0_20px_40px_rgba(0,43,115,0.03)] relative flex flex-col min-h-[600px]">
            <div className="absolute top-8 right-8 flex items-center gap-2 border border-outline-variant/30 rounded-lg p-3 bg-white/50 backdrop-blur-sm z-20 group relative cursor-help">
              <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {formulario?.modoAssinatura === "eletronica" ? "link" : "edit"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline leading-none mb-1 font-label">
                  {formulario?.modoAssinatura === "eletronica" ? "ACEITE ELETRÔNICO" : "ASSINATURA FÍSICA"}
                </p>
                <p className="text-[12px] font-bold text-primary leading-none font-body">
                  {formulario?.modoAssinatura === "eletronica" ? "Aceite por link eletrônico" : "Documento Impresso"}
                </p>
              </div>
              
              {/* Tooltip */}
              <div className="absolute top-full right-0 mt-2 w-64 bg-surface-container-highest p-3 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-xs font-body text-on-surface-variant border border-outline-variant/20">
                Este contrato foi gerado pelo ContratoFácil e possui registro de criação com data e hora. {formulario?.modoAssinatura === "eletronica" ? "O aceite eletrônico tem validade jurídica conforme o Art. 10 da MP 2.200-2/2001 e o CPC." : "A assinatura física requerida deve ser acordada em ambas as partes para garantir validade jurídica."}
              </div>
            </div>

            <div className="max-w-xl mx-auto w-full relative z-10 flex-grow">
               {carregando && (
                  <div className="flex flex-col items-center justify-center h-full gap-4 pt-20">
                    <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
                    <p className="text-on-surface-variant text-sm font-medium">Processando seu contrato...</p>
                    <div className="w-full space-y-3 mt-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`h-3 bg-surface-container rounded-sm animate-pulse ${i % 3 === 0 ? "w-1/2" : i % 3 === 1 ? "w-full" : "w-5/6"}`} />
                      ))}
                    </div>
                  </div>
                )}

               {erro && !carregando && (
                  <div className="flex flex-col items-center justify-center h-full gap-4 pt-20 text-center">
                    <div className="w-12 h-12 bg-error-container rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-error">error</span>
                    </div>
                    <p className="text-error font-semibold font-body">{erro}</p>
                    <button onClick={() => { setErro(null); gerarTipo(tipoAtivo); }} className="text-primary font-bold text-sm underline font-label">Tentar novamente</button>
                  </div>
                )}

               {!carregando && !erro && textoAtual && (
                  editando ? (
                    <textarea
                      value={textoEditado}
                      onChange={(e) => setTextoEditado(e.target.value)}
                      className="w-full h-full min-h-[500px] bg-transparent text-on-surface text-sm leading-relaxed outline-none resize-none font-body py-4"
                    />
                  ) : (
                    <ContratoPreview conteudo={textoAtual} />
                  )
                )}
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
             {!carregando && textoAtual && !editando && (
                <button onClick={iniciarEdicao} className="flex items-center gap-2 text-primary font-bold hover:bg-surface-container px-8 py-3 rounded-full transition-all font-body">
                  <span className="material-symbols-outlined">edit_note</span>
                  Editar Contrato
                </button>
             )}
             {editando && (
                <button onClick={salvarEdicao} className="flex items-center gap-2 signature-gradient text-white font-bold px-8 py-3 rounded-full transition-all font-body shadow-md">
                  <span className="material-symbols-outlined">save</span>
                  Salvar
                </button>
             )}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,43,115,0.03)]">
            <h3 className="text-xl font-bold text-primary mb-6 font-headline">Próximo Passo</h3>
            <div className="space-y-4">
              <button 
                onClick={baixarPdf}
                disabled={carregando || processandoDownload || !textoAtual}
                className="w-full signature-gradient text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(0,64,161,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 font-body"
              >
                <span className={`material-symbols-outlined ${processandoDownload ? 'animate-spin' : ''}`}>
                  {processandoDownload ? 'refresh' : 'picture_as_pdf'}
                </span>
                {processandoDownload ? 'Processando...' : 'Baixar em PDF'}
              </button>
              <button 
                disabled={carregando || !textoAtual}
                className="w-full bg-surface-container text-primary py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-surface-container-high transition-colors font-body disabled:opacity-50"
              >
                <span className="material-symbols-outlined">mail</span>
                Enviar por E-mail
              </button>

              {user && (
                <button
                  onClick={async () => {
                    const res = await fetch("/api/dev/liberar-perfil");
                    const data = await res.json();
                    alert(data.message || "Testes liberados!");
                  }}
                  className="w-full text-center text-[10px] font-bold text-primary underline underline-offset-4 opacity-50 pt-2 uppercase tracking-widest font-label"
                >
                  [Dev] Modificar Nível
                </button>
              )}
            </div>
            <div className="mt-8 pt-8 border-t border-surface-container">
              <p className="text-xs text-outline text-center font-medium font-body">Arquivos disponíveis por 30 dias na sua conta gratuita.</p>
            </div>
          </div>

          <div className="bg-[#191c1e] p-8 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              </div>
              <h4 className="text-lg font-bold mb-2 font-headline">Segurança de Dados</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-body">Seu documento é processado com criptografia de ponta a ponta. Não armazenamos seus dados sensíveis após a geração.</p>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
