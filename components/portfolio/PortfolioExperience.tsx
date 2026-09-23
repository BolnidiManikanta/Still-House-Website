'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

const projects = [
  { number: '01', title: 'AFTERLIGHT', place: 'Iceland · 2026', copy: 'The held breath of a landscape before the sun arrives.', image: '/images/afterlight.png' },
  { number: '02', title: 'BETWEEN PLACES', place: 'North Sea · 2025', copy: 'A study of distance, movement, and the places we pass through.', image: '/images/between-places.png' },
  { number: '03', title: 'SILENT ROOMS', place: 'Berlin · 2024', copy: 'Architecture as a record of light moving through time.', image: '/images/silent-rooms.png' },
  { number: '04', title: 'HUMAN FORM', place: 'Paris · 2026', copy: 'Portraits made in the space between what is seen and felt.', image: '/images/human-form.png' },
]
const gallery = [
  ['/images/after-rain.png', 'PARIS · 48.8566° N · 2026'], ['/images/city-night.png', 'TOKYO · 35.6762° N · 2025'],
  ['/images/human-form.png', 'PORTRAIT 04 · 35MM · 2026'], ['/images/silent-rooms.png', 'BERLIN · 52.5200° N · 2024'],
]

function Grain() { return <div className="grain" aria-hidden="true" /> }
function WebGLBackdrop() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e: MouseEvent) => { el.style.setProperty('--mx', `${(e.clientX / innerWidth - .5) * 18}px`); el.style.setProperty('--my', `${(e.clientY / innerHeight - .5) * 18}px`) }
    addEventListener('mousemove', move)
    return () => removeEventListener('mousemove', move)
  }, [])
  return <div ref={ref} className="sculpture" aria-hidden="true"><div className="sculpture-core" /></div>
}
function Header() { return <header className="site-header"><span>ELENA VOSS / STUDIO</span><a href="#contact">INDEX ↗</a></header> }
function Preloader() {
  const [done, setDone] = useState(false); const [count, setCount] = useState(0)
  useEffect(() => { const timer = setInterval(() => setCount(v => { if (v >= 100) { clearInterval(timer); setTimeout(() => setDone(true), 450); return 100 } return Math.min(v + 4, 100) }), 28); return () => clearInterval(timer) }, [])
  if (done) return null
  return <div className="preloader"><div><span className="micro">ELENA VOSS</span><span className="micro">PORTFOLIO / 2026</span></div><div className="loader-number">{String(count).padStart(3, '0')}</div><span className="micro">SELECTED IMAGES, PLACES & MOMENTS</span></div>
}
function Reveal({ children, className = '' }: { children: React.ReactNode, className?: string }) { return <div className={`reveal ${className}`}>{children}</div> }

