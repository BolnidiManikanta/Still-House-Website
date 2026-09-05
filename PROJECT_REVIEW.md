# Still Studio — Unseen Dreamscapes Architecture & Code Review

## 1. Homepage Architecture
- **Root Layout (`app/layout.tsx`)**: Mounts global provider `<MotionProvider>`, WebGL texture overlay `<AtmosphereOverlay>`, navigation `<Navbar>`, and page routes.
- **Hero Section (`components/Hero.tsx`)**:
  - Monumental 14vw Neue Montreal typography (`DREAMSCAPES`).
  - 3-Layer Typography Depth Stack:
    - Foreground Title Layer (`100%` mouse movement = `±30px X / ±20px Y`).
    - Shadow Title Layer (`60%` depth offset = `±18px X / ±12px Y`, `opacity: 0.15`, `blur: 4px`).
    - Atmosphere Title Layer (`30%` depth offset = `±9px X / ±6px Y`, `opacity: 0.08`, `blur: 12px`).
  - Continuous Y-floating drift (`-15px ↔ +15px` over an 8-second infinite loop).
  - GSAP ScrollTrigger title scrub (`scale: 1.0 → 1.12`, `translateY: 0 → -150px`, `opacity: 1.0 → 0.75`).
  - Multi-Speed Parallax: Background `0.6x`, Atmosphere `0.8x`, Typography `1.1x`, Foreground `1.3x`.

## 2. Component Locations
- **Typography Component**: Integrated directly inside [`components/Hero.tsx`](file:///c:/Users/99220/OneDrive/Documents/Still-studio%20website/components/Hero.tsx), [`components/Introduction.tsx`](file:///c:/Users/99220/OneDrive/Documents/Still-studio%20website/components/Introduction.tsx), and [`components/Series.tsx`](file:///c:/Users/99220/OneDrive/Documents/Still-studio%20website/components/Series.tsx).
- **Cursor Component**: [`components/CustomCursor.tsx`](file:///c:/Users/99220/OneDrive/Documents/Still-studio%20website/components/CustomCursor.tsx) (`6px` inner dot, `28px → 56px` soft outer ring, `lerp: 0.08` velocity lag).
- **Scroll Engine**: Built inside [`components/MotionProvider.tsx`](file:///c:/Users/99220/OneDrive/Documents/Still-studio%20website/components/MotionProvider.tsx) and [`components/LenisProvider.tsx`](file:///c:/Users/99220/OneDrive/Documents/Still-studio%20website/components/LenisProvider.tsx).
- **WebGL Shader Engine**: [`components/canvas/ThreeCanvasEngine.tsx`](file:///c:/Users/99220/OneDrive/Documents/Still-studio%20website/components/canvas/ThreeCanvasEngine.tsx) (35mm animated film grain, volumetric fog haze, vignette, and chromatic fringe).
- **Atmosphere System**: [`components/AtmosphereOverlay.tsx`](file:///c:/Users/99220/OneDrive/Documents/Still-studio%20website/components/AtmosphereOverlay.tsx) & [`styles/globals.css`](file:///c:/Users/99220/OneDrive/Documents/Still-studio%20website/styles/globals.css).

## 3. Libraries & Motion Stack
- **GSAP (`gsap`, `gsap/ScrollTrigger`)**: Core timeline animation engine driving scroll scrub, line-mask typography reveals, image mask reveals, and section scene transitions.
- **Lenis (`@studio-freight/lenis` / `lenis`)**: Agency-grade momentum scrolling (`duration: 1.8s`, `lerp: 0.06`, `wheelMultiplier: 1.0`, 60 FPS rAF display sync).
- **Three.js (`three`, `@types/three`)**: WebGL fragment shader compiling real-time 35mm film grain, volumetric fog haze, vignette, and chromatic aberration.
- **Framer Motion (`framer-motion`)**: Lightweight micro-interactions and fallback motion states.

## 4. Known Limitations & Audit Summary
- **Current Limitations**: High-DPI screens rely on WebGL shader performance. WebGL context fallback renders pure CSS animated noise SVG fallback.
- **Fully Implemented Features**:
  - Lenis 60 FPS inertia momentum scrolling.
  - 3-Layer typography depth stack with mouse lerp tracking.
  - 35mm animated film grain & volumetric fog haze.
  - Unseen-style refined cursor with 28px -> 56px ring expansion.
  - Image choreography with 8s floating loops and 3D tilt perspective.
