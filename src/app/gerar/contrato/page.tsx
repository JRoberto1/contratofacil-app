import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import VisualizadorContrato from "@/components/contrato/VisualizadorContrato";
import type { FormularioContrato } from "@/types/contrato";

interface Props {
  searchParams: Promise<{ dados?: string }>;
}

export default async function ContratoPage({ searchParams }: Props) {
  const params = await searchParams;

  let formulario: FormularioContrato | null = null;
  try {
    if (params.dados) {
      formulario = JSON.parse(decodeURIComponent(params.dados));
    }
  } catch {
    // JSON inválido
  }

  if (!formulario) redirect("/gerar");

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 px-4 md:px-8 pt-8 pb-32 max-w-6xl mx-auto w-full">
        <VisualizadorContrato formulario={formulario} />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
