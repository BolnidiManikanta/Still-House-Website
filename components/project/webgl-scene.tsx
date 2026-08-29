"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { motion, lerp, clamp } from "@/lib/project/motion"
import { vertexShader, fragmentShader } from "@/lib/project/shaders"

// Environment tones
const LIGHT = new THREE.Color("#e8e8e8")
const DARK = new THREE.Color("#030303")

export default function WebglScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isMobile = window.matchMedia("(max-width: 768px)").matches
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    motion.reduced = reduced

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.35))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    scene.background = LIGHT.clone()
    scene.fog = new THREE.Fog(LIGHT.clone(), 4.5, 11)

    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 5.2)

    // ---- sculptural placeholder --------------------------------------------
    const detail = isMobile ? 24 : 80
    const geometry = new THREE.IcosahedronGeometry(1.35, detail)

    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.34 },
      uFreq: { value: 0.85 },
      uWarp: { value: 0.9 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDarkness: { value: 0 },
      uLightDir: { value: new THREE.Vector3(0.5, 0.8, 0.6) },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    })

    const mesh = new THREE.Mesh(geometry, material)
    const group = new THREE.Group()
    group.add(mesh)
    scene.add(group)

    // ---- render-free driven state ------------------------------------------
    const state = {
      mx: 0,
      my: 0,
      rotX: 0,
      rotY: 0,
      posX: 0,
      posY: 0,
      posZ: 0,
      scale: 1,
      amp: 0.34,
      freq: 0.85,
      dark: 0,
      hover: 0,
    }

    let raf = 0
    let running = true
    const clock = new THREE.Clock()

    const tmpColor = new THREE.Color()

    const render = () => {
      if (!running) return
      raf = requestAnimationFrame(render)
      const dt = Math.min(clock.getDelta(), 0.05)
      uniforms.uTime.value += dt * (reduced ? 0.3 : 1)

      const p = motion.progress
      const vel = motion.velocity

      // eased pointer influence
      state.mx = lerp(state.mx, motion.mouseX, 0.05)
      state.my = lerp(state.my, motion.mouseY, 0.05)
      uniforms.uMouse.value.set(state.mx, state.my)

      // hover swells the object slightly and quickens surface motion
      state.hover = lerp(state.hover, motion.hovering3d ? 1 : 0, 0.06)

      // --- scroll choreography across the page --------------------------------
      // Rotation: continuous but eased, biased by pointer + scroll velocity.
      const targetRotY = state.mx * 0.6 + p * Math.PI * 2.2
      const targetRotX = -state.my * 0.4 + Math.sin(p * Math.PI * 3.0) * 0.35
      state.rotY = lerp(state.rotY, targetRotY, 0.045)
      state.rotX = lerp(state.rotX, targetRotX, 0.045)
      group.rotation.y = state.rotY
      group.rotation.x = state.rotX
      group.rotation.z = lerp(group.rotation.z, state.mx * 0.15, 0.04)

      // Position: object drifts up, sideways and back through the sections.
      const tPosX = Math.sin(p * Math.PI * 2.0) * 1.1 + state.mx * 0.25
      const tPosY = Math.sin(p * Math.PI) * 0.4 - p * 0.3 - state.my * 0.2
      const tPosZ = -Math.sin(p * Math.PI) * 1.2 // moves toward background mid-page
      state.posX = lerp(state.posX, tPosX, 0.05)
      state.posY = lerp(state.posY, tPosY, 0.05)
      state.posZ = lerp(state.posZ, tPosZ, 0.05)
      group.position.set(state.posX, state.posY, state.posZ)

      // Scale: swells at start, contracts as it exits into the dark.
      const tScale =
        (0.72 + Math.sin(clamp(p * 1.4) * Math.PI) * 0.5) * (1 + state.hover * 0.06) *
        (1 - clamp((p - 0.82) / 0.18) * 0.45)
      state.scale = lerp(state.scale, tScale, 0.05)
      group.scale.setScalar(state.scale)

      // Morphing between sculptural "states": amplitude + frequency evolve.
      const tAmp = 0.24 + Math.sin(p * Math.PI * 2.5) * 0.14 + vel * 0.25 + state.hover * 0.08
      const tFreq = 0.7 + p * 1.1 + Math.sin(p * Math.PI * 4.0) * 0.25
      state.amp = lerp(state.amp, tAmp, 0.04)
      state.freq = lerp(state.freq, tFreq, 0.04)
      uniforms.uAmp.value = state.amp
      uniforms.uFreq.value = state.freq
      uniforms.uWarp.value = 0.8 + vel * 0.6

      // --- environment darkness -----------------------------------------------
      state.dark = lerp(state.dark, motion.darkness, 0.05)
      uniforms.uDarkness.value = state.dark
      tmpColor.copy(LIGHT).lerp(DARK, state.dark)
      scene.background = tmpColor
      ;(scene.fog as THREE.Fog).color.copy(tmpColor)

      // light direction subtly follows the pointer
      uniforms.uLightDir.value.set(0.5 + state.mx * 0.4, 0.8 - state.my * 0.3, 0.6).normalize()

      // scroll velocity nudges the camera for a touch of parallax
      camera.position.x = lerp(camera.position.x, state.mx * 0.3, 0.04)
      camera.position.y = lerp(camera.position.y, -state.my * 0.3, 0.04)
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    render()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onResize)

    const onVisibility = () => {
      running = document.visibilityState === "visible"
      if (running) {
        clock.getDelta()
        render()
      } else {
        cancelAnimationFrame(raf)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVisibility)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  )
}
