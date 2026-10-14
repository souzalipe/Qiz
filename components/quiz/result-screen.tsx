"use client";

import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";

import { bomDesempenho } from "@/lib/quiz/pontuacao";

// Situação da gravação da partida no Supabase.
export type StatusSalvamento = "salvando" | "salvo" | "erro";

type Props = {
  pontuacao: number;
  acertos: number;
  total: number;
  salvamento: StatusSalvamento;
  onTentarSalvar: () => void;
  onJogarNovamente: () => void;
  onVerRanking: () => void;
};

// Número que "conta" de 0 até o valor final (contagem animada da pontuação).
function NumeroAnimado({ valor }: { valor: number }) {
  const reduzirMovimento = useReducedMotion();
  const [exibido, setExibido] = useState(reduzirMovimento ? valor : 0);

  useEffect(() => {
    if (reduzirMovimento) {
      setExibido(valor);
      return;
    }
    const controle = animate(0, valor, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setExibido(Math.round(v)),
    });
    return () => controle.stop();
  }, [valor, reduzirMovimento]);

  return <>{exibido}</>;
}

// Tela de resultado ao fim da partida. Tem duas versões, escolhidas pela
// fração de acertos (ver LIMITE_BOM_DESEMPENHO em lib/quiz/pontuacao.ts):
//   - bom desempenho  → frame 03 do Figma
//   - a melhorar      → frame 04 do Figma
export function ResultScreen({
  pontuacao,
  acertos,
  total,
  salvamento,
  onTentarSalvar,
  onJogarNovamente,
  onVerRanking,
}: Props) {
  const bom = bomDesempenho(acertos, total);
  const percentual = total > 0 ? Math.round((acertos / total) * 100) : 0;

  return (
    <div className="flex w-full flex-col items-center gap-5 rounded-3xl border-[0.5px] border-[#dad7ce] bg-white p-6 text-center">
      {/* Ícone: troféu (bom) ou broto (a melhorar) */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
        className={`flex size-20 items-center justify-center rounded-full text-[36px] ${
          bom ? "bg-[#e1f5ee]" : "bg-[#f4f2ec]"
        }`}
        aria-hidden
      >
        {bom ? "🏆" : "🌱"}
      </motion.div>

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
          <NumeroAnimado valor={pontuacao} />
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
          {/* Barra enche junto com a contagem da pontuação */}
          <motion.div
            className="h-full rounded-[3px] bg-[#196e56]"
            initial={{ width: 0 }}
            animate={{ width: `${percentual}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Situação da gravação (só aparece enquanto salva ou se falhar) */}
      {salvamento === "salvando" && (
        <p className="text-[13px] text-[#706f68]">Salvando sua partida…</p>
      )}
      {salvamento === "erro" && (
        <p className="text-[13px] text-[#c0392b]">
          Não foi possível salvar sua partida.{" "}
          <button type="button" onClick={onTentarSalvar} className="font-medium underline">
            Tentar de novo
          </button>
        </p>
      )}

      {/* Ações */}
      <div className="flex w-full flex-col gap-[10px]">
        <button
          type="button"
          onClick={onVerRanking}
          // O ranking destaca a partida do jogador, então só abre depois de salva.
          disabled={salvamento !== "salvo"}
          className="flex w-full items-center justify-center rounded-xl bg-[#196e56] py-[13px] text-[15px] font-medium text-white transition-opacity disabled:opacity-40"
        >
          Ver ranking
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
