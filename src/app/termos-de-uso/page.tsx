import Link from "next/link";

export const metadata = {
  title: "Termos de Uso — ContratoFácil",
  description: "Leia os Termos de Uso do ContratoFácil antes de utilizar a plataforma.",
};

export default function TermosDeUsoPage() {
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
          Termos de Uso
        </h1>
        <p className="text-sm text-on-surface-variant font-body">
          Última atualização: maio de 2026
        </p>
      </div>

      {/* Conteúdo */}
      <div className="space-y-12 font-body text-on-surface leading-relaxed">

        {/* Introdução */}
        <p className="text-on-surface-variant text-base">
          Estes Termos de Uso regulam o acesso e o uso do{" "}
          <strong className="text-on-surface">ContratoFácil</strong>, plataforma
          desenvolvida pela <strong className="text-on-surface">FlowIQ</strong>,
          disponível em{" "}
          <a
            href="https://contratofacil-app.vercel.app"
            className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            contratofacil-app.vercel.app
          </a>
          . Leia com atenção antes de usar.
        </p>

        {/* 1. Aceitação */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            1. Aceitação dos termos
          </h2>
          <div className="space-y-3 text-on-surface-variant">
            <p>
              Ao acessar ou usar o ContratoFácil, você declara que leu, entendeu e
              concorda com estes Termos de Uso. Se não concordar com qualquer
              parte, não utilize o serviço.
            </p>
            <p>
              O uso da plataforma é permitido apenas para{" "}
              <strong className="text-on-surface">maiores de 18 anos</strong>. Ao
              criar uma conta, você confirma que atende a esse requisito.
            </p>
          </div>
        </section>

        {/* 2. O que é o ContratoFácil */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            2. O que é o ContratoFácil
          </h2>
          <div className="space-y-3 text-on-surface-variant">
            <p>
              O ContratoFácil é uma plataforma de{" "}
              <strong className="text-on-surface">
                geração automatizada de contratos de prestação de serviços
              </strong>{" "}
              por inteligência artificial, voltada a MEIs, autônomos e pequenos
              prestadores de serviço.
            </p>
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-tertiary text-xl shrink-0 mt-0.5">
                  gavel
                </span>
                <div>
                  <p className="font-semibold text-on-surface mb-1">
                    Importante: não somos um escritório de advocacia
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Os contratos gerados pelo ContratoFácil são modelos baseados em
                    boas práticas jurídicas, mas{" "}
                    <strong className="text-on-surface">
                      não substituem assessoria jurídica profissional
                    </strong>
                    . Para disputas judiciais complexas, negociações de alto valor ou
                    contratos atípicos, recomendamos consultar um advogado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Planos e pagamentos */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            3. Planos e pagamentos
          </h2>
          <p className="text-on-surface-variant mb-4">
            O ContratoFácil oferece os seguintes planos:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-surface-container-high">
                  <th className="text-left p-3 font-semibold text-on-surface rounded-tl-lg">Plano</th>
                  <th className="text-left p-3 font-semibold text-on-surface">Valor</th>
                  <th className="text-left p-3 font-semibold text-on-surface rounded-tr-lg">Contratos</th>
                </tr>
              </thead>
              <tbody className="text-on-surface-variant">
                {[
                  ["Gratuito", "R$ 0", "2 por mês"],
                  ["Avulso", "R$ 4,90", "1 contrato"],
                  ["Mensal", "R$ 19/mês", "Ilimitados no período"],
                  ["Semestral", "R$ 89/6 meses", "Ilimitados no período"],
                  ["Anual", "R$ 159/ano", "Ilimitados no período"],
                ].map(([plano, valor, contratos], i) => (
                  <tr
                    key={i}
                    className="border-t border-outline-variant/15 hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="p-3 font-medium text-on-surface">{plano}</td>
                    <td className="p-3">{valor}</td>
                    <td className="p-3">{contratos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 text-on-surface-variant text-sm">
            <p>
              <span className="font-semibold text-on-surface">Formas de pagamento:</span>{" "}
              cartão de crédito via Stripe e Pix via AbacatePay.
            </p>
            <p>
              <span className="font-semibold text-on-surface">Política de reembolso:</span>{" "}
              não há reembolso após a geração do contrato, pois o serviço é
              consumido no ato. Em caso de falha técnica comprovada, entre em
              contato pelo e-mail de suporte.
            </p>
          </div>
        </section>

        {/* 4. Uso adequado */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            4. Uso adequado
          </h2>
          <p className="text-on-surface-variant mb-4">
            Ao usar o ContratoFácil, você se compromete a não:
          </p>
          <div className="space-y-2">
            {[
              "Usar a plataforma para fins ilegais, fraudulentos ou que violem direitos de terceiros.",
              "Revender, sublicenciar ou apresentar os contratos gerados como produto ou serviço próprio.",
              "Tentar burlar, contornar ou manipular os limites de contratos do plano gratuito.",
              "Usar scripts, bots ou automações para gerar contratos em massa sem plano adequado.",
              "Inserir dados falsos, de terceiros sem autorização ou informações que possam prejudicar outras pessoas.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-error text-base mt-0.5 shrink-0">
                  block
                </span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-on-surface-variant">
            O descumprimento pode resultar na suspensão ou exclusão imediata da
            conta, sem reembolso dos valores pagos.
          </p>
        </section>

        {/* 5. Propriedade intelectual */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            5. Propriedade intelectual
          </h2>
          <div className="space-y-3">
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <p className="font-semibold text-on-surface mb-1">Da FlowIQ</p>
              <p className="text-on-surface-variant text-sm">
                O sistema, interface, prompts de IA, lógica de negócio, marca e
                todo o código-fonte do ContratoFácil são propriedade exclusiva da
                FlowIQ, protegidos pela legislação de direitos autorais.
              </p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <p className="font-semibold text-on-surface mb-1">Do usuário</p>
              <p className="text-on-surface-variant text-sm">
                O contrato gerado a partir dos dados inseridos por você{" "}
                <strong className="text-on-surface">pertence a você</strong>. A
                FlowIQ não reivindica propriedade sobre o conteúdo do documento final.
              </p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <p className="font-semibold text-on-surface mb-1">Melhoria do serviço</p>
              <p className="text-on-surface-variant text-sm">
                A FlowIQ pode usar dados{" "}
                <strong className="text-on-surface">anonimizados e agregados</strong>{" "}
                para aprimorar os modelos de IA e a qualidade dos contratos gerados.
                Nenhum dado pessoal identificável será usado para esse fim.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Limitação de responsabilidade */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            6. Limitação de responsabilidade
          </h2>
          <div className="space-y-3 text-on-surface-variant">
            <p>
              Os contratos gerados pelo ContratoFácil são produzidos por inteligência
              artificial e podem conter imprecisões, omissões ou inadequações para
              situações específicas.{" "}
              <strong className="text-on-surface">
                O usuário é responsável por revisar o contrato antes de assinar ou
                enviar ao cliente.
              </strong>
            </p>
            <p>
              A FlowIQ não se responsabiliza por perdas financeiras, danos materiais
              ou morais decorrentes do uso ou interpretação dos contratos gerados,
              nem por decisões judiciais baseadas nesses documentos.
            </p>
            <p>
              A disponibilidade do serviço não é garantida 24 horas por dia, 7 dias
              por semana. Podemos realizar manutenções, atualizações ou enfrentar
              interrupções técnicas sem aviso prévio.
            </p>
          </div>
        </section>

        {/* 7. Contratos armazenados */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            7. Contratos armazenados
          </h2>
          <div className="space-y-3 text-on-surface-variant">
            <p>
              <span className="font-semibold text-on-surface">Plano gratuito:</span>{" "}
              contratos ficam disponíveis por até{" "}
              <strong className="text-on-surface">30 dias</strong> após a criação.
              Após esse prazo, podem ser removidos automaticamente.
            </p>
            <p>
              <span className="font-semibold text-on-surface">Planos pagos:</span>{" "}
              contratos ficam disponíveis enquanto a assinatura estiver ativa.
            </p>
            <p>
              Recomendamos fazer o download em PDF de todos os contratos importantes
              logo após a geração, independentemente do plano.
            </p>
          </div>
        </section>

        {/* 8. Cancelamento */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            8. Cancelamento de conta
          </h2>
          <div className="space-y-3 text-on-surface-variant">
            <p>
              Você pode cancelar sua assinatura a qualquer momento pelo painel da
              conta ou pelo e-mail de contato. Após o cancelamento, o acesso ao plano
              pago continua até o fim do período já pago.
            </p>
            <p>
              Para excluir permanentemente sua conta e todos os dados associados,
              envie um e-mail para{" "}
              <a
                href="mailto:contato@contratofacil.com.br"
                className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                contato@contratofacil.com.br
              </a>{" "}
              com o assunto <strong className="text-on-surface">"Excluir minha conta"</strong>.
              Processaremos a solicitação em até 15 dias úteis.
            </p>
          </div>
        </section>

        {/* 9. Modificações */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            9. Modificações dos termos
          </h2>
          <div className="space-y-3 text-on-surface-variant">
            <p>
              A FlowIQ pode atualizar estes Termos de Uso a qualquer momento.
              Quando houver mudanças relevantes, notificaremos os usuários com conta
              ativa por e-mail com antecedência razoável.
            </p>
            <p>
              O uso continuado da plataforma após a entrada em vigor das mudanças
              constitui aceitação dos novos termos. Se não concordar com as
              alterações, você pode cancelar sua conta antes da data de vigência.
            </p>
          </div>
        </section>

        {/* 10. Lei e foro */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            10. Lei aplicável e foro
          </h2>
          <p className="text-on-surface-variant">
            Estes Termos são regidos pelas leis da{" "}
            <strong className="text-on-surface">República Federativa do Brasil</strong>.
            Eventuais disputas serão submetidas ao foro da{" "}
            <strong className="text-on-surface">Comarca de Betim — MG</strong>, com
            renúncia expressa a qualquer outro, por mais privilegiado que seja.
          </p>
        </section>

        {/* Contato */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
            Contato
          </h2>
          <p className="text-on-surface-variant mb-3">
            Dúvidas sobre estes termos? Fale com a gente:
          </p>
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15 inline-flex flex-col gap-1">
            <p className="font-semibold text-on-surface">FlowIQ — ContratoFácil</p>
            <a
              href="mailto:contato@contratofacil.com.br"
              className="text-primary text-sm underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              contato@contratofacil.com.br
            </a>
          </div>
        </section>

        {/* Rodapé da página */}
        <div className="pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} FlowIQ — ContratoFácil. Lei aplicável:
            legislação brasileira.
          </p>
          <div className="flex gap-4 text-xs">
            <Link
              href="/politica-de-privacidade"
              className="text-primary hover:opacity-80 transition-opacity font-medium"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/"
              className="text-primary hover:opacity-80 transition-opacity font-medium"
            >
              Voltar ao início
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
