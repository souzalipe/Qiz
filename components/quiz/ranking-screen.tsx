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
  turma?: RankingEntry[];
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
    <div className="flex w-full flex-col gap-4 rounded-3xl border-[0.5px] border-[#dad7ce] bg-white px-5 py-[22px]">
      {/* Cabeçalho */}
      <div className="flex items-center gap-[10px]">
        <button type="button" onClick={onVoltar} aria-label="Voltar" className="text-[22px] text-[#706f68]">
          ‹
        </button>
        <span className="text-[18px] font-medium text-[#1b1b19]">Ranking</span>
      </div>

      {/* Abas */}
      <div className="flex w-full gap-2">
        <button
          type="button"
          onClick={() => setAba("geral")}
          className={`flex-1 rounded-full py-[7px] text-[13px] font-medium ${
            aba === "geral"
              ? "bg-[#196e56] text-white"
              : "border-[0.5px] border-[#dad7ce] text-[#706f68]"
          }`}
        >
          Geral
        </button>
        <button
          type="button"
          onClick={() => setAba("turma")}
          className={`flex-1 rounded-full py-[7px] text-[13px] font-medium ${
            aba === "turma"
              ? "bg-[#196e56] text-white"
              : "border-[0.5px] border-[#dad7ce] text-[#706f68]"
          }`}
        >
          Minha turma
        </button>
      </div>

      {/* Posição do jogador */}
      <p className="text-[12px] text-[#706f68]">
        Você está em {posicao}º de {total} participantes
      </p>

      {/* Lista */}
      <div className="flex w-full flex-col gap-[2px]">
        {lista.map((e) => (
          <div
            key={`${e.posicao}-${e.nome}`}
            className={`flex items-center gap-3 px-2 py-[10px] ${
              e.voce
                ? "rounded-[10px] border border-[#5dc9a5] bg-[#e1f5ee]"
                : ""
            }`}
          >
            <span
              className={`w-[18px] text-center text-[14px] font-medium ${
                e.voce ? "text-[#196e56]" : "text-[#706f68]"
              }`}
            >
              {e.posicao}
            </span>
            <div
              className={`flex size-[34px] items-center justify-center rounded-[17px] ${
                e.voce ? "bg-[#196e56]" : "bg-[#f4f2ec]"
              }`}
            >
              <span
                className={`text-[12px] font-medium ${
                  e.voce ? "text-white" : "text-[#706f68]"
                }`}
              >
                {e.iniciais}
              </span>
            </div>
            <span
              className={`flex-1 text-[14px] ${
                e.voce ? "font-medium text-[#196e56]" : "text-[#1b1b19]"
              }`}
            >
              {e.nome}
            </span>
            <span
              className={`text-[14px] font-medium ${
                e.voce ? "text-[#196e56]" : "text-[#1b1b19]"
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
