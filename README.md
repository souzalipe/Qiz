# Quiz Circular

Web app responsivo (mobile-first) com um quiz sobre **economia circular**,
voltado a estudantes de pós-graduação. Produto da dissertação de mestrado.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com) (Postgres, Auth, RLS) via `@supabase/ssr`
- Deploy pensado para a [Vercel](https://vercel.com)

## Estrutura de pastas

```
app/                 Rotas e páginas (App Router)
  layout.tsx         Layout raiz (fontes, metadados, viewport mobile)
  page.tsx           Página inicial ("Olá, Quiz Circular")
  globals.css        Tema branco + verde (variáveis do shadcn/ui)
components/
  ui/                Componentes do shadcn/ui (button, card…)
lib/
  utils.ts           Helper cn() do shadcn/ui
  supabase/
    env.ts           Leitura/validação das variáveis de ambiente
    client.ts        Cliente Supabase para o navegador ("use client")
    server.ts        Cliente Supabase para o servidor (Server Components)
types/
  database.ts        Tipos do banco (gerados pelo Supabase a partir da Fase 2)
supabase/
  migrations/        Migrations SQL versionadas (estrutura do banco + RLS)
```

## Como rodar localmente

Pré-requisito: Node.js 18.18+ (recomendado 20 ou 22).

```bash
npm install
cp .env.example .env.local   # depois preencha com as credenciais do Supabase
npm run dev
```

Abra http://localhost:3000. Para testar no celular, acesse
`http://<IP-do-seu-computador>:3000` na mesma rede Wi-Fi.

As credenciais ficam no dashboard do Supabase em
**Project Settings > API**: `Project URL` → `NEXT_PUBLIC_SUPABASE_URL` e
`anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Outros comandos

| Comando         | O que faz                          |
| --------------- | ---------------------------------- |
| `npm run build` | Gera o build de produção           |
| `npm start`     | Roda o build de produção           |
| `npm run lint`  | Verifica o código com ESLint       |

### Adicionando componentes do shadcn/ui

```bash
npx shadcn@latest add dialog
```

O `components.json` já está configurado; os componentes vão para `components/ui`.

## Banco de dados (Supabase)

A estrutura do banco fica em `supabase/migrations/`, em arquivos SQL
versionados e aplicados em ordem (o prefixo é a data/hora):

| Arquivo | O que faz |
| ------- | --------- |
| `20261012120000_criar_tabelas_quiz.sql` | Cria as 6 tabelas, chaves estrangeiras e índices |
| `20261012120100_rls_politicas_iniciais.sql` | Ativa o RLS e cria as políticas iniciais |
| `20261014120000_registro_partida_e_ranking.sql` | Funções `registrar_partida` (grava partida + respostas, calculando a pontuação pelo gabarito) e `ranking` |
| `20261016120000_ordem_alternativas.sql` | Coluna `alternativas.ordem` (A–E fixos, "Não sei." por último) |
| `20261016120100_funcao_responder.sql` | Função `responder`: corrige cada resposta no servidor |
| `20261016120200_gabarito_protegido.sql` | Bloqueia `correta`/`feedback` para o app e fecha inserts diretos em `partidas`/`respostas` |
| `20261019120000_redistribui_letra_correta.sql` | Reposiciona as alternativas: 8 corretas em cada letra A–D ("Não sei." em E) |
| `20261019120100_classificacao.sql` | Função `classificacao`: ranking geral/por turma com total de participantes |

### Seed (perguntas do quiz)

O conteúdo do quiz (categorias, perguntas e alternativas) fica em
`supabase/seed.sql`. Ele roda automaticamente depois das migrations no
`npx supabase db reset` (banco local). No projeto na nuvem, o seed **não** roda
com `db push` — aplique uma vez pelo SQL Editor do painel.

As alternativas não precisam informar `ordem`: um trigger numera na ordem do
INSERT (a primeira inserida de cada pergunta é a A). Mantenha "Não sei." como a
última de cada pergunta.

**Atenção:** as posições balanceadas (8 corretas por letra) são aplicadas pela
migration `20261019120000_redistribui_letra_correta.sql`, que roda *antes* do
seed num banco recriado do zero — e por isso não encontra alternativas para
reposicionar. Ao montar o `seed.sql`, inclua a coluna `ordem` nos INSERTs com
as posições balanceadas (ou rode o conteúdo dessa migration no fim do seed).

As duas migrations já estão aplicadas no projeto Supabase do quiz
(ref `yuonmgkzbzvytxdvhytr`, organização "Felipe Projects").

Para aplicar num projeto Supabase pela linha de comando:

```bash
npx supabase login
npx supabase link --project-ref <id-do-projeto>
npx supabase db push
```

Nunca altere uma migration que já foi aplicada: para mudar a estrutura, crie
uma nova migration (`npx supabase migration new <nome>`).

## Fases

- [x] **Fase 1 — Fundação:** projeto, tema, shadcn/ui e cliente do Supabase.
- [x] **Fase 2 — Banco de dados:** tabelas, RLS e tipos gerados.
- [ ] Próximas fases: fluxo do quiz, cadastro/login, resultados e deploy.
