"use client";

import { useState, useEffect } from "react";
import { categorias, CategoriaSlug, gruposCategorias } from "@/lib/categorias";
import type { FormularioContrato } from "@/types/contrato";

// ─── Category groups for conditional fields ───────────────────────────────────
const CAT_CRIATIVOS = ['designer', 'uxui', 'socialmedia', 'copywriter', 'editor', 'ilustrador'];
const CAT_DEV = ['dev'];
const CAT_CRIATIVOS_E_DEV = [...CAT_CRIATIVOS, 'dev'];
const CAT_FOTO_VIDEO = ['photo', 'videomaker'];
const CAT_CONSTRUCAO = ['maintenance', 'eletricista', 'encanador', 'pintor', 'montador', 'arcondicionado', 'jardineiro'];
const CAT_BELEZA = ['esteticista', 'manicure', 'cabeleireiro', 'maquiador', 'tatuador'];
const CAT_CONSULTORIA = ['consultant', 'mentor', 'professor', 'contador', 'arquiteto'];
const CAT_SAUDE = ['nutricionista', 'psicologo', 'personaltrainer', 'fisioterapeuta', 'massoterapeuta', 'yoga', 'fono', 'cuidador'];
const CAT_PRECISA_MATERIAIS = ['designer', 'dev', 'uxui', 'socialmedia', 'copywriter', 'photo', 'videomaker', 'editor'];

interface FormularioProps {
  categoria: string;
  categoriaCustom?: string;
  initialData?: Omit<FormularioContrato, "categoria" | "categoriaCustom">;
  onBack: () => void;
  onSubmit: (dados: FormularioContrato, tipo: import("@/types/contrato").TipoContrato) => void;
}

