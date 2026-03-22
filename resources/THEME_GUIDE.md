# Theme Development Guide

This guide covers how to create and customize themes for MCSR Pace Widget.

Each theme is a folder in `theme/{theme-name}/` containing:

- `timeline.css` — Timeline widget styles (see [Timeline Reference](THEME_GUIDE_TIMELINE.md))
- `indicator.css` — Visual Timeline widget styles (see [Visual Timeline Reference](THEME_GUIDE_VISUAL_TIMELINE.md))
- `segment.css` — Segment widget styles (see [Segment Reference](THEME_GUIDE_SEGMENT.md))
- `setting.json` — Labels and display options
- `icon/` — Split icon images

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

Place icon images in `theme/{theme-name}/icon/`. The file name must match the split type:

```
icon/enter_nether.png
icon/enter_bastion.png
icon/enter_fortress.png
icon/first_portal.png
icon/enter_stronghold.png
icon/enter_end.png
icon/credits.png
```

## CSS Reference

- [Timeline CSS Reference](THEME_GUIDE_TIMELINE.md) — HTML structure, data attributes, CSS variables for `timeline.css`
- [Visual Timeline CSS Reference](THEME_GUIDE_VISUAL_TIMELINE.md) — HTML structure, data attributes, CSS variables for `indicator.css`
- [Segment CSS Reference](THEME_GUIDE_SEGMENT.md) — HTML structure, data attributes, CSS variables for `segment.css`
