import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardContratosLayout } from "@/components/contrato/DashboardContratosLayout";

export const metadata: Metadata = {
  title: "Meus Contratos | ContratoFácil",
  description: "Gerencie seus contratos, acompanhe aceites e baixe seus documentos.",
};

export const dynamic = 'force-dynamic';

export default async function MeusContratosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: contratos, error: contratosError } = await supabase
    .from('contratos')
    .select('id, referencia, usuario_id, categoria, categoria_custom, cliente_nome, prestador_nome, servico_valor, status, conteudo, tipo, imutavel, downloads_count, criado_em, token_aceite, token_expira_em, aceite_em, aceite_status')
    .eq('usuario_id', user.id)
    .order('criado_em', { ascending: false });

  // contratosError é tratado na UI abaixo — sem log em produção

  const { data: perfil } = await supabase
    .from('perfis')
    .select('contratos_mes, contratos_usados_mes, periodo_reset, plano')
    .eq('id', user.id)
    .single();

  // Plano grátis = 2 contratos/mês por padrão quando perfil não existe
  const cotaDisponivel = perfil
    ? Math.max(0, (perfil.contratos_mes ?? 2) - (perfil.contratos_usados_mes || 0))
    : 2;

  const periodoReset: string | null = perfil?.periodo_reset ?? null;
  const plano: string | null = perfil?.plano ?? null;

  if (contratosError) {
    return (
      <div className="min-h-screen bg-surface flex flex-col pt-12 pb-24 px-6 md:px-12 items-center justify-center text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-3xl">database</span>
        </div>
        <h1 className="text-3xl font-headline font-bold text-on-surface mb-4">Atualização de Banco Pendente</h1>
        <p className="text-on-surface-variant font-body mb-8 max-w-md leading-relaxed">
          Nós criamos a nova aba de Meus Contratos, mas ela requer que o <strong>banco de dados (Supabase)</strong> seja atualizado com as novas configurações de segurança.<br/><br/>
          Por favor, rode o script SQL que te enviei no painel do Supabase.
        </p>
        <div className="bg-surface-container-lowest border border-error/20 p-4 rounded-xl text-left">
          <p className="text-xs font-mono text-error/80 font-bold mb-1">ERRO TÉCNICO:</p>
          <code className="text-sm font-mono text-on-surface-variant">{contratosError.message}</code>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-12 pb-24 px-6 md:px-12 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4 font-headline">Meus Contratos</h1>
          <p className="text-on-surface-variant text-lg font-body max-w-2xl">
            Gerencie e revise todos os contratos e rascunhos salvos na sua conta.
          </p>
        </div>

        {!contratos || contratos.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center min-h-[420px] gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[40px]">description</span>
            </div>
            <div className="space-y-3 max-w-sm">
              <h2 className="text-2xl font-bold font-headline text-on-surface">Você ainda não tem contratos</h2>
              <p className="text-on-surface-variant font-body leading-relaxed">
                Gere seu primeiro contrato em menos de 5 minutos — sem precisar saber nada de direito.
              </p>
            </div>
            <Link
              href="/gerar"
              className="signature-gradient text-white rounded-full px-10 py-4 font-bold font-headline shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
            >
              Gerar meu primeiro contrato
            </Link>
          </div>
        ) : (
          <DashboardContratosLayout contratos={contratos || []} cotaDisponivel={cotaDisponivel} periodoReset={periodoReset} plano={plano} />
        )}
      </div>
    </div>
  );
}
