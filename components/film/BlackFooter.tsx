"use client";

import React, { useState } from 'react';
import { ArrowUp, Copy, Check, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundscape } from '@/lib/film/audioSynthesizer';

interface BlackFooterProps {
  onScrollToTop: () => void;
}

export const BlackFooter: React.FC<BlackFooterProps> = ({ onScrollToTop }) => {
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@immersive-garden.com');
    setCopied(true);
    soundscape.playHoverChime();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    soundscape.playHoverChime();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.9 },
      colors: ['#FFFFFF', '#888888', '#CCCCCC'],
    });
  };

  return (
    <footer
      id="final-black-footer"
      className="relative w-full text-[#151515] pt-24 pb-16 px-6 sm:px-14 md:px-24 z-20"
    >
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Call to action headline */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full relief-pill border border-black/10 text-[10px] uppercase tracking-[0.28em] font-semibold text-[#555555]">
            <Sparkles className="w-3 h-3 text-[#333333]" />
            <span>Initiate Collaboration</span>
          </div>

          <h2 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] tracking-tight max-w-4xl text-[#141414]">
            Let’s sculpt something <br />
            <span className="italic font-serif-luxury text-[#444444]">extraordinary</span> together.
          </h2>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              id="copy-studio-email-btn"
              href="mailto:hello@immersive-garden.com"
              className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full relief-card text-[#141414] text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-white transition-all border border-black/10 active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>hello@immersive-garden.com</span>
            </a>

            <a
              href="mailto:hello@immersive-garden.com"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full relief-pill border border-black/15 text-[11px] uppercase tracking-[0.22em] font-medium text-[#444444] hover:text-[#111111] transition-all"
            >
              <span>Direct Inquiries</span>
            </a>
          </div>
        </div>

        {/* Studio Locations & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-12 border-t border-black/10">
          {/* Paris HQ */}
          <div className="md:col-span-3 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#777777]">
              Paris Studio (HQ)
            </p>
            <p className="text-sm font-light text-[#222222] leading-relaxed">
              28 Rue du Faubourg Saint-Honoré<br />
              75008 Paris, France
            </p>
          </div>

          {/* Tokyo Office */}
          <div className="md:col-span-3 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#777777]">
              Tokyo Atelier
            </p>
            <p className="text-sm font-light text-[#222222] leading-relaxed">
              Minato-ku, Minami-Aoyama<br />
              Tokyo 107-0062, Japan
            </p>
          </div>

          {/* New York */}
          <div className="md:col-span-2 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#777777]">
              New York
            </p>
            <p className="text-sm font-light text-[#222222] leading-relaxed">
              SoHo, Manhattan<br />
              NY 10012, USA
            </p>
          </div>

          {/* Dispatch Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#777777]">
              Quarterly Journal
            </p>
            <p className="text-xs text-[#555555] font-light">
              Receive thoughtful essays on spatial WebGL, digital scenography, and studio releases.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-lg bg-black/5 text-xs text-[#222222] flex items-center gap-2 border border-black/10">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Thank you for subscribing to our journal.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 bg-black/[0.03] border border-black/15 rounded-lg px-3 py-2 text-xs text-[#141414] placeholder-[#888888] focus:outline-none focus:border-black/40"
                  required
                />
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#666666]">
          <div className="flex items-center gap-6">
            <span className="font-display-cinzel tracking-[0.24em] font-semibold text-[#141414]">
              IMMERSIVE GARDEN
            </span>
            <span className="text-[11px] uppercase tracking-[0.16em]">© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.16em]">
            <span className="hover:text-black transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-black transition-colors cursor-pointer">Instagram</span>
            <span className="hover:text-black transition-colors cursor-pointer">Archive</span>

            <span
              id="footer-back-to-top-btn"
              onClick={onScrollToTop}
              className="flex items-center gap-1.5 text-[#222222] hover:text-black transition-colors ml-4 uppercase tracking-[0.2em] font-semibold text-[10px] cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
