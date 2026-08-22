# Phase L — Live Fixes, Responsive QA & Deployment Workflow

Status: **Part 1 complete and delivered to the project folder. Parts 2–5 in progress — see the "Deployment blocker" section below before reading further.** This document will be updated again once the site is redeployed and live regression verification (Part 3) can actually happen.

## 1. Changed

| File | Change | Why |
|---|---|---|
| `app/[locale]/page.tsx` | Hero image swapped from `kapu-hero-sign-handheld.jpg` to `kapu-staff-team-exterior.jpg` | Confirmed blurred on the live Netlify render — a source-photo focus miss, not an optimization issue. See §2. |
| `app/[locale]/page.tsx` | Removed `className="relative"` from the `Bougainvillea variant="full"` instance in the day→night transition band | That prop collided with the component's own `absolute inset-x-0` base class; Tailwind's cascade order made `.relative` win, collapsing the branch image's container to zero visible height while its sibling spacer div still reserved 340px — a blank band where the floral moment should render. |
| `app/[locale]/page.tsx` | Corrected the night/bar section's comment and `alt` text | Previously claimed "the lit KAPU sign visible in the background," which Phase K's live inspection found untrue — no legible signage in that crop. Reworded to "a warm lantern glowing behind them." |
| `app/[locale]/menu/page.tsx`, `order/page.tsx`, `story/page.tsx`, `locations/page.tsx`, `locations/[slug]/page.tsx` | Removed the manual `— ${dict.meta.titleSuffix}` from each page's `generateMetadata` title | Root cause of the duplicated titles — see §3. |
| `content/locations/kypseli.json`, `content/locations/kallithea.json` | Removed the unused `images.interior` field | Dead data — see §4. |
| `lib/types.ts` | Removed `interior` from `LocationData["images"]` | Matches the data model to the trimmed content files. |
| `components/locations/LocationInfo.tsx` | Added `items-start` to the location-info panel's grid | Fixes a confirmed live whitespace gap on the Kypseli/Kallithea location pages — see §5. |

TypeScript: `npx tsc --noEmit` run against the live project on disk after all edits were committed — **passes with no errors.**

## 2. Photography decision

**Source file:** `assets/photography/brand-lifestyle/kapu-staff-team-exterior.jpg` (copied into `public/images/hero/`, MD5-verified byte-identical to the source: `3ade57ce68a29a3ab547c033dff4dc8c`).

**Method:** Rather than trust filenames, every landscape-orientation, ≥1400px-wide photo across `brand-lifestyle/`, `exteriors/`, and `interiors/` was scored with an objective sharpness proxy (grayscale → edge-detection filter → variance of the edge map — a Laplacian-variance-style measure). The discarded hero (`kapu-hero-sign-handheld.jpg` / `kapu-cup-sign-handheld.jpg`, 1080×1350) scored **381** — the single lowest score of every qualifying candidate in the pool.

**Why this file, not the top scorer:** The two objectively sharpest candidates (`kapu-cup-meteora-travel.jpg` at ~4026, `kapu-cup-mountain-landscape.jpg`) were rejected on inspection — both are customer travel photos shot hundreds of kilometers from Athens (Meteora; a snow resort), which would misrepresent the hero as being about a scenic destination rather than KAPU's actual Kypseli/Kallithea shops. `kapu-staff-team-exterior.jpg` scored **1298** (~3.4× sharper than the discarded image), shows the real storefront with the real team in the doorway — genuine KAPU identity — and pairs naturally with the "Come through, let's catch up" copy beneath it.

**Crop/typography:** Layout, kicker, headline, translation, and buttons were left untouched. `FullBleedHero` already applies `object-position: 50% 18%` and a bottom-anchored scrim; both were left as-is since Phase K did not flag a crop or legibility problem with this component, only the source image's sharpness. **This still needs to be judged against the actual rendered crop on the next live deploy** — see §6.

## 3. Metadata fix — root cause

`app/[locale]/layout.tsx`'s `generateMetadata` defines `title: { default: dict.meta.siteName, template: "%s — " + dict.meta.titleSuffix }`. Next.js applies a layout's `title.template` automatically to any **nested** route segment's title — but not to a title set by a page in the *same* segment as the layout. That's exactly why the homepage (`app/[locale]/page.tsx`, same segment as the layout) was never affected, while `/menu`, `/order`, `/story`, `/locations`, and `/locations/[slug]` (each a separate nested segment) were double-suffixed: those five pages were *also* manually appending `— ${dict.meta.titleSuffix}` to their own titles, so the layout template added the suffix a second time on top of it.

The fix is architectural, not a per-page patch: each of the five pages now sets only its own heading (`dict.menu.heading`, `dict.order.heading`, `dict.story.heading`, `dict.locations.heading`, `location.name`), sourced from the existing `content/site/{en,el}.json` dictionaries exactly as before — no hardcoded English strings were introduced. The layout's template supplies the suffix exactly once, on every route, in both locales.

**Still needs live verification** (browser titles, both locales, on the next deploy — see §6): homepage, menu, order, story, locations, Kypseli, Kallithea.

## 4. Location architecture — `images.interior`

`content/locations/kypseli.json` had an `images.interior` field pointing at `/images/locations/kypseli-interior.jpg`; `app/[locale]/locations/[slug]/page.tsx` was confirmed (full read, plus a codebase-wide grep for `interior`) to have no code path that ever reads it — only `images.hero` (21:9 band) and `images.exterior` (3:2 secondary frame) are rendered anywhere.

