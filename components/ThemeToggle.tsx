"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

/**
 * Sun/moon icon button that flips the site theme.
 *
 * Two visual modes:
 *   - "pill": rounded-full chip in the navbar (landing page style).
 *   - "compact": small square button for the dashboard sidebar.
 *
 * The icon matches the theme you'll switch to (sun when in dark,
 * moon when in light). Same convention as macOS, GitHub, and most
 * editors people use day-to-day.
 */
export default function ThemeToggle({
  variant = "pill",
  className = "",
}: {
  variant?: "pill" | "compact";
  className?: string;
}) {
  const [theme, , toggle] = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggle}
        title={label}
        aria-label={label}
        className={[
          "grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5",
          "text-white/75 transition hover:bg-white/10 hover:text-white",
          className,
        ].join(" ")}
      >
        {isDark ? <Sun size={13} /> : <Moon size={13} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={label}
      aria-label={label}
      className={[
        "inline-flex h-7 w-7 items-center justify-center rounded-full",
        "border border-white/10 bg-white/5 text-white/75",
        "transition hover:bg-white/10 hover:text-white",
        className,
      ].join(" ")}
    >
      {/* Two icons stacked, fade through one another on toggle */}
      <span className="relative inline-grid h-3.5 w-3.5 place-items-center">
        <Sun
          size={13}
          className="absolute transition-all duration-300"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.6)",
          }}
        />
        <Moon
          size={13}
          className="absolute transition-all duration-300"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? "rotate(90deg) scale(0.6)" : "rotate(0deg) scale(1)",
          }}
        />
      </span>
    </button>
  );
}
