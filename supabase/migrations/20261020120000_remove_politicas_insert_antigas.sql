-- =============================================================================
-- Limpeza: remove as políticas de INSERT direto em partidas/respostas (Fase 2)
--
-- Desde a migration gabarito_protegido o app não tem mais permissão de INSERT
-- nessas tabelas (a gravação é só pela função registrar_partida), então estas
-- políticas já não têm efeito nenhum. Removê-las só deixa o painel coerente.
--
-- Pendente no projeto na nuvem: o conector do Supabase pede uma confirmação
-- para DROP POLICY que não chega até nós; aplique pelo SQL Editor do painel.
-- =============================================================================

drop policy if exists "Inserção pública de partidas" on public.partidas;
drop policy if exists "Inserção pública de respostas" on public.respostas;
