"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";

/**
 * Hand-rolled first-visit tour. Smooth animated ring + auto-scroll to
 * each step's target. Dependency-free.
 *
 * Behavior:
 *   - Shown once per browser; gated by localStorage.
 *   - Each step targets a `data-tour` attribute. We scroll the target into
 *     view, animate a highlight ring around it, and float a tooltip card
 *     adjacent. CSS transitions make the ring slide between steps.
 *   - If a step's target is missing, the tooltip centers on screen.
 */

const STORAGE_KEY = "deckflow_onboarding_v3";

type StepId = "start-from-scratch" | "decks-list" | "my-decks-nav" | "upgrade-info";

type Step = {
  id: StepId;
  title: string;
  body: string;
  /** Element with this `data-tour` attribute is the anchor. */
  target: StepId;
  /** Preferred placement; auto-flips if there's no room. */
  placement?: "top" | "bottom" | "left" | "right";
};

const ALL_STEPS: Step[] = [
  {
    id: "start-from-scratch",
    title: "Make your first deck",
    body: "Start with a brief — a sentence or two about the topic — and DeckFlow generates a polished deck in about ten seconds. Edit anything inline once it's ready.",
    target: "start-from-scratch",
    placement: "bottom",
  },
];

export default function OnboardingTour({ enabled = true }: { enabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Decide whether to start the tour.
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    let seen: string | null = null;
    try { seen = window.localStorage.getItem(STORAGE_KEY); } catch { /* ignore */ }
    if (seen) return;
    // Small delay so the page can render before we measure targets.
    const t = window.setTimeout(() => {
      setOpen(true);
      // Trigger a re-render after open so the entrance animation runs.
      window.requestAnimationFrame(() => setMounted(true));
    }, 700);
    return () => window.clearTimeout(t);
  }, [enabled]);

  const step = ALL_STEPS[stepIdx];

  // Whenever step changes, scroll the target into view and start tracking
  // its bounding rect with a requestAnimationFrame loop. This keeps the
  // ring and tooltip glued to the target even through layout shifts.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const findTarget = () =>
      document.querySelector(`[data-tour="${step.target}"]`) as HTMLElement | null;

    // Smooth-scroll to the target so it's centered in the viewport.
    const el = findTarget();
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    } else {
      setRect(null);
    }

    // Track rect every frame; cheap because it's just getBoundingClientRect.
    const tick = () => {
      if (cancelled) return;
      const e = findTarget();
      if (e) {
        const r = e.getBoundingClientRect();
        setRect((prev) => {
          if (!prev) return r;
          // Avoid no-op state updates when the rect is stable.
          if (prev.top === r.top && prev.left === r.left && prev.width === r.width && prev.height === r.height) {
            return prev;
          }
          return r;
        });
      } else {
        setRect(null);
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [open, step]);

  const finish = () => {
    try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
    setMounted(false);
    window.setTimeout(() => setOpen(false), 200);
  };

  const next = () => {
    if (stepIdx >= ALL_STEPS.length - 1) finish();
    else setStepIdx((s) => s + 1);
  };
  const prev = () => setStepIdx((s) => Math.max(0, s - 1));

  // Compute tooltip position based on current rect + auto-flip.
  const tipStyle = useMemo<React.CSSProperties>(() => {
    if (typeof window === "undefined") return { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
    if (!rect) return { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
    return positionTooltip(rect, step.placement || "bottom");
  }, [rect, step.placement]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200]"
      style={{
        pointerEvents: "auto",
        opacity: mounted ? 1 : 0,
        transition: "opacity 220ms ease",
      }}
    >
      {/* Dim layer behind everything. The hole is achieved with a separate
          highlight box that punches a transparent rectangle on top. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(5, 5, 7, 0.62)",
          backdropFilter: "blur(2px)",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) { /* don't dismiss on dim click */ } }}
      />

      {/* Animated highlight ring + cutout. Both share the same animated
          rect so they stay in sync. */}
      {rect && (
        <>
          {/* Cutout: a perfectly-sized box with the page's background color
              (transparent, since we use mix-blend-mode to "erase" the dim). */}
          <div
            aria-hidden
            style={{
              position: "fixed",
              top: rect.top - 8,
              left: rect.left - 8,
              width: rect.width + 16,
              height: rect.height + 16,
              borderRadius: 14,
              background: "transparent",
              boxShadow:
                "0 0 0 9999px rgba(5, 5, 7, 0.62), 0 0 0 2px rgba(196,181,253,0.85), 0 16px 60px -10px rgba(124,92,255,0.55)",
              transition: "top 280ms cubic-bezier(.2,.7,.2,1), left 280ms cubic-bezier(.2,.7,.2,1), width 280ms cubic-bezier(.2,.7,.2,1), height 280ms cubic-bezier(.2,.7,.2,1)",
              pointerEvents: "none",
            }}
          />
          {/* Pulse ring for a touch of life. */}
          <div
            aria-hidden
            style={{
              position: "fixed",
              top: rect.top - 8,
              left: rect.left - 8,
              width: rect.width + 16,
              height: rect.height + 16,
              borderRadius: 14,
              border: "2px solid rgba(196,181,253,0.85)",
              transition: "top 280ms cubic-bezier(.2,.7,.2,1), left 280ms cubic-bezier(.2,.7,.2,1), width 280ms cubic-bezier(.2,.7,.2,1), height 280ms cubic-bezier(.2,.7,.2,1)",
              animation: "deckflow-tour-pulse 1.6s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Tooltip card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={step.title}
        key={step.id}
        style={{
          position: "fixed",
          maxWidth: 340,
          ...tipStyle,
          // Cross-fade the body when the step changes.
          animation: "deckflow-tour-tip 260ms ease",
        }}
        className="rounded-2xl border border-white/10 bg-zinc-950/95 p-5 shadow-2xl backdrop-blur"
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/30 bg-violet-300/10 px-2 py-0.5 text-[10px] font-medium text-violet-200">
            <Sparkles size={10} /> Quick tour · {stepIdx + 1} of {ALL_STEPS.length}
          </div>
          <button
            onClick={finish}
            aria-label="Skip tour"
            className="rounded-full p-1 text-white/45 hover:bg-white/10 hover:text-white"
          >
            <X size={13} />
          </button>
        </div>
        <h3 className="text-base font-semibold text-white">{step.title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">{step.body}</p>

        {/* Step indicator dots */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {ALL_STEPS.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === stepIdx ? 18 : 6,
                  background: i === stepIdx ? "rgba(196,181,253,0.85)" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {stepIdx > 0 && (
              <button
                onClick={prev}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-white/85 hover:bg-white/10"
              >
                Back
              </button>
            )}
            <button
              onClick={next}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[12px] font-medium text-black hover:bg-white/90"
            >
              {stepIdx >= ALL_STEPS.length - 1 ? "Got it" : "Next"}
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes deckflow-tour-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,92,255,0.0); }
          50%      { box-shadow: 0 0 0 8px rgba(124,92,255,0.18); }
        }
        @keyframes deckflow-tour-tip {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* --------------------------- helpers --------------------------- */

const TIP_W = 340;
const TIP_H_EST = 200;
const MARGIN = 16;

function positionTooltip(
  rect: DOMRect, preferred: "top" | "bottom" | "left" | "right",
): React.CSSProperties {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const space = {
    top: rect.top,
    bottom: vh - rect.bottom,
    left: rect.left,
    right: vw - rect.right,
  };

  // Auto-flip: if preferred placement doesn't have room, pick the side
  // with the most space.
  const order = [preferred, "bottom", "top", "right", "left"] as const;
  let chosen: "top" | "bottom" | "left" | "right" = preferred;
  for (const p of order) {
    const enough =
      (p === "top" && space.top > TIP_H_EST + MARGIN) ||
      (p === "bottom" && space.bottom > TIP_H_EST + MARGIN) ||
      (p === "left" && space.left > TIP_W + MARGIN) ||
      (p === "right" && space.right > TIP_W + MARGIN);
    if (enough) { chosen = p; break; }
  }

  // Compute coords for the chosen side, clamped inside the viewport.
  switch (chosen) {
    case "top":
      return {
        top: Math.max(MARGIN, rect.top - MARGIN - TIP_H_EST),
        left: clamp(rect.left + rect.width / 2 - TIP_W / 2, MARGIN, vw - TIP_W - MARGIN),
      };
    case "bottom":
      return {
        top: Math.min(vh - TIP_H_EST - MARGIN, rect.bottom + MARGIN),
        left: clamp(rect.left + rect.width / 2 - TIP_W / 2, MARGIN, vw - TIP_W - MARGIN),
      };
    case "left":
      return {
        top: clamp(rect.top + rect.height / 2 - TIP_H_EST / 2, MARGIN, vh - TIP_H_EST - MARGIN),
        left: Math.max(MARGIN, rect.left - MARGIN - TIP_W),
      };
    case "right":
    default:
      return {
        top: clamp(rect.top + rect.height / 2 - TIP_H_EST / 2, MARGIN, vh - TIP_H_EST - MARGIN),
        left: Math.min(vw - TIP_W - MARGIN, rect.right + MARGIN),
      };
  }
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
