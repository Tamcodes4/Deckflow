"use client";

/**
 * Static atmospheric backdrop. No mouse-following effects, just a subtle
 * grid that fades to the corners and two soft top/bottom color washes so
 * the page doesn't feel flat.
 */
export default function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 0%, black 35%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, black 0%, black 35%, transparent 75%)",
        }}
      />
      {/* Color washes */}
      <div className="absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-violet-500/10 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-emerald-500/5 via-transparent to-transparent" />
    </div>
  );
}
