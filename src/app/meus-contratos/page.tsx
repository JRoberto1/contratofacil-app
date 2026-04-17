import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MeusContratosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: contratos } = await supabase
    .from('contratos')
    .select('id, categoria, categoria_custom, cliente_nome, status, criado_em')
    .order('criado_em', { ascending: false });

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
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-[0_20px_40px_rgba(0,43,115,0.03)]">
            <div className="w-20 h-20 bg-secondary-container/30 text-primary rounded-full flex flex-col items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>draft</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-4 font-headline">Você ainda não tem contratos gerados.</h2>
            <p className="text-on-surface-variant font-body mb-10 max-w-md mx-auto leading-relaxed">
              Nossa inteligência artificial cria as cláusulas perfeitas para sua área de atuação em menos de 2 minutos. Que tal começar agora?
            </p>
            <Link
              href="/gerar"
              className="signature-gradient text-white rounded-full px-8 py-4 font-bold font-headline shadow-[0_10px_20px_rgba(0,64,161,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Gerar meu primeiro contrato
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {contratos.map(item => (
              <Link key={item.id} href={`/contrato/${item.id}`} className="block group">
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md group-hover:border-primary/50 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-headline font-bold text-lg text-on-surface">
                          {item.cliente_nome}
                        </h3>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.status === 'gerando' ? 'bg-[#ffeedb] text-[#8c5200]' : 'bg-secondary-container/50 text-primary'}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">work</span>
                        {item.categoria_custom || item.categoria}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:underline">
                      Ver detalhes
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
