"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Crown, FileText, Home, Loader2, LogOut, Plus, Sparkles, Trash2, Wand2,
} from "lucide-react";
import { logout, type AppUser } from "@/lib/auth";
import { deleteDeck, watchDeckList, type DeckListItem } from "@/lib/decks";
import { getFirebaseDb } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import DeckThumbnail from "./DeckThumbnail";
import Logo from "./Logo";

/**
 * Dashboard view shown when the user lands on /app.
 *
 * Layout:
 *   - Sidebar (left): brand + nav + user profile + sign out.
 *   - Main (right):
 *       1. Welcome row.
 *       2. Two big "create" actions (start from scratch / upload template).
 *       3. Recent decks grid with paid decks highlighted in gold.
 */

type Props = {
  user: AppUser;
  onStartFromScratch: () => void;
  onSignOut: () => void | Promise<void>;
};

export default function Dashboard({ user, onStartFromScratch, onSignOut }: Props) {
  const [decks, setDecks] = useState<DeckListItem[]>([]);
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Live deck list.
  useEffect(() => {
    const unsub = watchDeckList(user.uid, (items) => {
      setDecks(items);
      setLoading(false);
    });
    return () => unsub();
  }, [user.uid]);

  // Live `paid` flags. We watch the whole user node and pick out which
  // decks have paid metadata so we can mark them as unlocked / golden.
  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) return;
    const unsub = onValue(ref(db, `decks/${user.uid}`), (snap) => {
      const val = snap.val() || {};
      const ids = new Set<string>();
      for (const [id, row] of Object.entries(val as Record<string, any>)) {
        if (row?.paid?.paidAt) ids.add(id);
      }
      setPaidIds(ids);
    });
    return () => unsub();
  }, [user.uid]);

  return (
    <div className="min-h-screen lg:pl-[260px]">
      {/* ============== Sidebar ============== */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-white/10 bg-zinc-950/80 p-5 backdrop-blur lg:flex">
        <Logo size="md" />

        <nav className="mt-7 space-y-1 text-sm">
          <NavItem icon={<Home size={14} />} label="Dashboard" active />
          <NavItem
            icon={<FileText size={14} />}
            label="My decks"
            href="/app/decks"
            count={decks.length || undefined}
          />
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-700 text-sm font-semibold text-white">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">
                {user.name || user.email?.split("@")[0]}
              </div>
              <div className="truncate text-[11px] text-white/50">{user.email}</div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-white/85 transition hover:bg-white/10"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>

      {/* ============== Main ============== */}
      <main className="px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
        {/* Mobile header: brand + sign out */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <Logo size="sm" />
          <button
            onClick={onSignOut}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:bg-white/10"
          >
            <LogOut size={11} className="mr-1 inline" /> Sign out
          </button>
        </div>

        {/* Welcome */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
            <Sparkles size={11} className="text-cyan-300" />
            Welcome back
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Hi {firstName(user)}, what are we building today?
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Start a fresh deck from a brief, or pick up where you left off.
          </p>
        </div>

        {/* Primary create action */}
        <div className="mb-10">
          <button
            onClick={onStartFromScratch}
            data-tour="start-from-scratch"
            className="group flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-white/[0.02] to-transparent p-5 text-left transition hover:border-cyan-300/40 hover:from-cyan-500/20"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 transition group-hover:bg-cyan-300/20">
              <Wand2 size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-base font-semibold text-white">
                Start from scratch
                <ArrowRight
                  size={14}
                  className="text-white/55 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                />
              </div>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                Type a brief, pick a theme and graphic, and EZdeck generates the
                whole deck. Edit anything inline once it's made.
              </p>
            </div>
          </button>
        </div>

        {/* Recent decks */}
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Your decks
            </h2>
            <p className="mt-1 text-xs text-white/45">
              Auto-saved as you edit. Paid decks unlock the .pptx and .pdf downloads.
            </p>
          </div>
          {decks.length > 0 && (
            <Link
              href="/app/decks"
              className="text-[12px] text-white/55 hover:text-white/85"
            >
              See all →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid place-items-center rounded-2xl border border-white/10 bg-white/[0.02] p-12">
            <Loader2 size={20} className="animate-spin text-white/45" />
          </div>
        ) : decks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
            <FileText size={26} className="mx-auto mb-3 text-white/30" />
            <h3 className="text-sm font-semibold text-white">No decks yet</h3>
            <p className="mt-1 text-xs text-white/55">
              Click "Start from scratch" above to make your first one.
            </p>
            <button
              onClick={onStartFromScratch}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
            >
              <Plus size={14} /> Create a deck
            </button>
          </div>
        ) : (
          <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {decks.slice(0, 9).map((d) => (
              <DeckCard
                key={d.id}
                deck={d}
                isPaid={paidIds.has(d.id)}
                onAskDelete={() => setConfirmId(d.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete confirm */}
      {confirmId && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="m-4 w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-white">Delete this deck?</h3>
            <p className="mt-2 text-sm text-white/65">
              This can't be undone. Any public share link will also stop working.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (confirmId) {
                    try { await deleteDeck(user.uid, confirmId); } catch { /* ignore */ }
                  }
                  setConfirmId(null);
                }}
                className="rounded-xl bg-red-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------- subcomponents --------------------------- */

function NavItem({
  icon, label, href, active, count,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  count?: number;
}) {
  const className = `flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition ${
    active
      ? "bg-white/10 text-white"
      : "text-white/65 hover:bg-white/5 hover:text-white"
  }`;
  const inner = (
    <>
      <span className="flex items-center gap-2.5">
        {icon}
        {label}
      </span>
      {typeof count === "number" && (
        <span className="rounded-full border border-white/10 bg-white/5 px-1.5 text-[10px] tabular-nums text-white/65">
          {count}
        </span>
      )}
    </>
  );
  return href ? (
    <Link href={href} className={className}>{inner}</Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

function DeckCard({
  deck, isPaid, onAskDelete,
}: {
  deck: DeckListItem;
  isPaid: boolean;
  onAskDelete: () => void;
}) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-2xl border p-4 transition ${
        isPaid
          ? "border-amber-300/40 bg-gradient-to-br from-amber-300/10 via-yellow-300/5 to-transparent hover:border-amber-300/60"
          : "border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
      }`}
    >
      {/* Thumbnail — fixed aspect ratio so every card matches */}
      <div className="mb-3">
        <DeckThumbnail item={deck} />
      </div>

      {isPaid && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-300/15 px-2 py-0.5 text-[10px] font-medium text-amber-200">
          <Crown size={10} /> Unlocked
        </span>
      )}

      {/* Text block — fixed minimum height keeps actions aligned across cards */}
      <div className="min-h-[64px]">
        <h3 className="line-clamp-2 text-sm font-semibold text-white">{deck.title}</h3>
        {deck.subtitle && (
          <p className="mt-1 line-clamp-1 text-[11px] text-white/55">{deck.subtitle}</p>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
        <span>{deck.slides} slide{deck.slides === 1 ? "" : "s"}</span>
        <span>{formatRelative(deck.updatedAt)}</span>
      </div>

      {/* Actions pinned to the bottom */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <Link
          href={`/app?id=${deck.id}`}
          className="flex-1 rounded-lg bg-white px-3 py-1.5 text-center text-xs font-medium text-black hover:bg-white/90"
        >
          Open
        </Link>
        {deck.shareId && (
          <Link
            href={`/share/${deck.shareId}`}
            target="_blank"
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/75 hover:bg-white/10"
            title="View public share link"
          >
            Share
          </Link>
        )}
        <button
          onClick={onAskDelete}
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-xs text-red-200 hover:bg-red-500/20"
          title="Delete this deck"
          aria-label="Delete deck"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </article>
  );
}

function firstName(u: AppUser): string {
  if (u.name) return u.name.split(/\s+/)[0];
  if (u.email) return u.email.split("@")[0];
  return "there";
}

function formatRelative(ts: number): string {
  if (!ts) return "just now";
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString();
}
