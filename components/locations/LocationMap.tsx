import type { SiteDict } from "@/lib/content";
import type { LocationData } from "@/lib/types";

/**
 * PHASE I — Section 8. A real embedded Google Map for each location, built
 * entirely from the location's already-verified `mapsQuery` address string
 * (e.g. "KAPU, Zakinthou 9, Athens 11361, Greece") — never invented
 * coordinates. This is Google's no-API-key embed endpoint
 * (`google.com/maps?q=<query>&output=embed`): it geocodes the address
 * query itself, so it works with only what content/locations/*.json
 * already had (`coordinates` stays `null` for both locations — see
 * `coordinatesNote` in lib/types.ts — until someone verifies real lat/lng,
 * at which point this could switch to a plain query-string swap, no
 * component change needed).
 *
 * A plain <a> to the full Google Maps search sits underneath the frame —
 * useful on its own (opens the native Maps app on mobile) and as a
 * fallback if the iframe embed is ever blocked by the visitor's browser.
 */
export default function LocationMap({ location, dict }: { location: LocationData; dict: SiteDict }) {
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(location.mapsQuery)}&output=embed`;
  const searchHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapsQuery)}`;

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">{dict.locations.mapLabel}</h2>
      <div
        className="relative mt-3 aspect-[4/3] w-full overflow-hidden border md:aspect-[16/10]"
        style={{ borderColor: "var(--border-soft)", borderRadius: "14px" }}
      >
        <iframe
          src={embedSrc}
          title={`${dict.locations.mapLabel} — ${location.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <a
        href={searchHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-xs font-semibold uppercase tracking-wide opacity-60 hover:opacity-100"
      >
        {dict.locations.openInGoogleMaps} ↗
      </a>
    </div>
  );
}
