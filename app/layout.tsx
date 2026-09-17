import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Gustavo Calderon Tenorio | AI-Augmented Developer",
  description:
    "Portfolio of Gustavo Calderon Tenorio, an AI-Augmented Developer building real, functional web applications with React, Next.js, TypeScript, and AI tools. Based in Peru (UTC-5) — available for remote work and relocation.",
  keywords: [
    "AI-Augmented Developer",
    "Web Development",
    "Next.js",
    "TypeScript",
    "React",
    "Peru",
    "Remote Work",
    "Junior Developer",
    "Freelance",
  ],
  authors: [{ name: "Gustavo Calderon Tenorio" }],
  openGraph: {
    title: "Gustavo Calderon Tenorio | AI-Augmented Developer",
    description:
      "Functional web applications built with React, Next.js, TypeScript, and AI tools. Based in Peru (UTC-5) — available for remote work and relocation.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Gustavo Calderon Tenorio | AI-Augmented Developer",
    description:
      "Functional web applications built with React, Next.js, TypeScript, and AI tools. Based in Peru (UTC-5) — available for remote work and relocation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-zinc-100 font-mono">
        {children}
      </body>
    </html>
  );
}