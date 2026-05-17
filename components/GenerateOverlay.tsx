"use client";
import { useEffect, useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";

/**
 * Full-screen "deck is being prepared" overlay shown while we wait for the
 * generation API to come back. Stays on screen for at least 10s so a fast
 * generation still feels deliberate; longer generations keep animating
 * until the parent unmounts the overlay.
 *
 * Design language:
 *   - dark-mode glassy surface with subtle animated grain
 *   - rotating one-liner status text under the headline
 *   - 5 slide cards that "build in" one at a time and keep filling rows
 *     of text bars to mimic content streaming in
 *   - gradient sparkle accents and a tiny progress bar that loops cleanly
 */

const ROTATING_LINES = [
  "Reading your brief…",
  "Choosing layouts that match the topic…",
  "Drafting headlines and bullets…",
  "Picking the right colors…",
  "Composing speaker notes…",
  "Adding tables, quotes, and section dividers…",
  "Final passes on typography…",
  "Almost there — polishing pixels…",
];

export default function GenerateOverlay({ open }: { open: boolean }) {
  const [tick, setTick] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);

  // Lock body scroll while the overlay is mounted.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Animation tick (~30 fps) that drives the slide-card row fills.
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      if (now - last > 33) {
        setTick((t) => t + 1);
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // Rotate the status line every ~1.6s.
  useEffect(() => {
    if (!open) { setLineIdx(0); return; }
    const id = window.setInterval(() => {
      setLineIdx((i) => (i + 1) % ROTATING_LINES.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Generating your deck"
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(60% 50% at 50% 30%, rgba(124,92,255,0.32), transparent 70%), radial-gradient(40% 35% at 80% 80%, rgba(34,211,238,0.16), transparent 70%), #06060a",
      }}
    >
      <Grain />
      <Orbs />
      <Sparkles2 />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center text-white">
        {/* Brand pill */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
          <Sparkles size={11} className="text-violet-300" />
          EZdeck · cooking up your deck
        </div>

        {/* Gradient sweep title */}
        <h2
          className="mb-3 text-3xl font-semibold tracking-tight md:text-[40px]"
          style={{
            background:
              "linear-gradient(110deg, #fff 0%, #fff 30%, rgba(196,181,253,0.95) 50%, #fff 70%, #fff 100%)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            animation: "ezg-sweep 3.4s linear infinite",
          }}
        >
          Building your deck
        </h2>

        {/* Rotating one-liner */}
        <div className="relative h-5 overflow-hidden text-sm text-white/60">
          {ROTATING_LINES.map((ln, i) => (
            <span
              key={i}
              className="absolute inset-0 transition-all duration-500 ease-out"
              style={{
                opacity: i === lineIdx ? 1 : 0,
                transform: i === lineIdx ? "translateY(0)" : "translateY(8px)",
              }}
            >
              {ln}
            </span>
          ))}
        </div>

        {/* Animated mini slide cards */}
        <div className="my-10 flex h-44 items-end gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <MiniSlide key={i} index={i} tick={tick} />
          ))}
        </div>

        {/* Progress meter — indeterminate, smooth */}
        <div className="relative mb-5 h-1 w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute inset-y-0 w-1/3 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #c4b5fd 30%, #22d3ee 60%, transparent 100%)",
              animation: "ezg-bar 1.4s cubic-bezier(.45,.05,.55,.95) infinite",
            }}
          />
        </div>

        {/* AI badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/55">
          <Wand2 size={11} className="text-violet-300" />
          Generated by AI · open-weight model
        </div>

        <p className="mt-3 text-[10px] text-white/30">
          Sit tight. Usually about 10 seconds.
        </p>
      </div>

      <style jsx global>{`
        @keyframes ezg-sweep {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes ezg-bar {
          0%   { transform: translateX(-110%); }
          100% { transform: translateX(310%); }
        }
        @keyframes ezg-grain {
          0%, 100% { transform: translate(0, 0); }
          25%      { transform: translate(-10px, 5px); }
          50%      { transform: translate(8px, -8px); }
          75%      { transform: translate(-6px, -4px); }
        }
        @keyframes ezg-float {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(30px, -20px) scale(1.08); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes ezg-spark {
          0%   { transform: translateY(0) scale(0.4); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(-160px) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* -------------------- mini slide card with row fills -------------------- */

function MiniSlide({ index, tick }: { index: number; tick: number }) {
  // Cards "appear" staggered: each card is hidden for the first
  // `appearAfter` frames then animates in.
  const appearAfter = index * 18;
  const visible = tick > appearAfter;

  // Each card holds 4 row bars. They fill in width over time, then refresh.
  const rows = 4;
  const cycleFrames = 80;
  const localTick = Math.max(0, tick - appearAfter);
  // Each row gets its own phase so they don't all fill in unison.
  const rowProgress = (i: number) => {
    const phase = ((localTick + i * 14) % cycleFrames) / cycleFrames;
    // ease-out so the bar grows fast then settles
    return Math.min(1, 0.15 + Math.pow(phase, 0.7));
  };

  // Subtle vertical bob so the card feels alive.
  const bob = Math.sin((tick + index * 8) / 12) * 1.5;

  // Color theme per card — cycles through 5 picks.
  const palette = [
    { bar: "#a78bfa", glow: "rgba(167,139,250,0.55)" },
    { bar: "#22d3ee", glow: "rgba(34,211,238,0.55)" },
    { bar: "#f472b6", glow: "rgba(244,114,182,0.55)" },
    { bar: "#34d399", glow: "rgba(52,211,153,0.55)" },
    { bar: "#fcd34d", glow: "rgba(252,211,77,0.55)" },
  ];
  const c = palette[index % palette.length];

  return (
    <div
      className="relative w-[92px] overflow-hidden rounded-xl border border-white/10 backdrop-blur"
      style={{
        height: 168,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        boxShadow: `0 12px 32px -12px ${c.glow}`,
        transform: `translateY(${visible ? bob : 16}px) scale(${visible ? 1 : 0.92})`,
        opacity: visible ? 1 : 0,
        transition: "transform 320ms cubic-bezier(.2,.7,.2,1), opacity 280ms ease",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: 4,
          width: "100%",
          background: c.bar,
        }}
      />
      <div style={{ padding: 10, paddingTop: 14 }}>
        {/* Title bar (taller, darker) */}
        <div
          style={{
            height: 8,
            width: "78%",
            background: c.bar,
            borderRadius: 3,
            opacity: 0.85,
          }}
        />
        {/* Body row bars */}
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 4,
                width: `${(rowProgress(i) * (i % 2 === 0 ? 88 : 72)).toFixed(0)}%`,
                background: "rgba(255,255,255,0.7)",
                borderRadius: 2,
                transition: "width 120ms linear",
              }}
            />
          ))}
        </div>
      </div>
      {/* Soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(80% 50% at 50% 100%, ${c.glow}, transparent 70%)`,
          opacity: 0.6,
        }}
      />
    </div>
  );
}

/* -------------------------- decorative layers -------------------------- */

function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundSize: "160px 160px",
        animation: "ezg-grain 4s steps(4) infinite",
      }}
    />
  );
}

