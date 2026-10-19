// Regras de pontuação do quiz, centralizadas para ficarem fáceis de ajustar.

// Pontos por acerto. Erro e "Não sei" valem 0.
export const PONTOS_POR_ACERTO = 10;

// A partir desta fração de acertos (0 a 1), o resultado é considerado
// desempenho "alto" (frame 03); abaixo dela, "baixo" (frame 04).
export const LIMITE_BOM_DESEMPENHO = 0.6;
