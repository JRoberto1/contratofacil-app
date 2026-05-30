"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function EsqueciSenhaPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setErro("Informe seu e-mail."); return; }

    setCarregando(true);
    setErro(null);

    const redirectTo = `${window.location.origin}/auth/nova-senha`;

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });

    setCarregando(false);

    if (error) {
      setErro("Não foi possível enviar o link. Verifique o e-mail e tente novamente.");
      return;
    }

    setEnviado(true);
  }

  return (
    <div className="min-h-screen w-full bg-surface flex flex-col items-center py-10 px-4">
      <div className="w-full flex justify-center mb-auto pt-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">gavel</span>
          <span className="text-xl font-extrabold bg-gradient-to-r from-[#0040a1] to-[#0056d2] bg-clip-text text-transparent font-headline tracking-tight">ContratoFácil</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[400px]">

        {enviado ? (
          <div className="w-full bg-surface-container-low p-2 rounded-[2.5rem] shadow-sm text-center">
            <div className="bg-surface-container-lowest rounded-[2.25rem] px-8 py-10 flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#2e7d32] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
              </div>
              <h1 className="text-xl font-extrabold font-headline text-on-surface">Verifique seu e-mail</h1>
              <p className="text-sm font-body text-on-surface-variant leading-relaxed text-center">
                Enviamos um link para <strong>{email}</strong>. Clique nele para redefinir sua senha.
              </p>
              <p className="text-xs font-body text-outline text-center">
                Não encontrou? Verifique a pasta de spam.
              </p>
              <Link href="/login" className="text-sm font-bold text-primary hover:underline mt-2">
                ← Voltar para o login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface mb-2">Recuperar senha</h1>
              <p className="text-sm font-body text-on-surface-variant">
                Informe seu e-mail e enviaremos um link para criar uma nova senha.
              </p>
            </div>

            <div className="w-full bg-surface-container-low p-2 rounded-[2.5rem] shadow-sm">
              <div className="w-full bg-surface-container-lowest rounded-[2.25rem] px-8 py-10">

                {erro && (
                  <div className="mb-4 px-4 py-3 bg-error-container/30 border border-error/20 rounded-xl text-sm text-error font-body">
                    {erro}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold font-headline text-on-surface mb-2">Seu e-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nome@exemplo.com"
                      className="w-full bg-surface-container-high rounded-xl py-4 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                      disabled={carregando}
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={carregando}
                    className="w-full signature-gradient text-white py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60"
                  >
                    {carregando ? "Enviando…" : "Enviar link de recuperação"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/login" className="text-sm font-body text-primary font-bold hover:underline">
                    ← Voltar para o login
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-auto pt-8">
        <p className="font-label text-xs font-bold uppercase tracking-widest text-outline">Um produto FlowIQ</p>
      </div>
    </div>
  );
}
