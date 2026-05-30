import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js"; // Usamos Service Role para DB sem autenticação do Next
import Stripe from "stripe";

// Precisamos inicializar um cliente db com service_role para burlar RLS no webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!signature || !endpointSecret) {
      throw new Error("Missing stripe signature or endpoint secret.");
    }
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Webhook error';
    console.error(`⚠️  Webhook signature falhou.`, msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, plano, contratoId } = session.metadata || {};

    if (!userId || !plano) {
      console.error("Metadados incompletos no checkout:", session.metadata);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      // 1. Registro de Pagamento — upsert por idempotency_key (session.id) evita duplicação em retries do Stripe
      await supabaseAdmin.from('pagamentos').upsert([{
        usuario_id: userId,
        contrato_id: contratoId || null,
        plano: plano,
        valor_centavos: session.amount_total,
        status: 'aprovado',
        metodo: session.payment_method_types[0],
        stripe_session_id: session.id,
        idempotency_key: session.id,
      }], { onConflict: 'idempotency_key', ignoreDuplicates: true });

      // 2. Atualizar perfil ou liberar contrato
      if (plano === 'avulso' && contratoId) {
        // Avulso: libera um contrato específico — não altera contratos_mes do perfil
        await supabaseAdmin.from('contratos').update({ pago: true, status: 'pago' }).eq('id', contratoId);
      } else if (plano === 'mensal' || plano === 'semestral' || plano === 'anual') {
        // Assinaturas: atualiza plano e libera cota ilimitada (999)
        await supabaseAdmin.from('perfis').update({
          plano,
          contratos_mes: 999,
          contratos_usados_mes: 0,
          periodo_reset: new Date().toISOString().slice(0, 10),
        }).eq('id', userId);
      }

    } catch (dbError) {
      console.error("Erro interno atualizando banco no webhook", dbError);
      return NextResponse.json({ error: "Database process failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
