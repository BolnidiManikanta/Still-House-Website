"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/film/HeroSection";
import { StatementSection } from "@/components/film/StatementSection";
import { ApproachSection } from "@/components/film/ApproachSection";
import { ProjectShowcase } from "@/components/film/ProjectShowcase";
import { ProjectDirectory } from "@/components/film/ProjectDirectory";
import { MissionSection } from "@/components/film/MissionSection";
import { BlackFooter } from "@/components/film/BlackFooter";
import { ProjectModal } from "@/components/film/ProjectModal";
import HeroBackground from "@/components/film/HeroBackground";
import { PROJECTS_DATA } from "@/lib/film/projectsData";
import { Project } from "@/lib/film/types";
import { useMotion } from "@/components/MotionProvider";

export default function FilmPage() {
  const { lenis } = useMotion();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const scrollToTarget = (target: string | number) => {
    if (typeof target === "number") {
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.5 });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
      return;
    }

    const el = document.getElementById(target);
    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { offset: -40, duration: 1.5 });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY - 40;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#EDEAE4] text-[#141414] overflow-x-hidden selection:bg-black selection:text-white">
      {/* 0. Global Fixed Background System (Base, Ambient Autonomic Reveals, Cursor Reveal) */}
      <HeroBackground />

      {/* 1. DOM Editorial Sections Layer */}
      <main className="relative z-10 w-full flex flex-col">
        {/* Hero Viewport */}
        <HeroSection
          onSeeAllProjects={() => scrollToTarget("selected-projects")}
          onScrollDown={() => scrollToTarget("statement")}
        />

        {/* Statement Section */}
        <StatementSection />

        {/* Approach Section */}
        <ApproachSection />

        {/* Featured Project Showcase */}
        <ProjectShowcase
          projects={PROJECTS_DATA}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />

        {/* Full Project Directory */}
        <ProjectDirectory
          projects={PROJECTS_DATA}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />

        {/* Mission & Recognition */}
        <MissionSection />

        {/* The ONLY Black Section: Final Footer / End State Transition (#030303) */}
        <BlackFooter onScrollToTop={() => scrollToTarget(0)} />
      </main>

      {/* Case Study Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