export default function PortfolioExperience() {
  const [selected, setSelected] = useState<number | null>(null)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => { lenis.raf(time * 1000); requestAnimationFrame(raf) }; requestAnimationFrame(raf)
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.fromTo(el, { yPercent: 14, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 84%' } }))
      gsap.utils.toArray<HTMLElement>('.parallax img').forEach(img => gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img, scrub: true } }))
      gsap.to('.horizontal-track', { xPercent: -42, ease: 'none', scrollTrigger: { trigger: '.horizontal-section', pin: true, scrub: 1, end: '+=1800' } })
      gsap.to(document.documentElement, { '--darkness': 1, ease: 'none', scrollTrigger: { trigger: '.dark-threshold', start: 'top 65%', end: 'bottom 25%', scrub: true } })
    })
    return () => { ctx.revert(); lenis.destroy() }
  }, [])
  return <>
    <Preloader /><WebGLBackdrop /><Grain /><Header />
    <div className="progress-line" />
    <main>
      <section className="hero section-pad"><div className="hero-meta micro"><span>PHOTOGRAPHY / VISUAL STORIES</span><span>REYKJAVÍK · 2026</span></div><div className="hero-title"><Reveal><h1>ELENA<br /><em>VOSS</em></h1></Reveal><Reveal><p>Selected images,<br />places & moments.</p></Reveal></div><div className="scroll-cue micro">SCROLL TO EXPLORE <span>↓</span></div></section>
      <section className="intro section-pad"><Reveal><p className="statement">I photograph<br /><em>quiet moments</em><br />before they disappear.</p></Reveal></section>
      <section className="feature section-pad parallax" onClick={() => setSelected(0)}><div className="image-wrap"><Image src="/images/afterlight.png" alt="Lone figure in an Icelandic landscape at dawn" fill sizes="90vw" /></div><div className="caption micro"><span>AFTERLIGHT / 01</span><span>ICELAND · 2026</span></div></section>
      <section className="categories section-pad"><div className="micro label">THE ARCHIVE / CATEGORIES</div><div className="category-list">{['PORTRAITS','ARCHITECTURE','TRAVEL','FASHION','STREET','DOCUMENTARY'].map((item, i) => <Reveal key={item}><div className="category"><span>0{i + 1}</span><h2>{item}</h2><span>↗</span></div></Reveal>)}</div></section>
      <section className="series section-pad"><div className="micro label">SELECTED SERIES</div>{projects.map((p, i) => <article className={`project ${i % 2 ? 'reverse' : ''}`} key={p.title}><div className="project-image parallax" onClick={() => setSelected(i)}><div className="image-wrap"><Image src={p.image} alt={`${p.title} photography series`} fill sizes="(max-width: 768px) 90vw, 58vw" /></div></div><Reveal className="project-info"><span className="micro">{p.number} / SERIES</span><h2>{p.title}</h2><p>{p.copy}</p><span className="micro">{p.place}</span></Reveal></article>)}</section>
      <section className="horizontal-section"><div className="horizontal-heading section-pad"><span className="micro">EXHIBITION 02</span><h2>BETWEEN<br /><em>PLACES</em></h2></div><div className="horizontal-track">{['/images/between-places.png','/images/afterlight.png','/images/silent-rooms.png','/images/after-rain.png'].map((src, i) => <div className="horizontal-image" key={src}><Image src={src} alt={`Between Places photograph ${i + 1}`} fill sizes="60vw" /></div>)}</div></section>
      <section className="dark-threshold pinned section-pad"><div className="pinned-image parallax"><div className="image-wrap"><Image src="/images/city-night.png" alt="Rainy city street after midnight" fill sizes="80vw" /></div></div><div className="dark-copy"><span className="micro">CITY / NIGHT · 2025</span><h2>THE CITY<br /><em>AFTER</em><br />MIDNIGHT.</h2></div></section>
      <section className="gallery section-pad"><div className="micro label">THE NIGHT ARCHIVE</div><div className="gallery-grid">{gallery.map(([src, cap], i) => <figure className={`gallery-item item-${i}`} key={src}><div className="image-wrap" onClick={() => setSelected(i)}><Image src={src} alt={cap} fill sizes="(max-width: 768px) 90vw, 45vw" /></div><figcaption className="micro">{cap}</figcaption></figure>)}</div></section>
      <section className="about section-pad"><Reveal><h2>I LOOK FOR<br />THE MOMENT<br /><em>BETWEEN</em><br />WHAT IS SEEN<br />AND WHAT IS FELT.</h2></Reveal><div className="about-bottom"><div className="about-image parallax"><div className="image-wrap"><Image src="/images/human-form.png" alt="Black and white portrait by Elena Voss" fill sizes="40vw" /></div></div><div className="about-copy"><p>Light, distance, and the small gestures that make a place feel inhabited. My work lives in the pause between observation and memory.</p><span className="micro">BASED IN REYKJAVÍK<br />AVAILABLE WORLDWIDE</span></div></div></section>
      <section id="contact" className="contact section-pad"><span className="micro">CONTACT / 06</span><Reveal><h2>LET&apos;S MAKE<br /><em>SOMETHING</em><br />WORTH<br />REMEMBERING.</h2></Reveal><a className="contact-link" href="mailto:studio@elenavoss.com">START A CONVERSATION <span>↗</span></a><div className="contact-meta micro"><span>STUDIO@ELENAVOSS.COM</span><span>INSTAGRAM / @ELENAVOSS</span><span>REYKJAVÍK · IS</span></div></section>
      <footer className="footer section-pad"><div className="micro footer-meta"><span>© 2026 ELENA VOSS</span><span>ALL RIGHTS RESERVED</span></div></footer>
    </main>
    {selected !== null && <div className="viewer" role="dialog" aria-modal="true" aria-label="Photograph viewer" onClick={() => setSelected(null)}><span className="cursor-pointer" aria-label="Close viewer" onClick={() => setSelected(null)}>CLOSE ×</span><div className="viewer-image"><Image src={projects[selected % projects.length].image} alt="Selected photograph" fill sizes="90vw" /></div><div className="viewer-caption micro">{projects[selected % projects.length].title} · {projects[selected % projects.length].place}</div></div>}
  </>
}
