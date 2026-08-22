/**
 * KAPU's real production domain was not supplied anywhere in the brief,
 * research, or asset folder — this is a placeholder, not a verified fact.
 * Update SITE_URL once the client confirms the live domain; everything
 * that depends on an absolute URL (sitemap, robots, canonical/OG tags,
 * JSON-LD) reads from this single constant.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kapu.gr";
