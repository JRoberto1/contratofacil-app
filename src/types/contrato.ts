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
  | "resumido-formal"
  | "completo-dia-a-dia"
  | "resumido-dia-a-dia";

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
}

export interface DadosCliente {
  nomeRazaoSocial: string;
  cpfCnpj: string;
  cidade: string;
  estado: string;
  email?: string;
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
  servico_valor: string; // DB col mapping
  status: 'rascunho' | 'gerado' | 'baixado';
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
