"use client";

export default function CameraSVG() {
  return (
    <svg
      width="1200"
      height="900"
      viewBox="0 0 1000 650"
      fill="none"
      stroke="#151515"
      strokeWidth="2.2"
      style={{ stroke: "#151515", strokeWidth: "2.2px", opacity: 0.28 }}
      className="w-[80vw] max-w-[1300px] h-auto block pointer-events-none transition-all duration-700"
    >
      {/* Leica Rangefinder Camera Outer Body Outline */}
      <rect x="70" y="140" width="860" height="460" rx="42" stroke="#151515" strokeWidth="2.5" />

      {/* Top Plate Bezel Line & Accents */}
      <path d="M 70 230 L 930 230" stroke="#151515" strokeWidth="2.2" />
      <rect x="130" y="75" width="220" height="65" rx="10" stroke="#151515" strokeWidth="2.2" />
      <rect x="670" y="85" width="130" height="55" rx="8" stroke="#151515" strokeWidth="2.2" />
      <circle cx="835" cy="112" r="24" stroke="#151515" strokeWidth="2.2" />
      <circle cx="835" cy="112" r="14" stroke="#151515" strokeWidth="1.8" />

      {/* Rangefinder Viewfinder Windows */}
      <rect x="190" y="165" width="110" height="52" rx="6" stroke="#151515" strokeWidth="2.2" />
      <rect x="205" y="175" width="80" height="32" rx="3" stroke="#151515" strokeWidth="1.8" />
      <rect x="740" y="165" width="50" height="45" rx="4" stroke="#151515" strokeWidth="2.2" />

      {/* Center Lens Barrel Assembly (Concentric Rings & Aperture Details) */}
      <circle cx="500" cy="370" r="210" stroke="#151515" strokeWidth="2.5" />
      <circle cx="500" cy="370" r="180" stroke="#151515" strokeWidth="1.8" strokeDasharray="6 4" />
      <circle cx="500" cy="370" r="145" stroke="#151515" strokeWidth="2.2" />
      <circle cx="500" cy="370" r="110" stroke="#151515" strokeWidth="1.8" />
      <circle cx="500" cy="370" r="75" stroke="#151515" strokeWidth="2.2" />
      <circle cx="500" cy="370" r="40" stroke="#151515" strokeWidth="1.8" />

      {/* Lens Optical Elements Reflections */}
      <path d="M 370 280 Q 500 230 630 280" stroke="#151515" strokeWidth="1.8" />
      <path d="M 390 460 Q 500 510 610 460" stroke="#151515" strokeWidth="1.8" />

      {/* Dial Knurling & Grip Lines */}
      <line x1="170" y1="75" x2="170" y2="140" stroke="#151515" strokeWidth="1.8" />
      <line x1="310" y1="75" x2="310" y2="140" stroke="#151515" strokeWidth="1.8" />
      <line x1="700" y1="85" x2="700" y2="140" stroke="#151515" strokeWidth="1.8" />
      <line x1="770" y1="85" x2="770" y2="140" stroke="#151515" strokeWidth="1.8" />
    </svg>
  );
}
