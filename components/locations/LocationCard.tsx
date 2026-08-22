import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { SiteDict } from "@/lib/content";
import type { LocationData } from "@/lib/types";
import Placeholder from "@/components/placeholders/Placeholder";
import WobbleDivider from "@/components/motifs/WobbleDivider";

/**
 * Editorial, not a bordered "listing card" — a photo, a hand-drawn divider,
 * then open text, the way the PDF frames a location rather than boxing it.
 */
export default function LocationCard({
  location,
  locale,
  dict,
  className = "",
}: {
  location: LocationData;
  locale: Locale;
  dict: SiteDict;
  className?: string;
}) {
  const heroPlaceholder = location.placeholders.find((p) => p.id.endsWith("-hero"));

  const barLabel =
    location.barProgram === true
      ? dict.locations.barProgramConfirmed
      : location.barProgram === "unconfirmed"
        ? dict.locations.barProgramUnconfirmed
        : dict.locations.barProgramNone;

  return (
    <Link href={`/${locale}/locations/${location.slug}`} className={`group block ${className}`}>
      {location.images.hero ? (
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src={location.images.hero}
            alt={location.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            style={{ objectFit: "cover" }}
            className="transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        heroPlaceholder && (
          <Placeholder
            subject={heroPlaceholder.subject}
            aspect="21/9"
            locale={locale}
            labelPrefix={dict.placeholder.labelPrefix}
            temporaryLabel={dict.placeholder.temporary}
            priority={heroPlaceholder.priority}
          />
        )
      )}
      <div className="pt-5">
        {/* PHASE N — Section 4: Majesty removed from location names. */}
        <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--accent)" }}>
          {location.name}
        </h2>
        <WobbleDivider className="my-3 max-w-[80px]" color="var(--border-soft)" />
        <p className="text-sm opacity-70">{location.neighborhood[locale]}</p>
        <p className="mt-3 text-sm">{location.hours[locale]}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider opacity-60">{barLabel}</p>
        <span
          className="mt-4 inline-block text-sm font-semibold underline decoration-2 underline-offset-4 group-hover:opacity-70"
          style={{ color: "var(--brand)", textDecorationColor: "var(--brand)" }}
        >
          {dict.locations.viewLocation}
        </span>
      </div>
    </Link>
  );
}