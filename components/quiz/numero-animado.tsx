"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

// Número que "conta" de 0 até o valor final (contagem animada da pontuação).
// Quem pediu "reduzir movimento" no sistema vê o valor final direto.
export function NumeroAnimado({ valor }: { valor: number }) {
  const reduzirMovimento = useReducedMotion();
  const [exibido, setExibido] = useState(reduzirMovimento ? valor : 0);

  useEffect(() => {
    if (reduzirMovimento) {
      setExibido(valor);
      return;
    }
    const controle = animate(0, valor, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setExibido(Math.round(v)),
    });
    return () => controle.stop();
  }, [valor, reduzirMovimento]);

  return <>{exibido}</>;
}
