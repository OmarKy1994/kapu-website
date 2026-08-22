import type { Locale } from "@/lib/i18n";
import type { SiteDict } from "@/lib/content";
import type { LocationData } from "@/lib/types";
import OrderButtons from "@/components/order/OrderButtons";
import LocationMap from "@/components/locations/LocationMap";

/**
 * The address/phone/hours/directions/order/social block used on each
 * individual location page. Directions stay address-based (mapsQuery) since
 * no verified lat/lng exists for either location — see coordinatesNote.
 */
export default function LocationInfo({
  location,
  locale,
  dict,
}: {
  location: LocationData;
  locale: Locale;
  dict: SiteDict;
}) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapsQuery)}`;

  const barNote =
    location.barProgram === "unconfirmed" || location.barProgram === false
      ? location.barProgramNote[locale]
      : null;

  return (
    // Phase L fix: confirmed live on the Netlify Kypseli page — this grid's
    // default align-items (stretch) forced the right column (Order from
    // here / Follow this KAPU, ~150px of real content) to stretch to match
    // the left column's height (address/hours/buttons/map, which runs much
    // taller because of the embedded map). That left a ~400px blank void at
    // the bottom of the right column, read as the reported gap around the
    // location/map area. `items-start` aligns each column to its own
    // content height instead of the tallest sibling; on mobile the grid is
    // already a single stacked column, so this has no effect there.
    <div className="kapu-panel grid items-start gap-10 p-6 md:grid-cols-2 md:p-10">
      <div>
        <dl className="space-y-5 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
              {dict.locations.addressLabel}
            </dt>
            <dd className="mt-1 text-base">{location.address}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
              {dict.locations.phoneLabel}
            </dt>
            <dd className="mt-1 text-base">
              <a href={`tel:${location.phone.replace(/\s+/g, "")}`} className="hover:opacity-70">
                {location.phoneDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
              {dict.locations.hoursLabel}
            </dt>
            {/* PHASE N — Section 4: not in the brief's literal location-name
                list, but the same reasoning applies directly — hours are
                functional data a visitor needs to read quickly and trust,
                not editorial copy, so it gets the same restrained weight
                instead of the display script. Flagged in the Phase N report
                as an extension beyond the brief's literal examples. */}
            <dd className="mt-1 text-2xl font-semibold tracking-tight" style={{ color: "var(--brand)" }}>
              {location.hours[locale]}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="kapu-button inline-flex min-h-[44px] items-center border-2 px-5 py-2.5 text-sm font-semibold tracking-wide hover:opacity-70"
            style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
          >
            {dict.locations.directionsCta}
          </a>
          <a
            href={`tel:${location.phone.replace(/\s+/g, "")}`}
            className="kapu-button inline-flex min-h-[44px] items-center border-2 px-5 py-2.5 text-sm font-semibold tracking-wide hover:opacity-70"
            style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
          >
            {dict.locations.callCta}
          </a>
        </div>

        {barNote && (
          <p className="mt-6 max-w-md text-xs italic opacity-60">{barNote}</p>
        )}

        <div className="mt-8">
          <LocationMap location={location} dict={dict} />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
          {dict.locations.orderHeading}
        </h2>
        <div className="mt-3">
          <OrderButtons location={location} dict={dict} />
        </div>

        {(location.social.instagram || location.social.facebook) && (
          <>
            <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
              {dict.locations.socialHeading}
            </h2>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              {location.social.instagram && (
                <a href={location.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                  Instagram
                </a>
              )}
              {location.social.facebook && (
                <a href={location.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                  Facebook
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}