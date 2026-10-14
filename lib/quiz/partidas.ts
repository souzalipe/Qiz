// Gravação dos dados da pesquisa (usuarios, partidas, respostas) e leitura
// do ranking. Usa o cliente Supabase do navegador: chamar só em Client
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

export interface LinhaRanking {
  posicao: number;
  partida_id: string;
  nome: string;
  turma: string | null;
  pontuacao: number;
  acertos: number;
}

/**
 * Cadastra o participante na tabela `usuarios`.
 * O id é gerado aqui no navegador (ver lib/uuid.ts) porque o RLS só permite INSERT (o app não
 * pode ler a tabela de volta para descobrir o id gerado pelo banco).
 */
export async function criarJogador(nome: string, turma: string): Promise<Jogador> {
  const supabase = createClient();
  const jogador = { id: gerarUuid(), nome: nome.trim(), turma: turma.trim() };

  const { error } = await supabase.from("usuarios").insert(jogador);
  if (error) throw error;

  return jogador;
}

/**
 * Grava a partida e as respostas via a função `registrar_partida` do banco
 * (ver supabase/migrations/20261014120000_registro_partida_e_ranking.sql).
 * O banco recalcula acertos e pontuação pelo gabarito, então só enviamos
 * qual alternativa foi escolhida em cada pergunta.
 */
export async function registrarPartida(
  usuarioId: string,
  respostas: RespostaDada[]
): Promise<PartidaRegistrada> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("registrar_partida", {
    p_usuario_id: usuarioId,
    p_respostas: respostas.map(({ pergunta_id, alternativa_id }) => ({
      pergunta_id,
      alternativa_id,
    })),
  });
  if (error) throw error;
  if (!data?.[0]) throw new Error("O banco não devolveu a partida gravada.");

  return data[0];
}

/**
 * Busca o ranking (top `limite`). Se `partidaId` for informado, essa partida
 * sempre vem junto, mesmo fora do top, para ser destacada na tela.
 */
export async function getRanking(partidaId?: string, limite = 10): Promise<LinhaRanking[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("ranking", {
    p_partida_id: partidaId,
    p_limite: limite,
  });
  if (error) throw error;

  return data ?? [];
}
