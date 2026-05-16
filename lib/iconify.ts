/**
 * Iconify integration.
 *
 * Iconify ships 200k+ icons across 100+ open-source sets via a free public
 * API at https://api.iconify.design — no key, no attribution required for
 * MIT-licensed sets (Tabler, Heroicons, Material, Phosphor, Carbon, etc.).
 *
 * For the picker we hit /search.
 * For rendering on a slide we hit /{prefix}/{name}.svg?color=... which lets
 * us recolor an icon to any hex.
 */

export type IconifyHit = {
  /** "tabler:rocket", "mdi:home" */
  id: string;
  /** Display label parsed from the id */
  name: string;
};

export const ICONIFY_BASE = "https://api.iconify.design";

/**
 * Build a recolored SVG URL for an icon. Color is a hex like "#DC2626".
 * Iconify accepts query string color parameter in URL-encoded form.
 */
export function iconifySvgUrl(iconId: string, color?: string): string {
  if (!iconId.includes(":")) return "";
  const [prefix, name] = iconId.split(":");
  const safeColor = (color || "").replace("#", "");
  const colorParam = safeColor ? `?color=%23${safeColor}` : "";
  return `${ICONIFY_BASE}/${encodeURIComponent(prefix)}/${encodeURIComponent(name)}.svg${colorParam}`;
}

/**
 * Server-side helper used by /api/icon-search to call Iconify. Returns up to
 * `limit` icon ids matching the query.
 */
export async function searchIconify(query: string, limit = 32): Promise<IconifyHit[]> {
  const q = query.trim();
  if (!q) return [];
  const url = `${ICONIFY_BASE}/search?query=${encodeURIComponent(q)}&limit=${limit}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Cache for an hour at the edge so repeated searches are instant.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const ids: string[] = Array.isArray(data?.icons) ? data.icons : [];
    return ids.map((id) => ({ id, name: friendlyName(id) }));
  } catch {
    return [];
  }
}

function friendlyName(id: string): string {
  const [, name] = id.split(":");
  if (!name) return id;
  return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
