import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const checks: Record<string, "ok" | "error"> = {};

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('perfis').select('id').limit(1);
    checks.supabase = error ? "error" : "ok";
  } catch {
    checks.supabase = "error";
  }

  checks.groq_key = process.env.GROQ_API_KEY ? "ok" : "error";
  checks.supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL ? "ok" : "error";

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    { status: allOk ? "ok" : "degraded", checks, ts: new Date().toISOString() },
    { status: allOk ? 200 : 503 }
  );
}
