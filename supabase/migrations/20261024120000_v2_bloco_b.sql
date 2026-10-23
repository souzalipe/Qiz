-- =============================================================================
-- V2 — Bloco B: tempo da partida, desafios diários e ranking por participante
--
-- Adaptado do v2_bloco_b.sql da pesquisa, mantendo as proteções das fases
-- anteriores (gabarito protegido, gravação só via registrar_partida):
--
--   1. partidas.tempo_ms — duração da partida (desempate do ranking).
--      Gravado pela registrar_partida (nova versão com p_tempo_ms), porque o
--      app não tem permissão de INSERT/UPDATE direto em partidas.
--   2. Tabela desafios (20 itens) + desafio_do_dia().
--   3. obter_ranking(p_turma, p_usuario_id) — melhor partida de cada
--      participante, desempate pelo menor tempo.
--      Diferenças em relação ao SQL original:
--        * SECURITY DEFINER: o app não pode ler usuarios/partidas (RLS); como
--          função comum ela devolveria sempre uma lista vazia.
--        * Não devolve usuario_id: com o id de outra pessoa daria para gravar
--          partidas no nome dela. Em vez disso o app informa o próprio id
--          (p_usuario_id) e a função devolve "voce = true" na linha dele.
--   4. registrar_partida agora exige exatamente 10 respostas (as 10
--      perguntas sorteadas), para ninguém somar pontos de mais perguntas
--      enviando a lista à mão.
--
-- Não altera perguntas nem dados já coletados.
-- =============================================================================


-- 1) Tempo na partida ---------------------------------------------------------
-- Duração em milissegundos (quanto menor, melhor no empate). Nulo nas partidas
-- antigas, que ficam atrás no desempate.
alter table public.partidas add column if not exists tempo_ms int
  check (tempo_ms is null or tempo_ms >= 0);


-- 2) Desafios diários ---------------------------------------------------------
create table if not exists public.desafios (
  id    uuid primary key default gen_random_uuid(),
  texto text not null,
  ordem int  not null,
  ativo boolean not null default true
);

alter table public.desafios enable row level security;

create policy "Leitura pública de desafios"
  on public.desafios for select
  to anon, authenticated
  using (true);

-- Só leitura para o app (cadastro/edição pelo painel do Supabase).
revoke all on public.desafios from anon, authenticated;
grant select on public.desafios to anon, authenticated;

-- Seed (só insere se a tabela estiver vazia) — 20 desafios
insert into public.desafios (texto, ordem)
select texto, ordem from (values
  ('Separe hoje o lixo reciclável do orgânico na sua casa.', 1),
  ('Leve pilhas ou eletrônicos usados a um ponto de coleta.', 2),
  ('Use uma garrafa ou copo reutilizável no lugar dos descartáveis.', 3),
  ('Recuse um canudo ou sacola plástica em alguma compra hoje.', 4),
  ('Conserte um objeto quebrado em vez de comprar um novo.', 5),
  ('Comece uma pequena composteira com restos de frutas e legumes.', 6),
  ('Doe uma roupa ou objeto que você não usa mais.', 7),
  ('Leve sua própria sacola retornável ao mercado.', 8),
  ('Descubra onde fica o ecoponto ou cooperativa de catadores mais próxima.', 9),
  ('Evite o desperdício: aproveite as sobras de comida numa nova refeição.', 10),
  ('Prefira comprar a granel para reduzir embalagens.', 11),
  ('Desligue aparelhos da tomada que ficam em standby.', 12),
  ('Imprima menos: resolva algo hoje só no digital.', 13),
  ('Reaproveite um pote de vidro como organizador ou vaso.', 14),
  ('Escolha um produto durável no lugar de um descartável.', 15),
  ('Faça uma lista antes de comprar para evitar o consumo por impulso.', 16),
  ('Ofereça carona ou use transporte coletivo numa viagem hoje.', 17),
  ('Separe o óleo de cozinha usado para descarte ou reciclagem corretos.', 18),
  ('Troque um item com alguém em vez de comprar um novo.', 19),
  ('Pesquise a origem de um produto antes de comprá-lo.', 20)
) as v(texto, ordem)
where not exists (select 1 from public.desafios);


