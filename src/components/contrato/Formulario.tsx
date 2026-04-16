"use client";

import { useState, useEffect } from "react";
import type { FormularioContrato, CategoriaContrato } from "@/types/contrato";

interface FormularioProps {
  categoria: CategoriaContrato;
  categoriaCustom?: string;
  initialData?: Omit<FormularioContrato, "categoria" | "categoriaCustom">;
  onBack: () => void;
  onSubmit: (dados: FormularioContrato) => void;
}

export default function Formulario({
  categoria,
  categoriaCustom,
  initialData,
  onBack,
  onSubmit,
}: FormularioProps) {
  const [formData, setFormData] = useState({
    prestador: { nomeCompleto: "", cpfCnpj: "" },
    cliente: { nomeRazaoSocial: "", cpfCnpj: "" },
    servico: { descricao: "", valor: 0, prazoEntrega: "", formaPagamento: "", clausulasEspeciais: "" },
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load local storage draft if available and no initialData
    if (initialData) {
      setFormData(initialData as any);
    } else {
      const draft = localStorage.getItem("contratofacil_draft");
      if (draft) setFormData(JSON.parse(draft));
    }
  }, [initialData]);

  const handleChange = (section: "prestador" | "cliente" | "servico", field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    setSaved(false);
  };

  const saveDraft = () => {
    localStorage.setItem("contratofacil_draft", JSON.stringify(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      categoria,
      categoriaCustom,
      ...(formData as any),
    });
  };

  const getLabel = () => categoria === "outros" ? categoriaCustom : categoria;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col pt-4">
      
      {/* Progress Ribbon */}
      <div className="w-full mb-10">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary font-label">
              PASSO 1 DE 3
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight font-headline text-on-surface">
              Dados do Contrato
            </h1>
          </div>
          <span className="text-xl font-extrabold font-headline text-primary">33%</span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full w-1/3"></div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center bg-surface-container-low rounded-xl px-4 py-3">
        <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Categoria</span>
        <span className="text-sm font-bold text-on-surface uppercase">{getLabel()}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Seção Prestador */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">badge</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-body">Prestador (Autônomo)</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Nome Completo</label>
              <input 
                required 
                type="text" 
                placeholder="Seu nome completo"
                value={formData.prestador.nomeCompleto}
                onChange={e => handleChange("prestador", "nomeCompleto", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">CPF ou CNPJ</label>
              <input 
                required 
                type="text" 
                placeholder="000.000.000-00"
                value={formData.prestador.cpfCnpj}
                onChange={e => handleChange("prestador", "cpfCnpj", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
              />
            </div>
          </div>
        </div>

        {/* Seção Cliente */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">person</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-body">Cliente (Contratante)</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Nome do Cliente</label>
              <input 
                required 
                type="text" 
                placeholder="Nome ou Razão Social"
                value={formData.cliente.nomeRazaoSocial}
                onChange={e => handleChange("cliente", "nomeRazaoSocial", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">CPF ou CNPJ</label>
              <input 
                required 
                type="text" 
                placeholder="000.000.000-00"
                value={formData.cliente.cpfCnpj}
                onChange={e => handleChange("cliente", "cpfCnpj", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
              />
            </div>
          </div>
        </div>

        {/* Seção Detalhes do Serviço */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">description</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-body">Detalhes do Serviço</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Descrição do Serviço</label>
              <textarea 
                required 
                placeholder="O que será entregue?"
                rows={3}
                value={formData.servico.descricao}
                onChange={e => handleChange("servico", "descricao", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Valor (R$)</label>
                <input 
                  required 
                  type="text" 
                  placeholder="0.000,00"
                  value={formData.servico.valor}
                  onChange={e => handleChange("servico", "valor", e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Prazo</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Ex: 15 dias"
                  value={formData.servico.prazoEntrega}
                  onChange={e => handleChange("servico", "prazoEntrega", e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Forma de pagamento acordada</label>
              <input 
                required 
                type="text" 
                placeholder="Ex: PIX (50% entrada, 50% entrega)"
                value={formData.servico.formaPagamento}
                onChange={e => handleChange("servico", "formaPagamento", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
              />
            </div>
            <div className="mt-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Cláusulas Especiais / Observações (Opcional)</label>
              <textarea 
                placeholder="Ex: Multa de 10% por atraso; Adicional de urgência; Entrega via Google Drive..."
                rows={3}
                value={formData.servico.clausulasEspeciais || ""}
                onChange={e => handleChange("servico", "clausulasEspeciais", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-outline-variant/10">
          <button 
            type="submit"
            className="w-full signature-gradient text-white py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            Próxima Etapa →
          </button>
          <button 
            type="button"
            onClick={saveDraft}
            className="w-full py-4 text-primary font-bold hover:bg-surface-container-lowest transition-colors rounded-full"
          >
            {saved ? "Rascunho Salvo!" : "Salvar Rascunho"}
          </button>
          
          <button 
            type="button" 
            onClick={onBack} 
            className="text-on-surface-variant text-sm mt-4 hover:underline"
          >
            Voltar
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-12 text-center text-on-surface-variant opacity-60 text-xs font-body mb-8">
        Um produto FlowIQ © {new Date().getFullYear()}
      </div>
    </div>
  );
}
