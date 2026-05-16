import "./globals.css";
import type { Metadata } from "next";
import MobileGate from "@/components/MobileGate";

export const metadata: Metadata = {
  title: "DeckFlow — Presentations from a prompt",
  description:
    "Type a topic, pick a theme, get a polished deck. DeckFlow writes, designs, and exports PowerPoint-ready presentations in seconds.",
};

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Inter:wght@400;500;600;700;800",
    "family=Manrope:wght@400;500;600;700;800",
    "family=DM+Sans:wght@400;500;700",
    "family=Work+Sans:wght@400;500;600;700",
    "family=Plus+Jakarta+Sans:wght@400;500;600;700;800",
    "family=Outfit:wght@400;500;600;700;800",
    "family=Space+Grotesk:wght@400;500;700",
    "family=IBM+Plex+Sans:wght@400;500;600;700",
    "family=Figtree:wght@400;500;600;700;800",
    "family=Playfair+Display:wght@400;600;700;800",
    "family=Lora:wght@400;500;600;700",
    "family=Merriweather:wght@400;700",
    "family=Fraunces:wght@400;600;700;800",
    "family=Source+Serif+Pro:wght@400;600;700",
    "family=Bricolage+Grotesque:wght@400;600;700;800",
    "family=Syne:wght@400;600;700;800",
    "family=Archivo:wght@400;600;700;800",
    "family=JetBrains+Mono:wght@400;500;700",
  ].join("&") + "&display=swap";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect speeds up the first paint of any font we end up using. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
      </head>
      <body>
        {children}
        <MobileGate />
      </body>
    </html>
  );
}
