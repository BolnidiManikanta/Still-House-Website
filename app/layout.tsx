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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  if (typeof window === 'undefined') return;
  var origStringify = JSON.stringify;
  function isBadObj(v) {
    if (!v || typeof v !== 'object') return false;
    if (typeof Node !== 'undefined' && v instanceof Node) return true;
    if (typeof Window !== 'undefined' && v instanceof Window) return true;
    if (v.nodeType || v.tagName || v.ownerDocument) return true;
    var c = v.constructor && v.constructor.name;
    if (c && (c.endsWith('Element') || c.endsWith('Node') || c === 'FiberNode' || c === 'Window' || c === 'Document')) return true;
    if (v.stateNode && (v.memoizedState || v.tag !== undefined)) return true;
    for (var k in v) {
      if (k && (k.indexOf('__reactFiber') === 0 || k.indexOf('__reactInternal') === 0)) return true;
    }
    return false;
  }
  JSON.stringify = function(value, replacer, space) {
    try {
      if (isBadObj(value)) return "{}";
      return origStringify(value, replacer, space);
    } catch (err) {
      if (err && String(err.message || "").indexOf("circular") !== -1) {
        try {
          var seen = new WeakSet();
          return origStringify(value, function(k, v) {
            if (isBadObj(v)) return undefined;
            if (typeof v === 'object' && v !== null) {
              if (seen.has(v)) return undefined;
              seen.add(v);
            }
            if (typeof replacer === 'function') return replacer(k, v);
            return v;
          }, space) || "{}";
        } catch(e) {
          return "{}";
        }
      }
      throw err;
    }
  };
})();
`,
          }}
        />
      </head>
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

