// lib/quiz/queries.ts  (V2 — Bloco B)
// Busca as perguntas do Supabase (com categoria e alternativas embutidas),
// corrige respostas, lê o ranking e o desafio do dia. Usa o cliente Supabase
// do navegador (lib/supabase/client.ts), então só deve ser chamada em Client
// Components ("use client").

import { createClient } from "@/lib/supabase/client";
import type { CorrecaoResposta, Pergunta } from "./types";

// Mesmo valor de c_por_partida na função registrar_partida do banco
// (supabase/migrations/20261024120000_v2_bloco_b.sql): o banco recusa
// partidas com outra quantidade de respostas.
export const PERGUNTAS_POR_PARTIDA = 10;

/**
 * Sorteia 10 perguntas de 32, embaralhadas, com as alternativas na ordem
 * definida pela coluna `ordem` (a redistribuição das letras A–E).
 * Cada partida (inclusive ao recomeçar) traz um conjunto diferente.
 *
 * Não pede `correta` nem `feedback`: essas colunas são bloqueadas para o app
 * (gabarito protegido) — a correção vem de `responder()`.
 */
export async function getPerguntas(): Promise<Pergunta[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("perguntas").select(
    `
      id,
      categoria_id,
      enunciado,
      pontos,
      categorias ( id, nome ),
      alternativas ( id, pergunta_id, texto, ordem )
    `
  );
  if (error) throw error;

  const perguntas = (data ?? []) as unknown as Pergunta[];

  // Embaralha as perguntas (Fisher–Yates) e pega as 10 primeiras
  for (let i = perguntas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perguntas[i], perguntas[j]] = [perguntas[j], perguntas[i]];
  }
  const selecionadas = perguntas.slice(0, PERGUNTAS_POR_PARTIDA);

  // Ordena as alternativas pela coluna `ordem` (A=1 … E=5)
  for (const p of selecionadas) {
    p.alternativas.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  }

  return selecionadas;
}

/**
 * Corrige uma resposta no servidor (função `responder` do banco).
 * Devolve se acertou, qual é a alternativa correta, o feedback e os pontos.
 */
export async function responder(
  perguntaId: string,
  alternativaId: string
): Promise<CorrecaoResposta> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("responder", {
    p_pergunta_id: perguntaId,
    p_alternativa_id: alternativaId,
  });
  if (error) throw error;
  if (!data?.[0]) throw new Error("O banco não devolveu a correção.");

  return data[0];
}

export type RankingRow = {
  posicao: number;
  nome: string;
  turma: string | null;
  pontuacao: number;
  tempo_ms: number | null;
  voce: boolean; // true na linha do participante atual
};

/** Ranking: melhor partida por participante, desempate por tempo.
 *  turma undefined/null = geral; turma = "X" filtra a turma.
 *  usuarioId marca a linha do participante atual (voce: true) — o banco não
 *  devolve os ids dos outros participantes. */
export async function getRanking(
  turma?: string | null,
  usuarioId?: string
): Promise<RankingRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("obter_ranking", {
    p_turma: turma ?? undefined,
    p_usuario_id: usuarioId,
  });
  if (error) throw error;
  return (data ?? []) as RankingRow[];
}

/** Desafio do dia (rotaciona pela data no servidor). */
export async function getDesafioDoDia(): Promise<{ id: string; texto: string } | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("desafio_do_dia");
  if (error) throw error;
  const row = (data ?? [])[0];
  return row ? { id: row.id, texto: row.texto } : null;
}
