import type { Metadata } from "next";
import React from "react"; // Added to clear type errors explicitly
import "./globals.css";

export const metadata: Metadata = {
  title: "Energy Resilience AI Core",
  description: "National Sovereign Energy Security & Risk Simulation Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}