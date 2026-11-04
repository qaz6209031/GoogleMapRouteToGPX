---
name: MapsToGPX
description: Paste a Google Maps route, get the same route back as a GPX file, overprinted on a cycle map sheet.
colors:
  route: "#d4246f"
  route-deep: "#a8174f"
  land: "#e9efe1"
  wood: "#c9dcb8"
  wood-edge: "#a9c79a"
  contour: "#b5835a"
  water: "#3d86bf"
  grid: "#8aa08a"
  closure: "#b3261e"
  paper: "#f7f9f3"
  field: "#ffffff"
  ink: "#1d2422"
  ink-soft: "#4d5a53"
typography:
  display:
    fontFamily: "Barlow Condensed, Hiragino Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6.2vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Barlow Condensed, Hiragino Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 2.875rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "0.005em"
  title:
    fontFamily: "Barlow Condensed, Hiragino Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.02em"
  figure:
    fontFamily: "Barlow Condensed, Hiragino Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  button:
    fontFamily: "Barlow Condensed, Hiragino Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    letterSpacing: "0.06em"
  label:
    fontFamily: "Barlow Condensed, Hiragino Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    letterSpacing: "0.1em"
  lead:
    fontFamily: "Barlow, Hiragino Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Barlow, Hiragino Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
  small:
    fontFamily: "Barlow, Hiragino Sans, Noto Sans JP, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.375
rounded:
  none: "0px"
spacing:
  sheet-margin-sm: "10px"
  sheet-margin: "28px"
  panel-x: "20px"
  panel-y: "20px"
  section-x: "40px"
  section-x-lg: "56px"
  section-y: "80px"
  section-y-lg: "112px"
  sheet-grid: "172px"
  sheet-max: "88rem"
components:
  button-primary:
    backgroundColor: "{colors.route}"
    textColor: "{colors.field}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.route-deep}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.land}"
  input-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  legend-box:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel-y}"
  map-key:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  alert-closure:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
---

# Design System: MapsToGPX

## Overview

**Creative North Star: "The Cycle Map Sheet"**

The page is one printed cycling map, unfolded edge to edge. A pale paper margin with a black neatline frames the screen, sheet grid letters run along the top margin, the sheet title sits in the bottom margin, and two fold creases cross the face. Inside the neatline the land tint floods everything: woodland patches, brown contour linework, one unnamed blue stream. The user's route is the only thing overprinted in magenta. Panels are legend boxes printed on the sheet, never floating cards. Copy sits in clearings where the contours part around it.

The world is calm, legible and handmade rather than flashy or corporate. It reads like a tool a cyclist already trusts (a printed map and its key), not a SaaS landing page. The craft lives in the map conventions: the key, the start ring and finish flag, the km ticks, the scale bar, and the conversion running as named stations. Density is moderate. One working action sits in the first viewport, and everything else is set as the sheet's legend, itinerary and corrections panel.

Scope: the home page (`/`, `/id`, `/es`, `/ja`) carries this world. The FAQ and privacy pages have not adopted it yet and still render the previous look (Geist on `#fafafa`). Don't take tokens from them.

**Key Characteristics:**
- Map paper margin, ink neatline, land-tint face with a 172px printed grid and two fold creases.
- Generated decorative ground (woodland, contours, one stream) that clears behind copy.
- Magenta reserved for the route and for the actions that make or carry the route.
- Square legend boxes with a 1.5px ink rule; circles only as map symbols.
- Condensed caps map lettering for display, labels and controls, with a plain humanist sans for reading.
- One authored motion: the route draws itself, then its start, finish and ticks appear.

## Colors

The palette is a printed map's ink set: soft greens and browns for the ground, near-black ink for structure, and one saturated magenta overprint.

### Primary
- **Overprint Magenta** (route): the route stroke, the route line in every key, the primary buttons (Convert, Download, Send), the focus ring, the caret, the second headline line, the "To" in the wordmark, link underlines and hover text, filled rating stars, and the via-point dot. White on it measures 4.9:1. On the land tint it measures 4.2:1, so set magenta text on the land tint only at display sizes.
- **Deep Overprint** (route-deep): hover and busy state of magenta buttons (7.2:1 with white).

### Secondary
- **Land Tint** (land): the map face behind everything inside the neatline. It's also the hover fill for outlined buttons, as if the control were pressed into the ground.
- **Woodland** (wood) with **Woodland Edge** (wood-edge): irregular woodland patches on the full ground only, outlined at 1.5px.
- **Contour Brown** (contour): contour linework at 72% opacity. Every fifth ring is an index contour (1.7px against 0.9px).
- **Stream Blue** (water): the one unnamed decorative stream (5px, 80% opacity). Its only job is to carry the water colour.
- **Grid Green** (grid): the printed sheet grid, mixed to 32% over land.

### Tertiary
- **Closure Red** (closure): failure only. It colours the failed station, the closure symbol and the 1.5px border of error panels. It always appears with a symbol and words.

