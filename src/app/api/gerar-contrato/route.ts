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

    if (contratoId) {
      const supabase = await createClient();
      await supabase
        .from('contratos')
        .update({ conteudo, status: 'rascunho' })
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