function Orbs() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle, #7C5CFF 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: 0.55,
          animation: "ezg-float 14s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-[460px] w-[460px] rounded-full"
        style={{
          background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: 0.45,
          animation: "ezg-float 14s ease-in-out infinite",
          animationDelay: "-4s",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[15%] top-[30%] h-[260px] w-[260px] rounded-full"
        style={{
          background: "radial-gradient(circle, #f472b6 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: 0.4,
          animation: "ezg-float 14s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      />
    </>
  );
}

/**
 * Floating sparkles. Twelve absolute-positioned dots that drift up and fade,
 * each on its own delay.
 */
function Sparkles2() {
  const dots = Array.from({ length: 14 }).map((_, i) => {
    const left = (i * 73) % 100;
    const delay = (i * 0.65) % 6;
    const dur = 5 + (i % 4);
    const size = 3 + (i % 3);
    const tint = ["#c4b5fd", "#22d3ee", "#f472b6", "#fff"][i % 4];
    return { left, delay, dur, size, tint, i };
  });
  return (
    <>
      {dots.map((d) => (
        <span
          key={d.i}
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: `${d.left}%`,
            bottom: "8%",
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: d.tint,
            boxShadow: `0 0 8px ${d.tint}`,
            opacity: 0,
            animation: `ezg-spark ${d.dur}s ease-out infinite`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </>
  );
}
