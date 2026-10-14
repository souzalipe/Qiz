// lib/quiz/queries.ts
// Busca as perguntas do Supabase (com categoria e alternativas embutidas) e
// corrige respostas. Usa o cliente Supabase do navegador (lib/supabase/client.ts),
// então só deve ser chamada em Client Components ("use client").

import { createClient } from "@/lib/supabase/client";
import type { CorrecaoResposta, Pergunta } from "./types";

/**
 * Busca todas as perguntas com suas alternativas e categoria.
 * Embaralha a ordem das PERGUNTAS; as alternativas vêm sempre na ordem fixa
 * da coluna `ordem` (A–E, com "Não sei." por último).
 *
 * Não pede `correta` nem `feedback`: essas colunas são bloqueadas para o app
 * (gabarito protegido) — a correção vem de `responder()`.
 */
export async function getPerguntas(): Promise<Pergunta[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("perguntas")
    .select(
      `
      id,
      categoria_id,
      enunciado,
      pontos,
      categorias ( id, nome ),
      alternativas ( id, pergunta_id, texto, ordem )
    `
    )
    .order("ordem", { referencedTable: "alternativas", ascending: true });

  if (error) throw error;

  // Embaralha a ordem das perguntas (Fisher–Yates)
  const perguntas = (data ?? []) as unknown as Pergunta[];
  for (let i = perguntas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perguntas[i], perguntas[j]] = [perguntas[j], perguntas[i]];
  }

  return perguntas;
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
