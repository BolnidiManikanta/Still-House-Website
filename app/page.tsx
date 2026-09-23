"use client";

import Scene01Hero from "@/components/home/scenes/Scene01Hero";
import Scene02Curatorial from "@/components/home/scenes/Scene02Curatorial";
import Scene03FeaturedMonograph from "@/components/home/scenes/Scene03FeaturedMonograph";
import Scene04PhotographicSuites from "@/components/home/scenes/Scene04PhotographicSuites";
import Scene05HorizontalSequence from "@/components/home/scenes/Scene05HorizontalSequence";
import Scene06ArchivedWorks from "@/components/home/scenes/Scene06ArchivedWorks";
import Scene07NextMonograph from "@/components/home/scenes/Scene07NextMonograph";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-[#EBE7E1] text-[#110F0E] select-none">
      {/* 35mm Film Grain Atmosphere */}
      <div className="grain texture-film-grain opacity-[0.03] pointer-events-none" />

      {/* SCENE 01: HERO PINNED MULTI-PHASE TRANSFORMATION */}
      <Scene01Hero />

      {/* SCENE 02: CURATORIAL OVERVIEW (OPPOSING TYPOGRAPHY & ASYMMETRIC PHOTOGRAPHIC PLATE) */}
      <Scene02Curatorial />

      {/* SCENE 03: FEATURED MONOGRAPH (CONTINUOUS IMAGE-TO-IMAGE MORPH & EXPANSION) */}
      <Scene03FeaturedMonograph />

      {/* SCENE 04: PHOTOGRAPHIC SUITES & TECHNICAL EXHIBITION CATALOGUE */}
      <Scene04PhotographicSuites />

      {/* SCENE 05: HORIZONTAL SEQUENCE (VERTICAL SCROLL SCRUBBING HORIZONTAL TRAVEL) */}
      <Scene05HorizontalSequence />

      {/* SCENE 06: ARCHIVED WORKS (INTERACTIVE LIVING MATRIX WITH DOMINANT SPOTLIGHTS) */}
      <Scene06ArchivedWorks />

      {/* SCENE 07: CONTINUING MONOGRAPH BLUEYARD (EXPANDING APERTURE CLOSING FINALE) */}
      <Scene07NextMonograph />

      {/* STUDIO FOOTER */}
      <Footer />
    </div>
  );
}

