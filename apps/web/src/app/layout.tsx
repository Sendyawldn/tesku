import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TesKu - Platform Psikotes Modern",
  description: "Platform simulasi psikotes terpercaya dengan laporan analisis mendalam.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} min-h-screen gradient-bg text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
