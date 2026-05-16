"use client";

/**
 * Tiny CSS-only skeleton card with a shimmer sweep. Use as a placeholder
 * for grid cells while their previews compute or when their content is
 * still loading on first paint.
 */
export default function Skeleton({
  className = "",
  height,
}: {
  className?: string;
  height?: number | string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] ${className}`}
      style={{ height }}
    >
      <div className="absolute inset-0 deckflow-shimmer" />
      <style jsx>{`
        .deckflow-shimmer {
          background: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.06) 50%,
            rgba(255, 255, 255, 0) 70%
          );
          background-size: 200% 100%;
          animation: deckflow-shimmer 1.4s infinite linear;
        }
        @keyframes deckflow-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
