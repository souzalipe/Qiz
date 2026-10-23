"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { BookOpen } from "lucide-react";

import { GlossaryOverlay } from "@/components/quiz/glossary-overlay";
import { HomeScreen } from "@/components/quiz/home-screen";
import { QuestionCard } from "@/components/quiz/question-card";
import { RankingContainer } from "@/components/quiz/ranking-container";
import { ResultCard } from "@/components/quiz/result-card";
import { criarJogador, registrarPartida, type Jogador } from "@/lib/quiz/partidas";
import { PONTOS_POR_ACERTO } from "@/lib/quiz/pontuacao";
import { getPerguntas } from "@/lib/quiz/queries";
import type { Pergunta, RespostaDada } from "@/lib/quiz/types";

// Controlador do quiz.
//
// Fluxo:  início → jogando (pergunta 1…N) → resultado ⇄ ranking
//            │            ↑                           │
//            │            └────── jogar de novo ──────┘
//            └→ ranking (consulta, antes de jogar) → início
//
// - Início (HomeScreen): nome, turma e aceite do aviso de privacidade (LGPD)
//   → grava em `usuarios` com consentimento (uma vez por visita; "jogar de
//   novo" mantém o mesmo jogador). Atalhos para o ranking e o glossário.
// - Jogando: 10 perguntas sorteadas; acumula pontuação, acertos e as
//   respostas dadas, e cronometra a partida (da 1ª pergunta na tela até
//   responder a última).
// - Resultado: grava a partida, as respostas e o tempo (registrar_partida).
// - Ranking: melhor partida de cada participante (geral e da turma),
//   desempate pelo menor tempo, com o jogador atual destacado.
//
// "Início" (resultado baixo) volta à tela inicial já preenchida: se o
// jogador não mudar nome/turma, continua sendo o mesmo participante.
type Tela = "identificacao" | "jogando" | "resultado" | "ranking";

// Situação da gravação da partida no Supabase.
type StatusSalvamento = "salvando" | "salvo" | "erro";

