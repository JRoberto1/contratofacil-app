import { NextRequest, NextResponse } from "next/server";
import { gerarContrato } from "@/lib/groq";

// Configura o limite de timeout na Vercel para 60 segundos (limite do Hobby plan)
export const maxDuration = 60;
import type { FormularioContrato, TipoContrato } from "@/types/contrato";

const labelTipo: Record<TipoContrato, string> = {
  "completo-formal": "completo e formal (linguagem jurídica técnica, todas as cláusulas)",
  "resumido-formal": "resumido e formal (linguagem jurídica objetiva, cláusulas essenciais)",
  "completo-dia-a-dia": "completo e em linguagem simples (fácil de entender, todas as cláusulas)",
  "resumido-dia-a-dia": "resumido e em linguagem simples (direto ao ponto, cláusulas principais)",
};

const labelCategoria: Record<string, string> = {
  fotografo: "Fotógrafo",
  videomaker: "Videomaker",
  "designer-grafico": "Designer Gráfico",
  "desenvolvedor-web": "Desenvolvedor Web",
  "social-media": "Social Media",
  redator: "Redator",
  ilustrador: "Ilustrador",
  "motion-designer": "Motion Designer",
  "editor-de-video": "Editor de Vídeo",
  outros: "Prestador de Serviços",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formulario, tipo } = body as {
      formulario: FormularioContrato;
      tipo: TipoContrato;
    };

    if (!formulario || !tipo) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    const categoria =
      formulario.categoria === "outros" && formulario.categoriaCustom
        ? formulario.categoriaCustom
        : labelCategoria[formulario.categoria] ?? "Prestador de Serviços";

    const dataAtual = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date());

const systemPrompt = `Você é um especialista jurídico brasileiro processando a geração de um contrato.

Gere um contrato ${labelTipo[tipo]} para a categoria/modelo "${categoria}".

REGRAS OBRIGATÓRIAS E INEGOCIÁVEIS (Aplicáveis a QUALQUER modelo ou categoria gerada):
- Estrutura clara e bem dividida em cláusulas numeradas.
- Inclua cabeçalho apropriado para o contrato e a seção "DAS PARTES" contendo os dados do CONTRATANTE e CONTRATADO.
- FORO OBRIGATÓRIO: A cláusula de Eleição de Foro deve sempre ser preenchida com a cidade e estado do CONTRATADO, no seguinte formato exato: "Fica eleito o Foro da Comarca de [Cidade do Contratado], Estado de [Estado do Contratado por extenso]".
- ESTRUTURAÇÃO DO OBJETO: Avalie o texto do objeto e estruture-o de forma lógica em sub-itens ao longo da cláusula. Não copie o texto passivo do usuário, crie blocos detalhados e estruturados de acordo com o modelo (ex: entregáveis, limitações, revisões inclusas, conforme aplicável à categoria gerada).
- MULTA RESCISÓRIA: Se a categoria ou modelo comportar rescisão, inclua uma cláusula de rescisão (cancelamento) aplicando exatamente os percentuais para ambas as partes informados nos dados.
- ASSINATURAS (Data e Local Automáticos): O bloco de assinaturas DEVE conter a data informada abaixo preenchida automaticamente e o local DEVE ser a cidade do contratado (ex: "São Paulo, 16 de Abril de 2026"). Não deixe linhas em branco ou dados para preenchimento posterior. Deixe os devidos espaços para rubricas/assinaturas do CONTRATANTE, CONTRATADO e por padrão 2 Testemunhas.
- PROIBIDO: É ESTRITAMENTE PROIBIDO o uso da expressão "irrevogável e irretratável" ou similares em qualquer parte do documento (principalmente Disposições Finais), pois entram em contradição lógica com qualquer cláusula rescisória.
- Embasamento legal com a LGPD (Lei Geral de Proteção de Dados).
- Use sempre "CONTRATANTE" para o cliente e "CONTRATADO" para o prestador.
- Responda APENAS com o texto do contrato final e formatado, sem comentários adicionais.
`;

    const userPrompt = `Gere o contrato com os seguintes dados:

CONTRATADO (Prestador):
- Nome: ${formulario.prestador.nomeCompleto}
- CPF/CNPJ: ${formulario.prestador.cpfCnpj}
- Sede: ${formulario.prestador.cidade} - ${formulario.prestador.estado}
${formulario.prestador.email ? `- Email: ${formulario.prestador.email}\n` : ""}
CONTRATANTE (Cliente):
- Nome: ${formulario.cliente.nomeRazaoSocial}
- CPF/CNPJ: ${formulario.cliente.cpfCnpj}
- Sede: ${formulario.cliente.cidade} - ${formulario.cliente.estado}
${formulario.cliente.email ? `- Email: ${formulario.cliente.email}\n` : ""}
SERVIÇO/OBJETO:
- Descrição: ${formulario.servico.descricao}
- Valor: R$ ${formulario.servico.valor}
- Prazo de entrega/vigência: ${formulario.servico.prazoEntrega}
- Forma de pagamento: ${formulario.servico.formaPagamento}
${formulario.servico.localPrestacao ? `- Local de Prestação: ${formulario.servico.localPrestacao}\n` : ""}${formulario.servico.formaEntrega ? `- Forma de Entrega: ${formulario.servico.formaEntrega}\n` : ""}${formulario.servico.clausulasEspeciais ? `- Cláusulas Especiais/Observações: ${formulario.servico.clausulasEspeciais}\n\nATENÇÃO: Inclua e formalize essas Cláusulas Especiais de forma adequada no contrato.\n` : ""}
RESCISÃO:
- Multa se Contratante rescindir: ${formulario.servico.multaContratante || "20"}%
- Multa se Contratado rescindir: ${formulario.servico.multaContratado || "20"}%

DADOS DE GERAÇÃO E FECHAMENTO:
- Data da Assinatura: ${dataAtual}
- Local da Assinatura: ${formulario.prestador.cidade} - ${formulario.prestador.estado}
`;

    const conteudo = await gerarContrato(systemPrompt, userPrompt);

    return NextResponse.json({ conteudo });
  } catch (error: any) {
    console.error("[gerar-contrato]", error);
    return NextResponse.json(
      { error: `Erro na API: ${error.message}` },
      { status: 500 }
    );
  }
}
