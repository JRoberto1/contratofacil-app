import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gerarPDFBuffer } from "@/lib/pdf";
import { GerarPdfSchema } from "@/lib/schemas";
import { err, fromZodError } from "@/lib/api-response";

export const maxDuration = 60;

// Retorna o início do mês corrente como string YYYY-MM-DD
function inicioMesAtual(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GerarPdfSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    // ── Verificação de cota (apenas para usuários autenticados) ──────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: perfil } = await supabase
        .from('perfis')
        .select('contratos_mes, contratos_usados_mes, periodo_reset, plano')
        .eq('id', user.id)
        .single();

      if (perfil) {
        // Reset mensal: se periodo_reset é de mês anterior, zera o contador
        const periodoAtual = inicioMesAtual();
        const periodoSalvo  = perfil.periodo_reset
          ? String(perfil.periodo_reset).slice(0, 10) // "YYYY-MM-DD"
          : null;

        if (!periodoSalvo || periodoSalvo < periodoAtual) {
          await supabase
            .from('perfis')
            .update({
              contratos_usados_mes: 0,
              periodo_reset: periodoAtual,
            })
            .eq('id', user.id);
          // Após reset, contador começa em 0
          perfil.contratos_usados_mes = 0;
        }

        const limite       = perfil.contratos_mes ?? 2;
        const usados       = perfil.contratos_usados_mes ?? 0;
        const cotaDisponivel = Math.max(0, limite - usados);

        if (cotaDisponivel <= 0) {
          return err("QUOTA_EXCEEDED", "Cota de contratos esgotada.", 403);
        }

        // Incrementa cota após geração bem-sucedida do PDF (abaixo)
        // (incremento feito após gerar para não cobrar em caso de erro)
      }
    }

    // ── Gera o PDF ───────────────────────────────────────────────────────────
    const pdfBytes = await gerarPDFBuffer(parsed.data.conteudo);

    // ── Incrementa contratos_usados_mes após geração bem-sucedida ───────────
    if (user) {
      // Fire-and-forget: não bloqueia a resposta
      supabase
        .from('perfis')
        .select('contratos_usados_mes')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            supabase
              .from('perfis')
              .update({ contratos_usados_mes: (data.contratos_usados_mes ?? 0) + 1 })
              .eq('id', user.id)
              .then(() => null);
          }
        });
    }

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
