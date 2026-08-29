"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

interface DragItem {
  id: string;
  title: string;
  image: string;
  year: string;
  location: string;
}

const dragItems: DragItem[] = [
  {
    id: "01",
    title: "CONCRETE MONOLITH VOID",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
    year: "2026",
    location: "TOKYO",
  },
  {
    id: "02",
    title: "GLACIAL HORIZON MIST",
    image: "/images/hero.jpg",
    year: "2025",
    location: "REYKJAVIK",
  },
  {
    id: "03",
    title: "SILENT ANALOG PROFILE",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    year: "2025",
    location: "KYOTO",
  },
  {
    id: "04",
    title: "GEOMETRIC SHADOW STUDY",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    year: "2024",
    location: "ZURICH",
  },
  {
    id: "05",
    title: "SILK SILHOUETTE DRAPE",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
    year: "2024",
    location: "PARIS",
  },
];

export default function DraggableGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    if (!trackRef.current) return;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.8;
    gsap.to(trackRef.current, {
      scrollLeft: scrollLeft.current - walk,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <div className="w-full bg-[#F5F3EE] section-padding-museum border-t border-[#D8D4CB]/40">
      <div className="max-w-[1600px] mx-auto mb-16 flex justify-between items-end">
        <div>
          <span className="metadata-label block mb-3">HORIZONTAL EXPLORATION</span>
          <h3 className="heading-exact text-3xl md:text-5xl font-extralight tracking-[-0.07em] text-[#111111]">
            SPATIAL SEQUENCE
          </h3>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-[12px] uppercase tracking-[0.25em] text-[#777777]">
          <span>DRAG TO EXPLORE</span>
          <div className="w-8 h-[1px] bg-[#111111]/40" />
        </div>
      </div>

      {/* Horizontal Drag Track */}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full overflow-x-auto flex space-x-12 cursor-grab active:cursor-grabbing pb-8 selection:bg-transparent"
        data-cursor="DRAG"
      >
        {dragItems.map((item) => (
          <div
            key={item.id}
            className="flex-none w-[320px] sm:w-[450px] group"
          >
            <div className="clip-mask-container relative w-full aspect-[4/5] bg-[#EAE6DF] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="art-image-museum object-cover object-center pointer-events-none"
              />
            </div>
            <div className="mt-6 flex justify-between items-baseline border-b border-[#D8D4CB]/40 pb-4">
              <div>
                <span className="museum-label block mb-1">{item.id} — {item.location}</span>
                <h4 className="text-lg font-light text-[#111111] tracking-[-0.02em]">
                  {item.title}
                </h4>
              </div>
              <span className="text-[12px] tracking-[0.25em] uppercase text-[#111111]">
                {item.year}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
