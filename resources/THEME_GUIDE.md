# Theme Development Guide

This guide covers how to create and customize themes for MCSR Pace Widget.

Each theme is a folder in `theme/{theme-name}/` containing:

- `timeline.css` — Timeline widget styles (see [Timeline Reference](THEME_GUIDE_TIMELINE.md))
- `indicator.css` — Visual Timeline widget styles (see [Visual Timeline Reference](THEME_GUIDE_VISUAL_TIMELINE.md))
- `segment.css` — Segment widget styles (see [Segment Reference](THEME_GUIDE_SEGMENT.md))
- `setting.json` — Labels and display options
- `icon/` — Split icon images (optional; prefer a shared icon set, see [Icons](#icons))

Include only the CSS files your theme supports. The server detects supported widgets by the presence of each CSS file.

## Customizing Without Writing CSS

Most of what makes a theme look the way it does lives in the `:root` block at the top of its
CSS — colors, fonts, sizes, and which parts are shown. The [Playground](/playground) reads that
block and turns it into a form, so a theme can be adjusted without touching CSS at all.

Open the Playground, pick a base theme, change the fields, and copy the **Widget URL** it
generates. That URL is the whole customization:

```
http://127.0.0.1:1161/timeline?theme=default&icons=default&v=eyItLXRsLXRleHQtY29sb3IiOiIj...
```

`v` carries only the values that differ from the base theme, so it stays short — a handful of
changes is about 200-300 characters. The base theme's CSS is untouched, which means improvements
to it still reach anyone using a customized URL, and the customization travels as a single link
that can be pasted into OBS or shared.

The form is built from the CSS itself rather than from a fixed list, so a custom theme gets an
editor for free: any variable declared in its `:root` shows up. Comments are used as labels, so

```css
:root {
  /* base text color */
  --tl-text-color: rgba(255, 255, 255, 1);
}
```

appears as a color field named "base text color". A commented-out declaration is treated as an
available-but-unset option, and a variable used as `display: var(--x, table-cell)` becomes a
show/hide switch.

Images can be added from the editor. They are stored in `~/.config/MCSRPaceWidget/upload/`
and served from `/upload/<name>`, so a URL that points at one keeps working after an update.
The editor also offers the runner's own skin for the face.

What a URL still cannot carry is the files themselves — an uploaded image lives on the machine
that runs the widget, so a URL shared with someone else falls back to whatever their setup has.
Icons, textures and fonts likewise live in a theme directory or a [shared icon set](#icons).

Uploading writes to disk, so it is accepted only from the machine running the widget
(`127.0.0.1`). Reading is unchanged, so setups that run OBS on a second PC still work.

## Getting Started

1. Duplicate an existing theme folder (e.g. `theme/default`) and rename it
2. Edit `setting.json`, CSS files, and icons
3. Use the [Playground](/playground) to preview with various data patterns

## setting.json

```json
{
  "label": {
    "enter_nether": "Enter Nether",
    "enter_bastion": "Enter Bastion",
    "enter_fortress": "Enter Fortress",
    "first_portal": "First Portal",
    "enter_stronghold": "Enter Stronghold",
    "enter_end": "Enter End",
    "credits": "Finish"
  },
  "segmentLabel": {
    "enter_nether": ["Entered Nether", "Find a structure"],
    "credits": ["Complete", "GG", "New PB!!"]
  },
  "enteringDuration": 5000,
  "pbTimelineTitle": "PB Timeline",
  "paceTimelineTitle": "Current",
  "nextItemStyle": "hyphen"
}
```

| Field | Description |
|---|---|
| `label` | Display name for each split type (used by all widgets) |
| `segmentLabel` | Per-segment label arrays for Segment widget. Falls back to `label` if not defined |
| `enteringDuration` | Duration (ms) of `data-entering="true"` for Segment widget. Default: `5000` |
| `pbTimelineTitle` | Title shown above PB timeline (empty string = hidden) |
| `paceTimelineTitle` | Title shown above pace timeline (empty string = hidden) |
| `nextItemStyle` | How to show the next split: `"hyphen"` (--:--), `"random"` (animated), `"igt"` (current IGT) |
| `contextLabel` | Display name for each context marker type |

## Split Types

These are the event type identifiers used in class names, `setting.json`, and data:

| Type | Event |
|---|---|
| `enter_nether` | Entered the Nether |
| `enter_bastion` | Entered a Bastion |
| `enter_fortress` | Entered a Fortress |
| `first_portal` | First Portal (returned to Overworld) |
| `enter_stronghold` | Entered Stronghold |
| `enter_end` | Entered the End |
| `credits` | Finished (credits roll) |

## Context Marker Types

Points inside a segment rather than boundaries between them. They only appear on the
Visual Timeline, and only when the theme sets `--id-display-context` — see the
[Visual Timeline CSS Reference](THEME_GUIDE_VISUAL_TIMELINE.md).

| Type | Event |
|---|---|
| `obtain_iron_ingot` | Smelted the first iron |
| `obtain_iron_pickaxe` | Crafted an iron pickaxe |
| `obtain_lava_bucket` | Filled a lava bucket |
| `distract_piglin` | Distracted a piglin with gold |
| `loot_bastion` | Looted a bastion chest |
| `obtain_obsidian` | Obtained obsidian |
| `obtain_crying_obsidian` | Obtained crying obsidian |
| `obtain_blaze_rod` | Obtained a blaze rod |

They are keyed like split types, so `icons.json` and `--icon-{type}` work the same way.

## Icons

Split icons live in shared icon sets, outside of any theme, so several themes can use
the same artwork without each shipping its own copy:

```
icon/{set-name}/icons.json    split type -> image file in this directory
icon/{set-name}/*.png
```

Pick a set from your theme's `setting.json`:

```json
{
  "iconSet": "default"
}
```

Bundled sets: `default` and `paceman`. `GET /api/icons` lists every available set with its
mapping.

`icons.json` maps a split type to a file, so one image can serve several splits:

```json
{
  "name": "Default",
  "icons": {
    "enter_nether": "nether_portal.png",
    "first_portal": "nether_portal.png",
    "second_portal": "overworld.png",
    "enter_bastion": "bastion.png",
    "enter_fortress": "fortress.png",
    "enter_stronghold": "stronghold.png",
    "enter_end": "end.png",
    "credits": "credits.png"
  }
}
```

To add your own set, create `icon/{your-set}/` with an `icons.json` next to the images.
Put it in `~/.config/MCSRPaceWidget/icon/` so it survives updates.

### Theme-owned icons

A theme with no `iconSet` falls back to its own `theme/{theme-name}/icon/` directory,
where the file name must match the split type (`icon/enter_nether.png`, ...).
Themes made before icon sets existed keep working this way.

### Overriding a single icon

A theme (or a widget URL) can replace one icon without changing the whole set,
using a `--icon-{split type}` custom property:

```css
:root {
  --icon-credits: url(/icon/paceman/credits.png);
}
```

Use this instead of adding a near-duplicate set when a theme only needs a few different
images — a set is a choice the user has to make, so it should be worth making. The bundled
`stack-timeline` and `horizontal-timeline` themes do exactly this: they use the `default`
set and swap four icons for the `*-alt.png` variants that sit alongside it.

### Overriding the set from the widget URL

`?icons={set-name}` overrides whatever the theme selected — useful for trying artwork
without editing files:

```
http://127.0.0.1:1161/timeline?theme=default&icons=paceman
```

## CSS Reference

- [Timeline CSS Reference](THEME_GUIDE_TIMELINE.md) — HTML structure, data attributes, CSS variables for `timeline.css`
- [Visual Timeline CSS Reference](THEME_GUIDE_VISUAL_TIMELINE.md) — HTML structure, data attributes, CSS variables for `indicator.css`
- [Segment CSS Reference](THEME_GUIDE_SEGMENT.md) — HTML structure, data attributes, CSS variables for `segment.css`
