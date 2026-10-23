"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";

import { criarJogador, type Jogador } from "@/lib/quiz/partidas";
import { TURMAS } from "@/lib/quiz/turmas";

type Props = {
  // Jogador atual (ao voltar pelo "Início"): já vem preenchido e, se nome e
  // turma não mudarem, é reaproveitado sem novo cadastro.
  inicial?: Jogador | null;
  onIdentificado: (jogador: Jogador) => void;
};

// Tela inicial: pede nome e turma e cadastra o participante em `usuarios`
// antes de começar o quiz. A turma vem de uma lista fixa (lib/quiz/turmas.ts),
// para o filtro "Minha turma" do ranking bater exatamente.
export function PlayerForm({ inicial, onIdentificado }: Props) {
  const [nome, setNome] = useState(inicial?.nome ?? "");
  // Turma fora da lista (cadastro antigo, ou nome alterado em turmas.ts)
  // começa vazia, para a pessoa escolher de novo.
  const [turma, setTurma] = useState(
    inicial && TURMAS.includes(inicial.turma) ? inicial.turma : ""
  );
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const valido = nome.trim().length > 0 && turma.trim().length > 0;

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!valido || salvando) return;

    // Mesmo participante de antes: não cadastra de novo.
    if (inicial && nome.trim() === inicial.nome && turma.trim() === inicial.turma) {
      onIdentificado(inicial);
      return;
    }

    setSalvando(true);
    setErro(null);
    try {
      onIdentificado(await criarJogador(nome, turma));
    } catch (err) {
      console.error(err);
      setErro("Não foi possível salvar seus dados. Verifique a conexão e tente de novo.");
      setSalvando(false);
    }
  }

  const campo =
    "w-full rounded-[10px] border-[0.5px] border-[var(--quiz-border)] px-3 py-3 text-[15px] text-[var(--quiz-text)] outline-none transition-colors placeholder:text-[var(--quiz-text-faint)] focus:border-[var(--quiz-green-border)]";

  return (
    <form
      onSubmit={enviar}
      className="flex w-full flex-col gap-5 rounded-3xl border-[0.5px] border-[var(--quiz-border)] bg-[var(--quiz-surface)] p-6"
    >
      <div className="flex flex-col gap-1 text-center">
        <span className="text-[36px]" aria-hidden>
          ♻️
        </span>
        <h1 className="text-[22px] font-medium text-[var(--quiz-text)]">Quiz Circular</h1>
        <p className="text-[14px] leading-[1.4] text-[var(--quiz-text-muted)]">
          Teste seus conhecimentos sobre economia circular. Antes de começar,
          diga quem você é.
        </p>
      </div>

      <label className="flex flex-col gap-[6px]">
        <span className="text-[13px] font-medium text-[var(--quiz-green-ink)]">Nome</span>
        <input
          className={campo}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
          autoComplete="name"
          maxLength={80}
          required
        />
      </label>

      <label className="flex flex-col gap-[6px]">
        <span className="text-[13px] font-medium text-[var(--quiz-green-ink)]">Turma</span>
        <div className="relative">
          <select
            className={`${campo} appearance-none bg-[var(--quiz-surface)] pr-10 ${
              turma ? "" : "text-[var(--quiz-text-faint)]"
            }`}
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione sua turma
            </option>
            {TURMAS.map((t) => (
              <option key={t} value={t} className="text-[var(--quiz-text)]">
                {t}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--quiz-text-muted)]"
            aria-hidden
          />
        </div>
      </label>

      {erro && <p className="text-[13px] text-[var(--quiz-error-text)]">{erro}</p>}

      <button
        type="submit"
        disabled={!valido || salvando}
        className="flex w-full items-center justify-center rounded-xl bg-[var(--quiz-green)] py-[13px] text-[15px] font-medium text-[var(--quiz-on-green)] transition-opacity disabled:opacity-40"
      >
        {salvando ? "Salvando…" : "Começar quiz  →"}
      </button>
    </form>
  );
}
