import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api-response";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
  nome: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return err("VALIDATION_ERROR", "Dados inválidos.", 422);

    const { email, nome } = parsed.data;

    if (!process.env.RESEND_API_KEY) {
      // Sem chave configurada — silencioso, não bloqueia o cadastro
      return ok({ enviado: false, motivo: "RESEND_API_KEY não configurada" });
    }

    const { enviarBoasVindas } = await import("@/lib/email");
    await enviarBoasVindas({ para: email, nome: nome ?? email.split("@")[0] });

    return ok({ enviado: true });
  } catch (error: unknown) {
    // Fire-and-forget no cliente — loga mas não retorna 500
    console.error("[boas-vindas]", error);
    return ok({ enviado: false });
  }
}
