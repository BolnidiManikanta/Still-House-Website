"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client runtime exception for debugging
    console.error("Runtime exception captured by route error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center bg-[#EBE7E1] text-[#110F0E]">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#7A756D] mb-4">
        Archive Retrieval Exception
      </span>
      <h1 className="font-serif text-4xl md:text-6xl font-light tracking-tight mb-6">
        Exhibition Interrupted
      </h1>
      <p className="max-w-md text-sm md:text-base text-[#5A554E] leading-relaxed mb-8 font-sans">
        A technical exception occurred while rendering this monograph scene. You can attempt to refresh the visual canvas or return home.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 border border-[#110F0E] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-[#110F0E] hover:text-[#EBE7E1]"
        >
          <span>Reload View</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-[#110F0E]/30 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#5A554E] transition-colors duration-300 hover:border-[#110F0E] hover:text-[#110F0E]"
        >
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
