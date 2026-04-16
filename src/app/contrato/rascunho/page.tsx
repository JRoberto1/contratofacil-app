"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VisualizadorContrato from "@/components/contrato/VisualizadorContrato";
import type { FormularioContrato, TipoContrato } from "@/types/contrato";

export default function RascunhoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormularioContrato | null>(null);
  const [tipo, setTipo] = useState<TipoContrato | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("contratofacil_rascunho_completo");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formulario);
        setTipo(parsed.tipo || "completo-formal");
      } catch (e) {
        console.error("Erro ao ler rascunho", e);
        router.push("/gerar");
      }
    } else {
      router.push("/gerar");
    }
  }, [router]);

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
          onBack={() => router.push("/gerar?passo=1")}
        />
      </main>
    </div>
  );
}