### Neutral
- **Map Paper** (paper): the sheet margin, the header and footer strips, legend boxes, the map key, and fills inside symbols.
- **Writing Field** (field): white wells you write into (URL input, feedback fields) and error panels, so editable surfaces read as blank paper set into the legend.
- **Map Ink** (ink): text, neatline, panel rules, the start ring and finish flag (13.5:1 on land).
- **Soft Ink** (ink-soft): secondary copy, placeholders, pending stations and hint text (6.2:1 on land, 6.8:1 on paper).

### Named Rules
**The One Overprint Rule.** Magenta means the route, or an action that makes, carries or sends it. Don't use it for decoration, section tints or illustration fills.

**The Never Colour Alone Rule.** Every state pairs its colour with a symbol and words: a ring, tick or closure bar next to each station, a closure symbol on errors, and a warning triangle on route warnings.

## Typography

**Display Font:** Barlow Condensed (with Hiragino Sans, Noto Sans JP, system-ui)
**Body Font:** Barlow (with the same fallbacks)

**Character:** Barlow Condensed in heavy caps is the map's lettering, compact and confident like place names and key labels on a printed sheet. Barlow is the plain reading voice beside it, of the same family, so the pairing never fights.

### Hierarchy
- **Display** (800, clamp(2.75rem → 4.75rem), 0.9, uppercase): the page headline only. Its second line is set in magenta. In Japanese it drops to clamp(2.125rem → 3.5rem) at 1.15 line height.
- **Headline** (800, clamp(2rem → 2.875rem), 0.95, uppercase): section titles (legend, itinerary, corrections).
- **Title** (700, 24px itinerary steps and 20px legend rows, uppercase, 0.02em): item titles inside sections.
- **Figure** (700, 30px, 1, tabular numerals): distance and waypoint readouts after conversion.
- **Button** (700, 19px, 0.06em, uppercase): primary actions. Secondary actions use 600 at 16px with 0.08em tracking.
- **Label** (600, 13–15px, 0.1–0.16em, uppercase): nav, stations, key entries, field labels, the trust strip and stat labels. Legend box titles take the widest tracking (0.16em). Sheet grid letters and the bottom-margin title are 12px.
- **Lead** (400, 18–19px, 1.625): the hero subtitle, max 46ch. The promise line under it is 600 at 17px.
- **Body** (400, 15–16px, 1.625, ink-soft): section copy, 38–62ch.
- **Small** (400, 12–14px): warnings, the map caption, the footer tagline and hints.

### Named Rules
**The Lettering and Reading Rule.** Caps condensed lettering names things (headlines, labels, controls). Anything a person reads as a sentence is in Barlow, in sentence case.

**The Japanese Cut Rule.** Japanese has no condensed cut. Under `lang="ja"`, lettering falls back to the platform gothic and caps tracking collapses to 0.02em. Don't fake condensing with transforms.

## Layout

The page is one framed sheet. A paper margin (10px on mobile, 28px from 640px) surrounds a neatline-bordered face. The 28px top and bottom margins carry the grid letters A–H and the sheet title from 640px up. Content inside sits at a max width of 88rem, with horizontal padding of 16 / 40 / 56px (mobile / 640px / 1024px). Sections breathe at 80px vertical, 112px from 1024px.

First viewport, from 1024px: a two-column grid, a 35rem-max left column (headline block, then the legend-box converter) and a fluid route map on the right (min 30rem tall) with its map key pinned top-right. Below 1024px, the map stacks under the legend box at 20–26rem tall and the key drops below it. Fold creases appear only from 1024px, at one-third and two-thirds of the sheet width.

The ground clears on the text side. In the hero the mask opens from 34–50% of the width on desktop and 46–62% of the height on mobile. Lower ground is a quieter, flipped variant (no woodland, lighter lines) that clears behind left-hand copy, or clears from the top where copy stacks above it. The itinerary section sits on plain land with no ground, because its copy spans every column.

Header and footer are paper strips with a 1.5px ink rule. The header is sticky at 56px.

## Elevation & Depth

The sheet is flat print. There are no drop shadows. Depth comes from print layering: the land tint under woodland, under contours, under the paper-haloed route overprint, with legend boxes printed flat on top. The fold creases are the only dimensional cue, a 28px light-and-shade gradient (4.5% black to 35% white) that reads as paper folded, not as a raised surface.

### Shadow Vocabulary
- **Station pulse** (`box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-route) 22%, transparent)`, pulsing over 1.2s): only on the active station ring while a conversion is running. It's removed under reduced motion.

### Named Rules
**The Printed Flat Rule.** Surfaces don't lift. A panel is a legend box printed on the sheet, separated by its ink rule, never by a shadow or blur.

## Shapes

Corners are square everywhere (0px): legend boxes, fields, buttons, the map key, error panels and the header and footer strips. Structure is drawn with a 1.5px ink rule. Internal dividers are the same rule at 25–30% ink, and the donation block alone is set off by a dashed 50% ink rule. Circles appear only as map symbols: station rings, the start ring, the tick disc on the feedback confirmation, and via-point dots.

Map symbols share one stroke family: 1.75 on a 24 grid with round caps and joins. Ink draws structure and magenta draws anything that is the route. Feature symbols on a 40 grid follow map-key conventions (open gate, road classes, head unit, town, junction).

