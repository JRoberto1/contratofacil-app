import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SalvarContratoSchema } from "@/lib/schemas";
import { ok, err, fromZodError } from "@/lib/api-response";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return err("UNAUTHORIZED", "Não autorizado.", 401);
    }

    const body = await req.json();
    const parsed = SalvarContratoSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const { formulario, tipo, conteudo, status_override } = parsed.data;

    // Converte valor BR ("1.500,00") → centavos inteiros (150000)
    const valorDecimal = parseFloat(
      String(formulario.servico.valor).replace(/\./g, '').replace(',', '.')
    );
    const valorCentavos = isNaN(valorDecimal) ? 0 : Math.round(valorDecimal * 100);

    // Gera referência única CF-{ano}-{seq}
    const { count } = await supabase
      .from('contratos')
      .select('*', { count: 'exact', head: true })
      .eq('usuario_id', user.id);
    const ano = new Date().getFullYear();
    const sequencial = String((count || 0) + 1).padStart(3, '0');
    const referencia = `CF-${ano}-${sequencial}`;

    const payload = {
      usuario_id: user.id,
      categoria: formulario.categoria,
      categoria_custom: formulario.categoriaCustom || null,
      prestador_nome: formulario.prestador.nomeCompleto,
      prestador_doc: formulario.prestador.cpfCnpj,
      cliente_nome: formulario.cliente.nomeRazaoSocial,
      cliente_doc: formulario.cliente.cpfCnpj,
      cliente_email: formulario.cliente.email || null,
      servico_descricao: formulario.servico.descricao,
      servico_valor: valorCentavos,
      servico_prazo: formulario.servico.prazoEntrega,
      servico_pagamento: formulario.servico.formaPagamento,
      tipo,
      conteudo: conteudo || '',
      status: status_override || 'rascunho',
      referencia,
    };

    const { data, error } = await supabase
      .from('contratos')
      .insert([payload])
      .select('id')
      .single();

    if (error) {
      console.error("[salvar-contrato]", error.message, error.code, error.details);
      return err("DB_ERROR", `Falha ao gravar: ${error.message}`, 500);
    }

    return ok({ id: data.id }, 201);
  } catch (error: unknown) {
    if (error instanceof ZodError) return fromZodError(error);
    console.error("[salvar-contrato]", error);
    return err("INTERNAL_ERROR", "Ocorreu um erro ao salvar o contrato.", 500);
  }
}
