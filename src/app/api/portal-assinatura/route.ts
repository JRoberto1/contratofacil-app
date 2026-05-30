import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { err } from "@/lib/api-response";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://contratofacil-app.vercel.app";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return err("UNAUTHORIZED", "Não autorizado.", 401);

    // 1. Tenta buscar stripe_customer_id já salvo na tabela pagamentos
    const { data: pagamento } = await supabase
      .from("pagamentos")
      .select("stripe_customer_id")
      .eq("usuario_id", user.id)
      .not("stripe_customer_id", "is", null)
      .order("criado_em", { ascending: false })
      .limit(1)
      .single();

    let customerId: string | null = pagamento?.stripe_customer_id ?? null;

    // 2. Fallback: busca pelo email na API do Stripe
    if (!customerId && user.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      customerId = customers.data[0]?.id ?? null;
    }

    if (!customerId) {
      return err(
        "NO_SUBSCRIPTION",
        "Nenhuma assinatura ativa encontrada. Faça upgrade para um plano pago.",
        404
      );
    }

    // 3. Cria sessão do portal de assinatura
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${APP_URL}/meus-contratos`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("[portal-assinatura]", error);
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return err("INTERNAL_ERROR", `Erro ao abrir portal: ${msg}`, 500);
  }
}
