---
name: Restock
description: The household list pad, kept for you. A canary pad on a fridge door, written in one ballpoint blue.
colors:
  enamel: "#eef1ef"
  enamel-2: "#e2e7e4"
  white: "#fbfcfb"
  pad: "#f4d35e"
  pad-under: "#efcd57"
  pad-edge: "#e5c24a"
  ink: "#1f3a8a"
  ink-2: "#33498f"
  ink-3: "#4f629c"
  rule: "#a7bad9"
  pencil: "#59606b"
  magnet: "#c8372d"
  magnet-ink: "#a52a22"
  demo: "#1c2130"
  demo-2: "#272d3f"
  demo-ink: "#e8ebf2"
  demo-ink-2: "#b4bbcc"
typography:
  calm:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  decision:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.015em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "-0.015em"
    fontFeature: "tnum"
  sentence:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 560
    lineHeight: 1.6
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  wordmark:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 750
    lineHeight: 1.45
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 560
    lineHeight: 1.45
    fontFeature: "tnum"
  body:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
  small:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
  fine:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
rounded:
  torn: "2px"
  base: "6px"
  panel: "10px"
  pill: "999px"
spacing:
  hairline: "2px"
  xs: "8px"
  sm: "12px"
  md: "20px"
  sheet-x: "22px"
  lg: "28px"
  zone: "36px"
components:
  answer:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.base}"
    padding: "10px 16px"
    height: "48px"
  answer-primary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.base}"
    padding: "10px 16px"
    height: "48px"
  pad-sheet:
    backgroundColor: "{colors.pad}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "30px 22px 22px"
  magnet:
    backgroundColor: "{colors.magnet}"
    rounded: "{rounded.pill}"
    size: "26px"
  notice:
    backgroundColor: "{colors.white}"
    textColor: "{colors.magnet-ink}"
    rounded: "{rounded.base}"
    padding: "26px 22px 20px"
  link-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: "44px"
    padding: "0 4px"
  flag-pill:
    backgroundColor: "{colors.pad}"
    textColor: "{colors.ink}"
    typography: "{typography.fine}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  rule-blank:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.sentence}"
    padding: "0 3px"
  rule-blank-focus:
    backgroundColor: "{colors.pad}"
    textColor: "{colors.ink}"
  toggle-chip-on:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.sentence}"
    padding: "0 2px"
  toggle-chip-off:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    typography: "{typography.sentence}"
    padding: "0 2px"
  switch:
    backgroundColor: "transparent"
    rounded: "{rounded.pill}"
    width: "40px"
    height: "24px"
  switch-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.pad}"
    rounded: "{rounded.pill}"
  lock-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "20px 18px"
  demo-button:
    backgroundColor: "{colors.demo-2}"
    textColor: "{colors.demo-ink}"
    rounded: "{rounded.base}"
    padding: "0 14px"
    height: "44px"
  demo-button-strong:
    backgroundColor: "{colors.demo-ink}"
    textColor: "{colors.demo}"
    rounded: "{rounded.base}"
    padding: "0 14px"
    height: "44px"
  demo-panel:
    backgroundColor: "{colors.demo}"
    textColor: "{colors.demo-ink}"
    rounded: "{rounded.panel}"
    padding: "22px 18px"
---

# Design System: Restock

## Overview

**Creative North Star: "The Fridge List Pad"**

Restock is a canary list pad stuck to a cool enamel fridge door by a single red magnet, written on in one ballpoint blue. The normal state is a blank ruled sheet that says everything is stocked; when a decision needs the household, it arrives as one sheet on top of the pad, already worked out, with outlined answers to tick. Answering tears that sheet off along its perforation and reveals whatever sits beneath. Everything below the pad (the pantry, what was handled) is written straight onto the enamel in the same ink, on pale-blue rule lines.

The world is quiet and physical rather than app-like. It uses one grotesk, one ink family, one paper colour and one warning red, and it draws information instead of colour-coding it: supply is the rule line itself, laid down in ink at a density and weight that rise as an item runs low. Handled things get a pencil strike-through, like a real list. The system refuses the delivery-app grid (product thumbnails, green buy buttons) and the chat window; there are no avatars, bubbles, cards-in-a-grid, or imagery.

A separate dark material, the demo layer, sits outside the fridge entirely. It is where evaluators skip time and try to break the agent, and it must never be read as part of the product.

