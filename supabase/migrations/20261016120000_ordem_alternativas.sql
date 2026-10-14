-- =============================================================================
-- Fase 4 (Parte C) — Ordem das alternativas
--
-- alternativas.ordem fixa a ordem A–E de cada pergunta (antes, a ordem
-- vinda do banco não era garantida e as letras podiam trocar entre cargas).
-- =============================================================================


-- Ordem das alternativas -------------------------------------------------------
alter table public.alternativas add column ordem int;

-- Preenche as alternativas que já existem na ordem em que foram inseridas
-- (ordem física da tabela — nunca houve UPDATE nela, então é a ordem do
-- seed), com "Não sei." sempre por último.
with ordenadas as (
  select id,
         row_number() over (
           partition by pergunta_id
           order by (lower(trim(texto)) = 'não sei.'), ctid
         ) as pos
    from public.alternativas
)
update public.alternativas a
   set ordem = o.pos
  from ordenadas o
 where o.id = a.id;

-- Novas alternativas sem "ordem" informada recebem o próximo número da
-- pergunta automaticamente. Assim o seed (supabase/seed.sql) continua
-- funcionando sem precisar listar a ordem: vale a ordem do INSERT.
create function public.definir_ordem_alternativa()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.ordem is null then
    select coalesce(max(a.ordem), 0) + 1
      into new.ordem
      from public.alternativas a
     where a.pergunta_id = new.pergunta_id;
  end if;
  return new;
end;
$$;

create trigger alternativas_definir_ordem
  before insert on public.alternativas
  for each row execute function public.definir_ordem_alternativa();

alter table public.alternativas
  alter column ordem set not null,
  add constraint alternativas_ordem_positiva check (ordem > 0),
  add constraint alternativas_pergunta_ordem_unica unique (pergunta_id, ordem);

comment on column public.alternativas.ordem is
  'Posição da alternativa na pergunta (1 = A … 5 = E; "Não sei." por último).';
