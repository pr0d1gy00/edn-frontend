import type { Metadata } from "next";
import { Archivo_Black, Plus_Jakarta_Sans, Syne } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "EDN",
  description: "El Desmadre Nacional — Podcast y comunidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${archivoBlack.variable} ${plusJakarta.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-plus-jakarta">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}