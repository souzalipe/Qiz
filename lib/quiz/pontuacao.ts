// Regras de pontuação do quiz, centralizadas para ficarem fáceis de ajustar.

// Pontos por acerto. Erro e "Não sei" valem 0.
export const PONTOS_POR_ACERTO = 10;

// A partir desta fração de acertos (0 a 1), o resultado é considerado
// "bom desempenho" (frame 03); abaixo dela, "a melhorar" (frame 04).
export const LIMITE_BOM_DESEMPENHO = 0.7;

export function bomDesempenho(acertos: number, total: number) {
  return total > 0 && acertos / total >= LIMITE_BOM_DESEMPENHO;
}
