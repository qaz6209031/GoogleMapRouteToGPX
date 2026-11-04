---
version: 1
slug: "src-components-homepage-tsx"
primary_target: "src/components/HomePage.tsx"
related_targets: ["src/components/ConverterForm.tsx"]
---

# Home page (converter)

## Scope
Home page (`/` and its locale variants `/id`, `/es`, `/ja`), rendered by `src/components/HomePage.tsx` with `ConverterForm`, `FeedbackForm`, `DonateLinks`. Visitor mode: Persuade, with the converter as the working action in the first viewport. FAQ and privacy pages adopt the world in a later pass.

## Audience, job, action
Cyclists arriving with a Google Maps directions link already copied; they paste, convert, download, then load the GPX on a bike computer. Proof is the product itself: the converted route drawn back to them.

## Confirmed constraints (user, 2026-11-03)
- Converter stays in the first viewport.
- Announcement banner removed.
- Donate block appears only after a successful conversion, not as a page section.
- Must not feel: flashy or slow to use, big-company SaaS, too technical/hard, impersonal (it is a personal portfolio piece).

## Direction contract
THESIS: The page is one printed cycling map sheet unfolded; the route you paste is overprinted on it in magenta. It refuses the category default of a centered gradient headline over a URL card and a grid of icon tiles.
OWN-WORLD: Map-paper land tint flooding edge to edge, woodland patches, brown contour linework, blue water, a white sheet margin with a black neatline and grid letters, fold creases, and one magenta route overprint. Panels are legend boxes: paper fill, 1.5px ink rule, square corners. Type is condensed map lettering in caps for display and labels, a plain humanist sans for reading.
STORY: Visitors see at once that this turns their Google Maps route into a bike-computer file, paste in the legend box, watch named stations tick (link resolved, route traced, track ready), see their real track drawn over the sheet, download, and only then get the free-tool donation note.
FIRST VIEWPORT: Sheet margin and neatline frame the screen; header strip inside the top margin. Left column: a condensed caps headline about 76px, one-line subcopy, then the legend-box converter with input and magenta button. Right two-thirds: contour field with a labelled sample route from start ring to finish flag, map key bottom right, scale bar bottom left, sheet title in the bottom margin.
FORM: Cycle Map Sheet, candidate 7 of 7 on the ordered list (assigned by roll). seed:47e6fab245f0aeda
Raises: ground floods the sheet with no floating white cards (from yé-yé sleeve); contours part around text so copy sits in clearings (from Młoda Polska); conversion runs as named stations with real states (from darkroom); the route is one unbroken stroke start to finish (from hand-bent neon); the contour field is one generated ground, and reduced motion shows the route drawn rather than drawing (from shader portal); every state has words and map symbols, never color alone (from silk canopy).
Signature interaction: after conversion the decoded track replaces the sample and draws itself as the magenta overprint, fitted to the sheet, with start ring, finish flag and km ticks.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Contract amendments (finish review, round 1)
- Map key sits top-right on desktop, not bottom-right: after conversion the legend box grows and a bottom-right key fell below the fold.
- No scale bar on the idle sample route: a scale on illustrative terrain would state a false distance. The real route gets a computed scale bar.
- No place names, water names or contour heights on the ground: the user's real route is overprinted on it, so invented geography would read as real. One unnamed decorative stream carries the water colour; the route caption says the terrain is decorative.
- The headline block keeps the incumbent subtitle, the bold promise line and the analytics-backed 10K+ line (product copy, preserved in a redesign) rather than a single subcopy line.

## Unresolved
- FAQ and privacy pages still on the old look until a follow-up pass.
