import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PovertyWatch - Monitoring Kemiskinan Kota Medan",
  description: "Platform agregasi dan pemantauan isu kemiskinan media massa daring Kota Medan dan Sumatera Utara.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${sansFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans bg-background text-foreground selection:bg-[#D9541E]/20 selection:text-[#111111] dark:selection:text-[#F3EEE3]">
        {children}
      </body>
    </html>
  );
}
