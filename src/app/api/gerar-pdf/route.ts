import { NextRequest, NextResponse } from "next/server";
import { gerarPDFBuffer } from "@/lib/pdf";
import { GerarPdfSchema } from "@/lib/schemas";
import { err, fromZodError } from "@/lib/api-response";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GerarPdfSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const pdfBytes = await gerarPDFBuffer(parsed.data.conteudo);

    return new NextResponse(pdfBytes as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contratofacil-${Date.now()}.pdf"`,
      },
    });
  } catch (error: unknown) {
    console.error("[gerar-pdf]", error);
    return err("INTERNAL_ERROR", "Erro interno ao gerar o PDF.", 500);
  }
}
