"use client";

import { useEffect, useState } from "react";
import { X, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ModalLoginProps {
  onClose?: () => void;
  next?: string; // rota para redirecionar após login
}

export default function ModalLogin({ onClose, next = "/" }: ModalLoginProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const supabase = createClient();

  // Fecha com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Trava scroll do body enquanto modal aberto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function loginGoogle() {
    setCarregando(true);
    setErro(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setErro("Não foi possível conectar com o Google. Tente novamente.");
      setCarregando(false);
    }
  }

  async function loginEmail() {
    if (!email || !senha) return;
    setCarregando(true);
    setErro(null);

    if (modo === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) {
        setErro("E-mail ou senha incorretos.");
        setCarregando(false);
        return;
      }
      onClose?.();
      window.location.href = next;
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setErro(error.message.includes("already registered")
          ? "Este e-mail já está cadastrado. Faça login."
          : "Erro ao criar conta. Tente novamente.");
        setCarregando(false);
        return;
      }
      setEmailEnviado(true);
      setCarregando(false);
    }
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(25,28,30,0.60)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      {/* Modal */}
      <div
        className="w-full max-w-md rounded-2xl p-8 relative"
        style={{ backgroundColor: "#ffffff", boxShadow: "0 32px 64px rgba(25,28,30,0.20)" }}
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container-highest transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 text-on-surface-variant" />
        </button>

        {emailEnviado ? (
          /* Estado: e-mail de confirmação enviado */
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-on-surface mb-2"
              style={{ fontFamily: "var(--font-headline)" }}>
              Verifique seu e-mail
            </h2>
            <p className="text-on-surface-variant text-sm"
              style={{ fontFamily: "var(--font-body)" }}>
              Enviamos um link de confirmação para <strong>{email}</strong>.
              Clique no link para ativar sua conta.
            </p>
          </div>
        ) : (
          <>
            {/* Cabeçalho */}
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1"
                style={{ fontFamily: "var(--font-body)" }}>
                Quase lá
              </p>
              <h2 className="text-2xl font-extrabold text-on-surface"
                style={{ fontFamily: "var(--font-headline)" }}>
                {modo === "login" ? "Seu contrato está pronto!" : "Crie sua conta grátis"}
              </h2>
              <p className="text-on-surface-variant text-sm mt-1"
                style={{ fontFamily: "var(--font-body)" }}>
                {modo === "login"
                  ? "Entre para baixar o PDF e salvar seu contrato."
                  : "Cadastre-se para acessar e baixar o PDF."}
              </p>
            </div>

            {/* CTA Google — destaque principal */}
            <button
              onClick={loginGoogle}
              disabled={carregando}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-sm transition-all active:scale-[0.98] hover:brightness-95 disabled:opacity-60 mb-5"
              style={{
                fontFamily: "var(--font-body)",
                background: "linear-gradient(135deg, #0040a1 0%, #002b73 100%)",
                color: "#ffffff",
                boxShadow: "0 8px 24px rgba(0,43,115,0.20)",
              }}
            >
              {/* Ícone Google SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar com Google
            </button>

            {/* Separador */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ backgroundColor: "#e0e3e5" }} />
              <span className="text-xs text-on-surface-variant"
                style={{ fontFamily: "var(--font-body)" }}>
                ou use seu e-mail
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "#e0e3e5" }} />
            </div>

            {/* Formulário e-mail */}
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full px-4 py-3.5 rounded-xl text-on-surface placeholder:text-outline outline-none focus:ring-2 focus:ring-primary transition-all"
                style={{ backgroundColor: "#e0e3e5", fontFamily: "var(--font-body)" }}
              />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                onKeyDown={(e) => e.key === "Enter" && loginEmail()}
                className="w-full px-4 py-3.5 rounded-xl text-on-surface placeholder:text-outline outline-none focus:ring-2 focus:ring-primary transition-all"
                style={{ backgroundColor: "#e0e3e5", fontFamily: "var(--font-body)" }}
              />

              {erro && (
                <p className="text-error text-xs px-1"
                  style={{ fontFamily: "var(--font-body)" }}>
                  {erro}
                </p>
              )}

              <button
                onClick={loginEmail}
                disabled={carregando || !email || !senha}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-40"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor: "#e6e8ea",
                  color: "#394f83",
                }}
              >
                {carregando ? "Entrando..." : modo === "login" ? "Entrar" : "Criar conta"}
              </button>
            </div>

            {/* Alternar modo */}
            <p className="text-center text-xs text-on-surface-variant mt-5"
              style={{ fontFamily: "var(--font-body)" }}>
              {modo === "login" ? "Não tem conta? " : "Já tem conta? "}
              <button
                onClick={() => { setModo(modo === "login" ? "cadastro" : "login"); setErro(null); }}
                className="text-primary font-bold underline underline-offset-2"
              >
                {modo === "login" ? "Cadastre-se grátis" : "Fazer login"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