## Components

### Buttons
Printed controls: heavy caps, square, no decoration beyond colour.
- **Shape:** square (0px), 48px tall (40px for donation links, 44px for the feedback-sent reset).
- **Primary:** magenta fill, white button lettering, 24px horizontal padding. Download carries the download symbol.
- **Hover / Focus:** background shifts to deep overprint through a colour transition. Focus is a 2px magenta outline offset 2px. The busy state keeps the deep fill with a wait cursor and swaps the label ("Converting…").
- **Secondary:** paper or transparent with a 1.5px ink border and 16px semibold caps. Hover fills with land tint. Used for New, Send more, and the Venmo and PayPal links (which keep their brand-coloured marks).

### Inputs / Fields
- **Style:** a white writing field with a 1.5px ink border and square corners. The URL input sits in a white well with 6px inset padding, with the magenta Convert button inside it (side by side from 640px, stacked on mobile).
- **Focus:** the well or field takes the 2px magenta outline at 2px offset. The inner input shows no outline of its own.
- **Error / Disabled:** errors appear below as a white panel with a 1.5px closure-red border, the closure symbol, and the message in ink. A disabled input drops to 60% opacity.
- **Labels:** caps lettering labels, with sentence-case soft-ink hints inline ("optional").

### Legend Box (signature)
The converter's container. It's a paper panel with a 1.5px ink rule and a title strip (caps label at 0.16em with a magenta route-line swatch at right) over a 16–20px body. Under the field are the **stations**, three named steps (link resolved, route traced, track ready). Each step shows an outlined ring when pending, a magenta-ringed paper ring that pulses when active, an ink disc with a paper tick when done, and a closure symbol with closure-red text when failed. A live region announces each step. On success the field gives way to a tick headline, a two-cell figure readout between ink rules, warnings with the warning triangle, the Download and New buttons, and only then the donation note below a dashed rule.

### Route Map Overprint (signature)
An 800×600 SVG fitted to its column. The route is a 6px magenta stroke over a 13px paper halo, with round caps. Paper km tick dots are spaced evenly along it, it opens with a paper-filled ink start ring and ends with an ink finish flag. Idle, it shows a sample route with no scale bar. Converted, the real track replaces it and gains a computed four-cell ink and paper scale bar. The **map key** is a paper box with a 1.5px rule listing route, start and finish symbols in caps label. After conversion it adds a caption saying the terrain is decorative.
- **Motion:** the stroke draws over 1.6s (`cubic-bezier(0.16, 1, 0.3, 1)`, 0.1s delay). Ticks, flag and scale bar fade in over 0.5s from 1.3s. Under reduced motion the route is shown already drawn.

### Map Ground (signature)
The decorative ground is generated deterministically at render time. Four woodland patches and four hills of irregular contour rings, plus one stream, sit in a 1440×900 SVG that slices to cover. The full variant sits under the hero and the quiet variant (flipped, no wood, 55% opacity) under lower sections. It carries no labels.

### Navigation
- **Header:** a paper strip with the wordmark (site mark, then "MapsTo**GPX**" in 800 caps with "To" in magenta) and anchor links in caps label (13px / 0.08em on mobile, 15px / 0.12em from 640px). Hover turns the text magenta with a 2px magenta underline offset 4px.
- **Language switcher (sheet tone):** caps label links in soft ink, separated by middle dots. The current locale is ink with the magenta underline.

### Legend Rows and Itinerary
Feature rows are a symbol column, a caps title and soft-ink body, divided by 25% ink rules inside one paper legend box. The itinerary is three steps on a 6px magenta route bar (vertical on mobile, horizontal from 768px), marked start ring, via dot and finish flag.

### Trust Strip
A paper strip under the hero with caps labels at 0.14em, each led by a 6px square magenta bullet.

## Do's and Don'ts

### Do:
- **Do** keep everything inside the neatline on the land tint, with the generated ground clearing behind copy (masks in globals.css).
- **Do** build panels as legend boxes: paper fill, 1.5px ink rule, square corners, a caps title strip when the panel has a name.
- **Do** reserve magenta for the route and route actions (The One Overprint Rule), and pair every state colour with a symbol and words.
- **Do** draw new symbols in the shared stroke family (1.75 on 24, round caps, ink structure, magenta route) and inline them as SVG.
- **Do** set names and controls in Barlow Condensed caps and sentences in Barlow, and honour the Japanese tracking override.
- **Do** show the route already drawn under `prefers-reduced-motion`, and keep the route draw as the page's only authored motion.

### Don't:
- **Don't** float white cards with shadows over the sheet. Depth is print layering and fold creases only (The Printed Flat Rule).
- **Don't** put place names, water names or contour heights on the decorative ground, or a scale bar on the idle sample route. The user's real route is overprinted there, so invented geography or distance would read as real.
- **Don't** round panel corners. Circles are for map symbols only.
- **Don't** add gradient headlines, glow or flashy motion. The world must not feel flashy, big-company SaaS, too technical or impersonal.
- **Don't** add an announcement banner, or show donation prompts anywhere except after a successful conversion.
- **Don't** move the converter out of the first viewport.
