import { NextRequest, NextResponse } from "next/server";
import { enviarBoasVindas, enviarConfirmacaoPagamento } from "@/lib/email";

// Rota interna chamada por webhooks e server actions
// Protegida por secret para evitar chamadas externas
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { tipo, ...dados } = body;

    if (tipo === "boas-vindas") {
      await enviarBoasVindas(dados);
    } else if (tipo === "confirmacao-pagamento") {
      await enviarConfirmacaoPagamento(dados);
    } else {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/email]", error);
    return NextResponse.json({ error: "Erro ao enviar e-mail" }, { status: 500 });
  }
}
