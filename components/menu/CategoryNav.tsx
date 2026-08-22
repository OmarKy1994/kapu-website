"use client";

import type { Locale } from "@/lib/i18n";
import type { MenuCategory } from "@/lib/types";

/**
 * Sticky, horizontally-scrollable jump nav for mobile menu reading — not a
 * filter or search, just anchors to the categories that already exist below.
 */
export default function CategoryNav({
  categories,
  locale,
  label,
}: {
  categories: MenuCategory[];
  locale: Locale;
  label: string;
}) {
  return (
    <nav
      aria-label={label}
      className="sticky top-[57px] z-30 -mx-5 overflow-x-auto border-b px-5 py-3 md:hidden"
      style={{
        borderColor: "var(--border-soft)",
        backgroundColor: "color-mix(in srgb, var(--surface) 95%, transparent)",
        backdropFilter: "blur(6px)",
      }}
    >
      <ul className="flex gap-5 whitespace-nowrap text-xs font-semibold uppercase tracking-wider">
        {categories.map((cat) => (
          <li key={cat.id}>
            <a href={`#${cat.id}`} className="opacity-70 hover:opacity-100">
              {cat.name[locale]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
