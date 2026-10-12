-- =============================================================================
-- Fase 2 — Segurança (Row Level Security)
--
-- Com RLS ativado, o Supabase BLOQUEIA tudo por padrão: só passa o que alguma
-- política (policy) liberar explicitamente. As políticas abaixo são
-- propositalmente simples e serão refinadas nas próximas fases.
--
-- Papéis do Supabase:
--   anon          = visitante não logado (usa a anon key do .env.local)
--   authenticated = usuário logado via Supabase Auth
-- =============================================================================


-- Ativa o RLS em todas as tabelas ---------------------------------------------
alter table public.categorias   enable row level security;
alter table public.perguntas    enable row level security;
alter table public.alternativas enable row level security;
alter table public.usuarios     enable row level security;
alter table public.partidas     enable row level security;
alter table public.respostas    enable row level security;


-- Conteúdo do quiz: leitura pública -------------------------------------------
-- Qualquer pessoa pode LER categorias, perguntas e alternativas.
-- Ninguém pode inserir/alterar/apagar pelo app: o conteúdo será cadastrado
-- via migrations/seed ou pelo painel (que usa um papel administrativo e
-- ignora o RLS).
--
-- ATENÇÃO (para refinar depois): a coluna alternativas.correta também fica
-- legível, ou seja, um usuário curioso conseguiria descobrir o gabarito
-- consultando a API diretamente.

create policy "Leitura pública de categorias"
  on public.categorias for select
  to anon, authenticated
  using (true);

create policy "Leitura pública de perguntas"
  on public.perguntas for select
  to anon, authenticated
  using (true);

create policy "Leitura pública de alternativas"
  on public.alternativas for select
  to anon, authenticated
  using (true);


-- Dados dos participantes: somente inserção -----------------------------------
-- O app pode CRIAR usuários, partidas e respostas, mas não pode ler, alterar
-- nem apagar esses registros (protege os dados dos participantes).
--
-- Consequência prática: como não há permissão de leitura, o app não consegue
-- usar ".insert(...).select()" para descobrir o id gerado. A solução é o
-- próprio app gerar o id (crypto.randomUUID()) e enviá-lo no insert.

create policy "Inserção pública de usuarios"
  on public.usuarios for insert
  to anon, authenticated
  with check (true);

create policy "Inserção pública de partidas"
  on public.partidas for insert
  to anon, authenticated
  with check (true);

create policy "Inserção pública de respostas"
  on public.respostas for insert
  to anon, authenticated
  with check (true);


-- Permissões de tabela (GRANTs) -----------------------------------------------
-- As políticas acima só funcionam se o papel também tiver a permissão
-- "de tabela" correspondente. Deixamos explícito o mínimo necessário, em vez
-- de depender dos privilégios padrão do projeto.
grant select on public.categorias, public.perguntas, public.alternativas
  to anon, authenticated;

grant insert on public.usuarios, public.partidas, public.respostas
  to anon, authenticated;
