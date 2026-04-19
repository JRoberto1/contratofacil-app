import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { err } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return err("UNAUTHORIZED", "Acesso negado. Por favor, faça login.", 401);

    const { searchParams } = new URL(req.url);
    const contratoId = searchParams.get("id");

    if (!contratoId) return err("VALIDATION_ERROR", "ID do contrato ausente.", 400);

    const { data: contrato, error: dbError } = await supabase
      .from('contratos')
      .select('pdf_url, pago, tipo')
      .eq('id', contratoId)
      .single();

    if (dbError || !contrato) {
      return err("NOT_FOUND", "Contrato não encontrado ou não autorizado.", 404);
    }

    if (!contrato.pdf_url) {
      return err("NOT_FOUND", "O arquivo PDF ainda não foi gerado.", 404);
    }

    const { data: signedData, error: storageError } = await supabase
      .storage
      .from('contratos-pdf')
      .createSignedUrl(contrato.pdf_url, 60 * 5, {
        download: `contratofacil_${contratoId.substring(0, 8)}.pdf`,
      });

    if (storageError || !signedData) {
      return err("STORAGE_ERROR", "Não foi possível resgatar o arquivo do servidor.", 500);
    }

    return NextResponse.redirect(signedData.signedUrl);
  } catch (error: unknown) {
    console.error("[baixar-pdf-salvo]", error);
    return err("INTERNAL_ERROR", "Erro interno.", 500);
  }
}
