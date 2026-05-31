/**
 * Changelog data, built from the repo's public GitHub commit history.
 *
 * No API key, no SDK — just the public, unauthenticated commits endpoint
 * (60 req/hour/IP). We fetch server-side with ISR caching so a hot page
 * doesn't hammer the rate limit, then shape the raw commits into versioned
 * release groups for the /changelog page.
 */

export type ChangeKind = "new" | "fix" | "improved" | "docs" | "merged" | "update";

export type ChangeItem = {
  sha: string;
  shortSha: string;
  title: string;
  body: string[];
  kind: ChangeKind;
  url: string;
  iso: string;
  author: string;
};

export type ReleaseGroup = {
  version: string;   // e.g. "v1.12"
  label: string;     // human date, e.g. "June 1, 2026"
  iso: string;       // YYYY-MM-DD
  items: ChangeItem[];
};

const REPO = "izhan0102/Deckflow";
const API = `https://api.github.com/repos/${REPO}/commits?per_page=100`;

/** Map a commit subject to a category so each entry gets a clean tag. */
function classify(subject: string): ChangeKind {
  const s = subject.toLowerCase();
  if (/^merge\s+pull\s+request|\(#\d+\)|merge\s+pr/.test(s)) return "merged";
  if (/\b(fix|bug|hotfix|patch|resolve|repair|broken|crash)\b/.test(s)) return "fix";
  if (/\b(add|new|introduce|implement|create|ship|support)\b/.test(s)) return "new";
  if (/\b(rework|refine|improve|polish|redesign|revamp|enhance|tweak|update|change|switch|rename|move|carry)\b/.test(s)) return "improved";
  if (/\b(docs?|readme|changelog|comment|license|guide)\b/.test(s)) return "docs";
  return "update";
}

/** Strip conventional-commit prefixes and tidy the subject line. */
function cleanSubject(raw: string): string {
  let s = raw.split("\n")[0].trim();
  // Drop "feat:", "fix(scope):", "chore:" style prefixes.
  s = s.replace(/^(\w+)(\([^)]*\))?:\s*/i, "");
  // Drop a trailing PR number "(#23)".
  s = s.replace(/\s*\(#\d+\)\s*$/, "");
  if (s.length === 0) return raw.trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Pull meaningful body lines (bullets / short notes) out of a message. */
function bodyLines(message: string): string[] {
  const lines = message.split("\n").slice(1);
  const out: string[] = [];
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (/^(co-authored-by|signed-off-by|closes|fixes|resolves)\b/i.test(line)) continue;
    // Normalize bullet markers.
    line = line.replace(/^[-*•]\s*/, "");
    if (line.length < 3) continue;
    out.push(line);
    if (out.length >= 6) break;
  }
  return out;
}

function isoDay(iso: string): string {
  return iso.slice(0, 10);
}

function humanDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch {
    return isoDay(iso);
  }
}

/**
 * Fetch and shape the changelog. Returns null on any failure so the page
 * can show a graceful fallback instead of throwing.
 */
export async function fetchChangelog(): Promise<ReleaseGroup[] | null> {
  let raw: any[];
  try {
    const res = await fetch(API, {
      headers: { Accept: "application/vnd.github+json" },
      // ISR: cache for an hour so we stay well under the 60/hr public limit.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    raw = await res.json();
    if (!Array.isArray(raw)) return null;
  } catch {
    return null;
  }

  // Shape each commit, skipping internal branch merges (keep PR merges).
  const items: ChangeItem[] = [];
  for (const c of raw) {
    const message: string = c?.commit?.message || "";
    const subject = message.split("\n")[0] || "";
    if (/^merge\s+branch\b/i.test(subject)) continue;       // internal noise
    const iso: string = c?.commit?.author?.date || c?.commit?.committer?.date || "";
    if (!iso) continue;
    items.push({
      sha: c?.sha || "",
      shortSha: (c?.sha || "").slice(0, 7),
      title: cleanSubject(subject),
      body: bodyLines(message),
      kind: classify(subject),
      url: c?.html_url || `https://github.com/${REPO}`,
      iso,
      author: c?.author?.login || c?.commit?.author?.name || "contributor",
    });
  }

  if (items.length === 0) return null;

  // Group by calendar day (newest first).
  const byDay = new Map<string, ChangeItem[]>();
  for (const it of items) {
    const day = isoDay(it.iso);
    const arr = byDay.get(day) || [];
    arr.push(it);
    byDay.set(day, arr);
  }

  const daysDesc = Array.from(byDay.keys()).sort((a, b) => (a < b ? 1 : -1));

  // Version numbers ascend with history: oldest day = v1.0, each newer day
  // bumps the minor, so the newest release shows the highest version.
  const total = daysDesc.length;
  const groups: ReleaseGroup[] = daysDesc.map((day, i) => {
    const minor = total - 1 - i; // newest gets the largest minor
    return {
      version: `v1.${minor}`,
      label: humanDate(byDay.get(day)![0].iso),
      iso: day,
      items: byDay.get(day)!,
    };
  });

  return groups;
}
