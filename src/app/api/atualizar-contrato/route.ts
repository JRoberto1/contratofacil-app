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

    const { data: atual, error: fetchError } = await supabase
      .from('contratos')
      .select('downloads_count, status')
      .eq('id', contratoId)
      .eq('usuario_id', user.id)
      .single();

    if (fetchError || !atual) {
      return NextResponse.json({ error: "Contrato não encontrado." }, { status: 404 });
    }

    const novoCount = (atual.downloads_count || 0) + 1;

    // Tenta incrementar downloads E promover status rascunho→gerado
    const payloadCompleto: Record<string, unknown> = { downloads_count: novoCount };
    if (atual.status === 'rascunho') payloadCompleto.status = 'gerado';
    if (conteudo !== undefined) payloadCompleto.conteudo = conteudo;
    if (tipo !== undefined) payloadCompleto.tipo = tipo;

    const { error: errCompleto } = await supabase
      .from('contratos')
      .update(payloadCompleto)
      .eq('id', contratoId)
      .eq('usuario_id', user.id);

    if (!errCompleto) {
      return NextResponse.json({ ok: true });
    }

    // Se falhou (trigger antigo), faz só o downloads_count para não quebrar o download
    console.warn("[atualizar-contrato] Falha ao atualizar status, tentando só downloads_count:", errCompleto.message);
    const payloadSafe: Record<string, unknown> = { downloads_count: novoCount };
    if (conteudo !== undefined) payloadSafe.conteudo = conteudo;
    if (tipo !== undefined) payloadSafe.tipo = tipo;

    const { error: errSafe } = await supabase
      .from('contratos')
      .update(payloadSafe)
      .eq('id', contratoId)
      .eq('usuario_id', user.id);

    if (errSafe) {
      console.error("[atualizar-contrato] Erro fallback:", errSafe);
      return NextResponse.json({ error: `Falha ao atualizar contrato: ${errSafe.message}` }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[atualizar-contrato] Interno:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
