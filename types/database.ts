// Tipos do banco de dados do Supabase.
//
// Por enquanto é um esqueleto vazio: as tabelas (categorias, perguntas,
// alternativas, usuarios, partidas, respostas) serão criadas na Fase 2.
// Depois disso, este arquivo será regenerado automaticamente com:
//
//   npx supabase gen types typescript --project-id <id-do-projeto> > types/database.ts
//
// Assim os clientes em lib/supabase passam a ter autocompletar e checagem
// de tipos em todas as consultas.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
