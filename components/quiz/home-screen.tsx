// components/quiz/home-screen.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { TURMAS } from "@/lib/quiz/turmas";
import { AVISO_PRIVACIDADE } from "@/lib/quiz/aviso-privacidade";

type Props = {
  onComecar: (dados: { nome: string; turma: string }) => void;
  /** participante atual (ao voltar pelo "Início"): já vem preenchido e com o aviso aceito */
  inicial?: { nome: string; turma: string } | null;
  /** cadastro sendo gravado no banco (desabilita o "Começar") */
  salvando?: boolean;
  /** mensagem de erro do cadastro */
  erro?: string | null;
  onVerRanking?: () => void;
  onVerGlossario?: () => void;
};

export function HomeScreen({
  onComecar,
  inicial,
  salvando = false,
  erro,
  onVerRanking,
  onVerGlossario,
}: Props) {
  const [nome, setNome] = useState(inicial?.nome ?? "");
  // Turma fora da lista (nome alterado em turmas.ts) começa vazia.
  const [turma, setTurma] = useState(
    inicial && TURMAS.includes(inicial.turma) ? inicial.turma : ""
  );
  const [aceite, setAceite] = useState(!!inicial);
  const [verAviso, setVerAviso] = useState(false);

  const valido = nome.trim().length >= 2 && turma !== "" && aceite;

  return (
    <div className="flex w-full flex-col gap-5 rounded-3xl border-[0.5px] border-[var(--quiz-border)] bg-[var(--quiz-surface)] px-5 pb-6 pt-8">
      {/* Marca */}
      <div className="flex flex-col items-center gap-3">
        {/* Ícone do projeto (public/logo.png; o mesmo da aba do navegador em app/icon.png).
            No modo escuro ganha um disco claro atrás: os círculos verde-escuros do
            ícone sumiriam no fundo escuro. */}
        <div className="rounded-full dark:bg-[#e9ece9] dark:p-2">
          <Image src="/logo.png" alt="" width={96} height={96} priority className="size-[96px]" />
        </div>
        <h1 className="text-center text-[22px] font-medium leading-[1.3] text-[var(--quiz-text)]">
          Quiz da Economia Circular
        </h1>
        <p className="max-w-[300px] text-center text-[14px] text-[var(--quiz-text-muted)]">
          Teste o que você sabe sobre circularidade, resíduos e desenvolvimento local — e dispute o ranking.
        </p>
      </div>

      {/* Chips de destaque */}
      <div className="flex justify-center gap-2">
        {["10 perguntas", "8 temas", "~5 min"].map((t) => (
          <span
            key={t}
            className="rounded-full bg-[var(--quiz-green-tint)] px-3 py-[6px] text-[12px] font-medium text-[var(--quiz-green-ink)]"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Cadastro */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="home-nome" className="text-[12px] font-medium text-[var(--quiz-text-muted)]">Seu nome</label>
          <input
            id="home-nome"
            autoComplete="nickname"
            maxLength={80}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como você quer aparecer no ranking"
            className="rounded-[10px] border-[0.5px] border-[var(--quiz-border)] bg-transparent px-3 py-[11px] text-[14px] text-[var(--quiz-text)] outline-none focus:border-[var(--quiz-green-border)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="home-turma" className="text-[12px] font-medium text-[var(--quiz-text-muted)]">Turma</label>
          {/* Fundo sólido (não transparente): a lista de opções do sistema usa
              essa cor; transparente, ficava texto claro em fundo branco no escuro. */}
          <select
            id="home-turma"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            className="rounded-[10px] border-[0.5px] border-[var(--quiz-border)] bg-[var(--quiz-surface)] px-3 py-[11px] text-[14px] text-[var(--quiz-text)] outline-none focus:border-[var(--quiz-green-border)]"
          >
            <option value="" disabled>
              Selecione sua turma
            </option>
            {TURMAS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Consentimento LGPD */}
      <div className="flex flex-col gap-2 rounded-[10px] bg-[var(--quiz-green-tint)] p-[14px]">
        <label className="flex items-start gap-2 text-[13px] text-[var(--quiz-text)]">
          <input
            type="checkbox"
            checked={aceite}
            onChange={(e) => setAceite(e.target.checked)}
            className="mt-[2px] accent-[var(--quiz-green)]"
          />
          <span>
            Li e concordo com o{" "}
            <button
              type="button"
              onClick={() => setVerAviso((v) => !v)}
              className="font-medium text-[var(--quiz-green-ink)] underline"
            >
              aviso de privacidade
            </button>
            .
          </span>
        </label>

        {verAviso && (
          <div className="flex flex-col gap-2 border-t border-[var(--quiz-green-border)] pt-2 text-[12px] leading-[1.5] text-[var(--quiz-text-muted)]">
            <p className="font-medium text-[var(--quiz-text)]">{AVISO_PRIVACIDADE.titulo}</p>
            <p>{AVISO_PRIVACIDADE.intro}</p>
            <p className="font-medium text-[var(--quiz-text)]">O que coletamos:</p>
            <ul className="ml-4 list-disc">
              {AVISO_PRIVACIDADE.coletamos.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p>{AVISO_PRIVACIDADE.finalidade}</p>
            <p>{AVISO_PRIVACIDADE.base}</p>
            <p>{AVISO_PRIVACIDADE.direitos}</p>
            <p>{AVISO_PRIVACIDADE.contato}</p>
          </div>
        )}
      </div>

      {erro && <p className="text-[13px] text-[var(--quiz-error-text)]">{erro}</p>}

      {/* CTA */}
      <button
        type="button"
        disabled={!valido || salvando}
        onClick={() => onComecar({ nome: nome.trim(), turma })}
        className="flex w-full items-center justify-center rounded-xl bg-[var(--quiz-green)] py-[14px] text-[15px] font-medium text-[var(--quiz-on-green)] transition-opacity disabled:opacity-40"
      >
        {salvando ? "Salvando…" : "Começar"}
      </button>

      {/* Acessos secundários */}
      {(onVerRanking || onVerGlossario) && (
        <div className="flex justify-center gap-5 text-[13px] font-medium text-[var(--quiz-text-muted)]">
          {onVerRanking && (
            <button type="button" onClick={onVerRanking}>
              Ranking
            </button>
          )}
          {onVerGlossario && (
            <button type="button" onClick={onVerGlossario}>
              Glossário
            </button>
          )}
        </div>
      )}
    </div>
  );
}
