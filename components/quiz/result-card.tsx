// components/quiz/result-card.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

import { NumeroAnimado } from "@/components/quiz/numero-animado";
import { LIMITE_BOM_DESEMPENHO } from "@/lib/quiz/pontuacao";
import { getDesafioDoDia } from "@/lib/quiz/queries";

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
  /** desafio prático mostrado no desempenho baixo (padrão: o desafio do dia do banco) */
  desafio?: Desafio;
  /** solta confetes no desempenho alto (false ao voltar do ranking, para não repetir) */
  celebrar?: boolean;
};

const TITULO_DESAFIO = "Desafio de hoje";

// Usado só se o desafio do dia não puder ser carregado.
const DESAFIO_RESERVA: Desafio = {
  titulo: TITULO_DESAFIO,
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
  desafio,
  celebrar = true,
}: Props) {
  const bom = total > 0 && acertos / total >= limiar;
  const jaSoltou = useRef(false);

  // Desafio do dia (tabela desafios, rotaciona pela data no servidor). Só é
  // buscado no desempenho baixo, que é quando o box aparece.
  const [desafioDoDia, setDesafioDoDia] = useState<Desafio | null>(null);
  useEffect(() => {
    if (bom || desafio) return;
    let ativo = true;
    getDesafioDoDia()
      .then((d) => {
        if (ativo) setDesafioDoDia(d ? { titulo: TITULO_DESAFIO, texto: d.texto } : DESAFIO_RESERVA);
      })
      .catch((e: unknown) => {
        console.error(e);
        if (ativo) setDesafioDoDia(DESAFIO_RESERVA);
      });
    return () => {
      ativo = false;
    };
  }, [bom, desafio]);
  const desafioMostrado = desafio ?? desafioDoDia;

  // Confetes de surpresa — SÓ no desempenho alto (quem entra no ranking).
  // No baixo, nada, para manter o incentivo de tentar de novo.
  useEffect(() => {
    if (!bom || !celebrar || jaSoltou.current) return;

    const timer = setTimeout(() => {
      // Marca aqui (e não antes do setTimeout): em desenvolvimento o React
      // monta o componente duas vezes e cancela o primeiro timer; marcando
      // antes, a segunda montagem acharia que já soltou e não soltaria nada.
      jaSoltou.current = true;
      const fim = Date.now() + 900;
      const cores = ["#196e56", "#5dc9a5", "#e1f5ee", "#ffffff"];

      (function frame() {
        // disableForReducedMotion: respeita "reduzir movimento" do sistema.
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: cores,
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: cores,
          disableForReducedMotion: true,
        });
        if (Date.now() < fim) requestAnimationFrame(frame);
      })();
    }, 250);

    return () => clearTimeout(timer);
  }, [bom, celebrar]);

  return (
    <div className="flex w-full flex-col items-center gap-[14px] rounded-3xl border-[0.5px] border-[var(--quiz-border)] bg-[var(--quiz-surface)] px-5 pb-6 pt-8">
      {/* Ícone */}
      {bom ? (
        <div className="flex size-[60px] items-center justify-center rounded-[30px] bg-[var(--quiz-green)]">
          <span className="text-[28px] font-medium text-[var(--quiz-on-green)]">★</span>
        </div>
      ) : (
        <div className="flex size-[60px] items-center justify-center rounded-[30px] bg-[var(--quiz-green-tint)]">
          <span className="text-[26px] font-medium text-[var(--quiz-green-ink)]">↺</span>
        </div>
      )}

      {/* Pontuação */}
      <p className="text-[34px] font-medium text-[var(--quiz-text)]" data-testid="pontuacao">
        <NumeroAnimado valor={pontuacao} /> pts
      </p>
      <p className="text-[13px] text-[var(--quiz-text-muted)]">
        {acertos} de {total} acertos
      </p>

      {/* Mensagem */}
      <p
        className={`text-center text-[15px] font-medium ${
          bom ? "text-[var(--quiz-green-ink)]" : "text-[var(--quiz-text)]"
        }`}
      >
        {bom
          ? "Parabéns! Você domina bem a economia circular."
          : "Você está começando a jornada circular. Que tal um passo prático hoje?"}
      </p>

      {/* Desafio (só no desempenho baixo) */}
      {!bom && (
        <div className="flex w-full items-start gap-[10px] rounded-xl bg-[var(--quiz-green-tint)] p-[14px] text-[var(--quiz-green-ink)]">
          <span className="text-[20px] font-medium">♻</span>
          <div className="flex flex-1 flex-col gap-[3px]">
            <p className="text-[12px] font-medium">{desafioMostrado?.titulo ?? TITULO_DESAFIO}</p>
            {desafioMostrado ? (
              <p className="text-[13px]" data-testid="desafio">{desafioMostrado.texto}</p>
            ) : (
              // Enquanto carrega: uma linha "fantasma" do tamanho do texto.
              <span className="mt-1 h-[14px] w-4/5 animate-pulse rounded bg-[var(--quiz-green-border)] opacity-40" />
            )}
          </div>
        </div>
      )}

      {/* Ações */}
      <button
        type="button"
        onClick={onJogarNovo}
        className="flex w-full items-center justify-center rounded-xl bg-[var(--quiz-green)] py-[14px] text-[15px] font-medium text-[var(--quiz-on-green)]"
      >
        {bom ? "Jogar de novo" : "Tentar de novo"}
      </button>
      <button
        type="button"
        onClick={bom ? onVerRanking : onInicio}
        className="flex w-full items-center justify-center rounded-xl border-[0.5px] border-[var(--quiz-border)] py-[13px] text-[14px] font-medium text-[var(--quiz-text)]"
      >
        {bom ? "Ver ranking" : "Início"}
      </button>
    </div>
  );
}
