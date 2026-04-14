import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Você precisa estar logado para liberar o perfil de teste.' }, { status: 401 });
    }

    // Libera o perfil promovendo-o a um plano alto e vários contratos disponíveis
    const { error } = await supabase
      .from('perfis')
      .update({
        plano: 'anual',
        contratos_mes: 999
      })
      .eq('id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Erro ao dar upgrade no perfil.', detail: error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Seu perfil foi 100% liberado para testes (Plano: Anual, Contratos Inclusos: 999).'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
