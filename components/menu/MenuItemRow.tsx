import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { SiteDict } from "@/lib/content";
import type { MenuItem } from "@/lib/types";

const TAG_KEY: Record<string, string> = {
  popular: "popularTag",
  vegan: "veganTag",
  "18+": "adultsOnlyTag",
};

/**
 * Editorial menu row. Photography stays selective and intentional — most
 * items are text-only, exactly like the real printed menu; a small square
 * frame only appears for the handful of items with a genuinely matched,
 * currently-existing photograph (`item.image`), never as a placeholder.
 */
export default function MenuItemRow({
  item,
  locale,
  dict,
}: {
  item: MenuItem;
  locale: Locale;
  dict: SiteDict;
}) {
  return (
    <li className="py-3">
      <div className="flex items-start gap-4">
        {item.image && (
          <div
            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm md:h-16 md:w-16"
            style={{ backgroundColor: "var(--kapu-charcoal)" }}
          >
            <Image
              src={item.image}
              alt={item.name[locale]}
              fill
              sizes="64px"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline">
            <p className="min-w-0 shrink-0 text-sm font-medium leading-snug">
              {item.name[locale]}
              {item.adultsOnly && (
                <span
                  className="ml-2 inline-block rounded-full border px-1.5 py-0.5 align-middle text-[10px] font-semibold"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  {dict.menu.adultsOnlyTag}
                </span>
              )}
            </p>
            {item.price && <span className="kapu-leader" aria-hidden="true" />}
            {item.price && (
              <span
                className="shrink-0 whitespace-nowrap pt-0.5 text-sm font-semibold tabular-nums"
                style={{ color: "var(--brand)" }}
              >
                €{item.price}
              </span>
            )}
          </div>
          {/* Teal, not muted charcoal: the real PDF colors every item
              description and modifier note in the same teal as its prices, not
              a faded gray — descriptions are secondary in size, not in color. */}
          {item.description && (
            <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--brand)" }}>
              {item.description[locale]}
            </p>
          )}
          {(item.tags?.length || item.abv) && (
            <p className="mt-1 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide opacity-50">
              {item.tags
                ?.filter((t) => t !== "18+")
                .map((tag) => (
                  <span key={tag}>{dict.menu[TAG_KEY[tag]] ?? tag}</span>
                ))}
              {item.abv && (
                <span>
                  {dict.menu.abvLabel} {item.abv}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
