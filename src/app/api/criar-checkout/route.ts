import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { plano, contratoId } = await req.json();

    if (!plano) {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
    }

    // Identificar valores dinamicamente. Idealmente baseados no banco ou const.
    let priceData: any = {};
    let mode: "payment" | "subscription" = "payment";

    // Configuração simulada dos planos
    switch (plano) {
      case "avulso":
        priceData = {
          currency: "brl",
          unit_amount: 1990, // R$ 19,90
          product_data: {
            name: "Contrato Avulso",
            description: "Acesso permanente a este contrato específico em PDF e edição.",
          },
        };
        mode = "payment";
        break;
      case "mensal":
        priceData = {
          currency: "brl",
          unit_amount: 3990, // R$ 39,90/mês
          recurring: { interval: "month" },
          product_data: {
            name: "Plano Mensal - ContratoFácil",
            description: "Gere contratos limitados sem custos extras.",
          },
        };
        mode = "subscription";
        break;
      case "anual":
        priceData = {
          currency: "brl",
          unit_amount: 29990, // R$ 299,90/ano
          recurring: { interval: "year" },
          product_data: {
            name: "Plano Anual - ContratoFácil",
            description: "Acesso ilimitado e o melhor custo-benefício.",
          },
        };
        mode = "subscription";
        break;
      default:
        return NextResponse.json({ error: "Plano desconhecido." }, { status: 400 });
    }

    // Criar Sessão do Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto"], // Pode incluir pix ativando na base do Stripe
      mode: mode,
      customer_email: user.email,
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        plano: plano,
        contratoId: contratoId || "", // Somente relevante se comprando avulso
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/gerar`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("[criar-checkout]", error);
    return NextResponse.json(
      { error: "Erro interno ao tentar criar o checkout." },
      { status: 500 }
    );
  }
}
