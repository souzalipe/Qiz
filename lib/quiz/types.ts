// lib/quiz/types.ts
// Tipos do quiz — espelham as tabelas do Supabase

export interface Categoria {
  id: string;
  nome: string;
}

export interface Alternativa {
  id: string;
  pergunta_id: string;
  texto: string;
  correta: boolean;
}

export interface Pergunta {
  id: string;
  categoria_id: string;
  enunciado: string;
  feedback: string;
  pontos: number;
  categorias: Categoria;        // join
  alternativas: Alternativa[];  // join
}
