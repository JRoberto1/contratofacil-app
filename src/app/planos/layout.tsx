import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planos | ContratoFácil",
  description: "Planos para MEIs e autônomos. Comece grátis ou escolha o plano ideal para o seu volume.",
};

export default function PlanosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
