import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import Formulario from "@/components/contrato/Formulario";
import type { CategoriaContrato } from "@/types/contrato";

const categoriasValidas: CategoriaContrato[] = [
  "fotografo",
  "videomaker",
  "designer-grafico",
  "desenvolvedor-web",
  "social-media",
  "redator",
  "ilustrador",
  "motion-designer",
  "editor-de-video",
  "outros",
];

interface Props {
  searchParams: Promise<{ categoria?: string; categoriaCustom?: string }>;
}

export default async function FormularioPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoria = params.categoria as CategoriaContrato | undefined;

  if (!categoria || !categoriasValidas.includes(categoria)) {
    redirect("/gerar");
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 px-6 pt-8 pb-32">
        <Formulario
          categoria={categoria}
          categoriaCustom={params.categoriaCustom}
        />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
