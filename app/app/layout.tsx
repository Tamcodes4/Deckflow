import DesktopOnMobile from "@/components/DesktopOnMobile";

/**
 * Layout for everything under /app/*.
 *
 * Mounts DesktopOnMobile so the editor (and the My Decks list under it)
 * always renders in fixed-1280px desktop mode on phones. Other routes —
 * landing, /auth, /share, /about — are unaffected.
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