**Decision: Option B — removed the field**, rather than building a third rendering slot. Two reasons:

1. Neither location's `placeholders` array (which drives the fallback UI when a real photo is missing) has ever included a third "interior" placeholder — only `hero` and `exterior` exist for both Kypseli and Kallithea. The page was never architected for three photographic moments; `interior` was leftover data that never got wired to a template slot.
2. The actual `kypseli-interior.jpg` file was inspected directly (not just the filename) and turned out to be a near-duplicate of the hero photo — same mural, same counter, just a slightly wider framing distance. Adding it as a third "moment" wouldn't have read as editorial; it would have looked redundant.

The unused `kypseli-interior.jpg` file itself was left on disk untouched — this only removed the dead data pointer, not the photography. Kallithea's `images` object (already all-`null`, placeholders-only) was trimmed for consistency using the same reasoning.

## 5. Whitespace gaps

**Homepage (Beat 4, "By day" → "From the counter"):** see §1/Changed — the `Bougainvillea` `className="relative"` collision. Root-caused via component source reading, not guesswork: a `<span>` is inline by default and ignores an explicit `height` style once its `position` flips away from `absolute` (which is what supplies its sizing behavior as a `next/image fill` ancestor). Needs live re-screenshot to confirm — see §6.

**Kypseli/Kallithea location pages (location/map area):** This one *was* verified directly against the live Netlify page before writing any fix, not diagnosed from source alone. Using injected JavaScript to measure the location-info panel's DOM at 1920px width, the panel's two-column grid (`grid md:grid-cols-2`) was confirmed to default to `align-items: stretch`, which forced the "Order from here / Follow this KAPU" column (~150px of real content) to stretch to match the "address/hours/map" column's height (565px, driven by the embedded Google Map). That left a measured **413px blank void** at the bottom of the shorter column — a live-screenshot-confirmed gray gap, not an estimate. Fix: `items-start` on the grid, which aligns each column to its own content height. Single-column on mobile, so no effect there. **Needs a live re-screenshot after redeploy to confirm the fix, ideally on both Kypseli (has real photos) and Kallithea (all-placeholder) to catch any placeholder-driven height difference.**

## 6. Responsive QA

**Not yet performed this phase.** Genuine breakpoint testing (360/390×844/430/768/1440/1920, both locales, the ten specified routes) requires either the current live site or — preferably — the redeployed one, since several of the checks specified (hero crop, Kypseli gap, metadata titles) are exactly the things this phase just changed. Rather than run QA against a site that's about to change, or claim breakpoints were "tested" against source code, this section is being left honestly blank until the deployment question below is resolved. See the note in the covering chat message for the two ways this can proceed.

## 7. Deployment

**Not yet redeployed.** See below.

### Deployment blocker (read this before assuming Part 3 is done)

There is currently no way for me to trigger a new Netlify deployment myself:

- The project has no Git repository (confirmed — no `.git` directory anywhere in `KAPU_Website_2026` or its `website/kapu-website` subfolder), so there's no push-to-deploy path yet.
- The existing deployment was created by manually dragging the project folder onto Netlify Drop, which requires a native OS file-picker dialog. Browser automation tools are DOM-scoped and cannot drive that dialog, and Terminal/Command Prompt access on the real machine is click-only (no typing), so I can't script it from there either.
- The Linux VM bridge (`device_bash`) that I use for read-only inspection and file copies has a proxy-restricted network — `api.netlify.com`, `app.netlify.com`, and `registry.npmjs.org` (needed to even install the Netlify CLI) all return `403 blocked-by-allowlist` from that environment. So there's no command-line path either.

**All ten Phase L Part 1 files have been written back to the actual project folder** (confirmed via direct read-back on the device, TypeScript passes against the live-on-disk project), so the fix is ready to ship — it just needs an actual deploy action, which needs to come from you.

## 8. GitHub repository (Part 4)

Checked via `git remote -v` / `.git` directory presence at every level from the `KAPU_Website_2026` root down through `website/kapu-website` — **no local Git repository exists.** I have no other legitimate way to check whether a GitHub repository already exists for this project (no authenticated `gh` CLI session, and I was instructed not to guess or search on your behalf) — if one already exists under your GitHub account, you'd know better than I can verify.

A `.gitignore` already exists in `website/kapu-website/.gitignore` and is already appropriate for this Next.js project (ignores `node_modules`, `.next/`, build output, `.env*`, `*.tsbuildinfo`, etc.) — no changes needed there.

**Recommendation (not yet executed — needs your explicit go-ahead):**
1. `git init` inside `website/kapu-website/`.
2. Commit the current, now-fixed state as the first commit (the existing `.gitignore` is already correct for this).
3. Create a GitHub repository (your choice of name/visibility) and push `main`.
4. In Netlify, connect that GitHub repo to the **existing** `kapu-preview` site (Site settings → Build & deploy → Link repository) rather than creating a new site, so `https://kapu-preview.netlify.app` stays the same URL.
5. From then on: local change → commit → push → Netlify auto-builds and deploys `main` → same preview URL reflects it.

I have not created, initialized, or connected anything — this is staged as a recommendation only, per your explicit instruction.
