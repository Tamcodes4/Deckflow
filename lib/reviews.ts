/**
 * User reviews / feedback.
 *
 * Anyone (no auth) can submit a review from /feedback. Submissions are
 * written to Firebase RTDB at /reviews/{pushId}. They're public-read so
 * the owner can browse them at /reviews and hand-pick which ones to show
 * in the landing hero.
 *
 * Best-effort and lightly validated client-side. Real protection is the
 * RTDB rules (see the rules block you set in the Firebase console).
 */

import { getFirebaseDb } from "./firebase";
import { push, ref, get, query, orderByChild, serverTimestamp } from "firebase/database";

export type Review = {
  id?: string;
  name: string;
  role: string;        // "what they do" — e.g. "Product designer"
  rating: number;      // 1..5, supports .5 steps
  text: string;        // short description, capped
  createdAt?: number;
};

export const REVIEW_LIMITS = {
  name: 40,
  role: 48,
  text: 240,
  minText: 10,
};

function clean(s: unknown, max: number): string {
  if (typeof s !== "string") return "";
  return s.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
}

/** Submit a review. Returns the new id, or throws on validation/db error. */
export async function submitReview(input: {
  name: string; role: string; rating: number; text: string;
}): Promise<string> {
  const name = clean(input.name, REVIEW_LIMITS.name);
  const role = clean(input.role, REVIEW_LIMITS.role);
  const text = clean(input.text, REVIEW_LIMITS.text);
  // Clamp rating to 1..5 in 0.5 steps.
  let rating = Number(input.rating) || 0;
  rating = Math.round(rating * 2) / 2;
  rating = Math.max(1, Math.min(5, rating));

  if (!name) throw new Error("Please add your name.");
  if (!role) throw new Error("Tell us what you do.");
  if (text.length < REVIEW_LIMITS.minText) throw new Error("A little more detail, please.");

  const db = getFirebaseDb();
  if (!db) throw new Error("Submissions are unavailable right now.");

  const node = await push(ref(db, "reviews"), {
    name, role, rating, text,
    createdAt: serverTimestamp(),
  });
  return node.key || "";
}

/** Load all reviews, newest first. Public read, no auth. */
export async function loadReviews(): Promise<Review[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  const snap = await get(query(ref(db, "reviews"), orderByChild("createdAt")));
  const val = snap.val() || {};
  const out: Review[] = Object.entries(val as Record<string, any>).map(([id, r]) => ({
    id,
    name: r?.name || "Anonymous",
    role: r?.role || "",
    rating: typeof r?.rating === "number" ? r.rating : 5,
    text: r?.text || "",
    createdAt: typeof r?.createdAt === "number" ? r.createdAt : 0,
  }));
  // Newest first.
  out.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return out;
}
