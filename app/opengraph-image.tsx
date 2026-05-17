import { ImageResponse } from "next/og";

/**
 * Dynamic OG image for landing-page social shares.
 *
 * Next renders this on the edge whenever a crawler (LinkedIn, WhatsApp,
 * X, Discord) fetches /opengraph-image so it always has a 1200×630 PNG
 * preview. We draw a hero-style mock slide so people see what the
 * product actually looks like, not a logo on a black square.
 */

export const runtime = "edge";
export const alt = "EZdeck — Presentations from a prompt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(60% 50% at 30% 25%, rgba(124,92,255,0.32), transparent 70%), radial-gradient(50% 40% at 80% 80%, rgba(34,211,238,0.18), transparent 70%), #050507",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: 64,
        }}
      >
        {/* Brand chip */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 64,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            color: "#fff",
            fontWeight: 700,
            letterSpacing: -0.3,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              background:
                "linear-gradient(135deg, #7C5CFF 0%, #9D5CFF 55%, #22D3EE 100%)",
              color: "white",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            EZ
          </div>
          <span>
            EZ<span style={{ opacity: 0.85 }}>deck</span>
          </span>
        </div>

        {/* Left: copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "55%",
            paddingRight: 40,
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.22em",
              color: "#c4b5fd",
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            AI DECK BUILDER
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
            }}
          >
            Presentations from a prompt.
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 26,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.4,
            }}
          >
            Type a topic, pick a theme, get a polished deck. Real .pptx and .pdf export.
          </div>
        </div>

        {/* Right: mock slide */}
        <div
          style={{
            position: "absolute",
            right: 64,
            top: 130,
            width: 460,
            height: 360,
            borderRadius: 18,
            background: "#FFFFFF",
            boxShadow: "0 30px 80px -20px rgba(124,92,255,0.55)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 36,
            color: "#0F172A",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 8,
              background: "#1D4ED8",
            }}
          />
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.22em",
              color: "#1D4ED8",
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Q1 INVESTOR UPDATE
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            From idea to deck in under a minute.
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 18,
              color: "#475569",
            }}
          >
            Real PPTX, edit anything inline, free to try.
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 56,
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 18,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <span>Free · no credit card</span>
          <span>·</span>
          <span>Open source</span>
          <span>·</span>
          <span>ezdeck.app</span>
        </div>
      </div>
    ),
    size,
  );
}
