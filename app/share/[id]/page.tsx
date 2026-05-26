"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SlideCanvas from "@/components/SlideCanvas";
import Logo from "@/components/Logo";
import type { Deck } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { loadSharedDeck } from "@/lib/decks";

export default function ShareViewer({ params }: { params: { id: string } }) {
  const [data, setData] = useState<{ deck: Deck; theme: Theme; title: string } | null>(null);
  const [missing, setMissing] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await loadSharedDeck(params.id);
        if (cancelled) return;
        if (!result) { setMissing(true); return; }
        setData(result);
      } catch {
        if (!cancelled) setMissing(true);
      }
    })();
    return () => { cancelled = true; };
  }, [params.id]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!data) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        setActive((a) => Math.min(data.deck.slides.length - 1, a + 1));
      } else if (e.key === "ArrowLeft") {
        setActive((a) => Math.max(0, a - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [data]);

  if (missing) {
    return (
      <main className="grid min-h-screen place-items-center bg-black px-6 text-center text-white">
        <div>
          <h1 className="text-2xl font-semibold">Deck not found</h1>
          <p className="mt-2 text-sm text-white/55">
            This link may have been removed or never existed.
          </p>
          <Link href="/" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">
            Go to EZdeck
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="grid min-h-screen place-items-center bg-black text-sm text-white/60">
        Loading…
      </main>
    );
  }

  const { deck, theme, title } = data;
  const enriched = deck.slides[active].layout === "references"
    ? { ...deck.slides[active], references: deck.references || [] }
    : deck.slides[active];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#03070F] via-[#050B17] to-[#03070F] px-4 py-6 sm:px-8">
      <header className="mx-auto mb-6 flex max-w-6xl items-center justify-between">
        <Logo size="sm" />
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/65">
          Shared deck · read only
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-4 text-center text-2xl font-semibold tracking-tight text-white">{title}</h1>

        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          <SlideCanvas
            slide={enriched}
            theme={theme}
            idx={active}
            total={deck.slides.length}
            deckTitle={deck.title}
            graphicId={deck.graphic}
            graphicAccent={deck.graphicAccent}
            fontId={deck.fontId}
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setActive((a) => Math.max(0, a - 1))}
            disabled={active === 0}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/85 disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-xs text-white/55">
            Slide {active + 1} / {deck.slides.length}
          </span>
          <button
            onClick={() => setActive((a) => Math.min(deck.slides.length - 1, a + 1))}
            disabled={active === deck.slides.length - 1}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/85 disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-white/45">
          Made with{" "}
          <Link href="/" className="text-white/85 underline-offset-2 hover:underline">
            EZdeck
          </Link>
          {" "}— AI deck builder. Free to try.
        </p>
      </div>
    </main>
  );
}
