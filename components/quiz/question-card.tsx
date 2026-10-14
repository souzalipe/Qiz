// components/quiz/question-card.tsx
"use client";

import { useState } from "react";
import type { Pergunta } from "@/lib/quiz/types";

type Props = {
  pergunta: Pergunta;
  indice: number;        // posição atual (0-based)
  total: number;         // total de perguntas
  onProxima: (acertou: boolean, alternativaId: string) => void;
};

// Letras A, B, C, D, E
const LETRAS = ["A", "B", "C", "D", "E"];

export function QuestionCard({ pergunta, indice, total, onProxima }: Props) {
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [respondida, setRespondida] = useState(false);

  const progresso = ((indice + 1) / total) * 100;
  const altSelecionada = pergunta.alternativas.find((a) => a.id === selecionada);
  const acertou = !!altSelecionada?.correta;

  function escolher(id: string) {
    if (respondida) return;
    setSelecionada(id);
    setRespondida(true);
  }

  function proxima() {
    if (!selecionada) return;
    onProxima(acertou, selecionada);
    // reset para a próxima pergunta
    setSelecionada(null);
    setRespondida(false);
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border-[0.5px] border-[#dad7ce] bg-white p-5">
      {/* Topo */}
      <div className="flex items-center justify-between text-[#706f68]">
        <span className="text-[20px] leading-none">×</span>
        <span className="text-[13px]">
          Pergunta {indice + 1} de {total}
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="h-[6px] w-full overflow-hidden rounded-[3px] bg-[#e1f5ee]">
        <div
          className="h-full rounded-[3px] bg-[#196e56] transition-all"
          style={{ width: `${progresso}%` }}
        />
      </div>

      {/* Categoria */}
      <p className="text-[12px] font-medium text-[#196e56]">
        {pergunta.categorias.nome}
      </p>

      {/* Enunciado */}
      <h2 className="text-[18px] font-medium leading-[1.4] text-[#1b1b19]">
        {pergunta.enunciado}
      </h2>

      {/* Alternativas */}
      <div className="flex flex-col gap-[10px]">
        {pergunta.alternativas.map((alt, i) => {
          const naoSei = alt.texto.trim().toLowerCase() === "não sei.";
          const estaSelecionada = selecionada === alt.id;

          // Estados visuais
          let classe =
            "border-[0.5px] border-[#dad7ce] text-[#706f68]";
          let mostrarCheck = false;
          let mostrarErro = false;

          if (respondida) {
            if (alt.correta) {
              // a correta sempre fica verde ao revelar
              classe = "border-[1.5px] border-[#5dc9a5] bg-[#e1f5ee] text-[#196e56]";
              mostrarCheck = true;
            } else if (estaSelecionada) {
              // escolha errada do usuário fica vermelha (vermelho = erro)
              classe = "border-[1.5px] border-[#e2a0a0] bg-[#fdeaea] text-[#c0392b]";
              mostrarErro = true;
            }
          }

          return (
            <button
              key={alt.id}
              type="button"
              onClick={() => escolher(alt.id)}
              disabled={respondida}
              className={`flex w-full items-center gap-[10px] rounded-[10px] p-3 text-left transition-colors ${classe} ${
                naoSei && !respondida ? "text-[#9e9d94]" : ""
              } ${!respondida ? "hover:border-[#5dc9a5]" : ""}`}
            >
              <span className="shrink-0 text-[14px] font-medium">
                {LETRAS[i]}
              </span>
              <span className="flex-1 text-[14px]">{alt.texto}</span>
              {mostrarCheck && (
                <span className="shrink-0 text-[16px] font-medium">✓</span>
              )}
              {mostrarErro && (
                <span className="shrink-0 text-[16px] font-medium">×</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback (só após responder) */}
      {respondida && (
        <div className="flex flex-col gap-1 rounded-[10px] bg-[#e1f5ee] px-[14px] py-3 text-[13px] text-[#196e56]">
          <p className="font-medium">
            {acertou
              ? `Resposta correta  ·  +${pergunta.pontos}`
              : altSelecionada && !altSelecionada.correta &&
                altSelecionada.texto.trim().toLowerCase() === "não sei."
              ? "Tudo bem não saber  ·  +0"
              : "Resposta incorreta  ·  +0"}
          </p>
          <p className="font-normal">{pergunta.feedback}</p>
        </div>
      )}

      {/* Botão Próxima */}
      <button
        type="button"
        onClick={proxima}
        disabled={!respondida}
        className="flex w-full items-center justify-center rounded-xl bg-[#196e56] py-[13px] text-[15px] font-medium text-white transition-opacity disabled:opacity-40"
      >
        {indice + 1 === total ? "Ver resultado  →" : "Próxima  →"}
      </button>
    </div>
  );
}
