"use client";
import SlideCanvas from "./SlideCanvas";
import type { DeckListItem } from "@/lib/decks";
import { PRESET_THEMES, type Theme } from "@/lib/themes";
import { FileText } from "lucide-react";

/**
 * Renders the first slide of a deck as a small thumbnail. Falls back to a
 * neutral file icon if the deck row doesn't have an embedded first slide
 * (e.g. legacy decks created before we started caching it on the row).
 */
export default function DeckThumbnail({
  item, className = "",
}: {
  item: DeckListItem;
  className?: string;
}) {
  const slide = item.firstSlide;
  const theme: Theme = item.theme || PRESET_THEMES[0];

  if (!slide) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent ${className}`}
        style={{ aspectRatio: "16 / 9" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText size={22} className="text-white/30" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-white/10 ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      <SlideCanvas
        slide={slide}
        theme={theme}
        idx={0}
        total={item.slides || 1}
        deckTitle={item.title}
        graphicId={item.graphic}
        graphicAccent={item.graphicAccent}
        fontId={item.fontId}
      />
    </div>
  );
}
