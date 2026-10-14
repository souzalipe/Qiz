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

// Resposta dada pelo jogador numa pergunta, guardada durante a partida.
// Tem exatamente os campos da tabela `respostas` (exceto partida_id, que só
// existe depois que a partida é gravada — Parte B da Fase 4).
export interface RespostaDada {
  pergunta_id: string;
  alternativa_id: string;
  correta: boolean;
}
