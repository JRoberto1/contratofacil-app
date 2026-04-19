"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Formulario from "@/components/contrato/Formulario";
import VisualizadorContrato from "@/components/contrato/VisualizadorContrato";
import SeletorCategoria from "@/components/contrato/SeletorCategoria";

export default function GerarPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOther, setIsOther] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const [formData, setFormData] = useState<any>(null);

  const handleFormSubmit = async (dados: any, tipoAtivo: import("@/types/contrato").TipoContrato) => {
    // Salva sempre no localStorage para que EditarContratoClient possa gerar o conteúdo via IA
    localStorage.setItem("contratofacil_rascunho_completo", JSON.stringify({
      formulario: dados,
      tipo: tipoAtivo,
      timestamp: new Date().toISOString()
    }));

    try {
      const res = await fetch("/api/salvar-contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formulario: dados,
          tipo: tipoAtivo,
          conteudo: ""
        })
      });

      if (!res.ok) throw new Error("Falha ao preparar geração");

      const json = await res.json();
      const id = json?.data?.id ?? json?.id;
      router.push(`/contrato/${id}`);
    } catch (e) {
      console.error(e);
      router.push("/contrato/rascunho");
    }
  };

  // Se vier com o query param ?passo=1, inicia na etapa 1 (Formulário)
  if (typeof window !== "undefined" && step === 0 && window.location.search.includes("passo=1")) {
    setStep(1);
    // Remove query param sem dar reload
    window.history.replaceState(null, "", "/gerar");
  }

  const categories = [
    { id: "designer", icon: "palette", title: "Designer / Freelancer Digital", desc: "Logos, UI/UX, Social Media" },
    { id: "dev", icon: "code", title: "Desenvolvedor de Software", desc: "Sites, Apps, Sistemas" },
    { id: "photo", icon: "photo_camera", title: "Fotógrafo / Videomaker", desc: "Eventos, Ensaios, Edição" },
    { id: "consultant", icon: "school", title: "Consultor / Professor", desc: "Aulas, Mentorias, Estratégia" },
    { id: "maintenance", icon: "construction", title: "Eletricista / Encanador", desc: "Reparos e Manutenção" },
    { id: "other", icon: "more_horiz", title: "Outros", desc: "Personalizado" },
  ];

  const handleCategoryClick = (id: string) => {
    setSelectedCategory(id);
    if (id === "other") {
      setIsOther(true);
    } else {
      setIsOther(false);
    }
  };

  const handleNextStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-4">
      {step === 0 && (
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 pb-24 pt-4">
          <SeletorCategoria 
            onSelect={(catId, customText) => {
              setSelectedCategory(catId);
              if (catId === "other") {
                setIsOther(true);
                setOtherValue(customText || "");
              } else {
                setIsOther(false);
              }
              setStep(1);
            }}
          />
        </main>
      )}

      {step === 1 && (
        <main className="flex-1 w-full px-4 md:px-6 pb-24">
          <Formulario
            categoria={selectedCategory as any}
            categoriaCustom={isOther ? otherValue : undefined}
            onBack={() => setStep(0)}
            onSubmit={handleFormSubmit}
          />
        </main>
      )}
    </div>
  );
}
