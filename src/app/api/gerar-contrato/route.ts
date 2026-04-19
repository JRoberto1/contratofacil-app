import { NextRequest } from "next/server";
import { gerarContrato } from "@/lib/groq";
import { createClient } from "@/lib/supabase/server";
import { GerarContratoSchema } from "@/lib/schemas";
import { ok, err, fromZodError } from "@/lib/api-response";
import type { FormularioContrato, TipoContrato } from "@/types/contrato";
import { prepararPrompt } from "@/lib/prompts/gerarPromptContrato";

export const maxDuration = 60;

function validarContrato(conteudo: string, form: FormularioContrato): string[] {
  const alertas: string[] = [];

  const percentuais = conteudo.match(/\d+%/g) || [];
  const autorizados = [
    form.servico.multaRescisao ? `${form.servico.multaRescisao}%` : null,
    form.servico.formaPagamentoDetalhes?.percentualEntrada
      ? `${form.servico.formaPagamentoDetalhes.percentualEntrada}%`
      : null,
  ].filter(Boolean);

  percentuais.forEach((p) => {
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
    const parsed = GerarContratoSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const { formulario, tipo, contratoId } = parsed.data;

    const { systemPrompt, userPrompt } = prepararPrompt(
      formulario as unknown as FormularioContrato,
      tipo as TipoContrato
    );

    let conteudo: string;
    try {
      conteudo = await gerarContrato(systemPrompt, userPrompt);
    } catch (groqError: unknown) {
      const isTimeout =
        groqError instanceof Error &&
        (groqError.name === 'AbortError' || groqError.message.toLowerCase().includes('timeout'));
      if (isTimeout) {
        return err(
          "GROQ_TIMEOUT",
          "A geração demorou mais de 60s. Tente novamente — contratos complexos podem exigir mais de uma tentativa.",
          504
        );
      }
      throw groqError;
    }

    const alertas = validarContrato(conteudo, formulario as unknown as FormularioContrato);

    if (contratoId) {
      const supabase = await createClient();

      if (alertas.length > 0) {
        await supabase.from('logs_qualidade').insert({
          contrato_id: contratoId,
          alertas,
          timestamp: new Date().toISOString(),
        }).then(({ error }) => {
          if (error) console.error("[supabase] logs_qualidade:", error.message);
        });
      }

      await supabase.from('contratos').update({ conteudo }).eq('id', contratoId);
    }

    return ok({ conteudo });
  } catch (error: unknown) {
    console.error("[gerar-contrato]", error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return err("INTERNAL_ERROR", `Erro na geração: ${msg}`, 500);
  }
}
