import { NextRequest, NextResponse } from "next/server";
import { gerarPDFBase64 } from "@/lib/pdf";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conteudo } = body;

    if (!conteudo) {
      return NextResponse.json({ error: "Conteúdo é obrigatório." }, { status: 400 });
    }

    // Gerar PDF em Base64 apenas com o utilitário nativo
    const base64Pdf = await gerarPDFBase64(conteudo);

    return NextResponse.json({ success: true, base64: base64Pdf });
  } catch (error) {
    console.error("[gerar-pdf] Interno:", error);
    return NextResponse.json({ error: "Erro interno ao gerar o PDF." }, { status: 500 });
  }
}
