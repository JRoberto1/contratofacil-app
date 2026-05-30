import { NextRequest } from "next/server";
import { createClient as createServerClient } from "@supabase/supabase-js";
import { ok, err } from "@/lib/api-response";

// Service role bypassa RLS — necessário para leitura pública por token
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createServerClient(url, key, { auth: { persistSession: false } });
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return err("VALIDATION_ERROR", "Token obrigatório.", 400);

    const supabase = getAdminClient();

    const { data: contrato, error } = await supabase
      .from("contratos")
      .select("id, referencia, conteudo, prestador_nome, cliente_nome, aceite_status, aceite_em, token_expira_em")
      .eq("token_aceite", token)
      .single();

    if (error || !contrato) {
      return err("NOT_FOUND", "Link inválido ou contrato não encontrado.", 404);
    }

    if (contrato.token_expira_em && new Date(contrato.token_expira_em) < new Date()) {
      return err("EXPIRED", "Este link de aceite expirou.", 410);
    }

    if (contrato.aceite_status === "aceito") {
      return ok({ ...contrato });
    }

    return ok(contrato);
  } catch (error: unknown) {
    console.error("[buscar-contrato-por-token]", error);
    return err("INTERNAL_ERROR", "Erro ao buscar contrato.", 500);
  }
}
