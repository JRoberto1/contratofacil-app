import { categorias, CategoriaSlug } from "@/lib/categorias";
import type { FormularioContrato, TipoContrato } from "@/types/contrato";

const TIPO_LABEL: Record<TipoContrato, string> = {
  "completo-formal": "Completo Formal",
  "simplificado": "Simplificado",
  "executivo": "Executivo",
  "minimalista": "Minimalista",
};

const MODO_ASSINATURA_LABEL: Record<string, string> = {
  "eletronica": "Aceite Eletrônico",
  "fisica_sem_testemunhas": "Física Simples",
  "fisica_com_testemunhas": "Física + Testemunhas",
};

function qualificarParte(tipo: "PF" | "PJ" | undefined, dados: {
  nacionalidade?: string;
  estadoCivil?: string;
  profissao?: string;
  representanteLegal?: string;
  cargoRepresentante?: string;
}): string {
  if (tipo === "PJ") {
    const rep = dados.representanteLegal ? `, representada por ${dados.representanteLegal}${dados.cargoRepresentante ? `, ${dados.cargoRepresentante}` : ""}` : "";
    return `pessoa jurídica de direito privado${rep}`;
  }
  // PF ou não informado
  const partes: string[] = [];
  if (dados.nacionalidade) partes.push(dados.nacionalidade);
  if (dados.estadoCivil) partes.push(dados.estadoCivil);
  if (dados.profissao) partes.push(dados.profissao);
  return partes.length > 0 ? partes.join(", ") : "";
}

