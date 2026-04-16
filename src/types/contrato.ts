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

export interface DadosPrestador {
  nomeCompleto: string;
  cpfCnpj: string;
}

export interface DadosCliente {
  nomeRazaoSocial: string;
  cpfCnpj: string;
}

export interface DadosServico {
  descricao: string;
  valor: number;
  prazoEntrega: string;
  formaPagamento: string;
  clausulasEspeciais?: string;
}

export interface FormularioContrato {
  categoria: CategoriaContrato;
  categoriaCustom?: string; // usado quando categoria === "outros"
  prestador: DadosPrestador;
  cliente: DadosCliente;
  servico: DadosServico;
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