**Key Characteristics:**
- Cool fridge-enamel ground; canary pad sheets with a mask-cut perforated top edge, offset under-sheets, and a flat red magnet disc.
- Ballpoint blue is the only ink, in three strengths.
- Supply drawn as rule-line gauges: one ink, five densities, weights 1/2/3px rising with urgency.
- Pencil-grey strike-through for bought items; magnet red only for blocked and never states.
- One self-hosted variable grotesk (Hanken Grotesk) with tabular figures everywhere.
- Answers are outlined buttons, recommended first at a heavier stroke.
- Rules are written as sentences with underlined blanks and strike-through toggles.
- Signature motion: the tear-off.

## Colors

A cool enamel ground, one warm canary paper, one blue ink family, a graphite pencil and a single red; the demo layer is a separate dark navy material.

### Primary
- **Ballpoint Blue** (ink): all primary text, answer outlines, gauge ink, focus rings, switch fill, caret. The product's only ink.
- **Faded Ballpoint** (ink-2): secondary text: reasons, dates, counts, sub-lines, fine print. Meets 5.4:1 or better on both enamel and the pad.
- **Dry Ballpoint** (ink-3): tertiary text only: timestamps in the handled log and crossed-out toggle chips. 5.2:1 on enamel; do not use it smaller than 13px or on the pad.

### Secondary
- **Canary Pad** (pad): the top sheet of the pad, the "Needs you" flag pill in the pantry, the focused rule blank, the switch knob when on, and text selection. Canary means "this wants a decision"; it is never a decorative fill.
- **Pad Under-sheet** (pad-under) and **Pad Edge** (pad-edge): the one or two sheets offset beneath the top sheet. Slightly deeper each layer down so the stack reads as paper thickness.

### Tertiary
- **Magnet Red** (magnet): the round magnet disc that holds the pad and the rules-off notice. It is an object, not a signal colour; it appears only as that disc.
- **Magnet Ink** (magnet-ink): text for blocked and never states: blocked lines in the handled log (with the amount struck through) and the heading of the rules-off notice.

### Neutral
- **Fridge Enamel** (enamel): the page ground, the browser theme colour, and the scrollbar track.
- **Enamel Seam** (enamel-2): hairline dividers between handled lines.
- **Enamel White** (white): the rare raised surface that is not paper: the rules-off notice and the spend-lock card.
- **Rule Blue** (rule): pale-blue rule lines under each gauge and each rule sentence, link underlines at rest, scrollbar thumb.
- **Pencil** (pencil): titles and amounts of bought items in the handled log, and their strike-through (at 70% opacity).

### Demo material
- **Demo Navy** (demo), **Demo Navy Raised** (demo-2), **Demo Chalk** (demo-ink), **Demo Chalk Faded** (demo-ink-2): the fixed demo bar on phones and the sticky demo panel on desktop. Chalk-on-navy, inverted selection, chalk focus rings.

### Named Rules
**The One Ink Rule.** Every mark the product makes is ballpoint blue at one of three strengths, or pencil for what is done. No second hue ever carries text or data.

**The Magnet Rule.** Red appears in exactly two forms: the magnet disc that holds a sheet, and magnet-ink text for blocked or never outcomes. If something is merely urgent, it gets heavier ink, not red.

**The Two Materials Rule.** The demo layer uses only the demo tokens and the product never uses them. A viewer must be able to tell at a glance which layer they are touching.

## Typography

**Display Font:** Hanken Grotesk Variable (self-hosted via Fontsource; falls back to ui-sans-serif, system-ui)
**Body Font:** the same family
**Label/Mono Font:** none; figures use tabular numerals from the same face

**Character:** one plain, slightly warm grotesk doing every job, the way one pen writes the whole list. Hierarchy comes from size and fine steps of variable weight (450 to 750), never from a second face. Tabular figures are set on the root so days, dollars and dates always align.

