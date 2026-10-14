// lib/quiz/queries.ts
// Busca as perguntas do Supabase, com categoria e alternativas já embutidas.
// Usa o cliente Supabase do navegador (lib/supabase/client.ts), então só
// deve ser chamada em Client Components ("use client").

import { createClient } from "@/lib/supabase/client";
import type { Pergunta } from "./types";

/**
 * Busca todas as perguntas com suas alternativas e categoria.
 * Embaralha a ordem das perguntas e, dentro de cada uma, mantém
 * A–E na ordem de inserção (E "Não sei" sempre por último — ver nota).
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
      feedback,
      pontos,
      categorias ( id, nome ),
      alternativas ( id, pergunta_id, texto, correta )
    `
    );

  if (error) throw error;

  // Embaralha a ordem das perguntas (Fisher–Yates)
  const perguntas = (data ?? []) as unknown as Pergunta[];
  for (let i = perguntas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perguntas[i], perguntas[j]] = [perguntas[j], perguntas[i]];
  }

  // Ordena as alternativas colocando "Não sei." sempre no fim (E)
  for (const p of perguntas) {
    p.alternativas.sort((a, b) => {
      const aNaoSei = a.texto.trim().toLowerCase() === "não sei.";
      const bNaoSei = b.texto.trim().toLowerCase() === "não sei.";
      if (aNaoSei === bNaoSei) return 0;
      return aNaoSei ? 1 : -1;
    });
  }

  return perguntas;
}
