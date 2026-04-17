import { NextRequest, NextResponse } from "next/server";
import { gerarPDFBuffer } from "@/lib/pdf";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conteudo } = body;

    if (!conteudo) {
      return NextResponse.json({ error: "Conteúdo é obrigatório." }, { status: 400 });
    }

    // Gerar PDF em Buffer
    const pdfBytes = await gerarPDFBuffer(conteudo);

    return new Response(pdfBytes as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contratofacil-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[gerar-pdf] Interno:", error);
    return NextResponse.json({ error: "Erro interno ao gerar o PDF." }, { status: 500 });
  }
}
