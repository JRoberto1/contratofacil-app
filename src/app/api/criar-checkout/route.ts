import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { CriarCheckoutSchema } from "@/lib/schemas";
import { ok, err, fromZodError } from "@/lib/api-response";
import Stripe from "stripe";

const PRECOS: Record<string, { unit_amount: number; name: string; description: string; recurring?: Stripe.PriceCreateParams.Recurring }> = {
  avulso: {
    unit_amount: parseInt(process.env.PRECO_AVULSO_CENTAVOS || '1990'),
    name: "Contrato Avulso",
    description: "Acesso permanente a este contrato específico em PDF e edição.",
  },
  mensal: {
    unit_amount: parseInt(process.env.PRECO_MENSAL_CENTAVOS || '3990'),
    name: "Plano Mensal - ContratoFácil",
    description: "Gere contratos ilimitados sem custos extras.",
    recurring: { interval: "month" },
  },
  semestral: {
    unit_amount: parseInt(process.env.PRECO_SEMESTRAL_CENTAVOS || '8900'),
    name: "Plano Semestral - ContratoFácil",
    description: "6 meses de contratos ilimitados.",
    recurring: { interval: "month", interval_count: 6 },
  },
  anual: {
    unit_amount: parseInt(process.env.PRECO_ANUAL_CENTAVOS || '29990'),
    name: "Plano Anual - ContratoFácil",
    description: "Acesso ilimitado e o melhor custo-benefício.",
    recurring: { interval: "year" },
  },
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return err("UNAUTHORIZED", "Não autorizado.", 401);

    const body = await req.json();
    const parsed = CriarCheckoutSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const { plano, contratoId } = parsed.data;
    const preco = PRECOS[plano];
    const mode: "payment" | "subscription" = preco.recurring ? "subscription" : "payment";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode,
      customer_email: user.email,
      line_items: [{
        price_data: {
          currency: "brl",
          unit_amount: preco.unit_amount,
          product_data: { name: preco.name, description: preco.description },
          ...(preco.recurring && { recurring: preco.recurring }),
        },
        quantity: 1,
      }],
      metadata: {
        userId: user.id,
        plano,
        contratoId: contratoId || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/gerar`,
    });

    return ok({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error("[criar-checkout]", error);
    return err("INTERNAL_ERROR", "Erro interno ao criar o checkout.", 500);
  }
}
