"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

import { GlossaryScreen } from "@/components/quiz/glossary-screen";

type Props = {
  aberto: boolean;
  onFechar: () => void;
};

// Mostra o glossário POR CIMA da tela atual (camada fixa), em vez de trocar
// de rota: assim o "voltar" retorna exatamente para onde a pessoa estava —
// formulário preenchido, resultado ou ranking — sem perder a partida.
export function GlossaryOverlay({ aberto, onFechar }: Props) {
  // Tecla Esc também fecha.
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, onFechar]);

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          key="glossario"
          role="dialog"
          aria-modal="true"
          aria-label="Glossário"
          className="fixed inset-0 z-40 overflow-y-auto bg-[var(--quiz-bg)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="mx-auto w-full max-w-[420px] px-4 pb-6 pt-16">
            <GlossaryScreen onVoltar={onFechar} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
