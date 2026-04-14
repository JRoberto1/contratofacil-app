import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Acesso negado. Por favor, faça login." }, { status: 401 });
    }

    // URL Ex: /api/baixar-pdf-salvo?id={contratoId}
    const { searchParams } = new URL(req.url);
    const contratoId = searchParams.get("id");

    if (!contratoId) {
      return NextResponse.json({ error: "ID do contrato ausente." }, { status: 400 });
    }

    // 1. Busca os metadados do contrato (apenas donos conseguem ler graças ao RLS)
    const { data: contrato, error: dbError } = await supabase
      .from('contratos')
      .select('pdf_url, pago, tipo')
      .eq('id', contratoId)
      .single();

    if (dbError || !contrato) {
      return NextResponse.json({ error: "Contrato não encontrado ou não autorizado." }, { status: 404 });
    }

    if (!contrato.pdf_url) {
      return NextResponse.json({ error: "O arquivo PDF ainda não foi gerado." }, { status: 404 });
    }

    // // Validação de pagamento ativa:
    // // Se desejar bloquear o download do rascunho. Isso depende da lógica de negócios.
    // if (!contrato.pago) {
    //   // Descomentar para impedir download se não pago
    //   // return NextResponse.json({ error: "Este contrato ainda não foi pago." }, { status: 403 });
    // }

    // 2. Cria URL assinada temporária para download seguro do Storage restrito
    const { data: signedData, error: storageError } = await supabase
      .storage
      .from('contratos-pdf')
      .createSignedUrl(contrato.pdf_url, 60 * 5, { // válido por 5 minutos
        download: `contratofacil_${contratoId.substring(0, 8)}.pdf` // Força o browser a baixar
      });

    if (storageError || !signedData) {
      return NextResponse.json({ error: "Não foi possível resgatar o arquivo do servidor seguro." }, { status: 500 });
    }

    // 3. Redireciona o usuário para o Download Expresso Privado
    return NextResponse.redirect(signedData.signedUrl);
  } catch (error) {
    console.error("[baixar-pdf-salvo]", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
