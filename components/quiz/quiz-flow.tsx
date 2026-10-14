"use client";

import { useCallback, useEffect, useState } from "react";

import { QuestionCard } from "@/components/quiz/question-card";
import { ResultScreen } from "@/components/quiz/result-screen";
import { PONTOS_POR_ACERTO } from "@/lib/quiz/pontuacao";
import { getPerguntas } from "@/lib/quiz/queries";
import type { Pergunta, RespostaDada } from "@/lib/quiz/types";

// Controlador do quiz: carrega as perguntas, guarda em qual pergunta o
// jogador está, acumula pontuação/acertos/respostas e, ao fim, mostra o
// resultado.
//
// Fluxo:  carregando → jogando (pergunta 1…N) → resultado
//                                    ↑                 │
//                                    └─ jogar de novo ─┘
export function QuizFlow() {
  const [perguntas, setPerguntas] = useState<Pergunta[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const [indice, setIndice] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [acertos, setAcertos] = useState(0);
  // Uma entrada por pergunta respondida, na ordem em que foram respondidas.
  // Será gravada na tabela `respostas` na Parte B.
  const [respostas, setRespostas] = useState<RespostaDada[]>([]);
  const [terminou, setTerminou] = useState(false);

  // Busca (e embaralha) as perguntas e zera a partida.
  const iniciar = useCallback(() => {
    setPerguntas(null);
    setErro(null);
    setIndice(0);
    setPontuacao(0);
    setAcertos(0);
    setRespostas([]);
    setTerminou(false);

    getPerguntas()
      .then(setPerguntas)
      .catch((e: unknown) => {
        console.error(e);
        setErro("Não foi possível carregar as perguntas. Tente novamente.");
      });
  }, []);

  useEffect(() => {
    iniciar();
  }, [iniciar]);

  // Chamado pelo QuestionCard quando o jogador clica em "Próxima".
  function registrarResposta(acertou: boolean, alternativaId: string) {
    if (!perguntas) return;
    const pergunta = perguntas[indice];

    const novasRespostas = [
      ...respostas,
      { pergunta_id: pergunta.id, alternativa_id: alternativaId, correta: acertou },
    ];
    const novaPontuacao = pontuacao + (acertou ? PONTOS_POR_ACERTO : 0);
    const novosAcertos = acertos + (acertou ? 1 : 0);

    setRespostas(novasRespostas);
    setPontuacao(novaPontuacao);
    setAcertos(novosAcertos);

    // Última pergunta → resultado; senão, avança.
    if (indice + 1 >= perguntas.length) {
      // Temporário (até a Parte B gravar no Supabase): mostra no console do
      // navegador exatamente o que será salvo em `partidas` e `respostas`.
      console.info("Partida concluída", {
        pontuacao: novaPontuacao,
        acertos: novosAcertos,
        respostas: novasRespostas,
      });
      setTerminou(true);
    } else {
      setIndice(indice + 1);
    }
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-[#c0392b]">{erro}</p>
        <button
          type="button"
          onClick={iniciar}
          className="text-sm font-medium text-[#196e56] underline"
        >
          Tentar de novo
        </button>
      </div>
    );
  }

  if (perguntas === null) {
    return (
      <p className="text-center text-sm text-[#706f68]">Carregando perguntas…</p>
    );
  }

  if (perguntas.length === 0) {
    return (
      <p className="text-center text-sm text-[#706f68]">
        Nenhuma pergunta cadastrada.
      </p>
    );
  }

  if (terminou) {
    return (
      <ResultScreen
        pontuacao={pontuacao}
        acertos={acertos}
        total={perguntas.length}
        onJogarNovamente={iniciar}
      />
    );
  }

  return (
    <QuestionCard
      // key: garante um card "novo" (sem seleção anterior) a cada pergunta.
      key={perguntas[indice].id}
      pergunta={perguntas[indice]}
      indice={indice}
      total={perguntas.length}
      onProxima={registrarResposta}
    />
  );
}
