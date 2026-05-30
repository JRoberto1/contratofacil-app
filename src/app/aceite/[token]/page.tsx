"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ContratoPreview } from "@/components/contrato/ContratoPreview";

type EstadoPagina = "carregando" | "expirado" | "ja-aceito" | "valido" | "confirmado" | "erro";

interface DadosContrato {
  id: string;
  referencia: string;
  conteudo: string;
  prestador_nome: string;
  cliente_nome: string;
  aceite_em?: string;
}

interface DadosConfirmacao {
  aceite_em: string;
  referencia: string;
  prestador_nome: string;
}

export default function AceitePage() {
  const { token } = useParams<{ token: string }>();
  const [estado, setEstado] = useState<EstadoPagina>("carregando");
  const [contrato, setContrato] = useState<DadosContrato | null>(null);
  const [confirmacao, setConfirmacao] = useState<DadosConfirmacao | null>(null);
  const [aceiteEm, setAceiteEm] = useState<string>("");
  const [concordou, setConcordou] = useState(false);
  const [aceitando, setAceitando] = useState(false);
  const [erroMsg, setErroMsg] = useState("");

  useEffect(() => {
    if (!token) { setEstado("erro"); return; }
    buscarContrato();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function buscarContrato() {
    try {
      // Usa a API de busca pública (leitura por token via RLS)
      const res = await fetch(`/api/buscar-contrato-por-token?token=${token}`);
      const json = await res.json();

      if (!res.ok) {
        const code = json?.error?.code ?? json?.code ?? "";
        if (code === "EXPIRED")          { setEstado("expirado"); return; }
        if (code === "ALREADY_ACCEPTED") {
          setAceiteEm(json?.data?.aceite_em ?? "");
          setEstado("ja-aceito");
          return;
        }
        setErroMsg(json?.error?.message ?? "Link inválido ou contrato não encontrado.");
        setEstado("erro");
        return;
      }

      const c = json?.data;
      if (c?.aceite_status === "aceito") {
        setAceiteEm(c.aceite_em ?? "");
        setEstado("ja-aceito");
        return;
      }

      setContrato(c);
      setEstado("valido");
    } catch {
      setErroMsg("Erro ao carregar o contrato. Tente novamente.");
      setEstado("erro");
    }
  }

  async function handleAceitar() {
    if (!concordou || aceitando) return;
    setAceitando(true);
    setErroMsg("");

    try {
      const res = await fetch("/api/registrar-aceite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();

      if (!res.ok) {
        const code = json?.error?.code ?? "";
        if (code === "EXPIRED")          { setEstado("expirado"); return; }
        if (code === "ALREADY_ACCEPTED") { setEstado("ja-aceito"); return; }
        throw new Error(json?.error?.message ?? "Erro ao registrar aceite.");
      }

      setConfirmacao(json?.data);
      setEstado("confirmado");
    } catch (e: unknown) {
      setErroMsg(e instanceof Error ? e.message : "Erro desconhecido.");
    } finally {
      setAceitando(false);
    }
  }

  // ─── LOADING ───────────────────────────────────────────────────────────────
  if (estado === "carregando") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
        <p className="text-on-surface-variant font-medium">Carregando contrato…</p>
      </div>
    );
  }

  // ─── EXPIRADO ──────────────────────────────────────────────────────────────
  if (estado === "expirado") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-error text-4xl">link_off</span>
        </div>
        <h1 className="text-2xl font-extrabold font-headline text-on-surface">Link expirado</h1>
        <p className="text-on-surface-variant max-w-sm leading-relaxed">
          Este link de aceite expirou. Por favor, solicite um novo link ao prestador de serviços.
        </p>
      </div>
    );
  }

  // ─── JÁ ACEITO ─────────────────────────────────────────────────────────────
  if (estado === "ja-aceito") {
    const dataFormatada = aceiteEm
      ? new Date(aceiteEm).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
      : "";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        </div>
        <h1 className="text-2xl font-extrabold font-headline text-on-surface">Contrato já aceito</h1>
        {dataFormatada && (
          <p className="text-on-surface-variant max-w-sm leading-relaxed">
            Este contrato foi aceito em <strong>{dataFormatada}</strong>.
          </p>
        )}
      </div>
    );
  }

  // ─── ERRO ──────────────────────────────────────────────────────────────────
  if (estado === "erro") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-error text-4xl">error</span>
        </div>
        <h1 className="text-2xl font-extrabold font-headline text-on-surface">Link inválido</h1>
        <p className="text-on-surface-variant max-w-sm leading-relaxed">
          {erroMsg || "Este link é inválido ou o contrato não foi encontrado."}
        </p>
      </div>
    );
  }

  // ─── CONFIRMADO ────────────────────────────────────────────────────────────
  if (estado === "confirmado" && confirmacao) {
    const dataFormatada = new Date(confirmacao.aceite_em).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      dateStyle: "long",
      timeStyle: "short",
    });
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6 pb-16">
        <div className="w-24 h-24 rounded-full bg-[#e8f5e9] flex items-center justify-center animate-in zoom-in-95 duration-300">
          <span className="material-symbols-outlined text-[#2e7d32] text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h1 className="text-3xl font-extrabold font-headline text-on-surface">Contrato aceito com sucesso!</h1>
        <div className="bg-surface-container-low rounded-2xl p-6 max-w-sm w-full text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Contrato</span>
            <span className="font-bold text-on-surface">{confirmacao.referencia}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Aceito em</span>
            <span className="font-bold text-on-surface">{dataFormatada}</span>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
          Um e-mail de confirmação foi enviado. Guarde o número <strong>{confirmacao.referencia}</strong> como comprovante.
        </p>
      </div>
    );
  }

  // ─── VÁLIDO — contrato para aceite ─────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto w-full px-4 md:px-6 pb-40 pt-8 animate-in fade-in duration-500">

      {/* Header simples */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xl font-extrabold font-headline text-primary tracking-tight">ContratoFácil</span>
        <span className="text-xs text-on-surface-variant font-body">Um produto FlowIQ</span>
      </div>

      {/* Banner de convite */}
      <div className="bg-primary/8 border border-primary/20 rounded-2xl p-5 mb-8 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
        </div>
        <div>
          <p className="font-bold text-primary font-headline text-base">Você foi convidado a aceitar este contrato</p>
          <p className="text-sm text-on-surface-variant mt-1 font-body">
            Leia o documento completo abaixo antes de aceitar. Ao aceitar, seu IP e horário serão registrados.
          </p>
        </div>
      </div>

      {/* Contrato */}
      <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-sm border border-outline-variant/20 mb-8">
        {contrato?.conteudo ? (
          <ContratoPreview conteudo={contrato.conteudo} />
        ) : (
          <p className="text-on-surface-variant text-center py-8">Conteúdo do contrato não disponível.</p>
        )}
      </div>

      {/* Erro inline */}
      {erroMsg && (
        <div className="mb-4 p-4 bg-error/10 text-error rounded-xl text-sm font-medium">
          {erroMsg}
        </div>
      )}

      {/* Seção de aceite — fixada ao final da viewport */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/30 px-4 py-5 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] z-30">
        <div className="max-w-3xl mx-auto">
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={concordou}
              onChange={(e) => setConcordou(e.target.checked)}
              className="w-5 h-5 rounded accent-primary mt-0.5 shrink-0 cursor-pointer"
            />
            <span className="text-sm text-on-surface font-body leading-relaxed">
              Li e concordo com todos os termos deste contrato na íntegra
            </span>
          </label>
          <button
            onClick={handleAceitar}
            disabled={!concordou || aceitando}
            className="w-full signature-gradient text-white font-bold py-4 rounded-full font-headline shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {aceitando ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                Registrando aceite…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Aceitar e assinar contrato
              </>
            )}
          </button>
          <p className="text-[11px] text-on-surface-variant text-center mt-3 font-body leading-relaxed">
            Ao aceitar, seu IP e horário serão registrados como prova jurídica do aceite,
            nos termos da MP 2.200-2/2001.
          </p>
        </div>
      </div>
    </div>
  );
}
