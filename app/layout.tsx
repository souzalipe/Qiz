import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";

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
  themeColor: "#16a34a",
};

// Layout raiz: envolve todas as páginas do app.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
