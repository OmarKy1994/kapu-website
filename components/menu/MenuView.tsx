"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { SiteDict } from "@/lib/content";
import type { MenuData } from "@/lib/types";
import MenuModeSwitch from "@/components/menu/MenuModeSwitch";
import CategoryNav from "@/components/menu/CategoryNav";
import MenuItemRow from "@/components/menu/MenuItemRow";
import WobbleDivider from "@/components/motifs/WobbleDivider";
import Bougainvillea from "@/components/motifs/Bougainvillea";

function MenuViewInner({
  cafe,
  bar,
  locale,
  dict,
}: {
  cafe: MenuData;
  bar: MenuData;
  locale: Locale;
  dict: SiteDict;
}) {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "bar" ? "bar" : "cafe";
  const [mode, setMode] = useState<"cafe" | "bar">(initialMode);

  const active = mode === "cafe" ? cafe : bar;
  const sourceNote = mode === "cafe" ? dict.menu.sourceNoteCafe : dict.menu.sourceNoteBar;

  return (
    <div data-mode={mode === "bar" ? "night" : "day"} className="relative overflow-hidden">
      {/* Phase F: the real PDF (pages 4–6) uses a large diagonal floral pair
          on every white-panel spread, not a single small corner spray — this
          is the page that most deserves that treatment, since the panel
          below is the digital stand-in for those printed pages. A second,
          smaller pair reappears further down the panel on long category
          lists, echoing how the print menu never leaves a full page bare.
          Phase H: this pair is positioned `inset:0` on the OUTER full-width
          wrapper, while the eyebrow/heading text sits in an INNER max-w-3xl
          column — on desktop that column doesn't reach the wrapper's own
          corner, so there's no contact, but on mobile the column's edges and
          the wrapper's edges are nearly the same, and the now much-larger,
          zoomed corner crop landed directly behind the small eyebrow
          caption, hurting legibility. Desktop's opacity stays as designed;
          mobile drops it further specifically to fix that overlap without
          losing the branch's presence entirely. */}
      <Bougainvillea
        variant="pair"
        diagonal="tl-br"
        tone={mode === "bar" ? "dim" : "natural"}
        width={900}
        className="opacity-20 md:opacity-40"
      />
      <div className="relative mx-auto max-w-3xl px-5 pb-10 pt-8 md:pb-16 md:pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">{dict.menu.sub}</p>
        {/* PHASE N — Section 4: Majesty removed from the "Menu" heading
            (explicit brief target). */}
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: "var(--on-surface)" }}>
          {dict.menu.heading}
        </h1>
        <WobbleDivider className="my-6 max-w-[120px]" color="var(--accent)" />

        <MenuModeSwitch
          mode={mode}
          onChange={setMode}
          cafeLabel={dict.menu.modeCafe}
          barLabel={dict.menu.modeBar}
          switchLabel={dict.menu.modeSwitchLabel}
        />

        <p className="mt-4 text-xs italic opacity-50">{sourceNote}</p>
      </div>

      <CategoryNav categories={active.categories} locale={locale} label={dict.menu.jumpToCategory} />

      <div className="kapu-panel relative mx-auto mb-16 max-w-3xl overflow-hidden px-5 pb-8 pt-2 md:px-10">
        {/* Second floral moment, roughly mid-panel on long category lists —
            the printed menu never leaves a full page of white panel bare. */}
        <Bougainvillea
          variant="pair"
          diagonal="tr-bl"
          tone={mode === "bar" ? "dim" : "natural"}
          width={760}
          className="opacity-15 md:opacity-30"
          style={{ top: "48%" }}
        />
        {active.categories.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-32 border-t py-10" style={{ borderColor: "var(--border-soft)" }}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl md:text-3xl" style={{ color: "var(--accent)" }}>
                {category.name[locale]}
              </h2>
              {category.adultsOnly && (
                <span className="text-xs font-semibold uppercase tracking-wider opacity-50">
                  {dict.menu.adultsOnlyTag}
                </span>
              )}
            </div>

            {category.description && (
              <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--brand)" }}>
                {category.description[locale]}
              </p>
            )}
            {category.unverified && (
              <p className="mt-2 max-w-xl text-xs italic opacity-50">{sourceNote}</p>
            )}

            {category.items && (
              <ul className="mt-4 divide-y" style={{ borderColor: "var(--border-soft)" }}>
                {category.items.map((item) => (
                  <MenuItemRow key={item.id} item={item} locale={locale} dict={dict} />
                ))}
              </ul>
            )}

            {category.subcategories?.map((sub) => (
              <div key={sub.id} className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide opacity-70">
                  {sub.name[locale]}
                  {sub.price && (
                    <span className="ml-2 font-normal normal-case opacity-70">
                      €{sub.price}
                      {sub.unit ? ` / ${sub.unit[locale]}` : ""}
                    </span>
                  )}
                </h3>
                <ul className="mt-2 divide-y" style={{ borderColor: "var(--border-soft)" }}>
                  {sub.items.map((item) => (
                    <MenuItemRow key={item.id} item={item} locale={locale} dict={dict} />
                  ))}
                </ul>
              </div>
            ))}

            {category.notes && <p className="mt-4 text-[11px] italic opacity-50">{category.notes[locale]}</p>}
          </section>
        ))}
      </div>
    </div>
  );
}

export default function MenuView(props: { cafe: MenuData; bar: MenuData; locale: Locale; dict: SiteDict }) {
  return (
    <Suspense fallback={null}>
      <MenuViewInner {...props} />
    </Suspense>
  );
}