export default function Formulario({ categoria, categoriaCustom, initialData, onBack, onSubmit }: FormularioProps) {

  const [formData, setFormData] = useState({
    prestador: {
      nomeCompleto: "", cpfCnpj: "", cidade: "", estado: "", email: "",
      tipoPessoa: "PF" as "PF" | "PJ", nacionalidade: "brasileiro",
      estadoCivil: "", profissao: "", representanteLegal: "", cargoRepresentante: ""
    },
    cliente: {
      nomeRazaoSocial: "", cpfCnpj: "", cidade: "", estado: "", email: "",
      tipoPessoa: "PF" as "PF" | "PJ", nacionalidade: "brasileiro",
      estadoCivil: "", profissao: "", representanteLegal: "", cargoRepresentante: ""
    },
    servico: {
      descricao: "",
      valor: "",
      prazoEntrega: "",
      formaPagamento: "",
      formaPagamentoTipo: "unico" as import("@/types/contrato").FormaPagamentoOpcao,
      formaPagamentoDetalhes: {
        quandoUnico: "assinatura" as "assinatura" | "entrega" | "data",
        dataUnico: "",
        percentualEntrada: "50",
        quandoSaldo: "entrega" as "entrega" | "dias",
        diasSaldo: "",
        numeroParcelas: "3",
        vencimentoParcelas: "dia_mes" as "dia_mes" | "dias_apos",
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
      camposExtrasCategoria: {} as Record<string, string | boolean | number>,
      // ── Novos campos ──────────────────────────────────────────────────────
      formaRecebimento: "pix-ou-transferencia",
      revisoes: "",
      transferePI: true,
      permitePortfolio: true,
      proibeSubcontratacao: true,
      diasGarantia: "",
      quemPagaHospedagem: "o-cliente",
      manutencaoMensal: false,
      valorManutencao: "",
      escopoManutencao: "",
      entregaRaw: false,
      revisoesFotos: "",
      quemForneceMateriais: "a-combinar",
      garantiaMaoDeObra: "",
      politicaCancelamento: "cobrar",
      sessoesGravadas: false,
      avisoPrevio: "",
      prazoAprovacao: "",
      prazoMateriais: "",
    }
  });

  const catExtra = categorias[categoria as CategoriaSlug] || categorias['other'];
  const [modoAssinatura, setModoAssinatura] = useState<"fisica_com_testemunhas" | "fisica_sem_testemunhas" | "eletronica">("fisica_com_testemunhas");
  const [tipoAtivo, setTipoAtivo] = useState<import("@/types/contrato").TipoContrato>("completo-formal");
  const [saved, setSaved] = useState(false);
  const [avancadoAberto, setAvancadoAberto] = useState(false);

  // ─── Utility ─────────────────────────────────────────────────────────────────
  const isCat = (group: string[]) => group.includes(categoria);

  const inputCls = "w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all";
  const inputSmCls = "w-full bg-surface-container-highest rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-outline-variant mb-2";

  // ─── Toggle UI ────────────────────────────────────────────────────────────────
  const ToggleField = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex gap-2">
      {([{ label: "Sim", val: true }, { label: "Não", val: false }] as const).map(({ label, val }) => (
        <button key={label} type="button" onClick={() => onChange(val)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${value === val ? "border-primary bg-primary/5 ring-1 ring-primary text-primary" : "border-outline-variant/20 text-on-surface-variant hover:border-primary/50"}`}>
          {label}
        </button>
      ))}
    </div>
  );

  // ─── Formatters ──────────────────────────────────────────────────────────────
  function formatCpfCnpj(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return digits
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }

  function getCpfCnpjLabel(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return 'CPF / CNPJ';
    return digits.length <= 11 ? 'CPF' : 'CNPJ';
  }

  function capitalizeWords(str: string): string {
    if (!str) return "";
    const exceptions = ['de','da','do','das','dos','e','em','a','o','para','com','por','no','na','nos','nas'];
    return str.toLowerCase().split(' ').map((word, index) => {
      if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);
      if (exceptions.includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
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

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (section: "prestador" | "cliente" | "servico", field: string, value: unknown) => {
    setFormData((prev) => {
      const updated = { ...prev, [section]: { ...prev[section], [field]: value } };
      if (field === "cpfCnpj" && (section === "prestador" || section === "cliente")) {
        const digits = (value as string).replace(/\D/g, "");
        const tipo = digits.length > 11 ? "PJ" : "PF";
        (updated[section] as Record<string, unknown>).tipoPessoa = tipo;
      }
      return updated;
    });
    setSaved(false);
  };

  const handlePagamentoDetalhes = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      servico: {
        ...prev.servico,
        formaPagamentoDetalhes: { ...prev.servico.formaPagamentoDetalhes, [field]: value }
      }
    }));
    setSaved(false);
  };

  const handleChangeValor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitos = e.target.value.replace(/\D/g, '');
    const centavos = parseInt(digitos || '0', 10);
    const formatado = (centavos / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    handleChange("servico", "valor", formatado);
  };

  const handleBlurValor = (_e: React.FocusEvent<HTMLInputElement>) => {};

  const handleChangeCurrency = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitos = e.target.value.replace(/\D/g, '');
    const centavos = parseInt(digitos || '0', 10);
    const formatado = (centavos / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    handleChange("servico", field, formatado);
  };

  const saveDraft = () => {
    localStorage.setItem("contratofacil_draft", JSON.stringify({ ...formData, modoAssinatura }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ─── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const grupoDigital = ["tech", "criacao", "consultoria", "saude"];
    const isDigital = gruposCategorias.some(g => grupoDigital.includes(g.id) && g.items.includes(categoria as CategoriaSlug));
    if (isDigital) setModoAssinatura("eletronica");
    else setModoAssinatura("fisica_com_testemunhas");

    if (initialData) {
      const parsed = initialData as Record<string, unknown>;
      setFormData(prev => ({
        ...prev,
        prestador: { ...prev.prestador, ...(parsed.prestador as object) },
        cliente: { ...prev.cliente, ...(parsed.cliente as object) },
        servico: { ...prev.servico, ...(parsed.servico as object) },
      }));
      if ((parsed as Record<string, unknown>).modoAssinatura) {
        setModoAssinatura((parsed as Record<string, unknown>).modoAssinatura as "fisica_com_testemunhas" | "fisica_sem_testemunhas" | "eletronica");
      }
    } else {
      const draft = localStorage.getItem("contratofacil_draft");
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setFormData(prev => ({
          ...prev,
          prestador: { ...prev.prestador, ...parsedDraft.prestador },
          cliente: { ...prev.cliente, ...parsedDraft.cliente },
          servico: { ...prev.servico, ...parsedDraft.servico },
        }));
        if (parsedDraft.modoAssinatura) setModoAssinatura(parsedDraft.modoAssinatura);
      } else {
        const perfil = localStorage.getItem("contratofacil_perfil_prestador");
        if (perfil) {
          const prestadorSalvo = JSON.parse(perfil);
          setFormData(prev => ({ ...prev, prestador: { ...prev.prestador, ...prestadorSalvo } }));
        }
      }
    }

    // Pré-preenche profissão com o título da categoria (se ainda vazio)
    const categoriaTitulo = categorias[categoria as CategoriaSlug]?.title || "";
    setFormData(prev => ({
      ...prev,
      prestador: {
        ...prev.prestador,
        profissao: prev.prestador.profissao || categoriaTitulo,
      }
    }));
  }, [initialData, categoria]);

  // ─── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const erros: string[] = [];

    if (!formData.prestador.nomeCompleto || formData.prestador.nomeCompleto.trim().length < 3)
      erros.push("Nome completo do Prestador é obrigatório.");
    if (!formData.prestador.cpfCnpj || formData.prestador.cpfCnpj.replace(/\D/g, '').length < 11)
      erros.push("CPF/CNPJ do Prestador é obrigatório.");
    if (!formData.prestador.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.prestador.email))
      erros.push("E-mail do Prestador inválido.");
    if (!formData.prestador.cidade || !formData.prestador.estado)
      erros.push("Cidade e estado do Prestador são obrigatórios.");

    if (!formData.cliente.nomeRazaoSocial || formData.cliente.nomeRazaoSocial.trim().length < 3)
      erros.push("Nome/Razão Social do Cliente é obrigatório.");
    if (!formData.cliente.cpfCnpj || formData.cliente.cpfCnpj.replace(/\D/g, '').length < 11)
      erros.push("CPF/CNPJ do Cliente é obrigatório.");
    if (!formData.cliente.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.cliente.email))
      erros.push("E-mail do Cliente inválido.");
    if (!formData.cliente.cidade || !formData.cliente.estado)
      erros.push("Cidade e estado do Cliente são obrigatórios.");
    if (formData.cliente.tipoPessoa === "PJ" && !formData.cliente.representanteLegal?.trim())
      erros.push("Campo obrigatório para pessoa jurídica: Nome do Representante Legal do cliente.");

    if (!formData.servico.descricao || formData.servico.descricao.trim().length < 10)
      erros.push("Descreva o serviço com pelo menos 10 caracteres.");

    const rawValor = formData.servico.valor.replace(/\D/g, "");
    if (!rawValor || rawValor === "0" || rawValor === "00" || rawValor === "000")
      erros.push("Informe um valor válido para o serviço (maior que zero).");

    if (!formData.servico.prazoEntrega)
      erros.push("Prazo de entrega é obrigatório.");

    if (!modoAssinatura)
      erros.push("Selecione um modo de assinatura.");

    if (formData.servico.multaRescisao) {
      const parsedMul = Number(formData.servico.multaRescisao);
      if (isNaN(parsedMul) || parsedMul < 1 || parsedMul > 100)
        erros.push("A multa rescisória deve ser um valor entre 1 e 100.");
    }

    if (formData.servico.manutencaoMensal) {
      if (!formData.servico.valorManutencao) erros.push("Informe o valor da manutenção mensal.");
      if (!formData.servico.escopoManutencao) erros.push("Informe o escopo da manutenção mensal.");
    }

    if (erros.length > 0) { alert(erros.join("\n")); return; }

    // Forma de pagamento textual
    const s = formData.servico;
    let pagtoFinal = "A forma de pagamento será acordada.";
    switch (s.formaPagamentoTipo) {
      case "unico":
        if (s.formaPagamentoDetalhes?.quandoUnico === "assinatura")
          pagtoFinal = "Pagamento único no ato da assinatura do contrato.";
        else if (s.formaPagamentoDetalhes?.quandoUnico === "entrega")
          pagtoFinal = `Pagamento único no momento da entrega do serviço${s.prazoPagamentoAposEntrega ? `, com prazo limite de pagamento de ${s.prazoPagamentoAposEntrega} dias após a entrega` : ""}.`;
        else if (s.formaPagamentoDetalhes?.quandoUnico === "data")
          pagtoFinal = `Pagamento único até a data de ${s.formaPagamentoDetalhes.dataUnico}.`;
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

    localStorage.setItem("contratofacil_perfil_prestador", JSON.stringify(normalizedData.prestador));

    if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).gtag) {
      ((window as unknown as Record<string, unknown>).gtag as (...args: unknown[]) => void)('event', 'generate_contract_start', {
        event_category: 'Contrato', event_label: categoria, value: 1
      });
    }

    onSubmit({ categoria, categoriaCustom, ...normalizedData, modoAssinatura } as FormularioContrato, tipoAtivo);
  };

  const getLabel = () => categoria === "outros" ? categoriaCustom : categoria;

  // ─── Calc helpers ─────────────────────────────────────────────────────────────
  const valorNumerico = parseFloat((formData.servico.valor || "0").replace(/\./g, '').replace(',', '.')) || 0;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col pt-4">

      {/* Progress Ribbon */}
      <div className="w-full mb-10">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary font-label">PASSO 1 DE 3</p>
            <h1 className="text-3xl font-extrabold tracking-tight font-headline text-on-surface">Dados do Contrato</h1>
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

        {/* ══ MODELO DO CONTRATO ═══════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">article</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-body">Modelo do Contrato</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              { id: "completo-formal" as const, label: "Completo Formal", desc: "Máxima proteção — ideal para clientes empresa ou serviços acima de R$ 5.000" },
              { id: "executivo" as const, label: "Executivo", desc: "Profissional e direto — para serviços recorrentes ou clientes exigentes" },
              { id: "simplificado" as const, label: "Simplificado", desc: "Simples e claro — para a maioria dos serviços do dia a dia" },
              { id: "minimalista" as const, label: "Minimalista", desc: "Rápido e objetivo — para serviços pequenos ou clientes de confiança" },
            ]).map(opt => (
              <button key={opt.id} type="button" onClick={() => setTipoAtivo(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${tipoAtivo === opt.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}>
                <h3 className="font-bold text-on-surface text-sm mb-1">{opt.label}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ══ PRESTADOR ═══════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">badge</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-body">Prestador (Autônomo)</h2>
          </div>
          <div className="space-y-4">

            <div>
              <label className={labelCls}>Nome Completo</label>
              <input required type="text" placeholder="Seu nome completo"
                value={formData.prestador.nomeCompleto}
                onChange={e => handleChange("prestador", "nomeCompleto", e.target.value)}
                className={inputCls} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{getCpfCnpjLabel(formData.prestador.cpfCnpj)}</label>
                <input required type="text" placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={formData.prestador.cpfCnpj}
                  onChange={e => handleChange("prestador", "cpfCnpj", formatCpfCnpj(e.target.value))}
                  className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Cidade</label>
                  <input required type="text" placeholder="Ex: Vitória"
                    value={formData.prestador.cidade}
                    onChange={e => handleChange("prestador", "cidade", e.target.value)}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Estado</label>
                  <input required type="text" placeholder="Ex: ES"
                    value={formData.prestador.estado}
                    onChange={e => handleChange("prestador", "estado", e.target.value)}
                    className={inputCls} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>E-mail (opcional)</label>
              <input type="email" placeholder="seu@email.com"
                value={formData.prestador.email}
                onChange={e => handleChange("prestador", "email", e.target.value)}
                className={inputCls} />
            </div>

            {/* Estado civil + Profissão — sempre visível */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Estado Civil (opcional)</label>
                <select value={formData.prestador.estadoCivil || ""}
                  onChange={e => handleChange("prestador", "estadoCivil", e.target.value)}
                  className={inputCls}>
                  <option value="">Prefiro não informar</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viúvo">Viúvo(a)</option>
                  <option value="união estável">União Estável</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Profissão (opcional)</label>
                <input type="text" placeholder="Ex: Fotógrafo, Desenvolvedor..."
                  value={formData.prestador.profissao || ""}
                  onChange={e => handleChange("prestador", "profissao", e.target.value)}
                  className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Tipo de Pessoa</label>
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
              <div>
                <label className={labelCls}>Nacionalidade</label>
                <input type="text" placeholder="Ex: brasileiro"
                  value={formData.prestador.nacionalidade || ""}
                  onChange={e => handleChange("prestador", "nacionalidade", e.target.value)}
                  className={inputCls} />
              </div>
            )}

            {formData.prestador.tipoPessoa === "PJ" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Representante Legal</label>
                  <input type="text" placeholder="Nome do sócio/representante"
                    value={formData.prestador.representanteLegal || ""}
                    onChange={e => handleChange("prestador", "representanteLegal", e.target.value)}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Cargo (opcional)</label>
                  <input type="text" placeholder="Ex: Sócio-Administrador"
                    value={formData.prestador.cargoRepresentante || ""}
                    onChange={e => handleChange("prestador", "cargoRepresentante", e.target.value)}
                    className={inputCls} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ CLIENTE ═════════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">person</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-body">Cliente (Contratante)</h2>
          </div>
          <div className="space-y-4">

            <div>
              <label className={labelCls}>Nome do Cliente</label>
              <input required type="text" placeholder="Nome ou Razão Social"
                value={formData.cliente.nomeRazaoSocial}
                onChange={e => handleChange("cliente", "nomeRazaoSocial", e.target.value)}
                className={inputCls} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{getCpfCnpjLabel(formData.cliente.cpfCnpj)}</label>
                <input required type="text" placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={formData.cliente.cpfCnpj}
                  onChange={e => handleChange("cliente", "cpfCnpj", formatCpfCnpj(e.target.value))}
                  className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Cidade</label>
                  <input required type="text" placeholder="Ex: São Paulo"
                    value={formData.cliente.cidade}
                    onChange={e => handleChange("cliente", "cidade", e.target.value)}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Estado</label>
                  <input required type="text" placeholder="Ex: SP"
                    value={formData.cliente.estado}
                    onChange={e => handleChange("cliente", "estado", e.target.value)}
                    className={inputCls} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>E-mail (opcional)</label>
              <input type="email" placeholder="cliente@email.com"
                value={formData.cliente.email}
                onChange={e => handleChange("cliente", "email", e.target.value)}
                className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Tipo de Pessoa</label>
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
                  <label className={labelCls}>Nacionalidade</label>
                  <input type="text" placeholder="Ex: brasileiro"
                    value={formData.cliente.nacionalidade || ""}
                    onChange={e => handleChange("cliente", "nacionalidade", e.target.value)}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Estado Civil do Cliente (opcional)</label>
                  <select value={formData.cliente.estadoCivil || ""}
                    onChange={e => handleChange("cliente", "estadoCivil", e.target.value)}
                    className={inputCls}>
                    <option value="">Prefiro não informar</option>
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viúvo">Viúvo(a)</option>
                    <option value="união estável">União Estável</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Profissão (opcional)</label>
                  <input type="text" placeholder="Ex: empresário"
                    value={formData.cliente.profissao || ""}
                    onChange={e => handleChange("cliente", "profissao", e.target.value)}
                    className={inputCls} />
                </div>
              </div>
            )}

            {formData.cliente.tipoPessoa === "PJ" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Representante Legal *</label>
                  <input type="text" placeholder="Nome completo do representante"
                    value={formData.cliente.representanteLegal || ""}
                    onChange={e => handleChange("cliente", "representanteLegal", e.target.value)}
                    className={inputCls} />
                  <p className="text-[10px] text-error italic mt-1 ml-1">Campo obrigatório para pessoa jurídica</p>
                </div>
                <div>
                  <label className={labelCls}>Cargo (opcional)</label>
                  <input type="text" placeholder="Ex: Diretor, Sócio, Gerente..."
                    value={formData.cliente.cargoRepresentante || ""}
                    onChange={e => handleChange("cliente", "cargoRepresentante", e.target.value)}
                    className={inputCls} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ DETALHES DO SERVIÇO ══════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">description</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-body">Detalhes do Serviço</h2>
          </div>
          <div className="space-y-4">

            <div>
              <label className={labelCls}>Número do pedido ou proposta (opcional)</label>
              <input type="text" placeholder="Ex: PROP-2026-042"
                value={formData.servico.numeroPedido || ""}
                onChange={e => handleChange("servico", "numeroPedido", e.target.value)}
                className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Descrição do Serviço</label>
              <textarea required placeholder="O que será entregue?" rows={3}
                value={formData.servico.descricao}
                onChange={e => handleChange("servico", "descricao", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Valor (R$)</label>
                <input required type="text" placeholder="Ex: 1.500,00"
                  value={formData.servico.valor}
                  onChange={handleChangeValor}
                  onBlur={handleBlurValor}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Prazo</label>
                <input required type="text" placeholder="Ex: 15 dias"
                  value={formData.servico.prazoEntrega}
                  onChange={e => handleChange("servico", "prazoEntrega", e.target.value)}
                  className={inputCls} />
              </div>
            </div>

            {/* ─── Forma de Pagamento ──────────────────────────────────────────── */}
            <div>
              <label className={labelCls}>Como será o pagamento?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {([
                  { id: "unico", label: "Pagamento único" },
                  { id: "entrada_saldo", label: "Entrada + saldo" },
                  { id: "parcelado", label: "Parcelado" },
                  { id: "a_combinar", label: "A combinar com o cliente" },
                ] as const).map(opt => (
                  <button key={opt.id} type="button"
                    onClick={() => handleChange("servico", "formaPagamentoTipo", opt.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${formData.servico.formaPagamentoTipo === opt.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}>
                    <h3 className="font-bold text-on-surface text-sm">{opt.label}</h3>
                  </button>
                ))}
              </div>

              {/* Único */}
              {formData.servico.formaPagamentoTipo === "unico" && (
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-4">
                  <div>
                    <label className={labelCls}>Quando?</label>
                    <select value={formData.servico.formaPagamentoDetalhes?.quandoUnico}
                      onChange={e => handlePagamentoDetalhes("quandoUnico", e.target.value)}
                      className={inputSmCls}>
                      <option value="assinatura">Na assinatura</option>
                      <option value="entrega">Na entrega</option>
                      <option value="data">Em data específica</option>
                    </select>
                  </div>
                  {formData.servico.formaPagamentoDetalhes?.quandoUnico === "data" && (
                    <div>
                      <label className={labelCls}>Qual data?</label>
                      <input type="date"
                        value={formData.servico.formaPagamentoDetalhes?.dataUnico || ""}
                        onChange={e => handlePagamentoDetalhes("dataUnico", e.target.value)}
                        className={inputSmCls} />
                    </div>
                  )}
                </div>
              )}

              {/* Entrada + Saldo */}
              {formData.servico.formaPagamentoTipo === "entrada_saldo" && (
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>% de entrada</label>
                      <div className="relative">
                        <input type="number" min="1" max="99" placeholder="Ex: 50"
                          value={formData.servico.formaPagamentoDetalhes?.percentualEntrada || ""}
                          onChange={e => handlePagamentoDetalhes("percentualEntrada", e.target.value)}
                          className={inputSmCls + " pr-8"} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-xs font-bold">%</span>
                      </div>
                      {valorNumerico > 0 && formData.servico.formaPagamentoDetalhes?.percentualEntrada && (() => {
                        const perc = parseFloat(formData.servico.formaPagamentoDetalhes.percentualEntrada) || 0;
                        const entrada = valorNumerico * perc / 100;
                        const saldo = valorNumerico - entrada;
                        return <p className="text-[10px] text-primary font-bold mt-1">Entrada: R$ {entrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Saldo: R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>;
                      })()}
                    </div>
                    <div>
                      <label className={labelCls}>Quando pagar o saldo?</label>
                      <select value={formData.servico.formaPagamentoDetalhes?.quandoSaldo}
                        onChange={e => handlePagamentoDetalhes("quandoSaldo", e.target.value)}
                        className={inputSmCls}>
                        <option value="entrega">Na entrega</option>
                        <option value="dias">Em X dias após entrega</option>
                      </select>
                    </div>
                  </div>
                  {formData.servico.formaPagamentoDetalhes?.quandoSaldo === "dias" && (
                    <div>
                      <label className={labelCls}>Quantos dias após a entrega?</label>
                      <input type="number" min="1" placeholder="Ex: 15"
                        value={formData.servico.formaPagamentoDetalhes?.diasSaldo || ""}
                        onChange={e => handlePagamentoDetalhes("diasSaldo", e.target.value)}
                        className={inputSmCls} />
                    </div>
                  )}
                </div>
              )}

              {/* Parcelado */}
              {formData.servico.formaPagamentoTipo === "parcelado" && (
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Em quantas parcelas?</label>
                      <input type="number" min="2" max="24" placeholder="Ex: 3"
                        value={formData.servico.formaPagamentoDetalhes?.numeroParcelas || ""}
                        onChange={e => handlePagamentoDetalhes("numeroParcelas", e.target.value)}
                        className={inputSmCls} />
                      {valorNumerico > 0 && formData.servico.formaPagamentoDetalhes?.numeroParcelas && (() => {
                        const n = parseInt(formData.servico.formaPagamentoDetalhes.numeroParcelas) || 1;
                        const parcela = valorNumerico / n;
                        return <p className="text-[10px] text-primary font-bold mt-1">Cada parcela: R$ {parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>;
                      })()}
                    </div>
                    <div>
                      <label className={labelCls}>Vencimento</label>
                      <select value={formData.servico.formaPagamentoDetalhes?.vencimentoParcelas}
                        onChange={e => handlePagamentoDetalhes("vencimentoParcelas", e.target.value)}
                        className={inputSmCls}>
                        <option value="dia_mes">Todo dia X do mês</option>
                        <option value="dias_apos">A cada X dias após assinatura</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>
                      {formData.servico.formaPagamentoDetalhes?.vencimentoParcelas === "dia_mes" ? "Qual dia do mês?" : "Quantos dias?"}
                    </label>
                    <input type="number"
                      placeholder={formData.servico.formaPagamentoDetalhes?.vencimentoParcelas === "dia_mes" ? "Ex: 10" : "Ex: 30"}
                      value={formData.servico.formaPagamentoDetalhes?.diaMesVencimento || ""}
                      onChange={e => handlePagamentoDetalhes("diaMesVencimento", e.target.value)}
                      className={inputSmCls} />
                  </div>
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-on-surface cursor-pointer">
                      <input type="checkbox"
                        checked={formData.servico.formaPagamentoDetalhes?.comEntrada || false}
                        onChange={e => handlePagamentoDetalhes("comEntrada", e.target.checked)}
                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" />
                      Tem entrada?
                    </label>
                  </div>
                  {formData.servico.formaPagamentoDetalhes?.comEntrada && (
                    <div>
                      <label className={labelCls}>% de Entrada</label>
                      <input type="number" placeholder="Ex: 50" min="1" max="99"
                        value={formData.servico.formaPagamentoDetalhes?.percentualEntrada || ""}
                        onChange={e => handlePagamentoDetalhes("percentualEntrada", e.target.value)}
                        className={inputSmCls} />
                    </div>
                  )}
                </div>
              )}

              {/* Prazo após entrega */}
              {((formData.servico.formaPagamentoTipo === "unico" && formData.servico.formaPagamentoDetalhes?.quandoUnico === "entrega") ||
                (formData.servico.formaPagamentoTipo === "entrada_saldo" && formData.servico.formaPagamentoDetalhes?.quandoSaldo === "entrega")) && (
                <div className="mt-4 bg-[#002b73]/5 p-4 rounded-xl border border-[#002b73]/10">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Em quantos dias após a entrega o pagamento deve ser feito?</label>
                  <input type="number" min="0" placeholder="Ex: 2"
                    value={formData.servico.prazoPagamentoAposEntrega || ""}
                    onChange={e => handleChange("servico", "prazoPagamentoAposEntrega", e.target.value)}
                    className="w-full bg-white rounded-xl py-3 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body text-sm" />
                  <p className="text-[10px] text-outline-variant italic mt-2 ml-1">Deixe em branco para usar o padrão de 2 (dois) dias úteis.</p>
                </div>
              )}
            </div>

            {/* Forma de recebimento */}
            <div>
              <label className={labelCls}>Como receberá o pagamento?</label>
              <select value={formData.servico.formaRecebimento}
                onChange={e => handleChange("servico", "formaRecebimento", e.target.value)}
                className={inputCls}>
                <option value="pix-ou-transferencia">Pix ou transferência bancária</option>
                <option value="pix">Pix</option>
                <option value="transferencia">Transferência bancária</option>
                <option value="a-combinar">A combinar</option>
              </select>
            </div>

            {/* Multa + Juros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Multa por rescisão (%) (opcional)</label>
                <div className="relative">
                  <input type="number" min="1" max="100" placeholder="Ex: 20"
                    value={formData.servico.multaRescisao || ""}
                    onChange={e => handleChange("servico", "multaRescisao", e.target.value)}
                    className={inputCls + " pr-10"} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant font-bold text-sm">%</span>
                </div>
                <p className="text-[10px] text-outline-variant italic mt-1 ml-1">Aplicada em cancelamento de contrato.</p>
              </div>
              <div>
                <label className={labelCls}>Juros por atraso no pagamento (opcional)</label>
                <input type="text" placeholder="Ex: 1% ao mês"
                  value={formData.servico.jurosAtraso || ""}
                  onChange={e => handleChange("servico", "jurosAtraso", e.target.value)}
                  className={inputCls} />
                <p className="text-[10px] text-outline-variant italic mt-1 ml-1">Deixe em branco para omitir.</p>
              </div>
            </div>

            {/* Local + Entrega */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Local de Prestação (opcional)</label>
                <input type="text" placeholder="Ex: Remoto / Sede do cliente"
                  value={formData.servico.localPrestacao}
                  onChange={e => handleChange("servico", "localPrestacao", e.target.value)}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Forma de Entrega (opcional)</label>
                <input type="text" placeholder="Ex: Google Drive, E-mail"
                  value={formData.servico.formaEntrega}
                  onChange={e => handleChange("servico", "formaEntrega", e.target.value)}
                  className={inputCls} />
              </div>
            </div>

            {/* Cláusulas especiais */}
            <div>
              <label className={labelCls}>Cláusulas Especiais / Observações (opcional)</label>
              <textarea placeholder="Ex: Multa de 10% por atraso; Adicional de urgência; Entrega via Google Drive..."
                rows={3}
                value={formData.servico.clausulasEspeciais || ""}
                onChange={e => handleChange("servico", "clausulasEspeciais", e.target.value)}
                className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all resize-none" />
            </div>

            {/* ══ CAMPOS CONDICIONAIS POR CATEGORIA ════════════════════════════════ */}
            {(isCat(CAT_CRIATIVOS_E_DEV) || isCat(CAT_FOTO_VIDEO) || isCat(CAT_CONSTRUCAO) ||
              isCat(CAT_BELEZA) || isCat(CAT_CONSULTORIA) || isCat(CAT_SAUDE)) && (
              <div className="mt-8 pt-6 border-t border-outline-variant/10 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">tune</span>
                  <h3 className="font-bold text-xs tracking-widest uppercase text-primary font-body">
                    Detalhes de {catExtra.title}
                  </h3>
                </div>

                {/* CRIATIVOS & DEV: revisões, PI, portfólio, subcontratação */}
                {isCat(CAT_CRIATIVOS_E_DEV) && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Quantas revisões estão inclusas no valor? (opcional)</label>
                      <input type="number" placeholder="Ex: 2"
                        value={formData.servico.revisoes || ""}
                        onChange={e => handleChange("servico", "revisoes", e.target.value)}
                        className={inputCls} />
                      <p className="text-[10px] text-outline-variant italic mt-1 ml-1">Deixe em branco para omitir do contrato</p>
                    </div>
                    <div>
                      <label className={labelCls}>A propriedade do trabalho transfere ao cliente após pagamento?</label>
                      <ToggleField value={!!formData.servico.transferePI} onChange={v => handleChange("servico", "transferePI", v)} />
                    </div>
                    <div>
                      <label className={labelCls}>Você pode usar o trabalho no seu portfólio?</label>
                      <ToggleField value={!!formData.servico.permitePortfolio} onChange={v => handleChange("servico", "permitePortfolio", v)} />
                    </div>
                    <div>
                      <label className={labelCls}>Proibir que o cliente repasse o trabalho a terceiros?</label>
                      <ToggleField value={!!formData.servico.proibeSubcontratacao} onChange={v => handleChange("servico", "proibeSubcontratacao", v)} />
                    </div>
                  </div>
                )}

                {/* DEV EXTRA */}
                {isCat(CAT_DEV) && (
                  <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                    <div>
                      <label className={labelCls}>Quantos dias de garantia contra bugs após entrega? (opcional)</label>
                      <input type="number" placeholder="Ex: 90"
                        value={formData.servico.diasGarantia || ""}
                        onChange={e => handleChange("servico", "diasGarantia", e.target.value)}
                        className={inputCls} />
                      <p className="text-[10px] text-outline-variant italic mt-1 ml-1">Deixe em branco para omitir do contrato</p>
                    </div>
                    <div>
                      <label className={labelCls}>Quem arca com custos de hospedagem e deploy?</label>
                      <select value={formData.servico.quemPagaHospedagem || "o-cliente"}
                        onChange={e => handleChange("servico", "quemPagaHospedagem", e.target.value)}
                        className={inputCls}>
                        <option value="o-cliente">O cliente</option>
                        <option value="prestador">Eu (prestador)</option>
                        <option value="a-combinar">A combinar</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* FOTO/VIDEO */}
                {isCat(CAT_FOTO_VIDEO) && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Entrega arquivos RAW ao cliente?</label>
                      <ToggleField value={!!formData.servico.entregaRaw} onChange={v => handleChange("servico", "entregaRaw", v)} />
                    </div>
                    <div>
                      <label className={labelCls}>Quantas rodadas de seleção de fotos? (opcional)</label>
                      <input type="number" placeholder="Ex: 1"
                        value={formData.servico.revisoesFotos || ""}
                        onChange={e => handleChange("servico", "revisoesFotos", e.target.value)}
                        className={inputCls} />
                    </div>
                  </div>
                )}

                {/* CONSTRUÇÃO */}
                {isCat(CAT_CONSTRUCAO) && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Quem fornece os materiais?</label>
                      <select value={formData.servico.quemForneceMateriais || "a-combinar"}
                        onChange={e => handleChange("servico", "quemForneceMateriais", e.target.value)}
                        className={inputCls}>
                        <option value="a-combinar">A combinar</option>
                        <option value="cliente">O cliente fornece tudo</option>
                        <option value="prestador">Eu (prestador) forneço tudo</option>
                        <option value="dividido">Cada um fornece o que for seu</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Quantos dias de garantia da mão de obra? (opcional)</label>
                      <input type="number" placeholder="Ex: 90"
                        value={formData.servico.garantiaMaoDeObra || ""}
                        onChange={e => handleChange("servico", "garantiaMaoDeObra", e.target.value)}
                        className={inputCls} />
                      <p className="text-[10px] text-outline-variant italic mt-1 ml-1">Deixe em branco para omitir do contrato</p>
                    </div>
                  </div>
                )}

                {/* BELEZA */}
                {isCat(CAT_BELEZA) && (
                  <div>
                    <label className={labelCls}>O que acontece se o cliente cancelar sem avisar?</label>
                    <select value={formData.servico.politicaCancelamento || "cobrar"}
                      onChange={e => handleChange("servico", "politicaCancelamento", e.target.value)}
                      className={inputCls}>
                      <option value="cobrar">Cobrar o valor da sessão</option>
                      <option value="nao-cobrar">Não cobrar</option>
                    </select>
                  </div>
                )}

                {/* CONSULTORIA */}
                {isCat(CAT_CONSULTORIA) && (
                  <div>
                    <label className={labelCls}>As sessões podem ser gravadas?</label>
                    <ToggleField value={!!formData.servico.sessoesGravadas} onChange={v => handleChange("servico", "sessoesGravadas", v)} />
                  </div>
                )}

                {/* SAÚDE */}
                {isCat(CAT_SAUDE) && (
                  <div>
                    <label className={labelCls}>O que acontece se o cliente cancelar sem avisar?</label>
                    <select value={formData.servico.politicaCancelamento || "cobrar"}
                      onChange={e => handleChange("servico", "politicaCancelamento", e.target.value)}
                      className={inputCls}>
                      <option value="cobrar">Cobrar o valor da sessão</option>
                      <option value="nao-cobrar">Não cobrar</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Campos extras legados (camposExtras da categoria) */}
            {catExtra?.camposExtras && catExtra.camposExtras.length > 0 && (
              <div className="mt-8 pt-6 border-t border-outline-variant/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  <h3 className="font-bold text-sm tracking-widest uppercase text-primary font-body">Informações de {catExtra.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catExtra.camposExtras.map(campo => (
                    <div key={campo.id} className={campo.id === 'manutencaoMensal' ? 'md:col-span-2' : ''}>
                      <label className={labelCls}>{campo.label}</label>
                      {campo.type === 'enum' && campo.options ? (
                        <select className={inputCls}
                          value={(formData.servico.camposExtrasCategoria?.[campo.id] as string) || ""}
                          onChange={e => setFormData(prev => ({
                            ...prev, servico: {
                              ...prev.servico,
                              camposExtrasCategoria: { ...(prev.servico.camposExtrasCategoria || {}), [campo.id]: e.target.value },
                              ...(campo.id === 'manutencaoMensal' ? {
                                manutencaoMensal: e.target.value === 'Sim, incluir no contrato',
                                ...(e.target.value !== 'Sim, incluir no contrato' ? { valorManutencao: '', escopoManutencao: '' } : {}),
                              } : {}),
                            }
                          }))}>
                          <option value="">Selecione...</option>
                          {campo.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input
                          type={campo.type === 'number' ? 'number' : 'text'}
                          placeholder={campo.placeholder}
                          className={inputCls}
                          value={(formData.servico.camposExtrasCategoria?.[campo.id] as string) || ""}
                          onChange={e => setFormData(prev => ({
                            ...prev, servico: {
                              ...prev.servico,
                              camposExtrasCategoria: { ...(prev.servico.camposExtrasCategoria || {}), [campo.id]: e.target.value }
                            }
                          }))} />
                      )}
                      {/* Campos condicionais de manutenção mensal */}
                      {campo.id === 'manutencaoMensal' &&
                        formData.servico.camposExtrasCategoria?.['manutencaoMensal'] === 'Sim, incluir no contrato' && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className={labelCls}>Valor da manutenção mensal (R$) *</label>
                            <input type="text" placeholder="0,00"
                              value={formData.servico.valorManutencao || ""}
                              onChange={handleChangeCurrency("valorManutencao")}
                              className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>O que está incluso na manutenção?</label>
                            <textarea
                              placeholder="Ex: até 5 horas de ajustes mensais, atualizações de segurança, backups semanais..."
                              rows={3}
                              value={formData.servico.escopoManutencao || ""}
                              onChange={e => handleChange("servico", "escopoManutencao", e.target.value)}
                              className="w-full bg-surface-container-highest rounded-xl py-[14px] px-5 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all resize-none" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ══ CONFIGURAÇÕES AVANÇADAS ══════════════════════════════════════════════ */}
        <div className="pt-4 border-t border-outline-variant/10">
          <button type="button"
            onClick={() => setAvancadoAberto(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">settings</span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary font-body">
                Configurações Avançadas (opcional)
              </span>
            </div>
            <span className="material-symbols-outlined text-outline text-base">
              {avancadoAberto ? "expand_less" : "expand_more"}
            </span>
          </button>

          {avancadoAberto && (
            <div className="mt-4 space-y-4 bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
              <div>
                <label className={labelCls}>Dias de aviso prévio para cancelar o contrato</label>
                <div className="flex items-center gap-3">
                  <input type="number" placeholder="10"
                    value={formData.servico.avisoPrevio || ""}
                    onChange={e => handleChange("servico", "avisoPrevio", e.target.value)}
                    className={inputCls} />
                  <span className="text-sm text-on-surface-variant whitespace-nowrap font-body">dias úteis</span>
                </div>
              </div>
              <div>
                <label className={labelCls}>Dias para o cliente aprovar ou pedir ajustes</label>
                <div className="flex items-center gap-3">
                  <input type="number" placeholder="5"
                    value={formData.servico.prazoAprovacao || ""}
                    onChange={e => handleChange("servico", "prazoAprovacao", e.target.value)}
                    className={inputCls} />
                  <span className="text-sm text-on-surface-variant whitespace-nowrap font-body">dias úteis</span>
                </div>
                <p className="text-[10px] text-outline-variant italic mt-1 ml-1">Após esse prazo sem resposta, considera-se aprovado automaticamente</p>
              </div>
              {isCat(CAT_PRECISA_MATERIAIS) && (
                <div>
                  <label className={labelCls}>Dias para o cliente enviar materiais solicitados</label>
                  <div className="flex items-center gap-3">
                    <input type="number" placeholder="5"
                      value={formData.servico.prazoMateriais || ""}
                      onChange={e => handleChange("servico", "prazoMateriais", e.target.value)}
                      className={inputCls} />
                    <span className="text-sm text-on-surface-variant whitespace-nowrap font-body">dias úteis</span>
                  </div>
                  <p className="text-[10px] text-outline-variant italic mt-1 ml-1">O prazo de entrega fica suspenso enquanto aguarda materiais do cliente</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ══ MODO DE ASSINATURA ═══════════════════════════════════════════════════ */}
        <div className="space-y-4 pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">draw</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-body">Modo de Assinatura</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {([
              { id: "fisica_com_testemunhas" as const, icon: "how_to_reg", label: "Física + Testemunhas", desc: "Indicado para serviços presenciais, obras e contratos de maior valor." },
              { id: "fisica_sem_testemunhas" as const, icon: "edit", label: "Física (Simples)", desc: "Para serviços de menor valor quando as partes dispensam testemunhas." },
              { id: "eletronica" as const, icon: "link", label: "Aceite Eletrônico", desc: "Para serviços online ou cliente em outra cidade. Válido pelo CPC." },
            ]).map(opt => (
              <button key={opt.id} type="button" onClick={() => setModoAssinatura(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${modoAssinatura === opt.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/20 hover:border-primary/50"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-lg">{opt.icon}</span>
                  <h3 className="font-bold text-on-surface text-sm">{opt.label}</h3>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ══ SUBMIT ═══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-outline-variant/10">
          <button type="submit"
            className="w-full signature-gradient text-white py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
            Próxima Etapa →
          </button>
          <button type="button" onClick={saveDraft}
            className="w-full py-4 text-primary font-bold hover:bg-surface-container-lowest transition-colors rounded-full">
            {saved ? "Rascunho Salvo!" : "Salvar Rascunho"}
          </button>
          <button type="button" onClick={onBack}
            className="text-on-surface-variant text-sm mt-4 hover:underline">
            Voltar
          </button>
        </div>
      </form>

      <div className="mt-12 text-center text-on-surface-variant opacity-60 text-xs font-body mb-8">
        Um produto FlowIQ © {new Date().getFullYear()}
      </div>
    </div>
  );
}
