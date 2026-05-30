"use client";

import { useState } from "react";
import Link from "next/link";

export default function PlanosPage() {
  const [loadingPlano, setLoadingPlano] = useState<string | null>(null);

  async function handleCheckout(plano: string) {
    setLoadingPlano(plano);
    try {
      const res = await fetch("/api/criar-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano }),
      });
      const json = await res.json();

      if (!res.ok) {
        // Se não autenticado, redireciona para login
        if (res.status === 401) { window.location.href = "/login"; return; }
        throw new Error(json?.error?.message ?? "Erro ao iniciar checkout.");
      }

      const url: string = json?.data?.url ?? json?.url;
      if (url) window.location.href = url;
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao processar. Tente novamente.");
    } finally {
      setLoadingPlano(null);
    }
  }

  const btnBase = "block text-center w-full py-3 px-4 font-label text-sm font-semibold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const btnNeutro = `${btnBase} bg-surface-container-high text-on-secondary-container hover:bg-surface-container-highest`;
  const btnDestaque = `${btnBase} bg-white text-primary hover:bg-surface-bright py-4 font-extrabold`;

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4">Escolha a segurança ideal para seus negócios</h1>
          <p className="font-body text-on-surface-variant text-lg">Planos flexíveis para quem busca agilidade jurídica sem burocracia.</p>
        </div>

        {/* Bento Grid Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

          {/* Card 1: Grátis */}
          <div className="bg-surface-container-low p-8 rounded-lg flex flex-col justify-between architectural-layer">
            <div>
              <h3 className="font-headline text-xl font-bold mb-2">Grátis</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-primary font-headline">R$ 0</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span>2 contratos/mês</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-sm">credit_card_off</span>
                  <span>Sem cartão</span>
                </li>
              </ul>
            </div>
            <Link href="/gerar" className={btnNeutro}>
              Começar agora
            </Link>
          </div>

          {/* Card 2: Avulso */}
          <div className="bg-surface-container-low p-8 rounded-lg flex flex-col justify-between architectural-layer">
            <div>
              <h3 className="font-headline text-xl font-bold mb-2">Avulso</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-primary font-headline">R$ 4,90</span>
                <span className="text-on-surface-variant text-sm">/contrato</span>
              </div>
              <p className="text-sm text-on-surface-variant mb-6 italic">Pague só quando precisar</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-sm">verified</span>
                  <span>Categorias ilimitadas</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-sm">picture_as_pdf</span>
                  <span>PDF Profissional</span>
                </li>
              </ul>
            </div>
            {/* Avulso: checkout acontece na tela de download */}
            <Link href="/gerar" className={btnNeutro}>
              Começar agora
            </Link>
          </div>

          {/* Card 3: Mensal (DESTAQUE) */}
          <div className="signature-gradient p-8 rounded-lg flex flex-col justify-between text-white architectural-layer relative transform md:scale-105 z-10 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary-container text-primary font-label text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">workspace_premium</span>MAIS POPULAR
            </div>
            <div>
              <h3 className="font-headline text-xl font-bold mb-2">Mensal</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold font-headline">R$ 19</span>
                <span className="opacity-80 text-sm">/mês</span>
              </div>
              <p className="text-sm opacity-90 mb-6">Contratos ilimitados</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-secondary-container text-sm" style={{fontVariationSettings: "'FILL' 1"}}>all_inclusive</span>
                  <span>Uso ilimitado</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-secondary-container text-sm" style={{fontVariationSettings: "'FILL' 1"}}>history</span>
                  <span>Histórico completo</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-secondary-container text-sm" style={{fontVariationSettings: "'FILL' 1"}}>file_present</span>
                  <span>4 formatos de exportação</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout("mensal")}
              disabled={loadingPlano !== null}
              className={btnDestaque}
            >
              {loadingPlano === "mensal" ? "Aguarde…" : "Começar agora"}
            </button>
          </div>

          {/* Card 4: Semestral */}
          <div className="bg-surface-container-low p-8 rounded-lg flex flex-col justify-between architectural-layer">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline text-xl font-bold">Semestral</h3>
                <span className="text-[10px] font-bold bg-error-container text-on-error-container px-2 py-0.5 rounded">-22%</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-primary font-headline">R$ 89</span>
                <span className="text-on-surface-variant text-sm">/6 meses</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-sm">savings</span>
                  <span>Economia real</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                  <span>Todos os recursos Pro</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout("semestral")}
              disabled={loadingPlano !== null}
              className={btnNeutro}
            >
              {loadingPlano === "semestral" ? "Aguarde…" : "Começar agora"}
            </button>
          </div>

          {/* Card 5: Anual */}
          <div className="bg-surface-container-low p-8 rounded-lg flex flex-col justify-between architectural-layer">
            <div>
              <h3 className="font-headline text-xl font-bold mb-2">Anual</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-primary font-headline">R$ 159</span>
                <span className="text-on-surface-variant text-sm">/ano</span>
              </div>
              <p className="text-sm font-semibold text-secondary mb-6">Melhor custo-benefício</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-sm">star</span>
                  <span>Prioridade no suporte</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-sm">workspace_premium</span>
                  <span>Acesso Premium total</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout("anual")}
              disabled={loadingPlano !== null}
              className={btnNeutro}
            >
              {loadingPlano === "anual" ? "Aguarde…" : "Começar agora"}
            </button>
          </div>
        </div>

        {/* Inclusion Banner */}
        <div className="mt-20 p-8 bg-surface-container-lowest rounded-xl border border-outline-variant/10 text-center">
          <h4 className="font-headline font-bold text-primary mb-6">Incluso em todos os planos pagos:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-on-surface-variant">
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary">category</span>
              Todas categorias
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary">manage_search</span>
              Histórico
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary">extension</span>
              4 formatos
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              PDF Profissional
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
