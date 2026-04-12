import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ContratoFácil — Formalize seu serviço em 5 minutos",
  description:
    "Pare de tomar calote. Gere contratos profissionais para MEIs e autônomos com inteligência artificial. 2 contratos por mês grátis, sem cartão.",
  openGraph: {
    title: "ContratoFácil — Formalize seu serviço em 5 minutos",
    description:
      "Pare de tomar calote. Gere contratos profissionais para MEIs e autônomos com inteligência artificial.",
    siteName: "ContratoFácil",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#f7f9fb] text-[#191c1e]">
        {children}
      </body>
    </html>
  );
}
