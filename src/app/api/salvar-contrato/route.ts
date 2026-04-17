import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { FormularioContrato, TipoContrato } from "@/types/contrato";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Validar usuário autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { formulario, tipo, conteudo, status_override } = body as {
      formulario: FormularioContrato;
      tipo: TipoContrato;
      conteudo?: string;
      status_override?: string;
    };

    if (!formulario || !tipo) {
      return NextResponse.json(
        { error: "Dados incompletos para salvar o contrato." },
        { status: 400 }
      );
    }

    // Preparar dados para inserção no banco de dados baseado no schema
    const payload = {
      usuario_id: user.id,
      categoria: formulario.categoria,
      categoria_custom: formulario.categoriaCustom || null,
      prestador_nome: formulario.prestador.nomeCompleto,
      prestador_doc: formulario.prestador.cpfCnpj,
      cliente_nome: formulario.cliente.nomeRazaoSocial,
      cliente_doc: formulario.cliente.cpfCnpj,
      servico_descricao: formulario.servico.descricao,
      servico_valor: formulario.servico.valor,
      servico_prazo: formulario.servico.prazoEntrega,
      servico_pagamento: formulario.servico.formaPagamento,
      tipo: tipo,
      conteudo: conteudo || '',
      status: status_override || 'rascunho'
    };

    const { data, error } = await supabase
      .from('contratos')
      .insert([payload])
      .select('id')
      .single();

    if (error) {
      console.error("[salvar-contrato] Banco de dados:", error);
      return NextResponse.json(
        { error: "Falha ao gravar contrato no banco de dados." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("[salvar-contrato] Interno:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao salvar o contrato." },
      { status: 500 }
    );
  }
}
