-- =============================================================================
-- Fase 5 — Função classificacao (ranking do frame 05)
--
-- Substitui a função ranking (Parte B) na tela nova, que precisa de duas
-- coisas a mais:
--   * total de participantes, para "Você está em Xº de Y participantes";
--   * filtro por turma, para a aba "Minha turma".
--
-- A função antiga `ranking` fica no banco sem uso (removê-la é um DROP, que
-- pode ser feito depois pelo SQL Editor).
-- =============================================================================

-- Parâmetros:
--   p_partida_id  partida do jogador atual: vem sempre no resultado (mesmo
--                 fora do top), para ser destacada e dar a posição dele
--   p_turma       se informada, só partidas dessa turma (posições recalculadas
--                 dentro da turma). Compara sem diferenciar maiúsculas e
--                 espaços nas pontas ("Mestrado2026" = " mestrado2026").
--   p_limite      quantas posições do topo devolver (1 a 50; padrão 10)
-- Desempate: mais acertos; depois, quem jogou primeiro.
-- Cada linha é uma PARTIDA (quem jogou duas vezes aparece duas vezes).
create function public.classificacao(
  p_partida_id uuid default null,
  p_turma      text default null,
  p_limite     int  default 10
)
returns table (
  posicao    bigint,
  partida_id uuid,
  nome       text,
  pontuacao  int,
  total      bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  with filtradas as (
    select p.id, p.pontuacao, p.acertos, p.criado_em, u.nome
      from public.partidas p
      join public.usuarios u on u.id = p.usuario_id
     where p_turma is null
        or lower(trim(u.turma)) = lower(trim(p_turma))
  ),
  ordenado as (
    select row_number() over (
             order by f.pontuacao desc, f.acertos desc, f.criado_em asc
           ) as posicao,
           f.id as partida_id,
           f.nome,
           f.pontuacao,
           count(*) over () as total
      from filtradas f
  )
  select *
    from ordenado o
   where o.posicao <= least(greatest(coalesce(p_limite, 10), 1), 50)
      or o.partida_id = p_partida_id
   order by o.posicao;
$$;

comment on function public.classificacao(uuid, text, int) is
  'Ranking (geral ou por turma) com total de participantes, incluindo sempre a partida informada.';

revoke execute on function public.classificacao(uuid, text, int) from public;
grant execute on function public.classificacao(uuid, text, int) to anon, authenticated;