-- 3) Desafio do dia (rotaciona pela data, fuso de São Paulo) ------------------
-- Função comum (security invoker): a tabela desafios já é de leitura pública.
create or replace function public.desafio_do_dia()
returns table (id uuid, texto text)
language sql
stable
set search_path = ''
as $$
  select d.id, d.texto
    from public.desafios d
   where d.ativo
   order by d.ordem
  offset (
    (extract(doy from (now() at time zone 'America/Sao_Paulo'))::int - 1)
    % greatest((select count(*) from public.desafios where ativo), 1)
  )
   limit 1;
$$;

revoke execute on function public.desafio_do_dia() from public;
grant execute on function public.desafio_do_dia() to anon, authenticated;


-- 4) Ranking: melhor partida por participante, desempate pelo tempo -----------
-- p_turma      NULL = geral; 'X' = só a turma X (nome exato da lista TURMAS)
-- p_usuario_id participante atual: a linha dele vem com voce = true
create or replace function public.obter_ranking(
  p_turma      text default null,
  p_usuario_id uuid default null
)
returns table (
  posicao   bigint,
  nome      text,
  turma     text,
  pontuacao int,
  tempo_ms  int,
  voce      boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  with melhores as (
    select distinct on (u.id)
           u.id, u.nome, u.turma, p.pontuacao, p.tempo_ms, p.criado_em
      from public.usuarios u
      join public.partidas p on p.usuario_id = u.id
     where p_turma is null or u.turma = p_turma
     order by u.id, p.pontuacao desc, p.tempo_ms asc nulls last, p.criado_em asc
  )
  select rank() over (order by m.pontuacao desc, m.tempo_ms asc nulls last) as posicao,
         m.nome,
         m.turma,
         m.pontuacao,
         m.tempo_ms,
         coalesce(m.id = p_usuario_id, false) as voce
    from melhores m
   order by posicao, m.criado_em;
$$;

comment on function public.obter_ranking(text, uuid) is
  'Ranking (geral ou por turma): melhor partida de cada participante, desempate pelo menor tempo.';

revoke execute on function public.obter_ranking(text, uuid) from public;
grant execute on function public.obter_ranking(text, uuid) to anon, authenticated;


-- 5) registrar_partida com tempo ----------------------------------------------
-- Nova versão (3 parâmetros). A versão antiga (2 parâmetros) fica no banco sem
-- uso pelo app; removê-la é um DROP FUNCTION, que pode ser feito pelo SQL Editor.
create or replace function public.registrar_partida(
  p_usuario_id uuid,
  p_respostas  jsonb,
  p_tempo_ms   int
)
returns table (partida_id uuid, pontuacao int, acertos int)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  -- Mesmo valor de PERGUNTAS_POR_PARTIDA (lib/quiz/queries.ts).
  c_por_partida constant int := 10;
  v_partida_id  uuid := gen_random_uuid();
  v_validas     int;
begin
  if p_respostas is null
     or jsonb_typeof(p_respostas) <> 'array'
     or jsonb_array_length(p_respostas) <> c_por_partida then
    raise exception 'A partida deve ter exatamente % respostas.', c_por_partida;
  end if;

  -- Até 24 h; fora disso é erro do relógio do aparelho → grava sem tempo.
  if p_tempo_ms is not null and (p_tempo_ms < 0 or p_tempo_ms > 86400000) then
    p_tempo_ms := null;
  end if;

  insert into public.partidas (id, usuario_id, pontuacao, acertos, tempo_ms)
  values (v_partida_id, p_usuario_id, 0, 0, p_tempo_ms);

  -- "correta" vem do gabarito; o join descarta alternativas de outra pergunta.
  -- Pergunta repetida é barrada pela unique (partida_id, pergunta_id).
  insert into public.respostas (partida_id, pergunta_id, alternativa_id, correta)
  select v_partida_id, r.pergunta_id, a.id, a.correta
  from jsonb_to_recordset(p_respostas) as r (pergunta_id uuid, alternativa_id uuid)
  join public.alternativas a
    on a.id = r.alternativa_id
   and a.pergunta_id = r.pergunta_id;

  get diagnostics v_validas = row_count;

  if v_validas <> c_por_partida then
    raise exception 'Respostas inválidas: % de % reconhecidas.', v_validas, c_por_partida;
  end if;

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

comment on function public.registrar_partida(uuid, jsonb, int) is
  'Grava uma partida de 10 respostas com a duração, calculando acertos e pontuação pelo gabarito.';

revoke execute on function public.registrar_partida(uuid, jsonb, int) from public;
grant execute on function public.registrar_partida(uuid, jsonb, int) to anon, authenticated;
