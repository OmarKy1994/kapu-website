"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { swapLocale } from "@/lib/i18n";

/**
 * Swaps only the locale segment of the current route, so /en/menu -> /el/menu
 * rather than bouncing the visitor back to the homepage. No runtime machine
 * translation anywhere — this only ever links between the two hand-authored
 * content trees.
 */
export default function LanguageSwitcher({
  locale,
  label,
  compact = false,
}: {
  locale: Locale;
  label: string;
  compact?: boolean;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const nextLocale: Locale = locale === "en" ? "el" : "en";
  const href = swapLocale(pathname, nextLocale);

  return (
    <Link
      href={href}
      aria-label={label}
      lang={nextLocale}
      className="inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition hover:opacity-70"
      style={{ borderColor: "var(--border-soft)", color: "var(--on-surface)" }}
    >
      {compact ? nextLocale.toUpperCase() : `${locale.toUpperCase()} / ${nextLocale.toUpperCase()}`}
    </Link>
  );
}
