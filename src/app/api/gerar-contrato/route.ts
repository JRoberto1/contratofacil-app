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

    const systemPrompt = `Você é um especialista jurídico brasileiro especializado em contratos de prestação de serviços para MEIs e autônomos.

Gere um contrato ${labelTipo[tipo]} para a categoria "${categoria}".

REGRAS OBRIGATÓRIAS:
- Inclua cabeçalho "CONTRATO DE PRESTAÇÃO DE SERVIÇOS"
- Inclua data, local (a definir pelas partes) e número fictício de referência
- Inclua cláusulas: objeto, obrigações, valor e pagamento, prazo, propriedade intelectual (quando aplicável), rescisão, LGPD, foro
- Inclua campos de assinatura para ambas as partes ao final
- Use sempre "CONTRATANTE" para o cliente e "CONTRATADO" para o prestador
- Responda APENAS com o texto do contrato, sem explicações ou comentários extras`;

    const userPrompt = `Gere o contrato com os seguintes dados:

CONTRATADO (Prestador):
- Nome: ${formulario.prestador.nomeCompleto}
- CPF/CNPJ: ${formulario.prestador.cpfCnpj}

CONTRATANTE (Cliente):
- Nome: ${formulario.cliente.nomeRazaoSocial}
- CPF/CNPJ: ${formulario.cliente.cpfCnpj}

SERVIÇO:
- Descrição: ${formulario.servico.descricao}
- Valor: R$ ${formulario.servico.valor.toFixed(2).replace(".", ",")}
- Prazo: ${formulario.servico.prazoEntrega}
- Forma de pagamento: ${formulario.servico.formaPagamento}
${formulario.servico.clausulasEspeciais ? `- Cláusulas Especiais/Observações: ${formulario.servico.clausulasEspeciais}\n\nATENÇÃO: Inclua as Cláusulas Especiais/Observações descritas acima na íntegra no contrato aplicável a essa prestação.` : ""}`;

    const conteudo = await gerarContrato(systemPrompt, userPrompt);

    return NextResponse.json({ conteudo });
  } catch (error) {
    console.error("[gerar-contrato]", error);
    return NextResponse.json(
      { error: "Não foi possível gerar o contrato. Tente novamente." },
      { status: 500 }
    );
  }
}
