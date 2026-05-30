import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, err } from "@/lib/api-response";
import { z } from "zod";
import { randomUUID } from "crypto";

const Schema = z.object({
  contratoId: z.string().uuid(),
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://contratofacil-app.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return err("UNAUTHORIZED", "Não autorizado.", 401);

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return err("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Dados inválidos", 422);

    const { contratoId } = parsed.data;

    // Verifica que o contrato pertence ao usuário
    const { data: contrato, error: fetchError } = await supabase
      .from("contratos")
      .select("id, modo_assinatura")
      .eq("id", contratoId)
      .eq("usuario_id", user.id)
      .single();

    if (fetchError || !contrato) {
      return err("NOT_FOUND", "Contrato não encontrado.", 404);
    }

    // Gera novo token e nova expiração de 30 dias
    const novoToken = randomUUID();
    const novaExpiracao = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error: updateError } = await supabase
      .from("contratos")
      .update({
        token_aceite:    novoToken,
        token_expira_em: novaExpiracao,
        aceite_status:   "pendente",
      })
      .eq("id", contratoId)
      .eq("usuario_id", user.id);

    if (updateError) {
      return err("DB_ERROR", "Erro ao gerar o link. Tente novamente.", 500);
    }

    return ok({ link: `${APP_URL}/aceite/${novoToken}` });
  } catch (error: unknown) {
    console.error("[gerar-link-aceite]", error);
    return err("INTERNAL_ERROR", "Erro interno ao gerar link.", 500);
  }
}
