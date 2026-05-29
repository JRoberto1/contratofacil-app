// =============================================================================
// ContratoFácil — Tipos Centrais
// © 2026 FlowIQ. Todos os direitos reservados.
// =============================================================================

export type CategoriaContrato =
  | "fotografo"
  | "videomaker"
  | "designer-grafico"
  | "desenvolvedor-web"
  | "social-media"
  | "redator"
  | "ilustrador"
  | "motion-designer"
  | "editor-de-video"
  | "consultor"
  | "servicos-gerais"
  | "outros";

export type TipoContrato =
  | "completo-formal"
  | "simplificado"
  | "executivo"
  | "minimalista";

export type FormaPagamentoOpcao = "unico" | "entrada_saldo" | "parcelado" | "a_combinar";

export interface FormaPagamentoDetalhes {
  quandoUnico?: "assinatura" | "entrega" | "data";
  dataUnico?: string;
  percentualEntrada?: string;
  quandoSaldo?: "entrega" | "dias";
  diasSaldo?: string;
  numeroParcelas?: string;
  vencimentoParcelas?: "dia_mes" | "dias_apos";
  diaMesVencimento?: string;
  comEntrada?: boolean;
}


export interface DadosPrestador {
  nomeCompleto: string;
  cpfCnpj: string;
  cidade: string;
  estado: string;
  email?: string;
  tipoPessoa?: "PF" | "PJ";
  nacionalidade?: string;
  estadoCivil?: string;
  profissao?: string;
  representanteLegal?: string;
  cargoRepresentante?: string;
}

export interface DadosCliente {
  nomeRazaoSocial: string;
  cpfCnpj: string;
  cidade: string;
  estado: string;
  email?: string;
  tipoPessoa?: "PF" | "PJ";
  nacionalidade?: string;
  estadoCivil?: string;
  profissao?: string;
  representanteLegal?: string;
  cargoRepresentante?: string;
}

export interface DadosServico {
  descricao: string;
  valor: string;
  prazoEntrega: string;
  formaPagamento: string;
  formaPagamentoTipo?: FormaPagamentoOpcao;
  formaPagamentoDetalhes?: FormaPagamentoDetalhes;
  prazoPagamentoAposEntrega?: string;
  numeroPedido?: string;
  multaRescisao?: string;
  jurosAtraso?: string;
  localPrestacao?: string;
  formaEntrega?: string;
  clausulasEspeciais?: string;
  camposExtrasCategoria?: Record<string, string | boolean | number>;
  // ── Campos novos ────────────────────────────────────────────────────────────
  formaRecebimento?: string;
  // Criativos & Dev
  revisoes?: string;
  transferePI?: boolean;
  permitePortfolio?: boolean;
  proibeSubcontratacao?: boolean;
  // Dev extra
  diasGarantia?: string;
  quemPagaHospedagem?: string;
  manutencaoMensal?: boolean;
  valorManutencao?: string;
  escopoManutencao?: string;
  // Foto / Video
  entregaRaw?: boolean;
  revisoesFotos?: string;
  // Construção
  quemForneceMateriais?: string;
  garantiaMaoDeObra?: string;
  // Beleza & Saúde
  politicaCancelamento?: string;
  // Consultoria
  sessoesGravadas?: boolean;
  // Avançado
  avisoPrevio?: string;
  prazoAprovacao?: string;
  prazoMateriais?: string;
}

export interface FormularioContrato {
  categoria: CategoriaContrato;
  categoriaCustom?: string; // usado quando categoria === "outros"
  prestador: DadosPrestador;
  cliente: DadosCliente;
  servico: DadosServico;
  modoAssinatura: "fisica_com_testemunhas" | "fisica_sem_testemunhas" | "eletronica";
}

export interface ContratoGerado {
  id?: string;
  formulario: FormularioContrato;
  tipo: TipoContrato;
  conteudo: string;
  criadoEm?: string;
  usuarioId?: string;
  pago?: boolean;
  pdfUrl?: string;
}

export interface Contrato {
  id: string;
  referencia: string;
  usuario_id: string;
  cliente_nome: string; // DB col mapping
  prestador_nome?: string;
  categoria: string;
  categoria_custom?: string;
  servico_valor: number; // centavos inteiros (ex: 150000 = R$ 1.500,00)
  status: 'rascunho' | 'concluido' | 'pago' | 'enviado';
  conteudo: string;
  tipo: string;
  imutavel: boolean;
  downloads_count: number;
  criado_em?: string;
  updated_at?: string;
}

export type PlanoAssinatura = "gratis" | "avulso" | "mensal" | "semestral" | "anual";

export interface Plano {
  id: PlanoAssinatura;
  nome: string;
  preco: number;
  periodo: string;
  descricao: string;
  destaque?: boolean;
  badge?: string;
}
