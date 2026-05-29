import { NextRequest } from "next/server";
import { gerarContrato } from "@/lib/groq";
import { createClient } from "@/lib/supabase/server";
import { GerarContratoSchema } from "@/lib/schemas";
import { ok, err, fromZodError } from "@/lib/api-response";
import type { FormularioContrato, TipoContrato } from "@/types/contrato";
import { gerarSystemPrompt, gerarUserPrompt } from "@/lib/prompts/gerarPromptContrato";
import { categorias, CategoriaSlug } from "@/lib/categorias";

export const maxDuration = 60;

function validarContrato(conteudo: string, form: FormularioContrato): string[] {
  const alertas: string[] = [];

  const percentuais = conteudo.match(/\d+%/g) || [];
  const autorizados = [
    form.servico.multaRescisao ? `${form.servico.multaRescisao}%` : null,
    form.servico.formaPagamentoDetalhes?.percentualEntrada
      ? `${form.servico.formaPagamentoDetalhes.percentualEntrada}%`
      : null,
  ].filter(Boolean);

  percentuais.forEach((p) => {
    if (!autorizados.includes(p)) {
      alertas.push(`Percentual não autorizado encontrado: ${p}`);
    }
  });

  if (conteudo.toLowerCase().includes('juros') && !form.servico.jurosAtraso) {
    alertas.push('Cláusula de juros possivelmente gerada sem autorização');
  }
  if (conteudo.toLowerCase().includes('cláusula penal') && !form.servico.multaRescisao) {
    alertas.push('Cláusula penal possivelmente gerada sem autorização');
  }

  return alertas;
}

// ─── Mapeamento categoria slug → nome para o system prompt ───────────────────
const categoriaParaPrompt: Record<string, string> = {
  'designer':    'Designer / Freelancer Digital',
  'uxui':        'Designer / Freelancer Digital',
  'socialmedia': 'Designer / Freelancer Digital',
  'copywriter':  'Designer / Freelancer Digital',
  'editor':      'Designer / Freelancer Digital',
  'ilustrador':  'Designer / Freelancer Digital',
  'dev':         'Desenvolvedor de Software',
  'photo':       'Fotógrafo / Videomaker',
  'videomaker':  'Fotógrafo / Videomaker',
  'consultant':  'Consultor / Professor / Coach',
  'mentor':      'Consultor / Professor / Coach',
  'professor':   'Consultor / Professor / Coach',
  'contador':    'Consultor / Professor / Coach',
  'arquiteto':   'Consultor / Professor / Coach',
  'maintenance': 'Eletricista / Encanador / Construção',
  'eletricista': 'Eletricista / Encanador / Construção',
  'encanador':   'Eletricista / Encanador / Construção',
  'pintor':      'Eletricista / Encanador / Construção',
  'montador':    'Eletricista / Encanador / Construção',
  'esteticista': 'Beleza / Estética',
  'manicure':    'Beleza / Estética',
  'cabeleireiro':'Beleza / Estética',
  'maquiador':   'Beleza / Estética',
  'tatuador':    'Beleza / Estética',
  'nutricionista':  'Saúde / Bem-estar',
  'psicologo':      'Saúde / Bem-estar',
  'personaltrainer':'Saúde / Bem-estar',
  'fisioterapeuta': 'Saúde / Bem-estar',
  'massoterapeuta': 'Saúde / Bem-estar',
  'yoga':           'Saúde / Bem-estar',
  'fono':           'Saúde / Bem-estar',
  'cuidador':       'Saúde / Bem-estar',
};

