// Gravação dos dados da pesquisa (usuarios, partidas, respostas). O ranking
// fica em queries.ts (getRanking). Usa o cliente Supabase do navegador: chamar só em Client
// Components.

import { createClient } from "@/lib/supabase/client";
import { gerarUuid } from "@/lib/uuid";
import type { RespostaDada } from "./types";

export interface Jogador {
  id: string;
  nome: string;
  turma: string;
}

export interface PartidaRegistrada {
  partida_id: string;
  pontuacao: number;
  acertos: number;
}

/**
 * Cadastra o participante na tabela `usuarios`, com o aceite do aviso de
 * privacidade (LGPD). Só é chamada depois que a caixa foi marcada na tela
 * inicial; o banco recusa cadastro sem consentimento e grava a data/hora do
 * aceite (consentimento_em) pelo relógio do servidor.
 * O id é gerado aqui no navegador (ver lib/uuid.ts) porque o RLS só permite INSERT (o app não
 * pode ler a tabela de volta para descobrir o id gerado pelo banco).
 */
export async function criarJogador(nome: string, turma: string): Promise<Jogador> {
  const supabase = createClient();
  const jogador = { id: gerarUuid(), nome: nome.trim(), turma: turma.trim() };

  const { error } = await supabase
    .from("usuarios")
    .insert({ ...jogador, consentimento: true });
  if (error) throw error;

  return jogador;
}

/**
 * Grava a partida, as respostas e a duração via a função `registrar_partida`
 * do banco (ver supabase/migrations/20261024120000_v2_bloco_b.sql).
 * O banco recalcula acertos e pontuação pelo gabarito, então só enviamos
 * qual alternativa foi escolhida em cada pergunta. tempoMs vai para
 * partidas.tempo_ms (desempate do ranking).
 */
export async function registrarPartida(
  usuarioId: string,
  respostas: RespostaDada[],
  tempoMs: number
): Promise<PartidaRegistrada> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("registrar_partida", {
    p_usuario_id: usuarioId,
    p_respostas: respostas.map(({ pergunta_id, alternativa_id }) => ({
      pergunta_id,
      alternativa_id,
    })),
    p_tempo_ms: Math.round(tempoMs),
  });
  if (error) throw error;
  if (!data?.[0]) throw new Error("O banco não devolveu a partida gravada.");

  return data[0];
}

/**
 * Iniciais para o avatar do ranking: primeira letra do primeiro e do último
 * nome ("Felipe Nascimento" → "FN"; "Ana" → "A").
 */
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}
