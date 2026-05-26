"use client";

/**
 * Editorial hero slide. White paper on navy page so it reads like a
 * scanned broadsheet pull. Cobalt accents to match the new site palette.
 *
 * Deliberately no animation, no shimmer, no "AI generated" chrome — the
 * point of the homepage is to show the product, not perform it.
 */
export function MockSlide() {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden border border-white/10 shadow-[0_30px_80px_-20px_rgba(8,145,178,0.45)]">
      {/* Slide background — bright off-white so it pops against navy */}
      <div className="absolute inset-0" style={{ background: "#FAFAF7" }} />

      {/* Sparse corner-arc graphic in cobalt */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 1280 720"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path d="M 1280 0 A 700 700 0 0 0 580 0 Z" fill="#0E7490" fillOpacity="0.08" />
        <path d="M 0 720 A 500 500 0 0 0 500 720 Z" fill="#0E7490" fillOpacity="0.18" />
      </svg>

      {/* Accent rule */}
      <div
        className="absolute left-[6%] top-[12%] h-[3px] w-12"
        style={{ background: "#0E7490" }}
      />

      {/* Title block */}
      <div className="absolute left-[6%] right-[6%] top-[16%]">
        <div
          className="text-[10px] font-bold tracking-[0.32em]"
          style={{ color: "#0E7490" }}
        >
          Q1 INVESTOR UPDATE
        </div>
        <h3
          className="mt-3 text-[34px] font-semibold leading-[1.05]"
          style={{
            color: "#0F172A",
            fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
            letterSpacing: "-0.015em",
          }}
        >
          Where we are,
          <br />
          where we're going next.
        </h3>
        <p
          className="mt-3 text-[12px] leading-relaxed"
          style={{ color: "#475569" }}
        >
          A short read on the quarter that was — and the bet for the year ahead.
        </p>
      </div>

      {/* Two-column body */}
      <div
        className="absolute inset-x-[6%] bottom-[14%] grid grid-cols-[1.25fr_1fr] gap-7 text-[12px]"
        style={{ color: "#0F172A" }}
      >
        <ul className="space-y-2 leading-relaxed">
          {[
            "Revenue grew 38% quarter over quarter",
            "Net retention reached 124%",
            "Three enterprise customers signed in March",
          ].map((b) => (
            <li key={b} className="flex gap-2">
              <span style={{ color: "#0E7490" }}>—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* KPI tile */}
        <div
          className="border-l pl-4"
          style={{ borderColor: "rgba(15,23,42,0.12)" }}
        >
          <div
            className="text-[9px] font-bold uppercase tracking-[0.22em]"
            style={{ color: "#475569" }}
          >
            Annual Run Rate
          </div>
          <div
            className="mt-1 text-[36px] font-semibold leading-none"
            style={{ color: "#0E7490", letterSpacing: "-0.02em" }}
          >
            $4.2M
          </div>
          <div
            className="mt-2 text-[10px]"
            style={{ color: "#475569" }}
          >
            up 38% vs Q4
          </div>
        </div>
      </div>

      {/* Footer rule */}
      <div
        className="absolute inset-x-[6%] bottom-[7%] flex justify-between border-t pt-2 text-[9px] font-medium tracking-[0.18em]"
        style={{ borderColor: "rgba(15,23,42,0.08)", color: "rgba(71,85,105,0.85)" }}
      >
        <span>ACME — Q1 INVESTOR UPDATE</span>
        <span>03 / 09</span>
      </div>
    </div>
  );
}
