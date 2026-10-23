// components/quiz/ranking-screen.tsx
"use client";

import { useState } from "react";

export type RankingEntry = {
  posicao: number;
  iniciais: string;   // ex.: "AS"
  nome: string;       // "Você" na linha do jogador atual
  pontos: number;
  voce?: boolean;     // true destaca a linha do jogador
};

type Props = {
  geral: RankingEntry[];
  // Sem lista da turma (participante ainda não cadastrado), a aba "Minha
  // turma" não aparece.
  turma?: RankingEntry[];
  // 0 = quem está vendo não está no ranking (ex.: abriu pela tela inicial
  // antes de jogar): mostra só o total de participantes.
  minhaPosicao: number;
  totalParticipantes: number;
  // Opcional: posição/total dentro da turma, mostrados na aba "Minha turma".
  minhaPosicaoTurma?: number;
  totalTurma?: number;
  onVoltar: () => void;
};

export function RankingScreen({
  geral,
  turma,
  minhaPosicao,
  totalParticipantes,
  minhaPosicaoTurma,
  totalTurma,
  onVoltar,
}: Props) {
  const [aba, setAba] = useState<"geral" | "turma">("geral");
  const lista = aba === "turma" && turma ? turma : geral;
  const naTurma = aba === "turma" && minhaPosicaoTurma && totalTurma;
  const posicao = naTurma ? minhaPosicaoTurma : minhaPosicao;
  const total = naTurma ? totalTurma : totalParticipantes;

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border-[0.5px] border-[var(--quiz-border)] bg-[var(--quiz-surface)] px-5 py-[22px]">
      {/* Cabeçalho */}
      <div className="flex items-center gap-[10px]">
        <button type="button" onClick={onVoltar} aria-label="Voltar" className="text-[22px] text-[var(--quiz-text-muted)]">
          ‹
        </button>
        <span className="text-[18px] font-medium text-[var(--quiz-text)]">Ranking</span>
      </div>

      {/* Abas */}
      <div className="flex w-full gap-2">
        <button
          type="button"
          onClick={() => setAba("geral")}
          className={`flex-1 rounded-full py-[7px] text-[13px] font-medium ${
            aba === "geral"
              ? "bg-[var(--quiz-green)] text-[var(--quiz-on-green)]"
              : "border-[0.5px] border-[var(--quiz-border)] text-[var(--quiz-text-muted)]"
          }`}
        >
          Geral
        </button>
        {turma && (
          <button
            type="button"
            onClick={() => setAba("turma")}
            className={`flex-1 rounded-full py-[7px] text-[13px] font-medium ${
              aba === "turma"
                ? "bg-[var(--quiz-green)] text-[var(--quiz-on-green)]"
                : "border-[0.5px] border-[var(--quiz-border)] text-[var(--quiz-text-muted)]"
            }`}
          >
            Minha turma
          </button>
        )}
      </div>

      {/* Posição do jogador */}
      <p className="text-[12px] text-[var(--quiz-text-muted)]">
        {posicao
          ? `Você está em ${posicao}º de ${total} participantes`
          : `${total} ${total === 1 ? "participante" : "participantes"}`}
      </p>

      {/* Lista */}
      <div className="flex w-full flex-col gap-[2px]">
        {lista.map((e) => (
          <div
            key={`${e.posicao}-${e.nome}`}
            className={`flex items-center gap-3 px-2 py-[10px] ${
              e.voce
                ? "rounded-[10px] border border-[var(--quiz-green-border)] bg-[var(--quiz-green-tint)]"
                : ""
            }`}
          >
            <span
              className={`w-[18px] text-center text-[14px] font-medium ${
                e.voce ? "text-[var(--quiz-green-ink)]" : "text-[var(--quiz-text-muted)]"
              }`}
            >
              {e.posicao}
            </span>
            <div
              className={`flex size-[34px] items-center justify-center rounded-[17px] ${
                e.voce ? "bg-[var(--quiz-green)]" : "bg-[var(--quiz-surface-2)]"
              }`}
            >
              <span
                className={`text-[12px] font-medium ${
                  e.voce ? "text-[var(--quiz-on-green)]" : "text-[var(--quiz-text-muted)]"
                }`}
              >
                {e.iniciais}
              </span>
            </div>
            <span
              className={`flex-1 text-[14px] ${
                e.voce ? "font-medium text-[var(--quiz-green-ink)]" : "text-[var(--quiz-text)]"
              }`}
            >
              {e.nome}
            </span>
            <span
              className={`text-[14px] font-medium ${
                e.voce ? "text-[var(--quiz-green-ink)]" : "text-[var(--quiz-text)]"
              }`}
            >
              {e.pontos}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
