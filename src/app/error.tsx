"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Aplicação encontrou um erro:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-surface">
      <h2 className="text-2xl font-bold text-error mb-4">Algo deu errado!</h2>
      <p className="text-on-surface-variant mb-6 bg-surface-container-low p-4 rounded-lg font-mono text-sm max-w-2xl overflow-auto">
        {error.message || "Erro inesperado"}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold hover:brightness-110"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="px-6 py-2 bg-surface-container-high text-on-surface rounded-lg font-bold hover:brightness-95"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
