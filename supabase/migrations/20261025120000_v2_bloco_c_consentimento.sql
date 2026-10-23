-- =============================================================================
-- V2 — Bloco C: registro do consentimento (LGPD)
--
-- Adaptado do v2_bloco_c.sql da pesquisa. Além das duas colunas:
--   * o banco só aceita cadastro COM consentimento (política de INSERT);
--   * consentimento_em é preenchido pelo próprio banco (now() do servidor),
--     não pelo relógio do aparelho — o que o app mandar nesse campo é
--     ignorado.
-- Os participantes já cadastrados (se houver) ficam com consentimento = false.
-- =============================================================================

alter table public.usuarios add column if not exists consentimento    boolean not null default false;
alter table public.usuarios add column if not exists consentimento_em timestamptz;

-- Carimbo de data/hora do aceite, sempre do servidor.
create or replace function public.carimbar_consentimento()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.consentimento_em := case when new.consentimento then now() end;
  return new;
end;
$$;

create trigger carimbar_consentimento
  before insert on public.usuarios
  for each row execute function public.carimbar_consentimento();

-- Cadastro pelo app só com o aviso de privacidade aceito.
alter policy "Inserção pública de usuarios" on public.usuarios
  with check (consentimento);
