"use client";

import { useEffect, useRef } from "react";

interface AmbientAudioProps {
  isPlaying: boolean;
}

export default function AmbientAudio({ isPlaying }: AmbientAudioProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (isPlaying) {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContext();

        const ctx = audioCtxRef.current;
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;

        // Ambient Drone 1 (Low Csine wave 65Hz)
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(65.41, ctx.currentTime);
        osc1.connect(gainNode);
        osc1.start();
        osc1Ref.current = osc1;

        // Ambient Drone 2 (Low G sine wave 98Hz for warm fifth harmonic)
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(97.99, ctx.currentTime);
        const osc2Gain = ctx.createGain();
        osc2Gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc2.connect(osc2Gain);
        osc2Gain.connect(gainNode);
        osc2.start();
        osc2Ref.current = osc2;
      }

      if (audioCtxRef.current && gainNodeRef.current) {
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        gainNodeRef.current.gain.linearRampToValueAtTime(
          0.12,
          audioCtxRef.current.currentTime + 2.0
        );
      }
    } else {
      if (audioCtxRef.current && gainNodeRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(
          0,
          audioCtxRef.current.currentTime + 1.5
        );
      }
    }
  }, [isPlaying]);

  return null;
}
