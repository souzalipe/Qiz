import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// Variáveis NEXT_PUBLIC_* são embutidas no JavaScript durante o BUILD (não
// são lidas com o site no ar). Se faltarem no build, o deploy "passa", mas o
// site publicado quebra ao buscar as perguntas. Então o build falha cedo, com
// uma mensagem clara — na Vercel, configure-as em Settings > Environment
// Variables antes do deploy.
const VARIAVEIS_OBRIGATORIAS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) {
    const faltando = VARIAVEIS_OBRIGATORIAS.filter((nome) => !process.env[nome]);
    if (faltando.length > 0) {
      throw new Error(
        `Build cancelado: faltam as variáveis de ambiente ${faltando.join(", ")}. ` +
          "Localmente, preencha o .env.local (veja .env.example). " +
          "Na Vercel, cadastre-as em Settings > Environment Variables e refaça o deploy."
      );
    }
  }

  return {
    // A raiz do site leva direto ao quiz: abrir o site = começar o quiz.
    // permanent: false (redirect 307) para não ficar gravado no cache do
    // navegador — se um dia a raiz virar outra página, ninguém fica preso.
    async redirects() {
      return [{ source: "/", destination: "/quiz", permanent: false }];
    },
  };
}
