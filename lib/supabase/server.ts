import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

// Cliente do Supabase para Server Components, Server Actions e Route Handlers.
// Deve ser criado a cada requisição (não reutilize entre requisições), pois
// depende dos cookies daquela requisição específica.
export async function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Components não podem gravar cookies. Isso é esperado e pode
          // ser ignorado: a renovação da sessão será feita por um middleware,
          // que vamos adicionar junto com o login (Auth) numa próxima fase.
        }
      },
    },
  });
}
