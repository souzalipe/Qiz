// components/quiz/question-card.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { responder } from "@/lib/quiz/queries";
import type { CorrecaoResposta, Pergunta } from "@/lib/quiz/types";

type Props = {
  pergunta: Pergunta;
  indice: number;        // posição atual (0-based)
  total: number;         // total de perguntas
  /** Date.now() de quando a partida começou (1ª pergunta na tela) — alimenta
   *  o cronômetro, que corre a partida inteira (não reinicia por pergunta). */
  inicioMs: number | null;
  onProxima: (acertou: boolean, alternativaId: string) => void;
};

// Letras A, B, C, D, E
const LETRAS = ["A", "B", "C", "D", "E"];

const ehNaoSei = (texto: string) => texto.trim().toLowerCase() === "não sei.";

// 75 000 ms → "01:15"
function formatar(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function QuestionCard({ pergunta, indice, total, inicioMs, onProxima }: Props) {
  const [selecionada, setSelecionada] = useState<string | null>(null);
  // Correção vinda do servidor (função `responder`). Enquanto for null, a
  // pergunta não foi respondida — o navegador não sabe qual é a correta.
  const [correcao, setCorrecao] = useState<CorrecaoResposta | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Cronômetro. O card é recriado a cada pergunta, então "agora" começa no
  // instante atual (e não no início da partida, o que mostraria 00:00 por
  // até 1 s em cada pergunta nova).
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const respondida = correcao !== null;
  const progressoAnterior = (indice / total) * 100;
  const progresso = ((indice + 1) / total) * 100;
  const altSelecionada = pergunta.alternativas.find((a) => a.id === selecionada);

  async function escolher(id: string) {
    if (respondida || verificando) return;
    setSelecionada(id);
    setVerificando(true);
    setErro(null);
    try {
      setCorrecao(await responder(pergunta.id, id));
    } catch (e) {
      console.error(e);
      // Libera para escolher de novo.
      setSelecionada(null);
      setErro("Não foi possível verificar sua resposta. Tente de novo.");
    } finally {
      setVerificando(false);
    }
  }

  function proxima() {
    if (!selecionada || !correcao) return;
    onProxima(correcao.acertou, selecionada);
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border-[0.5px] border-[var(--quiz-border)] bg-[var(--quiz-surface)] p-5">
      {/* Topo: × à esquerda, cronômetro centralizado, contador à direita */}
      <div className="relative flex items-center justify-between text-[var(--quiz-text-muted)]">
        <span className="text-[20px] leading-none">×</span>
        <span
          className="absolute left-1/2 -translate-x-1/2 text-[13px] font-medium tabular-nums"
          role="timer"
          aria-label="Tempo decorrido"
          data-testid="cronometro"
        >
          ⏱ {formatar(inicioMs === null ? 0 : agora - inicioMs)}
        </span>
        <span className="text-[13px]">
          Pergunta {indice + 1} de {total}
        </span>
      </div>

      {/* Barra de progresso: anima do ponto da pergunta anterior até o atual */}
      <div className="h-[6px] w-full overflow-hidden rounded-[3px] bg-[var(--quiz-green-tint)]">
        <motion.div
          className="h-full rounded-[3px] bg-[var(--quiz-green)]"
          initial={{ width: `${progressoAnterior}%` }}
          animate={{ width: `${progresso}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Categoria */}
      <p className="text-[12px] font-medium text-[var(--quiz-green-ink)]">
        {pergunta.categorias.nome}
      </p>

      {/* Enunciado */}
      <h2 className="text-[18px] font-medium leading-[1.4] text-[var(--quiz-text)]">
        {pergunta.enunciado}
      </h2>

      {/* Alternativas */}
      <div className="flex flex-col gap-[10px]">
        {pergunta.alternativas.map((alt, i) => {
          const naoSei = ehNaoSei(alt.texto);
          const estaSelecionada = selecionada === alt.id;
          const eCorreta = correcao?.alternativa_correta_id === alt.id;
          const errouEsta = respondida && estaSelecionada && !eCorreta;

          // Estados visuais
          let classe = "border-[0.5px] border-[var(--quiz-border)] text-[var(--quiz-text-muted)]";
          if (respondida && eCorreta) {
            // a correta sempre fica verde ao revelar
            classe = "border-[1.5px] border-[var(--quiz-green-border)] bg-[var(--quiz-green-tint)] text-[var(--quiz-green-ink)]";
          } else if (errouEsta) {
            // escolha errada do usuário fica vermelha (vermelho = erro)
            classe = "border-[1.5px] border-[var(--quiz-error-border)] bg-[var(--quiz-error-bg)] text-[var(--quiz-error-text)]";
          } else if (verificando && estaSelecionada) {
            // aguardando a correção do servidor
            classe = "border-[1.5px] border-[var(--quiz-green-border)] text-[var(--quiz-green-ink)]";
          }

          return (
            <motion.button
              key={alt.id}
              type="button"
              onClick={() => escolher(alt.id)}
              disabled={respondida || verificando}
              // Revelação: a correta "pulsa" e a errada "balança".
              animate={
                respondida && eCorreta
                  ? { scale: [1, 1.03, 1] }
                  : errouEsta
                    ? { x: [0, -6, 6, -3, 3, 0] }
                    : { scale: 1, x: 0 }
              }
              transition={{ duration: 0.4 }}
              className={`flex w-full items-center gap-[10px] rounded-[10px] p-3 text-left transition-colors ${classe} ${
                naoSei && !respondida && !estaSelecionada ? "text-[var(--quiz-text-faint)]" : ""
              } ${!respondida && !verificando ? "hover:border-[var(--quiz-green-border)]" : ""} ${
                verificando && estaSelecionada ? "animate-pulse" : ""
              }`}
            >
              <span className="shrink-0 text-[14px] font-medium">
                {LETRAS[i]}
              </span>
              <span className="flex-1 text-[14px]">{alt.texto}</span>
              {respondida && eCorreta && (
                <span className="shrink-0 text-[16px] font-medium">✓</span>
              )}
              {errouEsta && (
                <span className="shrink-0 text-[16px] font-medium">×</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {erro && <p className="text-[13px] text-[var(--quiz-error-text)]">{erro}</p>}

      {/* Feedback (só após a correção do servidor) — entra deslizando */}
      <AnimatePresence initial={false}>
        {correcao && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, height: 0, y: 8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 rounded-[10px] bg-[var(--quiz-green-tint)] px-[14px] py-3 text-[13px] text-[var(--quiz-green-ink)]">
              <p className="font-medium">
                {correcao.acertou
                  ? `Resposta correta  ·  +${correcao.pontos}`
                  : altSelecionada && ehNaoSei(altSelecionada.texto)
                    ? "Tudo bem não saber  ·  +0"
                    : "Resposta incorreta  ·  +0"}
              </p>
              {correcao.feedback && (
                <p className="font-normal">{correcao.feedback}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Próxima */}
      <button
        type="button"
        onClick={proxima}
        disabled={!respondida}
        className="flex w-full items-center justify-center rounded-xl bg-[var(--quiz-green)] py-[13px] text-[15px] font-medium text-[var(--quiz-on-green)] transition-opacity disabled:opacity-40"
      >
        {indice + 1 === total ? "Ver resultado  →" : "Próxima  →"}
      </button>
    </div>
  );
}
