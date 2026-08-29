"use client";

import HomeHero from "@/components/HomeHero";

export default function Home() {
  return (
    <main className="relative w-full h-screen min-h-[100vh] bg-[#EBE7E1] text-[#110F0E] overflow-hidden select-none">
      {/* 35mm Film Grain Overlay */}
      <div className="grain texture-film-grain opacity-[0.03] pointer-events-none" />

      {/* SINGLE SCREEN CINEMATIC INTRO HOMEPAGE HERO */}
      <HomeHero />
    </main>
  );
}
