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

    const isPrimeiroAcesso = !perfil;

    if (isPrimeiroAcesso && process.env.RESEND_API_KEY) {
      const user = sessionData.user;
      const emailUsuario = user.email ?? "";
      const nomeUsuario  = user.user_metadata?.full_name
                        ?? user.user_metadata?.name
                        ?? emailUsuario.split("@")[0];
      // Fire-and-forget — não bloqueia o redirect
      import("@/lib/email")
        .then(({ enviarBoasVindas }) =>
          enviarBoasVindas({ para: emailUsuario, nome: nomeUsuario })
        )
        .catch(() => null);
    }

    // Sem perfil = primeiro acesso → /gerar; com perfil = login normal → dashboard
    const destino = isPrimeiroAcesso ? "/gerar" : "/meus-contratos";
    return NextResponse.redirect(`${origin}${destino}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
