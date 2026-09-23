"use client";

import React, { useState } from 'react';
import { Project } from '@/lib/film/types';
import { X, Award, CheckCircle, ArrowRight, ExternalLink, Calendar, User, Layers } from 'lucide-react';
import { soundscape } from '@/lib/film/audioSynthesizer';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!project) return null;

  const allImages = [project.coverImage, ...project.detailImages];

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="project-modal-card"
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#E8E8E8] text-[#1A1A1A] rounded-3xl p-6 sm:p-10 shadow-[20px_20px_60px_#111111] border border-black/15 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <span
          id="close-project-modal-btn"
          onClick={() => {
            soundscape.playHoverChime();
            onClose();
          }}
          className="sticky top-0 float-right z-20 w-10 h-10 rounded-full relief-pill border border-black/15 hover:border-black/30 text-[#1A1A1A] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </span>

        {/* Modal Header */}
        <div className="space-y-4 max-w-3xl pr-12">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full relief-pill border border-black/10 text-[9px] uppercase tracking-[0.24em] font-bold text-[#1A1A1A]">
              {project.year}
            </span>
            <span className="text-[11px] uppercase tracking-[0.26em] font-bold text-[#222222]">
              {project.client}
            </span>
            <span className="text-black/30">•</span>
            <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#777777]">
              {project.category}
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-[#1A1A1A] font-light leading-tight">
            {project.title}
          </h2>

          <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed">
            {project.tagline}
          </p>
        </div>

        {/* Media Gallery Viewer */}
        <div className="mt-8 space-y-4">
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/10 p-2 relief-card relative">
            <img
              src={allImages[activeImageIdx]}
              alt={project.title}
              className="w-full h-full object-cover rounded-xl transition-opacity duration-500"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => {
                  soundscape.playHoverChime();
                  setActiveImageIdx(idx);
                }}
                className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 p-0.5 cursor-pointer ${
                  activeImageIdx === idx ? 'relief-convex border-black scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Narrative & Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-black/15">
          <div className="md:col-span-7 space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#888888]">
              Case Study Overview
            </h3>
            <p className="text-sm sm:text-base text-[#4A4A4A] font-light leading-relaxed">
              {project.description}
            </p>

            {/* Deliverables */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#777777]">
                Core Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#333333] px-3 py-1.5 rounded-lg relief-pill border border-black/5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#222222]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 space-y-6">
            {/* Stats */}
            {project.stats && (
              <div className="space-y-3 p-6 rounded-2xl relief-card border border-black/10">
                <h4 className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#777777]">
                  Key Performance Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {project.stats.map((st, i) => (
                    <div key={i}>
                      <div className="font-serif-luxury text-2xl text-[#1A1A1A] font-semibold">
                        {st.value}
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.18em] font-medium text-[#777777]">
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Awards */}
            {project.awards.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] font-bold text-[#777777]">
                  <Award className="w-3.5 h-3.5 text-[#222222]" />
                  <span>Accolades Received</span>
                </div>
                <div className="space-y-2">
                  {project.awards.map((aw, i) => (
                    <div
                      key={i}
                      className="text-xs py-2 px-3.5 rounded-xl relief-pill border border-black/10 text-[#222222] font-medium"
                    >
                      {aw}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
