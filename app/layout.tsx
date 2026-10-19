import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";
import "./quiz-theme.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

// Metadados exibidos na aba do navegador e ao compartilhar o link.
export const metadata: Metadata = {
  title: "Quiz Circular",
  description:
    "Quiz sobre economia circular para estudantes de pós-graduação.",
};

// Configuração de viewport para o site se comportar como app no celular
// (largura do dispositivo, cor da barra do navegador em verde).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Cor da barra do navegador no celular, acompanhando o tema.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1411" },
  ],
};

// Layout raiz: envolve todas as páginas do app.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: o next-themes coloca a classe .dark no <html>
    // antes do React carregar, o que é esperado (evita "piscar" o tema claro).
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        // Fundo e texto da página acompanham o tema (tokens do quiz).
        className={`${GeistSans.variable} ${GeistMono.variable} bg-[var(--quiz-bg)] font-sans text-[var(--quiz-text)] antialiased`}
      >
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
