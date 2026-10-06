import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yıldız Works | Dijital altyapı. Akıllı sistemler.",
  description: "Dijital mimarimiz inşa ediliyor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-[#050505] text-neutral-200 antialiased selection:bg-neutral-800 selection:text-neutral-200">
        {children}
      </body>
    </html>
  );
}