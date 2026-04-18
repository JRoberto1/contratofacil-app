import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { contratoId, conteudo, tipo } = await req.json();

    if (!contratoId) {
      return NextResponse.json({ error: "ID do contrato é obrigatório." }, { status: 400 });
    }

    // Usa RPC para evitar validação de cache do PostgREST e trigger check_imutavel
    const { data: rpcData, error: rpcError } = await supabase.rpc('registrar_download', {
      p_contrato_id: contratoId,
      p_usuario_id: user.id,
    });

    if (rpcError) {
      console.error("[atualizar-contrato] RPC erro:", rpcError);
      return NextResponse.json({ error: `Falha ao atualizar contrato: ${rpcError.message}` }, { status: 500 });
    }

    if (rpcData?.error === 'not_found') {
      return NextResponse.json({ error: "Contrato não encontrado." }, { status: 404 });
    }

    // Atualiza conteudo/tipo se enviados (edição manual)
    if (conteudo !== undefined || tipo !== undefined) {
      const editPayload: Record<string, unknown> = {};
      if (conteudo !== undefined) editPayload.conteudo = conteudo;
      if (tipo !== undefined) editPayload.tipo = tipo;

      const { error: editError } = await supabase
        .from('contratos')
        .update(editPayload)
        .eq('id', contratoId)
        .eq('usuario_id', user.id);

      if (editError) {
        console.error("[atualizar-contrato] Erro ao atualizar conteudo/tipo:", editError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[atualizar-contrato] Interno:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
