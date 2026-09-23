"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { usePageTransition } from "@/components/PageTransition";
import {
  X,
  LayoutGrid,
  ArrowUpRight,
  Menu,
  CheckCircle2,
  Download,
  ArrowLeft,
} from "lucide-react";

interface Chapter {
  id: string;
  number: string;
  title: string;
  tag: string;
  subtitle: string;
  archImage: {
    src: string;
    alt: string;
    caption: string;
  };
  polaroidImage: {
    src: string;
    alt: string;
    caption: string;
  };
  wideImage: {
    src: string;
    alt: string;
    caption: string;
  };
  accentImage: {
    src: string;
    alt: string;
  };
  verticalImage: {
    src: string;
    alt: string;
    caption: string;
  };
}

const CHAPTERS: Chapter[] = [
  {
    id: "wedding",
    number: "01",
    title: "WEDDING",
    tag: "· Sacred",
    subtitle: "Sacred rituals, shared vows, and luminous banquet moments.",
    archImage: {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
      alt: "Elegant wedding banquet table with glassware and floral arrangement",
      caption: "Banquet & Grand Tablescape — Tuscany",
    },
    polaroidImage: {
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
      alt: "Bride and groom kissing under celebratory flower petal shower",
      caption: "The Confetti Shower — Villa Balbiano",
    },
    wideImage: {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
      alt: "Bride and groom by the seaside with gentle ocean breeze",
      caption: "Seaside Walk at Dusk — Amalfi Coast",
    },
    accentImage: {
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=85",
      alt: "Hands holding delicate white bridal floral bouquet",
    },
    verticalImage: {
      src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85",
      alt: "Tender close-up of hands and heirloom wedding ring",
      caption: "The Ring & Vows — Intimate Portrait",
    },
  },
  {
    id: "engagement",
    number: "02",
    title: "ENGAGEMENT",
    tag: "· Eternal",
    subtitle: "The promise of a lifetime against golden afternoon light.",
    archImage: {
      src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85",
      alt: "Diamond engagement ring and celebratory toast",
      caption: "The Promise — Paris Sunrise",
    },
    polaroidImage: {
      src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85",
      alt: "Couple embracing softly in warm sunlight",
      caption: "Golden Hour Embrace — Seine Riverbank",
    },
    wideImage: {
      src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=85",
      alt: "Couple walking through historic city alleyways",
      caption: "Montmartre Stroll — Evening Echoes",
    },
    accentImage: {
      src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=85",
      alt: "Wine glasses toast celebrating love",
    },
    verticalImage: {
      src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85",
      alt: "Emotional laughter during proposal moment",
      caption: "Joy Unfiltered — Jardin des Tuileries",
    },
  },
  {
    id: "pre-wedding",
    number: "03",
    title: "PRE WEDDING",
    tag: "· Romance",
    subtitle: "Cinematic destination landscapes and unguarded laughter.",
    archImage: {
      src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=85",
      alt: "Dramatic mountain landscape with couple in distance",
      caption: "Dolomites Serenade — Val di Funes",
    },
    polaroidImage: {
      src: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=85",
      alt: "Candid smiles and gentle touches",
      caption: "Candid Shadows — Verona Piazza",
    },
    wideImage: {
      src: "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=1200&q=85",
      alt: "Couple standing by a misty lake at twilight",
      caption: "Lake Braies — Blue Hour Reflection",
    },
    accentImage: {
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85",
      alt: "Joyful moment celebrating pre wedding",
    },
    verticalImage: {
      src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=85",
      alt: "Editorial portrait against timeless architecture",
      caption: "Editorial Elegance — Lake Como",
    },
  },
  {
    id: "portraits",
    number: "04",
    title: "PORTRAITS",
    tag: "· Soul",
    subtitle: "Fine art character studies in natural and sculpting light.",
    archImage: {
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
      alt: "Striking black and white expressive fine art portrait",
      caption: "The Gaze — Studio Monochrome",
    },
    polaroidImage: {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85",
      alt: "Warm ambient studio portrait",
      caption: "Quiet Contemplation — Milan",
    },
    wideImage: {
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
      alt: "Cinematic horizontal close-up with soft depth of field",
      caption: "Sculpted Shadow — 85mm Prime",
    },
    accentImage: {
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85",
      alt: "Editorial profile lighting",
    },
    verticalImage: {
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
      alt: "High fashion editorial portrait",
      caption: "Form & Soul — Paris Gallery",
    },
  },
  {
    id: "newborn-baby",
    number: "05",
    title: "NEWBORN BABY",
    tag: "· Pure",
    subtitle: "Whispered first days, tiny hands, and maternal tenderness.",
    archImage: {
      src: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=85",
      alt: "Newborn peacefully sleeping wrapped in soft knit muslin",
      caption: "First Breath — Organic Cotton Wrap",
    },
    polaroidImage: {
      src: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85",
      alt: "Baby fingers resting gently on mother's palm",
      caption: "Gentle Grasp — 7 Days Earthside",
    },
    wideImage: {
      src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=85",
      alt: "Parents admiring their sleeping newborn",
      caption: "The Sanctuary — Morning Nursery Light",
    },
    accentImage: {
      src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=85",
      alt: "Soft nursery blankets and baby shoes",
    },
    verticalImage: {
      src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85",
      alt: "Mother cradling baby against window light",
      caption: "Unconditional — In Home Session",
    },
  },
  {
    id: "maternity",
    number: "06",
    title: "MATERNITY",
    tag: "· Grace",
    subtitle: "The divine strength, silhouette, and radiance of motherhood.",
    archImage: {
      src: "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=85",
      alt: "Mother in flowing gown standing in golden wheat field",
      caption: "Golden Grace — Sunset Prairie",
    },
    polaroidImage: {
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85",
      alt: "Artistic monochrome silhouette celebrating life",
      caption: "Vessel of Life — Studio Silhouette",
    },
    wideImage: {
      src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
      alt: "Couple standing together embracing baby bump",
      caption: "Anticipation — Pacific Coast",
    },
    accentImage: {
      src: "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=85",
      alt: "Floral wreath and tender maternal touch",
    },
    verticalImage: {
      src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=85",
      alt: "Radiant outdoor portrait in morning mist",
      caption: "Motherhood Awakening — Olive Grove",
    },
  },
  {
    id: "pre-birthday",
    number: "07",
    title: "PRE BIRTHDAY",
    tag: "· Wonder",
    subtitle: "First milestones, laughter, and wide-eyed childhood wonder.",
    archImage: {
      src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=85",
      alt: "Toddler laughing beside festive pastel balloons and decor",
      caption: "First Birthday Joy — Garden Party",
    },
    polaroidImage: {
      src: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&q=85",
      alt: "Toddler candid smile in pure delight",
      caption: "Sparkling Eyes — Candid Milestone",
    },
    wideImage: {
      src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85",
      alt: "Balloons floating into clear blue sky",
      caption: "Colors of Wonder — Celebration Day",
    },
    accentImage: {
      src: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=85",
      alt: "Pastel cake and festive decorations",
    },
    verticalImage: {
      src: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=85",
      alt: "Child exploring a sunny meadow",
      caption: "Curiosity & Wonder — Sunny Park",
    },
  },
  {
    id: "saree-ceremony",
    number: "08",
    title: "SAREE CEREMONY",
    tag: "· Heritage",
    subtitle: "Ancient traditions, auspicious silk, temple gold, and blessing rituals.",
    archImage: {
      src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
      alt: "Handwoven Kanjivaram silk saree with traditional temple gold jewelry",
      caption: "Auspicious Silks — Temple Gold & Pearls",
    },
    polaroidImage: {
      src: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=1200&q=85",
      alt: "Haldi ceremony turmeric and jasmine flower blessings",
      caption: "Haldi & Floral Blessings — Family Rite",
    },
    wideImage: {
      src: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=1200&q=85",
      alt: "Intricate bridal henna and ceremonial bangles",
      caption: "Henna Intricacies & Red Kumkum",
    },
    accentImage: {
      src: "https://images.unsplash.com/photo-1596451190630-186aff535bf2?auto=format&fit=crop&w=800&q=85",
      alt: "Temple bells and jasmine floral garland",
    },
    verticalImage: {
      src: "https://images.unsplash.com/photo-1596451190630-186aff535bf2?auto=format&fit=crop&w=1200&q=85",
      alt: "Regal portrait celebrating half saree ceremony tradition",
      caption: "Rituals of Transition — Timeless Grace",
    },
  },
];

