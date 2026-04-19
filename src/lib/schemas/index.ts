import { z } from "zod";

// ── Primitivos reutilizáveis ──────────────────────────────────────────────────

const cpfCnpj = z.string().min(11, "CPF/CNPJ obrigatório");
const uuid = z.string().uuid("ID inválido");
const tipoContrato = z.enum(["completo-formal", "simplificado", "executivo", "minimalista"]);
const categoriaContrato = z.enum([
  "fotografo", "videomaker", "designer-grafico", "desenvolvedor-web",
  "social-media", "redator", "ilustrador", "motion-designer",
  "editor-de-video", "consultor", "servicos-gerais", "outros",
]);

// ── Schemas de entrada por rota ───────────────────────────────────────────────

export const SalvarContratoSchema = z.object({
  formulario: z.object({
    categoria: categoriaContrato,
    categoriaCustom: z.string().optional(),
    prestador: z.object({
      nomeCompleto: z.string().min(3, "Nome do prestador obrigatório"),
      cpfCnpj,
      cidade: z.string().min(2, "Cidade obrigatória"),
      estado: z.string().min(2, "Estado obrigatório"),
      email: z.string().email("E-mail do prestador inválido"),
    }).passthrough(),
    cliente: z.object({
      nomeRazaoSocial: z.string().min(3, "Nome do cliente obrigatório"),
      cpfCnpj,
      cidade: z.string().min(2, "Cidade obrigatória"),
      estado: z.string().min(2, "Estado obrigatório"),
      email: z.string().email("E-mail do cliente inválido"),
    }).passthrough(),
    servico: z.object({
      descricao: z.string().min(10, "Descrição do serviço obrigatória"),
      valor: z.string().min(1, "Valor obrigatório"),
      prazoEntrega: z.string().min(1, "Prazo de entrega obrigatório"),
      formaPagamento: z.string().optional(),
    }).passthrough(),
    modoAssinatura: z.enum(["fisica_com_testemunhas", "fisica_sem_testemunhas", "eletronica"]),
  }),
  tipo: tipoContrato,
  conteudo: z.string().optional(),
  status_override: z.string().optional(),
});

export const GerarContratoSchema = z.object({
  formulario: z.object({
    categoria: categoriaContrato,
    modoAssinatura: z.enum(["fisica_com_testemunhas", "fisica_sem_testemunhas", "eletronica"]),
    prestador: z.object({ nomeCompleto: z.string().min(1) }).passthrough(),
    cliente: z.object({}).passthrough(),
    servico: z.object({ descricao: z.string().min(1) }).passthrough(),
  }).passthrough(),
  tipo: tipoContrato,
  contratoId: uuid.optional(),
});

export const GerarPdfSchema = z.object({
  conteudo: z.string().min(1, "Conteúdo é obrigatório"),
});

export const AtualizarContratoSchema = z.object({
  contratoId: uuid,
  conteudo: z.string().optional(),
  tipo: tipoContrato.optional(),
});

export const DuplicarContratoSchema = z.object({
  contratoId: uuid,
});

export const CriarCheckoutSchema = z.object({
  plano: z.enum(["avulso", "mensal", "semestral", "anual"]),
  contratoId: uuid.optional(),
});

export const EmailSchema = z.object({
  tipo: z.enum(["boas-vindas", "confirmacao-pagamento"]),
}).passthrough();
