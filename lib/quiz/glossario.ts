// lib/quiz/glossario.ts
// Glossário de siglas e termos do quiz (feedbacks #6 e #7).
// Estável e pequeno — fica como constante; se quiser editar sem deploy,
// dá pra migrar para uma tabela no Supabase depois.

export type TermoGlossario = {
  termo: string;
  significado: string;
};

export const GLOSSARIO: TermoGlossario[] = [
  { termo: "EC", significado: "Economia Circular — modelo que mantém materiais em uso o máximo possível, evitando o descarte." },
  { termo: "PNRS", significado: "Política Nacional de Resíduos Sólidos — lei brasileira (Lei 12.305/2010) que organiza a gestão de resíduos." },
  { termo: "ODS", significado: "Objetivos de Desenvolvimento Sustentável — 17 metas globais da ONU (Agenda 2030)." },
  { termo: "ONU", significado: "Organização das Nações Unidas." },
  { termo: "CONAMA", significado: "Conselho Nacional do Meio Ambiente — define normas ambientais, como as cores da coleta seletiva." },
  { termo: "PET", significado: "Politereftalato de etileno — plástico comum em garrafas de bebida, reciclável." },
  { termo: "APL", significado: "Arranjo Produtivo Local — empresas e instituições de uma região que cooperam numa atividade econômica." },
  { termo: "Logística reversa", significado: "Retorno de produtos e embalagens usados ao fabricante para destino correto." },
  { termo: "Compostagem", significado: "Transformação de resíduos orgânicos (cascas, folhas) em adubo." },
  { termo: "Resíduo × Rejeito", significado: "Resíduo ainda pode ser reaproveitado; rejeito não tem mais aproveitamento e vai ao aterro." },
  { termo: "Obsolescência programada", significado: "Produtos feitos de propósito para durar pouco, forçando novas compras." },
  { termo: "Ecodesign", significado: "Projetar produtos pensando em durabilidade, reparo e reciclagem desde o início." },
  { termo: "Simbiose industrial", significado: "O resíduo de uma empresa vira matéria-prima (insumo) de outra." },
  { termo: "Remanufatura", significado: "Restaurar produtos usados até ficarem equivalentes a novos." },
  { termo: "Tripé da sustentabilidade", significado: "As três dimensões que se equilibram: ambiental, social e econômica." },
  { termo: "Pegada ecológica", significado: "Medida do impacto do nosso consumo sobre os recursos do planeta." },
];
