import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 1. Initialize the Sans-Serif interface font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // Binds to a CSS variable
  display: "swap",
});

// 2. Initialize the Tactical Monospace font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono", // Binds to a CSS variable
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maritime Geopolitical Risk Dashboard",
  description: "AI-Powered Threat Intelligence Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#F8FAFC] antialiased">
        {children}
      </body>
    </html>
  );
}