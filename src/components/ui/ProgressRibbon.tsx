interface ProgressRibbonProps {
  step: 1 | 2 | 3;
}

const labels = ["Categoria", "Dados", "Contrato"];

export default function ProgressRibbon({ step }: ProgressRibbonProps) {
  const percent = (step / 3) * 100;

  return (
    <div className="w-full mb-8">
      <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full bg-cta-gradient rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {labels.map((label, i) => (
          <span
            key={label}
            className={`text-[10px] font-bold uppercase tracking-wider transition-colors font-sans ${
              i + 1 <= step ? "text-primary" : "text-on-surface-variant opacity-40"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
