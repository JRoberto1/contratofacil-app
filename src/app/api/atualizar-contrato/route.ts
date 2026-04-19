import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AtualizarContratoSchema } from "@/lib/schemas";
import { ok, err, fromZodError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return err("UNAUTHORIZED", "Não autorizado.", 401);
    }

    const body = await req.json();
    const parsed = AtualizarContratoSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const { contratoId, conteudo, tipo } = parsed.data;

    const { data: atual, error: fetchError } = await supabase
      .from('contratos')
      .select('downloads_count, status')
      .eq('id', contratoId)
      .eq('usuario_id', user.id)
      .single();

    if (fetchError || !atual) {
      return err("NOT_FOUND", "Contrato não encontrado.", 404);
    }

    const novoCount = (atual.downloads_count || 0) + 1;
    const payloadCompleto: Record<string, unknown> = { downloads_count: novoCount };
    if (atual.status === 'rascunho') payloadCompleto.status = 'concluido';
    if (conteudo !== undefined) payloadCompleto.conteudo = conteudo;
    if (tipo !== undefined) payloadCompleto.tipo = tipo;

    const { error: errCompleto } = await supabase
      .from('contratos')
      .update(payloadCompleto)
      .eq('id', contratoId)
      .eq('usuario_id', user.id);

    if (!errCompleto) return ok({ ok: true });

    // Fallback: só downloads_count se o update completo falhou
    console.warn("[atualizar-contrato] Fallback downloads_count:", errCompleto.message);
    const payloadSafe: Record<string, unknown> = { downloads_count: novoCount };
    if (conteudo !== undefined) payloadSafe.conteudo = conteudo;
    if (tipo !== undefined) payloadSafe.tipo = tipo;

    const { error: errSafe } = await supabase
      .from('contratos')
      .update(payloadSafe)
      .eq('id', contratoId)
      .eq('usuario_id', user.id);

    if (errSafe) {
      console.error("[atualizar-contrato] Erro fallback:", errSafe.message);
      return err("DB_ERROR", `Falha ao atualizar contrato: ${errSafe.message}`, 500);
    }

    return ok({ ok: true });
  } catch (error: unknown) {
    console.error("[atualizar-contrato]", error);
    return err("INTERNAL_ERROR", "Erro interno.", 500);
  }
}
