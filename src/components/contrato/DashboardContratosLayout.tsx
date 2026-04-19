"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Contrato } from "@/types/contrato";
import { ContratoPreview } from "./ContratoPreview";

interface Props {
  contratos: Contrato[];
  cotaDisponivel: number;
}

function getAvatarParams(nome: string) {
  const nameToUse = nome || "?";
  const cores = ['#E1F5EE', '#EEEDFE', '#FAEEDA', '#FAECE7', '#E6F1FB'];
  const hash = nameToUse.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = cores[hash % cores.length];
  const avatarText = nameToUse.trim().slice(0, 2).toUpperCase();
  return { color, avatarText };
}

function getStatusChip(status: string) {
  switch (status) {
    case 'concluido':
      return { bg: '#E1F5EE', text: '#085041', label: 'Concluído' };
    case 'enviado':
      return { bg: '#E6F1FB', text: '#0C447C', label: 'Enviado' };
    case 'pago':
      return { bg: '#D6F0FF', text: '#004A8F', label: 'Pago' };
    case 'rascunho':
      return { bg: '#FAEEDA', text: '#633806', label: 'Rascunho' };
    default:
      return { bg: '#EEEEEE', text: '#333333', label: status };
  }
}

export function DashboardContratosLayout({ contratos, cotaDisponivel }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [filtroCategoria, setFiltroCategoria] = useState<string>("Todos");
  const [modalContrato, setModalContrato] = useState<Contrato | null>(null);
  const [showConfirmDuplicate, setShowConfirmDuplicate] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const categoriasUnicas = Array.from(new Set(contratos.map(c => c.categoria_custom || c.categoria))).filter(Boolean);
  
  const contratosFiltrados = filtroCategoria === "Todos" 
    ? contratos 
    : contratos.filter(c => (c.categoria_custom || c.categoria) === filtroCategoria);

  // Metricas
  const totalGerados = contratos.filter(c => c.status === 'concluido' || c.status === 'pago' || c.status === 'enviado').length;
  const totalDownloads = contratos.reduce((acc, c) => acc + (c.downloads_count || 0), 0);
  const totalRascunhos = contratos.filter(c => c.status === 'rascunho').length;

  const handleDownload = async (contrato: Contrato) => {
    try {
      setIsDownloading(true);
      
      const response = await fetch('/api/gerar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conteudo: contrato.conteudo }),
      });

      if (!response.ok) throw new Error('Erro ao gerar PDF');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contrato-${contrato.referencia || Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Registra o download independente e silenciosamente caso libere o erro
        const { error: dlError } = await supabase.from('downloads').insert({
          contrato_id: contrato.id,
          user_id: user.id,
        });
        if (dlError) console.error("Error logging download", dlError);
      }

      alert("Download realizado!");
    } catch (e) {
      console.error(e);
      alert("Erro ao baixar o PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDuplicar = async () => {
    if (!modalContrato) return;

    if (cotaDisponivel <= 0) {
      router.push('/planos');
      return;
    }

    try {
      setIsDuplicating(true);
      const res = await fetch('/api/duplicar-contrato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contratoId: modalContrato.id }),
      });

      const resJson = await res.json();
      if (!res.ok) {
        if (resJson.redirect) {
          router.push(resJson.redirect);
          return;
        }
        throw new Error(resJson.error?.message || resJson.error || "Erro de fetch");
      }

      const novoId = resJson.data?.novoId ?? resJson.novoId;
      router.push(`/contrato/${novoId}`);
    } catch (error: any) {
      alert("Falha ao duplicar: " + error.message);
    } finally {
      setIsDuplicating(false);
      setShowConfirmDuplicate(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 fade-in animate-in duration-500">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Total Concluídos</p>
          <p className="text-4xl font-headline font-extrabold text-primary">{totalGerados}</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Total Downloads</p>
          <p className="text-4xl font-headline font-extrabold text-[#0C447C]">{totalDownloads}</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Rascunhos</p>
          <p className="text-4xl font-headline font-extrabold text-[#633806]">{totalRascunhos}</p>
        </div>
      </div>

      {/* Pills Filter */}
      {categoriasUnicas.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFiltroCategoria("Todos")}
            className={`px-5 py-2 rounded-full text-sm font-bold font-headline transition-all ${filtroCategoria === "Todos" ? 'bg-primary text-white shadow-sm' : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Todos
          </button>
          {categoriasUnicas.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold font-headline transition-all ${filtroCategoria === cat ? 'bg-primary text-white shadow-sm' : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Desktop View (Table) */}
      <div className="hidden md:block bg-surface-container-lowest border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-xs uppercase tracking-widest text-on-surface-variant">
              <th className="p-5 font-bold">Cliente</th>
              <th className="p-5 font-bold">Categoria</th>
              <th className="p-5 font-bold">Valor</th>
              <th className="p-5 font-bold">Data</th>
              <th className="p-5 font-bold">Status</th>
              <th className="p-5 font-bold text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {contratosFiltrados.map((item) => {
              const { color, avatarText } = getAvatarParams(item.cliente_nome);
              const chip = getStatusChip(item.status);
              
              return (
                <tr key={item.id} className="border-t border-outline-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: color, color: '#333' }}>
                        {avatarText}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface font-headline">{item.cliente_nome || 'Não definido'}</p>
                        <p className="text-xs text-on-surface-variant">{item.referencia || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-sm text-on-surface-variant font-medium">
                    {item.categoria_custom || item.categoria}
                  </td>
                  <td className="p-5 text-sm font-medium text-on-surface">
                    {item.servico_valor ? `R$ ${(item.servico_valor / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                  </td>
                  <td className="p-5 text-sm text-on-surface-variant">
                    {item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="p-5">
                    <span 
                      className="px-3 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md" 
                      style={{ backgroundColor: chip.bg, color: chip.text }}
                    >
                      {chip.label}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <button 
                      onClick={() => setModalContrato(item)}
                      className="text-primary hover:text-primary/70 font-medium text-sm flex items-center justify-center gap-1 mx-auto"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      Detalhes
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {contratosFiltrados.length === 0 && (
          <div className="p-12 text-center text-on-surface-variant font-body">
            Nenhum contrato encontrado.
          </div>
        )}
      </div>

      {/* Mobile View (Cards) */}
      <div className="md:hidden flex flex-col gap-4">
        {contratosFiltrados.map((item) => {
          const { color, avatarText } = getAvatarParams(item.cliente_nome);
          const chip = getStatusChip(item.status);

          return (
            <div key={item.id} className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: color, color: '#333' }}>
                    {avatarText}
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface font-headline leading-tight">{item.cliente_nome || 'Não definido'}</h3>
                    <p className="text-xs text-on-surface-variant">{item.referencia || 'N/A'}</p>
                  </div>
                </div>
                <span 
                  className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md shrink-0" 
                  style={{ backgroundColor: chip.bg, color: chip.text }}
                >
                  {chip.label}
                </span>
              </div>
              
              <div className="text-sm text-on-surface-variant flex flex-col gap-1 mb-4">
                <p><span className="font-medium text-on-surface">Categoria:</span> {item.categoria_custom || item.categoria}</p>
                <p><span className="font-medium text-on-surface">Valor:</span> {item.servico_valor ? `R$ ${(item.servico_valor / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</p>
              </div>

              <div className="flex justify-between items-center border-t border-outline-variant/20 pt-4 mt-2">
                <p className="text-xs text-on-surface-variant">{item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-BR') : '-'}</p>
                <button 
                  onClick={() => setModalContrato(item)}
                  className="text-primary font-bold text-sm flex items-center gap-1 active:scale-95 transition-transform"
                >
                  Ver detalhes
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalContrato && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm shadow-2xl animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-start bg-surface">
              <div>
                <h2 className="text-2xl font-headline font-extrabold text-on-surface">Detalhes do Contrato</h2>
                <p className="text-on-surface-variant font-medium text-sm mt-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">tag</span>
                  {modalContrato.referencia || 'Sem Referência'}
                </p>
              </div>
              <button onClick={() => { setModalContrato(null); setShowConfirmDuplicate(false); }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: "400px" }}>
              {modalContrato.conteudo ? (
                <div className="prose prose-sm prose-slate mx-auto max-w-none prose-headings:font-headline opacity-90 pb-4">
                  <ContratoPreview conteudo={modalContrato.conteudo} />
                </div>
              ) : (
                <div className="text-center p-10 bg-surface-container-low rounded-2xl">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50 mb-4 block">edit_document</span>
                  <p className="text-on-surface-variant font-medium">Este contrato ainda não foi finalizado e processado.</p>
                </div>
              )}
            </div>

            <div className="bg-surface-container/30 px-6 py-4 border-t border-outline-variant/20">
              <div className="flex items-start gap-3 p-4 bg-surface-container-low/50 rounded-xl mb-6">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] opacity-70">lock</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Este contrato é imutável para a segurança do documento. Use <strong>Duplicar e editar</strong> para criar uma versão modificada baseada neste.
                </p>
              </div>

              {!showConfirmDuplicate ? (
                <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => setShowConfirmDuplicate(true)}
                    className="px-6 py-3 rounded-full font-bold font-headline text-primary border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all w-full sm:w-auto"
                  >
                    Duplicar e editar
                  </button>
                  <button
                    onClick={() => handleDownload(modalContrato)}
                    disabled={!modalContrato.conteudo || isDownloading}
                    className="signature-gradient text-white px-8 py-3 rounded-full font-bold font-headline shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    {isDownloading ? (
                      <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px]">download</span>
                    )}
                    Baixar PDF
                  </button>
                </div>
              ) : (
                <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl animate-in slide-in-from-bottom-4">
                  <h4 className="font-bold text-primary mb-2 font-headline">Criar novo contrato a partir deste?</h4>
                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                    A cópia consumirá <strong>1 unidade</strong> da sua cota. O original ficará intacto.<br/>
                    Você tem <strong>{cotaDisponivel} contratos disponíveis.</strong>
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button 
                      disabled={isDuplicating}
                      onClick={() => setShowConfirmDuplicate(false)} 
                      className="px-5 py-2 font-bold text-on-surface-variant hover:text-on-surface disabled:opacity-50 rounded-full"
                    >
                      Cancelar
                    </button>
                    <button 
                      disabled={isDuplicating}
                      onClick={handleDuplicar} 
                      className="bg-primary text-white font-bold px-6 py-2 rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {isDuplicating ? (
                         <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      ): null}
                      Confirmar e editar
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
