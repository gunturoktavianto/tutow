import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tutow - Belajar Matematika Seru untuk Anak",
  description:
    "Aplikasi edukasi interaktif untuk anak SD belajar matematika dengan cara yang menyenangkan",
  keywords: ["matematika", "edukasi", "anak", "SD", "belajar", "interaktif"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-blue-50 to-purple-50`}
      >
        <Navigation />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
