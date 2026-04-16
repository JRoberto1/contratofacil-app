interface ProgressRibbonProps {
  step: 1 | 2 | 3;
}

const passoInfo = {
  1: { titulo: "Selecionar Profissão", porc: 33 },
  2: { titulo: "Dados do Contrato", porc: 66 },
  3: { titulo: "Pronto para Gerar", porc: 100 },
};

export default function ProgressRibbon({ step }: ProgressRibbonProps) {
  const { titulo, porc } = passoInfo[step];

  return (
    <header className="mb-12">
      <div className="flex justify-between items-end mb-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary font-label">
            Passo {step} de 3 · {titulo} · {porc}%
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight font-headline text-on-surface">
            Configurar Documento
          </h1>
        </div>
      </div>
      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full signature-gradient rounded-full transition-all duration-500"
          style={{ width: `${porc}%` }}
        ></div>
      </div>
    </header>
  );
}
