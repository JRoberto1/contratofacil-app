import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, err } from "@/lib/api-response";
import { z } from "zod";

const Schema = z.object({
  contratoId: z.string().uuid(),
  conteudo: z.string().min(1),
  para: z.string().email("E-mail do destinatário inválido"),
  nomeDestinatario: z.string().optional(),
  referencia: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return err("UNAUTHORIZED", "Não autorizado.", 401);

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return err("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Dados inválidos", 422);
    }

    const { contratoId, conteudo, para, nomeDestinatario, referencia } = parsed.data;

    // Verifica env vars antes de importar as libs pesadas
    if (!process.env.RESEND_API_KEY) {
      console.error("[enviar-contrato] RESEND_API_KEY não configurada");
      return err("CONFIG_ERROR", "Serviço de e-mail não configurado. Contate o suporte.", 500);
    }

    // Imports dinâmicos para evitar crash no module-level
    const { gerarPDFBuffer } = await import("@/lib/pdf");
    const { enviarContratoPDF } = await import("@/lib/email");

    // Gera PDF
    const pdfBytes = await gerarPDFBuffer(conteudo);
    const pdfBuffer = Buffer.from(pdfBytes);
    const nomeArquivo = `contrato-${referencia ?? contratoId.slice(0, 8)}.pdf`;

    // Envia por e-mail
    await enviarContratoPDF({
      para,
      nome: nomeDestinatario || "Cliente",
      pdfBuffer,
      nomeArquivo,
    });

    // Atualiza status para 'enviado'
    await supabase
      .from("contratos")
      .update({ status: "enviado" })
      .eq("id", contratoId)
      .eq("usuario_id", user.id);

    return ok({ enviado: true });
  } catch (error: unknown) {
    console.error("[enviar-contrato] erro:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return err("INTERNAL_ERROR", `Erro ao enviar: ${msg}`, 500);
  }
}