### Hierarchy
- **Calm** (700, 2rem, 1.1, -0.03em): "Everything's stocked." on the blank sheet. The largest type in the product, reserved for the calm state.
- **Decision** (650, 1.375rem, 1.25, -0.015em, balanced wrap): the ask on the top sheet.
- **Headline** (700, 1.25rem, -0.015em): section heads on the enamel ("Pantry", "Handled", "Your rules").
- **Sentence** (560, 1.25rem, 1.6, -0.01em): each rule, written as a sentence; blanks and chips inside it step up to 700.
- **Wordmark** (750, 1.125rem, -0.02em): "Restock" in the header. The rules-off notice heading uses the same size at 700.
- **Title** (560, 1rem): pantry item names, handled line titles (at 0.9375rem).
- **Body** (400 to 600, 0.9375rem): reasons, answer labels (600, primary 750), link buttons (600).
- **Small** (0.875rem): date line, budget line, counts beside section heads.
- **Fine** (0.8125rem): store sub-lines, "why" lines in the handled log, sheet meta, fine print under rule sentences, the "Needs you" pill (650).

### Named Rules
**The One Pen Rule.** One family, variable weight only. Emphasis is a weight step, never a new face, italic, or uppercase.

**The Tabular Rule.** Figures are tabular everywhere, set once on the root. Never turn it off for a component.

## Layout

A single phone column, max 440px, with 20px side gutters, set on the enamel with no page chrome. The pad sits 26px below the budget line; section heads open with 36px above and 12px below. Pantry rows are full-width buttons (12px top, 9px bottom padding) with the gauge directly under each row, so the rule line is both the row divider and the data. The handled log is a three-column grid (22px mark, flexible title, amount) with hairline enamel-seam dividers.

At 900px and wider the frame becomes two columns (440px app, 340px demo panel) centred with a 40px gap; the demo moves from a fixed bottom bar into a sticky side panel. The phone layout reserves 96px of bottom padding so the fixed demo bar never covers content, and the bar respects the safe-area inset.

Tap targets are at least 44px (link buttons, switches, demo buttons) and answers are 48px.

## Elevation & Depth

Depth is paper on a fridge, not UI layers. Only the things that physically stand off the enamel cast a shadow: the top pad sheet, the rules-off notice, the magnet, and the demo bar. Everything written directly on the enamel (pantry, handled log, rule sentences) is flat. The pad's thickness is shown by offset under-sheets (5px down and 3px right, then 10px down and 2px left), each a slightly deeper yellow, not by stacking shadows. Shadows are tinted with the ink blue so they read as cool light on enamel.

### Shadow Vocabulary
- **Paper lift** (`box-shadow: 0 1px 1px rgba(31, 58, 138, 0.08), 0 6px 18px -8px rgba(31, 58, 138, 0.28)`): the top pad sheet; the rules-off notice uses the same at 0.25.
- **Under-sheet contact** (`box-shadow: 0 1px 1px rgba(31, 58, 138, 0.08)`): the offset sheets beneath.
- **Magnet contact** (`box-shadow: 0 2px 4px -1px rgba(60, 20, 20, 0.3)`): the magnet disc, a small warm contact shadow.
- **Demo bar** (`box-shadow: 0 -8px 24px -12px rgba(15, 20, 35, 0.5)`): the fixed demo bar, casting upward.

### Named Rules
**The Paper-Only Lift Rule.** A surface casts a shadow only if it is a physical object on the fridge. Rows, sentences and log lines are ink on enamel and stay flat.

## Shapes

Soft, small corners throughout (6px). The pad sheet is 2px at the top and 6px at the bottom, because its top edge is a torn perforation: a CSS mask cuts a row of 2.5px-radius half-holes every 14px along the top 6px of the sheet. The magnet and the "Needs you" flag are full circles and pills. The switch is a pill with a round knob. The demo panel is the one larger radius (10px), which helps mark it as a different material.

Lines carry most of the form: 1px pale-blue rules under sentences and gauges, 1.5px ink outlines on answers and switches, 2px ink underlines on rule blanks and chips.

## Components

### Answer buttons
Outlined answers written in ink on the pad, like options to tick.
- **Shape:** gently rounded (6px), 48px minimum height, left-aligned label.
- **Default:** transparent fill, 1.5px ballpoint outline, 600 weight.
- **Recommended:** listed first, 2.5px outline and 750 weight. There is no filled button anywhere in the product.
- **Hover / Active:** an 8% ink wash on hover; pressed nudges down 1px. 160ms on the house ease-out.
- **Disabled:** 55% opacity while a sheet is tearing.

