"use client";

import React, { useState } from 'react';
import { Project } from '@/lib/film/types';
import { ArrowUpRight, Filter } from 'lucide-react';
import { soundscape } from '@/lib/film/audioSynthesizer';

interface ProjectDirectoryProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectDirectory: React.FC<ProjectDirectoryProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  const categories = ['All', 'Digital Scenography & WebGL', 'Spatial Audio & Interactive Sculpture', 'Immersive Editorial & 3D Archive', 'Real-time Kinetic Configurator', 'Virtual Museum & Spatial Exhibition', 'Digital Runway & Couture Experience'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="directory"
      className="relative w-full py-28 px-6 sm:px-14 md:px-20 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto pointer-events-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-6 border-b border-black/15">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] tracking-[0.3em] font-bold text-[#888888] uppercase">
                04 / Archives
              </span>
              <div className="w-8 h-px bg-black/20"></div>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-[#1A1A1A] font-light">
              Project directory
            </h2>
          </div>
          <p className="text-[11px] uppercase tracking-[0.24em] font-medium text-[#777777]">
            Curated Index 2023 — 2025
          </p>
        </div>

        {/* Table list of projects */}
        <div className="divide-y divide-black/10 border-y border-black/15">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              id={`dir-row-${proj.id}`}
              onMouseEnter={() => {
                setHoveredProject(proj);
                soundscape.playHoverChime();
              }}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => onSelectProject(proj)}
              className="group py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all duration-300 hover:px-4 hover:bg-black/[0.02]"
            >
              <div className="flex items-baseline gap-6 sm:gap-12">
                <span className="text-[11px] uppercase tracking-[0.22em] font-bold text-[#888888] font-mono w-10">
                  {proj.year}
                </span>
                <div>
                  <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1A1A1A] group-hover:italic transition-all">
                    {proj.title}
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#777777] mt-1">
                    {proj.client}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#666666] hidden md:inline">
                  {proj.category}
                </span>

                <div className="w-8 h-8 rounded-full relief-pill border border-black/15 flex items-center justify-center group-hover:border-black group-hover:bg-[#1A1A1A] group-hover:text-[#E8E8E8] transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
