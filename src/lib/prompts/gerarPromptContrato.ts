import { categorias, CategoriaSlug } from "@/lib/categorias";
import type { FormularioContrato, TipoContrato } from "@/types/contrato";

export function prepararPrompt(formulario: FormularioContrato, tipoContrato: TipoContrato) {
  // Configs padrão
  const categoriaInfo = categorias[(formulario.categoria as CategoriaSlug)] || categorias['other'];
  
  // Base legal
  const penalidadeAtraso = formulario.servico.formaPagamento === "A Combinar" 
    ? "" 
    : "Em caso de atraso superior a 5 dias corridos no pagamento de qualquer parcela, incidirá multa não-compensatória de 2% (dois por cento) sobre o valor total do contrato, além de juros moratórios de 1% (um por cento) ao mês pro rata die.";
    
  const quebraRescisao = "O contrato prescreve cláusula penal correspondente a 20% do valor global em caso de rescisão imotivada por qualquer das partes, sem prejuízo da cobrança de serviços já realizados.";
  
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

FORMATO E DIRETRIZES TÉCNICAS:
- ${diretrizTamanho}
- Categoria do negócio: ${categoriaInfo.title}
- Escreva usando "CLÁUSULA PRIMEIRA", "CLÁUSULA SEGUNDA" e não em markdown de títulos. USE APENAS TEXTO CORRIDO SEM MARKDOWN. Sem asteriscos (**), sem hashtags (#). 
- Utilize as cláusulas listadas a seguir como regras fundamentais inegociáveis para este contrato:
${clausulasEspeciais}

- DADOS DE PAGAMENTO (REGRA ABSOLUTA): A cláusula de remuneração deve ser a TRANSCRIÇÃO JURÍDICA FIEL da "Forma de pagamento" passada pelo usuário. É PROIBIDO CRIAR CONDIÇÕES NÃO MENCIONADAS.
- MULTAS (Se não isento pelo usuário): ${penalidadeAtraso} ${quebraRescisao}
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
