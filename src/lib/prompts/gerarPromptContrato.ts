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
    "completo-formal": `MODELO: Completo Formal
EXTENSÃO OBRIGATÓRIA: 600 a 900 palavras.
TOM: técnico-jurídico, linguagem formal, citações de artigos de lei.
ESTRUTURA: cláusulas numeradas (CLÁUSULA 1ª, 2ª...) com parágrafos (§1º, §2º) e incisos (I, II, III).
DEVE INCLUIR: definição de termos, força maior/caso fortuito, sucessão e cessão, vedações explícitas, legislação aplicável.`,

    "simplificado": `MODELO: Simplificado
EXTENSÃO OBRIGATÓRIA: 250 a 380 palavras. SE ULTRAPASSAR 380 PALAVRAS, CORTE CLÁUSULAS.
TOM: linguagem clara e acessível. PROIBIDO usar: "doravante", "outrossim", "nos termos do art.", "inciso", "parágrafo único".
ESTRUTURA: no máximo 6 seções com títulos simples (## DAS PARTES, ## OBJETO, ## PAGAMENTO, ## PRAZO, ## RESCISÃO, ## VALIDADE). Sem subparágrafos.
DEVE INCLUIR APENAS: quem são as partes, o que será feito, quanto e quando paga, prazo de entrega, o que acontece se cancelar, onde resolver conflito.
NÃO INCLUIR: definição de termos, força maior, sucessão, referências a artigos de lei, cláusulas de vínculo empregatício com linguagem técnica.`,

    "executivo": `MODELO: Executivo
EXTENSÃO OBRIGATÓRIA: 380 a 550 palavras.
TOM: formal, direto e objetivo — adequado para relações B2B e contratos recorrentes.
ESTRUTURA: cláusulas compactas em parágrafos corridos, sem subincisos. Máximo 8 seções.
DEVE INCLUIR: objeto com entregáveis específicos, cronograma de pagamento, SLA/prazo, confidencialidade, rescisão com aviso prévio, foro.
NÃO INCLUIR: definições longas, força maior genérica, sucessão, citações extensas de legislação.`,

    "minimalista": `MODELO: Minimalista
EXTENSÃO OBRIGATÓRIA: 120 a 200 palavras. SE ULTRAPASSAR 200 PALAVRAS, CORTE SEM EXCEÇÃO.
TOM: linguagem do dia a dia, como um combinado formal entre pessoas. PROIBIDO qualquer jargão jurídico.
ESTRUTURA: 4 blocos simples sem numeração: QUEM, O QUÊ, PAGAMENTO, REGRAS BÁSICAS.
DEVE INCLUIR APENAS: nomes das partes, descrição simples do serviço, valor e data de pagamento, o que acontece se um lado desistir.
NÃO INCLUIR: LGPD, força maior, vínculo empregatício, cessão, artigos de lei, citações legais, subcláusulas.`,
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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOCO DE ASSINATURAS — REGRA ABSOLUTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Modo selecionado: ${formulario.modoAssinatura}

${formulario.modoAssinatura === "fisica_com_testemunhas"
  ? `Incluir EXATAMENTE este bloco ao final:
CONTRATANTE: ________________________________
CONTRATADO: _________________________________
TESTEMUNHA 1: _______________________________
TESTEMUNHA 2: _______________________________`
  : formulario.modoAssinatura === "fisica_sem_testemunhas"
  ? `Incluir EXATAMENTE este bloco ao final — SEM testemunhas:
CONTRATANTE: ________________________________
CONTRATADO: _________________________________`
  : `Incluir EXATAMENTE este bloco ao final — sem linhas de assinatura física:
Aceite eletrônico registrado por link com validade jurídica (MP 2.200-2/2001 e CPC art. 784).`
}
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
