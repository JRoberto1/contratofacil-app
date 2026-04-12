"use client";

import { useEffect, useState } from "react";
import ModalLogin from "./ModalLogin";

// Componente que escuta o evento global "abrir-login" e renderiza o modal
export default function LoginGuard() {
  const [aberto, setAberto] = useState(false);
  const [next, setNext] = useState("/");

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail;
      setNext(detail?.next ?? window.location.pathname);
      setAberto(true);
    }
    window.addEventListener("abrir-login", handler);
    return () => window.removeEventListener("abrir-login", handler);
  }, []);

  if (!aberto) return null;

  return (
    <ModalLogin
      next={next}
      onClose={() => setAberto(false)}
    />
  );
}
