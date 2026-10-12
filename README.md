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

## Fases

- [x] **Fase 1 — Fundação:** projeto, tema, shadcn/ui e cliente do Supabase.
- [ ] **Fase 2 — Banco de dados:** tabelas, RLS e tipos gerados.
- [ ] Próximas fases: fluxo do quiz, cadastro/login, resultados e deploy.
