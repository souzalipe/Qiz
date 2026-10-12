import { Recycle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Página inicial provisória (Fase 1): serve só para confirmar que Next.js,
// Tailwind, shadcn/ui e as variáveis do Supabase estão funcionando.
export default function Home() {
  const supabaseOk = isSupabaseConfigured();

  return (
    // Layout mobile-first: coluna única, centralizada, com largura máxima
    // de celular mesmo quando aberto no computador.
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-secondary text-primary flex size-20 items-center justify-center rounded-full">
          <Recycle className="size-10" aria-hidden />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
         Seja-bem vindo ao Quiz Circular
        </h1>
        <p className="text-muted-foreground">
          Teste seus conhecimentos sobre economia circular.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Status da Fase 1</CardTitle>
          <CardDescription>Verificação rápida da configuração.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>✅ Next.js + TypeScript</li>
            <li>✅ Tailwind CSS + shadcn/ui</li>
            <li>
              {supabaseOk ? "✅" : "⚠️"} Supabase{" "}
              {supabaseOk
                ? "configurado"
                : "— preencha o .env.local com as credenciais do projeto"}
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Botão apenas ilustrativo: o fluxo do quiz entra nas próximas fases. */}
      <Button size="lg" className="w-full" disabled>
        Começar quiz (em breve)
      </Button>
    </main>
  );
}
