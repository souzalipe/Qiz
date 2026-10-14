-- =============================================================================
-- Fase 4 (Parte B) — Gravação das partidas e ranking
--
-- Cria duas funções (RPC) que o app chama via supabase.rpc(...):
--
--   registrar_partida(usuario, respostas)  → grava a partida e as respostas
--   ranking(partida, limite)               → melhores pontuações
--
-- Por que funções em vez de inserts/selects direto nas tabelas?
--
--   1. Integridade dos dados da pesquisa: a pontuação, os acertos e o campo
--      "correta" de cada resposta são calculados AQUI, a partir do gabarito
--      do banco. O navegador só informa qual alternativa foi escolhida em
--      cada pergunta, então não dá para forjar um resultado.
--   2. Tudo ou nada: a partida e todas as respostas são gravadas na mesma
--      transação. Se algo falhar, nada é gravado (sem partida "pela metade").
--   3. Privacidade: o ranking precisa de nome e turma, mas não queremos
--      liberar a leitura das tabelas usuarios/partidas para o público. A
--      função devolve só as colunas necessárias para montar o ranking.
--
-- "security definer" faz a função rodar com as permissões do dono (e não do
-- visitante), por isso ela consegue ler/gravar mesmo com o RLS bloqueando o
-- acesso direto. "set search_path = ''" é uma proteção recomendada para esse
-- tipo de função: obriga a escrever public.tabela e impede que alguém
-- "sequestre" nomes de tabelas/funções.
-- =============================================================================


-- registrar_partida -----------------------------------------------------------
-- Parâmetros:
--   p_usuario_id  id do participante (criado antes, na tela de nome/turma)
--   p_respostas   lista JSON: [{"pergunta_id": "...", "alternativa_id": "..."}, ...]
-- Retorna: id da partida criada, pontuação e acertos calculados.
create function public.registrar_partida(p_usuario_id uuid, p_respostas jsonb)
returns table (partida_id uuid, pontuacao int, acertos int)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_partida_id uuid := gen_random_uuid();
  v_total      int;
  v_validas    int;
begin
  if p_respostas is null
     or jsonb_typeof(p_respostas) <> 'array'
     or jsonb_array_length(p_respostas) = 0 then
    raise exception 'Nenhuma resposta enviada.';
  end if;

  v_total := jsonb_array_length(p_respostas);

  -- Cria a partida (pontuação/acertos são preenchidos logo abaixo).
  insert into public.partidas (id, usuario_id, pontuacao, acertos)
  values (v_partida_id, p_usuario_id, 0, 0);

  -- Grava as respostas. "correta" vem do gabarito (alternativas.correta);
  -- o join também descarta alternativas que não pertencem à pergunta.
  insert into public.respostas (partida_id, pergunta_id, alternativa_id, correta)
  select v_partida_id, r.pergunta_id, a.id, a.correta
  from jsonb_to_recordset(p_respostas) as r (pergunta_id uuid, alternativa_id uuid)
  join public.alternativas a
    on a.id = r.alternativa_id
   and a.pergunta_id = r.pergunta_id;

  get diagnostics v_validas = row_count;

  -- Se alguma resposta não bateu com o banco, cancela tudo (a exceção
  -- desfaz os inserts acima).
  if v_validas <> v_total then
    raise exception 'Respostas inválidas: % de % reconhecidas.', v_validas, v_total;
  end if;

  -- Consolida o resultado: soma os pontos das perguntas acertadas.
  update public.partidas p
     set pontuacao = coalesce(t.pontos, 0),
         acertos   = coalesce(t.qtd, 0)
    from (
      select sum(pg.pontos)::int as pontos, count(*)::int as qtd
        from public.respostas rs
        join public.perguntas pg on pg.id = rs.pergunta_id
       where rs.partida_id = v_partida_id
         and rs.correta
    ) t
   where p.id = v_partida_id;

  return query
    select p.id, p.pontuacao, p.acertos
      from public.partidas p
     where p.id = v_partida_id;
end;
$$;

comment on function public.registrar_partida(uuid, jsonb) is
  'Grava uma partida e suas respostas, calculando acertos e pontuação pelo gabarito.';


-- ranking ---------------------------------------------------------------------
-- Parâmetros:
--   p_partida_id  partida do jogador atual (opcional): ela sempre vem no
--                 resultado, mesmo fora do top, para poder ser destacada
--   p_limite      quantas posições do topo devolver (1 a 50; padrão 10)
-- Desempate: mais acertos; depois, quem jogou primeiro.
create function public.ranking(p_partida_id uuid default null, p_limite int default 10)
returns table (
  posicao    bigint,
  partida_id uuid,
  nome       text,
  turma      text,
  pontuacao  int,
  acertos    int,
  criado_em  timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  with ordenado as (
    select row_number() over (
             order by p.pontuacao desc, p.acertos desc, p.criado_em asc
           ) as posicao,
           p.id as partida_id,
           u.nome,
           u.turma,
           p.pontuacao,
           p.acertos,
           p.criado_em
      from public.partidas p
      join public.usuarios u on u.id = p.usuario_id
  )
  select *
    from ordenado o
   where o.posicao <= least(greatest(coalesce(p_limite, 10), 1), 50)
      or o.partida_id = p_partida_id
   order by o.posicao;
$$;

comment on function public.ranking(uuid, int) is
  'Ranking das partidas (top N), incluindo sempre a partida informada.';


-- Permissões -------------------------------------------------------------------
-- Por padrão o Postgres deixa qualquer papel executar funções novas; aqui
-- deixamos explícito: só os papéis do app (anon/authenticated).
revoke execute on function public.registrar_partida(uuid, jsonb) from public;
revoke execute on function public.ranking(uuid, int) from public;
grant execute on function public.registrar_partida(uuid, jsonb) to anon, authenticated;
grant execute on function public.ranking(uuid, int) to anon, authenticated;
