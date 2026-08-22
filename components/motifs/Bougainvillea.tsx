import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * KAPU's real bougainvillea branch illustration (the same asset printed on
 * the official menu) — used only at threshold moments, never as tiled
 * wallpaper.
 *
 * PHASE F REBUILD: earlier versions zoomed a tight, centered, roughly-square
 * window into the source image for every placement. Because the source is
 * one long asymmetric branch — a bare stem entering low-left, a dense bloom
 * mass across the center-right two-thirds, thinning to sparse buds at the
 * far right tip — a centered square crop always lands on the same dense
 * cluster regardless of which "corner"/"crop" prop was passed, so every
 * instance looked like the same pink blob. That's what read as a sticker.
 *
 * This version reads a real slice of the branch — its stem, its bloom mass,
 * or a wide view — via a `focus`-driven object-position, and adds two
 * compositions taken directly from the printed PDF's own floral language:
 *
 *   "corner" — one large rectangular window (not a circle), bleeding out
 *              past the section edge.
 *   "pair"   — two corner instances at diagonally opposite corners of the
 *              same panel, one showing the stem side and one the bloom
 *              side, so together they read as one branch crossing the
 *              panel — matches PDF pages 4–6 exactly.
 *   "full"   — a wide, low band across the branch's own bloom region, for
 *              the one true hero-scale floral moment on a page (see the
 *              homepage day→night transition).
 *
 * PHASE H: "corner"/"pair" no longer lock their crop window to the source
 * image's own ~1.6:1 proportions — see CROP_RATIO and FOCUS_ZOOM below for
 * why (that was the actual cause of visible crop edges: a same-shaped box
 * gives object-fit:cover nothing to crop, so the whole branch always
 * rendered inside it, and bleed/translate then clipped straight through the
 * silhouette instead of through open space). Now every instance shows a
 * genuinely cropped, magnified fragment of the branch instead.
 *
 * Fewer, larger, more deliberate placements — 2–3 per page, not seven.
 */

const SOURCE_RATIO = 1800 / 1118;

// PHASE H: the crop window's OWN aspect ratio — deliberately different from
// SOURCE_RATIO. Root cause of the "cropped edges still visible" complaint:
// every corner/pair instance's container had `aspectRatio: SOURCE_RATIO`,
// which — combined with `object-fit: cover` — meant cover had nothing to
// crop. A box shaped exactly like the source always shows the ENTIRE
// branch, just scaled down; FOCUS_POSITION's object-position values were
// silently inert the whole time. Phase G's clamp() fix made these boxes
// genuinely large and translated much of each box off-canvas, but because
// the box still contained the WHOLE tapering branch shape, the sliver that
// stayed on-screen got cut off exactly where the box's own straight edge
// happened to fall — frequently mid-bloom, a hard rectangular cut through
// real content. A crop window narrower than the source forces real
// cropping (object-position finally does something), so what's on-screen
// is always a magnified, genuinely-cropped fragment — it reads as a much
// bigger branch continuing past the frame, never the small full silhouette
// that made every instance look like the same sticker.
const CROP_RATIO = 1.15;

// PHASE H: an additional zoom applied to the image itself (not the crop
// window), scaled up around its own center after object-fit/object-position
// has already picked the crop. CROP_RATIO alone only crops one axis (cover
// crops width, leaves height matching exactly — the source's own vertical
// extent already reaches close to top/bottom, so there's no headroom to
// crop vertically without this). The zoom pushes the image outward on
// every side inside the container's own overflow-hidden, so the remaining
// visible fragment never shows the source's own top/bottom canvas edge
// either — it's cropped out of frame on all four sides, not just left/right.
const FOCUS_ZOOM = 1.4;

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type Focus = "stem" | "center" | "bloom" | "whole";

// object-position values tuned against the actual source image: the stem
// enters at the far left, the bloom mass sits center-to-right, the buds
// thin out at the far right tip.
const FOCUS_POSITION: Record<Focus, string> = {
  stem: "6% 60%",
  center: "44% 40%",
  bloom: "88% 32%",
  whole: "50% 50%",
};

