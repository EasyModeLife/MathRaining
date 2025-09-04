import "./globals.css";
import "katex/dist/katex.min.css";
import React from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { ThemeProvider } from "@components/ThemeProvider";

export const metadata = {
  title: "MathRaining",
  description: "Entrena matemáticas con práctica y juegos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-dvh bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <ThemeProvider>
          <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
            <Header />
            <main className="container mx-auto px-4 py-6">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