### Pad sheet (signature)
- **Material:** canary paper, 30px 22px 22px padding, perforated mask-cut top edge, paper-lift shadow, magnet disc centred 11px above the top edge.
- **Stack:** one or two offset under-sheets always sit beneath, so there is always a sheet to reveal.
- **Content:** the decision line, one reason in body text, 2 or 3 answers, and a fine-print count of sheets beneath when there are more.
- **Calm state:** the same sheet with "Everything's stocked." and the next reorder date, sitting on two ruled lines.
- **Tear-off:** answering tears the sheet off along its perforation over 300ms (a small lift and 1.6° tilt at 28%, then up and left to -9° while fading), revealing the real next sheet or the blank pad already rendered beneath. The pad then eases to its new height over 240ms so the pantry never jumps, and focus moves to the revealed heading. Under reduced motion the tear becomes a 140ms fade.

### Rule-line gauge (signature)
- **Form:** a 1px rule-blue line with the ink laid over it, scaled from the left with `transform: scaleX` (240ms ease-out). Never a coloured bar.
- **Supply encoding:** ink opacity in five densities (0.36, 0.5, 0.66, 0.82, 1.0) as supply falls through fifths of the item's interval; stroke weight 1px, 2px at 7 days or less, 3px at 3 days or less.
- **Budget:** the month's spend uses the same gauge at 2px, full ink, labelled for assistive tech.

### Links and navigation
- **Link button:** ink text at 600 with a 1.5px rule-blue underline offset 5px; the underline darkens to ink on hover. Used for "Rules", "Done" and "Show all". There is no nav bar; the rules screen is reached from the header and returns with "Done".

### Chips and flags
- **"Needs you" flag:** a canary pill (2px 8px) with fine 650 ink text, in the pantry row where days-left would sit.
- **Toggle chip (rules):** inline in a sentence. On: 700 ink with a 2px underline. Off: crossed out in dry ballpoint at 500 with a 1.5px strike. Tapping crosses the condition out of the sentence.

### Inputs
- **Rule blank:** a number written into a sentence on a 2px ink underline, bold, sized to its digits, no spinner. On focus the blank fills with canary instead of showing a ring.
- **Switch:** 40 by 24px pill with a 1.5px ink outline and ink knob; on, it fills with ink and the knob turns canary.

### Containers
- **Rules-off notice:** enamel-white card with the paper-lift shadow and a magnet disc, a magnet-ink heading, reason, and one recommended answer at full width.
- **Spend-lock card:** enamel-white, 6px corners, no shadow, a small lock icon beside its heading, the lock sentence with its own blank.

### Handled log
- **Line:** 16px line icon in faded ink, title, amount, then a fine "why" line with the date in dry ballpoint.
- **States:** bought is pencil with a pencil strike-through; ignored (a seller instruction set aside) and decided are ink; blocked is magnet-ink with the amount struck through.

### Demo layer
- **Material:** demo navy with chalk text, 0.875rem base. Phone: fixed bottom bar with a label, "Skip a week" and a strong "Try to break it" toggle that opens a drawer of attacks. Desktop: sticky side panel (10px corners, 22px 18px padding).
- **Buttons:** raised navy with a slate border; the strong variant is chalk-filled with navy text. Attack rows are full-width, highlight to raised navy on hover.

## Do's and Don'ts

### Do:
- **Do** write every mark in ballpoint blue (ink, ink-2, ink-3), with pencil reserved for bought, struck-through items.
- **Do** draw quantities as rule-line gauges using one ink, the five opacity densities and the 1/2/3px weights, animated with `transform: scaleX` only.
- **Do** put a decision on a canary sheet held by the magnet, with the recommended answer first at a 2.5px outline.
- **Do** write settings as sentences with underlined blanks and strike-through toggle chips.
- **Do** keep tabular figures on for every number.
- **Do** give every tear, height change and state transition a reduced-motion path (the tear becomes a 140ms fade).
- **Do** keep the demo layer on demo tokens only, visibly a different material.

### Don't:
- **Don't** colour-code supply or status (no green/amber/red scales); urgency is heavier and denser ink.
- **Don't** use magnet red for anything but the magnet disc and blocked or never outcomes.
- **Don't** introduce filled primary buttons, product thumbnails, a card grid, or green buy buttons.
- **Don't** add a chat window, message bubbles, or an assistant avatar.
- **Don't** add a second typeface, italics, or uppercase labels.
- **Don't** give flat, written-on-enamel content (rows, sentences, log lines) a shadow or a card.
- **Don't** let demo navy or chalk appear inside the product column, or product canary and ink inside the demo layer.
