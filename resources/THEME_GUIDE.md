# Theme Development Guide

This guide covers how to create and customize themes for MCSR Pace Widget.

Each theme is a folder in `theme/{theme-name}/` containing:

- `timeline.css` — Timeline widget styles (see [Timeline Reference](THEME_GUIDE_TIMELINE.md))
- `indicator.css` — Visual Timeline widget styles (see [Visual Timeline Reference](THEME_GUIDE_VISUAL_TIMELINE.md))
- `segment.css` — Segment widget styles (see [Segment Reference](THEME_GUIDE_SEGMENT.md))
- `setting.json` — Labels and display options
- `icon/` — Split icon images (optional; prefer a shared icon set, see [Icons](#icons))

Include only the CSS files your theme supports. The server detects supported widgets by the presence of each CSS file.

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
