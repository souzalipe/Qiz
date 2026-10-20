// Lê e valida as variáveis de ambiente do Supabase (definidas em .env.local).
// Centralizar aqui evita repetir a validação nos clientes de browser e servidor.

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltam NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copie .env.example para .env.local e preencha com as credenciais do seu projeto Supabase."
    );
  }

  return { url, anonKey };
}