export function QuizFlow() {
  const [tela, setTela] = useState<Tela>("identificacao");
  const [jogador, setJogador] = useState<Jogador | null>(null);
  const [salvandoCadastro, setSalvandoCadastro] = useState(false);
  const [erroCadastro, setErroCadastro] = useState<string | null>(null);
  // Ranking aberto pela tela inicial (sem partida): "voltar" volta ao início.
  const [rankingDoInicio, setRankingDoInicio] = useState(false);

  const [perguntas, setPerguntas] = useState<Pergunta[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const [indice, setIndice] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [acertos, setAcertos] = useState(0);
  // Uma entrada por pergunta respondida, na ordem em que foram respondidas.
  const [respostas, setRespostas] = useState<RespostaDada[]>([]);

  const [salvamento, setSalvamento] = useState<StatusSalvamento>("salvando");
  // Confetes só na primeira vez que o resultado da partida aparece (não ao
  // voltar do ranking).
  const [jaCelebrou, setJaCelebrou] = useState(false);
  // Glossário aberto por cima da tela atual (ver GlossaryOverlay).
  const [glossarioAberto, setGlossarioAberto] = useState(false);
  const fecharGlossario = useCallback(() => setGlossarioAberto(false), []);
  const [partidaId, setPartidaId] = useState<string | null>(null);

  // Início da partida = quando a 1ª pergunta aparece (não quando a tela abre:
  // as perguntas já carregam durante o cadastro, e o tempo de preencher nome e
  // turma não deve contar). Zera a cada partida nova ("jogar de novo").
  // Alimenta o cronômetro do QuestionCard e o tempo_ms gravado.
  const [inicioMs, setInicioMs] = useState<number | null>(null);
  // Duração guardada para o "tentar de novo" da gravação.
  const [tempoMs, setTempoMs] = useState(0);

  // Busca (e embaralha) as perguntas e zera a partida.
  const carregarPerguntas = useCallback(() => {
    setPerguntas(null);
    setErro(null);
    setIndice(0);
    setPontuacao(0);
    setAcertos(0);
    setRespostas([]);
    setPartidaId(null);
    setJaCelebrou(false);
    setInicioMs(null);

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

  // Dispara o cronômetro quando a 1ª pergunta entra na tela.
  useEffect(() => {
    if (tela === "jogando" && perguntas?.length && inicioMs === null) {
      setInicioMs(Date.now());
    }
  }, [tela, perguntas, inicioMs]);

  // Grava a partida no Supabase. Chamado ao terminar (e no "tentar de novo").
  async function salvarPartida(jogadorId: string, lista: RespostaDada[], duracao: number) {
    setSalvamento("salvando");
    try {
      const partida = await registrarPartida(jogadorId, lista, duracao);
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
      const duracao = Date.now() - (inicioMs ?? Date.now());
      setTempoMs(duracao);
      setTela("resultado");
      void salvarPartida(jogador.id, novasRespostas, duracao);
    } else {
      setIndice(indice + 1);
    }
  }

  // "Começar" da tela inicial: cadastra (com o consentimento) e inicia.
  async function comecar(dados: { nome: string; turma: string }) {
    if (salvandoCadastro) return;
    let atual = jogador;
    // Mesmo participante de antes (voltou pelo "Início"): não cadastra de novo.
    if (!atual || atual.nome !== dados.nome || atual.turma !== dados.turma) {
      setSalvandoCadastro(true);
      setErroCadastro(null);
      try {
        atual = await criarJogador(dados.nome, dados.turma);
      } catch (e) {
        console.error(e);
        setErroCadastro("Não foi possível salvar seus dados. Verifique a conexão e tente de novo.");
        return;
      } finally {
        setSalvandoCadastro(false);
      }
    }
    setJogador(atual);
    // Vindo do "Início" depois de uma partida: sorteia perguntas novas.
    if (respostas.length > 0) carregarPerguntas();
    setTela("jogando");
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
        <HomeScreen
          key="home"
          inicial={jogador}
          salvando={salvandoCadastro}
          erro={erroCadastro}
          onComecar={(dados) => void comecar(dados)}
          onVerRanking={() => {
            setRankingDoInicio(true);
            setTela("ranking");
          }}
          onVerGlossario={() => setGlossarioAberto(true)}
        />,
      ];
    }

    if (tela === "ranking" && rankingDoInicio) {
      return [
        "ranking-consulta",
        <RankingContainer
          key="ranking-consulta"
          partidaId={null}
          consulta
          usuarioId={jogador?.id}
          turma={jogador?.turma}
          salvamento="salvo"
          onTentarSalvar={() => {}}
          onVoltar={() => {
            setRankingDoInicio(false);
            setTela("identificacao");
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
          usuarioId={jogador.id}
          salvamento={salvamento}
          turma={jogador.turma}
          onTentarSalvar={() => void salvarPartida(jogador.id, respostas, tempoMs)}
          onVoltar={() => setTela("resultado")}
        />,
      ];
    }

    if (erro) {
      return [
        "erro",
        <div key="erro" className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-[var(--quiz-error-text)]">{erro}</p>
          <button
            type="button"
            onClick={carregarPerguntas}
            className="text-sm font-medium text-[var(--quiz-green-ink)] underline"
          >
            Tentar de novo
          </button>
        </div>,
      ];
    }

    if (perguntas === null) {
      return [
        "carregando",
        <p key="carregando" className="text-center text-sm text-[var(--quiz-text-muted)]">
          Carregando perguntas…
        </p>,
      ];
    }

    if (perguntas.length === 0) {
      return [
        "vazio",
        <p key="vazio" className="text-center text-sm text-[var(--quiz-text-muted)]">
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
            celebrar={!jaCelebrou}
            onVerRanking={() => {
              setJaCelebrou(true);
              setTela("ranking");
            }}
            onInicio={() => setTela("identificacao")}
          />
          {/* Situação da gravação (só aparece enquanto salva ou se falhar) */}
          {salvamento === "salvando" && (
            <p className="text-center text-[13px] text-[var(--quiz-text-muted)]">Salvando sua partida…</p>
          )}
          {salvamento === "erro" && (
            <p className="text-center text-[13px] text-[var(--quiz-error-text)]">
              Não foi possível salvar sua partida.{" "}
              <button
                type="button"
                onClick={() => void salvarPartida(jogador.id, respostas, tempoMs)}
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
        inicioMs={inicioMs}
        onProxima={registrarResposta}
      />,
    ];
  }

  const [chave, conteudo] = telaAtual();
  const ehPergunta = chave.startsWith("pergunta-");

  // O glossário fica disponível em todas as telas, inclusive durante as
  // perguntas (decisão da pesquisa), sempre no mesmo lugar (canto superior
  // esquerdo). Ele abre POR CIMA da tela atual, então a
  // pergunta em andamento não é desmontada: ao voltar, a seleção e a correção
  // continuam como estavam (não dá para "responder de novo").
  const mostrarBotaoGlossario = true;

  return (
    // reducedMotion="user": respeita quem pediu "reduzir movimento" no sistema.
    <MotionConfig reducedMotion="user">
      {mostrarBotaoGlossario && !glossarioAberto && (
        <button
          type="button"
          onClick={() => setGlossarioAberto(true)}
          className="fixed left-4 top-4 z-50 flex h-10 items-center gap-2 rounded-full border-[0.5px] border-[var(--quiz-border)] bg-[var(--quiz-surface)] px-4 text-[13px] font-medium text-[var(--quiz-text-muted)] transition-colors hover:border-[var(--quiz-green-border)] hover:text-[var(--quiz-green-ink)]"
        >
          <BookOpen className="size-4" aria-hidden />
          Glossário
        </button>
      )}
      <GlossaryOverlay aberto={glossarioAberto} onFechar={fecharGlossario} />
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
