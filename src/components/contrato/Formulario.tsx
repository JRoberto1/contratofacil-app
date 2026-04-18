"use client";

import { useState, useEffect } from "react";
import { categorias, CategoriaSlug } from "@/lib/categorias";
import type { FormularioContrato } from "@/types/contrato";

interface FormularioProps {
  categoria: string;
  categoriaCustom?: string;
  initialData?: Omit<FormularioContrato, "categoria" | "categoriaCustom">;
  onBack: () => void;
  onSubmit: (dados: FormularioContrato, tipo: import("@/types/contrato").TipoContrato) => void;
}

export default function Formulario({
  categoria,
  categoriaCustom,
  initialData,
  onBack,
  onSubmit,
}: FormularioProps) {
  const [formData, setFormData] = useState({
    prestador: { nomeCompleto: "", cpfCnpj: "", cidade: "", estado: "", email: "", tipoPessoa: "PF" as "PF" | "PJ", nacionalidade: "brasileiro", estadoCivil: "", profissao: "", representanteLegal: "", cargoRepresentante: "" },
    cliente: { nomeRazaoSocial: "", cpfCnpj: "", cidade: "", estado: "", email: "", tipoPessoa: "PF" as "PF" | "PJ", nacionalidade: "brasileiro", estadoCivil: "", profissao: "", representanteLegal: "", cargoRepresentante: "" },
    servico: { 
      descricao: "", 
      valor: "", 
      prazoEntrega: "", 
      formaPagamento: "", // preenchido na submissão
      formaPagamentoTipo: "unico" as import("@/types/contrato").FormaPagamentoOpcao,
      formaPagamentoDetalhes: {
        quandoUnico: "assinatura" as any,
        dataUnico: "",
        percentualEntrada: "50",
        quandoSaldo: "entrega" as any,
        diasSaldo: "",
        numeroParcelas: "3",
        vencimentoParcelas: "dia_mes" as any,
        diaMesVencimento: "10",
        comEntrada: false,
      },
      prazoPagamentoAposEntrega: "",
      numeroPedido: "",
      multaRescisao: "",
      jurosAtraso: "",
      localPrestacao: "", 
      formaEntrega: "", 
      clausulasEspeciais: "",
      camposExtrasCategoria: {} as Record<string, any>
    }
  });

  const catExtra = categorias[categoria as CategoriaSlug] || categorias['other'];

  const [modoAssinatura, setModoAssinatura] = useState<"fisica_com_testemunhas" | "fisica_sem_testemunhas" | "eletronica">("fisica_com_testemunhas");

  function capitalizeWords(str: string): string {
    if (!str) return "";
    const exceptions = ['de','da','do','das','dos','e','em','a','o','para','com','por','no','na','nos','nas'];
    return str
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);
        if (exceptions.includes(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  function normalizeState(str: string): string {
    if (!str) return "";
    const trimmed = str.trim();
    if (trimmed.length <= 2) return trimmed.toUpperCase();
    return capitalizeWords(trimmed);
  }

  function capitalizeSentence(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const [tipoAtivo, setTipoAtivo] = useState<import("@/types/contrato").TipoContrato>("completo-formal");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Definir assinatura padrão com base na categoria
    const criativos = ["designer-grafico", "desenvolvedor-web", "fotografo", "videomaker", "social-media", "redator", "consultor", "ilustrador", "motion-designer", "editor-de-video", "professor"];
    const manuais = ["servicos-gerais", "eletricista", "encanador", "pedreiro", "pintor", "marceneiro"];
    if (criativos.includes(categoria)) setModoAssinatura("eletronica");
    else if (manuais.includes(categoria)) setModoAssinatura("fisica_com_testemunhas");
    else setModoAssinatura("fisica_sem_testemunhas");

    // Load local storage draft if available and no initialData
    if (initialData) {
      setFormData(initialData as any);
      if ((initialData as any).modoAssinatura) {
        setModoAssinatura((initialData as any).modoAssinatura);
      }
    } else {
      const draft = localStorage.getItem("contratofacil_draft");
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
        if (parsedDraft.modoAssinatura) setModoAssinatura(parsedDraft.modoAssinatura);
      }
    }
  }, [initialData, categoria]);

  const handleChange = (section: "prestador" | "cliente" | "servico", field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    setSaved(false);
  };

  const handlePagamentoDetalhes = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      servico: {
        ...prev.servico,
        formaPagamentoDetalhes: {
          ...prev.servico.formaPagamentoDetalhes,
          [field]: value
        }
      }
    }));
    setSaved(false);
  };

  const saveDraft = () => {
    localStorage.setItem("contratofacil_draft", JSON.stringify({...formData, modoAssinatura}));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangeValor = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("servico", "valor", e.target.value);
  };

  const handleBlurValor = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    if (!raw) return;

    let numero: number;
    if (raw.includes(',')) {
      // Formato BR: "1.500,00" ou "1500,00" → remove pontos e troca vírgula por ponto
      numero = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
    } else {
      // Apenas dígitos (ou ponto como separador de milhar): "15000" ou "1.500"
      // Trata tudo como reais inteiros — "15000" = R$ 15.000,00
      numero = parseFloat(raw.replace(/\./g, ''));
    }

    if (!numero || isNaN(numero)) return;

    const formatado = numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    handleChange("servico", "valor", formatado);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações no frontend
    if (!formData.prestador.cidade || !formData.prestador.estado) {
      alert("Preencha a cidade e o estado do Prestador.");
      return;
    }
    if (!formData.cliente.cidade || !formData.cliente.estado) {
      alert("Preencha a cidade e o estado do Cliente.");
      return;
    }
    const rawValor = formData.servico.valor.replace(/\D/g, "");
    if (!rawValor || rawValor === "0" || rawValor === "00" || rawValor === "000") {
      alert("Informe um valor válido para o serviço (maior que zero).");
      return;
    }
    if (!modoAssinatura) {
      alert("Selecione um modo de assinatura.");
      return;
    }
    if (formData.servico.multaRescisao) {
      const parsedMul = Number(formData.servico.multaRescisao);
      if (isNaN(parsedMul) || parsedMul < 1 || parsedMul > 100) {
        alert("A multa rescisória deve ser um valor entre 1 e 100.");
        return;
      }
    }

    // Geração textual da forma de pagamento
    const s = formData.servico;
    let pagtoFinal = "A forma de pagamento será acordada.";
    
    switch (s.formaPagamentoTipo) {
      case "unico":
        if (s.formaPagamentoDetalhes?.quandoUnico === "assinatura") pagtoFinal = "Pagamento único no ato da assinatura do contrato.";
        else if (s.formaPagamentoDetalhes?.quandoUnico === "entrega") pagtoFinal = `Pagamento único no momento da entrega do serviço${s.prazoPagamentoAposEntrega ? `, com prazo limite de pagamento de ${s.prazoPagamentoAposEntrega} dias após a entrega` : ""}.`;
        else if (s.formaPagamentoDetalhes?.quandoUnico === "data") pagtoFinal = `Pagamento único até a data de ${s.formaPagamentoDetalhes.dataUnico}.`;
        else pagtoFinal = "Pagamento único.";
        break;
      case "entrada_saldo": {
        const perc = s.formaPagamentoDetalhes?.percentualEntrada || "50";
        const saldoQuando = s.formaPagamentoDetalhes?.quandoSaldo === "dias" 
          ? `em até ${s.formaPagamentoDetalhes?.diasSaldo || ""} dias após a entrega` 
          : `no ato da entrega${s.prazoPagamentoAposEntrega ? ` (prazo de tolerância de ${s.prazoPagamentoAposEntrega} dias)` : ""}`;
        pagtoFinal = `Entrada de ${perc}% no momento da contratação/assinatura e o saldo de ${100 - Number(perc)}% será pago ${saldoQuando}.`;
        break;
      }
      case "parcelado": {
        const parcelas = s.formaPagamentoDetalhes?.numeroParcelas || "3";
        const entradaStr = s.formaPagamentoDetalhes?.comEntrada ? `Entrada de ${s.formaPagamentoDetalhes.percentualEntrada || "50"}% do valor e o restante p` : "P";
        const vencimento = s.formaPagamentoDetalhes?.vencimentoParcelas === "dia_mes" 
          ? `com vencimento todo dia ${s.formaPagamentoDetalhes.diaMesVencimento || "10"} de cada mês subseqüente`
          : `a cada ${s.formaPagamentoDetalhes?.diaMesVencimento || "30"} dias após a data de assinatura`;
        pagtoFinal = `${entradaStr}arcelado em ${parcelas} vezes mensais de valores iguais, ${vencimento}.`;
        break;
      }
      case "a_combinar":
        pagtoFinal = "A forma e as datas de pagamento serão acordadas entre as partes mediante instrumento complementar ou comunicação escrita.";
        break;
    }

    // Normalização
    const normalizedData = {
      ...formData,
      prestador: {
        ...formData.prestador,
        nomeCompleto: capitalizeWords(formData.prestador.nomeCompleto),
        cidade: capitalizeWords(formData.prestador.cidade),
        estado: normalizeState(formData.prestador.estado),
      },
      cliente: {
        ...formData.cliente,
        nomeRazaoSocial: capitalizeWords(formData.cliente.nomeRazaoSocial),
        cidade: capitalizeWords(formData.cliente.cidade),
        estado: normalizeState(formData.cliente.estado),
      },
      servico: {
        ...formData.servico,
        descricao: capitalizeSentence(formData.servico.descricao),
        formaPagamento: pagtoFinal,
      }
    };

    // Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('event', 'generate_contract_start', {
        event_category: 'Contrato',
        event_label: categoria,
        value: 1
      });
    }

    onSubmit({
      categoria,
      categoriaCustom,
      ...normalizedData,
      modoAssinatura
    } as any, tipoAtivo);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Cidade</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Ex: Vitória"
                    value={formData.prestador.cidade}
                    onChange={e => handleChange("prestador", "cidade", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Estado</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Ex: ES"
                    value={formData.prestador.estado}
                    onChange={e => handleChange("prestador", "estado", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">E-mail (opcional)</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={formData.prestador.email}
                onChange={e => handleChange("prestador", "email", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
              />
            </div>
            {/* Tipo de Pessoa */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Tipo de Pessoa</label>
              <div className="flex gap-3">
                {(["PF", "PJ"] as const).map(tp => (
                  <button key={tp} type="button"
                    onClick={() => handleChange("prestador", "tipoPessoa", tp)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${formData.prestador.tipoPessoa === tp ? "border-primary bg-primary/5 ring-1 ring-primary text-primary" : "border-outline-variant/20 text-on-surface-variant hover:border-primary/50"}`}>
                    {tp === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                  </button>
                ))}
              </div>
            </div>
            {formData.prestador.tipoPessoa === "PF" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Nacionalidade</label>
                  <input type="text" placeholder="Ex: brasileiro"
                    value={formData.prestador.nacionalidade || ""}
                    onChange={e => handleChange("prestador", "nacionalidade", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Estado Civil</label>
                  <select value={formData.prestador.estadoCivil || ""}
                    onChange={e => handleChange("prestador", "estadoCivil", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all">
                    <option value="">Não informar</option>
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viúvo">Viúvo(a)</option>
                    <option value="união estável">União Estável</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Profissão</label>
                  <input type="text" placeholder="Ex: fotógrafo"
                    value={formData.prestador.profissao || ""}
                    onChange={e => handleChange("prestador", "profissao", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
              </div>
            )}
            {formData.prestador.tipoPessoa === "PJ" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Representante Legal</label>
                  <input type="text" placeholder="Nome do sócio/representante"
                    value={formData.prestador.representanteLegal || ""}
                    onChange={e => handleChange("prestador", "representanteLegal", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Cargo</label>
                  <input type="text" placeholder="Ex: Sócio-Administrador"
                    value={formData.prestador.cargoRepresentante || ""}
                    onChange={e => handleChange("prestador", "cargoRepresentante", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
              </div>
            )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Cidade</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Ex: São Paulo"
                    value={formData.cliente.cidade}
                    onChange={e => handleChange("cliente", "cidade", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Estado</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Ex: SP"
                    value={formData.cliente.estado}
                    onChange={e => handleChange("cliente", "estado", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">E-mail (opcional)</label>
              <input
                type="email"
                placeholder="cliente@email.com"
                value={formData.cliente.email}
                onChange={e => handleChange("cliente", "email", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
              />
            </div>
            {/* Tipo de Pessoa */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Tipo de Pessoa</label>
              <div className="flex gap-3">
                {(["PF", "PJ"] as const).map(tp => (
                  <button key={tp} type="button"
                    onClick={() => handleChange("cliente", "tipoPessoa", tp)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${formData.cliente.tipoPessoa === tp ? "border-primary bg-primary/5 ring-1 ring-primary text-primary" : "border-outline-variant/20 text-on-surface-variant hover:border-primary/50"}`}>
                    {tp === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                  </button>
                ))}
              </div>
            </div>
            {formData.cliente.tipoPessoa === "PF" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Nacionalidade</label>
                  <input type="text" placeholder="Ex: brasileiro"
                    value={formData.cliente.nacionalidade || ""}
                    onChange={e => handleChange("cliente", "nacionalidade", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Estado Civil</label>
                  <select value={formData.cliente.estadoCivil || ""}
                    onChange={e => handleChange("cliente", "estadoCivil", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all">
                    <option value="">Não informar</option>
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viúvo">Viúvo(a)</option>
                    <option value="união estável">União Estável</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Profissão</label>
                  <input type="text" placeholder="Ex: empresário"
                    value={formData.cliente.profissao || ""}
                    onChange={e => handleChange("cliente", "profissao", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
              </div>
            )}
            {formData.cliente.tipoPessoa === "PJ" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Representante Legal</label>
                  <input type="text" placeholder="Nome do sócio/representante"
                    value={formData.cliente.representanteLegal || ""}
                    onChange={e => handleChange("cliente", "representanteLegal", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Cargo</label>
                  <input type="text" placeholder="Ex: Diretor Comercial"
                    value={formData.cliente.cargoRepresentante || ""}
                    onChange={e => handleChange("cliente", "cargoRepresentante", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                </div>
              </div>
            )}
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
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Número do pedido ou proposta (opcional)</label>
              <input 
                type="text" 
                placeholder="Ex: PROP-2026-042"
                value={formData.servico.numeroPedido || ""}
                onChange={e => handleChange("servico", "numeroPedido", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
              />
            </div>
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
                  placeholder="Ex: 1.500,00"
                  value={formData.servico.valor}
                  onChange={handleChangeValor}
                  onBlur={handleBlurValor}
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

            {/* Payment Mode Selection */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Como será o pagamento?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleChange("servico", "formaPagamentoTipo", "unico")}
                  className={`p-4 rounded-xl border text-left transition-all ${formData.servico.formaPagamentoTipo === "unico" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
                >
                  <h3 className="font-bold text-on-surface text-sm">Pagamento único</h3>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("servico", "formaPagamentoTipo", "entrada_saldo")}
                  className={`p-4 rounded-xl border text-left transition-all ${formData.servico.formaPagamentoTipo === "entrada_saldo" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
                >
                  <h3 className="font-bold text-on-surface text-sm">Entrada + saldo</h3>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("servico", "formaPagamentoTipo", "parcelado")}
                  className={`p-4 rounded-xl border text-left transition-all ${formData.servico.formaPagamentoTipo === "parcelado" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
                >
                  <h3 className="font-bold text-on-surface text-sm">Parcelado</h3>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("servico", "formaPagamentoTipo", "a_combinar")}
                  className={`p-4 rounded-xl border text-left transition-all ${formData.servico.formaPagamentoTipo === "a_combinar" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
                >
                  <h3 className="font-bold text-on-surface text-sm">A combinar com o cliente</h3>
                </button>
              </div>

              {/* Sub-fields for Unico */}
              {formData.servico.formaPagamentoTipo === "unico" && (
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Quando?</label>
                    <select
                      value={formData.servico.formaPagamentoDetalhes?.quandoUnico}
                      onChange={(e) => handlePagamentoDetalhes("quandoUnico", e.target.value)}
                      className="w-full bg-surface-container-highest rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm"
                    >
                      <option value="assinatura">Na assinatura</option>
                      <option value="entrega">Na entrega</option>
                      <option value="data">Em data específica</option>
                    </select>
                  </div>
                  {formData.servico.formaPagamentoDetalhes?.quandoUnico === "data" && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Qual data?</label>
                      <input 
                        type="date"
                        value={formData.servico.formaPagamentoDetalhes?.dataUnico || ""}
                        onChange={(e) => handlePagamentoDetalhes("dataUnico", e.target.value)}
                        className="w-full bg-surface-container-highest rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Sub-fields for Entrada + Saldo */}
              {formData.servico.formaPagamentoTipo === "entrada_saldo" && (
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">% de entrada</label>
                    <input 
                      type="number" min="1" max="99" placeholder="Ex: 50"
                      value={formData.servico.formaPagamentoDetalhes?.percentualEntrada || ""}
                      onChange={(e) => handlePagamentoDetalhes("percentualEntrada", e.target.value)}
                      className="w-full bg-surface-container-highest rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Quando pagar o saldo?</label>
                    <select
                      value={formData.servico.formaPagamentoDetalhes?.quandoSaldo}
                      onChange={(e) => handlePagamentoDetalhes("quandoSaldo", e.target.value)}
                      className="w-full bg-surface-container-highest rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm"
                    >
                      <option value="entrega">Na entrega</option>
                      <option value="dias">Em X dias após entrega</option>
                    </select>
                  </div>
                  {formData.servico.formaPagamentoDetalhes?.quandoSaldo === "dias" && (
                     <div className="md:col-span-2">
                       <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Quantos dias após a entrega?</label>
                       <input 
                         type="number" min="1" placeholder="Ex: 15"
                         value={formData.servico.formaPagamentoDetalhes?.diasSaldo || ""}
                         onChange={(e) => handlePagamentoDetalhes("diasSaldo", e.target.value)}
                         className="w-full bg-surface-container-highest rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm"
                       />
                     </div>
                  )}
                </div>
              )}

              {/* Sub-fields for Parcelado */}
              {formData.servico.formaPagamentoTipo === "parcelado" && (
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Número de parcelas</label>
                      <input 
                        type="number" min="2" max="24" placeholder="Ex: 3"
                        value={formData.servico.formaPagamentoDetalhes?.numeroParcelas || ""}
                        onChange={(e) => handlePagamentoDetalhes("numeroParcelas", e.target.value)}
                        className="w-full bg-surface-container-highest rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Vencimento</label>
                      <select
                        value={formData.servico.formaPagamentoDetalhes?.vencimentoParcelas}
                        onChange={(e) => handlePagamentoDetalhes("vencimentoParcelas", e.target.value)}
                        className="w-full bg-surface-container-highest rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm"
                      >
                        <option value="dia_mes">Todo dia X do mês</option>
                        <option value="dias_apos">A cada X dias após assinatura</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">
                      {formData.servico.formaPagamentoDetalhes?.vencimentoParcelas === "dia_mes" ? "Qual dia do mês?" : "Quantos dias?"}
                    </label>
                    <input 
                      type="number" placeholder={formData.servico.formaPagamentoDetalhes?.vencimentoParcelas === "dia_mes" ? "Ex: 10" : "Ex: 30"}
                      value={formData.servico.formaPagamentoDetalhes?.diaMesVencimento || ""}
                      onChange={(e) => handlePagamentoDetalhes("diaMesVencimento", e.target.value)}
                      className="w-full bg-surface-container-highest rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm"
                    />
                  </div>
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-on-surface cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.servico.formaPagamentoDetalhes?.comEntrada || false}
                        onChange={(e) => handlePagamentoDetalhes("comEntrada", e.target.checked)}
                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                      />
                       Tem entrada?
                    </label>
                  </div>
                  {formData.servico.formaPagamentoDetalhes?.comEntrada && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">% de Entrada</label>
                      <input 
                        type="number" placeholder="Ex: 50" min="1" max="99"
                        value={formData.servico.formaPagamentoDetalhes?.percentualEntrada || ""}
                        onChange={(e) => handlePagamentoDetalhes("percentualEntrada", e.target.value)}
                        className="w-full bg-surface-container-highest rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Conditional Prazo Pagamento apos entrega */}
              {((formData.servico.formaPagamentoTipo === "unico" && formData.servico.formaPagamentoDetalhes?.quandoUnico === "entrega") || (formData.servico.formaPagamentoTipo === "entrada_saldo" && formData.servico.formaPagamentoDetalhes?.quandoSaldo === "entrega")) && (
                <div className="mt-4 bg-[#002b73]/5 p-4 rounded-xl border border-[#002b73]/10">
                   <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Em quantos dias após a entrega o pagamento deve ser feito?</label>
                   <input 
                     type="number" min="0" placeholder="Ex: 2"
                     value={formData.servico.prazoPagamentoAposEntrega || ""}
                     onChange={(e) => handleChange("servico", "prazoPagamentoAposEntrega", e.target.value)}
                     className="w-full bg-white rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm"
                   />
                   <p className="text-[10px] text-outline-variant italic mt-2 ml-1">Deixe em branco para usar o padrão de 2 (dois) dias úteis.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Multa por rescisão (%) (opcional)</label>
                <div className="relative">
                  <input 
                    type="number"
                    min="1"
                    max="100" 
                    placeholder="Ex: 20"
                    value={formData.servico.multaRescisao || ""}
                    onChange={e => handleChange("servico", "multaRescisao", e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 pr-10 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant font-bold text-sm">%</span>
                </div>
                <p className="text-[10px] text-outline-variant italic mt-1 ml-1">Aplicada em cancelamento de contrato.</p>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Juros por atraso no pagamento (opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: 1% ao mês"
                  value={formData.servico.jurosAtraso || ""}
                  onChange={e => handleChange("servico", "jurosAtraso", e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                />
                <p className="text-[10px] text-outline-variant italic mt-1 ml-1">Deixe em branco para contrato sem cláusula de juros.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Local de Prestação (opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Remoto / Sede do cliente"
                  value={formData.servico.localPrestacao}
                  onChange={e => handleChange("servico", "localPrestacao", e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">Forma de Entrega (opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Google Drive, E-mail"
                  value={formData.servico.formaEntrega}
                  onChange={e => handleChange("servico", "formaEntrega", e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                />
              </div>
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
            
            {catExtra && catExtra.camposExtras && catExtra.camposExtras.length > 0 && (
              <div className="mt-8 pt-6 border-t border-outline-variant/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  <h3 className="font-bold text-sm tracking-widest uppercase text-primary font-body">Detalhes de {catExtra.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catExtra.camposExtras.map(campo => (
                    <div key={campo.id}>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2">
                        {campo.label}
                      </label>
                      {campo.type === 'enum' && campo.options ? (
                        <select
                          className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                          value={formData.servico.camposExtrasCategoria?.[campo.id] || ""}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              servico: {
                                ...prev.servico,
                                camposExtrasCategoria: {
                                  ...(prev.servico.camposExtrasCategoria || {}),
                                  [campo.id]: e.target.value
                                }
                              }
                            }));
                          }}
                        >
                          <option value="">Selecione...</option>
                          {campo.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={campo.type === 'number' ? 'number' : 'text'}
                          placeholder={campo.placeholder}
                          className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                          value={formData.servico.camposExtrasCategoria?.[campo.id] || ""}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              servico: {
                                ...prev.servico,
                                camposExtrasCategoria: {
                                  ...(prev.servico.camposExtrasCategoria || {}),
                                  [campo.id]: e.target.value
                                }
                              }
                            }));
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Escolha do Modo de Assinatura */}
        <div className="space-y-4 pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">draw</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-body">Modo de Assinatura</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setModoAssinatura("fisica_com_testemunhas")}
              className={`p-4 rounded-2xl border text-left transition-all ${modoAssinatura === "fisica_com_testemunhas" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-lg">how_to_reg</span>
                <h3 className="font-bold text-on-surface text-sm">Física + Testemunhas</h3>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">Indicado para serviços presenciais, obras e contratos de maior valor.</p>
            </button>
            <button
              type="button"
              onClick={() => setModoAssinatura("fisica_sem_testemunhas")}
              className={`p-4 rounded-2xl border text-left transition-all ${modoAssinatura === "fisica_sem_testemunhas" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
            >
               <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-lg">edit</span>
                <h3 className="font-bold text-on-surface text-sm">Física (Simples)</h3>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">Para serviços de menor valor quando as partes dispensam testemunhas.</p>
            </button>
            <button
              type="button"
              onClick={() => setModoAssinatura("eletronica")}
              className={`p-4 rounded-2xl border text-left transition-all ${modoAssinatura === "eletronica" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
            >
               <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-lg">link</span>
                <h3 className="font-bold text-on-surface text-sm">Aceite Eletrônico</h3>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">Para serviços online ou cliente em outra cidade. Válido pelo CPC.</p>
            </button>
          </div>
        </div>

        {/* Escolha do Modelo */}
        <div className="space-y-4 pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">article</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-body">Modelo do Contrato</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTipoAtivo("completo-formal")}
              className={`p-4 rounded-2xl border text-left transition-all ${tipoAtivo === "completo-formal" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
            >
              <h3 className="font-bold text-on-surface text-sm mb-1">Completo Formal</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Todas as cláusulas, linguagem jurídica técnica</p>
            </button>
            <button
              type="button"
              onClick={() => setTipoAtivo("simplificado")}
              className={`p-4 rounded-2xl border text-left transition-all ${tipoAtivo === "simplificado" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
            >
              <h3 className="font-bold text-on-surface text-sm mb-1">Simplificado</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Cláusulas essenciais, linguagem acessível</p>
            </button>
            <button
              type="button"
              onClick={() => setTipoAtivo("executivo")}
              className={`p-4 rounded-2xl border text-left transition-all ${tipoAtivo === "executivo" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
            >
              <h3 className="font-bold text-on-surface text-sm mb-1">Executivo</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Formato profissional compacto para negócios</p>
            </button>
            <button
              type="button"
              onClick={() => setTipoAtivo("minimalista")}
              className={`p-4 rounded-2xl border text-left transition-all ${tipoAtivo === "minimalista" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}
            >
              <h3 className="font-bold text-on-surface text-sm mb-1">Minimalista</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Versão enxuta para serviços de baixo valor</p>
            </button>
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
