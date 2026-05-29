"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function loginGoogle() {
    setErro(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setErro(error.message);
  }

  async function loginEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setErro("Preencha e-mail e senha."); return; }
    setCarregando(true);
    setErro(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErro(error.message === "Invalid login credentials"
        ? "E-mail ou senha incorretos."
        : error.message);
      setCarregando(false);
    } else {
      router.push("/meus-contratos");
    }
  }

  return (
    <div className="min-h-screen w-full bg-surface flex flex-col items-center py-10 px-4">
      {/* Brand Navbar Minimal */}
      <div className="w-full flex justify-center mb-auto pt-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform" data-icon="gavel">gavel</span>
          <span className="text-xl font-extrabold bg-gradient-to-r from-[#0040a1] to-[#0056d2] bg-clip-text text-transparent font-headline tracking-tight">ContratoFácil</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[400px]">

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface mb-2">Quase lá — seu contrato está pronto</h1>
          <p className="text-sm font-body text-on-surface-variant">Finalize sua autenticação para acessar o documento com segurança.</p>
        </div>

        {/* Container Externo */}
        <div className="w-full bg-surface-container-low p-2 rounded-[2.5rem] shadow-sm">
          {/* Container Interno */}
          <div className="w-full bg-surface-container-lowest rounded-[2.25rem] px-8 py-10">

            {/* Botão Google */}
            <button
              onClick={loginGoogle}
              className="w-full bg-white border border-outline-variant/30 rounded-2xl py-4 flex items-center justify-center gap-3 hover:bg-surface-container-lowest transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary mb-8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              <span className="font-headline font-bold text-[16px] text-on-surface">Continuar com Google</span>
            </button>

            {/* Separador */}
            <div className="flex items-center w-full mb-8">
              <div className="flex-grow h-px bg-outline-variant/30"></div>
              <span className="px-4 text-[10px] font-bold font-body text-outline uppercase tracking-[0.2em]">Entrar com E-mail</span>
              <div className="flex-grow h-px bg-outline-variant/30"></div>
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div className="mb-4 px-4 py-3 bg-error-container/30 border border-error/20 rounded-xl text-sm text-error font-body">
                {erro}
              </div>
            )}

            {/* Formulário */}
            <form className="space-y-5" onSubmit={loginEmail}>
              <div>
                <label className="block text-sm font-bold font-headline text-on-surface mb-2">Seu e-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nome@exemplo.com"
                  className="w-full bg-surface-container-high rounded-xl py-4 px-4 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                  disabled={carregando}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold font-headline text-on-surface">Senha</label>
                  <a href="#" className="font-body text-[11px] font-bold text-primary uppercase tracking-wider hover:underline">Esqueci</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container-high rounded-xl py-4 pl-4 pr-12 border-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body transition-all"
                    disabled={carregando}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full signature-gradient text-white py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95 mt-4 disabled:opacity-60"
              >
                {carregando ? "Entrando…" : "Continuar"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-body text-on-surface-variant">
                Não tem uma conta? <a href="#" className="text-primary font-bold hover:underline">Criar conta</a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center max-w-xs">
          <p className="text-xs font-body text-outline leading-relaxed">
            Ao continuar, você concorda com os nossos <a href="#" className="underline">Termos de Uso</a> e <a href="#" className="underline">Política de Privacidade</a>.
          </p>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <p className="font-label text-xs font-bold uppercase tracking-widest text-outline">Um produto FlowIQ</p>
      </div>
    </div>
  );
}
