"use client";

/**
 * Hero mock slide. Dark theme variant — matches the page background and
 * keeps the homepage in a single visual register. Mirrors what the actual
 * app produces with a quiet corner-arc background and a KPI block.
 */
export function MockSlide() {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(124,92,255,0.45)]">
      {/* Slide background — near-black, matches site */}
      <div className="absolute inset-0" style={{ background: "#0B0B0F" }} />

      {/* Corner-arc graphic, baked in as inline SVG */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 1280 720"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path d="M 1280 0 A 700 700 0 0 0 580 0 Z" fill="#7C5CFF" fillOpacity="0.18" />
        <path d="M 0 720 A 500 500 0 0 0 500 720 Z" fill="#7C5CFF" fillOpacity="0.32" />
      </svg>

      {/* Accent bar */}
      <div className="absolute left-0 top-0 h-full w-[5px]" style={{ background: "#7C5CFF" }} />

      {/* Title block */}
      <div className="absolute left-[6%] right-[6%] top-[12%]">
        <div className="mb-2 h-1 w-10 rounded" style={{ background: "#7C5CFF" }} />
        <h3
          className="text-[28px] font-semibold leading-tight"
          style={{ color: "#FAFAFA", fontFamily: "ui-sans-serif, system-ui" }}
        >
          Q3 review
        </h3>
        <p className="mt-1 text-[12px]" style={{ color: "#A1A1AA" }}>
          Where we are, where we're going
        </p>
      </div>

      {/* Two-column body */}
      <div
        className="absolute inset-x-[6%] bottom-[16%] grid grid-cols-[1.2fr_1fr] gap-6 text-[12px]"
        style={{ color: "#FAFAFA" }}
      >
        <ul className="space-y-2">
          {[
            "Revenue grew 38% quarter over quarter",
            "Net retention reached 124%",
            "Three new enterprise customers",
          ].map((b) => (
            <li key={b} className="flex gap-2">
              <span style={{ color: "#7C5CFF" }}>•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* KPI tile (decoration-style) */}
        <div
          className="rounded-lg border p-3"
          style={{ borderColor: "rgba(124,92,255,0.3)", background: "rgba(124,92,255,0.08)" }}
        >
          <div className="text-[9px] uppercase tracking-wider" style={{ color: "#A1A1AA" }}>
            ARR
          </div>
          <div
            className="mt-1 text-[26px] font-bold leading-none"
            style={{ color: "#C4B5FD" }}
          >
            $4.2M
          </div>
          <div className="mt-1 text-[9px]" style={{ color: "#A1A1AA", opacity: 0.85 }}>
            +38% vs last quarter
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="absolute inset-x-[6%] bottom-[3%] flex justify-between text-[9px]"
        style={{ color: "rgba(161,161,170,0.7)" }}
      >
        <span>Acme · Q3 review</span>
        <span>3 / 9</span>
      </div>
    </div>
  );
}
