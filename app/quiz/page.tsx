"use client";

import { useEffect, useState } from "react";

import { QuestionCard } from "@/components/quiz/question-card";
import { getPerguntas } from "@/lib/quiz/queries";
import type { Pergunta } from "@/lib/quiz/types";

// Tela de pergunta (Fase 3).
// É um Client Component porque getPerguntas() usa o cliente Supabase do
// navegador e porque a pergunta é interativa (seleção, feedback).
// Por enquanto mostra só a primeira pergunta; avançar entre perguntas,
// pontuação e resultado entram na Fase 4.
export default function QuizPage() {
  const [perguntas, setPerguntas] = useState<Pergunta[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Busca as perguntas uma vez, ao abrir a página.
  useEffect(() => {
    getPerguntas()
      .then(setPerguntas)
      .catch((e: unknown) => {
        console.error(e);
        setErro("Não foi possível carregar as perguntas. Tente novamente.");
      });
  }, []);

  const pergunta = perguntas?.[0];

  return (
    // Coluna central com largura máxima de ~420px: ocupa a tela toda no
    // celular e fica centralizada no computador.
    <main className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-4 py-6">
      {erro ? (
        <p className="text-center text-sm text-[#c0392b]">{erro}</p>
      ) : perguntas === null ? (
        <p className="text-center text-sm text-[#706f68]">
          Carregando perguntas…
        </p>
      ) : !pergunta ? (
        <p className="text-center text-sm text-[#706f68]">
          Nenhuma pergunta cadastrada.
        </p>
      ) : (
        <QuestionCard
          pergunta={pergunta}
          indice={0}
          total={perguntas.length}
          // Fase 4: aqui vamos registrar a resposta, somar pontos e avançar.
          onProxima={(acertou, alternativaId) => {
            console.log("Resposta:", { acertou, alternativaId });
          }}
        />
      )}
    </main>
  );
}
