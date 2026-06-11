"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { Deck } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import SlideCanvas from "./SlideCanvas";

export type HiddenHandoutHandle = { getNodes: () => HTMLElement[] };

const PAGE_W = 816;   // 8.5in @ 96dpi
const PAGE_H = 1056;  // 11in  @ 96dpi
const THUMB_W = 660;  // slide thumbnail width; height follows 16:9

function plain(s?: string): string {
  return (s || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Off-screen renderer that builds one US-Letter portrait page per slide: a
 * slide thumbnail with its speaker notes printed underneath (grouped by
 * speaker when the notes were split). Captured by exportHandoutToPdf for the
 * Pro "notes handout" export. The page chrome is a fixed light style so the
 * printout reads well regardless of the site theme; the thumbnail keeps the
 * deck's own theme.
 */
const HiddenHandoutRenderer = forwardRef<HiddenHandoutHandle, { deck: Deck; theme: Theme }>(
  function HiddenHandoutRenderer({ deck, theme }, ref) {
    const wrapRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getNodes() {
        if (!wrapRef.current) return [];
        return Array.from(wrapRef.current.querySelectorAll<HTMLElement>("[data-handout-node]"));
      },
    }), []);

    return (
      <div
        ref={wrapRef}
        aria-hidden
        style={{ position: "fixed", left: -99999, top: 0, pointerEvents: "none" }}
      >
        {deck.slides.map((s, i) => {
          const slide = s.layout === "references" ? { ...s, references: deck.references || [] } : s;
          const title = plain(s.title) || `Slide ${i + 1}`;
          const segments = s.noteSegments && s.noteSegments.length > 0 ? s.noteSegments : null;
          const note = plain(s.notes);
          return (
            <div
              key={i}
              data-handout-node
              style={{
                width: PAGE_W, height: PAGE_H,
                background: "#ffffff", color: "#0B1220",
                padding: 56, boxSizing: "border-box",
                fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                display: "flex", flexDirection: "column",
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: 18, paddingBottom: 12, borderBottom: "2px solid #0B1220" }}>
                <span style={{
                  fontSize: 15, fontWeight: 800, color: "#0F766E",
                  fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 19, fontWeight: 700, color: "#0B1220", marginLeft: 12 }}>
                  {title}
                </span>
              </div>

              {/* Slide thumbnail (keeps the deck theme) */}
              <div style={{
                width: THUMB_W, margin: "0 auto",
                border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden",
                boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
              }}>
                <SlideCanvas
                  slide={slide}
                  theme={theme}
                  idx={i}
                  total={deck.slides.length}
                  deckTitle={deck.title}
                  graphicId={deck.graphic}
                  graphicAccent={deck.graphicAccent}
                  fontId={deck.fontId}
                />
              </div>

              {/* Notes */}
              <div style={{ marginTop: 22, flex: 1, overflow: "hidden" }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "#64748B", marginBottom: 8,
                }}>
                  Speaker notes
                </div>
                {segments ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {segments.map((seg, j) => (
                      <div key={j}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F766E" }}>{plain(seg.speaker)}</div>
                        <div style={{ fontSize: 14, lineHeight: 1.6, color: "#1E293B", marginTop: 2 }}>{plain(seg.text)}</div>
                      </div>
                    ))}
                  </div>
                ) : note ? (
                  <div style={{ fontSize: 14, lineHeight: 1.7, color: "#1E293B" }}>{note}</div>
                ) : (
                  <div style={{ fontSize: 13, fontStyle: "italic", color: "#94A3B8" }}>No notes for this slide.</div>
                )}
              </div>

              {/* Footer */}
              <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid #E2E8F0", fontSize: 11, color: "#94A3B8" }}>
                {plain(deck.title)} · Slide {i + 1} of {deck.slides.length}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

export default HiddenHandoutRenderer;
