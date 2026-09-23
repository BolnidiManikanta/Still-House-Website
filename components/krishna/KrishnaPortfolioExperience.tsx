"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePageTransition } from "@/components/PageTransition";
import { Download, ArrowUpRight, ArrowLeft } from "lucide-react";

interface ProjectItem {
  number: string;
  title: string;
  place: string;
  copy: string;
  image: string;
}

const projects: ProjectItem[] = [
  {
    number: "01",
    title: "AFTERLIGHT",
    place: "Iceland · 2026",
    copy: "The held breath of a landscape before the sun arrives.",
    image: "/images/afterlight.png",
  },
  {
    number: "02",
    title: "BETWEEN PLACES",
    place: "North Sea · 2025",
    copy: "A study of distance, movement, and the places we pass through.",
    image: "/images/between-places.png",
  },
  {
    number: "03",
    title: "SILENT ROOMS",
    place: "Berlin · 2024",
    copy: "Architecture as a record of light moving through time.",
    image: "/images/silent-rooms.png",
  },
  {
    number: "04",
    title: "HUMAN FORM",
    place: "Paris · 2026",
    copy: "Portraits made in the space between what is seen and felt.",
    image: "/images/human-form.png",
  },
];

const gallery: [string, string][] = [
  ["/images/after-rain.png", "PARIS · 48.8566° N · 2026"],
  ["/images/city-night.png", "TOKYO · 35.6762° N · 2025"],
  ["/images/human-form.png", "PORTRAIT 04 · 35MM · 2026"],
  ["/images/silent-rooms.png", "BERLIN · 52.5200° N · 2024"],
];

function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

function WebGLBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.setProperty("--mx", `${(e.clientX / window.innerWidth - 0.5) * 18}px`);
      el.style.setProperty("--my", `${(e.clientY / window.innerHeight - 0.5) * 18}px`);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div ref={ref} className="sculpture" aria-hidden="true">
      <div className="sculpture-core" />
    </div>
  );
}

function Preloader() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((v) => {
        if (v >= 100) {
          clearInterval(timer);
          setTimeout(() => setDone(true), 400);
          return 100;
        }
        return Math.min(v + 5, 100);
      });
    }, 25);
    return () => clearInterval(timer);
  }, []);

  if (done) return null;

  return (
    <div className="preloader" id="krishna-preloader">
      <div>
        <span className="micro">KRISHNA</span>
        <span className="micro">PORTFOLIO / 2026</span>
      </div>
      <div className="loader-number">{String(count).padStart(3, "0")}</div>
      <span className="micro">IMMERSIVE PHOTOGRAPHY &amp; VISUAL STORIES</span>
    </div>
  );
}

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

