import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import SeletorCategoria from "@/components/contrato/SeletorCategoria";

export const metadata = {
  title: "Criar Contrato — ContratoFácil",
  description: "Selecione a categoria do seu serviço para gerar um contrato profissional.",
};

export default function GerarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 px-6 pt-8 pb-32 max-w-2xl mx-auto w-full">
        <SeletorCategoria />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
