"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NovaSenhaPage() {
  const router = useRouter();
  const supabase = createClient();

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [sessaoOk, setSessaoOk] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  // Supabase processa o hash da URL automaticamente ao inicializar o client.
  // Aguardamos a sessão estar disponível antes de mostrar o formulário.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setSessaoOk(true);
        setVerificando(false);
      }
    });

    // Timeout de segurança: se em 5s não houver evento, link inválido/expirado
    const timeout = setTimeout(() => setVerificando(false), 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (senha.length < 6) { setErro("A senha deve ter pelo menos 6 caracteres."); return; }
    if (senha !== confirmar) { setErro("As senhas não coincidem."); return; }

    setCarregando(true);

    const { error } = await supabase.auth.updateUser({ password: senha });

    setCarregando(false);

    if (error) {
      setErro("Não foi possível atualizar a senha. O link pode ter expirado — solicite um novo.");
      return;
    }

    setSucesso(true);
    setTimeout(() => router.push("/meus-contratos"), 2500);
  }

  // ── Verificando sessão ───────────────────────────────────────────────────────
  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
      </div>
    );
  }

  // ── Link inválido ou expirado ─────────────────────────────────────────────────
  if (!sessaoOk) {
    return (
      <div className="min-h-screen w-full bg-surface flex flex-col items-center justify-center px-4 text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-error text-3xl">link_off</span>
        </div>
        <h1 className="text-2xl font-extrabold font-headline text-on-surface">Link inválido ou expirado</h1>
        <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
          Este link de recuperação não é mais válido. Solicite um novo link de recuperação.
        </p>
        <Link
          href="/auth/esqueci-senha"
          className="signature-gradient text-white font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
        >
          Solicitar novo link
        </Link>
      </div>
    );
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

        {sucesso ? (
          <div className="w-full bg-surface-container-low p-2 rounded-[2.5rem] shadow-sm text-center">
            <div className="bg-surface-container-lowest rounded-[2.25rem] px-8 py-10 flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#2e7d32] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h1 className="text-xl font-extrabold font-headline text-on-surface">Senha atualizada!</h1>
              <p className="text-sm font-body text-on-surface-variant">
                Redirecionando para o seu painel…
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface mb-2">Criar nova senha</h1>
              <p className="text-sm font-body text-on-surface-variant">
                Escolha uma senha segura com pelo menos 6 caracteres.
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
                    <label className="block text-sm font-bold font-headline text-on-surface mb-2">Nova senha</label>
                    <div className="relative">
                      <input
                        type={showSenha ? "text" : "password"}
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-surface-container-high rounded-xl py-4 pl-4 pr-12 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                        disabled={carregando}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenha(!showSenha)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none"
                      >
                        <span className="material-symbols-outlined text-xl">{showSenha ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold font-headline text-on-surface mb-2">Confirmar nova senha</label>
                    <input
                      type={showSenha ? "text" : "password"}
                      value={confirmar}
                      onChange={e => setConfirmar(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-container-high rounded-xl py-4 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                      disabled={carregando}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={carregando}
                    className="w-full signature-gradient text-white py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60"
                  >
                    {carregando ? "Salvando…" : "Salvar nova senha"}
                  </button>
                </form>
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
