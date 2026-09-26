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
  title: "Gustav Calderon Tenorio | AI-Powered Full-Stack Developer",
  description:
    "Portfolio of Gustav Calderon Tenorio, an AI-Powered Full-Stack Developer who builds and integrates applications, internal tools, and automations — including AI-powered functionality — with React, Next.js, and TypeScript. Based in Peru (UTC-5) — available for remote work and relocation.",
  keywords: [
    "AI-Powered Full-Stack Developer",
    "Web Development",
    "Full-Stack Development",
    "Next.js",
    "TypeScript",
    "React",
    "Peru",
    "Remote Work",
    "Junior Developer",
    "Freelance",
  ],
  authors: [{ name: "Gustav Calderon Tenorio" }],
  openGraph: {
    title: "Gustav Calderon Tenorio | AI-Powered Full-Stack Developer",
    description:
      "Full-stack applications, internal tools, and automations — built with React, Next.js, TypeScript, and AI-powered functionality. Based in Peru (UTC-5) — available for remote work and relocation.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Gustav Calderon Tenorio | AI-Powered Full-Stack Developer",
    description:
      "Full-stack applications, internal tools, and automations — built with React, Next.js, TypeScript, and AI-powered functionality. Based in Peru (UTC-5) — available for remote work and relocation.",
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