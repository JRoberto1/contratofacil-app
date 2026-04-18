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

    // Busca status e downloads_count atuais
    const { data: atual, error: fetchError } = await supabase
      .from('contratos')
      .select('downloads_count, status')
      .eq('id', contratoId)
      .eq('usuario_id', user.id)
      .single();

    if (fetchError || !atual) {
      return NextResponse.json({ error: "Contrato não encontrado." }, { status: 404 });
    }

    const updatePayload: Record<string, unknown> = {
      downloads_count: (atual.downloads_count || 0) + 1,
    };
    if (conteudo !== undefined) updatePayload.conteudo = conteudo;
    if (tipo !== undefined) updatePayload.tipo = tipo;

    const { error: updateError } = await supabase
      .from('contratos')
      .update(updatePayload)
      .eq('id', contratoId)
      .eq('usuario_id', user.id);

    if (updateError) {
      console.error("[atualizar-contrato] Erro:", updateError);
      return NextResponse.json({ error: `Falha ao atualizar contrato: ${updateError.message}` }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[atualizar-contrato] Interno:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
