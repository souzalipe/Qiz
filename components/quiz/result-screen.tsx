"use client";

import { bomDesempenho } from "@/lib/quiz/pontuacao";

type Props = {
  pontuacao: number;
  acertos: number;
  total: number;
  onJogarNovamente: () => void;
  // Opcional por enquanto: o ranking entra na Parte B da Fase 4.
  onVerRanking?: () => void;
};

// Tela de resultado ao fim da partida. Tem duas versões, escolhidas pela
// fração de acertos (ver LIMITE_BOM_DESEMPENHO em lib/quiz/pontuacao.ts):
//   - bom desempenho  → frame 03 do Figma
//   - a melhorar      → frame 04 do Figma
export function ResultScreen({
  pontuacao,
  acertos,
  total,
  onJogarNovamente,
  onVerRanking,
}: Props) {
  const bom = bomDesempenho(acertos, total);
  const percentual = total > 0 ? Math.round((acertos / total) * 100) : 0;

  return (
    <div className="flex w-full flex-col items-center gap-5 rounded-3xl border-[0.5px] border-[#dad7ce] bg-white p-6 text-center">
      {/* Ícone: troféu (bom) ou broto (a melhorar) */}
      <div
        className={`flex size-20 items-center justify-center rounded-full text-[36px] ${
          bom ? "bg-[#e1f5ee]" : "bg-[#f4f2ec]"
        }`}
        aria-hidden
      >
        {bom ? "🏆" : "🌱"}
      </div>

      {/* Mensagem */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-medium text-[#1b1b19]">
          {bom ? "Mandou bem!" : "Continue aprendendo!"}
        </h2>
        <p className="text-[14px] leading-[1.4] text-[#706f68]">
          {bom
            ? "Você mostrou que entende de economia circular."
            : "Cada pergunta é uma chance de aprender. Revise os conceitos e tente de novo."}
        </p>
      </div>

      {/* Pontuação */}
      <div className="flex w-full flex-col items-center gap-1 rounded-2xl bg-[#e1f5ee] px-4 py-5">
        <span className="text-[13px] text-[#196e56]">Sua pontuação</span>
        <span
          className="text-[44px] font-semibold leading-none text-[#196e56]"
          data-testid="pontuacao"
        >
          {pontuacao}
        </span>
        <span className="text-[13px] text-[#196e56]">pontos</span>
      </div>

      {/* Acertos / total, com barra */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center justify-between text-[13px] text-[#706f68]">
          <span>Acertos</span>
          <span className="font-medium text-[#1b1b19]" data-testid="acertos">
            {acertos} de {total} ({percentual}%)
          </span>
        </div>
        <div className="h-[6px] w-full overflow-hidden rounded-[3px] bg-[#e1f5ee]">
          <div
            className="h-full rounded-[3px] bg-[#196e56]"
            style={{ width: `${percentual}%` }}
          />
        </div>
      </div>

      {/* Ações */}
      <div className="flex w-full flex-col gap-[10px]">
        <button
          type="button"
          onClick={onVerRanking}
          disabled={!onVerRanking}
          className="flex w-full items-center justify-center rounded-xl bg-[#196e56] py-[13px] text-[15px] font-medium text-white transition-opacity disabled:opacity-40"
        >
          {onVerRanking ? "Ver ranking" : "Ver ranking (em breve)"}
        </button>
        <button
          type="button"
          onClick={onJogarNovamente}
          className="flex w-full items-center justify-center rounded-xl border-[0.5px] border-[#dad7ce] py-[13px] text-[15px] font-medium text-[#196e56] transition-colors hover:border-[#5dc9a5]"
        >
          Jogar de novo
        </button>
      </div>
    </div>
  );
}
