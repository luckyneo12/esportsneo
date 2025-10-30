import type { Metadata } from "next";
import { Orbitron, Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { LightRays } from "@/components/ui/light-rays";
import { Navbar } from "@/components/ui/resizable-navbar";
import {  NavbarMain } from "@/components/main_components/Navbar";

const headingFont = Orbitron({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"] as unknown as any,
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const numericFont = Rajdhani({
  subsets: ["latin"],
  variable: "--font-numeric",
  weight: ["500", "600", "700"] as unknown as any,
});

export const metadata: Metadata = {
  title: "Esports Neo",
  description: " Create by Our Team Esports Neo For support Esports  community and all games community support   build for india ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark ">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${numericFont.variable} antialiased bg-hero`}
      >
        <NavbarMain/>
        {children}
        {/* <LightRays/> */}
      </body>
    </html>
  );
}
