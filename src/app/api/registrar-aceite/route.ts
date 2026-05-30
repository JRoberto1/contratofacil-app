import { NextRequest } from "next/server";
import { createClient as createServerClient } from "@supabase/supabase-js";
import { ok, err } from "@/lib/api-response";
import { z } from "zod";

const Schema = z.object({
  token: z.string().uuid(),
});

// Usa service role para poder fazer UPDATE sem RLS em rota pública
function getAdminClient() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin env vars não configuradas.");
  return createServerClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return err("VALIDATION_ERROR", "Token inválido.", 422);

    const { token } = parsed.data;
    const supabase = getAdminClient();

    // Busca contrato pelo token
    const { data: contrato, error: fetchError } = await supabase
      .from("contratos")
      .select("id, referencia, prestador_nome, cliente_nome, aceite_status, token_expira_em, usuario_id")
      .eq("token_aceite", token)
      .single();

    if (fetchError || !contrato) {
      return err("NOT_FOUND", "Link inválido ou contrato não encontrado.", 404);
    }

    // Token expirado?
    if (contrato.token_expira_em && new Date(contrato.token_expira_em) < new Date()) {
      return err("EXPIRED", "Este link de aceite expirou. Solicite um novo link ao prestador.", 410);
    }

    // Já aceito?
    if (contrato.aceite_status === "aceito") {
      return err("ALREADY_ACCEPTED", "Este contrato já foi aceito.", 409);
    }

    // Captura IP e user-agent
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "IP não disponível";
    const userAgent = req.headers.get("user-agent") ?? "";
    const aceiteEm  = new Date();

    // Registra aceite no banco
    const { error: updateError } = await supabase
      .from("contratos")
      .update({
        aceite_em:         aceiteEm.toISOString(),
        aceite_ip:         ip,
        aceite_user_agent: userAgent,
        aceite_status:     "aceito",
        status:            "enviado",
      })
      .eq("id", contrato.id);

    if (updateError) {
      console.error("[registrar-aceite] update:", updateError.message);
      return err("DB_ERROR", "Erro ao registrar aceite. Tente novamente.", 500);
    }

    // Envia e-mails (sem bloquear a resposta se falhar)
    if (process.env.RESEND_API_KEY) {
      const { enviarNotificacaoAceite, enviarConfirmacaoAceiteCliente } = await import("@/lib/email");

      // E-mail para o prestador — busca o e-mail dele pelo usuario_id
      const { data: perfil } = await supabase
        .from("perfis")
        .select("email")
        .eq("id", contrato.usuario_id)
        .single();

      if (perfil?.email) {
        enviarNotificacaoAceite({
          paraPrestador: perfil.email,
          nomePrestador: contrato.prestador_nome ?? "Prestador",
          nomeCliente:   contrato.cliente_nome   ?? "Cliente",
          referencia:    contrato.referencia,
          aceiteEm,
          ip,
          userAgent,
        }).catch(() => null); // fire-and-forget
      }

      // E-mail para o cliente — busca o email salvo no contrato (campo cliente_email se existir)
      const { data: contratoCompleto } = await supabase
        .from("contratos")
        .select("cliente_email")
        .eq("id", contrato.id)
        .single();

      const emailCliente: string | null = (contratoCompleto as { cliente_email?: string } | null)?.cliente_email ?? null;

      if (emailCliente) {
        enviarConfirmacaoAceiteCliente({
          paraCliente:  emailCliente,
          nomeCliente:  contrato.cliente_nome   ?? "Cliente",
          nomePrestador: contrato.prestador_nome ?? "Prestador",
          referencia:   contrato.referencia,
          aceiteEm,
        }).catch(() => null); // fire-and-forget
      }
    }

    return ok({
      aceite_em:     aceiteEm.toISOString(),
      referencia:    contrato.referencia,
      prestador_nome: contrato.prestador_nome ?? "Prestador",
    });
  } catch (error: unknown) {
    console.error("[registrar-aceite]", error);
    return err("INTERNAL_ERROR", "Erro interno ao registrar aceite.", 500);
  }
}
