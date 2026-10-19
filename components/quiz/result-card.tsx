// components/quiz/result-card.tsx
"use client";

import { NumeroAnimado } from "@/components/quiz/numero-animado";
import { LIMITE_BOM_DESEMPENHO } from "@/lib/quiz/pontuacao";

type Desafio = { titulo: string; texto: string };

type Props = {
  pontuacao: number;
  acertos: number;
  total: number;
  onJogarNovo: () => void;
  onVerRanking: () => void;
  onInicio: () => void;
  /** a partir deste percentual de acertos = desempenho "alto" (padrão em lib/quiz/pontuacao.ts) */
  limiar?: number;
  /** desafio prático mostrado no desempenho baixo */
  desafio?: Desafio;
};

const DESAFIO_PADRAO: Desafio = {
  titulo: "Desafio de hoje",
  texto: "Junte as pilhas usadas da sua casa e leve a um ponto de coleta.",
};

export function ResultCard({
  pontuacao,
  acertos,
  total,
  onJogarNovo,
  onVerRanking,
  onInicio,
  limiar = LIMITE_BOM_DESEMPENHO,
  desafio = DESAFIO_PADRAO,
}: Props) {
  const bom = total > 0 && acertos / total >= limiar;

  return (
    <div className="flex w-full flex-col items-center gap-[14px] rounded-3xl border-[0.5px] border-[#dad7ce] bg-white px-5 pb-6 pt-8">
      {/* Ícone */}
      {bom ? (
        <div className="flex size-[60px] items-center justify-center rounded-[30px] bg-[#196e56]">
          <span className="text-[28px] font-medium text-white">★</span>
        </div>
      ) : (
        <div className="flex size-[60px] items-center justify-center rounded-[30px] bg-[#e1f5ee]">
          <span className="text-[26px] font-medium text-[#196e56]">↺</span>
        </div>
      )}

      {/* Pontuação */}
      <p className="text-[34px] font-medium text-[#1b1b19]" data-testid="pontuacao">
        <NumeroAnimado valor={pontuacao} /> pts
      </p>
      <p className="text-[13px] text-[#706f68]">
        {acertos} de {total} acertos
      </p>

      {/* Mensagem */}
      <p
        className={`text-center text-[15px] font-medium ${
          bom ? "text-[#196e56]" : "text-[#1b1b19]"
        }`}
      >
        {bom
          ? "Parabéns! Você domina bem a economia circular."
          : "Você está começando a jornada circular. Que tal um passo prático hoje?"}
      </p>

      {/* Desafio (só no desempenho baixo) */}
      {!bom && (
        <div className="flex w-full items-start gap-[10px] rounded-xl bg-[#e1f5ee] p-[14px] text-[#196e56]">
          <span className="text-[20px] font-medium">♻</span>
          <div className="flex flex-1 flex-col gap-[3px]">
            <p className="text-[12px] font-medium">{desafio.titulo}</p>
            <p className="text-[13px]">{desafio.texto}</p>
          </div>
        </div>
      )}

      {/* Ações */}
      <button
        type="button"
        onClick={onJogarNovo}
        className="flex w-full items-center justify-center rounded-xl bg-[#196e56] py-[14px] text-[15px] font-medium text-white"
      >
        {bom ? "Jogar de novo" : "Tentar de novo"}
      </button>
      <button
        type="button"
        onClick={bom ? onVerRanking : onInicio}
        className="flex w-full items-center justify-center rounded-xl border-[0.5px] border-[#dad7ce] py-[13px] text-[14px] font-medium text-[#1b1b19]"
      >
        {bom ? "Ver ranking" : "Início"}
      </button>
    </div>
  );
}
