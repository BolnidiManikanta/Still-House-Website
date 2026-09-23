"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#EBE7E1] text-[#110F0E] flex flex-col items-center justify-center p-6 text-center antialiased">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#7A756D] mb-4">
          Archive Exception
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-light tracking-tight mb-4">
          Visual Experience Interrupted
        </h1>
        <p className="max-w-md text-sm md:text-base text-[#5A554E] leading-relaxed mb-8">
          An unexpected interruption occurred. Please reload to restore the monograph view.
        </p>
        <button
          onClick={() => reset()}
          className="border border-[#110F0E] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-[#110F0E] hover:text-[#EBE7E1] cursor-pointer"
        >
          Restore View
        </button>
      </body>
    </html>
  );
}
