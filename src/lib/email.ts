// =============================================================================
// ContratoFácil — Módulo de E-mail (Resend)
// NUNCA importe este arquivo em componentes client-side
// © 2026 FlowIQ. Todos os direitos reservados.
// =============================================================================

import { Resend } from "resend";

// Inicialização lazy — evita erro durante o build quando env vars não existem
function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY não configurada");
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = () => process.env.EMAIL_FROM ?? "onboarding@resend.dev";
const APP_URL = () => process.env.NEXT_PUBLIC_APP_URL ?? "https://contratofacil-app.vercel.app";

// -----------------------------------------------------------------------------
// Template base — HTML do e-mail
// -----------------------------------------------------------------------------
function templateBase(titulo: string, corpo: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${titulo}</title>
</head>
<body style="margin:0;padding:0;background:#f7f9fb;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f9fb;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(25,28,30,0.06);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0040a1,#002b73);padding:28px 40px;">
            <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.5px;">
              ContratoFácil
            </span>
            <span style="color:rgba(255,255,255,0.60);font-size:11px;display:block;margin-top:2px;">
              Um produto FlowIQ
            </span>
          </td>
        </tr>

        <!-- Corpo -->
        <tr>
          <td style="padding:40px;">
            ${corpo}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #e0e3e5;text-align:center;">
            <p style="margin:0;font-size:11px;color:#747784;">
              © 2026 FlowIQ · Todos os direitos reservados
            </p>
            <p style="margin:4px 0 0;font-size:11px;color:#747784;">
              <a href="${APP_URL()}/privacidade" style="color:#002b73;">Privacidade</a> ·
              <a href="${APP_URL()}/termos" style="color:#002b73;">Termos</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// -----------------------------------------------------------------------------
// E-mail 1: Confirmação de pagamento + link para download
// -----------------------------------------------------------------------------
export async function enviarConfirmacaoPagamento({
  para,
  nome,
  contratoId,
  plano,
  valor,
}: {
  para: string;
  nome: string;
  contratoId: string;
  plano: string;
  valor: string;
}) {
  const linkDownload = `${APP_URL()}/dashboard?contrato=${contratoId}`;

  const corpo = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#191c1e;font-family:Manrope,Arial,sans-serif;">
      Pagamento confirmado!
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#434652;line-height:1.6;">
      Olá, <strong>${nome}</strong>. Seu contrato está pronto para download.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f4f6;border-radius:12px;padding:20px;margin-bottom:28px;">
      <tr>
        <td style="font-size:13px;color:#434652;">Plano</td>
        <td align="right" style="font-size:13px;font-weight:700;color:#191c1e;">${plano}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#434652;padding-top:8px;">Valor pago</td>
        <td align="right" style="font-size:13px;font-weight:700;color:#191c1e;padding-top:8px;">${valor}</td>
      </tr>
    </table>

    <a href="${linkDownload}"
      style="display:block;text-align:center;background:linear-gradient(135deg,#0040a1,#002b73);color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:16px 32px;border-radius:10px;letter-spacing:0.05em;text-transform:uppercase;">
      Baixar meu contrato em PDF
    </a>

    <p style="margin:24px 0 0;font-size:13px;color:#747784;text-align:center;">
      O link ficará disponível no seu painel por 30 dias.
    </p>`;

  return getResend().emails.send({
    from: FROM(),
    to: para,
    subject: "Seu contrato está pronto — ContratoFácil",
    html: templateBase("Pagamento confirmado", corpo),
  });
}

// -----------------------------------------------------------------------------
// E-mail 2: Entrega do contrato com PDF em anexo
// -----------------------------------------------------------------------------
export async function enviarContratoPDF({
  para,
  nome,
  pdfBuffer,
  nomeArquivo,
}: {
  para: string;
  nome: string;
  pdfBuffer: Buffer;
  nomeArquivo: string;
}) {
  const corpo = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#191c1e;font-family:Manrope,Arial,sans-serif;">
      Seu contrato em anexo
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#434652;line-height:1.6;">
      Olá, <strong>${nome}</strong>! Segue seu contrato profissional gerado pelo ContratoFácil.
      O documento está em anexo neste e-mail em formato PDF.
    </p>

    <div style="background:#dae2ff;border-radius:12px;padding:20px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:#001848;font-weight:600;">
        📎 ${nomeArquivo}
      </p>
      <p style="margin:6px 0 0;font-size:12px;color:#394f83;">
        Compartilhe com seu cliente para assinatura.
      </p>
    </div>

    <a href="${APP_URL()}/gerar"
      style="display:block;text-align:center;background:#f2f4f6;color:#394f83;font-weight:700;font-size:14px;text-decoration:none;padding:14px 32px;border-radius:10px;letter-spacing:0.05em;text-transform:uppercase;">
      Gerar outro contrato
    </a>`;

  return getResend().emails.send({
    from: FROM(),
    to: para,
    subject: `Contrato pronto — ${nomeArquivo}`,
    html: templateBase("Seu contrato em anexo", corpo),
    attachments: [
      {
        filename: nomeArquivo,
        content: pdfBuffer,
      },
    ],
  });
}

// -----------------------------------------------------------------------------
// E-mail 3: Boas-vindas após cadastro
// -----------------------------------------------------------------------------
export async function enviarBoasVindas({
  para,
  nome,
}: {
  para: string;
  nome: string;
}) {
  const corpo = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#191c1e;font-family:Manrope,Arial,sans-serif;">
      Bem-vindo ao ContratoFácil!
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#434652;line-height:1.6;">
      Olá, <strong>${nome ?? "autônomo"}</strong>! Sua conta foi criada com sucesso.
      Você tem <strong>2 contratos gratuitos por mês</strong> — sem cartão de crédito.
    </p>

    <a href="${APP_URL()}/gerar"
      style="display:block;text-align:center;background:linear-gradient(135deg,#0040a1,#002b73);color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:16px 32px;border-radius:10px;letter-spacing:0.05em;text-transform:uppercase;">
      Criar meu primeiro contrato
    </a>`;

  return getResend().emails.send({
    from: FROM(),
    to: para,
    subject: "Bem-vindo ao ContratoFácil — 2 contratos grátis te aguardam",
    html: templateBase("Bem-vindo!", corpo),
  });
}
