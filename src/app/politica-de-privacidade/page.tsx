import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade — ContratoFácil",
  description: "Saiba como o ContratoFácil coleta, usa e protege seus dados pessoais em conformidade com a LGPD.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">

      {/* Cabeçalho */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8 font-body"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar
        </Link>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-3">
          Política de Privacidade
        </h1>
        <p className="text-sm text-on-surface-variant font-body">
          Última atualização: maio de 2026
        </p>
      </div>

      {/* Conteúdo */}
      <div className="space-y-12 font-body text-on-surface leading-relaxed">

        {/* Introdução */}
        <p className="text-on-surface-variant text-base">
          Esta Política de Privacidade explica, em linguagem simples, como o{" "}
          <strong className="text-on-surface">ContratoFácil</strong> — produto da{" "}
          <strong className="text-on-surface">FlowIQ</strong> — coleta, usa e protege
          seus dados pessoais. Ela está alinhada com a{" "}
          <strong className="text-on-surface">Lei Geral de Proteção de Dados (LGPD,
          Lei nº 13.709/2018)</strong>.
        </p>

        {/* 1. Quem somos */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            1. Quem somos
          </h2>
          <p>
            O ContratoFácil é uma plataforma desenvolvida pela FlowIQ que permite a
            MEIs, autônomos e pequenos prestadores de serviço criar contratos
            profissionais de forma rápida e acessível. Nosso site é{" "}
            <a
              href="https://contratofacil-app.vercel.app"
              className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
              target="_blank"
              rel="noopener noreferrer"
            >
              contratofacil-app.vercel.app
            </a>
            .
          </p>
        </section>

        {/* 2. Quais dados coletamos e por quê */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            2. Quais dados coletamos e por quê
          </h2>
          <p className="mb-4">
            Coletamos apenas os dados necessários para gerar e armazenar seus contratos:
          </p>
          <div className="space-y-4">
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <p className="font-semibold text-on-surface mb-1">Dados do prestador (você)</p>
              <p className="text-on-surface-variant text-sm">
                Nome completo ou razão social, CPF ou CNPJ, cidade, estado e e-mail.
                Usados para qualificar as partes no contrato e manter sua conta ativa.
              </p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <p className="font-semibold text-on-surface mb-1">Dados do seu cliente</p>
              <p className="text-on-surface-variant text-sm">
                Nome ou razão social, CPF ou CNPJ, cidade, estado e e-mail do seu
                cliente — inseridos por você no formulário para geração do contrato.
                Esses dados pertencem a terceiros e você é responsável por ter
                autorização para fornecê-los.
              </p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <p className="font-semibold text-on-surface mb-1">Dados da conta</p>
              <p className="text-on-surface-variant text-sm">
                E-mail e senha usados no cadastro ou login via Google/GitHub (quando
                aplicável). Armazenados de forma segura pelo Supabase Auth.
              </p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <p className="font-semibold text-on-surface mb-1">Dados de pagamento</p>
              <p className="text-on-surface-variant text-sm">
                Processados diretamente pelo Stripe. Não armazenamos números de
                cartão ou dados bancários em nossos servidores.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-on-surface-variant">
            <strong className="text-on-surface">Base legal (LGPD):</strong> art. 7º,
            inciso II (execução de contrato) e inciso IX (legítimo interesse).
          </p>
        </section>

        {/* 3. Como usamos os dados */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            3. Como usamos seus dados
          </h2>
          <ul className="space-y-2 text-on-surface-variant">
            {[
              "Gerar o texto do contrato usando inteligência artificial (Groq/Llama).",
              "Salvar e exibir seus contratos gerados na área \"Meus Contratos\".",
              "Enviar o contrato por e-mail ao seu cliente, quando solicitado.",
              "Processar pagamentos de planos pagos via Stripe.",
              "Garantir a segurança da sua conta e prevenir uso indevido.",
              "Cumprir obrigações legais quando exigido por lei ou autoridade competente.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0">
                  check_circle
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-on-surface-variant">
            Não vendemos, alugamos nem comercializamos seus dados com terceiros para
            fins de marketing.
          </p>
        </section>

        {/* 4. Com quem compartilhamos */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            4. Com quem compartilhamos
          </h2>
          <p className="mb-4 text-on-surface-variant">
            Compartilhamos dados apenas com os parceiros essenciais ao funcionamento
            do serviço, todos com políticas de privacidade próprias:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-surface-container-high">
                  <th className="text-left p-3 font-semibold text-on-surface rounded-tl-lg">Parceiro</th>
                  <th className="text-left p-3 font-semibold text-on-surface">Finalidade</th>
                  <th className="text-left p-3 font-semibold text-on-surface rounded-tr-lg">País</th>
                </tr>
              </thead>
              <tbody className="text-on-surface-variant">
                {[
                  ["Supabase", "Banco de dados e autenticação", "EUA"],
                  ["Groq", "Geração do texto do contrato por IA", "EUA"],
                  ["Resend", "Envio de e-mails transacionais", "EUA"],
                  ["Stripe", "Processamento de pagamentos", "EUA"],
                ].map(([parceiro, finalidade, pais], i) => (
                  <tr
                    key={i}
                    className="border-t border-outline-variant/15 hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="p-3 font-medium text-on-surface">{parceiro}</td>
                    <td className="p-3">{finalidade}</td>
                    <td className="p-3">{pais}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-on-surface-variant">
            As transferências internacionais de dados ocorrem com base em cláusulas
            contratuais padrão e mecanismos equivalentes, conforme art. 33 da LGPD.
          </p>
        </section>

        {/* 5. Por quanto tempo guardamos */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            5. Por quanto tempo guardamos seus dados
          </h2>
          <div className="space-y-3 text-on-surface-variant">
            <p>
              <span className="font-semibold text-on-surface">Contratos no plano gratuito:</span>{" "}
              retidos por até <strong className="text-on-surface">30 dias</strong> após a
              criação, depois removidos automaticamente.
            </p>
            <p>
              <span className="font-semibold text-on-surface">Contratos em planos pagos:</span>{" "}
              retidos enquanto a conta estiver ativa ou pelo prazo contratado.
            </p>
            <p>
              <span className="font-semibold text-on-surface">Dados da conta:</span>{" "}
              mantidos até o cancelamento da conta. Você pode solicitar a exclusão a
              qualquer momento pelo e-mail de contato.
            </p>
            <p>
              <span className="font-semibold text-on-surface">Dados de pagamento:</span>{" "}
              retidos pelo Stripe conforme a legislação financeira aplicável.
            </p>
          </div>
        </section>

        {/* 6. Seus direitos (LGPD) */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            6. Seus direitos pela LGPD
          </h2>
          <p className="mb-4 text-on-surface-variant">
            A LGPD garante a você os seguintes direitos sobre seus dados pessoais:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["visibility", "Acesso", "Saber quais dados temos sobre você."],
              ["edit", "Correção", "Corrigir dados incompletos ou desatualizados."],
              ["delete", "Exclusão", "Pedir a remoção dos seus dados."],
              ["download", "Portabilidade", "Receber seus dados em formato estruturado."],
              ["block", "Oposição", "Opor-se a tratamentos desnecessários."],
              ["info", "Informação", "Saber com quem compartilhamos seus dados."],
            ].map(([icon, titulo, desc]) => (
              <div
                key={titulo}
                className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/15 flex items-start gap-3"
              >
                <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">
                  {icon}
                </span>
                <div>
                  <p className="font-semibold text-on-surface text-sm">{titulo}</p>
                  <p className="text-on-surface-variant text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-on-surface-variant">
            Para exercer qualquer um desses direitos, envie um e-mail para{" "}
            <a
              href="mailto:contato@contratofacil.com.br"
              className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              contato@contratofacil.com.br
            </a>
            . Responderemos em até <strong className="text-on-surface">15 dias úteis</strong>.
          </p>
        </section>

        {/* 7. Cookies */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            7. Cookies
          </h2>
          <p className="text-on-surface-variant mb-3">
            Usamos apenas <strong className="text-on-surface">cookies essenciais</strong> —
            necessários para manter sua sessão ativa e garantir que o login funcione
            corretamente. Não utilizamos cookies de rastreamento, remarketing ou
            análise comportamental.
          </p>
          <p className="text-on-surface-variant">
            Você pode desativar cookies no seu navegador, mas isso pode impedir o
            funcionamento do login e de outras funcionalidades essenciais.
          </p>
        </section>

        {/* 8. Segurança */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            8. Segurança dos dados
          </h2>
          <p className="text-on-surface-variant">
            Adotamos medidas técnicas e organizacionais adequadas para proteger seus
            dados: comunicação criptografada via HTTPS, autenticação segura via
            Supabase Auth e controle de acesso por políticas de Row-Level Security
            (RLS) no banco de dados — garantindo que cada usuário acesse apenas seus
            próprios contratos.
          </p>
        </section>

        {/* 9. Contato */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            9. Contato e Encarregado de Dados (DPO)
          </h2>
          <p className="text-on-surface-variant mb-2">
            Para dúvidas, solicitações ou reclamações sobre privacidade:
          </p>
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15 inline-flex flex-col gap-1">
            <p className="font-semibold text-on-surface">FlowIQ — ContratoFácil</p>
            <a
              href="mailto:contato@contratofacil.com.br"
              className="text-primary text-sm underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              contato@contratofacil.com.br
            </a>
            <p className="text-sm text-on-surface-variant">Foro: Comarca de Betim — MG</p>
          </div>
          <p className="mt-4 text-sm text-on-surface-variant">
            Caso entenda que seus direitos não foram atendidos, você pode registrar
            reclamação junto à{" "}
            <strong className="text-on-surface">
              Autoridade Nacional de Proteção de Dados (ANPD)
            </strong>{" "}
            em{" "}
            <a
              href="https://www.gov.br/anpd"
              className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
              target="_blank"
              rel="noopener noreferrer"
            >
              gov.br/anpd
            </a>
            .
          </p>
        </section>

        {/* 10. Atualizações */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            10. Atualizações desta política
          </h2>
          <p className="text-on-surface-variant">
            Esta política pode ser atualizada periodicamente. Quando houver mudanças
            relevantes, publicaremos a nova versão nesta página com a data de
            atualização revisada. Em caso de alterações significativas, notificaremos
            por e-mail os usuários com conta ativa.
          </p>
        </section>

        {/* Rodapé da página */}
        <div className="pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} FlowIQ — ContratoFácil. Lei aplicável: LGPD
            (Lei nº 13.709/2018).
          </p>
          <Link
            href="/"
            className="text-xs text-primary hover:opacity-80 transition-opacity font-medium"
          >
            Voltar ao início
          </Link>
        </div>

      </div>
    </main>
  );
}
