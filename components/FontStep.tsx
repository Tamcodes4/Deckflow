"use client";
import { useMemo, useState } from "react";
import type { Theme } from "@/lib/themes";
import { FONT_PRESETS, type FontPreset } from "@/lib/fonts";
import { ChevronLeft, ChevronRight, Type } from "lucide-react";

const PAGE = 6;

export default function FontStep({
  theme, fontId, setFontId, onBack, onNext,
}: {
  theme: Theme;
  fontId: string;
  setFontId: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<"All" | FontPreset["category"]>("All");

  const filtered = useMemo(
    () => filter === "All" ? FONT_PRESETS : FONT_PRESETS.filter((f) => f.category === filter),
    [filter],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const visible = useMemo(
    () => filtered.slice(page * PAGE, (page + 1) * PAGE),
    [filtered, page],
  );

  return (
    <div className="fade-in mx-auto w-full max-w-5xl">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          <Type size={12} /> Step 3 of 5
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Pick a font</h1>
        <p className="mt-2 text-white/60">
          Sets the typography for every slide. You can change it later from the chat.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {(["All", "sans", "serif", "display", "mono"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(0); }}
            className={`rounded-full px-3 py-1 text-xs capitalize transition ${
              filter === f ? "bg-white text-black" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visible.map((f) => {
          const active = fontId === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFontId(f.id)}
              className={`group overflow-hidden rounded-2xl border text-left transition ${
                active ? "border-white/60 ring-2 ring-white/30" : "border-white/10 hover:border-white/30"
              }`}
            >
              <div
                className="px-5 py-6"
                style={{
                  background: theme.bg,
                  color: theme.fg,
                  fontFamily: f.family,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: theme.accent }}>
                  {f.preview}
                </div>
                <div style={{ fontSize: 13, marginTop: 6, color: theme.muted }}>
                  Subtitle line in {f.name}
                </div>
              </div>
              <div className="flex items-center justify-between bg-black/40 px-3 py-2">
                <div>
                  <div className="text-sm text-white">{f.name}</div>
                  <div className="text-[10px] text-white/45">{f.tagline}</div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] capitalize text-white/55">
                  {f.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10 disabled:opacity-40"
        >
          <ChevronLeft size={12} /> Prev
        </button>
        <span className="text-xs text-white/45">
          Page {page + 1} of {totalPages} · {filtered.length} fonts
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10 disabled:opacity-40"
        >
          Next <ChevronRight size={12} />
        </button>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="rounded-xl bg-white px-5 py-2.5 font-medium text-black transition hover:bg-white/90"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
