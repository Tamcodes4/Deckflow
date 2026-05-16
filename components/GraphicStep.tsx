"use client";
import { useMemo, useState } from "react";
import { Image as ImageIcon, ChevronLeft, ChevronRight, Palette } from "lucide-react";
import type { Theme } from "@/lib/themes";
import { GRAPHICS, getGraphic, svgToDataUri } from "@/lib/graphics";

const PAGE_SIZE = 6;

const SWATCHES = [
  "#1E3A8A", "#1D4ED8", "#3B82F6", "#60A5FA",
  "#0E7490", "#0F766E", "#047857", "#65A30D",
  "#CA8A04", "#B45309", "#C2410C", "#DC2626",
  "#BE123C", "#9D174D", "#7C3AED", "#6D28D9",
  "#4338CA", "#374151", "#171717", "#FFFFFF",
];

export default function GraphicStep({
  theme, graphicId, setGraphicId, graphicAccent, setGraphicAccent,
  onBack, onGenerate, loading,
}: {
  theme: Theme;
  graphicId: string;
  setGraphicId: (id: string) => void;
  graphicAccent: string | undefined;
  setGraphicAccent: (hex: string | undefined) => void;
  onBack: () => void;
  onGenerate: () => void;
  loading: boolean;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(GRAPHICS.length / PAGE_SIZE);
  const visible = useMemo(
    () => GRAPHICS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [page],
  );
  const selected = getGraphic(graphicId);

  // Theme used for preview rendering (with optional accent override).
  const previewTheme: Theme = graphicAccent
    ? { ...theme, accent: graphicAccent }
    : theme;

  const isNone = selected.id === "none";

  return (
    <div className="fade-in mx-auto w-full max-w-5xl">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          <ImageIcon size={12} /> Step 4 of 5
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Pick a graphic style</h1>
        <p className="mt-2 text-white/60">
          A subtle background pattern that runs across every slide.
          Choose <span className="text-white/85">None</span> for a clean look.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {visible.map((g) => {
          const active = g.id === graphicId;
          return (
            <button
              key={g.id}
              onClick={() => setGraphicId(g.id)}
              className={`group overflow-hidden rounded-2xl border transition ${
                active ? "border-white/60 ring-2 ring-white/30" : "border-white/10 hover:border-white/40"
              }`}
            >
              <Preview theme={previewTheme} graphicId={g.id} />
              <div className="flex items-center justify-between bg-black/40 px-3 py-2 text-left">
                <span className="text-sm">{g.name}</span>
                {active && <span className="text-[10px] text-white/55">selected</span>}
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
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10 disabled:opacity-40"
        >
          Next <ChevronRight size={12} />
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="text-xs text-white/45">
          <div className="mb-2 uppercase tracking-wider text-white/55">Live preview</div>
          <BigPreview theme={previewTheme} graphicId={selected.id} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/55">
          <div className="mb-2 flex items-center gap-2 uppercase tracking-wider text-white/55">
            <Palette size={11} /> Graphic color
          </div>

          {isNone ? (
            <p className="text-white/60">
              "None" doesn't render a graphic, so there's nothing to tint.
              Pick any other style above to enable color.
            </p>
          ) : (
            <>
              <p className="mb-3 text-white/65">
                By default the graphic uses the theme's accent. Override it
                here to tint it any color while keeping the theme's text
                and background untouched.
              </p>

              <div className="mb-3 flex items-center gap-2">
                <input
                  type="color"
                  value={normalizeHex(graphicAccent || theme.accent)}
                  onChange={(e) => setGraphicAccent(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-md border border-white/10 bg-transparent"
                />
                <input
                  type="text"
                  value={graphicAccent ?? ""}
                  placeholder={theme.accent}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") setGraphicAccent(undefined);
                    else if (/^#[0-9a-fA-F]{6}$/.test(v)) setGraphicAccent(v);
                  }}
                  className="flex-1 rounded-md border border-white/10 bg-black/40 px-2 py-1.5 font-mono text-[11px] text-white/85 outline-none"
                />
                {graphicAccent && (
                  <button
                    onClick={() => setGraphicAccent(undefined)}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/70 hover:bg-white/10"
                    title="Use the theme accent"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="grid grid-cols-10 gap-1">
                {SWATCHES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setGraphicAccent(c)}
                    title={c}
                    className={`h-4 w-4 rounded-full border transition ${
                      (graphicAccent || theme.accent).toLowerCase() === c.toLowerCase()
                        ? "border-white scale-110"
                        : "border-white/15 hover:border-white/50"
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>

              <div className="mt-3 text-[10px] text-white/45">
                Currently using {(graphicAccent || theme.accent).toUpperCase()}
                {graphicAccent ? "" : " (from theme)"}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          ← Back
        </button>
        <button
          disabled={loading}
          onClick={onGenerate}
          className="rounded-xl bg-white px-5 py-2.5 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Generating…" : "Generate deck →"}
        </button>
      </div>
    </div>
  );
}

function normalizeHex(v: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  return "#000000";
}

function Preview({ theme, graphicId }: { theme: Theme; graphicId: string }) {
  const g = getGraphic(graphicId);
  const fontFamily =
    theme.font === "serif" ? "Georgia, serif"
    : theme.font === "mono" ? "Consolas, monospace"
    : "ui-sans-serif, system-ui";
  const url = svgToDataUri(g.render(theme));
  return (
    <div
      className="relative aspect-[16/9] w-full"
      style={{
        background: `${theme.bg} url("${url}") center/cover no-repeat`,
        fontFamily,
      }}
    >
      <div style={{ position: "absolute", left: "6%", top: "30%", color: theme.accent, fontWeight: 700, fontSize: 14 }}>
        Sample title
      </div>
      <div style={{ position: "absolute", left: "6%", top: "44%", color: theme.muted, fontSize: 9 }}>
        A short subtitle line
      </div>
      <div style={{ position: "absolute", left: "6%", bottom: "12%", color: theme.fg, fontSize: 8 }}>
        • First key point<br />
        • Second key point
      </div>
    </div>
  );
}

function BigPreview({ theme, graphicId }: { theme: Theme; graphicId: string }) {
  const g = getGraphic(graphicId);
  const fontFamily =
    theme.font === "serif" ? "Georgia, serif"
    : theme.font === "mono" ? "Consolas, monospace"
    : "ui-sans-serif, system-ui";
  const url = svgToDataUri(g.render(theme));
  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10"
      style={{
        background: `${theme.bg} url("${url}") center/cover no-repeat`,
        fontFamily,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: 6, background: theme.accent }} />
      <div style={{ position: "absolute", left: "6%", top: "16%", color: theme.accent, fontWeight: 700, fontSize: 28 }}>
        Quarterly review
      </div>
      <div style={{ position: "absolute", left: "6%", top: "30%", color: theme.muted, fontSize: 13 }}>
        Where we are, where we're going
      </div>
      <ul style={{ position: "absolute", left: "6%", top: "48%", color: theme.fg, fontSize: 12, listStyle: "none", padding: 0, margin: 0 }}>
        <li>• Revenue grew 38% quarter over quarter</li>
        <li>• Net retention reached 124%</li>
        <li>• Three new enterprise logos signed</li>
      </ul>
    </div>
  );
}
