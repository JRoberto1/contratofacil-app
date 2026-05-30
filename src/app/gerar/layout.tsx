import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerar Contrato | ContratoFácil",
  description: "Crie seu contrato de prestação de serviços em 5 minutos. Sem juridiquês, sem advogado.",
};

export default function GerarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
