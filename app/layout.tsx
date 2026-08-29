import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import MotionProvider from "@/components/MotionProvider";
import Navbar from "@/components/Navbar";
import AtmosphereOverlay from "@/components/AtmosphereOverlay";
import CinematicLoader from "@/components/CinematicLoader";
import FilmGrainLayer from "@/components/canvas/FilmGrainLayer";
import PageTransition from "@/components/PageTransition";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Dreamscapes — Unseen Studio Visual Monograph | Fine Art Photography",
  description:
    "An exact visual, motion, and interaction recreation of Dreamscapes by Unseen Studio. Featuring medium-format photographic monograph content, atmospheric fog, and gallery presentation.",
  keywords: [
    "Dreamscapes",
    "Unseen Studio",
    "Photography Monograph",
    "Fine Art Photography",
    "Neue Montreal",
    "Lenis Smooth Scroll",
    "GSAP ScrollTrigger",
  ],
  authors: [{ name: "Still Studio" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis">
      <body className="bg-[#EBE7E1] text-[#110F0E] antialiased selection:bg-[#110F0E] selection:text-[#EBE7E1]">
        <CinematicLoader />
        <FilmGrainLayer />
        <MotionProvider>
          <PageTransition>
            <AtmosphereOverlay />
            <Navbar />
            <main className="relative w-full overflow-x-hidden">
              {children}
            </main>
          </PageTransition>
        </MotionProvider>
      </body>
    </html>
  );
}
