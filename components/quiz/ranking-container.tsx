"use client";

import { useEffect, useState } from "react";

import { RankingScreen, type RankingEntry } from "@/components/quiz/ranking-screen";
import {
  getClassificacao,
  iniciais,
  type LinhaClassificacao,
} from "@/lib/quiz/partidas";

type Props = {
  // Partida do jogador atual (null enquanto ainda está sendo gravada).
  partidaId: string | null;
  salvamento: "salvando" | "salvo" | "erro";
  turma: string;
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

// Converte as linhas do banco para o formato do RankingScreen: iniciais a
// partir do nome, "Você" e voce: true na partida do jogador atual.
function paraEntradas(linhas: LinhaClassificacao[], partidaId: string): RankingEntry[] {
  return linhas.map((l) => {
    const voce = l.partida_id === partidaId;
    return {
      posicao: l.posicao,
      iniciais: iniciais(l.nome),
      nome: voce ? "Você" : l.nome,
      pontos: l.pontuacao,
      voce,
    };
  });
}

// Posição e total do jogador numa lista (a partida dele sempre vem na lista).
function minhaPosicao(linhas: LinhaClassificacao[], partidaId: string) {
  const minha = linhas.find((l) => l.partida_id === partidaId);
  return { posicao: minha?.posicao ?? 0, total: linhas[0]?.total ?? 0 };
}

// Busca o ranking geral e o da turma no Supabase e entrega ao RankingScreen
// (frame 05). Se a partida ainda estiver sendo gravada, espera; se a
// gravação falhou, oferece tentar de novo.
export function RankingContainer({
  partidaId,
  salvamento,
  turma,
  onTentarSalvar,
  onVoltar,
}: Props) {
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!partidaId) return;
    let ativo = true;

    Promise.all([
      getClassificacao(partidaId),
      // Se a busca da turma falhar, a aba "Minha turma" mostra o geral.
      getClassificacao(partidaId, turma).catch((e: unknown) => {
        console.error(e);
        return null;
      }),
    ])
      .then(([geral, daTurma]) => {
        if (!ativo) return;
        const g = minhaPosicao(geral, partidaId);
        const t = daTurma ? minhaPosicao(daTurma, partidaId) : undefined;
        setDados({
          geral: paraEntradas(geral, partidaId),
          turma: daTurma ? paraEntradas(daTurma, partidaId) : undefined,
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
  }, [partidaId, turma]);

  if (dados) {
    return <RankingScreen {...dados} onVoltar={onVoltar} />;
  }

  // Estados intermediários, no mesmo cartão do design.
  let mensagem: React.ReactNode = "Carregando ranking…";
  if (salvamento === "salvando") mensagem = "Salvando sua partida…";
  if (salvamento === "erro") {
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
    <div className="flex w-full flex-col gap-4 rounded-3xl border-[0.5px] border-[#dad7ce] bg-white px-5 py-[22px]">
      <div className="flex items-center gap-[10px]">
        <button type="button" onClick={onVoltar} aria-label="Voltar" className="text-[22px] text-[#706f68]">
          ‹
        </button>
        <span className="text-[18px] font-medium text-[#1b1b19]">Ranking</span>
      </div>
      <p
        className={`text-[13px] ${
          salvamento === "erro" || erro ? "text-[#c0392b]" : "text-[#706f68]"
        }`}
      >
        {mensagem}
      </p>
    </div>
  );
}
