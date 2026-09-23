"use client";

import React, { useState } from 'react';
import { X, Send, Phone, CheckCircle, MessageSquare } from 'lucide-react';
import { CATEGORIES } from '../data/portfolioData';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'WEDDING',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: defaultCategory,
    eventDate: '',
    location: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setSubmitted(false);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Krishna Photography! I am interested in booking a session for ${formData.category || defaultCategory}. My name is ${formData.name || 'a prospective client'}.`
    );
    window.open(`https://wa.me/919030943166?text=${text}`, '_blank');
  };

  return (
    <div
      id="inquiry-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white text-stone-900 w-full max-w-lg p-6 sm:p-8 border border-stone-200 shadow-[0_25px_60px_rgba(0,0,0,0.18)] relative animate-fadeIn my-8">
        {/* Close Button */}
        <button
          id="btn-close-inquiry"
          onClick={() => {
            setSubmitted(false);
            onClose();
          }}
          aria-label="Close inquiry window"
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-black transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-serif italic text-stone-900 mb-2">Thank You, {formData.name || 'Friend'}.</h3>
            <p className="text-sm text-stone-600 font-light max-w-sm mx-auto mb-6">
              Your inquiry has been received by Krishna Photography Studio. Our team will connect with you within 24 hours.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleWhatsAppDirect}
                className="w-full py-3 bg-[#25D366] text-white text-[11px] tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Connect Instantly via WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full py-2.5 border border-stone-300 text-stone-700 text-[10px] tracking-[0.2em] uppercase hover:bg-stone-50 cursor-pointer"
              >
                Return to Exhibition
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[10px] tracking-[0.3em] font-semibold uppercase text-stone-500 block mb-1 font-mono">
                Booking Inquiries
              </span>
              <h3 id="inquiry-modal-title" className="text-2xl sm:text-3xl font-serif italic font-light text-stone-900">
                Reserve Your Story
              </h3>
              <p className="text-xs text-stone-600 font-light mt-1">
                Share details about your upcoming celebration or portrait session.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-stone-800 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-stone-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 90000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-stone-800 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-stone-800 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-xs tracking-wider uppercase focus:outline-none focus:border-stone-800 transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.key} value={cat.label} className="bg-white text-stone-900">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-stone-700 mb-1">
                    Event Date / Month
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. November 2026"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-stone-800 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-stone-700 mb-1">
                  Location / Venue
                </label>
                <input
                  type="text"
                  placeholder="City, Resort or Venue (e.g. Hyderabad, Vijayawada)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-stone-800 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase font-medium text-stone-700 mb-1">
                  Message / Vision
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about the ceremonies, scale, or personal photography vision..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-stone-800 transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-stone-900 text-white text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reservation Request</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="py-3 px-4 bg-[#25D366] text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
