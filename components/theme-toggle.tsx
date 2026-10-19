"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

// Botão de alternar tema claro/escuro, fixo no canto superior direito.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // O tema só é conhecido no navegador; antes disso não renderizamos o
  // ícone, para o HTML do servidor e o do navegador não divergirem.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  const escuro = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(escuro ? "light" : "dark")}
      aria-label={escuro ? "Usar tema claro" : "Usar tema escuro"}
      title={escuro ? "Tema claro" : "Tema escuro"}
      className="fixed right-4 top-4 z-50 flex size-10 items-center justify-center rounded-full border-[0.5px] border-[var(--quiz-border)] bg-[var(--quiz-surface)] text-[var(--quiz-text-muted)] transition-colors hover:border-[var(--quiz-green-border)] hover:text-[var(--quiz-green-ink)]"
    >
      {montado && (escuro ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />)}
    </button>
  );
}
