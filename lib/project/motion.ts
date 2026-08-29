// Shared, render-free motion state. A single mutable singleton read by the
// WebGL loop, the custom cursor and the fast-scroll dot field. Keeping this out
// of React state avoids re-renders on every pointer/scroll frame.

export type CursorState = "default" | "view" | "link" | "object"

export interface MotionState {
  // scroll
  scroll: number // absolute scroll position in px (eased by Lenis)
  progress: number // 0..1 over the whole page
  velocity: number // eased absolute scroll velocity, ~0..1
  scrollDir: number // -1 up, 1 down
  // pointer, normalized to -1..1 around viewport center
  mouseX: number
  mouseY: number
  // raw pointer in px
  pointerX: number
  pointerY: number
  mouseVelocity: number
  // environment darkness 0 (light #E8E8E8) .. 1 (dark #030303)
  darkness: number
  // per-section driver used to move/rotate the 3D object (0..N sections)
  focus: number
  // interaction flags
  hovering3d: boolean
  cursor: CursorState
  reduced: boolean
}

export const motion: MotionState = {
  scroll: 0,
  progress: 0,
  velocity: 0,
  scrollDir: 1,
  mouseX: 0,
  mouseY: 0,
  pointerX: 0,
  pointerY: 0,
  mouseVelocity: 0,
  darkness: 0,
  focus: 0,
  hovering3d: false,
  cursor: "default",
  reduced: false,
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}
