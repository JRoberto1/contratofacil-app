import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ── Rate limiting (in-memory, por IP) ────────────────────────────────────────
// Limites conservadores para rotas que chamam serviços externos pagos (Groq, Stripe)
const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/gerar-contrato": { max: 10, windowMs: 60_000 },   // 10 req/min
  "/api/gerar-pdf":      { max: 20, windowMs: 60_000 },   // 20 req/min
  "/api/criar-checkout": { max: 5,  windowMs: 60_000 },   // 5 req/min
  "/api/salvar-contrato":{ max: 20, windowMs: 60_000 },   // 20 req/min
};

// Map: "ip:rota" → { count, resetAt }
const counters = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, path: string): boolean {
  const limit = RATE_LIMITS[path];
  if (!limit) return true;

  const key = `${ip}:${path}`;
  const now = Date.now();
  const entry = counters.get(key);

  if (!entry || now > entry.resetAt) {
    counters.set(key, { count: 1, resetAt: now + limit.windowMs });
    return true;
  }

  if (entry.count >= limit.max) return false;

  entry.count++;
  return true;
}

// ── Auth session renewal (Supabase SSR) ──────────────────────────────────────
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rate limit check
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip, path)) {
    return NextResponse.json(
      { success: false, error: { code: "RATE_LIMITED", message: "Muitas requisições. Aguarde um momento." } },
      { status: 429 }
    );
  }

  // Supabase session renewal
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
