"use client";

import { useEffect, useState } from "react";

import { getRanking, type LinhaRanking } from "@/lib/quiz/partidas";

type Props = {
  // Partida do jogador atual, destacada na lista.
  partidaId: string;
  onJogarNovamente: () => void;
  onVoltar: () => void;
};

const TOP = 10;

// Ranking (frame 05): melhores pontuações + destaque da partida atual.
// Se a partida atual estiver fora do top, ela aparece no fim, separada.
export function RankingScreen({ partidaId, onJogarNovamente, onVoltar }: Props) {
  const [linhas, setLinhas] = useState<LinhaRanking[] | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    getRanking(partidaId, TOP)
      .then(setLinhas)
      .catch((e: unknown) => {
        console.error(e);
        setErro(true);
      });
  }, [partidaId]);

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border-[0.5px] border-[#dad7ce] bg-white p-5">
      <div className="flex flex-col gap-1 text-center">
        <span className="text-[32px]" aria-hidden>
          🏅
        </span>
        <h2 className="text-[22px] font-medium text-[#1b1b19]">Ranking</h2>
        <p className="text-[13px] text-[#706f68]">Melhores pontuações</p>
      </div>

      {erro ? (
        <p className="text-center text-[13px] text-[#c0392b]">
          Não foi possível carregar o ranking.
        </p>
      ) : linhas === null ? (
        <p className="text-center text-[13px] text-[#706f68]">Carregando…</p>
      ) : (
        <ol className="flex flex-col gap-[6px]">
          {linhas.map((l, i) => {
            const minha = l.partida_id === partidaId;
            // Linha "…" quando a partida atual está fora do top.
            const salto = i > 0 && l.posicao > linhas[i - 1].posicao + 1;
            return (
              <li key={l.partida_id} className="flex flex-col gap-[6px]">
                {salto && (
                  <span className="text-center text-[13px] text-[#9e9d94]">…</span>
                )}
                <div
                  data-minha={minha || undefined}
                  className={`flex items-center gap-3 rounded-[10px] px-3 py-[10px] ${
                    minha
                      ? "border-[1.5px] border-[#5dc9a5] bg-[#e1f5ee]"
                      : "border-[0.5px] border-[#dad7ce]"
                  }`}
                >
                  <span
                    className={`w-6 shrink-0 text-center text-[14px] font-semibold ${
                      l.posicao <= 3 ? "text-[#196e56]" : "text-[#9e9d94]"
                    }`}
                  >
                    {l.posicao}º
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[14px] font-medium text-[#1b1b19]">
                      {l.nome}
                      {minha && <span className="text-[#196e56]"> · você</span>}
                    </span>
                    {l.turma && (
                      <span className="truncate text-[12px] text-[#706f68]">{l.turma}</span>
                    )}
                  </div>
                  <span className="shrink-0 text-[14px] font-semibold text-[#196e56]">
                    {l.pontuacao} pts
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="flex w-full flex-col gap-[10px]">
        <button
          type="button"
          onClick={onJogarNovamente}
          className="flex w-full items-center justify-center rounded-xl bg-[#196e56] py-[13px] text-[15px] font-medium text-white"
        >
          Jogar de novo
        </button>
        <button
          type="button"
          onClick={onVoltar}
          className="flex w-full items-center justify-center rounded-xl border-[0.5px] border-[#dad7ce] py-[13px] text-[15px] font-medium text-[#196e56] transition-colors hover:border-[#5dc9a5]"
        >
          Voltar ao resultado
        </button>
      </div>
    </div>
  );
}