export default function KrishnaPortfolioExperience() {
  const { triggerTransition } = usePageTransition();
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => {
      lenis.raf(time * 1000);
      requestAnimationFrame(raf);
    };
    const animId = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 14, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 84%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".parallax img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          { yPercent: 8, ease: "none", scrollTrigger: { trigger: img, scrub: true } }
        );
      });

      gsap.to(".horizontal-track", {
        xPercent: -42,
        ease: "none",
        scrollTrigger: {
          trigger: ".horizontal-section",
          pin: true,
          scrub: 1,
          end: "+=1800",
        },
      });

      gsap.to(document.documentElement, {
        "--darkness": 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".dark-threshold",
          start: "top 65%",
          end: "bottom 25%",
          scrub: true,
        },
      });
    });

    return () => {
      cancelAnimationFrame(animId);
      ctx.revert();
      lenis.destroy();
      document.documentElement.style.removeProperty("--darkness");
    };
  }, []);

  return (
    <>
      <Preloader />
      <WebGLBackdrop />
      <Grain />

      {/* Top Header */}
      <header className="site-header" id="krishna-site-header">
        <button
          id="krishna-back-home-btn"
          onClick={() => triggerTransition("/")}
          className="flex items-center space-x-2 text-inherit uppercase tracking-[0.2em] text-[10px] font-mono hover:opacity-75 transition-opacity"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>STILL / HOME</span>
        </button>

        <div className="flex items-center space-x-4">
          <a
            id="krishna-download-zip-top-btn"
            href="/portfolio"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur text-[10px] uppercase tracking-wider hover:bg-white/20 transition-all"
          >
            <span>PORTFOLIO</span>
          </a>
          <a href="#contact" className="hover:opacity-75 transition-opacity">
            INDEX ↗
          </a>
        </div>
      </header>

      <div className="progress-line" />

      <main>
        {/* HERO SECTION */}
        <section className="hero section-pad" id="krishna-hero">
          <div className="hero-meta micro">
            <span>PHOTOGRAPHY / VISUAL STORIES</span>
            <span>KRISHNA · 2026</span>
          </div>

          <div className="hero-title">
            <Reveal>
              <h1>
                KRISHNA<br />
                <em>PORTFOLIO</em>
              </h1>
            </Reveal>
            <Reveal>
              <div className="space-y-4">
                <p>
                  Selected images,<br />
                  places &amp; moments.
                </p>
                <div className="flex items-center space-x-2">
                  <a
                    id="krishna-download-zip-hero-btn"
                    href="/portfolio"
                    className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-black/20 bg-black/5 hover:bg-black/10 text-[10px] uppercase font-mono tracking-widest transition-all"
                  >
                    <span>VIEW EXHIBITION ARCHIVE</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="scroll-cue micro">
            SCROLL TO EXPLORE <span>↓</span>
          </div>
        </section>

        {/* INTRO STATEMENT */}
        <section className="intro section-pad" id="krishna-intro">
          <Reveal>
            <p className="statement">
              I photograph<br />
              <em>quiet moments</em><br />
              before they disappear.
            </p>
          </Reveal>
        </section>

        {/* FEATURED MAIN IMAGE */}
        <section
          id="krishna-feature"
          className="feature section-pad parallax"
          onClick={() => setSelected(0)}
        >
          <div className="image-wrap">
            <Image
              src="/images/afterlight.png"
              alt="Lone figure in an Icelandic landscape at dawn"
              fill
              priority
              sizes="90vw"
            />
          </div>
          <div className="caption micro">
            <span>AFTERLIGHT / 01</span>
            <span>ICELAND · 2026</span>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="categories section-pad" id="krishna-categories">
          <div className="micro label">THE ARCHIVE / CATEGORIES</div>
          <div className="category-list">
            {[
              "PORTRAITS",
              "ARCHITECTURE",
              "TRAVEL",
              "FASHION",
              "STREET",
              "DOCUMENTARY",
            ].map((item, i) => (
              <Reveal key={item}>
                <div className="category">
                  <span>0{i + 1}</span>
                  <h2>{item}</h2>
                  <span>↗</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SELECTED SERIES */}
        <section className="series section-pad" id="krishna-series">
          <div className="micro label">SELECTED SERIES</div>
          {projects.map((p, i) => (
            <article
              className={`project ${i % 2 ? "reverse" : ""}`}
              key={p.title}
              id={`krishna-project-${i + 1}`}
            >
              <div
                className="project-image parallax"
                onClick={() => setSelected(i)}
              >
                <div className="image-wrap">
                  <Image
                    src={p.image}
                    alt={`${p.title} photography series`}
                    fill
                    sizes="(max-width: 768px) 90vw, 58vw"
                  />
                </div>
              </div>
              <Reveal className="project-info">
                <span className="micro">{p.number} / SERIES</span>
                <h2>{p.title}</h2>
                <p>{p.copy}</p>
                <span className="micro">{p.place}</span>
              </Reveal>
            </article>
          ))}
        </section>

        {/* HORIZONTAL PINNED GALLERY */}
        <section className="horizontal-section" id="krishna-horizontal">
          <div className="horizontal-heading section-pad">
            <span className="micro">EXHIBITION 02</span>
            <h2>
              BETWEEN<br />
              <em>PLACES</em>
            </h2>
          </div>
          <div className="horizontal-track">
            {[
              "/images/between-places.png",
              "/images/afterlight.png",
              "/images/silent-rooms.png",
              "/images/after-rain.png",
            ].map((src, i) => (
              <div className="horizontal-image" key={src}>
                <Image
                  src={src}
                  alt={`Between Places photograph ${i + 1}`}
                  fill
                  sizes="60vw"
                />
              </div>
            ))}
          </div>
        </section>

        {/* DARK THRESHOLD PINNED PHOTO */}
        <section className="dark-threshold pinned section-pad" id="krishna-night">
          <div className="pinned-image parallax">
            <div className="image-wrap">
              <Image
                src="/images/city-night.png"
                alt="Rainy city street after midnight"
                fill
                sizes="80vw"
              />
            </div>
          </div>
          <div className="dark-copy">
            <span className="micro">CITY / NIGHT · 2025</span>
            <h2>
              THE CITY<br />
              <em>AFTER</em><br />
              MIDNIGHT.
            </h2>
          </div>
        </section>

        {/* NIGHT ARCHIVE GALLERY */}
        <section className="gallery section-pad" id="krishna-gallery">
          <div className="micro label">THE NIGHT ARCHIVE</div>
          <div className="gallery-grid">
            {gallery.map(([src, cap], i) => (
              <figure className={`gallery-item item-${i}`} key={src}>
                <div className="image-wrap" onClick={() => setSelected(i)}>
                  <Image
                    src={src}
                    alt={cap}
                    fill
                    sizes="(max-width: 768px) 90vw, 45vw"
                  />
                </div>
                <figcaption className="micro">{cap}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ARTIST PHILOSOPHY / ABOUT */}
        <section className="about section-pad" id="krishna-about">
          <Reveal>
            <h2>
              I LOOK FOR<br />
              THE MOMENT<br />
              <em>BETWEEN</em><br />
              WHAT IS SEEN<br />
              AND WHAT IS FELT.
            </h2>
          </Reveal>
          <div className="about-bottom">
            <div className="about-image parallax">
              <div className="image-wrap">
                <Image
                  src="/images/human-form.png"
                  alt="Black and white portrait"
                  fill
                  sizes="40vw"
                />
              </div>
            </div>
            <div className="about-copy">
              <p>
                Light, distance, and the small gestures that make a place feel
                inhabited. My work lives in the pause between observation and
                memory.
              </p>
              <span className="micro">
                BASED IN REYKJAVÍK<br />
                AVAILABLE WORLDWIDE
              </span>
            </div>
          </div>
        </section>

        {/* CONTACT & INQUIRIES */}
        <section id="contact" className="contact section-pad">
          <span className="micro">CONTACT / 06</span>
          <Reveal>
            <h2>
              LET&apos;S MAKE<br />
              <em>SOMETHING</em><br />
              WORTH<br />
              REMEMBERING.
            </h2>
          </Reveal>
          <a className="contact-link" href="mailto:krishna@stillstudio.com">
            START A CONVERSATION <span>↗</span>
          </a>
          <div className="contact-meta micro">
            <span>KRISHNA@STILLSTUDIO.COM</span>
            <span>INSTAGRAM / @KRISHNA_STILL</span>
            <span>REYKJAVÍK · IS</span>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer section-pad" id="krishna-footer">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <button
              id="krishna-next-series-btn"
              onClick={() => triggerTransition("/work")}
              className="text-left bg-transparent border-0 p-0 text-inherit cursor-pointer group"
            >
              <span className="micro">NEXT SERIES</span>
              <h2>
                EXPLORE<br />
                <em>THE ARCHIVE</em> ↗
              </h2>
            </button>

            <a
              id="krishna-download-zip-footer-btn"
              href="/portfolio"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full border border-white/30 text-white/90 hover:bg-white hover:text-black transition-all text-[11px] uppercase tracking-widest font-mono"
            >
              <span>VIEW COMPLETE ARCHIVE</span>
            </a>
          </div>

          <div className="micro footer-meta mt-10">
            <span>© 2026 KRISHNA · IMMERSIVE PHOTOGRAPHY PORTFOLIO</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </footer>
      </main>

      {/* FULLSCREEN LIGHTBOX VIEWER */}
      {selected !== null && (
        <div
          id="krishna-image-viewer"
          className="viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph viewer"
          onClick={() => setSelected(null)}
        >
          <button
            id="krishna-close-viewer-btn"
            aria-label="Close viewer"
            onClick={() => setSelected(null)}
          >
            CLOSE ×
          </button>
          <div className="viewer-image">
            <Image
              src={projects[selected % projects.length].image}
              alt="Selected photograph"
              fill
              sizes="90vw"
            />
          </div>
          <div className="viewer-caption micro">
            {projects[selected % projects.length].title} ·{" "}
            {projects[selected % projects.length].place}
          </div>
        </div>
      )}
    </>
  );
}
