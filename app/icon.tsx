import { ImageResponse } from "next/og";

/**
 * Dynamic favicon. Renders a 32×32 violet rounded square with the
 * DeckFlow "D" mark. Picked up automatically by Next.js as the site icon.
 */

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7C5CFF 0%, #A78BFA 100%)",
          color: "white",
          fontSize: 22,
          fontWeight: 800,
          fontFamily: "system-ui, -apple-system, sans-serif",
          borderRadius: 7,
        }}
      >
        D
      </div>
    ),
    size,
  );
}
