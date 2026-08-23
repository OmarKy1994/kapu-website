"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
 * CRO/UX fix (menu image interaction): the small 64px thumbnail is now a
 * real trigger for a full-size lightbox, not a dead-end crop. Built as a
 * plain per-row client component (no shared modal context needed — each
 * row owns its own open/closed state) so it works wherever MenuItemRow is
 * rendered without extra wiring at the call site.
 *
 * Accessibility: role="dialog" + aria-modal, Escape closes, clicking the
 * backdrop closes, an explicit X button closes, focus moves to the close
 * button on open and returns to the thumbnail that opened it on close,
 * background scroll is locked while open (same pattern already used by
 * OrderModalProvider elsewhere in this app). Uses the same source file the
 * thumbnail does — the existing images are already the highest-resolution
 * copies in the project — just rendered large instead of at a 64px crop.
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setLightboxOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen, close]);

  return (
    <li className="py-3">
      <div className="flex items-start gap-4">
        {item.image && (
          <>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`${dict.menu.viewLarger}: ${item.name[locale]}`}
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm transition hover:opacity-85 md:h-16 md:w-16"
              style={{ backgroundColor: "var(--kapu-charcoal)" }}
            >
              <Image
                src={item.image}
                alt={item.name[locale]}
                fill
                sizes="64px"
                style={{ objectFit: "cover" }}
              />
            </button>

            {lightboxOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={item.name[locale]}
                className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10"
                style={{ backgroundColor: "color-mix(in srgb, var(--kapu-charcoal) 88%, transparent)" }}
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) close();
                }}
              >
                <div className="relative flex max-h-full w-full max-w-2xl flex-col items-center">
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label={dict.menu.closeImage}
                    className="absolute -top-11 right-0 flex h-10 w-10 items-center justify-center rounded-full transition hover:opacity-80 md:-right-2 md:-top-12"
                    style={{ backgroundColor: "var(--kapu-cream)", minWidth: "40px", minHeight: "40px" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 15 15" aria-hidden="true">
                      <path d="M1 1L14 14M14 1L1 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="relative aspect-square w-full overflow-hidden rounded-sm md:aspect-[4/3]">
                    <Image
                      src={item.image}
                      alt={item.name[locale]}
                      fill
                      sizes="(min-width: 768px) 640px, 100vw"
                      quality={92}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <p className="mt-4 text-center text-sm font-medium text-white">{item.name[locale]}</p>
                </div>
              </div>
            )}
          </>
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
