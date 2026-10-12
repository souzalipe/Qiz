-- =============================================================================
-- Fase 2 — Estrutura do banco do Quiz Circular
--
-- Cria as 6 tabelas do quiz, na ordem exigida pelas chaves estrangeiras:
--   categorias → perguntas → alternativas → usuarios → partidas → respostas
--
-- Convenções:
--   * Todas as chaves primárias são uuid gerados pelo próprio banco
--     (gen_random_uuid()), então o app não precisa se preocupar com IDs.
--   * Colunas sem as quais o registro não faz sentido são NOT NULL.
--   * Toda coluna de chave estrangeira ganha um índice: o Postgres não cria
--     esses índices sozinho, e eles aceleram os JOINs e as exclusões em cascata.
-- =============================================================================


-- 1. categorias ---------------------------------------------------------------
-- Temas do quiz (ex.: "Conceitos básicos", "Modelos de negócio circulares").
create table public.categorias (
  id   uuid primary key default gen_random_uuid(),
  nome text not null unique  -- não permite duas categorias com o mesmo nome
);

comment on table public.categorias is 'Temas em que as perguntas do quiz são agrupadas.';


-- 2. perguntas ----------------------------------------------------------------
-- Cada pergunta pertence a uma categoria. "feedback" é o texto explicativo
-- mostrado depois que o estudante responde.
create table public.perguntas (
  id           uuid primary key default gen_random_uuid(),
  -- on delete restrict: impede apagar uma categoria que ainda tem perguntas
  categoria_id uuid not null references public.categorias (id) on delete restrict,
  enunciado    text not null,
  feedback     text,
  pontos       int  not null default 10 check (pontos >= 0)
);

create index perguntas_categoria_id_idx on public.perguntas (categoria_id);

comment on table public.perguntas is 'Perguntas do quiz, com feedback pedagógico e pontuação.';


-- 3. alternativas -------------------------------------------------------------
-- Opções de resposta de cada pergunta. "correta" marca a(s) alternativa(s) certa(s).
create table public.alternativas (
  id          uuid primary key default gen_random_uuid(),
  -- on delete cascade: apagar a pergunta apaga junto as suas alternativas
  pergunta_id uuid    not null references public.perguntas (id) on delete cascade,
  texto       text    not null,
  correta     boolean not null default false,

  -- Restrição auxiliar usada pela tabela respostas (ver abaixo) para garantir
  -- que a alternativa escolhida pertence à pergunta respondida.
  unique (id, pergunta_id)
);

create index alternativas_pergunta_id_idx on public.alternativas (pergunta_id);

comment on table public.alternativas is 'Alternativas de resposta de cada pergunta.';


-- 4. usuarios -----------------------------------------------------------------
-- Participantes do quiz (estudantes). Por enquanto é um cadastro simples,
-- sem vínculo com o Supabase Auth; isso pode ser revisto numa fase futura.
create table public.usuarios (
  id        uuid primary key default gen_random_uuid(),
  nome      text        not null,
  turma     text,
  criado_em timestamptz not null default now()
);

comment on table public.usuarios is 'Participantes do quiz (estudantes de pós-graduação).';


-- 5. partidas -----------------------------------------------------------------
-- Cada vez que um usuário joga o quiz, uma partida é registrada com o
-- resultado consolidado.
create table public.partidas (
  id         uuid primary key default gen_random_uuid(),
  -- on delete cascade: apagar um usuário apaga junto o histórico dele
  usuario_id uuid        not null references public.usuarios (id) on delete cascade,
  pontuacao  int         not null default 0 check (pontuacao >= 0),
  acertos    int         not null default 0 check (acertos >= 0),
  criado_em  timestamptz not null default now()
);

create index partidas_usuario_id_idx on public.partidas (usuario_id);

comment on table public.partidas is 'Partidas jogadas, com pontuação e número de acertos.';


-- 6. respostas ----------------------------------------------------------------
-- Cada alternativa escolhida pelo usuário dentro de uma partida. É a base
-- para as análises da pesquisa (quais perguntas mais erradas etc.).
create table public.respostas (
  id             uuid primary key default gen_random_uuid(),
  -- on delete cascade: apagar uma partida apaga junto as suas respostas
  partida_id     uuid    not null references public.partidas (id) on delete cascade,
  pergunta_id    uuid    not null references public.perguntas (id) on delete restrict,
  alternativa_id uuid    not null references public.alternativas (id) on delete restrict,
  correta        boolean not null,

  -- Garante que a alternativa escolhida é de fato uma opção da pergunta
  -- respondida (evita, por exemplo, gravar a alternativa da pergunta 2 como
  -- resposta da pergunta 1).
  foreign key (alternativa_id, pergunta_id)
    references public.alternativas (id, pergunta_id) on delete restrict,

  -- Cada pergunta só pode ser respondida uma vez em cada partida.
  unique (partida_id, pergunta_id)
);

create index respostas_pergunta_id_idx on public.respostas (pergunta_id);
create index respostas_alternativa_id_idx on public.respostas (alternativa_id, pergunta_id);
-- (partida_id já é coberto pelo índice da restrição unique acima)

comment on table public.respostas is 'Respostas dadas em cada partida (uma por pergunta).';