const CORNER_STYLE: Record<Corner, CSSProperties> = {
  "top-left": { top: 0, left: 0 },
  "top-right": { top: 0, right: 0 },
  "bottom-left": { bottom: 0, left: 0 },
  "bottom-right": { bottom: 0, right: 0 },
};

// PHASE N — Section 5C/6 fix. Live-rendered both the footer (5C, opacity-55
// — the box edge was plainly visible) and the menu page (Section 6,
// opacity-15/20/30/40 — same hard rectangle, just faint enough at that low
// opacity to hide it) before touching anything. Root cause confirmed by
// temporarily forcing opacity:1 on the live deployed page: the crop window
// itself (overflow-hidden + a same-shaped rectangle, by Phase H's own
// design — see CROP_RATIO/FOCUS_ZOOM above) always ends in a hard cut where
// it does NOT bleed off the section, because the crop intentionally lands
// mid-branch, not on empty transparent margin. That's true regardless of
// corner or variant, so it's fixed once, here, for every "corner"/"pair"
// instance — not per call site. A radial-gradient CSS mask anchored at the
// corner's own OUTWARD point (the one already bleeding off-canvas, so
// fading it further costs nothing) tapers the box to transparent toward
// its INWARD point instead of cutting there — the existing crop/scale/
// position math is untouched, this only softens how the box's own edge
// meets the page. Ellipse (not circle) so the taper matches this box's own
// CROP_RATIO instead of assuming a square.
const MASK_ANCHOR: Record<Corner, string> = {
  "top-left": "0% 0%",
  "top-right": "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right": "100% 100%",
};

function cornerMask(corner: Corner): string {
  return `radial-gradient(ellipse at ${MASK_ANCHOR[corner]}, black 55%, transparent 100%)`;
}

