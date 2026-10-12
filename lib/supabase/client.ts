import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

// Cliente do Supabase para Client Components (código que roda no navegador,
// arquivos com "use client"). A sessão do usuário fica guardada em cookies,
// o que permite que o servidor também a leia (ver server.ts).
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
