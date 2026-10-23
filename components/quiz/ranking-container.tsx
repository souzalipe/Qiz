"use client";

import { useEffect, useState } from "react";

import { RankingScreen, type RankingEntry } from "@/components/quiz/ranking-screen";
import { iniciais } from "@/lib/quiz/partidas";
import { getRanking, type RankingRow } from "@/lib/quiz/queries";

// Quantas posições do topo mostrar (o jogador aparece logo abaixo se estiver
// fora delas).
const TOP = 10;

type Props = {
  // Partida do jogador atual (null enquanto ainda está sendo gravada): o
  // ranking só é buscado depois de gravada, para já incluir esta partida.
  // Na consulta pela tela inicial não há partida (consulta = true).
  partidaId: string | null;
  consulta?: boolean;
  // Participante atual; ausente se ainda não se cadastrou (sem aba da turma).
  usuarioId?: string;
  salvamento: "salvando" | "salvo" | "erro";
  turma?: string;
  onTentarSalvar: () => void;
  onVoltar: () => void;
};

type Dados = {
  geral: RankingEntry[];
  turma?: RankingEntry[];
  minhaPosicao: number;
  totalParticipantes: number;
  minhaPosicaoTurma?: number;
  totalTurma?: number;
};

// Converte as linhas do banco (uma por participante, já ordenadas) para o
// formato do RankingScreen: top 10 + a linha do jogador, se estiver fora;
// iniciais a partir do nome; "Você" e voce: true na linha do jogador.
function paraEntradas(linhas: RankingRow[]): RankingEntry[] {
  return linhas
    .filter((l, i) => i < TOP || l.voce)
    .map((l) => ({
      posicao: l.posicao,
      iniciais: iniciais(l.nome),
      nome: l.voce ? "Você" : l.nome,
      pontos: l.pontuacao,
      voce: l.voce,
    }));
}

// Posição do jogador e total de participantes da lista.
function minhaPosicao(linhas: RankingRow[]) {
  return { posicao: linhas.find((l) => l.voce)?.posicao ?? 0, total: linhas.length };
}

// Busca o ranking geral e o da turma no Supabase e entrega ao RankingScreen
// (frame 05). Se a partida ainda estiver sendo gravada, espera; se a
// gravação falhou, oferece tentar de novo.
export function RankingContainer({
  partidaId,
  consulta = false,
  usuarioId,
  salvamento,
  turma,
  onTentarSalvar,
  onVoltar,
}: Props) {
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!partidaId && !consulta) return;
    let ativo = true;

    Promise.all([
      getRanking(null, usuarioId),
      // Se a busca da turma falhar, a aba "Minha turma" não aparece.
      turma
        ? getRanking(turma, usuarioId).catch((e: unknown) => {
            console.error(e);
            return null;
          })
        : null,
    ])
      .then(([geral, daTurma]) => {
        if (!ativo) return;
        const g = minhaPosicao(geral);
        const t = daTurma ? minhaPosicao(daTurma) : undefined;
        setDados({
          geral: paraEntradas(geral),
          turma: daTurma ? paraEntradas(daTurma) : undefined,
          minhaPosicao: g.posicao,
          totalParticipantes: g.total,
          minhaPosicaoTurma: t?.posicao,
          totalTurma: t?.total,
        });
      })
      .catch((e: unknown) => {
        console.error(e);
        if (ativo) setErro(true);
      });

    return () => {
      ativo = false;
    };
  }, [partidaId, consulta, usuarioId, turma]);

  if (dados && dados.geral.length > 0) {
    return <RankingScreen {...dados} onVoltar={onVoltar} />;
  }

  // Estados intermediários, no mesmo cartão do design.
  let mensagem: React.ReactNode = "Carregando ranking…";
  if (dados) mensagem = "Ainda não há partidas no ranking. Seja o primeiro!";
  else if (salvamento === "salvando" && !consulta) mensagem = "Salvando sua partida…";
  if (salvamento === "erro" && !consulta) {
    mensagem = (
      <>
        Não foi possível salvar sua partida.{" "}
        <button type="button" onClick={onTentarSalvar} className="font-medium underline">
          Tentar de novo
        </button>
      </>
    );
  } else if (erro) {
    mensagem = "Não foi possível carregar o ranking.";
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border-[0.5px] border-[var(--quiz-border)] bg-[var(--quiz-surface)] px-5 py-[22px]">
      <div className="flex items-center gap-[10px]">
        <button type="button" onClick={onVoltar} aria-label="Voltar" className="text-[22px] text-[var(--quiz-text-muted)]">
          ‹
        </button>
        <span className="text-[18px] font-medium text-[var(--quiz-text)]">Ranking</span>
      </div>
      <p
        className={`text-[13px] ${
          (salvamento === "erro" && !consulta) || erro ? "text-[var(--quiz-error-text)]" : "text-[var(--quiz-text-muted)]"
        }`}
      >
        {mensagem}
      </p>
    </div>
  );
}
