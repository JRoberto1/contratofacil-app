"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VisualizadorContrato from "@/components/contrato/VisualizadorContrato";
import type { FormularioContrato, TipoContrato } from "@/types/contrato";

export default function EditarContratoClient({ contrato, contratoId }: { contrato: any, contratoId: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormularioContrato | null>(null);
  const [tipo, setTipo] = useState<TipoContrato>("completo-formal");
  const [conteudoInicial, setConteudoInicial] = useState<string | null>(null);

  useEffect(() => {
    // Se já tem conteúdo no DB, nós apenas exibimos. O formulário pode ser um mockup só pra VisualizadorContrato não quebrar,
    // OU ensinamos VisualizadorContrato a aceitar formulario NULL se alreadyHasConteudo for true.
    if (contrato.conteudo) {
      setConteudoInicial(contrato.conteudo);
      setTipo(contrato.tipo as TipoContrato);
      
      // Criamos um formulário mock para uso do Visualizador 
      setFormData({
        categoria: contrato.categoria,
        modoAssinatura: "eletronica",
        cliente: { nomeRazaoSocial: contrato.cliente_nome, cpfCnpj: contrato.cliente_doc, cidade: "", estado: "" },
        prestador: { nomeCompleto: contrato.prestador_nome, cpfCnpj: contrato.prestador_doc, cidade: "", estado: "", logradouro: "", numero: "", profissao: "", civil: "", nacionalidade: "" },
        servico: { descricao: contrato.servico_descricao, valor: contrato.servico_valor ? (contrato.servico_valor / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '', prazoEntrega: contrato.servico_prazo, formaPagamento: contrato.servico_pagamento, formaPagamentoTipo: "outro", formaPagamentoDetalhes: {} }
      } as any);
      return;
    }

    // Se está "gerando", usamos o localStorage para ter os dados completos e chamar a IA
    const saved = localStorage.getItem("contratofacil_rascunho_completo");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formulario);
        setTipo(parsed.tipo || "completo-formal");
      } catch (e) {
        console.error("Erro ao ler rascunho", e);
      }
    } else {
      // Se não tem localStorage, e tá gerando? Volta pro gerador
      router.push("/gerar");
    }
  }, [contrato, router]);

  if (!formData || !tipo) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-4">
      <main className="flex-1 w-full px-4 md:px-6 pb-24 max-w-7xl mx-auto">
        <VisualizadorContrato 
          formulario={formData}
          tipoInicial={tipo}
          contratoId={contratoId}
          conteudoDB={conteudoInicial}
          onBack={() => router.push("/meus-contratos")}
        />
      </main>
    </div>
  );
}
