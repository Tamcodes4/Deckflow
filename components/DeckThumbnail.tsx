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
        className={`flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent ${className}`}
      >
        <FileText size={22} className="text-white/30" />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-white/10 ${className}`}>
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
