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
  const [showCotaModal, setShowCotaModal] = useState(false);
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

      const json = await res.json();
      if (!res.ok) {
        const code = json?.error?.code ?? json?.code;
        const msg: string = json?.error?.message ?? json?.message ?? json?.error ?? "";
        if (code === "QUOTA_EXCEEDED" || msg.toLowerCase().includes("cota")) {
          setShowCotaModal(true);
          return;
        }
        throw new Error(msg || "Falha ao preparar geração");
      }

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

      {/* ── Modal: Cota Esgotada ───────────────────────────────────── */}
      {showCotaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-surface rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
              </div>
              <h2 className="text-xl font-extrabold font-headline text-on-surface">
                Limite do plano gratuito atingido
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Você usou seus <strong>2 contratos gratuitos</strong> deste mês. Para continuar gerando contratos, escolha uma das opções:
              </p>
              <div className="flex flex-col gap-3 w-full mt-2">
                <button
                  onClick={() => router.push('/planos')}
                  className="w-full signature-gradient text-white font-bold py-3 rounded-full font-headline shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Ver planos
                </button>
                <button
                  onClick={() => router.push('/planos#avulso')}
                  className="w-full border-2 border-primary/30 text-primary font-bold py-3 rounded-full font-headline hover:border-primary/60 hover:bg-primary/5 transition-all"
                >
                  Contrato avulso — R$&nbsp;4,90
                </button>
                <button
                  onClick={() => setShowCotaModal(false)}
                  className="text-sm text-on-surface-variant hover:text-on-surface transition-colors mt-1"
                >
                  Agora não
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
