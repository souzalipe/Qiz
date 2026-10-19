"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

import { PlayerForm } from "@/components/quiz/player-form";
import { QuestionCard } from "@/components/quiz/question-card";
import { RankingContainer } from "@/components/quiz/ranking-container";
import { ResultCard } from "@/components/quiz/result-card";
import { registrarPartida, type Jogador } from "@/lib/quiz/partidas";
import { PONTOS_POR_ACERTO } from "@/lib/quiz/pontuacao";
import { getPerguntas } from "@/lib/quiz/queries";
import type { Pergunta, RespostaDada } from "@/lib/quiz/types";

// Controlador do quiz.
//
// Fluxo:  identificação → jogando (pergunta 1…N) → resultado ⇄ ranking
//                              ↑                           │
//                              └────── jogar de novo ──────┘
//
// - Identificação: nome e turma → grava em `usuarios` (uma vez por visita;
//   "jogar de novo" mantém o mesmo jogador).
// - Jogando: acumula pontuação, acertos e as respostas dadas.
// - Resultado: grava a partida e as respostas (função registrar_partida).
// - Ranking: melhores pontuações (geral e da turma), com a partida atual
//   destacada.
//
// "Início" (resultado baixo) volta à identificação já preenchida: se o
// jogador não mudar nome/turma, continua sendo o mesmo participante.
type Tela = "identificacao" | "jogando" | "resultado" | "ranking";

// Situação da gravação da partida no Supabase.
type StatusSalvamento = "salvando" | "salvo" | "erro";

export function QuizFlow() {
  const [tela, setTela] = useState<Tela>("identificacao");
  const [jogador, setJogador] = useState<Jogador | null>(null);

  const [perguntas, setPerguntas] = useState<Pergunta[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const [indice, setIndice] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [acertos, setAcertos] = useState(0);
  // Uma entrada por pergunta respondida, na ordem em que foram respondidas.
  const [respostas, setRespostas] = useState<RespostaDada[]>([]);

  const [salvamento, setSalvamento] = useState<StatusSalvamento>("salvando");
  const [partidaId, setPartidaId] = useState<string | null>(null);

  // Busca (e embaralha) as perguntas e zera a partida.
  const carregarPerguntas = useCallback(() => {
    setPerguntas(null);
    setErro(null);
    setIndice(0);
    setPontuacao(0);
    setAcertos(0);
    setRespostas([]);
    setPartidaId(null);

    getPerguntas()
      .then(setPerguntas)
      .catch((e: unknown) => {
        console.error(e);
        setErro("Não foi possível carregar as perguntas. Tente novamente.");
      });
  }, []);

  // Já carrega as perguntas enquanto o jogador preenche nome e turma.
  useEffect(() => {
    carregarPerguntas();
  }, [carregarPerguntas]);

  // Grava a partida no Supabase. Chamado ao terminar (e no "tentar de novo").
  async function salvarPartida(jogadorId: string, lista: RespostaDada[]) {
    setSalvamento("salvando");
    try {
      const partida = await registrarPartida(jogadorId, lista);
      setPartidaId(partida.partida_id);
      setSalvamento("salvo");
    } catch (e) {
      console.error(e);
      setSalvamento("erro");
    }
  }

  // Chamado pelo QuestionCard quando o jogador clica em "Próxima".
  function registrarResposta(acertou: boolean, alternativaId: string) {
    if (!perguntas || !jogador) return;
    const pergunta = perguntas[indice];

    const novasRespostas = [
      ...respostas,
      { pergunta_id: pergunta.id, alternativa_id: alternativaId, correta: acertou },
    ];
    setRespostas(novasRespostas);
    if (acertou) {
      setPontuacao((p) => p + PONTOS_POR_ACERTO);
      setAcertos((a) => a + 1);
    }

    // Última pergunta → resultado (e grava); senão, avança.
    if (indice + 1 >= perguntas.length) {
      setTela("resultado");
      void salvarPartida(jogador.id, novasRespostas);
    } else {
      setIndice(indice + 1);
    }
  }

  function jogarNovamente() {
    carregarPerguntas();
    setTela("jogando");
  }

  // Decide qual tela mostrar. Cada tela tem uma "chave": quando a chave muda,
  // a tela antiga sai e a nova entra com animação (ver o return no fim).
  function telaAtual(): [string, ReactNode] {
    if (tela === "identificacao") {
      return [
        "identificacao",
        <PlayerForm
          key="form"
          inicial={jogador}
          onIdentificado={(j) => {
            setJogador(j);
            // Vindo do "Início" depois de uma partida: sorteia perguntas novas.
            if (respostas.length > 0) carregarPerguntas();
            setTela("jogando");
          }}
        />,
      ];
    }

    if (tela === "ranking" && jogador) {
      return [
        "ranking",
        <RankingContainer
          key="ranking"
          partidaId={partidaId}
          salvamento={salvamento}
          turma={jogador.turma}
          onTentarSalvar={() => void salvarPartida(jogador.id, respostas)}
          onVoltar={() => setTela("resultado")}
        />,
      ];
    }

    if (erro) {
      return [
        "erro",
        <div key="erro" className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-[#c0392b]">{erro}</p>
          <button
            type="button"
            onClick={carregarPerguntas}
            className="text-sm font-medium text-[#196e56] underline"
          >
            Tentar de novo
          </button>
        </div>,
      ];
    }

    if (perguntas === null) {
      return [
        "carregando",
        <p key="carregando" className="text-center text-sm text-[#706f68]">
          Carregando perguntas…
        </p>,
      ];
    }

    if (perguntas.length === 0) {
      return [
        "vazio",
        <p key="vazio" className="text-center text-sm text-[#706f68]">
          Nenhuma pergunta cadastrada.
        </p>,
      ];
    }

    if (tela === "resultado" && jogador) {
      return [
        "resultado",
        <div key="resultado" className="flex w-full flex-col gap-3">
          <ResultCard
            pontuacao={pontuacao}
            acertos={acertos}
            total={perguntas.length}
            onJogarNovo={jogarNovamente}
            onVerRanking={() => setTela("ranking")}
            onInicio={() => setTela("identificacao")}
          />
          {/* Situação da gravação (só aparece enquanto salva ou se falhar) */}
          {salvamento === "salvando" && (
            <p className="text-center text-[13px] text-[#706f68]">Salvando sua partida…</p>
          )}
          {salvamento === "erro" && (
            <p className="text-center text-[13px] text-[#c0392b]">
              Não foi possível salvar sua partida.{" "}
              <button
                type="button"
                onClick={() => void salvarPartida(jogador.id, respostas)}
                className="font-medium underline"
              >
                Tentar de novo
              </button>
            </p>
          )}
        </div>,
      ];
    }

    const pergunta = perguntas[indice];
    return [
      // Chave por pergunta: cada nova pergunta "desliza" para dentro.
      `pergunta-${pergunta.id}`,
      <QuestionCard
        key={pergunta.id}
        pergunta={pergunta}
        indice={indice}
        total={perguntas.length}
        onProxima={registrarResposta}
      />,
    ];
  }

  const [chave, conteudo] = telaAtual();
  const ehPergunta = chave.startsWith("pergunta-");

  return (
    // reducedMotion="user": respeita quem pediu "reduzir movimento" no sistema.
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={chave}
          className="w-full"
          // Perguntas entram pela direita e saem pela esquerda; as demais
          // telas só fazem fade com um leve deslocamento vertical.
          initial={ehPergunta ? { opacity: 0, x: 40 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={ehPergunta ? { opacity: 0, x: -40 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {conteudo}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
