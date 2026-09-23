import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center bg-[#EBE7E1] text-[#110F0E]">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#7A756D] mb-4">
        404 • Page Not Found
      </span>
      <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight mb-6">
        Frame Not Found
      </h1>
      <p className="max-w-md text-sm md:text-base text-[#5A554E] leading-relaxed mb-10 font-sans">
        The requested plate or monograph folio does not exist in this archive. Return to the curated collection.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 border border-[#110F0E] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-[#110F0E] hover:text-[#EBE7E1]"
      >
        <span>Return to Monograph</span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
