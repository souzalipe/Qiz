// lib/quiz/types.ts
// Tipos do quiz — espelham o que o app pode ler das tabelas do Supabase.
//
// Gabarito protegido: alternativas.correta e perguntas.feedback NÃO chegam
// ao navegador (o banco bloqueia essas colunas). A correção de cada resposta
// vem da função `responder` do banco — ver CorrecaoResposta.

export interface Categoria {
  id: string;
  nome: string;
}

export interface Alternativa {
  id: string;
  pergunta_id: string;
  texto: string;
  ordem: number; // 1 = A … 5 = E ("Não sei." sempre por último)
}

export interface Pergunta {
  id: string;
  categoria_id: string;
  enunciado: string;
  pontos: number;
  categorias: Categoria;        // join
  alternativas: Alternativa[];  // join, ordenadas por `ordem`
}

// Resultado da correção de uma resposta (função `responder` do banco).
export interface CorrecaoResposta {
  acertou: boolean;
  alternativa_correta_id: string;
  feedback: string | null;
  pontos: number;
}

// Resposta dada pelo jogador numa pergunta, guardada durante a partida.
// Tem exatamente os campos da tabela `respostas` (exceto partida_id, que só
// existe depois que a partida é gravada).
export interface RespostaDada {
  pergunta_id: string;
  alternativa_id: string;
  correta: boolean;
}
