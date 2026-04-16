import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gerarPDFBase64 } from "@/lib/pdf";

// Configura o limite de timeout na Vercel para 60 segundos (limite do Hobby plan)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Validar usuário
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const { contratoId } = body;

    if (!contratoId) {
      return NextResponse.json({ error: "ID do contrato é obrigatório." }, { status: 400 });
    }

    // 2. Buscar o conteúdo do contrato no banco para gerar o PDF
    // O RLS garante que o usuário só conseguirá buscar o contrato se ele for o dono
    const { data: contrato, error: fetchError } = await supabase
      .from('contratos')
      .select('conteudo, pdf_url')
      .eq('id', contratoId)
      .single();

    if (fetchError || !contrato) {
      return NextResponse.json({ error: "Contrato não encontrado ou acesso restrito." }, { status: 404 });
    }

    if (!contrato.conteudo) {
      return NextResponse.json({ error: "Contrato sem conteúdo para gerar PDF." }, { status: 400 });
    }

    // 3. Gerar PDF em Base64 através do nosso utilitário nativo
    const base64Pdf = await gerarPDFBase64(contrato.conteudo);
    const pdfBuffer = Buffer.from(base64Pdf, 'base64');

    // 4. Salvar no Storage (Bucket privado)
    // O schema diz que deve estar no path contratos-pdf -> {user.id}/...
    const fileName = `${user.id}/${contratoId}.pdf`;
    
    const { error: uploadError } = await supabase
      .storage
      .from('contratos-pdf')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error("[gerar-pdf] Erro no upload:", uploadError);
      return NextResponse.json({ error: "Erro ao fazer upload do PDF." }, { status: 500 });
    }

    // 5. Atualizar o registro do contrato com o URL (path) e tempo de geração
    const { error: updateError } = await supabase
      .from('contratos')
      .update({
        pdf_url: fileName,
        pdf_gerado_em: new Date().toISOString()
      })
      .eq('id', contratoId);

    if (updateError) {
      console.error("[gerar-pdf] Erro na atualização do banco:", updateError);
      return NextResponse.json({ error: "Erro ao vincular o PDF gerado." }, { status: 500 });
    }

    // Para consumir, o front-end pode gerar signed URLs
    return NextResponse.json({ success: true, path: fileName });
  } catch (error) {
    console.error("[gerar-pdf] Interno:", error);
    return NextResponse.json({ error: "Erro interno ao gerar o PDF." }, { status: 500 });
  }
}
