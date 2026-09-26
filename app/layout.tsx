import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import MotionProvider from "@/components/MotionProvider";
import Navbar from "@/components/Navbar";
import AtmosphereOverlay from "@/components/AtmosphereOverlay";
import FilmGrainLayer from "@/components/canvas/FilmGrainLayer";
import PageTransition from "@/components/PageTransition";
import { SiteConfigProvider } from "@/lib/admin/siteConfigStore";
import AdminFloatingBar from "@/components/admin/AdminFloatingBar";
import PublishedVisualOverrides from "@/components/admin/PublishedVisualOverrides";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Dreamscapes — Still Studio",
  description:
    "Fine art photography monograph and visual portfolio featuring Unseen Studio Dreamscapes aesthetic with Lenis smooth scrolling, GSAP choreography, and Three.js atmospheric effects.",
  openGraph: {
    title: "Dreamscapes — Still Studio",
    description:
      "Fine art photography monograph and visual portfolio featuring Unseen Studio Dreamscapes aesthetic with Lenis smooth scrolling, GSAP choreography, and Three.js atmospheric effects.",
  },
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
        <SiteConfigProvider>
          <PublishedVisualOverrides />
          <FilmGrainLayer />
          <MotionProvider>
            <PageTransition>
              <AtmosphereOverlay />
              <Navbar />
              <main className="relative w-full overflow-x-clip">
                {children}
              </main>
              <AdminFloatingBar />
            </PageTransition>
          </MotionProvider>
        </SiteConfigProvider>
      </body>
    </html>
  );
}

