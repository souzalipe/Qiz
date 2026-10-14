-- =============================================================================
-- Fase 4 (Parte C) — Gabarito protegido
--
--   1. Gabarito fora do navegador: o app deixa de poder ler
--      alternativas.correta e perguntas.feedback (o feedback também entrega
--      a resposta). A correção vem da função responder (migration anterior).
--   2. Fecha os inserts diretos em partidas/respostas: a gravação passa a
--      ser feita só pela função registrar_partida (Parte B), que valida tudo.
-- =============================================================================


-- 1. Gabarito protegido --------------------------------------------------------
-- Permissões por coluna: o app (anon/authenticated) continua lendo o
-- conteúdo das perguntas, mas não as colunas que revelam a resposta.
-- (É preciso tirar o SELECT da tabela inteira antes de liberar coluna a coluna.)
revoke select on public.alternativas from anon, authenticated;
grant select (id, pergunta_id, texto, ordem) on public.alternativas to anon, authenticated;

revoke select on public.perguntas from anon, authenticated;
grant select (id, categoria_id, enunciado, pontos) on public.perguntas to anon, authenticated;

-- 2. Fecha inserts diretos em partidas e respostas -----------------------------
-- Partidas e respostas só entram pela função registrar_partida, que recalcula
-- acertos e pontuação pelo gabarito. (usuarios continua aceitando INSERT
-- direto: é o cadastro de nome/turma.)
drop policy "Inserção pública de partidas" on public.partidas;
drop policy "Inserção pública de respostas" on public.respostas;
revoke insert on public.partidas, public.respostas from anon, authenticated;
