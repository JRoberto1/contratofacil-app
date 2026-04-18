import { NextRequest, NextResponse } from "next/server";
import { gerarContrato } from "@/lib/groq";
import { createClient } from "@/lib/supabase/server";

// Configura o limite de timeout na Vercel para 60 segundos (limite do Hobby plan)
export const maxDuration = 60;
import type { FormularioContrato, TipoContrato } from "@/types/contrato";
import { prepararPrompt } from "@/lib/prompts/gerarPromptContrato";

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

function validarContrato(conteudo: string, form: FormularioContrato): string[] {
  const alertas: string[] = [];

  const percentuais = conteudo.match(/\d+%/g) || [];
  const autorizados = [
    form.servico.multaRescisao ? `${form.servico.multaRescisao}%` : null,
    form.servico.formaPagamentoDetalhes?.percentualEntrada ? `${form.servico.formaPagamentoDetalhes.percentualEntrada}%` : null,
  ].filter(Boolean);

  percentuais.forEach(p => {
    if (!autorizados.includes(p)) {
      alertas.push(`Percentual não autorizado encontrado: ${p}`);
    }
  });

  if (conteudo.toLowerCase().includes('juros') && !form.servico.jurosAtraso) {
    alertas.push('Cláusula de juros possivelmente gerada sem autorização');
  }

  if (conteudo.toLowerCase().includes('cláusula penal') && !form.servico.multaRescisao) {
    alertas.push('Cláusula penal possivelmente gerada sem autorização');
  }

  return alertas;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formulario, tipo, contratoId } = body as {
      formulario: FormularioContrato;
      tipo: TipoContrato;
      contratoId?: string;
    };

    const modoAssinatura = formulario?.modoAssinatura;

    if (!formulario || !tipo) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    const { systemPrompt, userPrompt } = prepararPrompt(formulario, tipo);

    const conteudo = await gerarContrato(systemPrompt, userPrompt);
    const alertas = validarContrato(conteudo, formulario);

    if (contratoId) {
      const supabase = await createClient();
      
      if (alertas.length > 0) {
        await supabase.from('logs_qualidade').insert({
          contrato_id: contratoId,
          alertas,
          timestamp: new Date().toISOString()
        }).then(({ error }) => {
          if (error) console.error("[supabase] logs_qualidade faltante ou erro:", error.message);
        });
      }

      await supabase
        .from('contratos')
        .update({ conteudo })
        .eq('id', contratoId);
    }

    return NextResponse.json({ conteudo });
  } catch (error: any) {
    console.error("[gerar-contrato]", error);
    return NextResponse.json(
      { error: `Erro na API: ${error.message}` },
      { status: 500 }
    );
  }
}
