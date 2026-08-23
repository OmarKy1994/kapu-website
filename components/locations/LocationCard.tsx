import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { SiteDict } from "@/lib/content";
import type { LocationData } from "@/lib/types";
import Placeholder from "@/components/placeholders/Placeholder";
import WobbleDivider from "@/components/motifs/WobbleDivider";
import OrderButtons from "@/components/order/OrderButtons";

/**
 * Editorial, not a bordered "listing card" — a photo, a hand-drawn divider,
 * then open text, the way the PDF frames a location rather than boxing it.
 *
 * CRO fix: the whole card used to be a single <Link> wrapping every field,
 * so a visitor had to open the detail page just to find the address, call
 * the location, or get directions. Only the photo + name now link through
 * to the detail page (still useful — full hours context, map embed, social);
 * address, hours, directions, call and order are all real, directly
 * actionable elements right here on the card.
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
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapsQuery)}`;
  const telHref = `tel:${location.phone.replace(/\s+/g, "")}`;

  const barLabel =
    location.barProgram === true
      ? dict.locations.barProgramConfirmed
      : location.barProgram === "unconfirmed"
        ? dict.locations.barProgramUnconfirmed
        : dict.locations.barProgramNone;

  return (
    <div className={`group ${className}`}>
      <Link href={`/${locale}/locations/${location.slug}`} className="block">
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
            />
          )
        )}
      </Link>
      <div className="pt-5">
        <Link href={`/${locale}/locations/${location.slug}`} className="block w-fit">
          <h2
            className="text-2xl font-semibold tracking-tight group-hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            {location.name}
          </h2>
        </Link>
        <WobbleDivider className="my-3 max-w-[80px]" color="var(--border-soft)" />

        <p className="text-sm opacity-80">{location.address}</p>
        <p className="mt-2 text-base font-semibold" style={{ color: "var(--brand)" }}>
          {location.hours[locale]}
        </p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider opacity-60">{barLabel}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="kapu-button inline-flex min-h-[44px] items-center border-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide hover:opacity-70"
            style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
          >
            {dict.locations.directionsCta}
          </a>
          <a
            href={telHref}
            className="kapu-button inline-flex min-h-[44px] items-center border-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide hover:opacity-70"
            style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
          >
            {dict.locations.callCta}
          </a>
        </div>

        <div className="mt-3">
          <OrderButtons location={location} dict={dict} size="compact" />
        </div>

        <Link
          href={`/${locale}/locations/${location.slug}`}
          className="mt-4 inline-block text-sm font-semibold underline decoration-2 underline-offset-4 hover:opacity-70"
          style={{ color: "var(--brand)", textDecorationColor: "var(--brand)" }}
        >
          {dict.locations.viewLocation}
        </Link>
      </div>
    </div>
  );
}