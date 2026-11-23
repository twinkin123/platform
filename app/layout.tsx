import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopBar from "@/components/TopBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const metadata: Metadata = { title: "Sable" };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-dvh flex-col bg-black">
        <TopBar />
        <div className="min-h-0 flex-1">{children}</div>
      </body>
    </html>
  );
}