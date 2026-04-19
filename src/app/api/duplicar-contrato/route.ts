import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DuplicarContratoSchema } from "@/lib/schemas";
import { ok, err, fromZodError } from "@/lib/api-response";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return err("UNAUTHORIZED", "Não autorizado.", 401);

    const body = await req.json();
    const parsed = DuplicarContratoSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const { contratoId } = parsed.data;

    const { data: perfil } = await supabase
      .from('perfis')
      .select('contratos_mes, contratos_usados_mes')
      .eq('id', user.id)
      .single();

    const cotaDisponivel = perfil
      ? (perfil.contratos_mes ?? 2) - (perfil.contratos_usados_mes || 0)
      : 2;
    if (cotaDisponivel <= 0) {
      return err("QUOTA_EXCEEDED", "Cota de contratos esgotada.", 403);
    }

    const { data: original, error: origError } = await supabase
      .from('contratos')
      .select('*')
      .eq('id', contratoId)
      .eq('usuario_id', user.id)
      .single();

    if (origError || !original) {
      return err("NOT_FOUND", "Contrato não encontrado.", 404);
    }

    const { count } = await supabase
      .from('contratos')
      .select('*', { count: 'exact', head: true })
      .eq('usuario_id', user.id);

    const ano = new Date().getFullYear();
    const sequencial = String((count || 0) + 1).padStart(3, '0');
    const novaReferencia = `CF-${ano}-${sequencial}`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, conteudo: _conteudo, status: _status, criado_em: _c, atualizado_em: _a, imutavel: _i, downloads_count: _d, referencia: _r, ...rest } = original;

    const payload = {
      ...rest,
      id: crypto.randomUUID(),
      referencia: novaReferencia,
      status: 'rascunho',
      conteudo: '',
      imutavel: false,
      downloads_count: 0,
    };

    const { data: novoContrato, error: insertError } = await supabase
      .from('contratos')
      .insert([payload])
      .select('id')
      .single();

    if (insertError) {
      console.error("[duplicar-contrato]", insertError.message);
      return err("DB_ERROR", "Falha ao criar rascunho cópia.", 500);
    }

    await supabase
      .from('perfis')
      .update({ contratos_usados_mes: (perfil?.contratos_usados_mes || 0) + 1 })
      .eq('id', user.id);

    return ok({ novoId: novoContrato.id }, 201);
  } catch (error: unknown) {
    console.error("[duplicar-contrato]", error);
    return err("INTERNAL_ERROR", "Erro interno no servidor.", 500);
  }
}