export default function KrishnaChaptersPage() {
  const { triggerTransition } = usePageTransition();
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [activeViewerImage, setActiveViewerImage] = useState<{
    src: string;
    alt: string;
    caption: string;
  } | null>(null);
  const [isInquireOpen, setIsInquireOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [inquirySubmitted, setInquirySubmitted] = useState<boolean>(false);

  const activeChapter = CHAPTERS[activeChapterIndex];

  const handleInquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setIsInquireOpen(false);
    }, 2400);
  };

  return (
    <div
      id="krishna-chapters-root"
      className="relative min-h-screen w-full bg-[#EAE6E0] text-[#141414] font-sans overflow-x-hidden selection:bg-[#141414] selection:text-[#EAE6E0]"
      style={{
        backgroundImage: `radial-gradient(#141414 0.65px, transparent 0.65px)`,
        backgroundSize: "28px 28px",
      }}
    >
      {/* CORNER REGISTRATION CROP MARKS (ARCHITECTURAL MONOGRAPH STYLE) */}
      <div className="pointer-events-none fixed top-4 left-4 z-30 w-6 h-6 border-t-2 border-l-2 border-[#141414]/30" />
      <div className="pointer-events-none fixed top-4 right-4 z-30 w-6 h-6 border-t-2 border-r-2 border-[#141414]/30" />
      <div className="pointer-events-none fixed bottom-4 left-4 z-30 w-6 h-6 border-b-2 border-l-2 border-[#141414]/30" />
      <div className="pointer-events-none fixed bottom-4 right-4 z-30 w-6 h-6 border-b-2 border-r-2 border-[#141414]/30" />

      {/* CROSSHAIRS ON CANVAS */}
      <span className="pointer-events-none fixed top-[45%] left-[28%] z-10 text-[14px] text-[#141414]/25 select-none font-mono font-light">
        +
      </span>
      <span className="pointer-events-none fixed top-[32%] right-[42%] z-10 text-[14px] text-[#141414]/25 select-none font-mono font-light">
        +
      </span>
      <span className="pointer-events-none fixed bottom-[22%] left-[36%] z-10 text-[14px] text-[#141414]/25 select-none font-mono font-light">
        +
      </span>

      {/* TOP HEADER BAR */}
      <header
        id="krishna-header"
        className="relative z-40 w-full px-6 md:px-12 pt-6 md:pt-8 pb-4 flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          <button
            id="krishna-back-to-still-btn"
            onClick={() => triggerTransition("/")}
            title="Return to Still Studio Home"
            className="flex items-center space-x-2 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.2em] text-[#141414]/70 hover:text-[#141414] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">STILL STUDIO /</span>
          </button>
          <h1 className="text-xs md:text-sm lg:text-[15px] font-serif uppercase tracking-[0.28em] font-medium text-[#111111]">
            KRISHNA PHOTOGRAPHY
          </h1>
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            id="krishna-inquire-btn"
            onClick={() => setIsInquireOpen(true)}
            className="border border-[#141414]/40 hover:border-[#141414] hover:bg-[#141414] hover:text-[#EAE6E0] px-4 md:px-6 py-2 rounded-sm text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-mono transition-all duration-300 flex items-center space-x-1.5 shadow-sm"
          >
            <span>INQUIRE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="krishna-menu-toggle-btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Toggle navigation menu"
            className="w-10 h-10 flex flex-col items-center justify-center space-y-1.5 hover:opacity-75 transition-opacity"
          >
            <span className="w-6 h-[1.5px] bg-[#141414]" />
            <span className="w-6 h-[1.5px] bg-[#141414]" />
          </button>
        </div>
      </header>

      {/* MAIN CHAPTERS COLLAGE CANVAS */}
      <main className="relative z-20 w-full min-h-[calc(100vh-140px)] flex flex-col lg:flex-row justify-between px-6 md:px-12 pt-4 pb-12">
        {/* LEFT COLUMN: CHAPTERS BADGE & CHAPTERS LIST */}
        <aside
          id="krishna-chapters-sidebar"
          className="w-full lg:w-[280px] shrink-0 flex flex-col justify-between mb-8 lg:mb-0 z-30"
        >
          <div>
            {/* BADGE: CHAPTERS / 08 */}
            <div
              id="krishna-chapters-badge"
              className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-sm bg-[#181818] text-[#EAE6E0] text-[10px] font-mono uppercase tracking-[0.22em] mb-6 shadow-md"
            >
              <LayoutGrid className="w-3 h-3 text-[#EAE6E0]/80" />
              <span>CHAPTERS / 08</span>
            </div>

            {/* 8 CHAPTERS NAV LIST */}
            <nav className="space-y-3.5 md:space-y-4">
              {CHAPTERS.map((chap, idx) => {
                const isActive = idx === activeChapterIndex;
                return (
                  <button
                    key={chap.id}
                    id={`chapter-item-${chap.id}`}
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`w-full text-left flex items-center space-x-2 text-[11px] md:text-xs tracking-[0.18em] uppercase transition-all duration-300 font-mono group py-0.5 ${
                      isActive
                        ? "text-[#0A0A0A] font-semibold translate-x-1"
                        : "text-[#141414]/55 hover:text-[#141414] font-normal"
                    }`}
                  >
                    <span
                      className={`text-[10px] tracking-wider transition-opacity ${
                        isActive ? "opacity-100 font-bold" : "opacity-40"
                      }`}
                    >
                      {chap.number} —
                    </span>
                    <span className="group-hover:tracking-[0.2em] transition-all">
                      {chap.title}
                    </span>
                    {isActive && (
                      <span className="text-[11px] font-serif italic lowercase tracking-normal text-[#141414]/75 ml-1 font-normal">
                        {chap.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* BOTTOM LEFT ARCHIVE METADATA */}
          <div className="pt-10 lg:pt-16 text-[10px] font-mono uppercase tracking-[0.22em] text-[#141414]/50 leading-relaxed">
            <p>VISUAL ARCHIVE</p>
            <p>FOR A LIFETIME</p>
          </div>
        </aside>

        {/* CENTER COLUMN: ARTISTIC MULTI-FRAME PHOTOGRAPHY COMPOSITION */}
        <div
          id="krishna-art-stage"
          className="relative flex-1 min-h-[580px] md:min-h-[640px] flex items-center justify-center my-6 lg:my-0 px-2 md:px-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[900px] h-[580px] md:h-[640px] flex items-center justify-center"
            >
              {/* 1. TOP-LEFT BACKGROUND ACCENT IMAGE (PEEKING BEHIND ARCH) */}
              <div
                onClick={() =>
                  setActiveViewerImage({
                    src: activeChapter.accentImage.src,
                    alt: activeChapter.accentImage.alt,
                    caption: `${activeChapter.title} · Ambient Detail`,
                  })
                }
                className="absolute -top-2 md:top-2 left-2 md:left-6 w-[180px] md:w-[240px] h-[120px] md:h-[150px] shadow-lg overflow-hidden border-[4px] border-white z-10 cursor-pointer group rotate-[-2deg] transition-transform duration-500 hover:rotate-0 hover:scale-105"
              >
                <Image
                  src={activeChapter.accentImage.src}
                  alt={activeChapter.accentImage.alt}
                  fill
                  sizes="(max-width: 768px) 180px, 240px"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* 2. THE SIGNATURE CENTER-LEFT ARCHED PHOTOGRAPH */}
              <div
                onClick={() =>
                  setActiveViewerImage({
                    src: activeChapter.archImage.src,
                    alt: activeChapter.archImage.alt,
                    caption: activeChapter.archImage.caption,
                  })
                }
                className="absolute top-8 md:top-4 left-6 md:left-20 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[340px] h-[360px] sm:h-[420px] md:h-[480px] rounded-t-[140px] sm:rounded-t-[160px] md:rounded-t-[180px] overflow-hidden border-[6px] md:border-[8px] border-white shadow-2xl z-20 cursor-pointer group bg-white transition-transform duration-500 hover:scale-[1.02]"
              >
                <div className="relative w-full h-full rounded-t-[132px] sm:rounded-t-[152px] md:rounded-t-[172px] overflow-hidden">
                  <Image
                    src={activeChapter.archImage.src}
                    alt={activeChapter.archImage.alt}
                    fill
                    priority
                    sizes="(max-width: 768px) 280px, 340px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* 3. CENTER FLOATING POLAROID / TILTED FRAME */}
              <div
                onClick={() =>
                  setActiveViewerImage({
                    src: activeChapter.polaroidImage.src,
                    alt: activeChapter.polaroidImage.alt,
                    caption: activeChapter.polaroidImage.caption,
                  })
                }
                className="absolute top-16 md:top-20 left-[48%] md:left-[50%] w-[190px] sm:w-[220px] md:w-[260px] p-2.5 md:p-3 bg-white shadow-2xl z-25 cursor-pointer group rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-500"
              >
                <div className="relative w-full h-[180px] sm:h-[210px] md:h-[240px] overflow-hidden">
                  <Image
                    src={activeChapter.polaroidImage.src}
                    alt={activeChapter.polaroidImage.alt}
                    fill
                    sizes="(max-width: 768px) 200px, 260px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="pt-2 text-center text-[9px] font-mono uppercase tracking-widest text-[#141414]/50">
                  {activeChapter.number} · {activeChapter.title}
                </div>
              </div>

              {/* 4. BOTTOM CENTER WIDE HORIZONTAL FRAME */}
              <div
                onClick={() =>
                  setActiveViewerImage({
                    src: activeChapter.wideImage.src,
                    alt: activeChapter.wideImage.alt,
                    caption: activeChapter.wideImage.caption,
                  })
                }
                className="absolute bottom-4 md:bottom-6 left-[38%] md:left-[42%] w-[220px] sm:w-[270px] md:w-[320px] h-[100px] sm:h-[120px] md:h-[135px] border-[5px] md:border-[6px] border-white shadow-xl z-30 cursor-pointer group bg-white rotate-[-1deg] hover:rotate-0 hover:scale-105 transition-all duration-500 overflow-hidden"
              >
                <Image
                  src={activeChapter.wideImage.src}
                  alt={activeChapter.wideImage.alt}
                  fill
                  sizes="(max-width: 768px) 240px, 320px"
                  className="object-cover group-hover:scale-108 transition-transform duration-700"
                />
              </div>

              {/* 5. RIGHT TALL VERTICAL GRAND PORTRAIT FRAME */}
              <div
                onClick={() =>
                  setActiveViewerImage({
                    src: activeChapter.verticalImage.src,
                    alt: activeChapter.verticalImage.alt,
                    caption: activeChapter.verticalImage.caption,
                  })
                }
                className="absolute top-2 md:top-4 right-2 md:right-4 w-[220px] sm:w-[260px] md:w-[310px] lg:w-[340px] h-[400px] sm:h-[460px] md:h-[530px] lg:h-[560px] border-[6px] md:border-[8px] border-white shadow-2xl z-20 cursor-pointer group bg-white transition-all duration-500 hover:scale-[1.02] overflow-hidden"
              >
                <Image
                  src={activeChapter.verticalImage.src}
                  alt={activeChapter.verticalImage.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 260px, 340px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: STORIES / PLACES CATEGORIES & ACTIVE CHAPTER COUNTER */}
        <aside
          id="krishna-meta-sidebar"
          className="w-full lg:w-[180px] shrink-0 flex flex-col justify-between items-end text-right z-30 pt-4"
        >
          {/* VERTICAL CATEGORY LABELS (Photographs, Stories, People, Places) */}
          <div className="space-y-4 text-[12px] md:text-[13px] font-serif tracking-[0.2em] text-[#141414]/65">
            <p className="hover:text-[#141414] transition-colors cursor-default">
              Photographs
            </p>
            <p className="hover:text-[#141414] transition-colors cursor-default">
              Stories
            </p>
            <p className="hover:text-[#141414] transition-colors cursor-default">
              People
            </p>
            <p className="hover:text-[#141414] transition-colors cursor-default">
              Places
            </p>
          </div>

          {/* BOTTOM RIGHT CHAPTER NUMBER COUNTER */}
          <div className="pt-10 lg:pt-16 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.24em] text-[#141414]/70">
            <span>CHAPTER </span>
            <span className="font-bold text-[#141414]">
              {activeChapter.number}
            </span>
            <span> / 08</span>
          </div>
        </aside>
      </main>

      {/* FULLSCREEN LIGHTBOX IMAGE VIEWER */}
      {activeViewerImage && (
        <div
          id="krishna-lightbox-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 select-none"
          onClick={() => setActiveViewerImage(null)}
        >
          <button
            id="krishna-close-lightbox-btn"
            onClick={() => setActiveViewerImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white flex items-center space-x-2 text-xs font-mono uppercase tracking-widest border border-white/20 px-3 py-1.5 rounded-full"
          >
            <span>CLOSE</span>
            <X className="w-4 h-4" />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[72vh] rounded-sm overflow-hidden">
              <Image
                src={activeViewerImage.src}
                alt={activeViewerImage.alt}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-white/80 font-mono text-xs uppercase tracking-widest mt-4 text-center">
              {activeViewerImage.caption}
            </p>
          </div>
        </div>
      )}

      {/* INQUIRY BOOKING MODAL */}
      <AnimatePresence>
        {isInquireOpen && (
          <div
            id="krishna-inquiry-modal"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsInquireOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-[#ECE8E1] text-[#141414] p-8 md:p-10 rounded-sm shadow-2xl border border-[#141414]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="krishna-close-inquire-modal-btn"
                onClick={() => setIsInquireOpen(false)}
                className="absolute top-6 right-6 text-[#141414]/60 hover:text-[#141414] p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#141414]/60">
                  RESERVATION &amp; INQUIRIES
                </span>
                <h3 className="text-2xl font-serif font-medium mt-1">
                  Start a Conversation
                </h3>
                <p className="text-xs text-[#141414]/70 font-sans mt-1">
                  Tell us about your chapter, celebration date, and visual vision.
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="py-10 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#141414] mx-auto" />
                  <h4 className="text-lg font-serif">Inquiry Received</h4>
                  <p className="text-xs text-[#141414]/70 font-mono">
                    Krishna will respond within 24 hours with package details and availability.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquireSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#141414]/70 mb-1">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Radhika & Vikram"
                      className="w-full bg-white/70 border border-[#141414]/20 px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] rounded-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-[#141414]/70 mb-1">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="name@domain.com"
                        className="w-full bg-white/70 border border-[#141414]/20 px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] rounded-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-[#141414]/70 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-white/70 border border-[#141414]/20 px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] rounded-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-[#141414]/70 mb-1">
                        Selected Chapter
                      </label>
                      <select
                        defaultValue={activeChapter.title}
                        className="w-full bg-white/70 border border-[#141414]/20 px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] rounded-none"
                      >
                        {CHAPTERS.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.number} — {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-[#141414]/70 mb-1">
                        Estimated Date
                      </label>
                      <input
                        type="date"
                        className="w-full bg-white/70 border border-[#141414]/20 px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] rounded-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#141414]/70 mb-1">
                      Event Location &amp; Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Venue, guest count, or specific visual requirements..."
                      className="w-full bg-white/70 border border-[#141414]/20 px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] rounded-none resize-none"
                    />
                  </div>

                  <button
                    id="krishna-submit-inquiry-btn"
                    type="submit"
                    className="w-full mt-2 bg-[#141414] text-[#EAE6E0] hover:bg-black py-3 text-xs font-mono uppercase tracking-[0.25em] transition-colors"
                  >
                    SEND INQUIRY ↗
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SLIDE-OUT DRAWER MENU (TRIGGERED BY TOP-RIGHT HAMBURGER) */}
      <AnimatePresence>
        {isMenuOpen && (
          <div
            id="krishna-drawer-backdrop"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-[#0A0A0A]/75 backdrop-blur-sm flex justify-end"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="w-full max-w-sm h-full bg-[#ECE8E0] text-[#141414] p-8 md:p-10 flex flex-col justify-between shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex justify-between items-center pb-8 border-b border-[#141414]/15">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#141414]/60">
                    KRISHNA ARCHIVE
                  </span>
                  <button
                    id="krishna-close-drawer-btn"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 hover:opacity-75"
                  >
                    <X className="w-5 h-5 text-[#141414]" />
                  </button>
                </div>

                <nav className="mt-8 space-y-5 font-serif text-xl">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      triggerTransition("/");
                    }}
                    className="block text-left hover:italic transition-all"
                  >
                    Home / Still Studio
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      triggerTransition("/work");
                    }}
                    className="block text-left hover:italic transition-all"
                  >
                    Work Archive
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      triggerTransition("/film");
                    }}
                    className="block text-left hover:italic transition-all"
                  >
                    Film Showcase
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      triggerTransition("/project/blueyard");
                    }}
                    className="block text-left hover:italic transition-all"
                  >
                    Project Feature
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      triggerTransition("/portfolio");
                    }}
                    className="block text-left hover:italic transition-all"
                  >
                    Monograph Portfolio
                  </button>
                </nav>

                <div className="mt-10 pt-6 border-t border-[#141414]/15">
                  <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#141414]/50 mb-3">
                    EXHIBITIONS
                  </span>
                  <a
                    id="krishna-download-zip-drawer-btn"
                    href="/portfolio"
                    className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#141414] hover:opacity-75"
                  >
                    <span>View Complete Portfolio ↗</span>
                  </a>
                </div>
              </div>

              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#141414]/50">
                <p>STUDIO@KRISHNA.COM</p>
                <p>© 2026 KRISHNA PHOTOGRAPHY</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
