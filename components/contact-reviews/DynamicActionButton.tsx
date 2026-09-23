"use client";

import React, { useState } from 'react';
import {
  Send,
  MessageCircle,
  Copy,
  Check,
  X,
  ArrowUpRight,
} from 'lucide-react';

interface DynamicActionButtonProps {
  onOpenRatingModal: () => void;
  selectedCategoryName: string;
  estimatedCostInr?: number;
}

export const DynamicActionButton: React.FC<DynamicActionButtonProps> = ({
  onOpenRatingModal,
  selectedCategoryName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyQuote = () => {
    const text = `Apex Light Photography Studio — Commission Inquiry\nPackage: ${selectedCategoryName}\nMedium: 100MP Hasselblad Medium Format Capture\nInquiries: hello@apexlightphoto.com | +91 98230 45678`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Apex Light Photography Studio! I would like to inquire about booking a ${selectedCategoryName} commission. Could we discuss dates and custom proposal?`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      {/* Expanded Quick Actions Panel */}
      {isOpen && (
        <div className="mb-3 w-80 bg-[#FFFFFF] border border-[#D7D7D2] p-6 shadow-sm text-[#111111] animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#D7D7D2]">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8A8A86]">
              STUDIO ATELIER DESK
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#8A8A86] hover:text-[#111111] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 border-b border-[#D7D7D2] text-xs space-y-1 font-mono">
            <div className="flex justify-between text-[#666666]">
              <span className="uppercase text-[10px]">Selected Focus:</span>
              <span className="text-[#111111] font-medium">{selectedCategoryName}</span>
            </div>
            <div className="flex justify-between text-[#666666]">
              <span className="uppercase text-[10px]">Studio Quote:</span>
              <span className="text-[#111111] font-medium">
                Custom Tailored
              </span>
            </div>
          </div>

          <div className="pt-4 space-y-2 text-xs">
            <button
              id="dynamic-hub-rate-btn"
              onClick={() => {
                setIsOpen(false);
                onOpenRatingModal();
              }}
              className="w-full py-2.5 px-3 bg-[#111111] text-[#F6F6F4] hover:bg-[#222222] uppercase tracking-[0.18em] text-[11px] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Rate Photography</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              id="dynamic-hub-book-btn"
              onClick={() => scrollTo('contact-form-section')}
              className="w-full py-2.5 px-3 border border-[#D7D7D2] text-[#111111] hover:border-[#111111] uppercase tracking-[0.16em] text-[11px] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Jump to Inquiry Brief</span>
              <Send className="w-3 h-3 text-[#666666]" />
            </button>

            <button
              id="dynamic-hub-whatsapp-btn"
              onClick={handleWhatsApp}
              className="w-full py-2 px-3 border border-[#D7D7D2] text-[#666666] hover:text-[#111111] hover:border-[#111111] uppercase tracking-[0.14em] text-[10px] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Direct WhatsApp Desk</span>
              <MessageCircle className="w-3 h-3" />
            </button>

            <button
              id="dynamic-hub-copy-btn"
              onClick={handleCopyQuote}
              className="w-full py-2 px-3 text-[#8A8A86] hover:text-[#111111] uppercase tracking-[0.14em] text-[10px] flex items-center justify-between transition-colors cursor-pointer font-mono"
            >
              <span>{copied ? 'Copied Brief' : 'Copy Inquiry Brief'}</span>
              {copied ? <Check className="w-3 h-3 text-[#111111]" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Dynamic Trigger */}
      <button
        id="dynamic-floating-action-button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 px-5 py-3.5 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-[#F6F6F4] border border-[#111111] transition-all duration-300 cursor-pointer shadow-xs"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#111111] group-hover:bg-[#F6F6F4] transition-colors" />
        <span className="text-xs uppercase tracking-[0.2em] font-medium font-mono">
          {isOpen ? 'CLOSE' : 'STUDIO DESK'}
        </span>
        <span className="text-xs font-mono text-[#8A8A86] group-hover:text-[#F6F6F4]">
          •
        </span>
      </button>
    </div>
  );
};
