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

    const modoAssinatura = formulario?.modoAssinatura;

    if (!formulario || !tipo || !modoAssinatura) {
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
    const localAssinatura = `${formulario.prestador.cidade}, ${dataAtual}`;

    const clausulaMulta = formulario.servico.multaRescisao
      ? `- DA RESCISÃO: Em caso de rescisão por qualquer das partes, será aplicada multa de ${formulario.servico.multaRescisao}% sobre o valor total do contrato.`
      : `- DA RESCISÃO: O presente contrato poderá ser rescindido por qualquer das partes mediante notificação por escrito com antecedência mínima de 5 (cinco) dias, sem aplicação de multa.`;

    let clausulaAssinatura = "";
    if (modoAssinatura === "eletronica") {
      clausulaAssinatura = `- MODO DE ASSINATURA: O documento gerado não terá campos físicos para assinatura/testemunhas. Ao final, inclua ESTRITAMENTE: "Este contrato será aceito eletronicamente pelas partes mediante link de confirmação enviado para os e-mails cadastrados, com validade jurídica conforme Art. 10 da MP 2.200-2/2001."`;
    } else if (modoAssinatura === "fisica_sem_testemunhas") {
      clausulaAssinatura = `- MODO DE ASSINATURA: Inclua campos para assinatura física apenas do CONTRATANTE e do CONTRATADO. Dispensam-se testemunhas.`;
    } else {
      clausulaAssinatura = `- MODO DE ASSINATURA: Inclua campos para assinatura física do CONTRATANTE, do CONTRATADO e obrigatoriamente 2 (duas) TESTEMUNHAS.`;
    }

    const categoriasCriativas = ["fotografo", "videomaker", "designer-grafico", "desenvolvedor-web", "social-media", "redator", "ilustrador", "motion-designer", "editor-de-video"];
    const isCriativo = categoriasCriativas.includes(formulario.categoria);

    const instrucaoPropriedadeIntelectual = isCriativo 
      ? `\n- PROPRIEDADE INTELECTUAL: Como se trata de serviço criativo, inclua obrigatoriamente a cláusula de cessão de direitos: "Os direitos patrimoniais sobre o material produzido serão cedidos ao CONTRATANTE após a quitação integral. O CONTRATADO mantém o direito de exibir o trabalho em portfólio, salvo acordo em contrário por escrito."`
      : "";

const systemPrompt = `Você é um especialista jurídico brasileiro processando a geração de um contrato.

Gere um contrato ${labelTipo[tipo]} para a categoria/modelo "${categoria}".

REGRAS OBRIGATÓRIAS E INEGOCIÁVEIS:
- Estrutura clara e bem dividida em cláusulas numeradas.
- INÍCIO DO CONTRATO: Qualifique as partes corretamente usando os dados informados de CONTRATANTE e CONTRATADO. Se não possuir o campo email, omita-o.
- FORO OBRIGATÓRIO: A cláusula de Eleição de Foro deve ser redigida no exato formato: "Foro da Comarca de ${formulario.prestador.cidade}, Estado de ${formulario.prestador.estado}".
- ESTRUTURAÇÃO DO OBJETO: Avalie o texto da descrição do serviço para dividir de forma lógica em sub-itens (ex: O que será entregue, Em qual formato, Quantas revisões, etc). Nunca copie o texto bruto fornecido pelo usuário, trabalhe a redação em formato contratual coerente.
- PAGAMENTO PARCELADO E PRAZO: Na cláusula de pagamento, se a forma de pagamento revelar parcelas, escreva os percentuais e momentos exatos de forma extensa. Se não houver previsão clara de prazo de quitação final, inclua a diretriz genérica: "O pagamento deverá ser efetuado em até 2 (dois) dias úteis após a entrega do serviço."
${clausulaMulta}
${instrucaoPropriedadeIntelectual}
- DATA E LOCAL: Você deve obrigatoriamente informar a data e local do fechamento usando: "${localAssinatura}". Nunca use sublinhados (_) ou campos vazios no local e data.
${clausulaAssinatura}
- PROIBIDO: É ESTRITAMENTE PROIBIDO o uso da expressão "irrevogável e irretratável" ou similares em qualquer parte do documento, pois entram em contradição com cláusulas rescisórias.
- Embasamento legal com a LGPD.
- Responda APENAS com o texto do contrato final e formatado, sem comentários adicionais (em markdown).
`;

    const userPrompt = `CONTRATANTE: ${formulario.cliente.nomeRazaoSocial}, CPF/CNPJ ${formulario.cliente.cpfCnpj}, com sede em ${formulario.cliente.cidade} - ${formulario.cliente.estado}.${formulario.cliente.email ? ` E-mail: ${formulario.cliente.email}` : ""}

CONTRATADO: ${formulario.prestador.nomeCompleto}, CPF/CNPJ ${formulario.prestador.cpfCnpj}, com sede em ${formulario.prestador.cidade} - ${formulario.prestador.estado}.${formulario.prestador.email ? ` E-mail: ${formulario.prestador.email}` : ""}

SERVIÇO/OBJETO:
- Descrição: ${formulario.servico.descricao}
- Valor: R$ ${formulario.servico.valor}
- Prazo de entrega/vigência: ${formulario.servico.prazoEntrega}
- Forma de pagamento: ${formulario.servico.formaPagamento}
${formulario.servico.localPrestacao ? `- Local de Prestação: ${formulario.servico.localPrestacao}\n` : ""}${formulario.servico.formaEntrega ? `- Forma de Entrega: ${formulario.servico.formaEntrega}\n` : ""}${formulario.servico.clausulasEspeciais ? `- Cláusulas Especiais/Observações (ATENÇÃO, FORME CLÁUSULAS A PARTIR DISSO): ${formulario.servico.clausulasEspeciais}\n` : ""}
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
