"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SeletorCategoria from "@/components/contrato/SeletorCategoria";
import Formulario from "@/components/contrato/Formulario";
import VisualizadorContrato from "@/components/contrato/VisualizadorContrato";
import type { FormularioContrato, CategoriaContrato } from "@/types/contrato";

function GerarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawStep = searchParams?.get("step");
  const urlStep = rawStep ? parseInt(rawStep) : 1;
  const currentStep = [1, 2, 3].includes(urlStep) ? (urlStep as 1 | 2 | 3) : 1;

  // Persists memory
  const [categoria, setCategoria] = useState<CategoriaContrato | null>(null);
  const [categoriaCustom, setCategoriaCustom] = useState<string>("");
  const [formData, setFormData] = useState<Omit<FormularioContrato, "categoria" | "categoriaCustom"> | null>(null);

  // Sync state backwards: If url is step 2 but no category selected, redirect to 1
  useEffect(() => {
    if (currentStep >= 2 && !categoria) {
      router.replace("/gerar?step=1");
    }
  }, [currentStep, categoria, router]);

  const handleSelectCategoria = (selecionada: string, custom?: string) => {
    setCategoria(selecionada as CategoriaContrato);
    if (custom) setCategoriaCustom(custom);
    router.push("/gerar?step=2");
  };

  const handleFormularioSubmit = (dados: FormularioContrato) => {
    setFormData({
      prestador: dados.prestador,
      cliente: dados.cliente,
      servico: dados.servico,
    });
    router.push("/gerar?step=3");
  };

  return (
    <>
      <div className="mt-8">
        {currentStep === 1 && (
          <SeletorCategoria onSelect={handleSelectCategoria} />
        )}

        {currentStep === 2 && categoria && (
          <Formulario
            categoria={categoria}
            categoriaCustom={categoriaCustom}
            initialData={formData || undefined}
            onBack={() => router.push("/gerar?step=1")}
            onSubmit={handleFormularioSubmit}
          />
        )}

        {currentStep === 3 && categoria && formData && (
          <VisualizadorContrato
            formulario={{
              categoria,
              categoriaCustom,
              ...formData,
            }}
            onBack={() => router.push("/gerar?step=2")}
          />
        )}
      </div>
    </>
  );
}

export default function GerarPage() {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Suspense fallback={
        <div className="w-full mt-8 animate-pulse">
           <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden mb-12"></div>
           <div className="h-64 bg-surface-container-low rounded-3xl w-full"></div>
        </div>
      }>
        <GerarContent />
      </Suspense>
    </div>
  );
}
