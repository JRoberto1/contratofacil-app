import { categorias, CategoriaSlug } from "@/lib/categorias";
import type { FormularioContrato, TipoContrato } from "@/types/contrato";

export function prepararPrompt(formulario: FormularioContrato, tipoContrato: TipoContrato) {
  // Configs padrão
  const categoriaInfo = categorias[(formulario.categoria as CategoriaSlug)] || categorias['other'];
  
  // Base legal - Dinâmica de Juros e Multas
  const penalidadeAtraso = formulario.servico.jurosAtraso
    ? `Em caso de atraso no pagamento, incidirá juros moratórios de ${formulario.servico.jurosAtraso}.`
    : "";
    
  const quebraRescisao = formulario.servico.multaRescisao
    ? `O contrato prescreve cláusula penal correspondente a ${formulario.servico.multaRescisao}% do valor global em caso de rescisão imotivada por qualquer das partes.`
    : "";

  const instrucoesFinanceiras = (penalidadeAtraso || quebraRescisao) 
    ? `\n- MULTAS E JUROS AUTORIZADOS: ${penalidadeAtraso} ${quebraRescisao}`
    : `\n- MULTAS E JUROS: NÃO FOI autorizada nenhuma cláusula de multa por atraso, juros ou cláusula penal. O contrato NÃO deve conter nenhuma estipulação financeira punitiva.`;
  
  // Transformando os campos extras numa string
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

  const diretrizTamanho = tipoContrato.includes("resumido") 
    ? "O contrato deve ser enxuto, direto e condensado, limitando-se ao essencial (1 a 2 páginas). Use linguagem clara."
    : "O contrato deve ser abrangente, exaustivo e longo, cobrindo com detalhes minúcias jurídicas padrão, definição de termos, multas, casos fortuitos, sucessão e legislação aplicável (cerca de 3 a 5 páginas).";

const systemPrompt = `
Você é um advogado brasileiro experiente, especialista em Direito Civil e Contratual. Seu papel é atuar como o motor gerador de contratos do ContratoFácil.

OBJETIVO DA MISSÃO: 
Você receberá os dados extraídos de um formulário preenchido por um prestador de serviço autônomo (ou MEI) no Brasil. Sua tarefa é redigir UM CONTRATO DE PRESTAÇÃO DE SERVIÇOS juridicamente estruturado, seguro, protegendo o prestador, sem alucinar dados financeiros ou pessoais.

REGRAS DE INVENÇÃO ZERO — NUNCA VIOLAR:
1. MULTAS E JUROS: Nunca incluir percentuais de multa por atraso, juros moratórios ou cláusula penal que o usuário não tenha informado explicitamente. 
   - Nunca usar valores padrão como "2%", "1% ao mês", "20%" se não foram expressamente autorizados em "MULTAS E JUROS AUTORIZADOS".
2. DATAS ESPECÍFICAS: Nunca inventar datas de vencimento, prazos intermediários ou marcos que o usuário não definiu.
3. ENDEREÇOS: Nunca completar endereços. Usar exatamente a cidade e estado informados.
4. OBRIGAÇÕES EXTRAS: Nunca adicionar obrigações além das descritas na categoria ou pelo usuário.
5. VALORES DERIVADOS: Nunca calcular ou inventar valores parciais, honorários adicionais ou custos extras não informados.
TESTE ANTES DE GERAR: Para cada cláusula com número ou percentual, pergunte a si mesmo: "o usuário ou sistema informaram esse valor?" Se não, remova.

FORMATO E DIRETRIZES TÉCNICAS:
- ${diretrizTamanho}
- Categoria do negócio: ${categoriaInfo.title}
FORMATO DE SAÍDA:
- Use # apenas para o título principal do contrato
- Use ## para cada seção principal (DAS PARTES, DO OBJETO, etc.)
- Use ### apenas se precisar de subseção
- Use **negrito** para nomes das partes, valores em reais e datas importantes
- Use listas com - para obrigações e sub-itens
- Use tabelas markdown para milestones de pagamento quando houver mais de 2 marcos
- Separe seções principais com ---
- Nunca use markdown decorativo — apenas o necessário para estrutura
- O texto deve ler como um documento jurídico real, não como uma página web
- Utilize as cláusulas listadas a seguir como regras fundamentais inegociáveis para este contrato:
${clausulasEspeciais}

- DADOS DE PAGAMENTO (REGRA ABSOLUTA): A cláusula de remuneração deve ser a TRANSCRIÇÃO JURÍDICA FIEL da "Forma de pagamento" passada pelo usuário. É PROIBIDO CRIAR CONDIÇÕES NÃO MENCIONADAS.${instrucoesFinanceiras}
- O Foro de eleição deverá ser da comarca do Prestador (${formulario.prestador.cidade}/${formulario.prestador.estado}).
- Responda APENAS com o texto do contrato. Não adicione "Aqui está o contrato" nem assine como IA.
`;

  const userPrompt = `
CONTRATANTE: ${formulario.cliente.nomeRazaoSocial}, CPF/CNPJ ${formulario.cliente.cpfCnpj}, com sede em ${formulario.cliente.cidade} - ${formulario.cliente.estado}.

CONTRATADO: ${formulario.prestador.nomeCompleto}, CPF/CNPJ ${formulario.prestador.cpfCnpj}, com domicílio em/sede em ${formulario.prestador.cidade} - ${formulario.prestador.estado}. 

SERVIÇO/OBJETO:
- Categoria/Atuação: ${formulario.categoriaCustom || categoriaInfo.title}
${formulario.servico.numeroPedido ? `- Número do Pedido/Orçamento Relacionado: ${formulario.servico.numeroPedido}\n` : ""}- Descrição Detalhada: ${formulario.servico.descricao}
- Valor Total: R$ ${formulario.servico.valor}
- Prazo de Entrega/Vigência: ${formulario.servico.prazoEntrega}
- **Regras Informadas de Forma de Pagamento e Vencimento**: ${formulario.servico.formaPagamento}
${extrasString}
${formulario.servico.clausulasEspeciais ? `\nADENDOS DO USUÁRIO (Criar Cláusulas para isso):\n- ${formulario.servico.clausulasEspeciais}` : ""}
`;

  return { systemPrompt, userPrompt };
}