function Branch({
  corner,
  focus = "center",
  width = 340,
  bleed = 0.4,
  tone = "natural",
  flip = false,
  fit = "cover",
  opacity = 1,
  className = "",
}: {
  corner: Corner;
  focus?: Focus;
  width?: number;
  bleed?: number;
  tone?: "natural" | "dim";
  flip?: boolean;
  fit?: "cover" | "contain";
  opacity?: number;
  className?: string;
}) {
  const filter = tone === "dim" ? "brightness(0.58) saturate(0.8)" : "none";

  const bleedX = corner.includes("left") ? -bleed : bleed;
  const bleedY = corner.includes("top") ? -bleed : bleed;
  const translate = `translate(${bleedX * 100}%, ${bleedY * 100}%)`;
  const mirror = flip ? " scaleX(-1)" : "";

  // Phase G: the Phase F clamp() topped out at a flat `width`px on anything
  // wider than ~2.4x that value (42vw only ever "wins" the clamp on narrow
  // viewports), which is exactly why the branch still read as a small fixed
  // sticker rectangle on real desktop/tablet sections regardless of how
  // large the section itself was — increasing a call site's `width` prop
  // was the only lever, and even then the crop's own container edges were
  // never far enough past the section edge to disappear. Rebalanced so
  // desktop actually reaches the full `width` (a much larger preferred vw
  // term keeps growing with the section instead of hitting its cap
  // immediately) while mobile stays a deliberate corner accent rather than
  // covering most of the screen: a small proportional floor (0.28×width,
  // versus Phase F's 0.5×) means the fluid 50vw term — not the floor — is
  // what actually governs phone-width renders, landing around half the
  // viewport instead of the ~90%+ the old floor forced once `width` itself
  // grew this much. A bigger default bleed (translate) then pushes more of
  // that box past the corner into the gutter/off-canvas at every size — the
  // goal throughout is that a viewer sees flowers/branch bleeding off the
  // edge, not a rectangle's corner sitting inside the section.
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none overflow-hidden ${className}`}
      style={{
        ...CORNER_STYLE[corner],
        width: `clamp(${Math.round(width * 0.28)}px, 50vw, ${width}px)`,
        // Phase H: CROP_RATIO, not SOURCE_RATIO — see the constant's own
        // comment above. This is the actual fix for visible crop edges.
        aspectRatio: `${CROP_RATIO}`,
        opacity,
        transform: translate + mirror,
        // PHASE N — see cornerMask's comment: feathers the box's inward
        // edge instead of cutting it.
        maskImage: cornerMask(corner),
        WebkitMaskImage: cornerMask(corner),
      }}
    >
      <Image
        src="/images/logo/bougainvillea-source.png"
        alt=""
        fill
        sizes={`${width}px`}
        style={{
          objectFit: fit,
          objectPosition: FOCUS_POSITION[focus],
          filter,
          // Phase H: zoom the image itself beyond its cover-fit crop so the
          // visible fragment is cropped out of frame on every side, not just
          // the one axis object-fit:cover crops on its own — see FOCUS_ZOOM.
          transform: fit === "cover" ? `scale(${FOCUS_ZOOM})` : undefined,
        }}
      />
    </span>
  );
}

export default function Bougainvillea({
  variant = "corner",
  corner = "top-left",
  diagonal = "tl-br",
  focus = "center",
  tone = "natural",
  width = 340,
  fullHeight = 160,
  className = "",
  style,
}: {
  /** "corner" — one large rectangular window at one corner.
   *  "pair"   — two corners, diagonally opposite, reading as one branch.
   *  "full"   — the whole uncropped branch, wide and low. */
  variant?: "corner" | "pair" | "full";
  corner?: Corner;
  /** Which diagonal the "pair" variant uses. */
  diagonal?: "tl-br" | "tr-bl";
  focus?: Focus;
  tone?: "natural" | "dim";
  width?: number;
  /** Height of the "full" variant's bounding band. */
  fullHeight?: number;
  className?: string;
  /** Extra positioning overrides on the root element — e.g. placing a
   *  "pair" instance mid-way down a tall scrolling panel instead of at its
   *  corners. Merged after the variant's own base styles. */
  style?: CSSProperties;
}) {
  if (variant === "full") {
    // object-fit: contain inside a wide-but-short band just centers a small
    // fraction of the image (the band's aspect ratio is far wider than the
    // source's own ~1.6:1), leaving most of the width empty. Cover, with a
    // vertical focus on the branch's own bloom band, is what actually makes
    // the branch read edge-to-edge — the "wide and low" effect the hero
    // transition wants, even though it means the far top/bottom of the
    // source get cropped (its horizontal sprawl is the point here, not its
    // full vertical extent).
    return (
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 select-none ${className}`}
        style={{ height: fullHeight, ...style }}
      >
        <Image
          src="/images/logo/bougainvillea-source.png"
          alt=""
          fill
          loading="eager"
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "50% 42%",
            filter: tone === "dim" ? "brightness(0.58) saturate(0.8)" : "none",
            // Phase H: a light zoom, same reasoning as Branch's FOCUS_ZOOM —
            // pushes the source's own top/bottom canvas edge further out of
            // frame so a taller band (see the homepage transition's bumped
            // fullHeight) doesn't reveal it.
            transform: "scale(1.15)",
          }}
        />
      </span>
    );
  }

  if (variant === "pair") {
    const [first, second]: [Corner, Corner] = diagonal === "tl-br" ? ["top-left", "bottom-right"] : ["top-right", "bottom-left"];
    const flip = diagonal === "tr-bl";
    // Default fills the whole positioned ancestor (corners at its true
    // corners); `style` can override to a shorter band (e.g. a fixed height
    // anchored partway down a tall scrolling panel) for a mid-page moment.
    // Phase H: band height now derives from CROP_RATIO (each Branch's own
    // container aspect), not SOURCE_RATIO — matches the actual box shape
    // since Phase H decoupled the two.
    const bandHeight = Math.round(width / CROP_RATIO) + 40;
    const base: CSSProperties = style ? { left: 0, right: 0, height: bandHeight } : { inset: 0 };
    return (
      <span className={`pointer-events-none absolute select-none ${className}`} style={{ ...base, ...style }}>
        <Branch corner={first} focus="stem" width={width} bleed={0.4} tone={tone} flip={flip} />
        <Branch corner={second} focus="bloom" width={Math.round(width * 0.72)} bleed={0.4} tone={tone} flip={flip} opacity={0.92} />
      </span>
    );
  }

  return <Branch corner={corner} focus={focus} width={width} tone={tone} className={className} />;
}