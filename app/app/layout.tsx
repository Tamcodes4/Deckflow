import DesktopOnMobile from "@/components/DesktopOnMobile";

/**
 * Layout for everything under /app/*.
 *
 * Mounts DesktopOnMobile so the editor (and the My Decks list under it)
 * always renders in fixed-1280px desktop mode on phones. Other routes —
 * landing, /auth, /share, /about — are unaffected.
 *
 * The dashboard and editor follow the user's chosen theme (light or
 * dark), same as the rest of the site. Slide content keeps its own
 * per-deck theme regardless.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DesktopOnMobile />
      {children}
    </>
  );
}
