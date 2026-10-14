"use client";

import { useState, type FormEvent } from "react";

import { criarJogador, type Jogador } from "@/lib/quiz/partidas";

type Props = {
  onIdentificado: (jogador: Jogador) => void;
};

// Tela inicial: pede nome e turma e cadastra o participante em `usuarios`
// antes de começar o quiz.
export function PlayerForm({ onIdentificado }: Props) {
  const [nome, setNome] = useState("");
  const [turma, setTurma] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const valido = nome.trim().length > 0 && turma.trim().length > 0;

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!valido || salvando) return;

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
    "w-full rounded-[10px] border-[0.5px] border-[#dad7ce] px-3 py-3 text-[15px] text-[#1b1b19] outline-none transition-colors placeholder:text-[#9e9d94] focus:border-[#5dc9a5]";

  return (
    <form
      onSubmit={enviar}
      className="flex w-full flex-col gap-5 rounded-3xl border-[0.5px] border-[#dad7ce] bg-white p-6"
    >
      <div className="flex flex-col gap-1 text-center">
        <span className="text-[36px]" aria-hidden>
          ♻️
        </span>
        <h1 className="text-[22px] font-medium text-[#1b1b19]">Quiz Circular</h1>
        <p className="text-[14px] leading-[1.4] text-[#706f68]">
          Teste seus conhecimentos sobre economia circular. Antes de começar,
          diga quem você é.
        </p>
      </div>

      <label className="flex flex-col gap-[6px]">
        <span className="text-[13px] font-medium text-[#196e56]">Nome</span>
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
        <span className="text-[13px] font-medium text-[#196e56]">Turma</span>
        <input
          className={campo}
          value={turma}
          onChange={(e) => setTurma(e.target.value)}
          placeholder="Ex.: Mestrado 2026"
          maxLength={80}
          required
        />
      </label>

      {erro && <p className="text-[13px] text-[#c0392b]">{erro}</p>}

      <button
        type="submit"
        disabled={!valido || salvando}
        className="flex w-full items-center justify-center rounded-xl bg-[#196e56] py-[13px] text-[15px] font-medium text-white transition-opacity disabled:opacity-40"
      >
        {salvando ? "Salvando…" : "Começar quiz  →"}
      </button>
    </form>
  );
}
