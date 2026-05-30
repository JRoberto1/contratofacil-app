import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Senha | ContratoFácil",
  description: "Redefina sua senha de acesso ao ContratoFácil.",
};

export default function EsqueciSenhaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
