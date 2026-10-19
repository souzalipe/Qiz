"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Liga/desliga a classe .dark no <html> (attribute="class"). Os tokens do
// quiz (app/quiz-theme.css) e os do shadcn (app/globals.css) mudam de cor
// com essa classe.
//   defaultTheme="system": começa seguindo o tema do aparelho;
//   o botão de alternar grava a escolha da pessoa (localStorage).
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
