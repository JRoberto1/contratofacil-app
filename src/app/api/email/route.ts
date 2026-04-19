import { NextRequest } from "next/server";
import { enviarBoasVindas, enviarConfirmacaoPagamento } from "@/lib/email";
import { EmailSchema } from "@/lib/schemas";
import { ok, err, fromZodError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_SECRET) {
    return err("UNAUTHORIZED", "Não autorizado.", 401);
  }

  try {
    const body = await req.json();
    const parsed = EmailSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const { tipo, ...dados } = parsed.data as { tipo: string; [key: string]: unknown };

    if (tipo === "boas-vindas") {
      await enviarBoasVindas(dados as Parameters<typeof enviarBoasVindas>[0]);
    } else if (tipo === "confirmacao-pagamento") {
      await enviarConfirmacaoPagamento(dados as Parameters<typeof enviarConfirmacaoPagamento>[0]);
    }

    return ok({ enviado: true });
  } catch (error: unknown) {
    console.error("[api/email]", error);
    return err("INTERNAL_ERROR", "Erro ao enviar e-mail.", 500);
  }
}
