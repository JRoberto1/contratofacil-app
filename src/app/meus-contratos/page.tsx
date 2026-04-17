import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardContratosLayout } from "@/components/contrato/DashboardContratosLayout";

export default async function MeusContratosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: contratos } = await supabase
    .from('contratos')
    .select('id, referencia, usuario_id, categoria, categoria_custom, cliente_nome, prestador_nome, servico_valor, status, conteudo, tipo, imutavel, downloads_count, criado_em')
    .eq('usuario_id', user.id)
    .order('criado_em', { ascending: false });

  const { data: perfil } = await supabase
    .from('perfis')
    .select('contratos_mes, contratos_usados_mes')
    .eq('user_id', user.id)
    .single();

  const cotaDisponivel = perfil ? Math.max(0, perfil.contratos_mes - (perfil.contratos_usados_mes || 0)) : 0;

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
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm">
            <div className="w-20 h-20 bg-secondary-container/30 text-primary rounded-full flex flex-col items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>draft</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-4 font-headline">Você ainda não tem contratos gerados.</h2>
            <p className="text-on-surface-variant font-body mb-10 max-w-md mx-auto leading-relaxed">
              Nossa inteligência artificial cria as cláusulas perfeitas para sua área de atuação em menos de 2 minutos. Que tal começar agora?
            </p>
            <Link
              href="/gerar"
              className="signature-gradient text-white rounded-full px-8 py-4 font-bold font-headline shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Gerar meu primeiro contrato
            </Link>
          </div>
        ) : (
          <DashboardContratosLayout contratos={contratos || []} cotaDisponivel={cotaDisponivel} />
        )}
      </div>
    </div>
  );
}
