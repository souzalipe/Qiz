-- =============================================================================
-- Fase 4 (Parte C) — Função responder (correção no servidor)
--
-- O app passa a pedir a correção de cada resposta a esta função, em vez de
-- ler alternativas.correta. O bloqueio dessas colunas para o app vem na
-- migration seguinte (20261016120200_gabarito_protegido.sql).
-- =============================================================================


-- responder: corrige UMA resposta. O app chama ao clicar numa alternativa e
-- recebe se acertou, qual era a correta e o feedback — só dessa pergunta,
-- só depois de responder.
create function public.responder(p_pergunta_id uuid, p_alternativa_id uuid)
returns table (
  acertou                boolean,
  alternativa_correta_id uuid,
  feedback               text,
  pontos                 int
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  -- A alternativa precisa ser uma opção da pergunta informada.
  if not exists (
    select 1 from public.alternativas a
     where a.id = p_alternativa_id and a.pergunta_id = p_pergunta_id
  ) then
    raise exception 'Alternativa não pertence à pergunta.';
  end if;

  return query
    select (c.id = p_alternativa_id),
           c.id,
           p.feedback,
           case when c.id = p_alternativa_id then p.pontos else 0 end
      from public.perguntas p
      join public.alternativas c
        on c.pergunta_id = p.id and c.correta
     where p.id = p_pergunta_id
     limit 1;
end;
$$;

comment on function public.responder(uuid, uuid) is
  'Corrige uma resposta: devolve se acertou, a alternativa correta, o feedback e os pontos.';

revoke execute on function public.responder(uuid, uuid) from public;
grant execute on function public.responder(uuid, uuid) to anon, authenticated;