const modoMap: Record<string, 'fisica-testemunhas' | 'fisica-simples' | 'aceite-eletronico'> = {
  'fisica_com_testemunhas': 'fisica-testemunhas',
  'fisica_sem_testemunhas': 'fisica-simples',
  'eletronica':             'aceite-eletronico',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GerarContratoSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const { formulario: f, tipo, contratoId } = parsed.data;
    const formulario = f as unknown as FormularioContrato;
    const tipoContrato = tipo as TipoContrato;

    // ── Monta inputs para os prompts ─────────────────────────────────────────
    const categoriaInfo = categorias[(formulario.categoria as CategoriaSlug)] || categorias['other'];
    const categoriaDisplay = formulario.categoriaCustom || categoriaInfo.title;
    const categoriaNome = categoriaParaPrompt[formulario.categoria] || categoriaDisplay;
    const modoAssinatura = modoMap[formulario.modoAssinatura] || 'fisica-simples';

    const valorTotal = parseFloat(
      (formulario.servico.valor || '0').replace(/\./g, '').replace(',', '.')
    ) || 0;

    const det = formulario.servico.formaPagamentoDetalhes;
    const percentualEntrada = det?.comEntrada && det?.percentualEntrada
      ? parseFloat(det.percentualEntrada) || undefined
      : undefined;
    const numeroParcelas = formulario.servico.formaPagamentoTipo === 'parcelado' && det?.numeroParcelas
      ? parseInt(det.numeroParcelas) || undefined
      : undefined;
    const multaRescisao = formulario.servico.multaRescisao
      ? parseFloat(String(formulario.servico.multaRescisao)) || undefined
      : undefined;
    const jurosMora = formulario.servico.jurosAtraso
      ? parseFloat(String(formulario.servico.jurosAtraso)) || undefined
      : undefined;

    const camposCategoria: Record<string, string> = {};
    if (formulario.servico.camposExtrasCategoria) {
      for (const campo of categoriaInfo.camposExtras) {
        const val = formulario.servico.camposExtrasCategoria[campo.id];
        if (val) camposCategoria[campo.label] = String(val);
      }
    }

    // ── Gera os dois prompts ──────────────────────────────────────────────────
    const systemPrompt = gerarSystemPrompt(categoriaNome, tipoContrato);

    const userPrompt = gerarUserPrompt({
      modelo: tipoContrato,
      modoAssinatura,
      contratante: {
        nome:               formulario.cliente.nomeRazaoSocial,
        tipoPessoa:         formulario.cliente.tipoPessoa || 'PF',
        nacionalidade:      formulario.cliente.nacionalidade,
        estadoCivil:        formulario.cliente.estadoCivil,
        profissao:          formulario.cliente.profissao,
        representanteLegal: formulario.cliente.representanteLegal,
        cargo:              formulario.cliente.cargoRepresentante,
        cpfCnpj:            formulario.cliente.cpfCnpj,
        cidade:             formulario.cliente.cidade,
        estado:             formulario.cliente.estado,
        email:              formulario.cliente.email,
      },
      contratado: {
        nome:          formulario.prestador.nomeCompleto,
        tipoPessoa:    formulario.prestador.tipoPessoa || 'PF',
        nacionalidade: formulario.prestador.nacionalidade,
        estadoCivil:   formulario.prestador.estadoCivil,
        profissao:     formulario.prestador.profissao,
        cpfCnpj:       formulario.prestador.cpfCnpj,
        cidade:        formulario.prestador.cidade,
        estado:        formulario.prestador.estado,
        email:         formulario.prestador.email,
      },
      servico: {
        categoria:            categoriaDisplay,
        numeroPedido:         formulario.servico.numeroPedido,
        descricao:            formulario.servico.descricao,
        valorTotal,
        prazoEntrega:         formulario.servico.prazoEntrega,
        formaPagamento:       (formulario.servico.formaPagamento || formulario.servico.formaPagamentoTipo) ?? '',
        formaRecebimento:     formulario.servico.formaRecebimento,
        percentualEntrada,
        numeroParcelas,
        multaRescisao,
        jurosMora,
        localPrestacao:       formulario.servico.localPrestacao,
        formaEntrega:         formulario.servico.formaEntrega,
        clausulasEspeciais:   formulario.servico.clausulasEspeciais,
        revisoes:             formulario.servico.revisoes ? parseInt(formulario.servico.revisoes) || undefined : undefined,
        transferePI:          formulario.servico.transferePI,
        permitePortfolio:     formulario.servico.permitePortfolio,
        proibeSubcontratacao: formulario.servico.proibeSubcontratacao,
        garantiaDias:         formulario.servico.diasGarantia ? parseInt(formulario.servico.diasGarantia) || undefined : undefined,
        quemPagaHospedagem:   formulario.servico.quemPagaHospedagem,
        manutencaoMensal:     formulario.servico.manutencaoMensal,
        valorManutencao:      formulario.servico.valorManutencao
          ? parseFloat(formulario.servico.valorManutencao.replace(/\./g, '').replace(',', '.')) || undefined
          : undefined,
        escopoManutencao:     formulario.servico.escopoManutencao,
        entregaRaw:           formulario.servico.entregaRaw,
        revisoesFotos:        formulario.servico.revisoesFotos ? parseInt(formulario.servico.revisoesFotos) || undefined : undefined,
        quemForneceMateriais: formulario.servico.quemForneceMateriais,
        garantiaMaoDeObra:    formulario.servico.garantiaMaoDeObra ? parseInt(formulario.servico.garantiaMaoDeObra) || undefined : undefined,
        politicaCancelamento: formulario.servico.politicaCancelamento,
        sessoesGravadas:      formulario.servico.sessoesGravadas,
        avisoPrevio:          formulario.servico.avisoPrevio ? parseInt(formulario.servico.avisoPrevio) || undefined : undefined,
        prazoAprovacao:       formulario.servico.prazoAprovacao ? parseInt(formulario.servico.prazoAprovacao) || undefined : undefined,
        prazoMateriais:       formulario.servico.prazoMateriais ? parseInt(formulario.servico.prazoMateriais) || undefined : undefined,
      },
      camposCategoria: Object.keys(camposCategoria).length > 0 ? camposCategoria : undefined,
    });

    // ── Chama Groq ────────────────────────────────────────────────────────────
    let conteudo: string;
    try {
      conteudo = await gerarContrato(systemPrompt, userPrompt);
    } catch (groqError: unknown) {
      const isTimeout =
        groqError instanceof Error &&
        (groqError.name === 'AbortError' || groqError.message.toLowerCase().includes('timeout'));
      if (isTimeout) {
        return err(
          "GROQ_TIMEOUT",
          "A geração demorou mais de 60s. Tente novamente — contratos complexos podem exigir mais de uma tentativa.",
          504
        );
      }
      throw groqError;
    }

    const alertas = validarContrato(conteudo, formulario);

    if (contratoId) {
      const supabase = await createClient();

      if (alertas.length > 0) {
        await supabase.from('logs_qualidade').insert({
          contrato_id: contratoId,
          alertas,
          timestamp: new Date().toISOString(),
        }).then(({ error }) => {
          if (error) console.error("[supabase] logs_qualidade:", error.message);
        });
      }

      await supabase.from('contratos').update({ conteudo }).eq('id', contratoId);
    }

    return ok({ conteudo });
  } catch (error: unknown) {
    console.error("[gerar-contrato]", error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return err("INTERNAL_ERROR", `Erro na geração: ${msg}`, 500);
  }
}
