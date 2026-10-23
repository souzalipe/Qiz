// components/quiz/glossary-screen.tsx
"use client";

import { GLOSSARIO } from "@/lib/quiz/glossario";

type Props = {
  onVoltar: () => void;
};

export function GlossaryScreen({ onVoltar }: Props) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border-[0.5px] border-[var(--quiz-border)] bg-[var(--quiz-surface)] px-5 py-[22px]">
      {/* Cabeçalho */}
      <div className="flex items-center gap-[10px]">
        <button type="button" onClick={onVoltar} aria-label="Voltar" className="text-[22px] text-[var(--quiz-text-muted)]">
          ‹
        </button>
        <span className="text-[18px] font-medium text-[var(--quiz-text)]">Glossário</span>
      </div>

      <p className="text-[12px] text-[var(--quiz-text-muted)]">
        Siglas e termos que aparecem no quiz.
      </p>

      {/* Lista */}
      <div className="flex w-full flex-col gap-[10px]">
        {GLOSSARIO.map((item) => (
          <div
            key={item.termo}
            className="flex flex-col gap-1 rounded-[10px] border-[0.5px] border-[var(--quiz-border)] p-3"
          >
            <p className="text-[14px] font-medium text-[var(--quiz-green-ink)]">{item.termo}</p>
            <p className="text-[13px] text-[var(--quiz-text)]">{item.significado}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