export function prepararPrompt(formulario: FormularioContrato, tipoContrato: TipoContrato) {
  const categoriaInfo = categorias[(formulario.categoria as CategoriaSlug)] || categorias['other'];

  // Multas e juros
  const penalidadeAtraso = formulario.servico.jurosAtraso
    ? `Em caso de atraso no pagamento, incidirão juros moratórios de ${formulario.servico.jurosAtraso}.`
    : "";

  const quebraRescisao = formulario.servico.multaRescisao
    ? `O contrato prescreve cláusula penal correspondente a ${formulario.servico.multaRescisao}% do valor global em caso de rescisão imotivada por qualquer das partes.`
    : "";

  const instrucoesFinanceiras = (penalidadeAtraso || quebraRescisao)
    ? `\n- MULTAS E JUROS AUTORIZADOS: ${penalidadeAtraso} ${quebraRescisao}`
    : `\n- MULTAS E JUROS: NÃO foi autorizada nenhuma cláusula de multa por atraso, juros ou cláusula penal. O contrato NÃO deve conter nenhuma estipulação financeira punitiva.`;

  // Campos extras da categoria
  let extrasString = "";
  if (formulario.servico.camposExtrasCategoria && Object.keys(formulario.servico.camposExtrasCategoria).length > 0) {
    extrasString = "\nINFORMAÇÕES ESPECÍFICAS DA CATEGORIA:\n";
    for (const campo of categoriaInfo.camposExtras) {
      if (formulario.servico.camposExtrasCategoria[campo.id]) {
        extrasString += `- ${campo.label}: ${formulario.servico.camposExtrasCategoria[campo.id]}\n`;
      }
    }
  }

  // Cláusulas da categoria
  const clausulasEspeciais = categoriaInfo.clausulasBase.map((c, i) => `${i + 1}. ${c}`).join('\n');

  // Diretriz de tipo de contrato
  const diretrizTipo: Record<TipoContrato, string> = {
    "completo-formal": "TIPO: Completo Formal — Extensão: 3 a 5 páginas. Tom: técnico-jurídico, linguagem formal, citações legais pertinentes. Estrutura: todas as cláusulas numeradas, com parágrafos e incisos. Inclui: definição de termos, casos fortuitos, sucessão, legislação aplicável.",
    "simplificado": "TIPO: Simplificado — Extensão: 1 a 2 páginas. Tom: linguagem acessível, sem juridiquês desnecessário. Estrutura: apenas cláusulas essenciais, sem subparágrafos excessivos. Inclui: objeto, pagamento, prazo, rescisão, LGPD, foro.",
    "executivo": "TIPO: Executivo — Extensão: 1,5 a 2,5 páginas. Tom: formal e objetivo, adequado para relações B2B. Estrutura: cláusulas compactas, sem subcláusulas extensas. Inclui: objeto, pagamento, entregáveis, confidencialidade, rescisão, foro.",
    "minimalista": "TIPO: Minimalista — Extensão: até 1 página. Tom: direto, linguagem do cotidiano sem juridiquês. Estrutura: blocos simples, sem numeração de incisos. Inclui: quem é quem, o que vai fazer, quanto vai receber, o que acontece se não pagar, onde resolver conflito.",
  };

  // Qualificação das partes
  const qualifPrestador = qualificarParte(formulario.prestador.tipoPessoa, formulario.prestador);
  const qualifCliente = qualificarParte(formulario.cliente.tipoPessoa, formulario.cliente);

  // Modo de assinatura
  const modoLabel = MODO_ASSINATURA_LABEL[formulario.modoAssinatura] || "Física Simples";

  const aceiteClausula =
    formulario.modoAssinatura === "eletronica"
      ? "Este contrato é válido mediante aceite eletrônico registrado por link, nos termos do art. 10 da MP 2.200-2/2001 e do art. 784 do CPC."
      : formulario.modoAssinatura === "fisica_com_testemunhas"
      ? "Assinado em 2 (duas) vias de igual teor na presença de 2 (duas) testemunhas, constituindo título executivo extrajudicial nos termos do art. 784, III do CPC."
      : "Assinado em 2 (duas) vias de igual teor e forma.";

  const systemPrompt = `
Você é um advogado brasileiro experiente, especialista em Direito Civil e Contratual. Seu papel é atuar como o motor gerador de contratos do ContratoFácil — plataforma para MEIs e autônomos brasileiros.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJETIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Redigir UM CONTRATO DE PRESTAÇÃO DE SERVIÇOS juridicamente estruturado, seguro, que proteja o prestador autônomo, sem alucinar dados financeiros ou pessoais não informados pelo usuário.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS DE INVENÇÃO ZERO — NUNCA VIOLAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. MULTAS E JUROS: Nunca incluir percentuais de multa, juros ou cláusula penal não informados explicitamente em "MULTAS E JUROS AUTORIZADOS".${instrucoesFinanceiras}

2. DATAS: Nunca inventar datas de vencimento ou marcos não definidos.

3. ENDEREÇOS: Usar exatamente cidade e estado informados. Nunca completar.

4. OBRIGAÇÕES EXTRAS: Nunca adicionar obrigações além das descritas.

5. VALORES DERIVADOS: Nunca calcular parcelas, honorários ou custos extras não informados.

6. QUALIFICAÇÃO DAS PARTES:
   - Se TIPO_PESSOA = "PF": qualificar com nacionalidade, estado civil e profissão informados. Nunca inventar.
   - Se TIPO_PESSOA = "PJ": qualificar com razão social, CNPJ e representante legal informados. Nunca inventar.
   - Se não informado: qualificar apenas com os dados disponíveis.

TESTE ANTES DE GERAR: Para cada cláusula com número ou percentual, pergunte: "o usuário ou sistema informaram esse valor?" Se não → remova.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIPO DE CONTRATO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${diretrizTipo[tipoContrato]}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLÁUSULAS OBRIGATÓRIAS EM TODOS OS CONTRATOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Independente de categoria ou tipo, todo contrato DEVE conter:

1. INEXISTÊNCIA DE VÍNCULO EMPREGATÍCIO — Declarar ausência de subordinação, pessoalidade e exclusividade (salvo se usuário ativou cláusula de exclusividade), nos termos do art. 442-B da CLT. O CONTRATADO é autônomo e responsável por seus próprios encargos trabalhistas, previdenciários e tributários.

2. EMISSÃO DE DOCUMENTO FISCAL — O CONTRATADO se obriga a emitir Nota Fiscal de Serviços (NFS-e) ou Recibo de Pagamento Autônomo (RPA) referente a cada pagamento recebido.

3. SIGILO E CONFIDENCIALIDADE — O CONTRATADO se obriga a manter sigilo sobre informações, dados e documentos do CONTRATANTE obtidos durante a prestação dos serviços, mesmo após o encerramento do contrato.

4. LGPD — O tratamento de dados pessoais decorre do objeto contratual, com base legal no art. 7º, incisos II e V da Lei nº 13.709/2018 (LGPD). Os dados serão utilizados exclusivamente para cumprimento das obrigações contratadas e descartados ao final da relação contratual.

5. FORO DE ELEIÇÃO — Foro da comarca do CONTRATADO (${formulario.prestador.cidade}/${formulario.prestador.estado}), com renúncia expressa a qualquer outro, por mais privilegiado que seja.

6. ACEITE E VALIDADE — ${aceiteClausula}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLÁUSULAS BASE DA CATEGORIA: ${categoriaInfo.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${clausulasEspeciais}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DADOS DE PAGAMENTO (REGRA ABSOLUTA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A cláusula de remuneração deve ser a TRANSCRIÇÃO JURÍDICA FIEL da "Forma de pagamento" passada pelo usuário. É PROIBIDO CRIAR CONDIÇÕES NÃO MENCIONADAS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMATO DE SAÍDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Use # apenas para o título principal
- Use ## para cada seção (DAS PARTES, DO OBJETO, DA REMUNERAÇÃO...)
- Use ### apenas para subseções quando necessário
- Use **negrito** para nomes das partes, valores e datas importantes
- Use listas com - para obrigações
- Use tabelas markdown para milestones com mais de 2 marcos de pagamento
- Separe seções com ---
- Nunca use markdown decorativo
- O texto deve ler como documento jurídico real
- Responda APENAS com o texto do contrato. Não adicione introduções ou assine como IA.
`;

  // User prompt
  const prestadorQualif = qualifPrestador ? `, ${qualifPrestador}` : "";
  const clienteQualif = qualifCliente ? `, ${qualifCliente}` : "";

  const prestadorPJRep = formulario.prestador.tipoPessoa === "PJ" && formulario.prestador.representanteLegal
    ? `\n- Representante Legal: ${formulario.prestador.representanteLegal}${formulario.prestador.cargoRepresentante ? ` (${formulario.prestador.cargoRepresentante})` : ""}`
    : "";

  const clientePJRep = formulario.cliente.tipoPessoa === "PJ" && formulario.cliente.representanteLegal
    ? `\n- Representante Legal: ${formulario.cliente.representanteLegal}${formulario.cliente.cargoRepresentante ? ` (${formulario.cliente.cargoRepresentante})` : ""}`
    : "";

  const userPrompt = `
TIPO DE CONTRATO: ${TIPO_LABEL[tipoContrato]}

CONTRATANTE (Cliente):
- Nome/Razão Social: ${formulario.cliente.nomeRazaoSocial}${clienteQualif}
- Tipo de pessoa: ${formulario.cliente.tipoPessoa || "PF"}
- CPF/CNPJ: ${formulario.cliente.cpfCnpj}
- Cidade/Estado: ${formulario.cliente.cidade} - ${formulario.cliente.estado}${formulario.cliente.email ? `\n- E-mail: ${formulario.cliente.email}` : ""}${clientePJRep}

CONTRATADO (Prestador):
- Nome completo: ${formulario.prestador.nomeCompleto}${prestadorQualif}
- Tipo de pessoa: ${formulario.prestador.tipoPessoa || "PF"}
- CPF/CNPJ: ${formulario.prestador.cpfCnpj}
- Cidade/Estado: ${formulario.prestador.cidade} - ${formulario.prestador.estado}${formulario.prestador.email ? `\n- E-mail: ${formulario.prestador.email}` : ""}${prestadorPJRep}

SERVIÇO/OBJETO:
- Categoria: ${formulario.categoriaCustom || categoriaInfo.title}${formulario.servico.numeroPedido ? `\n- Número do pedido/orçamento: ${formulario.servico.numeroPedido}` : ""}
- Descrição detalhada: ${formulario.servico.descricao}
- Valor total: R$ ${formulario.servico.valor}
- Prazo de entrega/vigência: ${formulario.servico.prazoEntrega}
- Forma de pagamento: ${formulario.servico.formaPagamento}${formulario.servico.localPrestacao ? `\n- Local de prestação: ${formulario.servico.localPrestacao}` : ""}${formulario.servico.formaEntrega ? `\n- Forma de entrega: ${formulario.servico.formaEntrega}` : ""}${extrasString}${formulario.servico.clausulasEspeciais ? `\nCLÁUSULAS ESPECIAIS DO USUÁRIO:\n- ${formulario.servico.clausulasEspeciais}` : ""}

MODO DE ASSINATURA: ${modoLabel}
`;

  return { systemPrompt, userPrompt };
}
