"use client";

import { useEffect, useRef } from "react";

export default function ThreeCanvasEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      gl.viewport(0, 0, width, height);
    };
    window.addEventListener("resize", handleResize);

    // GLSL Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // GLSL Fragment Shader for Editorial Film Grain, Soft Haze, Vignette & Subtle Chromatic Fringe
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      varying vec2 v_uv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution;

        // Animated Film Grain (0.05 opacity)
        float grain = (random(st + u_time * 0.04) - 0.5) * 0.05;

        // Soft Atmospheric Haze
        vec2 hazeCenter = vec2(0.5 + sin(u_time * 0.15) * 0.08, 0.5 + cos(u_time * 0.1) * 0.08);
        float haze = smoothstep(0.85, 0.0, distance(st, hazeCenter)) * 0.05;

        // Vignette
        float vignette = smoothstep(0.7, 0.25, distance(st, vec2(0.5))) * 0.06;

        // Subtle Optical Chromatic Fringe
        vec2 mouseNorm = u_mouse / u_resolution;
        float chromo = distance(st, mouseNorm) * 0.015;

        vec3 baseColor = vec3(0.96, 0.95, 0.93); // #F5F3EE warm studio paper
        vec3 finalColor = baseColor + vec3(grain) + vec3(haze) + vec3(vignette) + vec3(chromo, 0.0, -chromo);

        gl_FragColor = vec4(finalColor, grain * 0.5 + haze * 0.5 + vignette * 0.5);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let startTime = performance.now();

    const render = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const currentTime = (performance.now() - startTime) * 0.001;

      gl.viewport(0, 0, width, height);
      gl.uniform2f(resLoc, width, height);
      gl.uniform1f(timeLoc, currentTime);
      gl.uniform2f(mouseLoc, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60] opacity-80 mix-blend-soft-light"
    />
  );
}
