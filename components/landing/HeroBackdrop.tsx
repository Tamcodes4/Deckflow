"use client";

/**
 * Editorial backdrop for the masthead-style landing page.
 *
 * No glowy orbs. Just three quiet things that read on a navy field:
 *   1. A faint hairline grid that fades to the edges.
 *   2. A pinpoint cyan glow in the upper-right where the mock slide sits.
 *   3. A subtle vertical hairline rule down the page so the layout
 *      reads like a printed broadsheet.
 */
export default function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Hairline grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(140,179,230,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(140,179,230,0.10) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 0%, black 35%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, black 0%, black 35%, transparent 80%)",
        }}
      />

      {/* Singular cyan pinpoint, no big blur */}
      <div
        className="absolute right-[-10%] top-[-5%] h-[55vh] w-[55vh] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      {/* Quiet bottom haze */}
      <div className="absolute inset-x-0 bottom-0 h-[28vh] bg-gradient-to-t from-[#030814] via-transparent to-transparent" />
    </div>
  );
}
