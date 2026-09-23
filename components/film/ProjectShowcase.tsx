"use client";

import React from 'react';
import { Project } from '@/lib/film/types';
import { Award, ArrowUpRight, Sparkles } from 'lucide-react';
import { soundscape } from '@/lib/film/audioSynthesizer';

interface ProjectShowcaseProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  projects,
  onSelectProject,
}) => {
  // We showcase the top 3 featured projects individually with spacious negative space
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <div id="selected-projects" className="relative w-full py-16">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto px-6 sm:px-14 md:px-20 mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-black/15">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] tracking-[0.3em] font-bold text-[#888888] uppercase">
                03 / Selected Works
              </span>
              <div className="w-8 h-px bg-black/20"></div>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-[#1A1A1A] font-light">
              Featured projects
            </h2>
          </div>
          <p className="text-[11px] uppercase tracking-[0.24em] font-medium text-[#777777]">
            03 Exemplary Collaborations
          </p>
        </div>
      </div>

      {/* Sequential Editorial Project Items */}
      <div className="space-y-40 sm:space-y-56">
        {featuredProjects.map((project, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={project.id}
              id={`project-showcase-${project.id}`}
              className="relative w-full min-h-[85vh] flex items-center px-6 sm:px-12 md:px-20 lg:px-24 pointer-events-none"
            >
              <div
                className={`w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Visual Media Card with Bas-Relief Frame */}
                <div
                  className={`pointer-events-auto group relative cursor-pointer lg:col-span-7 rounded-2xl overflow-hidden p-2 relief-card transition-all duration-700 hover:shadow-[16px_16px_40px_#b8b8b8,-16px_-16px_40px_#ffffff] ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                  onClick={() => {
                    soundscape.playHoverChime();
                    onSelectProject(project);
                  }}
                  onMouseEnter={() => soundscape.playHoverChime()}
                >
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/10 relative">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Subtle Overlay badge on hover */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="px-5 py-2.5 rounded-full bg-white/95 text-black text-xs font-semibold uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <span>Explore Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Year badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.25em]">
                      {project.year}
                    </div>
                  </div>
                </div>

                {/* Editorial Metadata & Narrative Description */}
                <div
                  className={`pointer-events-auto lg:col-span-5 space-y-6 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] uppercase tracking-[0.26em] font-bold text-[#1A1A1A]">
                      {project.client}
                    </span>
                    <span className="text-black/30">•</span>
                    <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#777777]">
                      {project.category}
                    </span>
                  </div>

                  <h3
                    className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] font-light leading-[1.1] hover:opacity-75 transition-opacity cursor-pointer"
                    onClick={() => onSelectProject(project)}
                  >
                    {project.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#4A4A4A] font-light leading-relaxed">
                    {project.description}
                  </p>

                  {/* Recognition & Key Awards */}
                  {project.awards && project.awards.length > 0 && (
                    <div className="pt-3 border-t border-black/15 space-y-2.5">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] font-bold text-[#777777]">
                        <Award className="w-3.5 h-3.5 text-[#222222]" />
                        <span>Honors & Recognition</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.awards.slice(0, 2).map((aw, i) => (
                          <span
                            key={i}
                            className="text-[10px] uppercase tracking-[0.16em] px-3 py-1 rounded-full relief-pill border border-black/10 text-[#333333]"
                          >
                            {aw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
