import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { contratoId } = body;
    
    if (!contratoId) {
      return NextResponse.json({ error: "Falta contratoId" }, { status: 400 });
    }

    // 1. Verificar cota disponível
    const { data: perfil } = await supabase
      .from('perfis')
      .select('contratos_mes, contratos_usados_mes')
      .eq('user_id', user.id)
      .single();

    if (!perfil) {
      return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
    }

    const cotaDisponivel = perfil.contratos_mes - perfil.contratos_usados_mes;
    if (cotaDisponivel <= 0) {
      return NextResponse.json({ error: "Cota excedida", redirect: "/planos" }, { status: 403 });
    }

    // 2. Extrair o contrato original
    const { data: original, error: origError } = await supabase
      .from('contratos')
      .select('*')
      .eq('id', contratoId)
      .eq('usuario_id', user.id)
      .single();

    if (origError || !original) {
      return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
    }

    // 3. Gerar número de referência sequencial por usuário
    const { count } = await supabase
      .from('contratos')
      .select('*', { count: 'exact', head: true })
      .eq('usuario_id', user.id);

    const ano = new Date().getFullYear();
    const sequencial = String((count || 0) + 1).padStart(3, '0');
    const novaReferencia = `CF-${ano}-${sequencial}`;

    // 4. Clonar e Limpar Status e Meta
    const { id, conteudo, status, criado_em, atualizado_em, imutavel, downloads_count, referencia, ...rest } = original;

    const payload = {
      ...rest,
      id: crypto.randomUUID(),
      referencia: novaReferencia,
      status: 'rascunho',
      conteudo: '',           // o rascunho nasce sem conteúdo formatado final
      imutavel: false,
      downloads_count: 0
    };

    const { data: novoContrato, error: insertError } = await supabase
      .from('contratos')
      .insert([payload])
      .select('id')
      .single();

    if (insertError) {
      console.error("[duplicar-contrato] Update error:", insertError.message);
      return NextResponse.json({ error: "Falha ao criar o rascunho cópia" }, { status: 500 });
    }

    // 5. Incrementar Cota
    await supabase
      .from('perfis')
      .update({ contratos_usados_mes: perfil.contratos_usados_mes + 1 })
      .eq('user_id', user.id);

    return NextResponse.json({ novoId: novoContrato.id });
    
  } catch (error) {
    console.error("[duplicar-contrato] Catch Interno:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
