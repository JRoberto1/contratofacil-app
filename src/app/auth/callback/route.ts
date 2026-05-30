// Rota de callback OAuth — Supabase troca o code por uma sessão
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/meus-contratos";

  if (!code) {
    return NextResponse.redirect(`${origin}/?erro=auth`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback]", error.message);
    return NextResponse.redirect(`${origin}/?erro=auth`);
  }

  // next=auto: detecta primeiro acesso Google verificando se perfil existe
  if (next === "auto" && sessionData?.user) {
    const { data: perfil } = await supabase
      .from("perfis")
      .select("id")
      .eq("id", sessionData.user.id)
      .maybeSingle();

    // Sem perfil = primeiro acesso → /gerar; com perfil = login normal → dashboard
    const destino = perfil ? "/meus-contratos" : "/gerar";
    return NextResponse.redirect(`${origin}${destino}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
